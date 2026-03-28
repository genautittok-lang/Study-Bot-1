import { useState } from "react";
import { useUser, useLang } from "@/lib/store";
import { createPayment } from "@/lib/api";
import { hapticFeedback, hapticSuccess, hapticError } from "@/lib/telegram";
import { t } from "@/lib/i18n";
import { motion } from "framer-motion";

type Method = "card" | "google_pay" | "apple_pay" | "crypto" | "stars" | null;

const CARD_NUMBER = "5375 4141 2121 2120";
const CRYPTO_ADDR = "TLdH6NMj7g3jKcB6pnEPr5wfbUjqTe5GxP";

function PaymentMethod({ icon, title, price, tag, onClick }: { icon: React.ReactNode; title: string; price: string; tag?: string; onClick: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.97 }} onClick={() => { hapticFeedback("light"); onClick(); }}
      className="card-interactive rounded-2xl p-4 text-left flex items-center gap-4 w-full">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: "linear-gradient(135deg, rgba(102,126,234,0.08), rgba(118,75,162,0.05))" }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-[14px] text-foreground flex items-center gap-2">
          {title}
          {tag && <span className="badge-success text-[10px]">{tag}</span>}
        </div>
        <div className="text-[12px] text-muted-foreground/45 mt-0.5">{price}</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/20"><polyline points="9 18 15 12 9 6"/></svg>
    </motion.button>
  );
}

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

