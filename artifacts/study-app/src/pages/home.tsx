import { useState, useEffect, useRef, useCallback } from "react";
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
    const step = Math.max(1, Math.ceil(value / 18));
    const id = setInterval(() => {
      start = Math.min(start + step, value);
      setDisplay(start);
      if (start >= value) clearInterval(id);
    }, 35);
    return () => clearInterval(id);
  }, [value]);
  return <>{display}</>;
}

function RippleBtn({ children, onClick, className, style, disabled }: {
  children: React.ReactNode; onClick?: () => void; className?: string; style?: React.CSSProperties; disabled?: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const el = ref.current;
    if (el) {
      const r = el.getBoundingClientRect();
      const sz = Math.max(r.width, r.height) * 1.4;
      const x = e.clientX - r.left - sz / 2;
      const y = e.clientY - r.top - sz / 2;
      const rip = document.createElement("span");
      rip.className = "water-ripple";
      rip.style.cssText = `width:${sz}px;height:${sz}px;left:${x}px;top:${y}px;`;
      el.appendChild(rip);
      setTimeout(() => rip.remove(), 600);
    }
    onClick?.();
  }, [disabled, onClick]);

  return (
    <motion.button ref={ref} whileTap={{ scale: 0.965 }} onClick={handleClick}
      className={`water-ripple-container ${className || ""}`} style={style} disabled={disabled}>
      {children}
    </motion.button>
  );
}

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];
const anim = (i: number) => ({
  initial: { opacity: 0, y: 16 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay: i * 0.06, duration: 0.45, ease },
});

