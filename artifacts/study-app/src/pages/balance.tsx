import { useState } from "react";
import { useUser, useLang, updateBalance, refreshUser } from "@/lib/store";
import { createPayment, createInvoice } from "@/lib/api";
import { hapticFeedback, hapticSuccess, hapticError, getTelegramWebApp } from "@/lib/telegram";
import { t } from "@/lib/i18n";
import { motion } from "framer-motion";

type Method = "card" | "crypto" | "stars" | null;
const CARD = "5375 4141 2121 2120";
const CRYPTO = "TLdH6NMj7g3jKcB6pnEPr5wfbUjqTe5GxP";
const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

function CopyField({ label, value }: { label: string; value: string }) {
  const [ok, setOk] = useState(false);
  return (
    <div className="mb-4">
      <div className="text-[10px] text-white/18 font-bold tracking-[0.1em] uppercase mb-2">{label}</div>
      <motion.button whileTap={{ scale: 0.98 }}
        onClick={() => { navigator.clipboard.writeText(value); hapticSuccess(); setOk(true); setTimeout(() => setOk(false), 2000); }}
        className="w-full g-card rounded-2xl p-4 flex items-center gap-3">
        <code className="text-[13px] font-mono text-white/90 flex-1 text-left break-all select-all">{value}</code>
        <div className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: ok ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.03)" }}>
          {ok ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/18"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>}
        </div>
      </motion.button>
    </div>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.95 }} onClick={() => { hapticFeedback("light"); onClick(); }}
      className="text-white/25 text-[14px] font-bold mb-5 flex items-center gap-1.5 active:text-white/60 transition-colors">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
      {t("back")}
    </motion.button>
  );
}

