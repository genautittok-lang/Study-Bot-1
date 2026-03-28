import { useState } from "react";
import { useUser, useLang, updateBalance, refreshUser } from "@/lib/store";
import { createPayment, createInvoice } from "@/lib/api";
import { hapticFeedback, hapticSuccess, hapticError, getTelegramWebApp } from "@/lib/telegram";
import { t, getLang } from "@/lib/i18n";
import { motion } from "framer-motion";
import Icon3D from "@/components/icons-3d";

type Method = "card" | "crypto" | "stars" | null;
const CARD = "5232 4410 5654 6307";
const CRYPTO = "TRYbty4Ew9knf61brdrixeY5M34mQTt3zY";
const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

function CopyField({ label, value }: { label: string; value: string }) {
  const [ok, setOk] = useState(false);
  return (
    <div className="mb-3">
      <div className="text-[10px] text-[#9ca3af] font-bold tracking-wider uppercase mb-1.5">{label}</div>
      <motion.button whileTap={{ scale: 0.98 }}
        onClick={() => { navigator.clipboard.writeText(value.replace(/\s/g, "")).then(() => { hapticSuccess(); setOk(true); setTimeout(() => setOk(false), 2000); }).catch(() => {}); }}
        className="w-full g-card rounded-[14px] p-3.5 flex items-center gap-3">
        <code className="text-[13px] font-mono font-bold text-[#1a1a2e] flex-1 text-left break-all select-all tracking-wider">{value}</code>
        <div className="shrink-0 w-8 h-8 rounded-[10px] flex items-center justify-center"
          style={{ background: ok ? "rgba(0,184,148,0.08)" : "rgba(108,92,231,0.06)" }}>
          {ok
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00B894" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="1.8"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>}
        </div>
      </motion.button>
    </div>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.95 }} onClick={() => { hapticFeedback("light"); onClick(); }}
      className="text-[#6C5CE7] text-[13px] font-semibold mb-4 flex items-center gap-1">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
      {t("back")}
    </motion.button>
  );
}

