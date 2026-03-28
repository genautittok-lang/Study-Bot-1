import { useState } from "react";
import { useUser, useLang } from "@/lib/store";
import { createPayment } from "@/lib/api";
import { hapticFeedback, hapticSuccess } from "@/lib/telegram";
import { t } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";

type PaymentView = "main" | "mono" | "crypto" | "stars" | "pending";

const slideIn = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
};

export default function Balance() {
  const user = useUser();
  useLang();
  const [view, setView] = useState<PaymentView>("main");

  const availableReports = user ? (!user.freeReportsUsed ? user.balance + 1 : user.balance) : 0;

  async function handlePaymentConfirm(method: string) {
    if (!user) return;
    hapticFeedback("medium");
    await createPayment({ telegramId: user.telegramId, paymentMethod: method });
    hapticSuccess();
    setView("pending");
  }

  function BackBtn() {
    return (
      <motion.button whileTap={{ scale: 0.96 }} onClick={() => { hapticFeedback("light"); setView("main"); }}
        className="text-primary text-sm font-semibold mb-4 flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        {t("back")}
      </motion.button>
    );
  }

  if (view === "mono") {
    return (
      <motion.div {...slideIn} className="px-4 pt-6 pb-4">
        <BackBtn />
        <div className="card-premium rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
              <span className="text-2xl text-white">💳</span>
            </div>
            <div>
              <div className="font-bold">{t("monobank")}</div>
              <div className="text-sm text-muted-foreground">250 UAH = {t("reports15")}</div>
            </div>
          </div>
          <div className="bg-muted rounded-xl p-3 mb-4">
            <div className="text-xs text-muted-foreground mb-1">{t("cardNumber")}</div>
            <div className="font-mono text-lg font-bold tracking-wider">5375 4141 2121 2120</div>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm">
            <div className="font-semibold text-amber-800 mb-1 flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
              {t("important")}
            </div>
            <div className="text-amber-700">{t("monoNote")}<div className="font-mono font-bold mt-1">{user?.telegramId}</div></div>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => handlePaymentConfirm("mono")}
          className="w-full premium-btn py-3.5 font-bold text-sm flex items-center justify-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
          {t("iPaid")}
        </motion.button>
      </motion.div>
    );
  }

  if (view === "crypto") {
    return (
      <motion.div {...slideIn} className="px-4 pt-6 pb-4">
        <BackBtn />
        <div className="card-premium rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-2xl text-white">💎</span>
            </div>
            <div>
              <div className="font-bold">{t("crypto")}</div>
              <div className="text-sm text-muted-foreground">5 USDT = {t("reports15")}</div>
            </div>
          </div>
          <div className="bg-muted rounded-xl p-3 mb-4">
            <div className="text-xs text-muted-foreground mb-1">{t("cryptoAddress")}</div>
            <div className="font-mono text-xs font-bold break-all">TLdH6NMj7g3jKcB6pnEPr5wfbUjqTe5GxP</div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-700">
            {t("cryptoNote")}
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => handlePaymentConfirm("crypto")}
          className="w-full premium-btn py-3.5 font-bold text-sm flex items-center justify-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
          {t("iPaid")}
        </motion.button>
      </motion.div>
    );
  }

  if (view === "stars") {
    return (
      <motion.div {...slideIn} className="px-4 pt-6 pb-4">
        <BackBtn />
        <div className="card-premium rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <span className="text-2xl">⭐</span>
            </div>
            <div>
              <div className="font-bold">{t("telegramStars")}</div>
              <div className="text-sm text-muted-foreground">500 Stars = {t("reports15")}</div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-700">
            {t("starsNote")}
            <div className="font-mono font-bold mt-1">/buy_stars</div>
            {t("starsCmd")}
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => handlePaymentConfirm("stars")}
          className="w-full premium-btn py-3.5 font-bold text-sm">{t("payInBot")}</motion.button>
      </motion.div>
    );
  }

  if (view === "pending") {
    return (
      <motion.div {...slideIn} className="px-4 pt-20 pb-4 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-green-500/25"
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
        </motion.div>
        <h2 className="text-xl font-bold mb-2">{t("thankYou")}</h2>
        <p className="text-muted-foreground text-sm text-center max-w-[260px] mb-6">{t("paymentPending")}</p>
        <motion.button whileTap={{ scale: 0.96 }} onClick={() => setView("main")}
          className="bg-secondary text-secondary-foreground rounded-xl px-6 py-3 font-semibold text-sm">{t("goBack")}</motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-6 pb-4">
      <h2 className="text-xl font-bold mb-1">{t("balance")}</h2>
      <p className="text-muted-foreground text-sm mb-5">{t("manageReports")}</p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-5 mb-6 text-white shadow-2xl shadow-primary/25"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-500 to-violet-600" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white/80">{t("availableReports")}</span>
            <span className="text-sm text-white/60">{t("total")}: {user?.totalReports || 0}</span>
          </div>
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="text-5xl font-black mb-1 tabular-nums"
          >
            {availableReports}
          </motion.div>
          {!user?.freeReportsUsed && (
            <div className="mt-2 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-1.5 inline-block text-sm font-semibold">
              🎁 {t("freeReport")}
            </div>
          )}
        </div>
      </motion.div>

      <div className="mb-4">
        <h3 className="font-bold text-sm mb-3">{t("topUpBalance")}</h3>
        <div className="space-y-2.5">
          {[
            { key: "mono", label: t("monobank"), sub: t("cardTransfer"), price: "250 ₴", icon: "💳",
              gradient: "from-emerald-400 to-green-600", shadow: "shadow-green-500/20" },
            { key: "crypto", label: t("crypto"), sub: t("cryptoDesc"), price: "5 $", icon: "💎",
              gradient: "from-violet-400 to-purple-600", shadow: "shadow-purple-500/20" },
            { key: "stars", label: t("telegramStars"), sub: t("payViaTelegram"), price: "500 ⭐", icon: "⭐",
              gradient: "from-amber-400 to-yellow-500", shadow: "shadow-yellow-500/20" },
          ].map((item, i) => (
            <motion.button
              key={item.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { hapticFeedback("light"); setView(item.key as PaymentView); }}
              className="w-full card-premium rounded-2xl p-4 text-left flex items-center gap-4"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center shrink-0 shadow-lg ${item.shadow}`}>
                <span className="text-xl">{item.icon}</span>
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.sub}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm text-foreground">{item.price}</div>
                <div className="text-xs text-muted-foreground">{t("reports15")}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
