import { useState, useEffect, useRef } from "react";
import { useUser, usePhotoUrl, useLang, getRecentItems, type RecentItem } from "@/lib/store";
import { useLocation } from "wouter";
import { getReports, type ReportItem } from "@/lib/api";
import { hapticFeedback, hapticSuccess, hapticSelection, shareViaTelegram } from "@/lib/telegram";
import { t, getUserLevel, getReportTypeMap, getNextLevel } from "@/lib/i18n";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import Icon3D from "@/components/icons-3d";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];
const spring = { type: "spring" as const, bounce: 0.25, duration: 0.6 };
const anim = (i: number) => ({
  initial: { opacity: 0, y: 18 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay: i * 0.06, duration: 0.45, ease },
});

function getGreeting(): { emoji: string; text: string } {
  const h = new Date().getHours();
  if (h < 6) return { emoji: "🌙", text: "Night owl" };
  if (h < 12) return { emoji: "☀️", text: "" };
  if (h < 18) return { emoji: "🌤", text: "" };
  return { emoji: "🌆", text: "" };
}

const TIPS = [
  "Be specific with your topic for better results",
  "Attach a photo of your task for precise output",
  "Use 'Full' length for detailed academic papers",
  "Try different document types for varied formats",
  "Invite friends to earn free reports",
  "Generated content supports tables and code blocks",
];

