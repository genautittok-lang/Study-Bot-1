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
  canUserGenerateReport,
  useReport,
  saveReport,
  savePayment,
  addBalance,
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

async function sendWelcome(ctx: BotContext) {
  const tgUser = ctx.from!;
  await getOrCreateUser(tgUser.id, {
    username: tgUser.username,
    firstName: tgUser.first_name,
    lastName: tgUser.last_name,
  });

  const webAppUrl = getWebAppUrl();

  await ctx.replyWithMarkdown(
    MESSAGES.WELCOME(tgUser.first_name || "Студент"),
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🚀 Відкрити StudyPro", web_app: { url: webAppUrl } }],
          [
            { text: "💰 Баланс", callback_data: "balance" },
            { text: "ℹ️ Довідка", callback_data: "help" },
          ],
        ],
      },
    }
  );
}

bot.start(sendWelcome);

bot.command("menu", async (ctx: BotContext) => {
  const webAppUrl = getWebAppUrl();
  await ctx.replyWithMarkdown("🏠 *Головне меню*\n\nОбери дію:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🚀 Відкрити StudyPro", web_app: { url: webAppUrl } }],
        [{ text: "📄 Новий звіт (тут)", callback_data: "new_report" }],
        [
          { text: "💰 Баланс", callback_data: "balance" },
          { text: "💳 Купити", callback_data: "buy" },
        ],
        [{ text: "ℹ️ Довідка", callback_data: "help" }],
      ],
    },
  });
});

bot.command("app", async (ctx: BotContext) => {
  const webAppUrl = getWebAppUrl();
  await ctx.reply("Натисни кнопку нижче, щоб відкрити StudyPro:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🚀 Відкрити StudyPro", web_app: { url: webAppUrl } }],
      ],
    },
  });
});

bot.command("balance", async (ctx: BotContext) => {
  const user = await getUser(ctx.from!.id);
  if (!user) return ctx.reply("❌ Спочатку запусти бота командою /start");

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
  await ctx.editMessageText("🏠 *Головне меню*\n\nОбери дію:", {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "🚀 Відкрити StudyPro", web_app: { url: webAppUrl } }],
        [{ text: "📄 Новий звіт (тут)", callback_data: "new_report" }],
        [
          { text: "💰 Баланс", callback_data: "balance" },
          { text: "💳 Купити", callback_data: "buy" },
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
    "💳 *Придбай звіти*\n\n📦 Пакет: *15 звітів*\nОбери спосіб оплати:",
    { parse_mode: "Markdown", ...paymentKeyboard }
  );
});

bot.action("pay_mono", async (ctx: BotContext) => {
  await ctx.answerCbQuery();
  const text = `💳 *Оплата через Monobank*\n\nСума: *250 грн* за 15 звітів\n\n📲 Переведи 250 грн на картку:\n\`\`\`\n5375 4141 2121 2120\n\`\`\`\nОтримувач: *StudyPro*\n\n⚠️ *ВАЖЛИВО:* В коментарі до переказу вкажи свій Telegram ID:\n\`${ctx.from!.id}\`\n\nПісля оплати натисни кнопку нижче:`;

  await ctx.editMessageText(text, {
    parse_mode: "Markdown",
    ...afterPaymentKeyboard,
  });
});

bot.action("pay_crypto", async (ctx: BotContext) => {
  await ctx.answerCbQuery();
  const text = `💎 *Оплата в криптовалюті*\n\nСума: *5 USDT* або *5 USDC*\n\n📍 Адреса гаманця (TRC-20):\n\`\`\`\nTLdH6NMj7g3jKcB6pnEPr5wfbUjqTe5GxP\n\`\`\`\n\n⚠️ Після оплати надішли хеш транзакції та натисни кнопку:`;

  await ctx.editMessageText(text, {
    parse_mode: "Markdown",
    ...afterPaymentKeyboard,
  });
});

bot.action("pay_stars", async (ctx: BotContext) => {
  await ctx.answerCbQuery();
  try {
    await ctx.replyWithInvoice({
      title: "📚 15 звітів StudyPro",
      description: "Пакет із 15 AI-згенерованих звітів, конспектів або лабораторних",
      payload: `stars_${ctx.from!.id}_${Date.now()}`,
      currency: "XTR",
      prices: [{ label: "15 звітів", amount: 500 }],
    });
  } catch (err) {
    logger.error({ err }, "Failed to send invoice");
    await ctx.reply("⭐ Оплата через Telegram Stars тимчасово недоступна. Спробуй інший спосіб.");
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

  await addBalance(ctx.from!.id, 15);

  const user = await getUser(ctx.from!.id);
  await ctx.replyWithMarkdown(
    `✅ *Оплата успішна!*\n\nТвій баланс поповнено на *15 звітів*!\n💰 Поточний баланс: *${user?.balance ?? 15} звітів*`,
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
    "⏳ *Очікуємо підтвердження оплати*\n\nМи перевіряємо твою оплату. Зазвичай це займає до 24 годин.\nПісля підтвердження ти отримаєш повідомлення! 🎉",
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

bot.on("text", async (ctx: BotContext) => {
  const step = ctx.session.step;
  const text = ctx.message.text;

  if (text.startsWith("/")) return;

  if (step === "enter_topic") {
    ctx.session.topic = text;
    ctx.session.step = "enter_group";

    await ctx.replyWithMarkdown(
      "👥 *Введи групу/клас (необов'язково)*\n\nНаприклад: ІТ-21, 11-А\n\nАбо відправ /skip щоб пропустити"
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
            `✅ *Готово!*\n\n${chunks[i]}`,
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
        "❌ *Помилка генерації*\n\nСпробуй ще раз. Якщо проблема не вирішується — напиши @studypro_support",
        mainMenuKeyboard
      );
    }
    return;
  }

  const webAppUrl = getWebAppUrl();
  await ctx.replyWithMarkdown("🏠 Скористайся додатком або меню:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🚀 Відкрити StudyPro", web_app: { url: webAppUrl } }],
        [{ text: "📄 Новий звіт", callback_data: "new_report" }],
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
