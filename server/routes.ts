import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { storage } from "./storage";
import { sendPasswordResetEmail, sendWelcomeEmail } from "./email";
import { insertCompanySchema } from "@shared/schema";

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
      res.json({ id: user.id, email: user.email, name: user.name ?? null, role: user.role });
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
      res.json({ id: user.id, email: user.email, name: user.name ?? null, role: user.role });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.patch("/api/user", requireAuth, async (req, res) => {
    try {
      const { name, email } = req.body;
      const updates: { name?: string; email?: string } = {};
      if (typeof name === "string") updates.name = name.trim();
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
      res.json({ id: user.id, email: user.email, name: user.name ?? null });
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

    const PROCESS_EVENTS = new Set(["order.paid", "charge.paid"]);
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
      const parsed = insertCompanySchema.safeParse({ ...req.body, userId: req.session.userId });
      if (!parsed.success) {
        return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten() });
      }
      const company = await storage.createCompany(parsed.data);
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

  return httpServer;
}
