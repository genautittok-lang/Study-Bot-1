import { useState } from "react";
import { useUser, useLang } from "@/lib/store";
import { hapticFeedback, hapticSuccess } from "@/lib/telegram";
import { t } from "@/lib/i18n";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { sendSupportMessage } from "@/lib/api";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const CATEGORIES = [
  { id: "payment", icon: "💳", key: "supportCatPayment" as const },
  { id: "generation", icon: "⚙️", key: "supportCatGeneration" as const },
  { id: "bug", icon: "🐛", key: "supportCatBug" as const },
  { id: "feature", icon: "💡", key: "supportCatFeature" as const },
  { id: "other", icon: "📩", key: "supportCatOther" as const },
];

export default function Support() {
  const user = useUser();
  const [, go] = useLocation();
  useLang();
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const a = (i: number) => ({
    initial: { opacity: 0, y: 16 } as const,
    animate: { opacity: 1, y: 0 } as const,
    transition: { delay: i * 0.06, duration: 0.4, ease },
  });

  async function handleSubmit() {
    if (!message.trim() || !user) return;
    hapticFeedback("medium");
    setSending(true);
    try {
      await sendSupportMessage({
        telegramId: user.telegramId,
        category,
        message: message.trim(),
      });
      hapticSuccess();
      setSent(true);
    } catch {
      hapticFeedback("heavy");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="px-4 pt-5 pb-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease }}
          className="flex flex-col items-center text-center pt-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="w-20 h-20 rounded-[24px] flex items-center justify-center mb-6"
            style={{ background: "rgba(16,185,129,0.08)" }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </motion.div>
          <h2 className="text-[22px] font-extrabold tracking-tight mb-2">{t("supportSent")}</h2>
          <p className="text-[13px] text-[#8b90a0] leading-relaxed max-w-[280px] mb-8">
            {t("supportSentDesc")}
          </p>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => { hapticFeedback("light"); go("/profile"); }}
            className="btn-main px-8 py-3.5 text-[14px]"
          >
            {t("goBack")}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-5 pb-4">
      <motion.div {...a(0)} className="mb-5">
        <h1 className="text-[24px] font-extrabold tracking-tight mb-1">{t("supportTitle")}</h1>
        <p className="text-[13px] text-[#8b90a0]">{t("supportDesc")}</p>
      </motion.div>

      <motion.div {...a(1)} className="g-card rounded-[22px] p-4 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-[42px] h-[42px] rounded-[14px] flex items-center justify-center shrink-0"
            style={{ background: "rgba(124,92,252,0.06)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <div className="font-bold text-[14px]">{t("supportFormTitle")}</div>
            <div className="text-[11px] text-[#9ca3af] mt-0.5">{t("supportFormDesc")}</div>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-[11px] font-bold text-[#8b90a0] uppercase tracking-wider mb-2 block px-0.5">
            {t("supportCategory")}
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = category === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => { hapticFeedback("light"); setCategory(active ? "" : cat.id); }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-[12px] text-[12px] font-semibold transition-all"
                  style={{
                    background: active ? "rgba(124,92,252,0.08)" : "rgba(0,0,0,0.02)",
                    border: `1.5px solid ${active ? "rgba(124,92,252,0.2)" : "rgba(0,0,0,0.04)"}`,
                    color: active ? "#7C5CFC" : "#6b7280",
                  }}
                >
                  <span className="text-[14px]">{cat.icon}</span>
                  {t(cat.key)}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-[11px] font-bold text-[#8b90a0] uppercase tracking-wider mb-2 block px-0.5">
            {t("supportMessageLabel")}
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("supportMessagePlaceholder")}
            rows={5}
            className="input-field resize-none text-[14px] leading-relaxed"
            style={{ borderRadius: 18 }}
          />
          <div className="flex items-center justify-between mt-1.5 px-1">
            <span className="text-[10px] text-[#c4c4d0]">{message.length}/1000</span>
            {user && (
              <span className="text-[10px] text-[#c4c4d0]">ID: {user.telegramId}</span>
            )}
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleSubmit}
          disabled={!message.trim() || sending}
          className="w-full btn-main py-[14px] text-[14px] flex items-center justify-center gap-2"
        >
          {sending ? (
            <>
              <div className="w-4 h-4 spinner" />
              {t("submitting")}
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
              {t("supportSend")}
            </>
          )}
        </motion.button>
      </motion.div>

      <motion.div {...a(2)} className="g-card rounded-[18px] p-3.5 mb-3">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-[34px] h-[34px] rounded-[11px] flex items-center justify-center shrink-0"
            style={{ background: "rgba(59,130,246,0.06)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-[13px]">{t("supportInfo")}</div>
          </div>
        </div>
        <div className="space-y-2 pl-[46px]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#6b7280]">{t("supportResponseTime")}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#6b7280]">{t("supportBotNote")}</span>
          </div>
        </div>
      </motion.div>

      <motion.div {...a(3)}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { hapticFeedback("light"); window.open("https://t.me/studyflush_bot", "_blank"); }}
          className="w-full g-card rounded-[18px] p-3.5 flex items-center gap-3"
        >
          <div className="w-[38px] h-[38px] rounded-[12px] flex items-center justify-center shrink-0"
            style={{ background: "rgba(0,196,140,0.06)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5">
              <path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold text-[13px]">{t("supportViaTelegram")}</div>
            <div className="text-[11px] text-[#9ca3af] mt-0.5">@studyflush_bot</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </motion.button>
      </motion.div>
    </div>
  );
}
