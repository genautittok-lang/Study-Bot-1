import { Telegraf, session } from "telegraf";
import type { Context } from "telegraf";
import { logger } from "../lib/logger.js";
import {
  MESSAGES,
  REPORT_TYPES,
  SUBJECTS,
} from "./messages.js";
import {
  mainMenuKeyboard,
  reportTypeKeyboard,
  subjectKeyboard,
  paymentKeyboard,
  backToMenuKeyboard,
  afterPaymentKeyboard,
  balanceKeyboard,
} from "./keyboards.js";
import { generateReport } from "./ai.js";
import {
  getOrCreateUser,
  getUser,
  getUserByReferralCode,
  canUserGenerateReport,
  useReport,
  saveReport,
  savePayment,
  addBalance,
  confirmPayment,
  denyPayment,
  processReferral,
} from "./db.js";

interface SessionData {
  step?: string;
  reportType?: string;
  subject?: string;
  topic?: string;
  group?: string;
}

type BotContext = Context & { session: SessionData };

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is required");
}

export const bot = new Telegraf<BotContext>(process.env.TELEGRAM_BOT_TOKEN);

bot.use(session({ defaultSession: (): SessionData => ({}) }));

function getWebAppUrl(): string {
  const domains = process.env.REPLIT_DOMAINS || process.env.REPLIT_DEV_DOMAIN || "";
  const domain = domains.split(",")[0]?.trim();
  if (domain) return `https://${domain}`;
  return "https://localhost";
}

function getAdminIds(): number[] {
  const raw = process.env.ADMIN_IDS || process.env.ADMIN_TELEGRAM_ID || "999999999";
  return raw.split(",").map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
}

async function sendWelcome(ctx: BotContext) {
  const tgUser = ctx.from!;
  const user = await getOrCreateUser(tgUser.id, {
    username: tgUser.username,
    firstName: tgUser.first_name,
    lastName: tgUser.last_name,
  });

  const payload = (ctx.message as any)?.text?.split(" ")[1] || "";
  if (payload.startsWith("ref_")) {
    const refCode = payload.replace("ref_", "");
    try {
      const referrer = await getUserByReferralCode(refCode);
      if (referrer && referrer.telegramId !== tgUser.id && !user.referredBy) {
        await processReferral(referrer.telegramId, tgUser.id);
        logger.info({ referrer: referrer.telegramId, newUser: tgUser.id }, "Referral processed");
        try {
          await bot.telegram.sendMessage(
            referrer.telegramId,
            `🎉 *New referral!*\n\n${tgUser.first_name || "Someone"} joined via your link!\nYou both got *+2 reports* 🎁\n\n🎉 *Новий реферал!*\n${tgUser.first_name || "Хтось"} приєднався за твоїм посиланням!\nВи обидва отримали *+2 звіти* 🎁`,
            { parse_mode: "Markdown" }
          );
        } catch {}
      }
    } catch (err) {
      logger.error({ err }, "Referral error");
    }
  }

  const webAppUrl = getWebAppUrl();

  await ctx.replyWithMarkdown(
    MESSAGES.WELCOME(tgUser.first_name || "Student"),
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🚀 Open StudyFlush", web_app: { url: webAppUrl } }],
          [
            { text: "💰 Balance", callback_data: "balance" },
            { text: "ℹ️ Help", callback_data: "help" },
          ],
        ],
      },
    }
  );
}

bot.start(sendWelcome);

bot.command("menu", async (ctx: BotContext) => {
  const webAppUrl = getWebAppUrl();
  await ctx.replyWithMarkdown("🏠 *Menu / Меню*\n\nChoose an action / Обери дію:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🚀 Open StudyFlush", web_app: { url: webAppUrl } }],
        [{ text: "📄 New report / Новий звіт", callback_data: "new_report" }],
        [
          { text: "💰 Balance", callback_data: "balance" },
          { text: "💳 Buy / Купити", callback_data: "buy" },
        ],
        [{ text: "ℹ️ Help / Довідка", callback_data: "help" }],
      ],
    },
  });
});