function PaymentSteps({ steps }: { steps: string[] }) {
  return (
    <div className="rounded-[16px] p-3.5 mb-4" style={{ background: "rgba(108,92,231,0.03)", border: "1px solid rgba(108,92,231,0.06)" }}>
      <div className="flex items-center gap-2 mb-2.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        <span className="text-[11px] font-bold text-[#6C5CE7] uppercase tracking-wider">{t("howItWorks")}</span>
      </div>
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-2.5 mb-2 last:mb-0">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 mt-0.5"
            style={{ background: i === steps.length - 1 ? "#00B894" : "linear-gradient(135deg, #6C5CE7, #0984E3)" }}>
            {i + 1}
          </div>
          <span className="text-[12px] text-[#6b7280] leading-relaxed">{step}</span>
        </div>
      ))}
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
  const lang = getLang();
  const isUkraine = lang === "uk";

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

  function openSupport() {
    window.open("https://t.me/studypro_support", "_blank");
  }

  if (confirmed) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        className="px-4 pt-16 pb-4 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
          style={{ background: "rgba(0,184,148,0.08)" }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00B894" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </motion.div>
        <h2 className="text-xl font-extrabold mb-1.5">{t("thankYou")}</h2>
        <p className="text-[13px] text-[#6b7280] text-center max-w-[260px] mb-2">{t("paymentPending")}</p>

        {(method === "card" || method === "crypto") && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="g-card rounded-[16px] p-3.5 mb-4 mt-2 max-w-[280px] w-full">
            <div className="flex items-start gap-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF9F43" strokeWidth="2" className="shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
              <p className="text-[11px] text-[#6b7280] leading-relaxed">
                {method === "card" ? t("sendScreenshot") : t("sendScreenshotCrypto")}
              </p>
            </div>
          </motion.div>
        )}

        {(method === "card" || method === "crypto") && (
          <motion.button whileTap={{ scale: 0.97 }} onClick={openSupport} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="btn-accent px-6 py-3 text-[13px] flex items-center justify-center gap-2 mb-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            @studypro_support
          </motion.button>
        )}

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

        <div className="flex items-center gap-3 mb-4">
          {isStars
            ? <div className="w-[44px] h-[44px] rounded-[14px] flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FFA502, #FF9F43)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z"/></svg>
              </div>
            : isCrypto
              ? <Icon3D id="crypto" size={44} />
              : <Icon3D id="card" size={44} />}
          <div>
            <h2 className="text-[20px] font-extrabold tracking-tight leading-tight">
              {isStars ? t("telegramStars") : isCrypto ? t("cryptoPayment") : t("cardPayment")}
            </h2>
            <p className="text-[11px] text-[#9ca3af] mt-0.5">
              {isStars ? t("starsPaymentDesc") : isCrypto ? t("cryptoPaymentDesc") : t("cardPaymentDesc")}
            </p>
          </div>
        </div>

        <div className="rounded-[22px] p-4 mb-4 relative overflow-hidden"
          style={{ background: "linear-gradient(145deg, #2d3436, #1e272e)", boxShadow: "0 12px 32px rgba(0,0,0,0.15)" }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, white, transparent 70%)", transform: "translate(30%, -30%)" }} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] text-white/30 font-bold uppercase tracking-wider">{t("paymentAmount")}</span>
              <span className="text-[9px] text-white/20 font-medium">
                {isStars ? "500 XTR" : isCrypto ? "5 USDT" : "250 UAH"}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[40px] font-extrabold text-white tabular tracking-tight leading-none">15</span>
              <span className="text-[12px] text-white/30 font-medium">{t("reportsAvailable").toLowerCase()}</span>
            </div>
          </div>
        </div>

        {!isStars && (
          <CopyField
            label={isCrypto ? t("walletAddress") + " (TRC-20)" : t("cardNumber")}
            value={isCrypto ? CRYPTO : CARD}
          />
        )}

        {!isStars && (
          <PaymentSteps steps={
            isCrypto
              ? [t("payStep1Crypto"), t("payStep2Crypto"), t("payStep3Crypto")]
              : [t("payStep1Card"), t("payStep2Card"), t("payStep3Card")]
          } />
        )}

        {!isStars && (
          <div className="g-card rounded-[14px] p-3 flex items-start gap-2.5 mb-4"
            style={{ border: "1px solid rgba(255,159,67,0.1)", background: "rgba(255,159,67,0.03)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF9F43" strokeWidth="2" className="mt-0.5 shrink-0">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>
            </svg>
            <p className="text-[11px] text-[#6b7280] leading-relaxed">
              {isCrypto ? t("sendScreenshotCrypto") : t("sendScreenshot")}
            </p>
          </div>
        )}

        {isStars && (
          <div className="g-card rounded-[14px] p-3.5 mb-4">
            <p className="text-[12px] text-[#6b7280] leading-relaxed mb-2">{t("starsInstructions")}</p>
            <p className="text-[11px] text-[#9ca3af]">{t("supportContact")}: <span className="font-semibold text-[#6C5CE7]">@studypro_support</span></p>
          </div>
        )}

        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.97 }} onClick={confirm} disabled={confirming}
            className="flex-1 btn-main py-[15px] text-[14px] flex items-center justify-center gap-2">
            {confirming ? <div className="spinner w-5 h-5" /> : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{t("iPaid")}</>}
          </motion.button>
          {!isStars && (
            <motion.button whileTap={{ scale: 0.97 }} onClick={openSupport}
              className="py-[15px] px-4 rounded-[16px] text-[13px] font-semibold flex items-center justify-center gap-1.5"
              style={{ background: "rgba(0,184,148,0.06)", color: "#00B894" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </motion.button>
          )}
        </div>
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

      <motion.div {...a(1)} className="mb-3">
        <div className="flex items-center gap-2 mb-2.5 px-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#6C5CE7] animate-pulse" />
          <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider">{t("choosePaymentMethod")}</span>
        </div>
      </motion.div>

      <div className="space-y-2.5">
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
                : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z"/></svg>}
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold text-[14px] leading-tight">{t("telegramStars")}</div>
              <div className="text-[11px] text-[#9ca3af] mt-0.5 font-medium">{t("starsPaymentDesc")}</div>
              <div className="text-[10px] text-[#FF9F43] mt-0.5 font-semibold">500 XTR · 15 {t("reportsAvailable").toLowerCase()}</div>
            </div>
            <div className="shrink-0 px-2.5 py-1 rounded-full text-[9px] font-bold"
              style={{ background: "rgba(255,159,67,0.08)", color: "#E67E22" }}>
              HOT
            </div>
          </motion.button>
        </motion.div>

        {isUkraine && (
          <motion.div {...a(3)}>
            <motion.button whileTap={{ scale: 0.97 }}
              onClick={() => { hapticFeedback("light"); setMethod("card"); }}
              className="w-full g-card rounded-[20px] p-4 flex items-center gap-3.5">
              <Icon3D id="card" size={48} />
              <div className="flex-1 text-left">
                <div className="font-bold text-[14px] leading-tight flex items-center gap-2">
                  {t("cardPayment")}
                  <span className="badge-g text-[8px] py-0.5 px-2">{t("popular")}</span>
                </div>
                <div className="text-[11px] text-[#9ca3af] mt-0.5 font-medium">{t("cardPaymentDesc")}</div>
                <div className="text-[10px] text-[#6C5CE7] mt-0.5 font-semibold">250 UAH · 15 {t("reportsAvailable").toLowerCase()}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </motion.button>
          </motion.div>
        )}

        <motion.div {...a(isUkraine ? 4 : 3)}>
          <motion.button whileTap={{ scale: 0.97 }}
            onClick={() => { hapticFeedback("light"); setMethod("crypto"); }}
            className="w-full g-card rounded-[20px] p-4 flex items-center gap-3.5">
            <Icon3D id="crypto" size={48} />
            <div className="flex-1 text-left">
              <div className="font-bold text-[14px] leading-tight">{t("cryptoPayment")}</div>
              <div className="text-[11px] text-[#9ca3af] mt-0.5 font-medium">{t("cryptoPaymentDesc")}</div>
              <div className="text-[10px] text-[#00B894] mt-0.5 font-semibold">5 USDT · 15 {t("reportsAvailable").toLowerCase()}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </motion.button>
        </motion.div>
      </div>

      <motion.div {...a(isUkraine ? 5 : 4)} className="mt-4 g-card rounded-[14px] p-3 flex items-start gap-2.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="1.5" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
        <div>
          <p className="text-[11px] text-[#6b7280] leading-relaxed">{t("paymentNote")}</p>
          <p className="text-[10px] text-[#9ca3af] mt-1">{t("adminWillCheck")}</p>
        </div>
      </motion.div>
    </div>
  );
}
