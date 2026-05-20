import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { runMigrations } from "./db";

const app = express();
app.set("trust proxy", 1);
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

async function seedDefaultUsers() {
  const defaultUsers: { email: string; password: string; role?: "user" | "super_admin" }[] = [
    { email: "admin@reforma.com", password: "reforma2025", role: "super_admin" },
    { email: "teste@reforma.com", password: "teste123" },
    { email: "demo1@reformaemacao.com.br", password: "Reforma@2026" },
    { email: "demo2@reformaemacao.com.br", password: "Reforma@2026" },
    { email: "elio.primage@gmail.com", password: "TempReset!2026", role: "super_admin" },
  ];
  for (const u of defaultUsers) {
    const existing = await storage.getUserByEmail(u.email);
    if (!existing) {
      const passwordHash = await bcrypt.hash(u.password, 10);
      await storage.createUser({ email: u.email, passwordHash, role: u.role ?? "user" });
      log(`Usuário criado: ${u.email} (${u.role ?? "user"})`);
    } else if (u.role === "super_admin" && existing.role !== "super_admin") {
      await storage.updateUserRole(existing.id, "super_admin");
      log(`Usuário promovido a super_admin: ${u.email}`);
    }
  }
}

(async () => {
  // Run database migrations before anything else
  console.log("[startup] Running database migrations...");
  await runMigrations();
  console.log("[startup] Migrations complete.");

  await registerRoutes(httpServer, app);
  await seedDefaultUsers();

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
