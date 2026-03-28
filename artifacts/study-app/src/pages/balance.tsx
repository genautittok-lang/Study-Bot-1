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
      <div className="text-[10px] text-[#9ca3af] font-bold tracking-wider uppercase mb-1.5">{label}</div>
      <motion.button whileTap={{ scale: 0.98 }}
        onClick={() => { navigator.clipboard.writeText(value).then(() => { hapticSuccess(); setOk(true); setTimeout(() => setOk(false), 2000); }).catch(() => {}); }}
        className="w-full g-card rounded-[14px] p-3.5 flex items-center gap-3">
        <code className="text-[12px] font-mono text-[#6b7280] flex-1 text-left break-all select-all">{value}</code>
        <div className="shrink-0 w-8 h-8 rounded-[10px] flex items-center justify-center"
          style={{ background: ok ? "rgba(0,184,148,0.06)" : "rgba(0,0,0,0.03)" }}>
          {ok
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00B894" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>}
        </div>
      </motion.button>
    </div>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.95 }} onClick={() => { hapticFeedback("light"); onClick(); }}
      className="text-[#9ca3af] text-[13px] font-semibold mb-4 flex items-center gap-1">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
      {t("back")}
    </motion.button>
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
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: "rgba(0,184,148,0.06)" }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00B894" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </motion.div>
        <h2 className="text-xl font-extrabold mb-1.5">{t("thankYou")}</h2>
        <p className="text-[13px] text-[#9ca3af] text-center max-w-[260px] mb-6">{t("paymentPending")}</p>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setMethod(null); setConfirmed(false); }}
          className="btn-ghost px-8 py-3 text-[13px]">{t("goBack")}</motion.button>
      </motion.div>
    );
  }

  if (method === "card" || method === "crypto" || method === "stars") {
    const isCrypto = method === "crypto";
    const isStars = method === "stars";
    return (
      <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, ease }} className="px-4 pt-5 pb-4">
        <BackBtn onClick={() => setMethod(null)} />
        <h2 className="text-[22px] font-extrabold tracking-tight mb-0.5">
          {isStars ? t("telegramStars") : isCrypto ? t("cryptoPayment") : t("cardPayment")}
        </h2>
        <p className="text-[11px] text-[#9ca3af] mb-4">
          {isStars ? t("starsDesc") : isCrypto ? "USDT · TRC-20" : t("transferDescription")}
        </p>

        <div className="rounded-[22px] p-4 mb-4 relative overflow-hidden"
          style={{ background: "linear-gradient(145deg, #2d3436, #1e272e)", boxShadow: "0 12px 32px rgba(0,0,0,0.15)" }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, white, transparent 70%)", transform: "translate(30%, -30%)" }} />
          <div className="relative z-10">
            <div className="text-[9px] text-white/30 font-bold uppercase tracking-wider mb-2">{t("paymentAmount")}</div>
            <div className="flex items-baseline gap-2">
              <span className="text-[40px] font-extrabold text-white tabular tracking-tight leading-none">15</span>
              <span className="text-[12px] text-white/30 font-medium">{t("reportsAvailable").toLowerCase()}</span>
            </div>
          </div>
        </div>

        {!isStars && <CopyField label={isCrypto ? t("walletAddress") : t("cardNumber")} value={isCrypto ? CRYPTO : CARD} />}

        {!isCrypto && !isStars && (
          <div className="g-card rounded-[14px] p-3 flex items-start gap-2.5 mb-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0984E3" strokeWidth="1.5" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
            <p className="text-[11px] text-[#6b7280] leading-relaxed">{t("cardNote")} <span className="font-mono font-bold text-[#0984E3]">{user?.telegramId}</span></p>
          </div>
        )}

        {isStars && (
          <div className="g-card rounded-[14px] p-3.5 mb-3">
            <p className="text-[12px] text-[#6b7280] leading-relaxed mb-2">{t("starsInstructions")}</p>
            <p className="text-[11px] text-[#9ca3af]">{t("supportContact")}: <span className="font-semibold text-[#6C5CE7]">@studypro_support</span></p>
          </div>
        )}

        <motion.button whileTap={{ scale: 0.97 }} onClick={confirm} disabled={confirming}
          className="mt-2 w-full btn-main py-[15px] text-[14px] flex items-center justify-center gap-2">
          {confirming ? <div className="spinner w-5 h-5" /> : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{t("iPaid")}</>}
        </motion.button>
      </motion.div>
    );
  }

  const a = (i: number) => ({
    initial: { opacity: 0, y: 16 } as const,
    animate: { opacity: 1, y: 0 } as const,
    transition: { delay: i * 0.06, duration: 0.4, ease },
  });

  return (
    <div className="px-4 pt-5 pb-4">
      {/* ─── CREDIT CARD STYLE BALANCE ─── */}
      <motion.div {...a(0)} className="relative rounded-[28px] p-5 mb-5 overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #0984E3, #0773C7, #0562AB)",
          boxShadow: "0 16px 48px rgba(9,132,227,0.3), 0 4px 12px rgba(0,0,0,0.08)",
        }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, white 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #00CEC9 0%, transparent 70%)", transform: "translate(-20%, 20%)" }} />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] text-white/40 font-bold tracking-wider uppercase">{t("currentBalance")}</span>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/25" />
              ))}
            </div>
          </div>
          
          <div className="flex items-end gap-3 mb-2">
            <span className="text-[56px] font-extrabold text-white tabular leading-none tracking-tight"
              style={{ textShadow: "0 2px 16px rgba(0,0,0,0.15)" }}>{bal}</span>
            <span className="text-[13px] text-white/35 pb-3 font-medium">{t("reportsAvailable")}</span>
          </div>

          {!user?.freeReportsUsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.12)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#00CEC9] animate-pulse" />
              <span className="text-[10px] font-semibold text-white/75">{t("firstReportFree")}</span>
            </motion.div>
          )}
          
          <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <span className="text-[10px] text-white/25 font-medium">StudyPro</span>
            <span className="text-[10px] text-white/20 font-medium tabular">{t("total")}: {user?.totalReports || 0}</span>
          </div>
        </div>
      </motion.div>

      {/* ─── PAYMENT OPTIONS ─── */}
      <motion.div {...a(1)} className="mb-3">
        <div className="flex items-center gap-2 mb-2.5 px-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#6C5CE7] animate-pulse" />
          <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider">{t("choosePaymentMethod")}</span>
        </div>
      </motion.div>

      <div className="space-y-2">
        {/* Telegram Stars — Featured */}
        <motion.div {...a(2)}>
          <motion.button whileTap={{ scale: 0.97 }} onClick={payStars} disabled={starsLoading}
            className="w-full rounded-[20px] p-4 flex items-center gap-3.5 overflow-hidden relative"
            style={{
              background: "linear-gradient(135deg, rgba(255,159,67,0.08), rgba(255,159,67,0.03))",
              border: "1.5px solid rgba(255,159,67,0.15)",
            }}>
            <div className="w-[48px] h-[48px] rounded-[15px] flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #FFA502, #FF9F43)", boxShadow: "0 4px 12px rgba(255,159,67,0.2)" }}>
              {starsLoading
                ? <div className="spinner w-5 h-5 border-white/25 border-t-white" />
                : <span className="text-[22px]">⭐</span>}
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold text-[14px] leading-tight">{t("telegramStars")}</div>
              <div className="text-[12px] text-[#9ca3af] mt-0.5 font-medium">500 XTR · 15 {t("reportsAvailable").toLowerCase()}</div>
            </div>
            <div className="shrink-0 px-2.5 py-1 rounded-full text-[9px] font-bold"
              style={{ background: "rgba(255,159,67,0.08)", color: "#E67E22" }}>
              HOT
            </div>
          </motion.button>
        </motion.div>

        {/* Card */}
        <motion.div {...a(3)}>
          <motion.button whileTap={{ scale: 0.97 }}
            onClick={() => { hapticFeedback("light"); setMethod("card"); }}
            className="w-full g-card rounded-[20px] p-4 flex items-center gap-3.5">
            <div className="w-[48px] h-[48px] rounded-[15px] flex items-center justify-center shrink-0"
              style={{ background: "rgba(108,92,231,0.06)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="1.5"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold text-[14px] leading-tight flex items-center gap-2">
                {t("cardPayment")}
                <span className="badge-g text-[8px] py-0.5 px-2">{t("popular")}</span>
              </div>
              <div className="text-[12px] text-[#9ca3af] mt-0.5 font-medium">250 UAH</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </motion.button>
        </motion.div>

        {/* Crypto */}
        <motion.div {...a(4)}>
          <motion.button whileTap={{ scale: 0.97 }}
            onClick={() => { hapticFeedback("light"); setMethod("crypto"); }}
            className="w-full g-card rounded-[20px] p-4 flex items-center gap-3.5">
            <div className="w-[48px] h-[48px] rounded-[15px] flex items-center justify-center shrink-0"
              style={{ background: "rgba(0,184,148,0.06)" }}>
              <span className="text-[20px] font-bold" style={{ color: "#00B894" }}>₮</span>
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold text-[14px] leading-tight">{t("cryptoPayment")}</div>
              <div className="text-[12px] text-[#9ca3af] mt-0.5 font-medium">5 USDT (TRC-20)</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </motion.button>
        </motion.div>
      </div>

      <motion.div {...a(5)} className="mt-4 flex items-start gap-2.5 px-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
        <p className="text-[10px] text-[#b0b0c0] leading-relaxed">{t("paymentNote")}</p>
      </motion.div>
    </div>
  );
}
