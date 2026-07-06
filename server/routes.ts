import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { storage } from "./storage";
import { sendPasswordResetEmail, sendWelcomeEmail } from "./email";
import { insertCompanySchema } from "@shared/schema";
import { z } from "zod";

const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .email("E-mail inválido")
    .transform((v) => v.toLowerCase()),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d).+$/,
      "A senha deve conter pelo menos 1 letra e 1 número"
    ),
  name: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: "Você deve aceitar os Termos de Uso e a Política de Privacidade." }),
  }),
  marketingOptIn: z.boolean().optional().default(false),
});

// ─── Schema: PATCH /api/user — campos de branding ─────────────────────────────
const brandingField = (schema: z.ZodString) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? null : v),
    schema.nullable().optional(),
  );

const updateBrandingSchema = z.object({
  brandName:         brandingField(z.string().trim().max(100)),
  brandPhone:        brandingField(z.string().trim().max(30)),
  brandEmail:        brandingField(z.string().trim().max(100).email("E-mail de branding inválido")),
  brandWebsite:      brandingField(z.string().trim().max(150)),
  brandRegistration: brandingField(z.string().trim().max(50)),
});

// ─── Detecção de tipo de documento ────────────────────────────────────────────
function detectDocumentType(digits: string): {
  type: "individual" | "company";
  document_type: "CPF" | "CNPJ";
} {
  if (digits.length === 11) return { type: "individual", document_type: "CPF" };
  return { type: "company", document_type: "CNPJ" };
}

// ─── Schema: POST /api/subscriptions/create ───────────────────────────────────
const createSubscriptionSchema = z.object({
  plan: z.enum(["monthly", "annual"], {
    errorMap: () => ({ message: "Plano inválido. Use 'monthly' ou 'annual'" }),
  }),

  card_token: z
    .string()
    .trim()
    .min(1, "Token do cartão é obrigatório")
    .refine((v) => v.startsWith("token_"), {
      message: "Token do cartão inválido (formato esperado: token_...)",
    }),

  installments: z.coerce
    .number({ invalid_type_error: "Número de parcelas inválido" })
    .int("Número de parcelas deve ser inteiro")
    .min(1, "Mínimo 1 parcela")
    .max(12, "Máximo 12 parcelas")
    .default(1),

  holder_name: z
    .string()
    .trim()
    .min(2, "Nome do titular deve ter pelo menos 2 caracteres"),

  document: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length === 11 || v.length === 14, {
      message: "Documento inválido — informe CPF (11 dígitos) ou CNPJ (14 dígitos)",
    }),

  address: z.object({
    line_1: z.string().trim().min(1, "Endereço é obrigatório"),
    line_2: z.string().trim().optional(),
    zip_code: z
      .string()
      .trim()
      .transform((v) => v.replace(/\D/g, ""))
      .refine((v) => v.length === 8, { message: "CEP inválido — informe 8 dígitos" }),
    city: z.string().trim().min(1, "Cidade é obrigatória"),
    state: z
      .string()
      .trim()
      .length(2, "UF deve ter exatamente 2 letras")
      .transform((v) => v.toUpperCase()),
    country: z.string().default("BR"),
  }),

  phone: z.object({
    area_code: z
      .string()
      .trim()
      .transform((v) => v.replace(/\D/g, ""))
      .refine((v) => v.length === 2, { message: "DDD inválido — informe 2 dígitos" }),
    number: z
      .string()
      .trim()
      .transform((v) => v.replace(/\D/g, ""))
      .refine((v) => v.length === 8 || v.length === 9, {
        message: "Telefone inválido — informe 8 ou 9 dígitos",
      }),
  }),
}).transform((data) => ({
  ...data,
  installments: data.plan === "monthly" ? 1 : data.installments,
}));

// ─── Mapeamento status Pagar.me → enum do banco ───────────────────────────────
const PAGARME_STATUS_MAP: Record<string, 'active' | 'canceled' | 'past_due' | 'pending' | 'unpaid'> = {
  active:   'active',
  future:   'pending',
  canceled: 'canceled',
  inactive: 'canceled',
  expired:  'canceled',
  failed:   'unpaid',
};

function mapPagarmeStatus(
  pagarmeStatus: string
): 'active' | 'canceled' | 'past_due' | 'pending' | 'unpaid' {
  const mapped = PAGARME_STATUS_MAP[pagarmeStatus];
  if (!mapped) {
    console.warn(
      `[pagarme] status desconhecido recebido: "${pagarmeStatus}" — usando "pending" como fallback`
    );
    return 'pending';
  }
  return mapped;
}

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 60 minutes
const WELCOME_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h — primeiro acesso

function pagarmeAuthRequired(): boolean {
  return Boolean(process.env.PAGARME_WEBHOOK_USER && process.env.PAGARME_WEBHOOK_PASSWORD);
}

function checkPagarmeBasicAuth(header: unknown): boolean {
  const expectedUser = process.env.PAGARME_WEBHOOK_USER;
  const expectedPass = process.env.PAGARME_WEBHOOK_PASSWORD;
  if (!expectedUser || !expectedPass) return true;
  if (typeof header !== "string" || !header.toLowerCase().startsWith("basic ")) return false;
  try {
    const decoded = Buffer.from(header.slice(6).trim(), "base64").toString("utf-8");
    const idx = decoded.indexOf(":");
    if (idx < 0) return false;
    return decoded.slice(0, idx) === expectedUser && decoded.slice(idx + 1) === expectedPass;
  } catch {
    return false;
  }
}

function sanitizeHeaders(headers: Record<string, any>): Record<string, any> {
  const drop = new Set(["authorization", "cookie", "set-cookie"]);
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(headers)) {
    if (drop.has(k.toLowerCase())) continue;
    out[k] = v;
  }
  return out;
}

function pickNumberLikeAmount(value: unknown): string | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return (value / 100).toFixed(2);
  }
  if (typeof value === "string" && /^\d+$/.test(value)) {
    return (parseInt(value, 10) / 100).toFixed(2);
  }
  return null;
}

function extractPagarmeFields(eventType: string | null, data: any): {
  externalId: string | null;
  email: string | null;
  name: string | null;
  amount: string | null;
  paymentMethod: string | null;
} {
  if (!data || typeof data !== "object") {
    return { externalId: null, email: null, name: null, amount: null, paymentMethod: null };
  }

  // order.* → data = order object
  // charge.* → data = charge object (com customer + order)
  const customer = data.customer ?? data.order?.customer ?? null;
  const email = typeof customer?.email === "string" ? customer.email.toLowerCase().trim() : null;
  const name = typeof customer?.name === "string" ? customer.name.trim() : null;

  let externalId: string | null = null;
  if (eventType?.startsWith("order.")) {
    externalId = typeof data.id === "string" ? data.id : null;
  } else if (eventType?.startsWith("charge.")) {
    externalId = (typeof data.order?.id === "string" && data.order.id) || (typeof data.id === "string" ? data.id : null);
  } else {
    externalId = (typeof data.id === "string" ? data.id : null) || (typeof data.order?.id === "string" ? data.order.id : null);
  }

  const amountCents =
    data.amount ??
    data.paid_amount ??
    data.order?.amount ??
    data.charges?.[0]?.amount ??
    data.charges?.[0]?.paid_amount;
  const amount = pickNumberLikeAmount(amountCents);

  const paymentMethod =
    data.payment_method ??
    data.last_transaction?.payment_method ??
    data.charges?.[0]?.last_transaction?.payment_method ??
    data.charges?.[0]?.payment_method ??
    null;

  return {
    externalId,
    email,
    name,
    amount,
    paymentMethod: typeof paymentMethod === "string" ? paymentMethod : null,
  };
}

