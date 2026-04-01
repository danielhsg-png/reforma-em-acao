import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?\n" +
    "On Railway, add a PostgreSQL service and link DATABASE_URL to your app."
  );
}

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(pool, { schema });

export async function runMigrations() {
  const client = await pool.connect();
  try {
    // Find migration files - check multiple possible paths
    let migrationsDir: string | null = null;
    const possiblePaths = [
      join(process.cwd(), "migrations"),
      join(process.cwd(), "..", "migrations"),
      join(__dirname, "..", "migrations"),
    ];

    for (const p of possiblePaths) {
      try {
        const files = readdirSync(p);
        if (files.some(f => f.endsWith(".sql"))) {
          migrationsDir = p;
          break;
        }
      } catch {}
    }

    if (!migrationsDir) {
      // Fallback: run inline SQL for table creation
      console.log("[db] No migrations directory found, running inline schema creation...");
      await client.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          name TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS companies (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id VARCHAR NOT NULL DEFAULT '',
          company_name TEXT NOT NULL,
          cnpj TEXT NOT NULL DEFAULT '',
          sector TEXT NOT NULL,
          regime TEXT NOT NULL,
          operations TEXT NOT NULL DEFAULT 'b2c',
          purchase_profile TEXT NOT NULL DEFAULT 'mixed_suppliers',
          sales_states TEXT[] NOT NULL DEFAULT '{}',
          cost_structure TEXT NOT NULL DEFAULT 'mercadorias',
          risk_score INTEGER NOT NULL DEFAULT 0,
          monthly_revenue TEXT NOT NULL DEFAULT '100k_500k',
          employee_count TEXT NOT NULL DEFAULT '1_10',
          profit_margin TEXT NOT NULL DEFAULT '10_20',
          erp_system TEXT NOT NULL DEFAULT 'nenhum',
          nfe_emission TEXT NOT NULL DEFAULT 'contador',
          invoice_volume TEXT NOT NULL DEFAULT 'ate_100',
          supplier_count TEXT NOT NULL DEFAULT 'ate_20',
          simples_supplier_percent TEXT NOT NULL DEFAULT 'ate_30',
          has_long_term_contracts TEXT NOT NULL DEFAULT 'nao',
          price_revision_clause TEXT NOT NULL DEFAULT 'nao_sei',
          tax_responsible TEXT NOT NULL DEFAULT 'contador_externo',
          split_payment_aware TEXT NOT NULL DEFAULT 'nao',
          main_concern TEXT NOT NULL DEFAULT 'custos',
          special_regimes TEXT[] NOT NULL DEFAULT '{}',
          extended_data JSONB DEFAULT '{}',
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS checklist_items (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          company_id VARCHAR NOT NULL,
          question_id TEXT NOT NULL,
          question TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'validating'
        )
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS implementation_tasks (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          company_id VARCHAR NOT NULL,
          week INTEGER NOT NULL,
          task_name TEXT NOT NULL,
          completed BOOLEAN NOT NULL DEFAULT FALSE
        )
      `);
      console.log("[db] Schema creation complete.");
      return;
    }

    // Run SQL migration files in order
    const sqlFiles = readdirSync(migrationsDir)
      .filter(f => f.endsWith(".sql"))
      .sort();

    for (const file of sqlFiles) {
      const sql = readFileSync(join(migrationsDir, file), "utf-8");
      console.log(`[db] Running migration: ${file}`);
      await client.query(sql);
    }
    console.log("[db] All migrations complete.");
  } catch (err) {
    console.error("[db] Migration error:", err);
    throw err;
  } finally {
    client.release();
  }
}
