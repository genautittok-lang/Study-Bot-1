import { useRef, useState } from "react";
import { useUser, useLang, updateBalance, refreshUser } from "@/lib/store";
import { createPayment, createInvoice } from "@/lib/api";
import { hapticFeedback, hapticSuccess, hapticError, getTelegramWebApp, useBackButton } from "@/lib/telegram";
import { t, getLang } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import Icon3D from "@/components/icons-3d";

type Method = "card" | "crypto" | "stars" | null;
type Step = "select" | "details" | "screenshot" | "done";
const CARD = "5232 4410 5654 6307";
const CRYPTO = "TRYbty4Ew9knf61brdrixeY5M34mQTt3zY";
const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

function CopyField({ label, value }: { label: string; value: string }) {
  const [ok, setOk] = useState(false);
  return (
    <div className="mb-3">
      <div className="text-[10px] text-[#9ca3af] font-bold tracking-wider uppercase mb-1.5">{label}</div>
      <motion.button whileTap={{ scale: 0.97 }}
        onClick={() => { navigator.clipboard.writeText(value.replace(/\s/g, "")).then(() => { hapticSuccess(); setOk(true); setTimeout(() => setOk(false), 2000); }).catch(() => {}); }}
        className="w-full rounded-[14px] p-3.5 flex items-center gap-3"
        style={{ background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(124,92,252,0.1)", backdropFilter: "blur(10px)" }}>
        <code className="text-[13px] font-mono font-bold text-[#1a1a2e] flex-1 text-left break-all select-all tracking-wider">{value}</code>
        <motion.div animate={{ scale: ok ? [1, 1.2, 1] : 1 }}
          className="shrink-0 w-8 h-8 rounded-[10px] flex items-center justify-center"
          style={{ background: ok ? "rgba(0,196,140,0.12)" : "rgba(124,92,252,0.08)" }}>
          {ok
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00C48C" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="1.8"><rect width="14" height="14" x="8" y="8" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>}
        </motion.div>
      </motion.button>
    </div>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.95 }} onClick={() => { hapticFeedback("light"); onClick(); }}
      className="flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-full text-[12px] font-semibold"
      style={{ background: "rgba(124,92,252,0.07)", color: "#7C5CFC" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
      {t("back")}
    </motion.button>
  );
}

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-1.5 mb-5">
      {[1, 2, 3].map((i) => (
        <motion.div key={i} animate={{ opacity: i <= step ? 1 : 0.3, scale: i === step ? 1.1 : 1 }}
          className="h-1.5 rounded-full flex-1 transition-all"
          style={{ background: i <= step ? "linear-gradient(90deg, #7C5CFC, #3B82F6)" : "rgba(0,0,0,0.08)" }} />
      ))}
    </div>
  );
}

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{
            width: [6, 4, 8, 5, 7, 4, 6, 5][i],
            height: [6, 4, 8, 5, 7, 4, 6, 5][i],
            background: ["rgba(124,92,252,0.3)", "rgba(74,144,255,0.3)", "rgba(0,196,140,0.3)", "rgba(255,159,67,0.3)", "rgba(124,92,252,0.2)", "rgba(74,144,255,0.2)", "rgba(0,196,140,0.2)", "rgba(255,159,67,0.2)"][i],
            left: `${[15, 75, 45, 85, 25, 60, 35, 70][i]}%`,
            top: `${[20, 60, 80, 30, 70, 15, 45, 55][i]}%`,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
    </div>
  );
}

