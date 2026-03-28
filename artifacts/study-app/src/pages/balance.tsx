import { useState } from "react";
import { useUser, useLang, updateBalance, refreshUser } from "@/lib/store";
import { createPayment, createInvoice } from "@/lib/api";
import { hapticFeedback, hapticSuccess, hapticError, getTelegramWebApp } from "@/lib/telegram";
import { t } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";

type Method = "card" | "google_pay" | "apple_pay" | "crypto" | "stars" | null;

const CARD_NUMBER = "5375 4141 2121 2120";
const CRYPTO_ADDR = "TLdH6NMj7g3jKcB6pnEPr5wfbUjqTe5GxP";
const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <div className="text-[12px] text-muted-foreground/50 font-medium mb-2">{label}</div>
      <motion.button whileTap={{ scale: 0.98 }}
        onClick={() => { navigator.clipboard.writeText(value); hapticSuccess(); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        className="w-full card-interactive rounded-2xl p-4 flex items-center gap-3">
        <code className="text-[14px] font-mono text-foreground flex-1 text-left break-all select-all">{value}</code>
        <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{ background: copied ? "rgba(67,233,123,0.1)" : "transparent" }}>
          {copied ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#43e97b" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/30"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          )}
        </div>
      </motion.button>
    </div>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.95 }} onClick={() => { hapticFeedback("light"); onClick(); }}
      className="text-muted-foreground text-[14px] font-medium mb-5 flex items-center gap-1.5 active:text-foreground transition-colors">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
      {t("back")}
    </motion.button>
  );
}

function PackageCard() {
  return (
    <div className="hero-card hero-shimmer p-5 mb-5">
      <div className="shimmer-bar" />
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="text-[11px] text-white/30 font-semibold tracking-[0.1em] uppercase">{t("paymentAmount")}</div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
            <span className="text-[10px] text-white/25 font-medium">StudyPro</span>
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-[40px] font-black text-white tabular tracking-tighter leading-none">15</span>
          <span className="text-[16px] text-white/30 font-medium">{t("reportsAvailable").toLowerCase()}</span>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="rgba(255,255,255,0.15)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            ))}
          </div>
          <span className="text-[10px] text-white/15 font-medium">Premium</span>
        </div>
      </div>
    </div>
  );
}