export default function Home() {
  const user = useUser();
  const photo = usePhotoUrl();
  const [, go] = useLocation();
  useLang();
  const [recent, setRecent] = useState<ReportItem[]>([]);
  const [copied, setCopied] = useState(false);

  const bal = user ? (!user.freeReportsUsed ? user.balance + 1 : user.balance) : 0;
  const lvl = getUserLevel(user?.totalReports || 0);
  const nxt = getNextLevel(user?.totalReports || 0);
  const TYPES = getReportTypeMap();
  const SUBJECTS = getSubjectMap();
  const progress = nxt
    ? Math.min(((user?.totalReports || 0) - lvl.min) / (lvl.max - lvl.min + 1) * 100, 100)
    : 100;

  useEffect(() => {
    if (!user) return;
    getReports(user.telegramId).then(r => setRecent(r.reports.slice(0, 3))).catch(() => {});
  }, [user]);

  function copyRef() {
    navigator.clipboard.writeText(`https://t.me/studypro_bot?start=ref_${user?.referralCode || "---"}`);
    hapticSuccess(); setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="px-4 pt-6 pb-4">
      {/* ─── HEADER ─── */}
      <motion.div {...anim(0)} className="flex items-center justify-between mb-5">
        <div className="flex-1 min-w-0">
          <h1 className="text-[26px] font-extrabold tracking-tight leading-none mb-1">
            {t("welcome")},{" "}
            <span className="gradient-text">{user?.firstName || "Student"}</span>
          </h1>
          <p className="text-[11px] text-white/20 font-medium">{t("subtitle")}</p>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => { hapticFeedback("light"); go("/profile"); }}
          className="avatar-ring shrink-0 ml-3">
          {photo ? (
            <img src={photo} alt="" className="w-[42px] h-[42px] rounded-full object-cover" />
          ) : (
            <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center text-sm font-bold text-white premium-gradient">
              {(user?.firstName || "S")[0].toUpperCase()}
            </div>
          )}
        </motion.button>
      </motion.div>

      {/* ─── HERO BALANCE CARD ─── */}
      <motion.div {...anim(1)} className="hero-card hero-shimmer p-5 mb-3">
        <div className="shimmer-bar" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] text-white/25 font-bold tracking-[0.15em] uppercase">{t("yourBalance")}</span>
            <div className="flex items-center gap-1.5 px-2.5 py-[3px] rounded-full"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <span className="text-[10px]">{lvl.icon}</span>
              <span className="text-[9px] text-white/35 font-semibold">{lvl.name}</span>
            </div>
          </div>

          <div className="flex items-end gap-2.5">
            <span className="text-[56px] font-extrabold tabular leading-none tracking-[-0.06em] num-glow">
              <AnimatedNumber value={bal} />
            </span>
            <div className="pb-2.5 flex-1">
              <span className="text-[11px] text-white/18 font-medium block">{t("reportsAvailable")}</span>
              {!user?.freeReportsUsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md"
                  style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)" }}>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  <span className="text-[9px] font-semibold text-emerald-400">{t("firstReportFree")}</span>
                </motion.div>
              )}
            </div>
          </div>

          {nxt && (
            <div className="mt-3.5">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] text-white/18 font-semibold">{t("progress")}</span>
                <span className="text-[9px] text-white/10 font-medium tabular">{user?.totalReports || 0}/{nxt.reportsNeeded} → {nxt.name}</span>
              </div>
              <div className="w-full h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ delay: 0.7, duration: 1, ease }}
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #7c5aff, #06b6d4)" }}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* ─── ACTION CARDS ─── */}
      <motion.div {...anim(2)} className="grid grid-cols-2 gap-2.5 mb-3">
        <RippleBtn
          onClick={() => { hapticFeedback("medium"); go("/new"); }}
          className="relative rounded-[20px] p-4 text-left flex flex-col gap-2.5 text-white overflow-hidden"
          style={{
            background: "linear-gradient(140deg, rgba(120,80,255,0.15), rgba(100,40,240,0.08))",
            border: "1px solid rgba(120,80,255,0.18)",
            backdropFilter: "blur(40px) saturate(160%)",
            boxShadow: "0 1px 0 rgba(255,255,255,0.05) inset, 0 4px 24px rgba(100,40,255,0.08)",
          }}
        >
          <div className="w-10 h-10 rounded-[12px] flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
            </svg>
          </div>
          <div>
            <div className="font-bold text-[13px] leading-tight">{t("createReport")}</div>
            <div className="text-[10px] text-white/30 mt-0.5">{t("generateAI")}</div>
          </div>
        </RippleBtn>

        <RippleBtn
          onClick={() => { hapticFeedback("light"); go("/balance"); }}
          className="g-card rounded-[20px] p-4 text-left flex flex-col gap-2.5 overflow-hidden"
        >
          <div className="w-10 h-10 rounded-[12px] flex items-center justify-center"
            style={{ background: "rgba(0,180,220,0.06)", border: "1px solid rgba(0,180,220,0.08)" }}>
            <span className="text-[16px]">💎</span>
          </div>
          <div>
            <div className="font-bold text-[13px] text-white/90 leading-tight">{t("topUp")}</div>
            <div className="text-[10px] text-white/22 mt-0.5">{t("reports15")}</div>
          </div>
        </RippleBtn>
      </motion.div>

      {/* ─── STATS ─── */}
      <motion.div {...anim(3)} className="grid grid-cols-3 gap-2 mb-3">
        {[
          { path: "/history", val: String(user?.totalReports || 0), label: t("total"), color: "#b8a4ff" },
          { path: "/balance",  val: String(bal),                    label: t("balance"),color: "#7dd3fc" },
          { path: "/profile",  val: lvl.icon,                       label: lvl.name,    color: "#fcd34d" },
        ].map(item => (
          <RippleBtn key={item.label} onClick={() => { hapticFeedback("light"); go(item.path); }}
            className="g-card rounded-[18px] py-3.5 px-3 flex flex-col items-center gap-1.5 overflow-hidden">
            <span className="text-[22px] font-extrabold tabular leading-none"
              style={{ color: item.color, textShadow: `0 0 18px ${item.color}35` }}>{item.val}</span>
            <span className="text-[8px] text-white/20 font-semibold uppercase tracking-wider">{item.label}</span>
          </RippleBtn>
        ))}
      </motion.div>

      {/* ─── RECENT REPORTS ─── */}
      {recent.length > 0 && (
        <motion.div {...anim(4)} className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="section-label">{t("history")}</span>
            <button onClick={() => { hapticFeedback("light"); go("/history"); }}
              className="text-[10px] font-semibold text-[#b8a4ff] active:opacity-60 transition-opacity">{t("allSubjects")}</button>
          </div>
          <div className="space-y-1.5">
            {recent.map(r => (
              <motion.button key={r.id} whileTap={{ scale: 0.98 }}
                onClick={() => { hapticFeedback("light"); go("/history"); }}
                className="w-full g-card rounded-[16px] p-3 text-left flex items-center gap-3">
                <div className="icon-box text-[15px]" style={{ background: "rgba(120,80,255,0.06)" }}>
                  {TYPES[r.reportType]?.icon || "📄"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-white/85 truncate leading-tight">{r.topic}</div>
                  <div className="text-[10px] text-white/20 mt-0.5">
                    {TYPES[r.reportType]?.label}{SUBJECTS[r.subject]?.label ? ` · ${SUBJECTS[r.subject].label}` : ""}
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/12 shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* ─── REFERRAL ─── */}
      <motion.div {...anim(5)}>
        <div className="g-card rounded-[20px] p-4 overflow-hidden">
          <div className="flex items-center gap-3 mb-3">
            <div className="icon-box" style={{ background: "rgba(16,185,129,0.06)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-bold text-[13px] text-white/88 leading-tight">{t("inviteFriends")}</div>
              <div className="text-[10px] text-white/20 mt-0.5">{t("referralBonus")}</div>
            </div>
            {(user?.referralCount || 0) > 0 && (
              <span className="badge-g text-[9px]">{user?.referralCount} {t("invited").toLowerCase()}</span>
            )}
          </div>
          <RippleBtn onClick={copyRef}
            className="w-full btn-accent py-[11px] text-[13px] flex items-center justify-center gap-2">
            {copied ? (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{t("linkCopied")}</>
            ) : (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>{t("copyLink")}</>
            )}
          </RippleBtn>
        </div>
      </motion.div>
    </div>
  );
}
