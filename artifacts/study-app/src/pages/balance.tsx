import { useState } from "react";
import { useUser, useLang } from "@/lib/store";
import { createPayment } from "@/lib/api";
import { hapticFeedback, hapticSuccess } from "@/lib/telegram";
import { t } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";

type PaymentView = "main" | "card" | "google" | "apple" | "crypto" | "stars" | "pending";

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

  if (view === "card") {
    return (
      <motion.div {...slideIn} className="px-4 pt-6 pb-4">
        <BackBtn />
        <div className="card-premium card-glow rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
            </div>
            <div>
              <div className="font-bold">{t("visaMastercard")}</div>
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
            <div className="text-amber-700">{t("cardNote")}<div className="font-mono font-bold mt-1">{user?.telegramId}</div></div>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => handlePaymentConfirm("card")}
          className="w-full premium-btn py-3.5 font-bold text-sm flex items-center justify-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
          {t("iPaid")}
        </motion.button>
      </motion.div>
    );
  }

  if (view === "google") {
    return (
      <motion.div {...slideIn} className="px-4 pt-6 pb-4">
        <BackBtn />
        <div className="card-premium card-glow rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-white border-2 border-gray-100 rounded-xl flex items-center justify-center shadow-lg">
              <svg width="24" height="24" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            </div>
            <div>
              <div className="font-bold">{t("googlePay")}</div>
              <div className="text-sm text-muted-foreground">250 UAH = {t("reports15")}</div>
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => handlePaymentConfirm("google_pay")}
            className="w-full bg-black text-white rounded-2xl py-4 font-bold text-base flex items-center justify-center gap-3 shadow-xl shadow-black/20">
            <svg width="24" height="24" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            {t("payAmount")} 250 ₴
          </motion.button>
          <p className="text-xs text-muted-foreground text-center mt-3">Google Pay</p>
        </div>
      </motion.div>
    );
  }

  if (view === "apple") {
    return (
      <motion.div {...slideIn} className="px-4 pt-6 pb-4">
        <BackBtn />
        <div className="card-premium card-glow rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-lg">
              <svg width="20" height="24" viewBox="0 0 170 200" fill="white"><path d="M150.37 130.25c-.27 2.97-1.69 6.86-4.25 11.66-3.83 7.14-8.85 14.17-14.41 14.41-5.56.24-7.34-3.3-15.08-3.3-7.74 0-9.7 3.06-14.97 3.54-6.1.57-10.73-7.74-14.56-14.88-7.8-14.54-13.72-41.02-5.72-58.92 3.96-8.86 11.06-14.88 18.75-15.12 5.37-.2 10.44 3.62 13.72 3.62 3.28 0 9.42-4.48 15.88-3.82 2.7.11 10.3 1.09 15.17 8.24-.39.25-9.05 5.28-8.95 15.76.11 12.52 10.97 16.68 11.1 16.73-.12.34-1.74 5.94-5.68 11.88zM119.11 24c-6.91 8.15-14.6 6.73-14.6 6.73s-.76-6.72 5.72-13.08c7.04-6.93 14.26-5.82 14.26-5.82s.85 6.57-5.38 12.17z"/></svg>
            </div>
            <div>
              <div className="font-bold">{t("applePay")}</div>
              <div className="text-sm text-muted-foreground">250 UAH = {t("reports15")}</div>
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => handlePaymentConfirm("apple_pay")}
            className="w-full bg-black text-white rounded-2xl py-4 font-bold text-base flex items-center justify-center gap-3 shadow-xl shadow-black/20">
            <svg width="16" height="20" viewBox="0 0 170 200" fill="white"><path d="M150.37 130.25c-.27 2.97-1.69 6.86-4.25 11.66-3.83 7.14-8.85 14.17-14.41 14.41-5.56.24-7.34-3.3-15.08-3.3-7.74 0-9.7 3.06-14.97 3.54-6.1.57-10.73-7.74-14.56-14.88-7.8-14.54-13.72-41.02-5.72-58.92 3.96-8.86 11.06-14.88 18.75-15.12 5.37-.2 10.44 3.62 13.72 3.62 3.28 0 9.42-4.48 15.88-3.82 2.7.11 10.3 1.09 15.17 8.24-.39.25-9.05 5.28-8.95 15.76.11 12.52 10.97 16.68 11.1 16.73-.12.34-1.74 5.94-5.68 11.88zM119.11 24c-6.91 8.15-14.6 6.73-14.6 6.73s-.76-6.72 5.72-13.08c7.04-6.93 14.26-5.82 14.26-5.82s.85 6.57-5.38 12.17z"/></svg>
            {t("payAmount")} 250 ₴
          </motion.button>
          <p className="text-xs text-muted-foreground text-center mt-3">Apple Pay</p>
        </div>
      </motion.div>
    );
  }

  if (view === "crypto") {
    return (
      <motion.div {...slideIn} className="px-4 pt-6 pb-4">
        <BackBtn />
        <div className="card-premium card-glow rounded-2xl p-5 mb-4">
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
        <div className="card-premium card-glow rounded-2xl p-5 mb-4">
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
          className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-green-500/25 pulse-glow"
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

  const paymentMethods = [
    { key: "card" as PaymentView, label: t("visaMastercard"), sub: t("cardPayment"), price: "250 ₴",
      gradient: "from-blue-500 to-indigo-600", shadow: "shadow-blue-500/20",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg> },
    { key: "google" as PaymentView, label: t("googlePay"), sub: t("googlePayDesc"), price: "250 ₴",
      gradient: "from-white to-gray-50", shadow: "shadow-gray-300/30", border: true,
      icon: <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> },
    { key: "apple" as PaymentView, label: t("applePay"), sub: t("applePayDesc"), price: "250 ₴",
      gradient: "from-gray-900 to-black", shadow: "shadow-black/20",
      icon: <svg width="16" height="20" viewBox="0 0 170 200" fill="white"><path d="M150.37 130.25c-.27 2.97-1.69 6.86-4.25 11.66-3.83 7.14-8.85 14.17-14.41 14.41-5.56.24-7.34-3.3-15.08-3.3-7.74 0-9.7 3.06-14.97 3.54-6.1.57-10.73-7.74-14.56-14.88-7.8-14.54-13.72-41.02-5.72-58.92 3.96-8.86 11.06-14.88 18.75-15.12 5.37-.2 10.44 3.62 13.72 3.62 3.28 0 9.42-4.48 15.88-3.82 2.7.11 10.3 1.09 15.17 8.24-.39.25-9.05 5.28-8.95 15.76.11 12.52 10.97 16.68 11.1 16.73-.12.34-1.74 5.94-5.68 11.88zM119.11 24c-6.91 8.15-14.6 6.73-14.6 6.73s-.76-6.72 5.72-13.08c7.04-6.93 14.26-5.82 14.26-5.82s.85 6.57-5.38 12.17z"/></svg> },
    { key: "crypto" as PaymentView, label: t("crypto"), sub: t("cryptoDesc"), price: "5 $",
      gradient: "from-violet-400 to-purple-600", shadow: "shadow-purple-500/20",
      icon: <span className="text-xl">💎</span> },
    { key: "stars" as PaymentView, label: t("telegramStars"), sub: t("payViaTelegram"), price: "500 ⭐",
      gradient: "from-amber-400 to-yellow-500", shadow: "shadow-yellow-500/20",
      icon: <span className="text-xl">⭐</span> },
  ];

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
        <div className="absolute inset-0 shimmer-bg" />
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
        <h3 className="font-bold text-sm mb-3">{t("choosePayment")}</h3>
        <div className="space-y-2.5">
          {paymentMethods.map((item, i) => (
            <motion.button
              key={item.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { hapticFeedback("light"); setView(item.key); }}
              className="w-full card-premium rounded-2xl p-4 text-left flex items-center gap-4"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center shrink-0 shadow-lg ${item.shadow} ${(item as any).border ? "border border-gray-200" : ""}`}>
                {item.icon}
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
