import { db, usersTable, reportsTable, paymentsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

export async function getOrCreateUser(telegramId: number, userData: {
  username?: string;
  firstName?: string;
  lastName?: string;
}) {
  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.telegramId, telegramId))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  const inserted = await db
    .insert(usersTable)
    .values({
      telegramId,
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      balance: 0,
      freeReportsUsed: false,
      totalReports: 0,
    })
    .returning();

  return inserted[0];
}

export async function getUser(telegramId: number) {
  const result = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.telegramId, telegramId))
    .limit(1);
  return result[0] ?? null;
}

export async function canUserGenerateReport(telegramId: number): Promise<{ canGenerate: boolean; reason: string }> {
  const user = await getUser(telegramId);
  if (!user) return { canGenerate: false, reason: "user_not_found" };

  if (!user.freeReportsUsed) {
    return { canGenerate: true, reason: "free" };
  }

  if (user.balance > 0) {
    return { canGenerate: true, reason: "balance" };
  }

  return { canGenerate: false, reason: "no_balance" };
}

export async function useReport(telegramId: number): Promise<void> {
  const user = await getUser(telegramId);
  if (!user) return;

  if (!user.freeReportsUsed) {
    await db
      .update(usersTable)
      .set({
        freeReportsUsed: true,
        totalReports: sql`${usersTable.totalReports} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.telegramId, telegramId));
  } else {
    await db
      .update(usersTable)
      .set({
        balance: sql`GREATEST(${usersTable.balance} - 1, 0)`,
        totalReports: sql`${usersTable.totalReports} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.telegramId, telegramId));
  }
}

export async function saveReport(data: {
  telegramId: number;
  subject: string;
  reportType: string;
  group?: string | null;
  topic: string;
  content: string;
}) {
  return db.insert(reportsTable).values({
    telegramId: data.telegramId,
    subject: data.subject,
    reportType: data.reportType,
    group: data.group,
    topic: data.topic,
    content: data.content,
    status: "done",
  }).returning();
}

export async function savePayment(data: {
  telegramId: number;
  amount: number;
  currency: string;
  paymentMethod: string;
  externalId?: string;
}) {
  return db.insert(paymentsTable).values({
    telegramId: data.telegramId,
    amount: data.amount,
    currency: data.currency,
    paymentMethod: data.paymentMethod,
    reportsAdded: 15,
    status: "pending",
    externalId: data.externalId,
  }).returning();
}

export async function addBalance(telegramId: number, amount: number) {
  const user = await getUser(telegramId);
  if (!user) return;

  await db
    .update(usersTable)
    .set({ balance: user.balance + amount, updatedAt: new Date() })
    .where(eq(usersTable.telegramId, telegramId));
}
