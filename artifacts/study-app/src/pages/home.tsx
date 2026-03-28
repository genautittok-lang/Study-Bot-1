import { useState, useEffect, useRef } from "react";
import { useUser, usePhotoUrl, useLang } from "@/lib/store";
import { useLocation } from "wouter";
import { getReports, type ReportItem } from "@/lib/api";
import { hapticFeedback, hapticSuccess } from "@/lib/telegram";
import { t, getUserLevel, getReportTypeMap, getNextLevel } from "@/lib/i18n";
import { motion, useMotionValue, useTransform } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];
const anim = (i: number) => ({
  initial: { opacity: 0, y: 20 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay: i * 0.07, duration: 0.5, ease },
});

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 6) return "🌙";
  if (h < 12) return "☀️";
  if (h < 18) return "🌤";
  return "🌆";
}

function ProgressRing({ progress, size = 80, stroke = 5 }: { progress: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(108,92,231,0.08)" strokeWidth={stroke} />
      <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#ringGrad)" strokeWidth={stroke}
        strokeLinecap="round"
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ delay: 0.5, duration: 1.2, ease }}
        strokeDasharray={circ} />
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6C5CE7" />
          <stop offset="100%" stopColor="#00CEC9" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function AnimatedCounter({ value, className }: { value: number; className?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!value) { setN(0); return; }
    let s = 0;
    const step = Math.max(1, Math.ceil(value / 20));
    const id = setInterval(() => { s = Math.min(s + step, value); setN(s); if (s >= value) clearInterval(id); }, 30);
    return () => clearInterval(id);
  }, [value]);
  return <span className={className}>{n}</span>;
}