export default function Balance() {
  const user = useUser();
  useLang();
  const [method, setMethod] = useState<Method>(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [starsLoading, setStarsLoading] = useState(false);

  const balance = user ? (!user.freeReportsUsed ? user.balance + 1 : user.balance) : 0;

  async function confirm() {
    if (!user || !method) return;
    setConfirming(true);
    try {
      await createPayment({ telegramId: user.telegramId, paymentMethod: method });
      hapticSuccess();
      setConfirmed(true);
    } catch { hapticError(); }
    setConfirming(false);
  }

  async function payWithStars() {
    if (!user) return;
    const tg = getTelegramWebApp();
    if (!tg?.openInvoice) {
      setMethod("stars");
      return;
    }
    setStarsLoading(true);
    hapticFeedback("medium");
    try {
      const res = await createInvoice(user.telegramId);
      if (res.success && res.invoiceUrl) {
        tg.openInvoice(res.invoiceUrl, (status) => {
          setStarsLoading(false);
          if (status === "paid") {
            hapticSuccess();
            updateBalance(user.balance + 15);
            setConfirmed(true);
            setTimeout(() => refreshUser(), 2000);
          } else if (status === "failed") {
            hapticError();
          }
        });
      } else {
        setStarsLoading(false);
        setMethod("stars");
      }
    } catch {
      setStarsLoading(false);
      hapticError();
      setMethod("stars");
    }
  }

  if (confirmed) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pt-20 pb-4 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="relative mb-8">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center pop-in"
            style={{ background: "linear-gradient(135deg, rgba(67,233,123,0.1), rgba(56,249,215,0.05))" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#43e97b" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-4 rounded-[28px] -z-10"
            style={{ background: "radial-gradient(circle, rgba(67,233,123,0.12), transparent 70%)" }}
          />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">{t("thankYou")}</h2>
        <p className="text-[14px] text-muted-foreground/50 text-center max-w-[280px] mb-8">{t("paymentPending")}</p>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setMethod(null); setConfirmed(false); }}
          className="btn-ghost px-8 py-3 text-[14px] font-semibold">{t("goBack")}</motion.button>
      </motion.div>
    );
  }

  if (method === "card" || method === "google_pay" || method === "apple_pay") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pt-6 pb-4">
        <BackBtn onClick={() => setMethod(null)} />
        <h2 className="text-[22px] font-bold text-foreground tracking-tight mb-1">
          {method === "card" ? t("cardPayment") : method === "google_pay" ? t("googlePay") : t("applePay")}
        </h2>
        <p className="text-[14px] text-muted-foreground/50 mb-6">{t("transferDescription")}</p>
        <PackageCard />
        <CopyField label={t("cardNumber")} value={CARD_NUMBER} />
        <div className="mt-4 card rounded-2xl p-4 flex items-center gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/30 shrink-0">
            <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/>
          </svg>
          <p className="text-[12px] text-muted-foreground/40 leading-relaxed">{t("cardNote")} <span className="font-mono font-bold text-foreground">{user?.telegramId}</span></p>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={confirm} disabled={confirming}
          className="mt-6 w-full btn-primary py-4 text-[15px] font-semibold flex items-center justify-center gap-2">
          {confirming ? <div className="spinner w-5 h-5" /> : <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{t("iPaid")}</>}
        </motion.button>
      </motion.div>
    );
  }

  if (method === "crypto") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pt-6 pb-4">
        <BackBtn onClick={() => setMethod(null)} />
        <h2 className="text-[22px] font-bold text-foreground tracking-tight mb-1">{t("cryptoPayment")}</h2>
        <p className="text-[14px] text-muted-foreground/50 mb-6">USDT · TRC-20</p>
        <PackageCard />
        <CopyField label={t("walletAddress")} value={CRYPTO_ADDR} />
        <motion.button whileTap={{ scale: 0.97 }} onClick={confirm} disabled={confirming}
          className="mt-6 w-full btn-primary py-4 text-[15px] font-semibold flex items-center justify-center gap-2">
          {confirming ? <div className="spinner w-5 h-5" /> : <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{t("iPaid")}</>}
        </motion.button>
        <p className="text-center text-[11px] text-muted-foreground/30 mt-3">{t("paymentNote")}</p>
      </motion.div>
    );
  }

  if (method === "stars") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pt-6 pb-4">
        <BackBtn onClick={() => setMethod(null)} />
        <h2 className="text-[22px] font-bold text-foreground tracking-tight mb-1">{t("telegramStars")}</h2>
        <p className="text-[14px] text-muted-foreground/50 mb-6">{t("starsDesc")}</p>
        <PackageCard />
        <div className="card rounded-2xl p-5">
          <p className="text-[14px] text-foreground leading-relaxed mb-4">{t("starsInstructions")}</p>
          <p className="text-[13px] text-muted-foreground/50">{t("supportContact")}: <span className="font-semibold text-foreground">@studypro_support</span></p>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={confirm} disabled={confirming}
          className="mt-6 w-full btn-primary py-4 text-[15px] font-semibold flex items-center justify-center gap-2">
          {confirming ? <div className="spinner w-5 h-5" /> : <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{t("payInBot")}</>}
        </motion.button>
        <p className="text-center text-[11px] text-muted-foreground/30 mt-3">{t("paymentNote")}</p>
      </motion.div>
    );
  }

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 12 } as const,
    animate: { opacity: 1, y: 0 } as const,
    transition: { delay: i * 0.06, duration: 0.35, ease },
  });

  return (
    <div className="px-5 pt-6 pb-4">
      <motion.div {...stagger(0)}>
        <h2 className="text-[22px] font-bold text-foreground tracking-tight mb-1">{t("balance")}</h2>
        <p className="text-[14px] text-muted-foreground/50 mb-6">{t("topUpBalance")}</p>
      </motion.div>

      <motion.div {...stagger(1)} className="hero-card hero-shimmer p-6 mb-6">
        <div className="shimmer-bar" />
        <div className="relative z-10 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] text-white/25 font-semibold tracking-[0.1em] uppercase">{t("currentBalance")}</span>
            {user?.totalReports !== undefined && <span className="text-[10px] text-white/15 font-medium">{t("total")}: {user.totalReports}</span>}
          </div>
          <div className="flex items-end gap-3">
            <span className="text-[52px] font-black tabular leading-none tracking-tighter">{balance}</span>
            <span className="text-[14px] text-white/20 pb-2.5 font-medium">{t("reportsAvailable")}</span>
          </div>
          {!user?.freeReportsUsed && (
            <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl"
              style={{ background: "rgba(67, 233, 123, 0.1)", border: "1px solid rgba(67, 233, 123, 0.15)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#43e97b" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              <span className="text-[11px] font-semibold" style={{ color: "rgba(67, 233, 123, 0.9)" }}>{t("firstReportFree")}</span>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div {...stagger(2)}>
        <motion.button whileTap={{ scale: 0.97 }} onClick={payWithStars} disabled={starsLoading}
          className="w-full rounded-2xl py-4 px-5 font-semibold text-[15px] flex items-center justify-center gap-3 mb-5 text-white relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #f59e0b, #ea580c)",
            boxShadow: "0 4px 20px rgba(245, 158, 11, 0.35)",
          }}>
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          {starsLoading ? (
            <div className="spinner w-5 h-5 border-white/30 border-t-white" />
          ) : (
            <><span className="text-xl relative z-10">⭐</span><span className="relative z-10">{t("telegramStars")} · 500 XTR</span></>
          )}
        </motion.button>
      </motion.div>

      <motion.div {...stagger(3)}>
        <div className="section-title mb-3">{t("choosePaymentMethod")}</div>
      </motion.div>
      <div className="space-y-2.5">
        {[
          { m: "card" as Method, title: t("cardPayment"), price: "250 UAH", tag: t("popular"),
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="1.7"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg> },
          { m: "google_pay" as Method, title: t("googlePay"), price: "250 UAH",
            icon: <span className="text-xl font-bold" style={{ color: "#667eea" }}>G</span> },
          { m: "apple_pay" as Method, title: t("applePay"), price: "250 UAH",
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="1.7"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg> },
          { m: "crypto" as Method, title: t("cryptoPayment"), price: "5 USDT (TRC-20)",
            icon: <span className="text-xl font-bold" style={{ color: "#667eea" }}>₮</span> },
        ].map((item, i) => (
          <motion.button key={item.m} {...stagger(4 + i)} whileTap={{ scale: 0.97 }}
            onClick={() => { hapticFeedback("light"); setMethod(item.m); }}
            className="card-interactive rounded-2xl p-4 text-left flex items-center gap-4 w-full">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(102,126,234,0.08), rgba(118,75,162,0.05))" }}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[14px] text-foreground flex items-center gap-2">
                {item.title}
                {item.tag && <span className="badge-success text-[10px]">{item.tag}</span>}
              </div>
              <div className="text-[12px] text-muted-foreground/45 mt-0.5">{item.price}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/20"><polyline points="9 18 15 12 9 6"/></svg>
          </motion.button>
        ))}
      </div>

      <motion.div {...stagger(8)} className="mt-6 card rounded-2xl p-4 flex items-center gap-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/30 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
        <p className="text-[12px] text-muted-foreground/40 leading-relaxed">{t("paymentNote")}</p>
      </motion.div>
    </div>
  );
}
