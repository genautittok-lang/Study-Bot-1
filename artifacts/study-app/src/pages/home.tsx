import { useState, useEffect, useRef } from "react";
import { useUser, usePhotoUrl, useLang, getRecentItems, type RecentItem } from "@/lib/store";
import { useLocation } from "wouter";
import { getReports, type ReportItem } from "@/lib/api";
import { hapticFeedback, hapticSuccess, shareViaTelegram } from "@/lib/telegram";
import { t, getUserLevel, getReportTypeMap, getNextLevel } from "@/lib/i18n";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Icon3D from "@/components/icons-3d";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];
const anim = (i: number) => ({
  initial: { opacity: 0, y: 22 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay: i * 0.06, duration: 0.5, ease },
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
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(123,104,238,0.08)" strokeWidth={stroke} />
      <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#ringGradHome)" strokeWidth={stroke}
        strokeLinecap="round"
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ delay: 0.5, duration: 1.2, ease }}
        strokeDasharray={circ} />
      <defs>
        <linearGradient id="ringGradHome" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7B68EE" />
          <stop offset="100%" stopColor="#00D4AA" />
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
  const [recentItems] = useState<RecentItem[]>(() => getRecentItems());

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

  const refLink = `https://t.me/studypro_bot?start=ref_${user?.referralCode || "---"}`;

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

  return (
    <div className="px-4 pt-5 pb-4">
      <motion.div {...anim(0)} className="flex items-center gap-3.5 mb-6">
        <motion.button whileTap={{ scale: 0.88 }} onClick={() => { hapticFeedback("light"); go("/profile"); }}
          className="avatar-ring shrink-0">
          {photo ? (
            <img src={photo} alt="" className="w-[46px] h-[46px] rounded-full object-cover" />
          ) : (
            <div className="w-[46px] h-[46px] rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #7B68EE, #5B4CCF)" }}>
              {(user?.firstName || "S")[0].toUpperCase()}
            </div>
          )}
        </motion.button>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] text-[#8b90a0] font-medium flex items-center gap-1.5">
            <span>{getGreeting()}</span>
            <span>{t("welcome")}</span>
          </div>
          <h1 className="text-[22px] font-extrabold tracking-tight leading-tight truncate">
            {user?.firstName || "Student"}
          </h1>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => { hapticFeedback("light"); go("/balance"); }}
          className="relative shrink-0">
          <div className="w-11 h-11 rounded-[14px] flex items-center justify-center"
            style={{ background: "rgba(123,104,238,0.06)", border: "1px solid rgba(123,104,238,0.08)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7B68EE" strokeWidth="1.8">
              <rect width="20" height="14" x="2" y="5" rx="2"/>
              <line x1="2" x2="22" y1="10" y2="10"/>
            </svg>
          </div>
          {bal > 0 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
              className="absolute -top-1 -right-1 min-w-[20px] h-[20px] rounded-full flex items-center justify-center px-1.5 text-[9px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, #7B68EE, #4A90FF)", boxShadow: "0 2px 8px rgba(123,104,238,0.4)" }}>
              {bal}
            </motion.div>
          )}
        </motion.button>
      </motion.div>

      <motion.div {...anim(1)}>
        <TiltCard
          onClick={() => { hapticFeedback("medium"); go("/new"); }}
          className="relative rounded-[26px] p-5 mb-4 cursor-pointer overflow-hidden w-full text-left"
          style={{
            background: "linear-gradient(145deg, #7B68EE 0%, #6355D8 35%, #5143C2 70%, #4A3AB8 100%)",
            boxShadow: "0 14px 44px rgba(123,104,238,0.32), 0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <div className="absolute top-0 right-0 w-44 h-44 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, white 0%, transparent 70%)", transform: "translate(25%, -35%)" }} />
          <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full opacity-12"
            style={{ background: "radial-gradient(circle, #00D4AA 0%, transparent 70%)", transform: "translate(-25%, 25%)" }} />
          <div className="absolute top-0 left-0 right-0 h-full opacity-[0.06]"
            style={{ background: "repeating-linear-gradient(45deg, transparent, transparent 30px, white 30px, white 31px)" }} />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex-1">
              <div className="text-white/45 text-[10px] font-bold mb-1.5 uppercase tracking-[0.12em]">{t("quickStart")}</div>
              <div className="text-white text-[21px] font-extrabold leading-tight mb-1">{t("createReport")}</div>
              <div className="text-white/40 text-[12px] font-medium">{t("generateAI")}</div>
            </div>
            <div className="w-[58px] h-[58px] rounded-[20px] flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)" }}>
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
              className="relative z-10 mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
              <span className="text-[10px] font-semibold text-white/75">{t("firstReportFree")}</span>
            </motion.div>
          )}

          <div className="absolute bottom-0 left-0 right-0 h-[1px]"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />
        </TiltCard>
      </motion.div>

      <motion.div {...anim(2)} className="flex gap-3 mb-4">
        <TiltCard
          onClick={() => { hapticFeedback("light"); go("/balance"); }}
          className="flex-1 g-card-glow rounded-[22px] p-4 cursor-pointer overflow-hidden text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] text-[#8b90a0] font-bold uppercase tracking-[0.1em] mb-1">{t("balance")}</div>
              <div className="text-[38px] font-extrabold tabular leading-none tracking-tight gradient-text">
                <AnimatedCounter value={bal} />
              </div>
              <div className="text-[11px] text-[#a0a4b8] mt-1.5 font-medium">{t("reportsAvailable")}</div>
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

      <motion.div {...anim(3)} className="mb-4">
        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
          {[
            { iconId: "topup", label: t("topUp"), desc: "15 rep", go: "/balance", accent: "#00D4AA" },
            { iconId: "history", label: t("history"), desc: `${user?.totalReports || 0} ${t("total").toLowerCase()}`, go: "/history", accent: "#FF8A50" },
            { iconId: "profile", label: t("profile"), desc: lvl.name, go: "/profile", accent: "#7B68EE" },
            { iconId: "invite", label: t("inviteFriends"), desc: `+2 ${t("reports5").toLowerCase()}`, go: "#ref", accent: "#00C48C" },
          ].map((item, i) => (
            <motion.button key={i}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.35, ease }}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                hapticFeedback("light");
                if (item.go === "#ref") shareRefTelegram();
                else go(item.go);
              }}
              className="flex-shrink-0 rounded-[20px] p-3.5 min-w-[118px]"
              style={{
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(16px)",
                border: `1px solid ${item.accent}12`,
                boxShadow: `0 2px 12px ${item.accent}08`,
              }}
            >
              <div className="mb-2.5">
                <Icon3D id={item.iconId} size={38} />
              </div>
              <div className="text-[12px] font-bold leading-tight text-left">{item.label}</div>
              <div className="text-[10px] text-[#a0a4b8] mt-0.5 text-left font-medium">{item.desc}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {recentItems.length > 0 && (
        <motion.div {...anim(4)} className="mb-4">
          <div className="flex items-center gap-2 mb-2.5 px-0.5">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#7B68EE" }} />
            <span className="text-[11px] font-bold text-[#8b90a0] uppercase tracking-[0.08em]">{t("recentSubjects")}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
            {recentItems.map((item, i) => (
              <motion.button key={`${item.reportType}-${item.subject}`}
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05, ease }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { hapticFeedback("light"); go("/new"); }}
                className="flex-shrink-0 g-card rounded-[18px] px-3.5 py-3 flex items-center gap-2.5 min-w-[160px]">
                <span className="text-[18px] shrink-0">{item.typeIcon}</span>
                <div className="min-w-0 text-left">
                  <div className="text-[11px] font-bold truncate leading-tight">{item.subjectName}</div>
                  <div className="text-[9px] text-[#a0a4b8] mt-0.5 truncate font-medium">{item.typeName}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div {...anim(4)} className="grid grid-cols-3 gap-2.5 mb-4">
        {[
          { val: user?.totalReports || 0, label: t("total"), gradient: "linear-gradient(135deg, #7B68EE, #5B4CCF)" },
          { val: bal, label: t("balance"), gradient: "linear-gradient(135deg, #4A90FF, #3D7FE8)" },
          { val: 0, label: lvl.name, isIcon: true, icon: lvl.icon, gradient: "linear-gradient(135deg, #00D4AA, #00C48C)" },
        ].map((s, i) => (
          <motion.button key={i} whileTap={{ scale: 0.94 }}
            onClick={() => { hapticFeedback("light"); go(i === 0 ? "/history" : i === 1 ? "/balance" : "/profile"); }}
            className="g-card rounded-[20px] p-3.5 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] opacity-60" style={{ background: s.gradient }} />
            {s.isIcon ? (
              <div className="text-[26px] leading-none">{s.icon}</div>
            ) : (
              <div className="text-[26px] font-extrabold tabular leading-none gradient-text">
                <AnimatedCounter value={s.val} />
              </div>
            )}
            <div className="text-[8px] text-[#a0a4b8] font-bold uppercase tracking-[0.1em] mt-1.5">{s.label}</div>
          </motion.button>
        ))}
      </motion.div>

      {recent.length > 0 && (
        <motion.div {...anim(5)} className="mb-4">
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00C48C] animate-pulse" />
              <span className="text-[11px] font-bold text-[#8b90a0] uppercase tracking-[0.08em]">{t("history")}</span>
            </div>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => { hapticFeedback("light"); go("/history"); }}
              className="text-[11px] font-semibold text-[#7B68EE] flex items-center gap-0.5">
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
              className="w-full g-card rounded-[18px] p-3.5 mb-2 flex items-center gap-3 text-left">
              <div className="w-[44px] h-[44px] rounded-[14px] flex items-center justify-center text-[18px] shrink-0"
                style={{ background: "rgba(123,104,238,0.05)" }}>
                {TYPES[r.reportType]?.icon || "📄"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold truncate leading-tight">{r.topic}</div>
                <div className="text-[10px] text-[#a0a4b8] mt-0.5 font-medium">{TYPES[r.reportType]?.label}</div>
              </div>
              <div className="text-[10px] text-[#c8cad4] font-medium shrink-0">{new Date(r.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</div>
            </motion.button>
          ))}
        </motion.div>
      )}

      <motion.div {...anim(6)} className="g-card-glow rounded-[24px] p-4 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #00C48C, #00D4AA, #4A90FF)" }} />
        
        <div className="flex items-center gap-3 mb-3.5">
          <Icon3D id="invite" size={44} />
          <div className="flex-1">
            <div className="font-bold text-[15px] leading-tight">{t("inviteFriends")}</div>
            <div className="text-[11px] text-[#8b90a0] mt-0.5">{t("referralBonus")}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3.5">
          {[
            { num: "1", text: t("referralStep1") },
            { num: "2", text: t("referralStep2") },
            { num: "3", text: t("referralStep3") },
          ].map((s, i) => (
            <div key={i} className="flex-1 text-center">
              <div className="w-7 h-7 rounded-full mx-auto mb-1 flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: i === 2 ? "linear-gradient(135deg, #00C48C, #00D4AA)" : "linear-gradient(135deg, #7B68EE, #4A90FF)" }}>
                {s.num}
              </div>
              <div className="text-[8px] text-[#8b90a0] font-medium leading-tight">{s.text}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2.5 mb-3.5">
          <div className="flex-1 rounded-[14px] py-2.5 px-3 text-center" style={{ background: "rgba(0,196,140,0.05)", border: "1px solid rgba(0,196,140,0.08)" }}>
            <div className="text-[20px] font-extrabold tabular" style={{ color: "#00C48C" }}>{user?.referralCount || 0}</div>
            <div className="text-[8px] text-[#8b90a0] font-bold uppercase tracking-[0.08em] mt-0.5">{t("friendsJoined")}</div>
          </div>
          <div className="flex-1 rounded-[14px] py-2.5 px-3 text-center" style={{ background: "rgba(123,104,238,0.04)", border: "1px solid rgba(123,104,238,0.08)" }}>
            <div className="text-[20px] font-extrabold tabular gradient-text">{(user?.referralCount || 0) * 2}</div>
            <div className="text-[8px] text-[#8b90a0] font-bold uppercase tracking-[0.08em] mt-0.5">{t("earnedReports")}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.96 }} onClick={shareRefTelegram}
            className="flex-1 btn-accent py-[12px] text-[13px] flex items-center justify-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            {t("sendInvite")}
          </motion.button>
          <motion.button whileTap={{ scale: 0.96 }} onClick={copyRef}
            className="py-[12px] px-4 rounded-[18px] text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all"
            style={{ background: copied ? "rgba(0,196,140,0.06)" : "rgba(0,0,0,0.03)", color: copied ? "#00C48C" : "#6b7280", border: `1px solid ${copied ? "rgba(0,196,140,0.12)" : "rgba(0,0,0,0.04)"}` }}>
            {copied
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00C48C" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>}
            {copied ? "✓" : t("copyLink")}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
