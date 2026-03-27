import { Markup } from "telegraf";
import { REPORT_TYPES, SUBJECTS } from "./messages.js";

export const mainMenuKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback("📄 Новий звіт", "new_report")],
  [
    Markup.button.callback("💰 Баланс", "balance"),
    Markup.button.callback("💳 Купити звіти", "buy"),
  ],
  [Markup.button.callback("ℹ️ Довідка", "help")],
]);

export const reportTypeKeyboard = Markup.inlineKeyboard([
  ...REPORT_TYPES.map((type) => [
    Markup.button.callback(type.label, `rtype_${type.id}`),
  ]),
  [Markup.button.callback("⬅️ Назад", "main_menu")],
]);

export const subjectKeyboard = Markup.inlineKeyboard([
  ...SUBJECTS.map((sub) => [
    Markup.button.callback(sub.label, `subject_${sub.id}`),
  ]),
  [Markup.button.callback("⬅️ Назад", "new_report")],
]);

export const paymentKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback("💳 Monobank (250 грн)", "pay_mono")],
  [Markup.button.callback("💎 Криптовалюта (5$)", "pay_crypto")],
  [Markup.button.callback("⭐ Telegram Stars (500)", "pay_stars")],
  [Markup.button.callback("⬅️ Назад", "main_menu")],
]);

export const backToMenuKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback("🏠 Головне меню", "main_menu")],
]);

export const afterPaymentKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback("✅ Я оплатив", "payment_confirm")],
  [Markup.button.callback("⬅️ Назад", "buy")],
]);

export const skipGroupKeyboard = Markup.keyboard([["/skip"]])
  .oneTime()
  .resize();

export const balanceKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback("💳 Придбати звіти", "buy")],
  [Markup.button.callback("🏠 Головне меню", "main_menu")],
]);
