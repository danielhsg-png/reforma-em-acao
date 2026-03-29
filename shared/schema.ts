import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const companies = pgTable("companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().default(""),
  companyName: text("company_name").notNull(),
  cnpj: text("cnpj").notNull().default(""),
  sector: text("sector").notNull(),
  regime: text("regime").notNull(),
  operations: text("operations").notNull().default("b2c"),
  purchaseProfile: text("purchase_profile").notNull().default("mixed_suppliers"),
  salesStates: text("sales_states").array().notNull().default(sql`'{}'::text[]`),
  costStructure: text("cost_structure").notNull().default("mercadorias"),
  riskScore: integer("risk_score").notNull().default(0),
  monthlyRevenue: text("monthly_revenue").notNull().default("100k_500k"),
  employeeCount: text("employee_count").notNull().default("1_10"),
  profitMargin: text("profit_margin").notNull().default("10_20"),
  erpSystem: text("erp_system").notNull().default("nenhum"),
  nfeEmission: text("nfe_emission").notNull().default("contador"),
  invoiceVolume: text("invoice_volume").notNull().default("ate_100"),
  supplierCount: text("supplier_count").notNull().default("ate_20"),
  simplesSupplierPercent: text("simples_supplier_percent").notNull().default("ate_30"),
  hasLongTermContracts: text("has_long_term_contracts").notNull().default("nao"),
  priceRevisionClause: text("price_revision_clause").notNull().default("nao_sei"),
  taxResponsible: text("tax_responsible").notNull().default("contador_externo"),
  splitPaymentAware: text("split_payment_aware").notNull().default("nao"),
  mainConcern: text("main_concern").notNull().default("custos"),
  specialRegimes: text("special_regimes").array().notNull().default(sql`'{}'::text[]`),
  extendedData: jsonb("extended_data").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
});

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

export const checklistItems = pgTable("checklist_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull(),
  questionId: text("question_id").notNull(),
  question: text("question").notNull(),
  status: text("status").notNull().default("validating"),
});

export const insertChecklistItemSchema = createInsertSchema(checklistItems).omit({
  id: true,
});

export type InsertChecklistItem = z.infer<typeof insertChecklistItemSchema>;
export type ChecklistItem = typeof checklistItems.$inferSelect;

export const implementationTasks = pgTable("implementation_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull(),
  week: integer("week").notNull(),
  taskName: text("task_name").notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const insertImplementationTaskSchema = createInsertSchema(implementationTasks).omit({
  id: true,
});

export type InsertImplementationTask = z.infer<typeof insertImplementationTaskSchema>;
export type ImplementationTask = typeof implementationTasks.$inferSelect;
