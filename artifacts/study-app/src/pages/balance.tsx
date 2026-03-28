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
    <div className="mb-3">
      <div className="text-[10px] text-[#9ca3af] font-semibold tracking-[0.08em] uppercase mb-1.5">{label}</div>
      <motion.button whileTap={{ scale: 0.98 }}
        onClick={() => { navigator.clipboard.writeText(value); hapticSuccess(); setOk(true); setTimeout(() => setOk(false), 2000); }}
        className="w-full g-card rounded-[14px] p-3.5 flex items-center gap-3">
        <code className="text-[12px] font-mono text-[#6b7280] flex-1 text-left break-all select-all">{value}</code>
        <div className="shrink-0 w-7 h-7 rounded-[10px] flex items-center justify-center transition-colors"
          style={{ background: ok ? "rgba(0,184,148,0.08)" : "rgba(0,0,0,0.03)" }}>
          {ok
            ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00B894" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>}
        </div>
      </motion.button>
    </div>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.95 }} onClick={() => { hapticFeedback("light"); onClick(); }}
      className="text-[#9ca3af] text-[13px] font-semibold mb-4 flex items-center gap-1 active:text-[#6b7280] transition-colors">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
      {t("back")}
    </motion.button>
  );
}

function PkgCard() {
  return (
    <div className="hero-card hero-dark hero-shimmer p-4 mb-4">
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <div className="text-[9px] text-white/35 font-semibold tracking-[0.1em] uppercase mb-1.5">{t("paymentAmount")}</div>
          <div className="flex items-baseline gap-2">
            <span className="text-[36px] font-extrabold text-white tabular tracking-[-0.04em] leading-none">15</span>
            <span className="text-[11px] text-white/35 font-medium">{t("reportsAvailable").toLowerCase()}</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-[14px] flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.06)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
          </svg>
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
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        className="px-4 pt-20 pb-4 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
          className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
          style={{ background: "rgba(0,184,148,0.08)" }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#00B894" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </motion.div>
        <h2 className="text-xl font-bold mb-1.5">{t("thankYou")}</h2>
        <p className="text-[13px] text-[#9ca3af] text-center max-w-[260px] mb-6">{t("paymentPending")}</p>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setMethod(null); setConfirmed(false); }}
          className="btn-ghost px-8 py-3 text-[13px]">{t("goBack")}</motion.button>
      </motion.div>
    );
  }

  if (method === "card") {
    return (
      <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, ease }} className="px-4 pt-6 pb-4">
        <BackBtn onClick={() => setMethod(null)} />
        <h2 className="text-[22px] font-extrabold tracking-tight mb-0.5">{t("cardPayment")}</h2>
        <p className="text-[11px] text-[#9ca3af] mb-4">{t("transferDescription")}</p>
        <PkgCard />
        <CopyField label={t("cardNumber")} value={CARD} />
        <div className="g-card rounded-[14px] p-3 flex items-start gap-2.5 mb-2.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0984E3" strokeWidth="1.5" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
          <p className="text-[11px] text-[#6b7280] leading-relaxed">{t("cardNote")} <span className="font-mono font-semibold text-[#0984E3]">{user?.telegramId}</span></p>
        </div>
        <div className="g-card rounded-[14px] p-3 flex items-start gap-2.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF9F43" strokeWidth="1.5" className="mt-0.5 shrink-0"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
          <p className="text-[11px] text-[#9ca3af] leading-relaxed">{t("receiptNote")}</p>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={confirm} disabled={confirming}
          className="mt-4 w-full btn-main py-[15px] text-[14px] flex items-center justify-center gap-2">
          {confirming ? <div className="spinner w-5 h-5" /> : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{t("iPaid")}</>}
        </motion.button>
      </motion.div>
    );
  }

  if (method === "crypto") {
    return (
      <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, ease }} className="px-4 pt-6 pb-4">
        <BackBtn onClick={() => setMethod(null)} />
        <h2 className="text-[22px] font-extrabold tracking-tight mb-0.5">{t("cryptoPayment")}</h2>
        <p className="text-[11px] text-[#9ca3af] mb-4">USDT · TRC-20</p>
        <PkgCard />
        <CopyField label={t("walletAddress")} value={CRYPTO} />
        <motion.button whileTap={{ scale: 0.97 }} onClick={confirm} disabled={confirming}
          className="mt-2 w-full btn-main py-[15px] text-[14px] flex items-center justify-center gap-2">
          {confirming ? <div className="spinner w-5 h-5" /> : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{t("iPaid")}</>}
        </motion.button>
      </motion.div>
    );
  }

  if (method === "stars") {
    return (
      <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, ease }} className="px-4 pt-6 pb-4">
        <BackBtn onClick={() => setMethod(null)} />
        <h2 className="text-[22px] font-extrabold tracking-tight mb-0.5">{t("telegramStars")}</h2>
        <p className="text-[11px] text-[#9ca3af] mb-4">{t("starsDesc")}</p>
        <PkgCard />
        <div className="g-card rounded-[14px] p-3.5 mb-4">
          <p className="text-[12px] text-[#6b7280] leading-relaxed mb-2">{t("starsInstructions")}</p>
          <p className="text-[11px] text-[#9ca3af]">{t("supportContact")}: <span className="font-semibold text-[#6C5CE7]">@studypro_support</span></p>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={confirm} disabled={confirming}
          className="w-full btn-main py-[15px] text-[14px] flex items-center justify-center gap-2">
          {confirming ? <div className="spinner w-5 h-5" /> : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{t("payInBot")}</>}
        </motion.button>
      </motion.div>
    );
  }

  const a = (i: number) => ({
    initial: { opacity: 0, y: 14 } as const,
    animate: { opacity: 1, y: 0 } as const,
    transition: { delay: i * 0.06, duration: 0.35, ease },
  });

  return (
    <div className="px-4 pt-6 pb-4">
      <motion.div {...a(0)}>
        <h2 className="text-[22px] font-extrabold tracking-tight mb-0.5">{t("balance")}</h2>
        <p className="text-[11px] text-[#9ca3af] mb-4">{t("topUpBalance")}</p>
      </motion.div>

      <motion.div {...a(1)} className="hero-card hero-blue hero-shimmer p-5 mb-4">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-white/45 font-semibold tracking-[0.1em] uppercase">{t("currentBalance")}</span>
            {user?.totalReports !== undefined && <span className="text-[10px] text-white/25 font-medium tabular">{t("total")}: {user.totalReports}</span>}
          </div>
          <div className="flex items-end gap-2.5 mt-1">
            <span className="text-[50px] font-extrabold tabular leading-none tracking-[-0.05em]"
              style={{ textShadow: "0 2px 16px rgba(0,0,0,0.15)" }}>{bal}</span>
            <span className="text-[12px] text-white/35 pb-2.5 font-medium">{t("reportsAvailable")}</span>
          </div>
          {!user?.freeReportsUsed && (
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md"
              style={{ background: "rgba(255,255,255,0.12)" }}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              <span className="text-[9px] font-semibold text-white/80">{t("firstReportFree")}</span>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div {...a(2)}>
        <motion.button whileTap={{ scale: 0.97 }} onClick={payStars} disabled={starsLoading}
          className="w-full rounded-[18px] py-[14px] px-5 font-bold text-[14px] flex items-center justify-center gap-2.5 mb-4"
          style={{
            background: "linear-gradient(135deg, #FFA502, #FF9F43, #F9A825)",
            color: "white",
            boxShadow: "0 4px 16px rgba(255,159,67,0.25), 0 1px 3px rgba(0,0,0,0.08)",
          }}>
          {starsLoading
            ? <div className="spinner w-5 h-5 border-white/25 border-t-white" />
            : <><span className="text-lg">⭐</span><span>{t("telegramStars")} · 500 XTR</span></>}
        </motion.button>
      </motion.div>

      <motion.div {...a(3)}>
        <div className="section-label mb-2">{t("choosePaymentMethod")}</div>
      </motion.div>
      <div className="space-y-2">
        {[
          { m: "card" as Method, title: t("cardPayment"), price: "250 UAH", tag: t("popular"), color: "#6C5CE7",
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="1.5"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg> },
          { m: "crypto" as Method, title: t("cryptoPayment"), price: "5 USDT (TRC-20)", color: "#00B894",
            icon: <span className="text-base font-bold" style={{ color: "#00B894" }}>₮</span> },
        ].map((item, i) => (
          <motion.button key={item.m} {...a(4 + i)} whileTap={{ scale: 0.97 }}
            onClick={() => { hapticFeedback("light"); setMethod(item.m); }}
            className="g-card rounded-[16px] p-3.5 text-left flex items-center gap-3.5 w-full">
            <div className="icon-box" style={{ background: `${item.color}0d` }}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[14px] flex items-center gap-2 leading-tight">
                {item.title}
                {item.tag && <span className="badge-g text-[8px] py-0.5 px-2">{item.tag}</span>}
              </div>
              <div className="text-[11px] text-[#9ca3af] mt-0.5 font-medium">{item.price}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </motion.button>
        ))}
      </div>

      <motion.div {...a(7)} className="mt-4 g-card rounded-[14px] p-3 flex items-start gap-2.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
        <p className="text-[11px] text-[#9ca3af] leading-relaxed">{t("paymentNote")}</p>
      </motion.div>
    </div>
  );
}