async function safeWebhookLog(entry: {
  source: string;
  eventType: string | null;
  status: string;
  httpStatus: number;
  ip: string;
  authOk: boolean;
  message: string;
  externalId: string | null;
  customerEmail: string | null;
  headers: Record<string, any>;
  payload: Record<string, any>;
}): Promise<void> {
  try {
    await storage.createWebhookLog({
      source: entry.source,
      eventType: entry.eventType ?? null,
      status: entry.status,
      httpStatus: entry.httpStatus,
      ip: entry.ip,
      authOk: entry.authOk,
      message: entry.message,
      externalId: entry.externalId ?? null,
      customerEmail: entry.customerEmail ?? null,
      headers: entry.headers,
      payload: entry.payload,
    });
  } catch (err: any) {
    console.error("[webhook] failed to persist log:", err?.message || err);
  }
}

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

// ─── Helper: mascarar campos sensíveis nos logs ───────────────────────────────
function maskSensitiveFields(body: any): any {
  if (!body || typeof body !== "object") return body;
  const SENSITIVE_KEYS = new Set([
    "document",
    "holder_document",
    "card_token",
    "token",
    "number",
    "cvv",
    "exp_month",
    "exp_year",
    "phones",
    "phone",
    "address",
    "billing_address",
  ]);
  const masked: any = Array.isArray(body) ? [] : {};
  for (const k of Object.keys(body)) {
    if (SENSITIVE_KEYS.has(k)) {
      masked[k] = "[MASKED]";
    } else if (body[k] && typeof body[k] === "object") {
      masked[k] = maskSensitiveFields(body[k]);
    } else {
      masked[k] = body[k];
    }
  }
  return masked;
}

// ─── Helper: fetch autenticado ao Pagar.me com timeout e log ─────────────────
async function pagarmeFetch(
  endpoint: string,
  options: RequestInit & { label?: string } = {}
): Promise<{ status: number; body: any }> {
  const key = process.env.PAGARME_SECRET_KEY;
  if (!key) throw new Error("PAGARME_SECRET_KEY não configurada");

  const auth = "Basic " + Buffer.from(key + ":").toString("base64");
  const label = options.label ?? endpoint;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000);

  const url = `https://api.pagar.me/core/v5${endpoint}`;
  const reqBody = options.body ?? null;

  const reqBodyParsed = reqBody ? JSON.parse(reqBody as string) : null;
  console.log(
    `[pagarme] → ${options.method ?? "GET"} ${endpoint}`,
    reqBodyParsed ? JSON.stringify(maskSensitiveFields(reqBodyParsed)) : ""
  );

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
        ...(options.headers ?? {}),
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    let body: any;
    try {
      body = await res.json();
    } catch {
      body = {};
    }
    console.log(
      `[pagarme] ← ${res.status} ${endpoint}`,
      JSON.stringify(maskSensitiveFields(body)).slice(0, 500)
    );
    return { status: res.status, body };
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      console.error(`[pagarme] TIMEOUT em ${label}`);
      throw new Error(`TIMEOUT_${label}`);
    }
    console.error(`[pagarme] NETWORK_ERROR em ${label}:`, err.message);
    throw new Error(`NETWORK_ERROR_${label}`);
  }
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Não autenticado" });
  }
  next();
}

async function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Não autenticado" });
  }
  const user = await storage.getUserById(req.session.userId);
  if (!user || user.role !== "super_admin") {
    return res.status(403).json({ message: "Acesso restrito ao super administrador" });
  }
  next();
}

async function confirmAdminPassword(userId: string, password: unknown): Promise<boolean> {
  if (typeof password !== "string" || !password) return false;
  const admin = await storage.getUserById(userId);
  if (!admin) return false;
  return bcrypt.compare(password, admin.passwordHash);
}

