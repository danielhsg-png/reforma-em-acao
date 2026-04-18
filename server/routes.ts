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

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "reforma-em-acao-secret-key-2025",
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
      res.json({ id: user.id, email: user.email, name: user.name ?? null });
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
      res.json({ id: user.id, email: user.email, name: user.name ?? null });
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
      if (adminKey !== (process.env.ADMIN_KEY || "reforma-admin-2025")) {
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