export default function Balance() {
  const user = useUser();
  useLang();
  const [method, setMethod] = useState<Method>(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

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

  if (confirmed) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pt-20 pb-4 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 pop-in"
          style={{ background: "linear-gradient(135deg, rgba(67,233,123,0.1), rgba(56,249,215,0.05))" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#43e97b" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">{t("thankYou")}</h2>
        <p className="text-[14px] text-muted-foreground/50 text-center max-w-[280px] mb-6">{t("paymentPending")}</p>
        <button onClick={() => { setMethod(null); setConfirmed(false); }} className="btn-ghost px-8 py-3 text-[14px] font-semibold">{t("goBack")}</button>
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
        <div className="hero-card p-5 mb-5">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-5">
              <div className="text-[11px] text-white/25 font-semibold tracking-[0.1em] uppercase">{t("paymentAmount")}</div>
              <span className="text-[11px] text-white/20 font-medium">15 {t("reportsAvailable").toLowerCase()}</span>
            </div>
            <div className="text-[36px] font-black text-white tabular tracking-tight mb-1">250 ₴</div>
            <div className="text-[12px] text-white/25 font-medium">StudyPro</div>
          </div>
        </div>
        <CopyField label={t("cardNumber")} value={CARD_NUMBER} />
        <div className="mt-4 card rounded-2xl p-4 flex items-center gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/30 shrink-0">
            <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/>
          </svg>
          <p className="text-[12px] text-muted-foreground/40 leading-relaxed">{t("cardNote")} <span className="font-mono font-bold text-foreground">{user?.telegramId}</span></p>
        </div>
        <div className="mt-6">
          <motion.button whileTap={{ scale: 0.97 }} onClick={confirm} disabled={confirming}
            className="w-full btn-primary py-4 text-[15px] font-semibold flex items-center justify-center gap-2">
            {confirming ? <div className="spinner w-5 h-5" /> : <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{t("iPaid")}</>}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (method === "crypto") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pt-6 pb-4">
        <BackBtn onClick={() => setMethod(null)} />
        <h2 className="text-[22px] font-bold text-foreground tracking-tight mb-1">{t("cryptoPayment")}</h2>
        <p className="text-[14px] text-muted-foreground/50 mb-6">USDT · TRC-20</p>
        <div className="hero-card p-5 mb-5">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-5">
              <div className="text-[11px] text-white/25 font-semibold tracking-[0.1em] uppercase">{t("paymentAmount")}</div>
              <span className="text-[11px] text-white/20 font-medium">15 {t("reportsAvailable").toLowerCase()}</span>
            </div>
            <div className="text-[36px] font-black text-white tabular tracking-tight mb-1">5 USDT</div>
            <div className="text-[12px] text-white/25 font-medium">TRC-20</div>
          </div>
        </div>
        <CopyField label={t("walletAddress")} value={CRYPTO_ADDR} />
        <div className="mt-6">
          <motion.button whileTap={{ scale: 0.97 }} onClick={confirm} disabled={confirming}
            className="w-full btn-primary py-4 text-[15px] font-semibold flex items-center justify-center gap-2">
            {confirming ? <div className="spinner w-5 h-5" /> : <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{t("iPaid")}</>}
          </motion.button>
          <p className="text-center text-[11px] text-muted-foreground/30 mt-3">{t("paymentNote")}</p>
        </div>
      </motion.div>
    );
  }

  if (method === "stars") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pt-6 pb-4">
        <BackBtn onClick={() => setMethod(null)} />
        <h2 className="text-[22px] font-bold text-foreground tracking-tight mb-1">{t("telegramStars")}</h2>
        <p className="text-[14px] text-muted-foreground/50 mb-6">{t("starsDesc")}</p>
        <div className="hero-card p-5 mb-5">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-5">
              <div className="text-[11px] text-white/25 font-semibold tracking-[0.1em] uppercase">{t("paymentAmount")}</div>
              <span className="text-[11px] text-white/20 font-medium">15 {t("reportsAvailable").toLowerCase()}</span>
            </div>
            <div className="text-[36px] font-black text-white tabular tracking-tight mb-1">⭐ 500</div>
            <div className="text-[12px] text-white/25 font-medium">Telegram Stars</div>
          </div>
        </div>
        <div className="card rounded-2xl p-5">
          <p className="text-[14px] text-foreground leading-relaxed mb-4">{t("starsInstructions")}</p>
          <p className="text-[13px] text-muted-foreground/50">{t("supportContact")}: <span className="font-semibold text-foreground">@studypro_support</span></p>
        </div>
        <div className="mt-6">
          <motion.button whileTap={{ scale: 0.97 }} onClick={confirm} disabled={confirming}
            className="w-full btn-primary py-4 text-[15px] font-semibold flex items-center justify-center gap-2">
            {confirming ? <div className="spinner w-5 h-5" /> : <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{t("payInBot")}</>}
          </motion.button>
          <p className="text-center text-[11px] text-muted-foreground/30 mt-3">{t("paymentNote")}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-4">
      <h2 className="text-[22px] font-bold text-foreground tracking-tight mb-1">{t("balance")}</h2>
      <p className="text-[14px] text-muted-foreground/50 mb-6">{t("topUpBalance")}</p>

      <div className="hero-card hero-shimmer p-6 mb-6">
        <div className="shimmer-bar" />
        <div className="relative z-10 text-white">
          <div className="text-[11px] text-white/25 font-semibold tracking-[0.1em] uppercase mb-3">{t("currentBalance")}</div>
          <div className="flex items-end gap-3">
            <span className="text-[48px] font-black tabular leading-none tracking-tighter">{balance}</span>
            <span className="text-[14px] text-white/20 pb-2 font-medium">{t("reportsAvailable")}</span>
          </div>
          {!user?.freeReportsUsed && (
            <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl"
              style={{ background: "rgba(67, 233, 123, 0.1)", border: "1px solid rgba(67, 233, 123, 0.15)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#43e97b" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              <span className="text-[11px] font-semibold" style={{ color: "rgba(67, 233, 123, 0.9)" }}>{t("firstReportFree")}</span>
            </div>
          )}
        </div>
      </div>

      <div className="section-title mb-3">{t("choosePaymentMethod")}</div>
      <div className="space-y-2.5">
        <PaymentMethod onClick={() => setMethod("card")} title={t("cardPayment")} price="250 UAH" tag={t("popular")}
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="1.7"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>} />
        <PaymentMethod onClick={() => setMethod("google_pay")} title={t("googlePay")} price="250 UAH"
          icon={<span className="text-xl font-bold" style={{ color: "#667eea" }}>G</span>} />
        <PaymentMethod onClick={() => setMethod("apple_pay")} title={t("applePay")} price="250 UAH"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="1.7"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>} />
        <PaymentMethod onClick={() => setMethod("crypto")} title={t("cryptoPayment")} price="5 USDT (TRC-20)"
          icon={<span className="text-xl font-bold" style={{ color: "#667eea" }}>₮</span>} />
        <PaymentMethod onClick={() => setMethod("stars")} title={t("telegramStars")} price="500 XTR"
          icon={<span className="text-xl">⭐</span>} />
      </div>

      <div className="mt-6 card rounded-2xl p-4 flex items-center gap-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/30 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
        <p className="text-[12px] text-muted-foreground/40 leading-relaxed">{t("paymentNote")}</p>
      </div>
    </div>
  );
}