function ProgressRing({ progress, size = 56, stroke = 4 }: { progress: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(124,92,252,0.08)" strokeWidth={stroke} />
      <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#ringGradHome)" strokeWidth={stroke}
        strokeLinecap="round"
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ delay: 0.5, duration: 1.2, ease }}
        strokeDasharray={circ} />
      <defs>
        <linearGradient id="ringGradHome" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C5CFC" />
          <stop offset="100%" stopColor="#06D6A0" />
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
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={className}
      transition={spring}
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
  const [recentItems] = useState<RecentItem[]>(() => getRecentItems());
  const [tipIdx, setTipIdx] = useState(() => Math.floor(Math.random() * TIPS.length));

  const bal = user ? (!user.freeReportsUsed ? user.balance + 1 : user.balance) : 0;
  const lvl = getUserLevel(user?.totalReports || 0);
  const nxt = getNextLevel(user?.totalReports || 0);
  const TYPES = getReportTypeMap();
  const progress = nxt
    ? Math.min(((user?.totalReports || 0) - lvl.min) / (lvl.max - lvl.min + 1) * 100, 100)
    : 100;

  useEffect(() => {
    if (!user) return;
    getReports(user.telegramId).then(r => setRecent(r.reports.slice(0, 3))).catch(() => {});
  }, [user]);

  useEffect(() => {
    const iv = setInterval(() => setTipIdx(i => (i + 1) % TIPS.length), 5000);
    return () => clearInterval(iv);
  }, []);

  const refLink = `https://t.me/studyflush_bot?start=ref_${user?.referralCode || "---"}`;

  function copyRef() {
    navigator.clipboard.writeText(refLink)
      .then(() => { hapticSuccess(); setCopied(true); setTimeout(() => setCopied(false), 2000); })
      .catch(() => {});
  }

  const hasRefCode = !!user?.referralCode && user.referralCode !== "---";

  function shareRefTelegram() {
    if (!hasRefCode) return;
    hapticFeedback("medium");
    shareViaTelegram(`🎓 ${t("shareWithFriend")}!\n\n${t("referralStep3")}\n\n${refLink}`);
  }

  const { emoji: greetEmoji } = getGreeting();

  return (
    <div className="px-3.5 pt-4 pb-4">
      <motion.div {...anim(0)} className="flex items-center gap-3 mb-4">
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => { hapticFeedback("light"); go("/profile"); }}
          className="avatar-ring shrink-0">
          {photo ? (
            <img src={photo} alt="" className="w-[44px] h-[44px] rounded-full object-cover" />
          ) : (
            <div className="w-[44px] h-[44px] rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #7C5CFC, #6336F5)" }}>
              {(user?.firstName || "S")[0].toUpperCase()}
            </div>
          )}
        </motion.button>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] text-[#8b90a0] font-medium flex items-center gap-1">
            <span>{greetEmoji}</span>
            <span>{t("welcome")}</span>
          </div>
          <h1 className="text-[20px] font-extrabold tracking-tight leading-tight truncate">
            {user?.firstName || "Student"}
          </h1>
        </div>
        <motion.button whileTap={{ scale: 0.88 }} onClick={() => { hapticFeedback("light"); go("/balance"); }}
          aria-label={t("balance")}
          className="relative shrink-0">
          <div className="w-10 h-10 rounded-[13px] flex items-center justify-center"
            style={{ background: "rgba(124,92,252,0.06)", border: "1px solid rgba(124,92,252,0.08)" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="1.8">
              <rect width="20" height="14" x="2" y="5" rx="2"/>
              <line x1="2" x2="22" y1="10" y2="10"/>
            </svg>
          </div>
          {bal > 0 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
              className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 text-[8px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, #7C5CFC, #3B82F6)", boxShadow: "0 2px 8px rgba(124,92,252,0.4)" }}>
              {bal}
            </motion.div>
          )}
        </motion.button>
      </motion.div>

      <motion.div {...anim(1)}>
        <TiltCard
          onClick={() => { hapticFeedback("medium"); go("/new"); }}
          className="relative rounded-[24px] p-5 mb-3 cursor-pointer overflow-hidden w-full text-left hero-glow"
          style={{
            background: "linear-gradient(145deg, #8B6CFF 0%, #7C5CFC 25%, #6355D8 50%, #5143C2 80%, #4A3AB8 100%)",
            boxShadow: "0 12px 40px rgba(124,92,252,0.3), 0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, white 0%, transparent 70%)", transform: "translate(25%, -35%)" }} />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #06D6A0 0%, transparent 70%)", transform: "translate(-25%, 25%)" }} />
          
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-white/40 text-[9px] font-bold mb-1.5 uppercase tracking-[0.14em]">{t("quickStart")}</div>
              <div className="text-white text-[20px] font-extrabold leading-tight mb-0.5">{t("createReport")}</div>
              <div className="text-white/35 text-[11px] font-medium">{t("generateAI")}</div>
            </div>
            <div className="w-[52px] h-[52px] rounded-[18px] flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <motion.div animate={{ rotate: [0, 90, 180, 270, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
                </svg>
              </motion.div>
            </div>
          </div>
          
          {!user?.freeReportsUsed && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="relative z-10 mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#06D6A0] animate-pulse" />
              <span className="text-[10px] font-semibold text-white/80">{t("firstReportFree")}</span>
            </motion.div>
          )}
        </TiltCard>
      </motion.div>

      <motion.div {...anim(2)} className="flex gap-2 mb-3">
        <TiltCard
          onClick={() => { hapticFeedback("light"); go("/balance"); }}
          className="flex-1 card-3d rounded-[20px] p-3.5 cursor-pointer text-left"
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-[8px] text-[#8b90a0] font-bold uppercase tracking-[0.12em] mb-1">{t("balance")}</div>
              <div className="text-[30px] font-extrabold tabular leading-none tracking-tight gradient-text">
                <AnimatedCounter value={bal} />
              </div>
              <div className="text-[9px] text-[#a0a4b8] mt-1.5 font-medium">{t("reportsAvailable")}</div>
            </div>
            <div className="relative shrink-0">
              <ProgressRing progress={progress} size={48} stroke={3} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[13px]">{lvl.icon}</span>
              </div>
            </div>
          </div>
        </TiltCard>

        <motion.button whileTap={{ scale: 0.94 }}
          onClick={() => { hapticSelection(); go("/profile"); }}
          className="stat-card rounded-[20px] py-3.5 px-3 text-center w-[90px] shrink-0"
          style={{ borderColor: "rgba(124,92,252,0.06)" }}>
          <div className="absolute top-0 left-0 right-0 h-[2.5px]" style={{ background: "linear-gradient(90deg, #7C5CFC, #3B82F6)" }} />
          <div className="text-[13px] mb-1">{lvl.icon}</div>
          <div className="text-[8px] text-[#a0a4b8] font-bold uppercase tracking-wider">{lvl.name}</div>
          {nxt && <div className="text-[9px] text-[#c4c4d0] mt-1 tabular font-medium">{user?.totalReports || 0}/{nxt.reportsNeeded}</div>}
        </motion.button>
      </motion.div>

      <motion.div {...anim(3)} className="mb-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-3.5 px-3.5">
          {[
            { iconId: "topup", label: t("topUp"), desc: "15 rep", go: "/balance", accent: "#06D6A0", bg: "rgba(6,214,160,0.04)" },
            { iconId: "history", label: t("history"), desc: `${user?.totalReports || 0} ${t("total").toLowerCase()}`, go: "/history", accent: "#FF8A50", bg: "rgba(255,138,80,0.04)" },
            { iconId: "profile", label: t("profile"), desc: lvl.name, go: "/profile", accent: "#7C5CFC", bg: "rgba(124,92,252,0.04)" },
            { iconId: "invite", label: t("inviteFriends"), desc: `+2`, go: "#ref", accent: "#10B981", bg: "rgba(16,185,129,0.04)" },
          ].map((item, i) => (
            <motion.button key={i}
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05, duration: 0.3, ease }}
              whileTap={{ scale: 0.93 }}
              onClick={() => {
                hapticSelection();
                if (item.go === "#ref") shareRefTelegram();
                else go(item.go);
              }}
              className="flex-shrink-0 rounded-[18px] p-3 w-[calc(25%-6px)] min-w-[82px] card-hover-lift"
              style={{
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(20px)",
                border: `1px solid ${item.accent}15`,
                boxShadow: `0 2px 12px ${item.accent}08, 0 1px 3px rgba(0,0,0,0.02)`,
              }}
            >
              <div className="mb-2.5">
                <Icon3D id={item.iconId} size={36} />
              </div>
              <div className="text-[11px] font-bold leading-tight text-left truncate">{item.label}</div>
              <div className="text-[9px] mt-0.5 text-left font-medium truncate" style={{ color: item.accent }}>{item.desc}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div {...anim(3.5)} className="mb-3">
        <div className="tip-card p-3.5">
          <div className="flex items-center gap-2.5">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0"
              style={{ background: "rgba(124,92,252,0.06)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="1.8">
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
              </svg>
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="text-[8px] font-bold text-[#7C5CFC] uppercase tracking-wider mb-0.5">AI Tip</div>
              <AnimatePresence mode="wait">
                <motion.p key={tipIdx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="text-[11px] text-[#4a4e69] font-medium leading-snug">{TIPS[tipIdx]}</motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div {...anim(4)} className="grid grid-cols-3 gap-2 mb-3">
        {[
          { val: user?.totalReports || 0, label: t("total"), gradient: "linear-gradient(135deg, #7C5CFC, #6336F5)", path: "/history" },
          { val: bal, label: t("balance"), gradient: "linear-gradient(135deg, #3B82F6, #3D7FE8)", path: "/balance" },
          { val: user?.referralCount || 0, label: t("invited"), gradient: "linear-gradient(135deg, #10B981, #06D6A0)", path: "/profile" },
        ].map((s, i) => (
          <motion.button key={i} whileTap={{ scale: 0.93 }}
            onClick={() => { hapticSelection(); go(s.path); }}
            className="stat-card py-3.5 px-2 text-center">
            <div className="absolute top-0 left-0 right-0 h-[2.5px]" style={{ background: s.gradient }} />
            <div className="text-[24px] font-extrabold tabular leading-none gradient-text">
              <AnimatedCounter value={s.val} />
            </div>
            <div className="text-[7px] text-[#a0a4b8] font-bold uppercase tracking-[0.1em] mt-1.5 truncate">{s.label}</div>
          </motion.button>
        ))}
      </motion.div>

      {recentItems.length > 0 && (
        <motion.div {...anim(4.5)} className="mb-3">
          <div className="flex items-center gap-1.5 mb-2 px-0.5">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#7C5CFC" }} />
            <span className="text-[10px] font-bold text-[#8b90a0] uppercase tracking-[0.08em]">{t("recentSubjects")}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5 -mx-3.5 px-3.5">
            {recentItems.map((item, i) => (
              <motion.button key={`${item.reportType}-${item.subject}`}
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.04, ease }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { hapticFeedback("light"); go("/new"); }}
                className="flex-shrink-0 card-3d rounded-[16px] px-3 py-2.5 flex items-center gap-2.5 min-w-[145px]">
                <span className="text-[18px] shrink-0">{item.typeIcon}</span>
                <div className="min-w-0 text-left">
                  <div className="text-[11px] font-bold truncate leading-tight">{item.subjectName}</div>
                  <div className="text-[8px] text-[#a0a4b8] mt-0.5 truncate font-medium">{item.typeName}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {recent.length > 0 && (
        <motion.div {...anim(5)} className="mb-3">
          <div className="flex items-center justify-between mb-2 px-0.5">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[10px] font-bold text-[#8b90a0] uppercase tracking-[0.08em]">{t("history")}</span>
            </div>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => { hapticFeedback("light"); go("/history"); }}
              className="text-[10px] font-semibold text-[#7C5CFC] flex items-center gap-0.5">
              {t("allSubjects")}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </motion.button>
          </div>
          {recent.map((r, i) => {
            const wc = (r.content || "").split(/\s+/).filter(Boolean).length;
            return (
              <motion.button key={r.id}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.06 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { hapticFeedback("light"); go("/history"); }}
                className="w-full card-3d rounded-[16px] p-3.5 mb-1.5 flex items-center gap-3 text-left">
                <div className="w-[40px] h-[40px] rounded-[13px] flex items-center justify-center text-[17px] shrink-0"
                  style={{ background: "rgba(124,92,252,0.05)" }}>
                  {TYPES[r.reportType]?.icon || "📄"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold truncate leading-tight">{r.topic}</div>
                  <div className="text-[9px] text-[#a0a4b8] mt-0.5 font-medium flex items-center gap-1">
                    <span>{TYPES[r.reportType]?.label}</span>
                    {wc > 0 && <><span className="text-[#d1d5db]">·</span><span className="tabular">{wc.toLocaleString()} words</span></>}
                  </div>
                </div>
                <div className="text-[9px] text-[#c8cad4] font-medium shrink-0">{new Date(r.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</div>
              </motion.button>
            );
          })}
        </motion.div>
      )}

      <motion.div {...anim(6)} className="card-3d rounded-[22px] p-4 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-[2.5px]" style={{ background: "linear-gradient(90deg, #10B981, #06D6A0, #3B82F6)" }} />
        
        <div className="flex items-center gap-2.5 mb-3.5">
          <Icon3D id="invite" size={40} />
          <div className="flex-1 min-w-0">
            <div className="font-bold text-[14px] leading-tight">{t("inviteFriends")}</div>
            <div className="text-[10px] text-[#8b90a0] mt-0.5">{t("referralBonus")}</div>
          </div>
        </div>

        <div className="flex items-start gap-1.5 mb-3.5">
          {[
            { num: "1", text: t("referralStep1") },
            { num: "2", text: t("referralStep2") },
            { num: "3", text: t("referralStep3") },
          ].map((s, i) => (
            <div key={i} className="flex-1 text-center">
              <div className="w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center text-[9px] font-bold text-white"
                style={{ background: i === 2 ? "linear-gradient(135deg, #10B981, #06D6A0)" : "linear-gradient(135deg, #7C5CFC, #3B82F6)" }}>
                {s.num}
              </div>
              <div className="text-[7px] text-[#8b90a0] font-medium leading-tight px-0.5">{s.text}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-3.5">
          <div className="flex-1 rounded-[14px] py-2.5 px-2.5 text-center" style={{ background: "rgba(0,196,140,0.04)", border: "1px solid rgba(0,196,140,0.08)" }}>
            <div className="text-[20px] font-extrabold tabular leading-none" style={{ color: "#10B981" }}>{user?.referralCount || 0}</div>
            <div className="text-[7px] text-[#8b90a0] font-bold uppercase tracking-[0.06em] mt-1">{t("friendsJoined")}</div>
          </div>
          <div className="flex-1 rounded-[14px] py-2.5 px-2.5 text-center" style={{ background: "rgba(124,92,252,0.04)", border: "1px solid rgba(124,92,252,0.08)" }}>
            <div className="text-[20px] font-extrabold tabular gradient-text leading-none">{(user?.referralCount || 0) * 2}</div>
            <div className="text-[7px] text-[#8b90a0] font-bold uppercase tracking-[0.06em] mt-1">{t("earnedReports")}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.96 }} onClick={shareRefTelegram}
            className="flex-1 btn-accent py-[11px] text-[12px] flex items-center justify-center gap-1.5 rounded-[16px]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            {t("sendInvite")}
          </motion.button>
          <motion.button whileTap={{ scale: 0.96 }} onClick={copyRef}
            className="py-[11px] px-3.5 rounded-[16px] text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all shrink-0"
            style={{ background: copied ? "rgba(0,196,140,0.06)" : "rgba(0,0,0,0.025)", color: copied ? "#10B981" : "#6b7280", border: `1px solid ${copied ? "rgba(0,196,140,0.12)" : "rgba(0,0,0,0.04)"}` }}>
            {copied
              ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>}
            {copied ? "✓" : t("copyLink")}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