function TiltCard({ children, className, onClick, style }: {
  children: React.ReactNode; className?: string; onClick?: () => void; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [4, -4]);
  const rotateY = useTransform(x, [-100, 100], [-4, 4]);

  function handleMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }
  function handleLeave() { x.set(0); y.set(0); }

  return (
    <motion.button ref={ref}
      onPointerMove={handleMove} onPointerLeave={handleLeave}
      style={{ ...style, rotateX, rotateY, transformPerspective: 600, transformStyle: "preserve-3d" }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={className}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.button>
  );
}

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
  const progress = nxt
    ? Math.min(((user?.totalReports || 0) - lvl.min) / (lvl.max - lvl.min + 1) * 100, 100)
    : 100;

  useEffect(() => {
    if (!user) return;
    getReports(user.telegramId).then(r => setRecent(r.reports.slice(0, 2))).catch(() => {});
  }, [user]);

  function copyRef() {
    navigator.clipboard.writeText(`https://t.me/studypro_bot?start=ref_${user?.referralCode || "---"}`)
      .then(() => { hapticSuccess(); setCopied(true); setTimeout(() => setCopied(false), 2000); })
      .catch(() => {});
  }

  return (
    <div className="px-4 pt-5 pb-4">
      {/* ─── GREETING ─── */}
      <motion.div {...anim(0)} className="flex items-center gap-3 mb-6">
        <motion.button whileTap={{ scale: 0.88 }} onClick={() => { hapticFeedback("light"); go("/profile"); }}
          className="avatar-ring shrink-0">
          {photo ? (
            <img src={photo} alt="" className="w-[44px] h-[44px] rounded-full object-cover" />
          ) : (
            <div className="w-[44px] h-[44px] rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #6C5CE7, #5A4BD1)" }}>
              {(user?.firstName || "S")[0].toUpperCase()}
            </div>
          )}
        </motion.button>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] text-[#9ca3af] font-medium flex items-center gap-1.5">
            <span>{getGreeting()}</span>
            <span>{t("welcome")}</span>
          </div>
          <h1 className="text-[22px] font-extrabold tracking-tight leading-tight truncate">
            {user?.firstName || "Student"}
          </h1>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => { hapticFeedback("light"); go("/balance"); }}
          className="relative shrink-0">
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(108,92,231,0.06)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="1.8">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </div>
          {bal > 0 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 text-[9px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, #6C5CE7, #0984E3)", boxShadow: "0 2px 6px rgba(108,92,231,0.35)" }}>
              {bal}
            </motion.div>
          )}
        </motion.button>
      </motion.div>

      {/* ─── MAIN CTA — CREATE REPORT ─── */}
      <motion.div {...anim(1)}>
        <TiltCard
          onClick={() => { hapticFeedback("medium"); go("/new"); }}
          className="relative rounded-[28px] p-5 mb-4 cursor-pointer overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #6C5CE7 0%, #5A4BD1 40%, #4834B5 100%)",
            boxShadow: "0 12px 40px rgba(108,92,231,0.3), 0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, white 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #00CEC9 0%, transparent 70%)", transform: "translate(-20%, 20%)" }} />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex-1">
              <div className="text-white/50 text-[11px] font-semibold mb-1 uppercase tracking-wider">{t("quickStart")}</div>
              <div className="text-white text-[20px] font-extrabold leading-tight mb-1.5">{t("createReport")}</div>
              <div className="text-white/45 text-[12px] font-medium">{t("generateAI")}</div>
            </div>
            <div className="w-[56px] h-[56px] rounded-[18px] flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
              <motion.div animate={{ rotate: [0, 90, 180, 270, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
                </svg>
              </motion.div>
            </div>
          </div>
          
          {!user?.freeReportsUsed && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="relative z-10 mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.12)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#00CEC9] animate-pulse" />
              <span className="text-[10px] font-semibold text-white/80">{t("firstReportFree")}</span>
            </motion.div>
          )}
        </TiltCard>
      </motion.div>

      {/* ─── BALANCE + PROGRESS RING ─── */}
      <motion.div {...anim(2)} className="flex gap-3 mb-4">
        <TiltCard
          onClick={() => { hapticFeedback("light"); go("/balance"); }}
          className="flex-1 g-card rounded-[22px] p-4 cursor-pointer overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] text-[#9ca3af] font-semibold uppercase tracking-wider mb-1">{t("balance")}</div>
              <div className="text-[36px] font-extrabold tabular leading-none tracking-tight" style={{ color: "#6C5CE7" }}>
                <AnimatedCounter value={bal} />
              </div>
              <div className="text-[11px] text-[#b0b0c0] mt-1 font-medium">{t("reportsAvailable")}</div>
            </div>
            <div className="relative">
              <ProgressRing progress={progress} size={64} stroke={4} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[16px]">{lvl.icon}</span>
              </div>
            </div>
          </div>
        </TiltCard>
      </motion.div>

      {/* ─── QUICK ACTIONS — HORIZONTAL SCROLL ─── */}
      <motion.div {...anim(3)} className="mb-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
          {[
            { icon: "💎", label: t("topUp"), desc: "15 rep", go: "/balance", bg: "linear-gradient(135deg, rgba(0,206,201,0.08), rgba(9,132,227,0.05))", border: "rgba(0,206,201,0.12)" },
            { icon: "📊", label: t("history"), desc: `${user?.totalReports || 0} ${t("total").toLowerCase()}`, go: "/history", bg: "linear-gradient(135deg, rgba(255,159,67,0.08), rgba(255,107,107,0.05))", border: "rgba(255,159,67,0.12)" },
            { icon: "👤", label: t("profile"), desc: lvl.name, go: "/profile", bg: "linear-gradient(135deg, rgba(108,92,231,0.08), rgba(253,121,168,0.05))", border: "rgba(108,92,231,0.12)" },
            { icon: "👥", label: t("inviteFriends"), desc: `+2 ${t("reports5").toLowerCase()}`, go: "#ref", bg: "linear-gradient(135deg, rgba(0,184,148,0.08), rgba(0,206,201,0.05))", border: "rgba(0,184,148,0.12)" },
          ].map((item, i) => (
            <motion.button key={i}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.35, ease }}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                hapticFeedback("light");
                if (item.go === "#ref") {
                  copyRef();
                } else {
                  go(item.go);
                }
              }}
              className="flex-shrink-0 rounded-[18px] p-3.5 min-w-[120px]"
              style={{ background: item.bg, border: `1px solid ${item.border}` }}
            >
              <span className="text-[24px] block mb-2">{item.icon}</span>
              <div className="text-[12px] font-bold leading-tight text-left">{item.label}</div>
              <div className="text-[10px] text-[#9ca3af] mt-0.5 text-left font-medium">{item.desc}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ─── STATS BENTO ─── */}
      <motion.div {...anim(4)} className="grid grid-cols-3 gap-2 mb-4">
        <motion.button whileTap={{ scale: 0.94 }} onClick={() => { hapticFeedback("light"); go("/history"); }}
          className="g-card rounded-[18px] p-3 text-center">
          <div className="text-[24px] font-extrabold tabular" style={{ color: "#6C5CE7" }}>
            <AnimatedCounter value={user?.totalReports || 0} />
          </div>
          <div className="text-[8px] text-[#b0b0c0] font-bold uppercase tracking-wider mt-1">{t("total")}</div>
        </motion.button>
        <motion.button whileTap={{ scale: 0.94 }} onClick={() => { hapticFeedback("light"); go("/balance"); }}
          className="g-card rounded-[18px] p-3 text-center">
          <div className="text-[24px] font-extrabold tabular" style={{ color: "#0984E3" }}>
            <AnimatedCounter value={bal} />
          </div>
          <div className="text-[8px] text-[#b0b0c0] font-bold uppercase tracking-wider mt-1">{t("balance")}</div>
        </motion.button>
        <motion.button whileTap={{ scale: 0.94 }} onClick={() => { hapticFeedback("light"); go("/profile"); }}
          className="g-card rounded-[18px] p-3 text-center">
          <div className="text-[24px] leading-none">{lvl.icon}</div>
          <div className="text-[8px] text-[#b0b0c0] font-bold uppercase tracking-wider mt-1.5">{lvl.name}</div>
        </motion.button>
      </motion.div>

      {/* ─── RECENT ACTIVITY ─── */}
      {recent.length > 0 && (
        <motion.div {...anim(5)} className="mb-4">
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00B894] animate-pulse" />
              <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider">{t("history")}</span>
            </div>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => { hapticFeedback("light"); go("/history"); }}
              className="text-[11px] font-semibold text-[#6C5CE7] flex items-center gap-0.5">
              {t("allSubjects")}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </motion.button>
          </div>
          {recent.map((r, i) => (
            <motion.button key={r.id}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { hapticFeedback("light"); go("/history"); }}
              className="w-full g-card rounded-[16px] p-3.5 mb-1.5 flex items-center gap-3 text-left">
              <div className="w-[42px] h-[42px] rounded-[13px] flex items-center justify-center text-[18px] shrink-0"
                style={{ background: "rgba(108,92,231,0.05)" }}>
                {TYPES[r.reportType]?.icon || "📄"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold truncate leading-tight">{r.topic}</div>
                <div className="text-[10px] text-[#b0b0c0] mt-0.5 font-medium">{TYPES[r.reportType]?.label}</div>
              </div>
              <div className="text-[10px] text-[#d1d5db] font-medium shrink-0">{new Date(r.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</div>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* ─── REFERRAL BANNER ─── */}
      <motion.div {...anim(6)}>
        <motion.button whileTap={{ scale: 0.97 }} onClick={copyRef}
          className="w-full rounded-[22px] p-4 flex items-center gap-3 overflow-hidden relative"
          style={{
            background: "linear-gradient(135deg, rgba(0,184,148,0.06), rgba(0,206,201,0.03))",
            border: "1px solid rgba(0,184,148,0.1)",
          }}>
          <div className="w-[44px] h-[44px] rounded-full flex items-center justify-center shrink-0"
            style={{ background: "rgba(0,184,148,0.08)" }}>
            {copied ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00B894" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </motion.div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00B894" strokeWidth="1.8">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>
              </svg>
            )}
          </div>
          <div className="flex-1 text-left">
            <div className="text-[13px] font-bold leading-tight">
              {copied ? t("linkCopied") : t("inviteFriends")}
            </div>
            <div className="text-[11px] text-[#9ca3af] mt-0.5 font-medium">{t("referralBonus")}</div>
          </div>
          {(user?.referralCount || 0) > 0 && (
            <div className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold"
              style={{ background: "rgba(0,184,148,0.08)", color: "#00B894" }}>
              {user?.referralCount}
            </div>
          )}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" className="shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
        </motion.button>
      </motion.div>
    </div>
  );
}