bot.command("app", async (ctx: BotContext) => {
  const webAppUrl = getWebAppUrl();
  await ctx.reply("Tap the button below to open StudyFlush / Натисни кнопку:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🚀 Open StudyFlush", web_app: { url: webAppUrl } }],
      ],
    },
  });
});

bot.command("balance", async (ctx: BotContext) => {
  const user = await getUser(ctx.from!.id);
  if (!user) return ctx.reply("❌ Start the bot first / Спочатку запусти бота: /start");

  await ctx.replyWithMarkdown(
    MESSAGES.BALANCE(user.balance, user.freeReportsUsed, user.totalReports),
    balanceKeyboard
  );
});

bot.command("help", async (ctx: BotContext) => {
  await ctx.replyWithMarkdown(MESSAGES.HELP, backToMenuKeyboard);
});

bot.action("main_menu", async (ctx: BotContext) => {
  await ctx.answerCbQuery();
  ctx.session = {};
  const webAppUrl = getWebAppUrl();
  await ctx.editMessageText("🏠 *Menu / Меню*\n\nChoose an action / Обери дію:", {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "🚀 Open StudyFlush", web_app: { url: webAppUrl } }],
        [{ text: "📄 New report / Новий звіт", callback_data: "new_report" }],
        [
          { text: "💰 Balance", callback_data: "balance" },
          { text: "💳 Buy / Купити", callback_data: "buy" },
        ],
      ],
    },
  });
});

bot.action("new_report", async (ctx: BotContext) => {
  await ctx.answerCbQuery();
  ctx.session.step = "select_report_type";
  await ctx.editMessageText(MESSAGES.SELECT_REPORT_TYPE, {
    parse_mode: "Markdown",
    ...reportTypeKeyboard,
  });
});

REPORT_TYPES.forEach(({ id }) => {
  bot.action(`rtype_${id}`, async (ctx: BotContext) => {
    await ctx.answerCbQuery();
    ctx.session.reportType = id;
    ctx.session.step = "select_subject";

    await ctx.editMessageText(MESSAGES.SELECT_SUBJECT, {
      parse_mode: "Markdown",
      ...subjectKeyboard,
    });
  });
});

SUBJECTS.forEach(({ id }) => {
  bot.action(`subject_${id}`, async (ctx: BotContext) => {
    await ctx.answerCbQuery();
    ctx.session.subject = id;
    ctx.session.step = "enter_topic";

    const rt = REPORT_TYPES.find((r) => r.id === ctx.session.reportType);
    const sub = SUBJECTS.find((s) => s.id === id);

    await ctx.editMessageText(
      MESSAGES.ENTER_TOPIC(rt?.label || "", sub?.label || ""),
      { parse_mode: "Markdown" }
    );
  });
});

bot.action("balance", async (ctx: BotContext) => {
  await ctx.answerCbQuery();
  const user = await getUser(ctx.from!.id);
  if (!user) return;

  await ctx.editMessageText(
    MESSAGES.BALANCE(user.balance, user.freeReportsUsed, user.totalReports),
    { parse_mode: "Markdown", ...balanceKeyboard }
  );
});

bot.action("buy", async (ctx: BotContext) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText(
    "💳 *Buy reports / Придбай звіти*\n\n📦 Package: *30 reports*\nChoose payment / Обери спосіб оплати:",
    { parse_mode: "Markdown", ...paymentKeyboard }
  );
});

bot.action("pay_mono", async (ctx: BotContext) => {
  await ctx.answerCbQuery();
  const text = `💳 *Оплата через Monobank*\n\nСума: *250 грн* за 30 звітів\n\n📲 Переведи 250 грн на картку:\n\`\`\`\n5232 4410 5654 6307\n\`\`\`\nОтримувач: *StudyFlush*\n\n⚠️ *ВАЖЛИВО:* В коментарі до переказу вкажи свій Telegram ID:\n\`${ctx.from!.id}\`\n\n📸 *Після оплати надішли скріншот чеку прямо сюди в цей чат* 👇`;

  await ctx.editMessageText(text, {
    parse_mode: "Markdown",
    ...afterPaymentKeyboard,
  });
});

