import { Router, type IRouter } from "express";
import {
  TwaAuthBody,
  TwaAuthResponse,
  TwaGenerateBody,
  TwaGenerateResponse,
  TwaGetReportsQueryParams,
  TwaGetReportsResponse,
  TwaCreatePaymentBody,
  TwaCreatePaymentResponse,
} from "@workspace/api-zod";
import {
  getOrCreateUser,
  getUser,
  canUserGenerateReport,
  useReport,
  saveReport,
  savePayment,
} from "../../bot/db.js";
import { generateReport } from "../../bot/ai.js";
import { db, reportsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.post("/auth", async (req, res) => {
  try {
    const body = TwaAuthBody.parse(req.body);
    const user = await getOrCreateUser(body.telegramId, {
      username: body.username,
      firstName: body.firstName,
      lastName: body.lastName,
    });

    const data = TwaAuthResponse.parse({
      telegramId: user.telegramId,
      username: user.username ?? undefined,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      balance: user.balance,
      freeReportsUsed: user.freeReportsUsed,
      totalReports: user.totalReports,
      referralCode: user.referralCode ?? undefined,
      referralCount: user.referralCount ?? 0,
    });
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "TWA auth error");
    res.status(400).json({ error: "Invalid request" });
  }
});

router.post("/generate", async (req, res) => {
  let body;
  try {
    body = TwaGenerateBody.parse(req.body);
  } catch (err) {
    req.log.error({ err }, "TWA generate validation error");
    return res.status(400).json({ success: false, error: "invalid_request" });
  }

  try {
    const check = await canUserGenerateReport(body.telegramId);

    if (!check.canGenerate) {
      return res.json({ success: false, error: "no_balance" });
    }

    const content = await generateReport(
      body.reportType,
      body.subject,
      body.topic,
      body.group
    );

    await useReport(body.telegramId);
    const [report] = await saveReport({
      telegramId: body.telegramId,
      subject: body.subject,
      reportType: body.reportType,
      group: body.group,
      topic: body.topic,
      content,
    });

    const user = await getUser(body.telegramId);

    res.json({
      success: true,
      content,
      reportId: report.id,
      remainingBalance: user?.balance ?? 0,
    });
  } catch (err) {
    req.log.error({ err }, "TWA generate error");
    res.status(500).json({
      success: false,
      error: "Generation failed. Please try again.",
    });
  }
});

router.get("/reports", async (req, res) => {
  try {
    const params = TwaGetReportsQueryParams.parse(req.query);
    const reports = await db
      .select()
      .from(reportsTable)
      .where(eq(reportsTable.telegramId, params.telegram_id))
      .orderBy(desc(reportsTable.createdAt))
      .limit(50);

    const data = TwaGetReportsResponse.parse({
      reports: reports.map((r) => ({
        id: r.id,
        reportType: r.reportType,
        subject: r.subject,
        topic: r.topic,
        group: r.group,
        content: r.content,
        createdAt: r.createdAt.toISOString(),
      })),
    });
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "TWA reports error");
    res.status(400).json({ reports: [] });
  }
});

router.post("/payment", async (req, res) => {
  try {
    const body = TwaCreatePaymentBody.parse(req.body);

    const amounts: Record<string, { amount: number; currency: string }> = {
      card: { amount: 250, currency: "UAH" },
      google_pay: { amount: 250, currency: "UAH" },
      apple_pay: { amount: 250, currency: "UAH" },
      crypto: { amount: 5, currency: "USDT" },
      stars: { amount: 500, currency: "XTR" },
    };

    const payInfo = amounts[body.paymentMethod] || {
      amount: 250,
      currency: "UAH",
    };

    await savePayment({
      telegramId: body.telegramId,
      amount: payInfo.amount,
      currency: payInfo.currency,
      paymentMethod: body.paymentMethod,
    });

    const data = TwaCreatePaymentResponse.parse({
      success: true,
      message: "Payment request recorded",
    });
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "TWA payment error");
    res.status(400).json({ success: false, message: "Invalid request" });
  }
});

export default router;
