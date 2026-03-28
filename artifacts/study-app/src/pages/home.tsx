import { useState, useEffect, useRef } from "react";
import { useUser, usePhotoUrl, useLang } from "@/lib/store";
import { useLocation } from "wouter";
import { getReports, type ReportItem } from "@/lib/api";
import { hapticFeedback, hapticSuccess } from "@/lib/telegram";
import { t, getUserLevel, getReportTypeMap, getSubjectMap, getNextLevel } from "@/lib/i18n";
import { motion } from "framer-motion";

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    let start = 0;
    const step = Math.max(1, Math.ceil(value / 20));
    const id = setInterval(() => {
      start = Math.min(start + step, value);
      setDisplay(start);
      if (start >= value) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [value]);
  return <>{display}</>;
}

function RippleButton({
  children, onClick, className, style, disabled
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (disabled) return;
    const btn = ref.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const ripple = document.createElement("span");
    ripple.className = "water-ripple";
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
    onClick?.();
  }

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.96 }}
      onClick={handleClick}
      className={`water-ripple-container ${className || ""}`}
      style={style}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];
const s = (i: number) => ({
  initial: { opacity: 0, y: 18 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay: i * 0.07, duration: 0.5, ease },
});

export default function Home() {
  const user = useUser();
  const photoUrl = usePhotoUrl();
  const [, nav] = useLocation();
  useLang();
  const [recent, setRecent] = useState<ReportItem[]>([]);
  const [refCopied, setRefCopied] = useState(false);

  const bal = user ? (!user.freeReportsUsed ? user.balance + 1 : user.balance) : 0;
  const lvl = getUserLevel(user?.totalReports || 0);
  const nxt = getNextLevel(user?.totalReports || 0);
  const TYPES = getReportTypeMap();
  const SUBJECTS = getSubjectMap();
  const lvlProgress = nxt
    ? Math.min(((user?.totalReports || 0) - lvl.min) / (lvl.max - lvl.min + 1) * 100, 100)
    : 100;

  useEffect(() => {
    if (!user) return;
    getReports(user.telegramId).then(r => setRecent(r.reports.slice(0, 3))).catch(() => {});
  }, [user]);

  function copyRef() {
    navigator.clipboard.writeText(`https://t.me/studypro_bot?start=ref_${user?.referralCode || "---"}`);
    hapticSuccess();
    setRefCopied(true);
    setTimeout(() => setRefCopied(false), 2000);
  }

  return (
    <div className="px-4 pt-7 pb-4">
      {/* Header */}
      <motion.div {...s(0)} className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[25px] font-extrabold tracking-tight leading-tight">
            {t("welcome")}, <span className="gradient-text">{user?.firstName || "Student"}</span>
          </h1>
          <p className="text-[11px] text-white/22 font-medium mt-0.5">{t("subtitle")}</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => { hapticFeedback("light"); nav("/profile"); }}
          className="avatar-ring"
        >
          {photoUrl ? (
            <img src={photoUrl} alt="" className="w-[44px] h-[44px] rounded-full object-cover" />
          ) : (
            <div className="w-[44px] h-[44px] rounded-full flex items-center justify-center text-sm font-bold text-white premium-gradient">
              {(user?.firstName || "S").charAt(0).toUpperCase()}
            </div>
          )}
        </motion.button>
      </motion.div>

      {/* Hero Balance Card */}
      <motion.div {...s(1)}>
        <div className="hero-card hero-shimmer p-5 mb-3.5">
          <div className="shimmer-bar" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-1">
              <span className="text-[9px] text-white/28 font-bold tracking-[0.14em] uppercase">{t("yourBalance")}</span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-[9px]">{lvl.icon}</span>
                <span className="text-[9px] text-white/40 font-semibold">{lvl.name}</span>
              </div>
            </div>

            <div className="flex items-end gap-3 mt-1.5 mb-3">
              <span className="text-[60px] font-extrabold tabular leading-none tracking-tighter num-glow">
                <AnimatedNumber value={bal} />
              </span>
              <div className="pb-3">
                <div className="text-[11px] text-white/22 font-medium">{t("reportsAvailable")}</div>
                {!user?.freeReportsUsed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.14)" }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    <span className="text-[9px] font-semibold text-emerald-400">{t("firstReportFree")}</span>
                  </motion.div>
                )}
              </div>
            </div>

            {nxt && (
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[9px] text-white/20 font-semibold">{t("progress")}</span>
                  <span className="text-[9px] text-white/12 font-medium">{nxt.reportsNeeded} → {nxt.name}</span>
                </div>
                <div className="w-full h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${lvlProgress}%` }}
                    transition={{ delay: 0.8, duration: 1.2, ease }}
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #9B7FFF, #06B6D4, #10B981)" }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Action Grid — Bento style */}
      <motion.div {...s(2)} className="grid grid-cols-2 gap-2.5 mb-3.5">
        <RippleButton
          onClick={() => { hapticFeedback("medium"); nav("/new"); }}
          className="relative rounded-[20px] py-4 px-4 text-left flex flex-col gap-3 text-white overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(130,70,255,0.18), rgba(110,40,240,0.12))",
            border: "1px solid rgba(130,70,255,0.22)",
            backdropFilter: "blur(40px) saturate(200%)",
            boxShadow: "0 0 40px rgba(110,50,255,0.1), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <div className="absolute inset-0 rounded-[20px]"
            style={{ background: "radial-gradient(ellipse 80% 60% at 10% 0%, rgba(130,70,255,0.12), transparent 60%)" }} />
          <div className="w-10 h-10 rounded-[14px] flex items-center justify-center relative z-10"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
            </svg>
          </div>
          <div className="relative z-10">
            <div className="font-bold text-[13px]">{t("createReport")}</div>
            <div className="text-[10px] opacity-38 mt-0.5">{t("generateAI")}</div>
          </div>
        </RippleButton>

        <RippleButton
          onClick={() => { hapticFeedback("light"); nav("/balance"); }}
          className="g-card rounded-[20px] py-4 px-4 text-left flex flex-col gap-3 overflow-hidden"
        >
          <div className="absolute inset-0 rounded-[20px]"
            style={{ background: "radial-gradient(ellipse 70% 50% at 90% 0%, rgba(0,200,255,0.05), transparent 60%)" }} />
          <div className="w-10 h-10 rounded-[14px] flex items-center justify-center"
            style={{ background: "rgba(0,200,255,0.06)", border: "1px solid rgba(0,200,255,0.08)" }}>
            <span className="text-[16px]">💎</span>
          </div>
          <div>
            <div className="font-bold text-[13px] text-white/90">{t("topUp")}</div>
            <div className="text-[10px] text-white/25 mt-0.5">{t("reports15")}</div>
          </div>
        </RippleButton>
      </motion.div>

      {/* Stats — Bento 3-col */}
      <motion.div {...s(3)} className="grid grid-cols-3 gap-2 mb-3.5">
        {[
          { path: "/history", val: String(user?.totalReports || 0), sub: t("total"), accent: "#c4b5fd", glow: "rgba(196,181,253,0.3)" },
          { path: "/balance",  val: String(bal),                    sub: t("balance"),accent: "#67e8f9", glow: "rgba(103,232,249,0.3)" },
          { path: "/profile",  val: lvl.icon,                       sub: lvl.name,    accent: "#fcd34d", glow: "rgba(252,211,77,0.3)" },
        ].map((it) => (
          <RippleButton
            key={it.path + it.sub}
            onClick={() => { hapticFeedback("light"); nav(it.path); }}
            className="g-card rounded-[18px] py-4 px-3 flex flex-col items-center gap-1 overflow-hidden"
          >
            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 80% 80% at 50% 0%, ${it.glow.replace('0.3', '0.04')}, transparent)` }} />
            <span className="text-[22px] font-extrabold tabular relative z-10"
              style={{ color: it.accent, textShadow: `0 0 24px ${it.glow}` }}>
              {it.val}
            </span>
            <span className="text-[8px] text-white/22 font-semibold uppercase tracking-wider relative z-10">{it.sub}</span>
          </RippleButton>
        ))}
      </motion.div>

      {/* Recent History */}
      {recent.length > 0 && (
        <motion.div {...s(4)} className="mb-3.5">
          <div className="flex items-center justify-between mb-2.5">
            <span className="section-label">{t("history")}</span>
            <button
              onClick={() => { hapticFeedback("light"); nav("/history"); }}
              className="text-[10px] font-semibold text-[#c4b5fd]"
            >{t("allSubjects")}</button>
          </div>
          <div className="space-y-1.5">
            {recent.map(r => (
              <motion.button
                key={r.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => { hapticFeedback("light"); nav("/history"); }}
                className="w-full g-card rounded-[16px] p-3.5 text-left flex items-center gap-3"
              >
                <div className="icon-box text-base" style={{ background: "rgba(120,70,255,0.06)" }}>
                  {TYPES[r.reportType]?.icon || "📄"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-white/88 truncate">{r.topic}</div>
                  <div className="text-[10px] text-white/22 mt-0.5">
                    {TYPES[r.reportType]?.label} {SUBJECTS[r.subject]?.label ? `· ${SUBJECTS[r.subject].label}` : ""}
                  </div>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className="text-white/14 shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Referral Block */}
      <motion.div {...s(5)}>
        <div className="g-card rounded-[20px] p-4 relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 90% 100%, rgba(0,255,180,0.04), transparent)" }} />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="icon-box" style={{ background: "rgba(0,200,120,0.06)", border: "1px solid rgba(0,200,120,0.08)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" x2="19" y1="8" y2="14"/>
                <line x1="22" x2="16" y1="11" y2="11"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-bold text-[13px] text-white/90">{t("inviteFriends")}</div>
              <div className="text-[10px] text-white/22 mt-0.5">{t("referralBonus")}</div>
            </div>
            {user?.referralCount !== undefined && user.referralCount > 0 && (
              <span className="badge-g text-[9px]">{user.referralCount} {t("invited").toLowerCase()}</span>
            )}
          </div>
          <RippleButton
            onClick={copyRef}
            className="w-full btn-accent py-[12px] text-[13px] flex items-center justify-center gap-2"
          >
            {refCopied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                {t("linkCopied")}
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
                {t("copyLink")}
              </>
            )}
          </RippleButton>
        </div>
      </motion.div>
    </div>
  );
}
