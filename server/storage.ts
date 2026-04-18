import { eq, and, desc } from "drizzle-orm";
import { db } from "./db";
import {
  users, type User, type InsertUser,
  companies, type Company, type InsertCompany,
  checklistItems, type ChecklistItem, type InsertChecklistItem,
  implementationTasks, type ImplementationTask, type InsertImplementationTask,
  emailLogs, type EmailLog, type InsertEmailLog,
} from "@shared/schema";

export interface IStorage {
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  updateUser(id: string, data: { name?: string; email?: string; passwordHash?: string }): Promise<User | undefined>;
  updateUserRole(id: string, role: "user" | "super_admin"): Promise<User | undefined>;
  setResetToken(userId: string, token: string, expiresAt: Date): Promise<void>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  clearResetToken(userId: string): Promise<void>;
  listAllUsers(): Promise<User[]>;
  listAllCompanies(): Promise<Company[]>;
  createEmailLog(log: InsertEmailLog): Promise<EmailLog>;
  listEmailLogs(limit?: number): Promise<EmailLog[]>;

  createCompany(company: InsertCompany): Promise<Company>;
  getCompany(id: string): Promise<Company | undefined>;
  updateCompany(id: string, data: Partial<InsertCompany>): Promise<Company | undefined>;
  deleteCompany(id: string): Promise<void>;
  getCompaniesByUser(userId: string): Promise<Company[]>;

  getChecklistByCompany(companyId: string): Promise<ChecklistItem[]>;
  upsertChecklist(companyId: string, items: { questionId: string; question: string; status: string }[]): Promise<ChecklistItem[]>;
  updateChecklistItem(id: string, status: string): Promise<ChecklistItem | undefined>;

  getTasksByCompany(companyId: string): Promise<ImplementationTask[]>;
  upsertTasks(companyId: string, tasks: { week: number; taskName: string; completed: boolean }[]): Promise<ImplementationTask[]>;
  updateTask(id: string, completed: boolean): Promise<ImplementationTask | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createUser(user: InsertUser): Promise<User> {
    const [result] = await db.insert(users).values(user).returning();
    return result;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [result] = await db.select().from(users).where(eq(users.email, email));
    return result;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [result] = await db.select().from(users).where(eq(users.id, id));
    return result;
  }

  async updateUser(id: string, data: { name?: string; email?: string; passwordHash?: string }): Promise<User | undefined> {
    const [result] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return result;
  }

  async updateUserRole(id: string, role: "user" | "super_admin"): Promise<User | undefined> {
    const [result] = await db.update(users).set({ role }).where(eq(users.id, id)).returning();
    return result;
  }

  async listAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  async listAllCompanies(): Promise<Company[]> {
    return db.select().from(companies).orderBy(desc(companies.createdAt));
  }

  async createEmailLog(log: InsertEmailLog): Promise<EmailLog> {
    const [result] = await db.insert(emailLogs).values(log).returning();
    return result;
  }

  async listEmailLogs(limit = 200): Promise<EmailLog[]> {
    return db.select().from(emailLogs).orderBy(desc(emailLogs.createdAt)).limit(limit);
  }

  async setResetToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    await db.update(users).set({ resetToken: token, resetTokenExpiresAt: expiresAt }).where(eq(users.id, userId));
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [result] = await db.select().from(users).where(eq(users.resetToken, token));
    return result;
  }

  async clearResetToken(userId: string): Promise<void> {
    await db.update(users).set({ resetToken: null, resetTokenExpiresAt: null }).where(eq(users.id, userId));
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    const [result] = await db.insert(companies).values(company).returning();
    return result;
  }

  async getCompany(id: string): Promise<Company | undefined> {
    const [result] = await db.select().from(companies).where(eq(companies.id, id));
    return result;
  }

  async updateCompany(id: string, data: Partial<InsertCompany>): Promise<Company | undefined> {
    const [result] = await db.update(companies).set(data).where(eq(companies.id, id)).returning();
    return result;
  }

  async deleteCompany(id: string): Promise<void> {
    await db.delete(checklistItems).where(eq(checklistItems.companyId, id));
    await db.delete(implementationTasks).where(eq(implementationTasks.companyId, id));
    await db.delete(companies).where(eq(companies.id, id));
  }

  async getCompaniesByUser(userId: string): Promise<Company[]> {
    const all = await db.select().from(companies).where(eq(companies.userId, userId)).orderBy(desc(companies.createdAt));
    const seen = new Set<string>();
    return all.filter(c => {
      if (!c.cnpj) return true;
      if (seen.has(c.cnpj)) return false;
      seen.add(c.cnpj);
      return true;
    });
  }

  async getChecklistByCompany(companyId: string): Promise<ChecklistItem[]> {
    return db.select().from(checklistItems).where(eq(checklistItems.companyId, companyId));
  }

  async upsertChecklist(companyId: string, items: { questionId: string; question: string; status: string }[]): Promise<ChecklistItem[]> {
    await db.delete(checklistItems).where(eq(checklistItems.companyId, companyId));
    if (items.length === 0) return [];
    const toInsert = items.map((item) => ({
      companyId,
      questionId: item.questionId,
      question: item.question,
      status: item.status,
    }));
    return db.insert(checklistItems).values(toInsert).returning();
  }

  async updateChecklistItem(id: string, status: string): Promise<ChecklistItem | undefined> {
    const [result] = await db.update(checklistItems).set({ status }).where(eq(checklistItems.id, id)).returning();
    return result;
  }

  async getTasksByCompany(companyId: string): Promise<ImplementationTask[]> {
    return db.select().from(implementationTasks).where(eq(implementationTasks.companyId, companyId));
  }

  async upsertTasks(companyId: string, tasks: { week: number; taskName: string; completed: boolean }[]): Promise<ImplementationTask[]> {
    await db.delete(implementationTasks).where(eq(implementationTasks.companyId, companyId));
    if (tasks.length === 0) return [];
    const toInsert = tasks.map((t) => ({
      companyId,
      week: t.week,
      taskName: t.taskName,
      completed: t.completed,
    }));
    return db.insert(implementationTasks).values(toInsert).returning();
  }

  async updateTask(id: string, completed: boolean): Promise<ImplementationTask | undefined> {
    const [result] = await db.update(implementationTasks).set({ completed }).where(eq(implementationTasks.id, id)).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