bot.action("pay_crypto", async (ctx: BotContext) => {
  await ctx.answerCbQuery();
  const text = `💎 *Crypto payment / Оплата криптою*\n\nAmount: *5 USDT / 5 USDC*\n\n📍 Wallet address (TRC-20):\n\`\`\`\nTRYbty4Ew9knf61brdrixeY5M34mQTt3zY\n\`\`\`\n\n📸 *After payment, send a screenshot here in this chat* 👇\n📸 *Після оплати надішли скріншот транзакції прямо сюди* 👇`;

  await ctx.editMessageText(text, {
    parse_mode: "Markdown",
    ...afterPaymentKeyboard,
  });
});

bot.action("pay_stars", async (ctx: BotContext) => {
  await ctx.answerCbQuery();
  try {
    await ctx.replyWithInvoice({
      title: "📚 30 reports StudyFlush",
      description: "Pack of 30 AI-generated reports, summaries, or lab work",
      payload: `stars_${ctx.from!.id}_${Date.now()}`,
      currency: "XTR",
      prices: [{ label: "30 reports", amount: 500 }],
    });
  } catch (err) {
    logger.error({ err }, "Failed to send invoice");
    await ctx.reply("⭐ Telegram Stars payment temporarily unavailable. Try another method.");
  }
});

bot.on("pre_checkout_query", async (ctx) => {
  await ctx.answerPreCheckoutQuery(true);
});

bot.on("successful_payment", async (ctx: BotContext) => {
  const payment = ctx.message?.successful_payment;
  if (!payment) return;

  await savePayment({
    telegramId: ctx.from!.id,
    amount: payment.total_amount,
    currency: payment.currency,
    paymentMethod: "stars",
    externalId: payment.telegram_payment_charge_id,
  });

  await addBalance(ctx.from!.id, 30);

  const user = await getUser(ctx.from!.id);
  await ctx.replyWithMarkdown(
    `✅ *Payment successful!*\n\nYour balance has been topped up by *30 reports*!\n💰 Current balance: *${user?.balance ?? 30} reports*\n\nThank you! Start generating 🚀`,
    mainMenuKeyboard
  );
});

bot.action("payment_confirm", async (ctx: BotContext) => {
  await ctx.answerCbQuery();
  await savePayment({
    telegramId: ctx.from!.id,
    amount: 250,
    currency: "UAH",
    paymentMethod: "manual",
  });

  await ctx.editMessageText(
    "⏳ *Waiting for confirmation / Очікуємо підтвердження*\n\nWe're verifying your payment. Usually takes up to 24 hours.\nYou'll receive a notification once confirmed! 🎉\n\n📸 You can also send a screenshot of your receipt here.",
    { parse_mode: "Markdown", ...backToMenuKeyboard }
  );
});

bot.action("help", async (ctx: BotContext) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText(MESSAGES.HELP, {
    parse_mode: "Markdown",
    ...backToMenuKeyboard,
  });
});

bot.action(/^approve_pay_(\d+)$/, async (ctx: BotContext) => {
  await ctx.answerCbQuery("✅ Processing...");
  const paymentId = parseInt(ctx.match[1], 10);
  try {
    const payment = await confirmPayment(paymentId);
    if (!payment) {
      await ctx.editMessageCaption("⚠️ Payment not found or already processed.", { parse_mode: "Markdown" });
      return;
    }
    const user = await getUser(payment.telegramId);
    const newBalance = user?.balance ?? payment.reportsAdded;
    await ctx.editMessageCaption(
      `✅ *Payment #${paymentId} CONFIRMED*\n\nUser received +${payment.reportsAdded} reports.\nNew balance: ${newBalance} reports.`,
      { parse_mode: "Markdown" }
    );
    await bot.telegram.sendMessage(
      payment.telegramId,
      `🎉 *Payment confirmed!*\n\nYour balance has been topped up by *${payment.reportsAdded} reports*!\n💰 Current balance: *${newBalance} reports*\n\nEnjoy! 🚀`,
      { parse_mode: "Markdown", ...mainMenuKeyboard }
    );
  } catch (err) {
    logger.error({ err }, "approve_pay error");
    await ctx.answerCbQuery("❌ Error");
  }
});