const ADMIN_KEY = process.env.ADMIN_KEY;
if (!ADMIN_KEY) {
  throw new Error("ADMIN_KEY não está definida nas variáveis de ambiente");
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.use(
    session({
      secret: (() => {
        const s = process.env.SESSION_SECRET;
        if (!s) throw new Error("SESSION_SECRET não está definida nas variáveis de ambiente");
        return s;
      })(),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
      },
    })
  );

  app.post("/api/auth/register", async (req, res) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        const errors = parsed.error.errors.map((e) => e.message);
        return res.status(400).json({ message: "Dados inválidos", errors });
      }
      const { email, password, name, marketingOptIn } = parsed.data;

      const existing = await storage.getUserByEmail(email);
      if (existing) {
        return res.status(409).json({
          message: "Este e-mail já está cadastrado. Faça login ou recupere sua senha.",
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await storage.createUser({
        email,
        passwordHash,
        ...(name ? { name } : {}),
        termsAcceptedAt: new Date(),
        termsVersion: "1.0",
        marketingOptIn: marketingOptIn ?? false,
        ...(marketingOptIn ? { marketingOptInAt: new Date() } : {}),
      });

      req.session.userId = newUser.id;

      return res.status(201).json({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name ?? null,
        role: newUser.role,
        plan: newUser.plan,
        diagnosesUsed: newUser.diagnosesUsed,
      });
    } catch (err: any) {
      console.error("[auth/register]", err);
      res.status(500).json({ message: "Erro interno ao criar conta. Tente novamente." });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "E-mail e senha são obrigatórios" });
      }

      const user = await storage.getUserByEmail(email.toLowerCase().trim());
      if (!user) {
        return res.status(401).json({ message: "E-mail ou senha incorretos" });
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ message: "E-mail ou senha incorretos" });
      }

      req.session.userId = user.id;
      res.json({ id: user.id, email: user.email, name: user.name ?? null, role: user.role, plan: user.plan, diagnosesUsed: user.diagnosesUsed, subscriptionStatus: user.subscriptionStatus ?? null, brandName: user.brandName ?? null, brandPhone: user.brandPhone ?? null, brandEmail: user.brandEmail ?? null, brandWebsite: user.brandWebsite ?? null, brandRegistration: user.brandRegistration ?? null });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Não autenticado" });
    }
    try {
      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        req.session.destroy(() => {});
        return res.status(401).json({ message: "Usuário não encontrado" });
      }
      res.json({ id: user.id, email: user.email, name: user.name ?? null, role: user.role, plan: user.plan, diagnosesUsed: user.diagnosesUsed, subscriptionStatus: user.subscriptionStatus ?? null, brandName: user.brandName ?? null, brandPhone: user.brandPhone ?? null, brandEmail: user.brandEmail ?? null, brandWebsite: user.brandWebsite ?? null, brandRegistration: user.brandRegistration ?? null });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.patch("/api/user", requireAuth, async (req, res) => {
    try {
      const { name, email, brandName, brandPhone, brandEmail: brandEmailField,
              brandWebsite, brandRegistration } = req.body;
      const updates: {
        name?: string; email?: string;
        brandName?: string | null; brandPhone?: string | null;
        brandEmail?: string | null; brandWebsite?: string | null;
        brandRegistration?: string | null;
      } = {};
      if (typeof name === "string") updates.name = name.trim();
      // Branding text fields (validated via Zod)
      const brandingParsed = updateBrandingSchema.safeParse({
        brandName, brandPhone, brandEmail: brandEmailField, brandWebsite, brandRegistration,
      });
      if (!brandingParsed.success) {
        return res.status(400).json({ message: brandingParsed.error.errors[0]?.message ?? "Dados de branding inválidos" });
      }
      Object.assign(updates, brandingParsed.data);
      if (typeof email === "string") {
        const emailLower = email.toLowerCase().trim();
        const existing = await storage.getUserByEmail(emailLower);
        if (existing && existing.id !== req.session.userId) {
          return res.status(409).json({ message: "E-mail já está em uso por outro usuário" });
        }
        updates.email = emailLower;
      }
      const user = await storage.updateUser(req.session.userId!, updates);
      if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
      res.json({
        id: user.id,
        email: user.email,
        name: user.name ?? null,
        brandName: user.brandName ?? null,
        brandPhone: user.brandPhone ?? null,
        brandEmail: user.brandEmail ?? null,
        brandWebsite: user.brandWebsite ?? null,
        brandRegistration: user.brandRegistration ?? null,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ── Branding: logo (carga sob demanda) ─────────────────────────────────────
  const LOGO_VALID_PREFIXES = ["data:image/png;base64,", "data:image/jpeg;base64,"];
  const LOGO_MAX_CHARS = 716_800; // ~700KB Base64 ≈ 500KB imagem real

  app.post("/api/user/branding/logo", requireAuth, async (req, res) => {
    try {
      const { logo } = req.body;
      if (typeof logo !== "string") {
        return res.status(400).json({ message: "Campo 'logo' (data URL Base64) é obrigatório" });
      }
      if (!LOGO_VALID_PREFIXES.some((p) => logo.startsWith(p))) {
        return res.status(400).json({
          message: "Formato inválido. Envie PNG ou JPEG como data URL (data:image/png;base64,… ou data:image/jpeg;base64,…)",
        });
      }
      if (logo.length > LOGO_MAX_CHARS) {
        return res.status(413).json({
          message: "Imagem muito grande. O tamanho máximo é 500 KB. Reduza a resolução e tente novamente.",
        });
      }
      await storage.updateUser(req.session.userId!, { brandLogo: logo });
      return res.json({ ok: true });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/user/branding/logo", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUserById(req.session.userId!);
      if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
      return res.json({ logo: user.brandLogo ?? null });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.delete("/api/user/branding/logo", requireAuth, async (req, res) => {
    try {
      await storage.updateUser(req.session.userId!, { brandLogo: null });
      return res.json({ ok: true });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/user/change-password", requireAuth, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Senha atual e nova senha são obrigatórias" });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "A nova senha deve ter pelo menos 8 caracteres" });
      }
      const user = await storage.getUserById(req.session.userId!);
      if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) return res.status(400).json({ message: "Senha atual incorreta" });
      const newHash = await bcrypt.hash(newPassword, 10);
      await storage.updateUser(req.session.userId!, { passwordHash: newHash });
      res.json({ message: "Senha alterada com sucesso" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {});
    res.json({ message: "Logout realizado com sucesso" });
  });

  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body ?? {};
      if (typeof email !== "string" || !email.trim()) {
        return res.status(400).json({ message: "E-mail é obrigatório" });
      }
      const normalized = email.toLowerCase().trim();
      const user = await storage.getUserByEmail(normalized);
      if (user) {
        const token = randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
        await storage.setResetToken(user.id, token, expiresAt);
        try {
          await sendPasswordResetEmail({ to: user.email, userName: user.name ?? null, token });
        } catch (mailErr: any) {
          console.error("[forgot-password] failed to send email:", mailErr?.message || mailErr);
          return res.status(500).json({ message: "Não foi possível enviar o e-mail agora. Tente em instantes." });
        }
      }
      res.json({ message: "Se o e-mail estiver cadastrado, enviamos as instruções de redefinição." });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/webhook/pagarme", async (req, res) => {
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
    const payload = (req.body && typeof req.body === "object") ? req.body : {};
    const headers = sanitizeHeaders(req.headers);
    const eventType = typeof payload.type === "string" ? payload.type : null;
    const data = (payload && typeof payload.data === "object" && payload.data) ? payload.data : {};

    const extracted = extractPagarmeFields(eventType, data);
    const externalId = extracted.externalId;
    const customerEmail = extracted.email;

    const logBase = {
      source: "pagarme",
      eventType,
      ip,
      headers,
      payload,
      externalId,
      customerEmail,
    } as const;

    const authOk = checkPagarmeBasicAuth(req.headers["authorization"]);
    if (!authOk && pagarmeAuthRequired()) {
      console.warn(`[webhook/pagarme] auth failed from ${ip} — event=${eventType}`);
      await safeWebhookLog({
        ...logBase,
        status: "auth_failed",
        httpStatus: 401,
        authOk: false,
        message: "Basic Auth inválido ou ausente",
      });
      return res.status(401).json({ message: "Não autorizado" });
    }

    const PROCESS_EVENTS = new Set([
      "order.paid",
      "charge.paid",
      "subscription.canceled",
      "charge.payment_failed",
    ]);
    if (!eventType || !PROCESS_EVENTS.has(eventType)) {
      await safeWebhookLog({
        ...logBase,
        status: "ignored",
        httpStatus: 200,
        authOk,
        message: eventType ? `Evento ignorado: ${eventType}` : "Sem campo 'type' no payload",
      });
      return res.status(200).json({ ok: true, ignored: true, event: eventType });
    }

    if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      console.warn(`[webhook/pagarme] no valid email — event=${eventType} ip=${ip}`);
      await safeWebhookLog({
        ...logBase,
        status: "error",
        httpStatus: 400,
        authOk,
        message: `E-mail do cliente não encontrado/válido no payload (event=${eventType})`,
      });
      return res.status(400).json({ message: "E-mail do cliente não encontrado no payload" });
    }

    if (externalId) {
      const already = await storage.hasWebhookLogWithExternalId("pagarme", externalId);
      if (already) {
        console.log(`[webhook/pagarme] duplicate — externalId=${externalId} event=${eventType}`);
        await safeWebhookLog({
          ...logBase,
          status: "duplicate",
          httpStatus: 200,
          authOk,
          message: `Evento já processado anteriormente para ${externalId}`,
        });
        return res.status(200).json({ ok: true, duplicate: true });
      }
    }

    // ── Roteamento: eventos de assinatura ────────────────────────────────────
    // Aceita todos os casings/caminhos que o Pagar.me pode enviar no payload
    const subIdFromCharge =
      typeof data.invoice?.subscription_id   === "string" ? data.invoice.subscription_id  :
      typeof data.invoice?.subscriptionId    === "string" ? data.invoice.subscriptionId   :
      typeof data.subscription?.id           === "string" ? data.subscription.id           :
      typeof data.subscriptionId             === "string" ? data.subscriptionId            :
      typeof data.subscription_id            === "string" ? data.subscription_id           :
      null;

    // Fallback para CASO 3b: charge.paid de assinatura sem campo subscription no payload
    const metaUserId =
      typeof data.metadata?.user_id === "string" ? data.metadata.user_id : null;

    // CASO 1: subscription.canceled
    if (eventType === "subscription.canceled") {
      const subscriptionId = typeof data.id === "string" ? data.id : null;
      if (!subscriptionId) {
        await safeWebhookLog({ ...logBase, status: "error", httpStatus: 200, authOk,
          message: "subscription.canceled sem data.id" });
        return res.status(200).json({ ok: true });
      }
      const subUser = await storage.getUserByPagarmeSubscriptionId(subscriptionId);
      if (!subUser) {
        await safeWebhookLog({ ...logBase, status: "ignored", httpStatus: 200, authOk,
          message: `Nenhum usuário com subscription ${subscriptionId}` });
        return res.status(200).json({ ok: true, ignored: true });
      }
      await storage.updateUser(subUser.id, { subscriptionStatus: "canceled" });
      console.log(`[webhook/pagarme] subscription.canceled — sub=${subscriptionId} user=${subUser.email}`);
      await safeWebhookLog({ ...logBase, status: "processed", httpStatus: 200, authOk,
        message: `Assinatura ${subscriptionId} cancelada para usuário ${subUser.email}` });
      return res.status(200).json({ ok: true });
    }

    // CASO 2: charge.payment_failed
    if (eventType === "charge.payment_failed") {
      if (!subIdFromCharge) {
        await safeWebhookLog({ ...logBase, status: "ignored", httpStatus: 200, authOk,
          message: "charge.payment_failed sem vínculo com assinatura" });
        return res.status(200).json({ ok: true, ignored: true });
      }
      const subUser = await storage.getUserByPagarmeSubscriptionId(subIdFromCharge);
      if (!subUser) {
        await safeWebhookLog({ ...logBase, status: "ignored", httpStatus: 200, authOk,
          message: `Nenhum usuário com subscription ${subIdFromCharge}` });
        return res.status(200).json({ ok: true, ignored: true });
      }
      await storage.updateUser(subUser.id, { subscriptionStatus: "past_due" });
      console.log(`[webhook/pagarme] charge.payment_failed — sub=${subIdFromCharge} user=${subUser.email}`);
      await safeWebhookLog({ ...logBase, status: "processed", httpStatus: 200, authOk,
        message: `Renovação falhou para assinatura ${subIdFromCharge}, usuário ${subUser.email} marcado past_due` });
      return res.status(200).json({ ok: true });
    }

    // CASO 3: charge.paid de assinatura (renovação ou 1ª cobrança redundante)
    if (eventType === "charge.paid" && subIdFromCharge) {
      const subUser = await storage.getUserByPagarmeSubscriptionId(subIdFromCharge);
      if (!subUser) {
        await safeWebhookLog({ ...logBase, status: "ignored", httpStatus: 200, authOk,
          message: `Nenhum usuário com subscription ${subIdFromCharge} — webhook pode ter chegado antes da rota síncrona` });
        return res.status(200).json({ ok: true, ignored: true });
      }
      const cycle: number | string = data.invoice?.cycle?.cycle ?? "?";
      await storage.updateUser(subUser.id, { subscriptionStatus: "active" });
      console.log(`[webhook/pagarme] charge.paid (sub) — sub=${subIdFromCharge} user=${subUser.email} cycle=${cycle}`);
      await safeWebhookLog({ ...logBase, status: "processed", httpStatus: 200, authOk,
        message: `Cobrança de assinatura ${subIdFromCharge} confirmada para ${subUser.email}, ciclo ${cycle}` });
      return res.status(200).json({ ok: true });
    }

    // CASO 3b: charge.paid de assinatura — sem subscriptionId no payload, mas
    // metadata.user_id presente e recurrence_cycle confirma que é cobrança de assinatura
    if (eventType === "charge.paid" && !subIdFromCharge && metaUserId && typeof data.recurrence_cycle === "string") {
      const subUser = await storage.getUserById(metaUserId);
      if (!subUser || !subUser.pagarmeSubscriptionId) {
        await safeWebhookLog({ ...logBase, status: "ignored", httpStatus: 200, authOk,
          message: "charge.paid via metadata.user_id — usuário sem pagarmeSubscriptionId" });
        return res.status(200).json({ ok: true, ignored: true });
      }
      const cycle = data.recurrence_cycle as string;
      await storage.updateUser(subUser.id, { subscriptionStatus: "active" });
      console.log(`[webhook/pagarme] charge.paid (3b/meta) — user=${subUser.email} cycle=${cycle}`);
      await safeWebhookLog({ ...logBase, status: "processed", httpStatus: 200, authOk,
        message: `Cobrança de assinatura confirmada via metadata.user_id para ${subUser.email}, ciclo ${cycle}` });
      return res.status(200).json({ ok: true });
    }

    // CASO 4: order.paid / charge.paid SEM subscriptionId → fluxo legado ↓

    try {
      let user = await storage.getUserByEmail(customerEmail);
      let created = false;
      if (!user) {
        const passwordHash = await bcrypt.hash(randomBytes(24).toString("hex"), 10);
        user = await storage.createUser({
          email: customerEmail,
          passwordHash,
          name: extracted.name ?? undefined,
        });
        created = true;
      } else if (extracted.name && !user.name) {
        await storage.updateUser(user.id, { name: extracted.name });
        user = { ...user, name: extracted.name };
      }

      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + WELCOME_TOKEN_TTL_MS);
      await storage.setResetToken(user.id, token, expiresAt);

      await sendWelcomeEmail({
        to: user.email,
        userName: user.name ?? extracted.name ?? null,
        token,
        order: {
          orderId: extracted.externalId,
          amount: extracted.amount,
          paymentMethod: extracted.paymentMethod,
        },
      });

      console.log(`[webhook/pagarme] processed — event=${eventType} email=${customerEmail} created=${created} externalId=${externalId}`);
      await safeWebhookLog({
        ...logBase,
        status: "processed",
        httpStatus: 200,
        authOk,
        message: created ? "Usuário criado e e-mail de boas-vindas enviado" : "Usuário já existia — novo link de acesso enviado",
      });
      return res.status(200).json({ ok: true, created, user_id: user.id });
    } catch (err: any) {
      console.error(`[webhook/pagarme] error — event=${eventType} ip=${ip}:`, err?.message || err);
      await safeWebhookLog({
        ...logBase,
        status: "error",
        httpStatus: 500,
        authOk,
        message: err?.message || "Erro ao processar webhook",
      });
      return res.status(500).json({ message: err?.message || "Erro ao processar webhook" });
    }
  });

  app.post("/api/webhook/new-user", async (req, res) => {
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
    try {
      const payload = req.body ?? {};
      const email = typeof payload.email === "string" ? payload.email.toLowerCase().trim() : "";
      const name = typeof payload.name === "string" ? payload.name.trim() : null;
      const initialPassword = typeof payload.senha === "string" && payload.senha.length >= 6 ? payload.senha : null;
      const orderId = typeof payload.order_id === "string" ? payload.order_id.trim() || null : null;
      const amount = typeof payload.amount === "string" ? payload.amount.trim() || null : null;
      const paymentMethod = typeof payload.payment_method === "string" ? payload.payment_method.trim() || null : null;

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        console.warn(`[webhook/new-user] invalid email from ${ip}:`, email);
        return res.status(400).json({ message: "Campo 'email' obrigatório e válido" });
      }

      console.log(`[webhook/new-user] incoming from ${ip} — email=${email}, order_id=${orderId}`);

      let user = await storage.getUserByEmail(email);
      let created = false;
      if (!user) {
        const passwordSeed = initialPassword ?? randomBytes(24).toString("hex");
        const passwordHash = await bcrypt.hash(passwordSeed, 10);
        user = await storage.createUser({ email, passwordHash, name: name ?? undefined });
        created = true;
      } else if (name && !user.name) {
        await storage.updateUser(user.id, { name });
        user = { ...user, name };
      }

      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + WELCOME_TOKEN_TTL_MS);
      await storage.setResetToken(user.id, token, expiresAt);

      try {
        await sendWelcomeEmail({
          to: user.email,
          userName: user.name ?? name,
          token,
          order: { orderId, amount, paymentMethod },
        });
      } catch (mailErr: any) {
        console.error(`[webhook/new-user] email failed for ${email}:`, mailErr?.message || mailErr);
        return res.status(500).json({
          message: "Usuário processado, mas falha ao enviar e-mail de boas-vindas",
          created,
          user_id: user.id,
          emailed: false,
        });
      }

      res.status(created ? 201 : 200).json({
        message: created ? "Usuário criado e e-mail enviado" : "Usuário já existia — novo link de acesso enviado",
        created,
        user_id: user.id,
        email: user.email,
        emailed: true,
      });
    } catch (err: any) {
      console.error(`[webhook/new-user] unexpected error from ${ip}:`, err?.message || err);
      res.status(500).json({ message: err.message || "Erro ao processar webhook" });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body ?? {};
      if (typeof token !== "string" || !token.trim()) {
        return res.status(400).json({ message: "Token inválido" });
      }
      if (typeof newPassword !== "string" || newPassword.length < 8) {
        return res.status(400).json({ message: "A nova senha deve ter pelo menos 8 caracteres" });
      }
      const user = await storage.getUserByResetToken(token.trim());
      if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt.getTime() < Date.now()) {
        return res.status(400).json({ message: "Link inválido ou expirado. Solicite um novo." });
      }
      const newHash = await bcrypt.hash(newPassword, 10);
      await storage.updateUser(user.id, { passwordHash: newHash });
      await storage.clearResetToken(user.id);
      res.json({ message: "Senha redefinida com sucesso. Faça login com a nova senha." });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/admin/create-user", async (req, res) => {
    try {
      const { email, password, adminKey } = req.body;
      if (adminKey !== ADMIN_KEY) {
        return res.status(403).json({ message: "Acesso negado" });
      }
      if (!email || !password) {
        return res.status(400).json({ message: "E-mail e senha são obrigatórios" });
      }

      const existing = await storage.getUserByEmail(email.toLowerCase().trim());
      if (existing) {
        return res.status(409).json({ message: "E-mail já cadastrado" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        email: email.toLowerCase().trim(),
        passwordHash,
      });
      res.status(201).json({ id: user.id, email: user.email });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/admin/users", requireSuperAdmin, async (_req, res) => {
    try {
      const users = await storage.listAllUsers();
      res.json(users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name ?? null,
        role: u.role,
        createdAt: u.createdAt,
      })));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/admin/users", requireSuperAdmin, async (req, res) => {
    try {
      const { email, password, name, role, sendInvite } = req.body ?? {};
      if (typeof email !== "string" || !email.trim()) {
        return res.status(400).json({ message: "E-mail é obrigatório" });
      }
      const emailLower = email.toLowerCase().trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLower)) {
        return res.status(400).json({ message: "E-mail inválido" });
      }
      const finalRole = role === "super_admin" ? "super_admin" : "user";
      const wantsInvite = sendInvite !== false; // default: envia convite por e-mail
      const hasManualPassword = typeof password === "string" && password.length > 0;
      if (!wantsInvite && !hasManualPassword) {
        return res.status(400).json({ message: "Defina uma senha ou ative o envio do convite por e-mail" });
      }
      if (hasManualPassword && password.length < 8) {
        return res.status(400).json({ message: "A senha deve ter pelo menos 8 caracteres" });
      }
      const existing = await storage.getUserByEmail(emailLower);
      if (existing) {
        return res.status(409).json({ message: "E-mail já cadastrado" });
      }
      const finalName = typeof name === "string" && name.trim() ? name.trim() : null;
      const passwordSeed = hasManualPassword ? password : randomBytes(24).toString("hex");
      const passwordHash = await bcrypt.hash(passwordSeed, 10);
      const user = await storage.createUser({
        email: emailLower,
        passwordHash,
        name: finalName ?? undefined,
        role: finalRole,
      });

      let emailed = false;
      let emailError: string | null = null;
      if (wantsInvite) {
        try {
          const token = randomBytes(32).toString("hex");
          const expiresAt = new Date(Date.now() + WELCOME_TOKEN_TTL_MS);
          await storage.setResetToken(user.id, token, expiresAt);
          await sendWelcomeEmail({
            to: user.email,
            userName: user.name ?? finalName,
            token,
          });
          emailed = true;
        } catch (mailErr: any) {
          emailError = mailErr?.message || String(mailErr);
          console.error(`[admin/users] welcome email failed for ${emailLower}:`, emailError);
        }
      }

      const httpStatus = wantsInvite && !emailed ? 207 : 201;
      res.status(httpStatus).json({
        id: user.id,
        email: user.email,
        name: user.name ?? null,
        role: user.role,
        createdAt: user.createdAt,
        emailed,
        emailError,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/admin/users/:id/resend-invite", requireSuperAdmin, async (req, res) => {
    try {
      const user = await storage.getUserById(req.params.id);
      if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + WELCOME_TOKEN_TTL_MS);
      await storage.setResetToken(user.id, token, expiresAt);
      try {
        await sendWelcomeEmail({
          to: user.email,
          userName: user.name ?? null,
          token,
        });
      } catch (mailErr: any) {
        console.error(`[admin/users] resend invite email failed for ${user.email}:`, mailErr?.message || mailErr);
        return res.status(502).json({
          message: "Falha ao enviar e-mail de convite. Verifique a configuração do SMTP.",
          emailed: false,
        });
      }
      res.json({
        message: "Convite reenviado com sucesso",
        email: user.email,
        emailed: true,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/admin/companies", requireSuperAdmin, async (_req, res) => {
    try {
      const [companiesList, usersList] = await Promise.all([
        storage.listAllCompanies(),
        storage.listAllUsers(),
      ]);
      const userMap = new Map(usersList.map((u) => [u.id, u]));
      res.json(companiesList.map((c) => {
        const owner = c.userId ? userMap.get(c.userId) : undefined;
        return {
          id: c.id,
          companyName: c.companyName,
          cnpj: c.cnpj,
          sector: c.sector,
          regime: c.regime,
          riskScore: c.riskScore,
          createdAt: c.createdAt,
          ownerEmail: owner?.email ?? null,
          ownerName: owner?.name ?? null,
        };
      }));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/admin/email-logs", requireSuperAdmin, async (req, res) => {
    try {
      const limitParam = parseInt(String(req.query.limit ?? "200"), 10);
      const limit = Number.isFinite(limitParam) && limitParam > 0 && limitParam <= 1000 ? limitParam : 200;
      const logs = await storage.listEmailLogs(limit);
      res.json(logs);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/admin/webhook-logs", requireSuperAdmin, async (req, res) => {
    try {
      const limitParam = parseInt(String(req.query.limit ?? "200"), 10);
      const limit = Number.isFinite(limitParam) && limitParam > 0 && limitParam <= 1000 ? limitParam : 200;
      const source = typeof req.query.source === "string" && req.query.source.trim() ? req.query.source.trim() : undefined;
      const logs = await storage.listWebhookLogs(limit, source);
      res.json(logs);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/admin/companies/:id", requireSuperAdmin, async (req, res) => {
    try {
      const company = await storage.getCompany(req.params.id);
      if (!company) return res.status(404).json({ message: "Diagnóstico não encontrado" });
      const [checklist, tasks] = await Promise.all([
        storage.getChecklistByCompany(company.id),
        storage.getTasksByCompany(company.id),
      ]);
      const owner = company.userId ? await storage.getUserById(company.userId) : undefined;
      res.json({
        company,
        checklist,
        tasks,
        owner: owner ? { id: owner.id, email: owner.email, name: owner.name ?? null, role: owner.role } : null,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.patch("/api/admin/users/:id/role", requireSuperAdmin, async (req, res) => {
    try {
      const { role, password } = req.body ?? {};
      if (role !== "user" && role !== "super_admin") {
        return res.status(400).json({ message: "Role inválido" });
      }
      if (req.params.id === req.session.userId && role !== "super_admin") {
        return res.status(400).json({ message: "Você não pode rebaixar a si mesmo" });
      }
      const ok = await confirmAdminPassword(req.session.userId!, password);
      if (!ok) {
        return res.status(401).json({ message: "Senha do administrador incorreta" });
      }
      const updated = await storage.updateUserRole(req.params.id, role);
      if (!updated) return res.status(404).json({ message: "Usuário não encontrado" });
      res.json({ id: updated.id, email: updated.email, role: updated.role });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.delete("/api/admin/users/:id", requireSuperAdmin, async (req, res) => {
    try {
      const { password } = req.body ?? {};
      if (req.params.id === req.session.userId) {
        return res.status(400).json({ message: "Você não pode excluir a si mesmo" });
      }
      const ok = await confirmAdminPassword(req.session.userId!, password);
      if (!ok) {
        return res.status(401).json({ message: "Senha do administrador incorreta" });
      }
      const target = await storage.getUserById(req.params.id);
      if (!target) return res.status(404).json({ message: "Usuário não encontrado" });
      await storage.deleteUser(req.params.id);
      res.json({ deleted: true, id: req.params.id, email: target.email });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/admin/users/:id", requireSuperAdmin, async (req, res) => {
    try {
      const user = await storage.getUserById(req.params.id);
      if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
      const companies = await storage.getCompaniesByUser(user.id);
      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name ?? null,
          phone: user.phone ?? null,
          role: user.role,
          createdAt: user.createdAt,
          termsAcceptedAt: user.termsAcceptedAt ?? null,
          termsVersion: user.termsVersion ?? null,
          marketingOptIn: user.marketingOptIn ?? false,
          marketingOptInAt: user.marketingOptInAt ?? null,
        },
        companies: companies.map((c) => ({
          id: c.id,
          companyName: c.companyName,
          cnpj: c.cnpj,
          sector: c.sector,
          regime: c.regime,
          riskScore: c.riskScore,
          createdAt: c.createdAt,
        })),
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Editar nome / e-mail / telefone (super-admin)
  app.patch("/api/admin/users/:id/profile", requireSuperAdmin, async (req, res) => {
    try {
      const { name, email, phone } = req.body ?? {};
      const target = await storage.getUserById(req.params.id);
      if (!target) return res.status(404).json({ message: "Usuário não encontrado" });

      const updates: { name?: string | null; email?: string; phone?: string | null } = {};

      if (name !== undefined) {
        if (name === null || name === "") {
          updates.name = null;
        } else if (typeof name === "string") {
          updates.name = name.trim();
        } else {
          return res.status(400).json({ message: "Nome inválido" });
        }
      }

      if (email !== undefined) {
        if (typeof email !== "string") {
          return res.status(400).json({ message: "E-mail inválido" });
        }
        const emailLower = email.toLowerCase().trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLower)) {
          return res.status(400).json({ message: "E-mail inválido" });
        }
        if (emailLower !== target.email) {
          const collision = await storage.getUserByEmail(emailLower);
          if (collision && collision.id !== target.id) {
            return res.status(409).json({ message: "E-mail já está em uso por outro usuário" });
          }
          updates.email = emailLower;
        }
      }

      if (phone !== undefined) {
        if (phone === null || phone === "") {
          updates.phone = null;
        } else if (typeof phone === "string") {
          updates.phone = phone.trim();
        } else {
          return res.status(400).json({ message: "Telefone inválido" });
        }
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "Nenhum dado para atualizar" });
      }

      const updated = await storage.updateUser(target.id, updates);
      if (!updated) return res.status(404).json({ message: "Usuário não encontrado" });
      res.json({
        id: updated.id,
        email: updated.email,
        name: updated.name ?? null,
        phone: updated.phone ?? null,
        role: updated.role,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Definir nova senha manualmente (super-admin) — exige senha do próprio admin
  app.post("/api/admin/users/:id/set-password", requireSuperAdmin, async (req, res) => {
    try {
      const { newPassword, adminPassword } = req.body ?? {};
      if (typeof newPassword !== "string" || newPassword.length < 8) {
        return res.status(400).json({ message: "A nova senha deve ter pelo menos 8 caracteres" });
      }
      const ok = await confirmAdminPassword(req.session.userId!, adminPassword);
      if (!ok) {
        return res.status(401).json({ message: "Senha do administrador incorreta" });
      }
      const target = await storage.getUserById(req.params.id);
      if (!target) return res.status(404).json({ message: "Usuário não encontrado" });
      const passwordHash = await bcrypt.hash(newPassword, 10);
      await storage.updateUser(target.id, { passwordHash });
      // invalida token de reset pendente, se houver
      try { await storage.clearResetToken(target.id); } catch { /* opcional */ }
      res.json({ message: "Nova senha definida com sucesso", email: target.email });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/my/companies", requireAuth, async (req, res) => {
    try {
      const companies = await storage.getCompaniesByUser(req.session.userId!);
      res.json(companies);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/companies", requireAuth, async (req, res) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (currentUser && currentUser.plan === "trial" && currentUser.diagnosesUsed >= 1) {
        return res.status(402).json({
          message: "Você já usou seu diagnóstico gratuito. Para gerar mais, assine um de nossos planos.",
          code: "TRIAL_QUOTA_EXCEEDED",
        });
      }

      const parsed = insertCompanySchema.safeParse({ ...req.body, userId: req.session.userId });
      if (!parsed.success) {
        return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten() });
      }
      const company = await storage.createCompany(parsed.data);

      try {
        await storage.incrementDiagnosesUsed(req.session.userId!);
      } catch (incErr) {
        console.error("[companies] incrementDiagnosesUsed failed (non-fatal):", incErr);
      }

      res.status(201).json(company);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/companies/:id", requireAuth, async (req, res) => {
    try {
      const company = await storage.getCompany(req.params.id);
      if (!company) return res.status(404).json({ message: "Empresa não encontrada" });
      if (company.userId && company.userId !== req.session.userId) {
        return res.status(403).json({ message: "Acesso negado" });
      }
      res.json(company);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.patch("/api/companies/:id", requireAuth, async (req, res) => {
    try {
      const existing = await storage.getCompany(req.params.id);
      if (!existing) return res.status(404).json({ message: "Empresa não encontrada" });
      if (existing.userId && existing.userId !== req.session.userId) {
        return res.status(403).json({ message: "Acesso negado" });
      }
      const parsed = insertCompanySchema.partial().safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten() });
      }
      const company = await storage.updateCompany(req.params.id, parsed.data);
      if (!company) return res.status(404).json({ message: "Empresa não encontrada" });
      res.json(company);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.delete("/api/companies/:id", requireAuth, async (req, res) => {
    try {
      const company = await storage.getCompany(req.params.id);
      if (!company) return res.status(404).json({ message: "Empresa não encontrada" });
      if (company.userId && company.userId !== req.session.userId) {
        return res.status(403).json({ message: "Acesso negado" });
      }
      await storage.deleteCompany(req.params.id);
      res.status(204).end();
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/companies/:id/checklist", requireAuth, async (req, res) => {
    try {
      const company = await storage.getCompany(req.params.id);
      if (!company) return res.status(404).json({ message: "Empresa não encontrada" });
      if (company.userId && company.userId !== req.session.userId) {
        return res.status(403).json({ message: "Acesso negado" });
      }
      const items = await storage.getChecklistByCompany(req.params.id);
      res.json(items);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.put("/api/companies/:id/checklist", requireAuth, async (req, res) => {
    try {
      const company = await storage.getCompany(req.params.id);
      if (!company) return res.status(404).json({ message: "Empresa não encontrada" });
      if (company.userId && company.userId !== req.session.userId) {
        return res.status(403).json({ message: "Acesso negado" });
      }
      const items = await storage.upsertChecklist(req.params.id, req.body.items || []);
      res.json(items);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.patch("/api/checklist/:id", requireAuth, async (req, res) => {
    try {
      const item = await storage.updateChecklistItem(req.params.id, req.body.status);
      if (!item) return res.status(404).json({ message: "Item não encontrado" });
      res.json(item);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/companies/:id/tasks", requireAuth, async (req, res) => {
    try {
      const company = await storage.getCompany(req.params.id);
      if (!company) return res.status(404).json({ message: "Empresa não encontrada" });
      if (company.userId && company.userId !== req.session.userId) {
        return res.status(403).json({ message: "Acesso negado" });
      }
      const tasks = await storage.getTasksByCompany(req.params.id);
      res.json(tasks);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.put("/api/companies/:id/tasks", requireAuth, async (req, res) => {
    try {
      const company = await storage.getCompany(req.params.id);
      if (!company) return res.status(404).json({ message: "Empresa não encontrada" });
      if (company.userId && company.userId !== req.session.userId) {
        return res.status(403).json({ message: "Acesso negado" });
      }
      const tasks = await storage.upsertTasks(req.params.id, req.body.tasks || []);
      res.json(tasks);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.patch("/api/tasks/:id", requireAuth, async (req, res) => {
    try {
      const task = await storage.updateTask(req.params.id, req.body.completed);
      if (!task) return res.status(404).json({ message: "Tarefa não encontrada" });
      res.json(task);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ─── POST /api/subscriptions/create ────────────────────────────────────────
  app.post("/api/subscriptions/create", requireAuth, async (req, res) => {
    // 1. Validação do body
    const parsed = createSubscriptionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Dados inválidos",
        errors: parsed.error.flatten().fieldErrors,
      });
    }
    const { plan, card_token, installments, holder_name, document, address, phone } = parsed.data;

    // 2. Buscar usuário
    const user = await storage.getUserById(req.session.userId!);
    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    // 3. Idempotência: assinatura ativa já existe
    if (user.pagarmeSubscriptionId && user.subscriptionStatus === "active") {
      return res.status(409).json({
        message: "Você já possui uma assinatura ativa",
        plan: user.plan,
        subscriptionStatus: user.subscriptionStatus,
      });
    }

    // 4. Resolver plan_id
    const planId =
      plan === "monthly"
        ? process.env.PAGARME_PLAN_ID_MONTHLY
        : process.env.PAGARME_PLAN_ID_ANNUAL;
    if (!planId) {
      console.error(`[subscriptions/create] PAGARME_PLAN_ID_${plan.toUpperCase()} não configurado`);
      return res.status(500).json({ message: "Erro de configuração interno. Tente novamente mais tarde." });
    }

    const { type: customerType, document_type } = detectDocumentType(document);

    try {
      // 5. Chamada 1: criar ou reusar Customer
      let customerId = user.pagarmeCustomerId ?? null;

      if (!customerId) {
        const custRes = await pagarmeFetch("/customers", {
          method: "POST",
          label: "criar-customer",
          body: JSON.stringify({
            name: user.name || holder_name,
            email: user.email,
            document,
            document_type,
            type: customerType,
            phones: {
              mobile_phone: {
                country_code: "55",
                area_code: phone.area_code,
                number: phone.number,
              },
            },
            address: {
              line_1: address.line_1,
              line_2: address.line_2 ?? "",
              zip_code: address.zip_code,
              city: address.city,
              state: address.state,
              country: address.country,
            },
          }),
        });

        if (custRes.status !== 200 && custRes.status !== 201) {
          console.error("[subscriptions/create] Falha ao criar customer:", custRes.body);
          return res.status(502).json({
            message: "Não foi possível registrar seus dados de pagamento. Tente novamente.",
          });
        }

        customerId = custRes.body.id as string;

        // Salvar customer_id antes da subscription (para reuso em tentativas futuras)
        await storage.updateUser(user.id, { pagarmeCustomerId: customerId });
      }

      // 6. Chamada 2: salvar cartão → obter card_id
      const cardRes = await pagarmeFetch(`/customers/${customerId}/cards`, {
        method: "POST",
        label: "salvar-cartao",
        body: JSON.stringify({
          token: card_token,
          holder_name,
          holder_document: document,
          billing_address: {
            line_1: address.line_1,
            line_2: address.line_2 ?? "",
            zip_code: address.zip_code,
            city: address.city,
            state: address.state,
            country: address.country,
          },
        }),
      });

      if (cardRes.status !== 200 && cardRes.status !== 201) {
        console.error("[subscriptions/create] Falha ao salvar cartão:", cardRes.body);
        return res.status(502).json({
          message: "Não foi possível salvar o cartão. Verifique os dados e tente novamente.",
        });
      }

      const cardId = cardRes.body.id as string;

      // 7. Chamada 3: criar Subscription
      const subRes = await pagarmeFetch("/subscriptions", {
        method: "POST",
        label: "criar-subscription",
        body: JSON.stringify({
          plan_id: planId,
          customer_id: customerId,
          payment_method: "credit_card",
          card_id: cardId,
          installments,
          statement_descriptor: "REFORMAEMACAO",
          metadata: {
            user_id: user.id,
            plan_slug: plan,
          },
        }),
      });

      if (subRes.status !== 200 && subRes.status !== 201) {
        console.error("[subscriptions/create] Falha ao criar subscription:", subRes.body);
        return res.status(502).json({
          message: "Não foi possível criar a assinatura. Tente novamente.",
        });
      }

      const subscription = subRes.body;
      const subscriptionId = subscription.id as string;
      const pagarmeStatus: string = subscription.status ?? "unknown";

      // 8. Verificar status da primeira cobrança
      const firstCharge = Array.isArray(subscription.charges) ? subscription.charges[0] : null;
      const chargeStatus: string = firstCharge?.status ?? "unknown";

      const chargeFailed =
        chargeStatus === "failed" ||
        pagarmeStatus === "failed";

      if (chargeFailed) {
        const acquirerMsg: string =
          firstCharge?.last_transaction?.acquirer_message ?? "Pagamento recusado pela operadora";

        // Salvar customer_id (para próxima tentativa), mas NÃO atualizar plan
        await storage.updateUser(user.id, { pagarmeCustomerId: customerId });

        console.warn("[subscriptions/create] Cartão recusado:", {
          subscriptionId,
          pagarmeStatus,
          chargeStatus,
          acquirerMsg,
        });

        return res.status(402).json({
          message: `Pagamento recusado: ${acquirerMsg}`,
          code: "CARD_DECLINED",
        });
      }

      // 9. Sucesso: atualizar usuário no banco
      const mappedStatus = mapPagarmeStatus(pagarmeStatus);
      const newPlan: "monthly" | "annual" = plan;

      await storage.updateUser(user.id, {
        pagarmeCustomerId: customerId,
        pagarmeSubscriptionId: subscriptionId,
        subscriptionStatus: mappedStatus,
        plan: newPlan,
      });

      console.log(`[subscriptions/create] Assinatura criada com sucesso:`, {
        userId: user.id,
        subscriptionId,
        pagarmeStatus,
        mappedStatus,
        plan: newPlan,
      });

      return res.status(201).json({
        plan: newPlan,
        subscriptionStatus: mappedStatus,
        subscriptionId,
      });
    } catch (err: any) {
      if (err.message?.startsWith("TIMEOUT_")) {
        return res.status(504).json({
          message: "O serviço de pagamento demorou muito para responder. Tente novamente.",
        });
      }
      if (err.message?.startsWith("NETWORK_ERROR_")) {
        return res.status(503).json({
          message: "Não foi possível conectar ao serviço de pagamento. Verifique sua conexão e tente novamente.",
        });
      }
      console.error("[subscriptions/create] Erro inesperado:", err);
      return res.status(500).json({
        message: "Ocorreu um erro inesperado. Nossa equipe foi notificada.",
      });
    }
  });

  app.post("/api/subscriptions/cancel", requireAuth, async (req, res) => {
    // 1. Buscar usuário
    const user = await storage.getUserById(req.session.userId!);
    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    // 2. Validar assinatura
    if (!user.pagarmeSubscriptionId) {
      return res.status(400).json({ message: "Nenhuma assinatura encontrada para cancelar." });
    }
    if (user.subscriptionStatus !== "active") {
      return res.status(400).json({ message: "Sua assinatura não está ativa." });
    }

    try {
      // 3. Consultar a assinatura no Pagar.me para pegar a data de criação
      const getRes = await pagarmeFetch(`/subscriptions/${user.pagarmeSubscriptionId}`, {
        method: "GET",
        label: "consultar-subscription-cancel",
      });

      if (getRes.status !== 200) {
        console.error("[subscriptions/cancel] Falha ao consultar subscription:", getRes.body);
        return res.status(502).json({
          message: "Não foi possível verificar sua assinatura. Tente novamente.",
        });
      }

      const createdAt = getRes.body.created_at;
      const cycleEndAt = getRes.body.current_cycle?.end_at ?? null;

      // 4. Calcular se está dentro do prazo de 7 dias (CDC Art. 49)
      const created = new Date(createdAt);
      const now = new Date();
      const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      const withinCooldown = diffDays <= 7;

      // 5. Cancelar no Pagar.me
      const delRes = await pagarmeFetch(`/subscriptions/${user.pagarmeSubscriptionId}`, {
        method: "DELETE",
        label: "cancelar-subscription",
        body: JSON.stringify({ cancel_pending_invoices: true }),
      });

      if (delRes.status !== 200) {
        console.error("[subscriptions/cancel] Falha ao cancelar:", delRes.body);
        return res.status(502).json({
          message: "Não foi possível cancelar a assinatura. Tente novamente ou contate o suporte.",
        });
      }

      // 6. Atualizar o banco
      await storage.updateUser(user.id, { subscriptionStatus: "canceled" });

      // 7. Notificar o admin em qualquer cancelamento; dentro do prazo de 7 dias, sinalizar necessidade de estorno
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        try {
          if (withinCooldown) {
            await sendEmail({
              to: adminEmail,
              subject: "Cancelamento com direito a estorno (CDC 7 dias) — Reforma em Ação",
              kind: "generic",
              html: `<p>Um usuário cancelou a assinatura DENTRO do prazo de arrependimento de 7 dias (CDC Art. 49).</p>
                <p><strong>Usuário:</strong> ${user.email}</p>
                <p><strong>ID da assinatura (Pagar.me):</strong> ${user.pagarmeSubscriptionId}</p>
                <p><strong>Data de criação da assinatura:</strong> ${createdAt}</p>
                <p><strong>Ação necessária:</strong> processar o estorno integral no painel do Pagar.me.</p>`,
            });
          } else {
            await sendEmail({
              to: adminEmail,
              subject: "Cancelamento de assinatura — Reforma em Ação",
              kind: "generic",
              html: `<p>Um usuário cancelou a assinatura (fora do prazo de arrependimento de 7 dias, sem direito a estorno).</p>
                <p><strong>Usuário:</strong> ${user.email}</p>
                <p><strong>ID da assinatura (Pagar.me):</strong> ${user.pagarmeSubscriptionId}</p>
                <p><strong>Data de criação da assinatura:</strong> ${createdAt}</p>
                <p><strong>Acesso mantido até:</strong> ${cycleEndAt ?? "fim do período já pago"}</p>
                <p>Nenhuma ação de estorno é necessária.</p>`,
            });
          }
        } catch (e) {
          console.error("[subscriptions/cancel] Falha ao enviar e-mail ao admin:", e);
        }
      } else {
        console.warn("[subscriptions/cancel] ADMIN_EMAIL não configurada — notificação de cancelamento NÃO enviada. Usuário:", user.email);
      }

      // 8. Resposta ao frontend
      return res.status(200).json({
        ok: true,
        withinCooldown,
        accessUntil: cycleEndAt,
        message: withinCooldown
          ? "Assinatura cancelada. Por estar dentro dos 7 dias (direito de arrependimento), você receberá o estorno integral. Nossa equipe foi notificada."
          : "Assinatura cancelada. Ela não será renovada e você mantém o acesso até o fim do período já pago.",
      });
    } catch (err: any) {
      if (err.message?.startsWith("TIMEOUT_")) {
        return res.status(504).json({
          message: "O serviço de pagamento demorou muito para responder. Tente novamente.",
        });
      }
      if (err.message?.startsWith("NETWORK_ERROR_")) {
        return res.status(503).json({
          message: "Não foi possível conectar ao serviço de pagamento. Verifique sua conexão e tente novamente.",
        });
      }
      console.error("[subscriptions/cancel] Erro inesperado:", err);
      return res.status(500).json({
        message: "Ocorreu um erro inesperado. Nossa equipe foi notificada.",
      });
    }
  });

  return httpServer;
}
