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
import { generateReport, improveText, generateStructurePreview } from "../../bot/ai.js";
import { bot } from "../../bot/index.js";
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
    const cost = Math.max(1, Math.min(3, body.cost ?? 2));
    const check = await canUserGenerateReport(body.telegramId, cost);

    if (!check.canGenerate) {
      return res.json({ success: false, error: "no_balance" });
    }

    const content = await generateReport(
      body.reportType,
      body.subject,
      body.topic,
      body.group,
      body.imageData,
      body.language
    );

    await useReport(body.telegramId, cost);
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
    const screenshotData: string | undefined = req.body.screenshotData;

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

    const [payment] = await savePayment({
      telegramId: body.telegramId,
      amount: payInfo.amount,
      currency: payInfo.currency,
      paymentMethod: body.paymentMethod,
    });

    const adminId = process.env.ADMIN_TELEGRAM_ID;
    if (adminId && payment) {
      const user = await getUser(body.telegramId);
      const username = user?.username ? `@${user.username}` : `ID: ${body.telegramId}`;
      const methodLabel = body.paymentMethod === "card" ? "💳 Картка (250 UAH)" : "💎 Крипто USDT (5 USDT)";
      const caption = `📥 *Новий запит на поповнення!*\n\n👤 Користувач: ${username}\n🆔 Telegram ID: \`${body.telegramId}\`\n💰 Метод: ${methodLabel}\n🎟 Звітів: 15\n#️⃣ Платіж: #${payment.id}\n\nПеревір оплату та натисни:`;

      try {
        if (screenshotData) {
          const base64 = screenshotData.replace(/^data:image\/\w+;base64,/, "");
          const imgBuffer = Buffer.from(base64, "base64");
          await bot.telegram.sendPhoto(
            Number(adminId),
            { source: imgBuffer },
            {
              caption,
              parse_mode: "Markdown",
              reply_markup: {
                inline_keyboard: [[
                  { text: "✅ Підтвердити", callback_data: `approve_pay_${payment.id}` },
                  { text: "❌ Відхилити", callback_data: `reject_pay_${payment.id}` },
                ]],
              },
            }
          );
        } else {
          await bot.telegram.sendMessage(
            Number(adminId),
            caption + "\n\n⚠️ _Скріншот не надано_",
            {
              parse_mode: "Markdown",
              reply_markup: {
                inline_keyboard: [[
                  { text: "✅ Підтвердити", callback_data: `approve_pay_${payment.id}` },
                  { text: "❌ Відхилити", callback_data: `reject_pay_${payment.id}` },
                ]],
              },
            }
          );
        }
      } catch (botErr) {
        req.log.error({ botErr }, "Failed to notify admin via bot");
      }
    }

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

router.post("/create-invoice", async (req, res) => {
  try {
    const { telegramId } = req.body as { telegramId: number };
    if (!telegramId) {
      return res.status(400).json({ success: false, error: "Missing telegramId" });
    }

    const invoiceLink = await bot.telegram.createInvoiceLink({
      title: "📚 15 звітів StudyFlush",
      description: "Пакет із 15 AI-згенерованих звітів, конспектів або лабораторних",
      payload: `stars_${telegramId}_${Date.now()}`,
      currency: "XTR",
      prices: [{ label: "15 звітів", amount: 500 }],
    });

    res.json({ success: true, invoiceUrl: invoiceLink });
  } catch (err) {
    req.log.error({ err }, "TWA create-invoice error");
    res.status(500).json({ success: false, error: "Failed to create invoice" });
  }
});

router.post("/improve", async (req, res) => {
  try {
    const { content, action, language } = req.body as {
      content: string;
      action: "rephrase" | "harder" | "simpler" | "humanize";
      language?: string;
    };
    if (!content || !action) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }
    const allowedActions = ["rephrase", "harder", "simpler", "humanize"];
    if (!allowedActions.includes(action)) {
      return res.status(400).json({ success: false, error: "Invalid action" });
    }
    const improved = await improveText(content, action, language);
    res.json({ success: true, content: improved });
  } catch (err) {
    req.log.error({ err }, "TWA improve error");
    res.status(500).json({ success: false, error: "Improvement failed" });
  }
});

router.post("/structure-preview", async (req, res) => {
  try {
    const { reportType, subject, topic, language } = req.body as {
      reportType: string;
      subject: string;
      topic: string;
      language?: string;
    };
    if (!reportType || !subject || !topic) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }
    const structure = await generateStructurePreview(reportType, subject, topic, language);
    res.json({ success: true, structure });
  } catch (err) {
    req.log.error({ err }, "TWA structure-preview error");
    res.status(500).json({ success: false, error: "Structure generation failed" });
  }
});

router.post("/support", async (req, res) => {
  try {
    const { telegramId, category, message } = req.body as {
      telegramId: number;
      category: string;
      message: string;
    };

    if (!telegramId || !message || typeof message !== "string") {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const allowedCategories = ["payment", "generation", "bug", "feature", "other", ""];
    if (category && !allowedCategories.includes(category)) {
      return res.status(400).json({ success: false, error: "Invalid category" });
    }

    const user = await getUser(telegramId);
    const username = user?.username ? `@${user.username}` : "—";
    const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "—";
    const catLabels: Record<string, string> = {
      payment: "💳 Payment",
      generation: "⚙️ Generation",
      bug: "🐛 Bug Report",
      feature: "💡 Feature Request",
      other: "📩 Other",
    };
    const catLabel = catLabels[category] || "📩 Other";

    const adminId = process.env.ADMIN_TELEGRAM_ID;
    if (adminId) {
      const safeMsg = message.slice(0, 800).replace(/[_*[\]()~`>#+=|{}.!\\-]/g, "\\$&");
      const text = `📬 *New Support Request*\n\n👤 ${name} (${username})\n🆔 Telegram ID: \`${telegramId}\`\n📂 Category: ${catLabel}\n\n💬 *Message:*\n${safeMsg}`;

      try {
        await bot.telegram.sendMessage(Number(adminId), text, {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [[
              { text: "💬 Reply", url: `tg://user?id=${telegramId}` },
            ]],
          },
        });
      } catch (botErr) {
        req.log.error({ botErr }, "Failed to forward support message");
      }
    }

    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "TWA support error");
    res.status(500).json({ success: false, error: "Failed to send" });
  }
});

export default router;