bot.action(/^reject_pay_(\d+)$/, async (ctx: BotContext) => {
  await ctx.answerCbQuery("❌ Processing...");
  const paymentId = parseInt(ctx.match[1], 10);
  try {
    const payment = await denyPayment(paymentId);
    if (!payment) {
      await ctx.editMessageCaption("⚠️ Payment not found or already processed.", { parse_mode: "Markdown" });
      return;
    }
    await ctx.editMessageCaption(
      `❌ *Payment #${paymentId} REJECTED*\n\nBalance not topped up.`,
      { parse_mode: "Markdown" }
    );
    await bot.telegram.sendMessage(
      payment.telegramId,
      `❌ *Payment rejected*\n\nUnfortunately your payment was not confirmed.\n\nIf this is a mistake — please send the receipt screenshot here and we'll check again.`,
      { parse_mode: "Markdown", ...mainMenuKeyboard }
    );
  } catch (err) {
    logger.error({ err }, "reject_pay error");
    await ctx.answerCbQuery("❌ Error");
  }
});

bot.on("photo", async (ctx: BotContext) => {
  const adminIds = getAdminIds();
  const fromId = ctx.from!.id;

  if (adminIds.includes(fromId)) return;

  const photo = ctx.message.photo;
  const bestPhoto = photo[photo.length - 1];
  const caption = (ctx.message as any).caption || "";

  await savePayment({
    telegramId: fromId,
    amount: 250,
    currency: "UAH",
    paymentMethod: "manual",
  });

  await ctx.replyWithMarkdown(
    "📸 *Receipt received!*\n\nWe've forwarded your screenshot to the admin for verification.\nYou'll be notified once confirmed (usually within 24 hours).\n\n✅ Скріншот отримано! Адмін перевірить та підтвердить оплату."
  );

  for (const adminId of adminIds) {
    try {
      await bot.telegram.sendPhoto(adminId, bestPhoto.file_id, {
        caption: `💳 *New payment screenshot*\n\nFrom: ${ctx.from!.first_name || ""} ${ctx.from!.last_name || ""}\nUsername: @${ctx.from!.username || "—"}\nTelegram ID: \`${fromId}\`\n\n${caption ? `Message: ${caption}` : "No caption"}`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "✅ Approve", callback_data: `approve_user_${fromId}` },
              { text: "❌ Reject", callback_data: `reject_user_${fromId}` },
            ],
          ],
        },
      });
    } catch (err) {
      logger.error({ err, adminId }, "Failed to forward screenshot to admin");
    }
  }
});

bot.action(/^approve_user_(\d+)$/, async (ctx: BotContext) => {
  await ctx.answerCbQuery("✅ Approving...");
  const userId = parseInt(ctx.match[1], 10);
  try {
    await addBalance(userId, 30);
    const user = await getUser(userId);
    const newBalance = user?.balance ?? 30;

    await ctx.editMessageCaption(
      `✅ *APPROVED* — User ${userId} received +30 reports.\nNew balance: ${newBalance}`,
      { parse_mode: "Markdown" }
    );

    await bot.telegram.sendMessage(
      userId,
      `🎉 *Payment confirmed!*\n\nYour balance has been topped up by *30 reports*!\n💰 Current balance: *${newBalance} reports*\n\n✅ *Оплату підтверджено!*\nБаланс поповнено на *30 звітів*!\n\nEnjoy! 🚀`,
      { parse_mode: "Markdown", ...mainMenuKeyboard }
    );
  } catch (err) {
    logger.error({ err }, "approve_user error");
  }
});

