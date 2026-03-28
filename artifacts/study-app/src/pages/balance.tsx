import { useState } from "react";
import { useUser, useLang } from "@/lib/store";
import { createPayment } from "@/lib/api";
import { hapticFeedback, hapticSuccess } from "@/lib/telegram";
import { t } from "@/lib/i18n";
import { motion } from "framer-motion";

type View = "main" | "card" | "google" | "apple" | "crypto" | "stars" | "pending";

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.95 }} onClick={() => { hapticFeedback("light"); onClick(); }}
      className="text-muted-foreground text-[13px] font-medium mb-4 flex items-center gap-1 active:text-foreground transition-colors">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
      {t("back")}
    </motion.button>
  );
}

export default function Balance() {
  const user = useUser();
  useLang();
  const [view, setView] = useState<View>("main");

  const balance = user ? (!user.freeReportsUsed ? user.balance + 1 : user.balance) : 0;

  async function confirm(method: string) {
    if (!user) return;
    hapticFeedback("medium");
    await createPayment({ telegramId: user.telegramId, paymentMethod: method });
    hapticSuccess();
    setView("pending");
  }

  if (view === "card") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-6 pb-4">
        <BackBtn onClick={() => setView("main")} />
        <div className="card-static rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-12 h-12 hero-card rounded-[14px] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" className="relative z-10"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
            </div>
            <div>
              <div className="font-bold text-[15px]">{t("visaMastercard")}</div>
              <div className="text-[12px] text-muted-foreground/60">250 ₴ = {t("reports15")}</div>
            </div>
          </div>
          <div className="bg-muted/40 rounded-xl p-4 mb-4">
            <div className="text-[10px] text-muted-foreground/50 mb-1.5 font-semibold uppercase tracking-wide">{t("cardNumber")}</div>
            <div className="font-mono text-[18px] font-bold tracking-[0.14em] text-foreground">5375 4141 2121 2120</div>
          </div>
          <div className="rounded-xl p-3.5 text-[12px]" style={{ background: "hsl(40 70% 60% / 0.06)", border: "1px solid hsl(40 70% 60% / 0.1)" }}>
            <div className="font-semibold mb-1" style={{ color: "hsl(40 70% 40%)" }}>{t("important")}</div>
            <div style={{ color: "hsl(40 50% 35% / 0.8)" }}>{t("cardNote")} <span className="font-mono font-bold text-foreground">{user?.telegramId}</span></div>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.98 }} onClick={() => confirm("card")}
          className="w-full btn-primary py-3.5 font-semibold text-[14px] flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          {t("iPaid")}
        </motion.button>
      </motion.div>
    );
  }

  if (view === "google" || view === "apple") {
    const isG = view === "google";
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-6 pb-4">
        <BackBtn onClick={() => setView("main")} />
        <div className="card-static rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-3.5 mb-5">
            <div className={`w-12 h-12 ${isG ? "bg-white border border-border" : "bg-black"} rounded-[14px] flex items-center justify-center`}>
              {isG ? (
                <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              ) : (
                <svg width="14" height="18" viewBox="0 0 170 200" fill="white"><path d="M150.37 130.25c-.27 2.97-1.69 6.86-4.25 11.66-3.83 7.14-8.85 14.17-14.41 14.41-5.56.24-7.34-3.3-15.08-3.3-7.74 0-9.7 3.06-14.97 3.54-6.1.57-10.73-7.74-14.56-14.88-7.8-14.54-13.72-41.02-5.72-58.92 3.96-8.86 11.06-14.88 18.75-15.12 5.37-.2 10.44 3.62 13.72 3.62 3.28 0 9.42-4.48 15.88-3.82 2.7.11 10.3 1.09 15.17 8.24-.39.25-9.05 5.28-8.95 15.76.11 12.52 10.97 16.68 11.1 16.73-.12.34-1.74 5.94-5.68 11.88zM119.11 24c-6.91 8.15-14.6 6.73-14.6 6.73s-.76-6.72 5.72-13.08c7.04-6.93 14.26-5.82 14.26-5.82s.85 6.57-5.38 12.17z"/></svg>
              )}
            </div>
            <div>
              <div className="font-bold text-[15px]">{isG ? t("googlePay") : t("applePay")}</div>
              <div className="text-[12px] text-muted-foreground/60">250 ₴ = {t("reports15")}</div>
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.98 }}
            onClick={() => confirm(isG ? "google_pay" : "apple_pay")}
            className={`w-full ${isG ? "bg-foreground" : "bg-black"} text-white rounded-[16px] py-3.5 font-semibold text-[14px] flex items-center justify-center gap-2.5 shadow-md active:opacity-90 transition-opacity`}>
            {isG ? (
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            ) : (
              <svg width="12" height="16" viewBox="0 0 170 200" fill="white"><path d="M150.37 130.25c-.27 2.97-1.69 6.86-4.25 11.66-3.83 7.14-8.85 14.17-14.41 14.41-5.56.24-7.34-3.3-15.08-3.3-7.74 0-9.7 3.06-14.97 3.54-6.1.57-10.73-7.74-14.56-14.88-7.8-14.54-13.72-41.02-5.72-58.92 3.96-8.86 11.06-14.88 18.75-15.12 5.37-.2 10.44 3.62 13.72 3.62 3.28 0 9.42-4.48 15.88-3.82 2.7.11 10.3 1.09 15.17 8.24-.39.25-9.05 5.28-8.95 15.76.11 12.52 10.97 16.68 11.1 16.73-.12.34-1.74 5.94-5.68 11.88zM119.11 24c-6.91 8.15-14.6 6.73-14.6 6.73s-.76-6.72 5.72-13.08c7.04-6.93 14.26-5.82 14.26-5.82s.85 6.57-5.38 12.17z"/></svg>
            )}
            {t("payAmount")} 250 ₴
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (view === "crypto") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-6 pb-4">
        <BackBtn onClick={() => setView("main")} />
        <div className="card-static rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-12 h-12 rounded-[14px] flex items-center justify-center" style={{ background: "linear-gradient(135deg, #10b981, #0d9488)" }}>
              <span className="text-white text-lg font-bold">$</span>
            </div>
            <div>
              <div className="font-bold text-[15px]">USDT (TRC-20)</div>
              <div className="text-[12px] text-muted-foreground/60">5 USDT = {t("reports15")}</div>
            </div>
          </div>
          <div className="bg-muted/40 rounded-xl p-4 mb-4">
            <div className="text-[10px] text-muted-foreground/50 mb-1.5 font-semibold uppercase tracking-wide">{t("cryptoAddress")}</div>
            <div className="font-mono text-[11.5px] font-bold break-all leading-relaxed select-text text-foreground">TLdH6NMj7g3jKcB6pnEPr5wfbUjqTe5GxP</div>
          </div>
          <div className="rounded-xl p-3.5 text-[12px]" style={{ background: "hsl(var(--primary) / 0.04)", border: "1px solid hsl(var(--primary) / 0.08)" }}>
            <span className="text-muted-foreground">{t("cryptoNote")}</span>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.98 }} onClick={() => confirm("crypto")}
          className="w-full btn-primary py-3.5 font-semibold text-[14px] flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          {t("iPaid")}
        </motion.button>
      </motion.div>
    );
  }

  if (view === "stars") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-6 pb-4">
        <BackBtn onClick={() => setView("main")} />
        <div className="card-static rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-12 h-12 rounded-[14px] flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f59e0b, #ea580c)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <div>
              <div className="font-bold text-[15px]">{t("telegramStars")}</div>
              <div className="text-[12px] text-muted-foreground/60">500 XTR = {t("reports15")}</div>
            </div>
          </div>
          <div className="rounded-xl p-3.5 text-[12px]" style={{ background: "hsl(var(--primary) / 0.04)", border: "1px solid hsl(var(--primary) / 0.08)" }}>
            <span className="text-muted-foreground">{t("starsNote")}</span>
            <div className="font-mono font-bold text-foreground mt-1.5">/buy_stars</div>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.98 }} onClick={() => confirm("stars")}
          className="w-full btn-primary py-3.5 font-semibold text-[14px] flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          {t("payInBot")}
        </motion.button>
      </motion.div>
    );
  }

  if (view === "pending") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-16 pb-4 flex flex-col items-center justify-center min-h-[75vh]">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 pop-in" style={{ background: "hsl(160 60% 40% / 0.08)" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(160 60% 40%)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 className="text-lg font-bold mb-1">{t("thankYou")}</h2>
        <p className="text-[13px] text-muted-foreground/60 text-center max-w-[260px] mb-5">{t("paymentPending")}</p>
        <button onClick={() => setView("main")} className="btn-secondary px-5 py-2.5 text-[13px] font-semibold">{t("goBack")}</button>
      </motion.div>
    );
  }

  const methods = [
    { key: "card" as View, label: t("visaMastercard"), sub: "250 ₴", tag: t("popular"),
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>,
      bg: "hero-card" },
    { key: "google" as View, label: t("googlePay"), sub: "250 ₴",
      icon: <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>,
      bg: "bg-white border border-border" },
    { key: "apple" as View, label: t("applePay"), sub: "250 ₴",
      icon: <svg width="12" height="16" viewBox="0 0 170 200" fill="white"><path d="M150.37 130.25c-.27 2.97-1.69 6.86-4.25 11.66-3.83 7.14-8.85 14.17-14.41 14.41-5.56.24-7.34-3.3-15.08-3.3-7.74 0-9.7 3.06-14.97 3.54-6.1.57-10.73-7.74-14.56-14.88-7.8-14.54-13.72-41.02-5.72-58.92 3.96-8.86 11.06-14.88 18.75-15.12 5.37-.2 10.44 3.62 13.72 3.62 3.28 0 9.42-4.48 15.88-3.82 2.7.11 10.3 1.09 15.17 8.24-.39.25-9.05 5.28-8.95 15.76.11 12.52 10.97 16.68 11.1 16.73-.12.34-1.74 5.94-5.68 11.88zM119.11 24c-6.91 8.15-14.6 6.73-14.6 6.73s-.76-6.72 5.72-13.08c7.04-6.93 14.26-5.82 14.26-5.82s.85 6.57-5.38 12.17z"/></svg>,
      bg: "bg-black" },
    { key: "crypto" as View, label: "USDT (TRC-20)", sub: "5 $",
      icon: <span className="text-white text-sm font-bold">$</span>,
      bg: "bg-gradient-to-br from-emerald-500 to-teal-600" },
    { key: "stars" as View, label: t("telegramStars"), sub: "500 XTR",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
      bg: "bg-gradient-to-br from-amber-400 to-orange-500" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-6 pb-4">
      <h2 className="text-xl font-bold text-foreground tracking-tight mb-0.5">{t("balance")}</h2>
      <p className="text-[13px] text-muted-foreground/60 mb-5">{t("manageReports")}</p>

      <div className="hero-card hero-shimmer p-5 mb-6">
        <div className="relative z-10 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] text-white/35 font-semibold uppercase tracking-[0.08em]">{t("availableReports")}</span>
            <span className="text-[10px] text-white/20 font-medium">{t("total")}: {user?.totalReports || 0}</span>
          </div>
          <div className="text-[48px] font-black tabular-nums leading-none tracking-tighter mb-1">{balance}</div>
          {!user?.freeReportsUsed && (
            <span className="bg-emerald-400/10 border border-emerald-400/8 rounded-xl px-3 py-1.5 text-[10px] font-medium text-emerald-300/80 inline-block mt-2">
              {t("freeReport")}
            </span>
          )}
        </div>
      </div>

      <div className="mb-3">
        <span className="section-title">{t("choosePayment")}</span>
      </div>
      <div className="space-y-2">
        {methods.map((m, i) => (
          <motion.button
            key={m.key}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.25 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { hapticFeedback("light"); setView(m.key); }}
            className="w-full card rounded-xl p-4 text-left flex items-center gap-4"
          >
            <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 ${m.bg}`}>
              <span className="relative z-10">{m.icon}</span>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-[14px] text-foreground flex items-center gap-2">
                {m.label}
                {(m as any).tag && <span className="badge text-[9px] py-0.5 px-2">{(m as any).tag}</span>}
              </div>
              <div className="text-[11px] text-muted-foreground/50 mt-0.5">{t("reports15")}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-[15px] text-foreground tabular-nums">{m.sub}</div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