export default function Balance() {
  const user = useUser();
  useLang();
  const [method, setMethod] = useState<Method>(null);
  const [step, setStep] = useState<Step>("select");
  const [submitting, setSubmitting] = useState(false);

  useBackButton(() => {
    if (step === "done") { setStep("select"); setMethod(null); }
    else if (step === "screenshot") { setStep("details"); }
    else if (step === "details") { setStep("select"); setMethod(null); }
    else { /* home via tab nav */ }
  });
  const [starsLoading, setStarsLoading] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState<string>("");
  const [screenshotError, setScreenshotError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lang = getLang();
  const isUkraine = lang === "uk";
  const bal = user ? (!user.freeReportsUsed ? user.balance + 1 : user.balance) : 0;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshotError(false);
    setScreenshotName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setScreenshot(ev.target?.result as string);
      hapticSuccess();
    };
    reader.readAsDataURL(file);
  }

  async function submit() {
    if (!user || !method) return;
    if (!screenshot) { setScreenshotError(true); hapticError(); return; }
    setSubmitting(true);
    try {
      await createPayment({ telegramId: user.telegramId, paymentMethod: method, screenshotData: screenshot });
      hapticSuccess();
      setStep("done");
    } catch { hapticError(); }
    setSubmitting(false);
  }

  async function payStars() {
    if (!user) return;
    const tg = getTelegramWebApp();
    if (!tg?.openInvoice) { setMethod("stars"); setStep("details"); return; }
    setStarsLoading(true); hapticFeedback("medium");
    try {
      const res = await createInvoice(user.telegramId);
      if (res.success && res.invoiceUrl) {
        tg.openInvoice(res.invoiceUrl, (status) => {
          setStarsLoading(false);
          if (status === "paid") { hapticSuccess(); updateBalance(user.balance + 15); setStep("done"); setMethod("stars"); setTimeout(() => refreshUser(), 2000); }
          else if (status === "failed") hapticError();
        });
      } else { setStarsLoading(false); setMethod("stars"); setStep("details"); }
    } catch { setStarsLoading(false); hapticError(); setMethod("stars"); setStep("details"); }
  }

  function reset() { setMethod(null); setStep("select"); setScreenshot(null); setScreenshotName(""); setScreenshotError(false); }

  // ─── DONE SCREEN ──────────────────────────────────────────────────────────
  if (step === "done") {
    const isStars = method === "stars";
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative px-4 pt-14 pb-6 flex flex-col items-center min-h-[75vh] justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(124,92,252,0.08) 0%, transparent 70%)" }} />

        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.55, duration: 0.7 }}
          className="relative mb-6">
          <div className="w-24 h-24 rounded-[28px] flex items-center justify-center relative"
            style={{ background: "linear-gradient(135deg, rgba(0,196,140,0.12), rgba(0,196,140,0.06))", border: "2px solid rgba(0,196,140,0.2)" }}>
            <FloatingParticles />
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00C48C" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          {[...Array(6)].map((_, i) => (
            <motion.div key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ["#7C5CFC", "#00C48C", "#3B82F6", "#FF9F43", "#7C5CFC", "#00C48C"][i],
                top: "50%", left: "50%",
              }}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{ scale: [0, 1, 0], x: [0, Math.cos(i * 60 * Math.PI / 180) * 50], y: [0, Math.sin(i * 60 * Math.PI / 180) * 50] }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
            />
          ))}
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-[22px] font-extrabold mb-2 text-center">
          {isStars ? "🎉 " + t("thankYou") : "📬 " + t("paymentSubmitted")}
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
          className="text-[13px] text-[#6b7280] text-center max-w-[280px] leading-relaxed mb-6">
          {isStars ? t("paymentPending") : t("paymentSubmittedDesc")}
        </motion.p>

        {!isStars && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
            className="w-full max-w-[300px] rounded-[18px] p-4 mb-5"
            style={{ background: "linear-gradient(135deg, rgba(124,92,252,0.06), rgba(74,144,255,0.04))", border: "1px solid rgba(124,92,252,0.1)" }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #7C5CFC, #3B82F6)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <span className="text-[11px] font-bold text-[#7C5CFC]">{t("adminReviewing")}</span>
            </div>
            <p className="text-[11px] text-[#6b7280] leading-relaxed">
              {t("paymentSubmittedDesc")}
            </p>
          </motion.div>
        )}

        <motion.button whileTap={{ scale: 0.97 }} onClick={reset}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
          className="px-8 py-3.5 rounded-[16px] text-[13px] font-bold"
          style={{ background: "linear-gradient(135deg, #7C5CFC, #3B82F6)", color: "white", boxShadow: "0 8px 20px rgba(124,92,252,0.3)" }}>
          {t("goBack")}
        </motion.button>
      </motion.div>
    );
  }

  // ─── SCREENSHOT STEP ──────────────────────────────────────────────────────
  if (step === "screenshot" && (method === "card" || method === "crypto")) {
    const isCrypto = method === "crypto";
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25, ease }}
        className="px-4 pt-5 pb-6">
        <BackBtn onClick={() => setStep("details")} />
        <StepIndicator step={3} />

        <div className="text-center mb-6">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.4 }}
            className="w-16 h-16 rounded-[20px] mx-auto mb-3 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(124,92,252,0.12), rgba(74,144,255,0.08))", border: "1.5px solid rgba(124,92,252,0.15)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="1.8">
              <rect width="18" height="18" x="3" y="3" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </motion.div>
          <h2 className="text-[18px] font-extrabold tracking-tight">{t("uploadScreenshot")}</h2>
          <p className="text-[12px] text-[#9ca3af] mt-1">{t("uploadScreenshotDesc")}</p>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => { hapticFeedback("light"); fileInputRef.current?.click(); }}
          className="w-full rounded-[20px] p-5 flex flex-col items-center justify-center gap-3 mb-3 relative overflow-hidden"
          style={{
            background: screenshot ? "rgba(0,196,140,0.04)" : "rgba(124,92,252,0.03)",
            border: `2px dashed ${screenshot ? "rgba(0,196,140,0.35)" : screenshotError ? "rgba(239,68,68,0.4)" : "rgba(124,92,252,0.2)"}`,
            minHeight: 120,
          }}>
          {screenshot ? (
            <>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
                className="w-12 h-12 rounded-[14px] flex items-center justify-center"
                style={{ background: "rgba(0,196,140,0.1)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00C48C" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              </motion.div>
              <div className="text-center">
                <div className="text-[13px] font-bold text-[#00C48C]">{t("screenshotUploaded")}</div>
                <div className="text-[10px] text-[#9ca3af] mt-0.5 max-w-[200px] truncate">{screenshotName}</div>
              </div>
              <div className="text-[11px] font-semibold text-[#7C5CFC]">{t("changeScreenshot")}</div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-[14px] flex items-center justify-center"
                style={{ background: screenshotError ? "rgba(239,68,68,0.06)" : "rgba(124,92,252,0.07)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={screenshotError ? "#EF4444" : "#7C5CFC"} strokeWidth="1.8">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div className="text-[13px] font-semibold text-[#374151]">{t("uploadScreenshot")}</div>
              {screenshotError && (
                <div className="text-[11px] font-medium text-red-500">{t("screenshotRequired")}</div>
              )}
            </>
          )}
        </motion.button>

        <div className="rounded-[14px] p-3 mb-4 flex items-start gap-2.5"
          style={{ background: "rgba(255,159,67,0.04)", border: "1px solid rgba(255,159,67,0.12)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF9F43" strokeWidth="2" className="shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
          </svg>
          <p className="text-[11px] text-[#6b7280] leading-relaxed">
            {isCrypto ? t("sendScreenshotCrypto") : t("sendScreenshot")}
          </p>
        </div>

        <motion.button whileTap={{ scale: 0.97 }} onClick={submit} disabled={submitting}
          className="w-full py-[15px] rounded-[18px] text-[14px] font-bold flex items-center justify-center gap-2"
          style={{
            background: screenshot ? "linear-gradient(135deg, #7C5CFC, #3B82F6)" : "rgba(124,92,252,0.4)",
            color: "white",
            boxShadow: screenshot ? "0 8px 24px rgba(124,92,252,0.3)" : "none",
          }}>
          {submitting
            ? <><div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />{t("submitting")}</>
            : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></svg>{t("supportSend")}</>}
        </motion.button>
      </motion.div>
    );
  }

  // ─── PAYMENT DETAILS ──────────────────────────────────────────────────────
  if (method === "card" || method === "crypto" || method === "stars") {
    const isCrypto = method === "crypto";
    const isStars = method === "stars";

    return (
      <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22, ease }}
        className="px-4 pt-5 pb-6">
        <BackBtn onClick={reset} />
        {!isStars && <StepIndicator step={2} />}

        <div className="flex items-center gap-3 mb-4">
          {isStars
            ? <div className="w-[44px] h-[44px] rounded-[14px] flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FFA502, #FF9F43)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z" /></svg>
              </div>
            : isCrypto ? <Icon3D id="crypto" size={44} /> : <Icon3D id="card" size={44} />}
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
          style={{ background: "linear-gradient(145deg, #2d3436, #1e272e)", boxShadow: "0 12px 32px rgba(0,0,0,0.18)" }}>
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, white, transparent 70%)", transform: "translate(30%, -30%)" }} />
          <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full opacity-5"
            style={{ background: "radial-gradient(circle, #7C5CFC, transparent 70%)", transform: "translate(-20%, 20%)" }} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] text-white/30 font-bold uppercase tracking-wider">{t("paymentAmount")}</span>
              <span className="text-[9px] text-white/20 font-medium">{isStars ? "500 XTR" : isCrypto ? "5 USDT" : "250 UAH"}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[44px] font-extrabold text-white tabular tracking-tight leading-none">15</span>
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
          <div className="rounded-[16px] p-3.5 mb-4" style={{ background: "rgba(124,92,252,0.03)", border: "1px solid rgba(124,92,252,0.07)" }}>
            <div className="flex items-center gap-2 mb-2.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
              <span className="text-[10px] font-bold text-[#7C5CFC] uppercase tracking-wider">{t("howItWorks")}</span>
            </div>
            {[
              isCrypto ? t("payStep1Crypto") : t("payStep1Card"),
              isCrypto ? t("payStep2Crypto") : t("payStep2Card"),
              isCrypto ? t("payStep3Crypto") : t("payStep3Card"),
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2.5 mb-2 last:mb-0">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 mt-0.5"
                  style={{ background: i === 2 ? "#00C48C" : "linear-gradient(135deg, #7C5CFC, #3B82F6)" }}>
                  {i + 1}
                </div>
                <span className="text-[12px] text-[#6b7280] leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        )}

        {isStars && (
          <div className="rounded-[14px] p-3.5 mb-4" style={{ background: "rgba(255,159,67,0.04)", border: "1px solid rgba(255,159,67,0.1)" }}>
            <p className="text-[12px] text-[#6b7280] leading-relaxed">{t("starsInstructions")}</p>
          </div>
        )}

        {!isStars && (
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => { hapticFeedback("light"); setStep("screenshot"); }}
            className="w-full py-[15px] rounded-[18px] text-[14px] font-bold flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #7C5CFC, #3B82F6)", color: "white", boxShadow: "0 8px 24px rgba(124,92,252,0.28)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            {t("iPaid")}
          </motion.button>
        )}
      </motion.div>
    );
  }

  // ─── METHOD SELECTION ─────────────────────────────────────────────────────
  const a = (i: number) => ({
    initial: { opacity: 0, y: 18 } as const,
    animate: { opacity: 1, y: 0 } as const,
    transition: { delay: i * 0.065, duration: 0.4, ease },
  });

  return (
    <div className="px-4 pt-5 pb-6">
      <motion.div {...a(0)} className="relative rounded-[28px] p-5 mb-5 overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #3B82F6, #3D7FE8, #7C5CFC)",
          boxShadow: "0 16px 48px rgba(74,144,255,0.35), 0 4px 12px rgba(124,92,252,0.2)",
        }}>
        <div className="absolute top-0 right-0 w-52 h-52 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, white 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #06D6A0 0%, transparent 70%)", transform: "translate(-20%, 20%)" }} />
        <div className="absolute top-3 right-4 flex gap-1.5">
          {["💜", "💙", "🟢"].map((c, i) => (
            <motion.span key={i} animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              style={{ fontSize: 10, filter: "blur(0px)" }}>{c}</motion.span>
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
            <span className="text-[10px] text-white/40 font-bold tracking-wider uppercase">{t("currentBalance")}</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#06D6A0] animate-pulse" />
              <span className="text-[9px] text-white/60 font-semibold">StudyFlush</span>
            </div>
          </div>

          <div className="flex items-end gap-3 mb-3">
            <motion.span
              key={bal}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-[60px] font-extrabold text-white tabular leading-none tracking-tight"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.15)" }}>{bal}</motion.span>
            <span className="text-[13px] text-white/35 pb-4 font-medium">{t("reportsAvailable")}</span>
          </div>

          {!user?.freeReportsUsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-1"
              style={{ background: "rgba(255,255,255,0.12)" }}>
              <span className="text-lg" style={{ lineHeight: 1 }}>🎁</span>
              <span className="text-[10px] font-bold text-white/80">{t("firstReportFree")}</span>
            </motion.div>
          )}

          <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <span className="text-[10px] text-white/25 font-medium">StudyFlush</span>
            <span className="text-[10px] text-white/20 font-medium tabular">{t("total")}: {user?.totalReports || 0}</span>
          </div>
        </div>
      </motion.div>

      <motion.div {...a(1)} className="mb-3">
        <div className="flex items-center gap-2 mb-2.5 px-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC] animate-pulse" />
          <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider">{t("choosePaymentMethod")}</span>
        </div>
      </motion.div>

      <div className="space-y-2.5">
        <motion.div {...a(2)}>
          <motion.button whileTap={{ scale: 0.97 }} onClick={payStars} disabled={starsLoading}
            className="w-full rounded-[20px] p-4 flex items-center gap-3.5 overflow-hidden relative"
            style={{
              background: "linear-gradient(135deg, rgba(255,165,2,0.1), rgba(255,159,67,0.04))",
              border: "1.5px solid rgba(255,159,67,0.2)",
            }}>
            <div className="absolute top-0 right-0 w-24 h-24 opacity-5 rounded-full"
              style={{ background: "radial-gradient(circle, #FFA502, transparent)", transform: "translate(30%, -30%)" }} />
            <div className="w-[48px] h-[48px] rounded-[15px] flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #FFA502, #FF9F43)", boxShadow: "0 4px 12px rgba(255,159,67,0.25)" }}>
              {starsLoading
                ? <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z" /></svg>}
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold text-[14px] leading-tight">{t("telegramStars")}</div>
              <div className="text-[11px] text-[#9ca3af] mt-0.5 font-medium">{t("starsPaymentDesc")}</div>
              <div className="text-[10px] text-[#FF9F43] mt-0.5 font-bold">500 XTR · 15 {t("reportsAvailable").toLowerCase()}</div>
            </div>
            <div className="shrink-0 px-2.5 py-1 rounded-full text-[9px] font-extrabold"
              style={{ background: "linear-gradient(135deg, #FFA502, #FF9F43)", color: "white" }}>
              HOT 🔥
            </div>
          </motion.button>
        </motion.div>

        {isUkraine && (
          <motion.div {...a(3)}>
            <motion.button whileTap={{ scale: 0.97 }}
              onClick={() => { hapticFeedback("light"); setMethod("card"); setStep("details"); }}
              className="w-full rounded-[20px] p-4 flex items-center gap-3.5 relative overflow-hidden"
              style={{ background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(0,0,0,0.06)", backdropFilter: "blur(10px)" }}>
              <Icon3D id="card" size={48} />
              <div className="flex-1 text-left">
                <div className="font-bold text-[14px] leading-tight flex items-center gap-2">
                  {t("cardPayment")}
                  <span className="text-[8px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "linear-gradient(135deg, rgba(124,92,252,0.12), rgba(74,144,255,0.08))", color: "#7C5CFC" }}>
                    {t("popular")}
                  </span>
                </div>
                <div className="text-[11px] text-[#9ca3af] mt-0.5 font-medium">{t("cardPaymentDesc")}</div>
                <div className="text-[10px] text-[#7C5CFC] mt-0.5 font-bold">250 UAH · 15 {t("reportsAvailable").toLowerCase()}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            </motion.button>
          </motion.div>
        )}

        <motion.div {...a(isUkraine ? 4 : 3)}>
          <motion.button whileTap={{ scale: 0.97 }}
            onClick={() => { hapticFeedback("light"); setMethod("crypto"); setStep("details"); }}
            className="w-full rounded-[20px] p-4 flex items-center gap-3.5 relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(0,0,0,0.06)", backdropFilter: "blur(10px)" }}>
            <Icon3D id="crypto" size={48} />
            <div className="flex-1 text-left">
              <div className="font-bold text-[14px] leading-tight">{t("cryptoPayment")}</div>
              <div className="text-[11px] text-[#9ca3af] mt-0.5 font-medium">{t("cryptoPaymentDesc")}</div>
              <div className="text-[10px] text-[#00C48C] mt-0.5 font-bold">5 USDT · 15 {t("reportsAvailable").toLowerCase()}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          </motion.button>
        </motion.div>
      </div>

      <motion.div {...a(isUkraine ? 5 : 4)} className="mt-4 rounded-[14px] p-3 flex items-start gap-2.5"
        style={{ background: "rgba(124,92,252,0.03)", border: "1px solid rgba(124,92,252,0.07)" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="1.5" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="16" y2="12" /><line x1="12" x2="12.01" y1="8" y2="8" /></svg>
        <div>
          <p className="text-[11px] text-[#6b7280] leading-relaxed">{t("paymentNote")}</p>
          <p className="text-[10px] text-[#9ca3af] mt-1">{t("adminWillCheck")}</p>
        </div>
      </motion.div>
    </div>
  );
}