function PkgCard() {
  return (
    <div className="hero-card hero-shimmer p-5 mb-6">
      <div className="shimmer-bar" />
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <div className="text-[10px] text-white/18 font-bold tracking-[0.12em] uppercase mb-2">{t("paymentAmount")}</div>
          <div className="flex items-baseline gap-2">
            <span className="text-[44px] font-black text-white tabular tracking-tighter leading-none">15</span>
            <span className="text-[13px] text-white/18 font-semibold">{t("reportsAvailable").toLowerCase()}</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.1)" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
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

  const bal = user ? (!user.freeReportsUsed ? user.balance + 1 : user.balance) : 0;

  async function confirm() {
    if (!user || !method) return;
    setConfirming(true);
    try { await createPayment({ telegramId: user.telegramId, paymentMethod: method }); hapticSuccess(); setConfirmed(true); }
    catch { hapticError(); }
    setConfirming(false);
  }

  async function payStars() {
    if (!user) return;
    const tg = getTelegramWebApp();
    if (!tg?.openInvoice) { setMethod("stars"); return; }
    setStarsLoading(true); hapticFeedback("medium");
    try {
      const res = await createInvoice(user.telegramId);
      if (res.success && res.invoiceUrl) {
        tg.openInvoice(res.invoiceUrl, (status) => {
          setStarsLoading(false);
          if (status === "paid") { hapticSuccess(); updateBalance(user.balance + 15); setConfirmed(true); setTimeout(() => refreshUser(), 2000); }
          else if (status === "failed") hapticError();
        });
      } else { setStarsLoading(false); setMethod("stars"); }
    } catch { setStarsLoading(false); hapticError(); setMethod("stars"); }
  }

  if (confirmed) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="px-5 pt-20 pb-4 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
          className="w-20 h-20 rounded-3xl flex items-center justify-center mb-8 glow-g"
          style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.12)" }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </motion.div>
        <h2 className="text-xl font-bold text-white mb-2">{t("thankYou")}</h2>
        <p className="text-[14px] text-white/25 text-center max-w-[280px] mb-8">{t("paymentPending")}</p>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setMethod(null); setConfirmed(false); }}
          className="btn-ghost px-8 py-3 text-[14px] font-bold">{t("goBack")}</motion.button>
      </motion.div>
    );
  }

  if (method === "card") {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease }} className="px-5 pt-8 pb-4">
        <BackBtn onClick={() => setMethod(null)} />
        <h2 className="text-[24px] font-black text-white tracking-tight mb-1">{t("cardPayment")}</h2>
        <p className="text-[14px] text-white/20 mb-6">{t("transferDescription")}</p>
        <PkgCard />
        <CopyField label={t("cardNumber")} value={CARD} />
        <div className="g-card-s rounded-2xl p-4 flex items-center gap-3 mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#67e8f9" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
          <p className="text-[11px] text-white/20 leading-relaxed">{t("cardNote")} <span className="font-mono font-bold text-[#67e8f9]">{user?.telegramId}</span></p>
        </div>
        <div className="g-card-s rounded-2xl p-4 flex items-center gap-3" style={{ background: "rgba(251,191,36,0.03)", borderColor: "rgba(251,191,36,0.08)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.5"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
          <p className="text-[11px] text-white/25 leading-relaxed">{t("receiptNote")}</p>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={confirm} disabled={confirming}
          className="mt-6 w-full btn-main py-[18px] text-[15px] flex items-center justify-center gap-2">
          {confirming ? <div className="spinner w-5 h-5" /> : <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{t("iPaid")}</>}
        </motion.button>
      </motion.div>
    );
  }

  if (method === "crypto") {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease }} className="px-5 pt-8 pb-4">
        <BackBtn onClick={() => setMethod(null)} />
        <h2 className="text-[24px] font-black text-white tracking-tight mb-1">{t("cryptoPayment")}</h2>
        <p className="text-[14px] text-white/20 mb-6">USDT · TRC-20</p>
        <PkgCard />
        <CopyField label={t("walletAddress")} value={CRYPTO} />
        <motion.button whileTap={{ scale: 0.97 }} onClick={confirm} disabled={confirming}
          className="mt-2 w-full btn-main py-[18px] text-[15px] flex items-center justify-center gap-2">
          {confirming ? <div className="spinner w-5 h-5" /> : <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{t("iPaid")}</>}
        </motion.button>
      </motion.div>
    );
  }

  if (method === "stars") {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease }} className="px-5 pt-8 pb-4">
        <BackBtn onClick={() => setMethod(null)} />
        <h2 className="text-[24px] font-black text-white tracking-tight mb-1">{t("telegramStars")}</h2>
        <p className="text-[14px] text-white/20 mb-6">{t("starsDesc")}</p>
        <PkgCard />
        <div className="g-card-s rounded-2xl p-5 mb-6">
          <p className="text-[14px] text-white/50 leading-relaxed mb-3">{t("starsInstructions")}</p>
          <p className="text-[12px] text-white/25">{t("supportContact")}: <span className="font-bold text-[#a78bfa]">@studypro_support</span></p>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={confirm} disabled={confirming}
          className="w-full btn-main py-[18px] text-[15px] flex items-center justify-center gap-2">
          {confirming ? <div className="spinner w-5 h-5" /> : <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{t("payInBot")}</>}
        </motion.button>
      </motion.div>
    );
  }

  const st = (i: number) => ({
    initial: { opacity: 0, y: 16 } as const,
    animate: { opacity: 1, y: 0 } as const,
    transition: { delay: i * 0.07, duration: 0.4, ease },
  });

  return (
    <div className="px-5 pt-8 pb-4">
      <motion.div {...st(0)}>
        <h2 className="text-[26px] font-black text-white tracking-tight mb-1">{t("balance")}</h2>
        <p className="text-[13px] text-white/20 mb-7">{t("topUpBalance")}</p>
      </motion.div>

      <motion.div {...st(1)} className="hero-card hero-shimmer p-6 mb-6">
        <div className="shimmer-bar" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-white/18 font-extrabold tracking-[0.14em] uppercase">{t("currentBalance")}</span>
            {user?.totalReports !== undefined && <span className="text-[10px] text-white/8 font-medium">{t("total")}: {user.totalReports}</span>}
          </div>
          <div className="flex items-end gap-3 mt-1">
            <span className="text-[60px] font-black tabular leading-none tracking-tighter num-glow">{bal}</span>
            <span className="text-[13px] text-white/12 pb-3 font-semibold">{t("reportsAvailable")}</span>
          </div>
          {!user?.freeReportsUsed && (
            <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl"
              style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.1)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              <span className="text-[11px] font-bold text-emerald-400">{t("firstReportFree")}</span>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div {...st(2)}>
        <motion.button whileTap={{ scale: 0.97 }} onClick={payStars} disabled={starsLoading}
          className="w-full rounded-2xl py-[16px] px-5 font-bold text-[15px] flex items-center justify-center gap-3 mb-7 text-white relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #b45309, #d97706, #f59e0b, #d97706)",
            backgroundSize: "300% 300%",
            animation: "grad-move 5s ease infinite",
            boxShadow: "0 0 0 1px rgba(251,191,36,0.15), 0 8px 30px -4px rgba(217,119,6,0.35)",
          }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 50%)" }} />
          {starsLoading ? <div className="spinner w-5 h-5 border-white/20 border-t-white" />
            : <><span className="text-xl relative z-10">⭐</span><span className="relative z-10">{t("telegramStars")} · 500 XTR</span></>}
        </motion.button>
      </motion.div>

      <motion.div {...st(3)}>
        <div className="section-label mb-3">{t("choosePaymentMethod")}</div>
      </motion.div>
      <div className="space-y-2.5">
        {[
          { m: "card" as Method, title: t("cardPayment"), price: "250 UAH", tag: t("popular"), color: "#a78bfa",
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.7"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg> },
          { m: "crypto" as Method, title: t("cryptoPayment"), price: "5 USDT (TRC-20)", color: "#34d399",
            icon: <span className="text-lg font-black" style={{ color: "#34d399" }}>₮</span> },
        ].map((item, i) => (
          <motion.button key={item.m} {...st(4 + i)} whileTap={{ scale: 0.97 }}
            onClick={() => { hapticFeedback("light"); setMethod(item.m); }}
            className="g-card rounded-2xl p-4 text-left flex items-center gap-4 w-full">
            <div className="icon-box" style={{ background: `${item.color}0a`, border: `1px solid ${item.color}0f` }}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[14px] text-white flex items-center gap-2">
                {item.title}
                {item.tag && <span className="badge-g text-[8px] py-0.5 px-2">{item.tag}</span>}
              </div>
              <div className="text-[11px] text-white/18 mt-0.5 font-medium">{item.price}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/8"><polyline points="9 18 15 12 9 6"/></svg>
          </motion.button>
        ))}
      </div>

      <motion.div {...st(8)} className="mt-6 g-card-s rounded-2xl p-4 flex items-center gap-3">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#67e8f9" strokeWidth="1.5" className="shrink-0 opacity-50"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
        <p className="text-[11px] text-white/18 leading-relaxed">{t("paymentNote")}</p>
      </motion.div>
    </div>
  );
}