bot.action(/^reject_user_(\d+)$/, async (ctx: BotContext) => {
  await ctx.answerCbQuery("❌ Rejecting...");
  const userId = parseInt(ctx.match[1], 10);
  try {
    await ctx.editMessageCaption(
      `❌ *REJECTED* — User ${userId} payment not confirmed.`,
      { parse_mode: "Markdown" }
    );

    await bot.telegram.sendMessage(
      userId,
      `❌ *Payment not confirmed*\n\nPlease send a clearer screenshot or try again.\n\n❌ *Оплата не підтверджена*\nНадішли чіткіший скріншот або спробуй ще раз.`,
      { parse_mode: "Markdown", ...mainMenuKeyboard }
    );
  } catch (err) {
    logger.error({ err }, "reject_user error");
  }
});

bot.on("text", async (ctx: BotContext) => {
  const step = ctx.session.step;
  const text = ctx.message.text;

  if (text.startsWith("/")) return;

  if (step === "enter_topic") {
    ctx.session.topic = text;
    ctx.session.step = "enter_group";

    await ctx.replyWithMarkdown(
      "👥 *Enter group/class (optional)*\n\nE.g.: IT-21, 11-A\n\nOr send /skip to skip"
    );
    return;
  }

  if (step === "enter_group" || text === "/skip") {
    const group = text === "/skip" ? null : text;
    ctx.session.group = group || undefined;
    ctx.session.step = undefined;

    const telegramId = ctx.from!.id;
    const check = await canUserGenerateReport(telegramId);

    if (!check.canGenerate) {
      await ctx.replyWithMarkdown(MESSAGES.NO_BALANCE, paymentKeyboard);
      return;
    }

    const loadingMsg = await ctx.replyWithMarkdown(MESSAGES.GENERATING);

    try {
      const content = await generateReport(
        ctx.session.reportType!,
        ctx.session.subject!,
        ctx.session.topic!,
        group
      );

      await useReport(telegramId);
      await saveReport({
        telegramId,
        subject: ctx.session.subject!,
        reportType: ctx.session.reportType!,
        group: group,
        topic: ctx.session.topic!,
        content,
      });

      ctx.session = {};

      await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);

      const chunks = splitMessage(content, 4000);
      for (let i = 0; i < chunks.length; i++) {
        if (i === chunks.length - 1) {
          await ctx.replyWithMarkdown(
            `✅ *Done!*\n\n${chunks[i]}`,
            mainMenuKeyboard
          );
        } else {
          await ctx.replyWithMarkdown(chunks[i]);
        }
      }
    } catch (err) {
      logger.error({ err }, "Failed to generate report");
      await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);
      await ctx.replyWithMarkdown(
        "❌ *Generation error*\n\nPlease try again. If the problem persists — send /help",
        mainMenuKeyboard
      );
    }
    return;
  }

  const webAppUrl = getWebAppUrl();
  await ctx.replyWithMarkdown("🏠 Use the app or menu / Скористайся додатком:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🚀 Open StudyFlush", web_app: { url: webAppUrl } }],
        [{ text: "📄 New report", callback_data: "new_report" }],
      ],
    },
  });
});

function splitMessage(text: string, maxLength: number): string[] {
  if (text.length <= maxLength) return [text];

  const chunks: string[] = [];
  let current = "";
  const lines = text.split("\n");

  for (const line of lines) {
    if ((current + "\n" + line).length > maxLength) {
      if (current) chunks.push(current);
      current = line;
    } else {
      current = current ? current + "\n" + line : line;
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

export function startBot() {
  logger.info("Starting Telegram bot...");
  bot.launch().then(() => {
    logger.info("Telegram bot started successfully");
  }).catch((err) => {
    logger.error({ err }, "Failed to start Telegram bot");
  });

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}
