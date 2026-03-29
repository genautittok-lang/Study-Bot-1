import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db, usersTable, reportsTable, paymentsTable } from "@workspace/db";
import { eq, desc, sql, like, or } from "drizzle-orm";
import { addBalance } from "../../bot/db.js";
import { bot } from "../../bot/index.js";
import { logger } from "../../lib/logger.js";

const router: IRouter = Router();

const ADMIN_IDS = (process.env.ADMIN_IDS || "999999999").split(",").map(id => parseInt(id.trim(), 10));

function adminAuth(req: Request, res: Response, next: NextFunction): void {
  const telegramId = parseInt(req.headers["x-telegram-id"] as string, 10);
  if (!telegramId || !ADMIN_IDS.includes(telegramId)) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  next();
}

router.use(adminAuth);

router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const [usersCount] = await db.select({ count: sql<number>`count(*)::int` }).from(usersTable);
    const [reportsCount] = await db.select({ count: sql<number>`count(*)::int` }).from(reportsTable);
    const [paymentsCount] = await db.select({ count: sql<number>`count(*)::int` }).from(paymentsTable);
    const [pendingPayments] = await db.select({ count: sql<number>`count(*)::int` }).from(paymentsTable).where(eq(paymentsTable.status, "pending"));
    const [totalRevenue] = await db.select({ sum: sql<number>`COALESCE(sum(amount), 0)::int` }).from(paymentsTable).where(eq(paymentsTable.status, "completed"));

    const recentUsers = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt)).limit(5);

    res.json({
      totalUsers: usersCount.count,
      totalReports: reportsCount.count,
      totalPayments: paymentsCount.count,
      pendingPayments: pendingPayments.count,
      totalRevenue: totalRevenue.sum,
      recentUsers: recentUsers.map(u => ({
        id: u.id,
        telegramId: u.telegramId,
        username: u.username,
        firstName: u.firstName,
        balance: u.balance,
        totalReports: u.totalReports,
        createdAt: u.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    logger.error({ err }, "Admin stats error");
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

router.get("/users", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    const search = (req.query.search as string) || "";

    let users;
    let totalResult;

    if (search) {
      const searchPattern = `%${search}%`;
      users = await db.select().from(usersTable)
        .where(or(
          like(usersTable.username, searchPattern),
          like(usersTable.firstName, searchPattern),
          sql`${usersTable.telegramId}::text LIKE ${searchPattern}`
        ))
        .orderBy(desc(usersTable.createdAt))
        .limit(limit).offset(offset);
      [totalResult] = await db.select({ count: sql<number>`count(*)::int` }).from(usersTable)
        .where(or(
          like(usersTable.username, searchPattern),
          like(usersTable.firstName, searchPattern),
          sql`${usersTable.telegramId}::text LIKE ${searchPattern}`
        ));
    } else {
      users = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt)).limit(limit).offset(offset);
      [totalResult] = await db.select({ count: sql<number>`count(*)::int` }).from(usersTable);
    }

    res.json({
      users: users.map(u => ({
        id: u.id,
        telegramId: u.telegramId,
        username: u.username,
        firstName: u.firstName,
        lastName: u.lastName,
        balance: u.balance,
        freeReportsUsed: u.freeReportsUsed,
        totalReports: u.totalReports,
        referralCode: u.referralCode,
        referralCount: u.referralCount,
        createdAt: u.createdAt.toISOString(),
      })),
      total: totalResult.count,
      page,
      totalPages: Math.ceil(totalResult.count / limit),
    });
  } catch (err) {
    logger.error({ err }, "Admin users error");
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.post("/users/:telegramId/balance", async (req: Request, res: Response) => {
  try {
    const telegramId = parseInt(req.params.telegramId, 10);
    const { amount } = req.body as { amount: number };
    if (!amount || amount < 1 || amount > 1000) {
      res.status(400).json({ error: "Invalid amount (1-1000)" });
      return;
    }
    await addBalance(telegramId, amount);

    try {
      await bot.telegram.sendMessage(telegramId, `✅ Вам нараховано +${amount} звітів від адміністратора!`);
    } catch { }

    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, "Admin add balance error");
    res.status(500).json({ error: "Failed to add balance" });
  }
});

router.get("/payments", async (req: Request, res: Response) => {
  try {
    const status = (req.query.status as string) || "all";
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    let payments;
    let totalResult;

    if (status !== "all") {
      payments = await db.select().from(paymentsTable)
        .where(eq(paymentsTable.status, status))
        .orderBy(desc(paymentsTable.createdAt))
        .limit(limit).offset(offset);
      [totalResult] = await db.select({ count: sql<number>`count(*)::int` }).from(paymentsTable)
        .where(eq(paymentsTable.status, status));
    } else {
      payments = await db.select().from(paymentsTable)
        .orderBy(desc(paymentsTable.createdAt))
        .limit(limit).offset(offset);
      [totalResult] = await db.select({ count: sql<number>`count(*)::int` }).from(paymentsTable);
    }

    res.json({
      payments: payments.map(p => ({
        id: p.id,
        telegramId: p.telegramId,
        amount: p.amount,
        currency: p.currency,
        paymentMethod: p.paymentMethod,
        reportsAdded: p.reportsAdded,
        status: p.status,
        createdAt: p.createdAt.toISOString(),
      })),
      total: totalResult.count,
      page,
      totalPages: Math.ceil(totalResult.count / limit),
    });
  } catch (err) {
    logger.error({ err }, "Admin payments error");
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

router.post("/payments/:id/approve", async (req: Request, res: Response) => {
  try {
    const paymentId = parseInt(req.params.id, 10);
    const [payment] = await db.select().from(paymentsTable).where(eq(paymentsTable.id, paymentId)).limit(1);
    if (!payment) { res.status(404).json({ error: "Payment not found" }); return; }
    if (payment.status === "completed") { res.status(400).json({ error: "Already approved" }); return; }

    await db.update(paymentsTable).set({ status: "completed" }).where(eq(paymentsTable.id, paymentId));
    await addBalance(payment.telegramId, payment.reportsAdded);

    try {
      await bot.telegram.sendMessage(payment.telegramId, `✅ Ваш платіж підтверджено! Додано +${payment.reportsAdded} звітів.`);
    } catch { }

    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, "Admin approve payment error");
    res.status(500).json({ error: "Failed to approve payment" });
  }
});

router.post("/payments/:id/reject", async (req: Request, res: Response) => {
  try {
    const paymentId = parseInt(req.params.id, 10);
    const [payment] = await db.select().from(paymentsTable).where(eq(paymentsTable.id, paymentId)).limit(1);
    if (!payment) { res.status(404).json({ error: "Payment not found" }); return; }

    await db.update(paymentsTable).set({ status: "rejected" }).where(eq(paymentsTable.id, paymentId));

    try {
      await bot.telegram.sendMessage(payment.telegramId, `❌ Payment rejected. Send a clearer screenshot or try again.\n❌ Платіж відхилено. Надішли чіткіший скріншот або спробуй знову.`);
    } catch { }

    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, "Admin reject payment error");
    res.status(500).json({ error: "Failed to reject payment" });
  }
});

router.post("/broadcast", async (req: Request, res: Response) => {
  try {
    const { message, imageUrl } = req.body as { message: string; imageUrl?: string };
    if (!message?.trim()) { res.status(400).json({ error: "Message is required" }); return; }

    const allUsers = await db.select({ telegramId: usersTable.telegramId }).from(usersTable);

    let sent = 0;
    let failed = 0;

    for (const user of allUsers) {
      try {
        if (imageUrl) {
          await bot.telegram.sendPhoto(user.telegramId, imageUrl, { caption: message, parse_mode: "HTML" });
        } else {
          await bot.telegram.sendMessage(user.telegramId, message, { parse_mode: "HTML" });
        }
        sent++;
      } catch {
        failed++;
      }
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    res.json({ success: true, sent, failed, total: allUsers.length });
  } catch (err) {
    logger.error({ err }, "Admin broadcast error");
    res.status(500).json({ error: "Broadcast failed" });
  }
});

export default router;
