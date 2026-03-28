import { useState, useEffect } from "react";
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
    }, 30);
    return () => clearInterval(id);
  }, [value]);
  return <>{display}</>;
}

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];
const s = (i: number) => ({
  initial: { opacity: 0, y: 20 } as const,
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
    <div className="px-5 pt-8 pb-4">
      <motion.div {...s(0)} className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-[28px] font-black text-white tracking-tight leading-none mb-1.5">
            {t("welcome")}, <span className="gradient-text">{user?.firstName || "Student"}</span>
          </h1>
          <p className="text-[13px] text-white/20 font-medium">{t("subtitle")}</p>
        </div>
        <motion.button whileTap={{ scale: 0.88 }} onClick={() => { hapticFeedback("light"); nav("/profile"); }}
          className="avatar-ring">
          {photoUrl ? (
            <img src={photoUrl} alt="" className="w-[52px] h-[52px] rounded-full object-cover" />
          ) : (
            <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-base font-black text-white premium-gradient">
              {(user?.firstName || "S").charAt(0).toUpperCase()}
            </div>
          )}
        </motion.button>
      </motion.div>

      <motion.div {...s(1)} className="hero-card hero-shimmer p-6 mb-5">
        <div className="shimmer-bar" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-white/20 font-extrabold tracking-[0.14em] uppercase">{t("yourBalance")}</span>
            <span className="text-[10px] text-white/12 font-medium flex items-center gap-1.5">{lvl.icon} {lvl.name}</span>
          </div>
          <div className="flex items-end gap-2.5 mt-2">
            <span className="text-[64px] font-black tabular leading-none tracking-tighter num-glow">
              <AnimatedNumber value={bal} />
            </span>
            <span className="text-[13px] text-white/15 pb-3.5 font-semibold">{t("reportsAvailable")}</span>
          </div>
          {!user?.freeReportsUsed && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl"
              style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.1)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              <span className="text-[11px] font-bold text-emerald-400">{t("firstReportFree")}</span>
            </motion.div>
          )}
          {nxt && (
            <div className="mt-5">
              <div className="flex justify-between mb-2">
                <span className="text-[10px] text-white/15 font-bold">{t("progress")}</span>
                <span className="text-[10px] text-white/10 font-medium">{nxt.reportsNeeded} → {nxt.name}</span>
              </div>
              <div className="w-full h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                <motion.div initial={{ width: 0 }}
                  animate={{ width: `${Math.min(((user?.totalReports || 0) - lvl.min) / (lvl.max - lvl.min + 1) * 100, 100)}%` }}
                  transition={{ delay: 0.8, duration: 1.2, ease }}
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #7c3aed, #06b6d4)" }}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div {...s(2)} className="grid grid-cols-2 gap-3 mb-5">
        <motion.button whileTap={{ scale: 0.96 }}
          onClick={() => { hapticFeedback("medium"); nav("/new"); }}
          className="btn-main rounded-2xl py-5 px-4 text-left flex flex-col gap-2 relative overflow-hidden">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          <div>
            <div className="font-black text-[14px]">{t("createReport")}</div>
            <div className="text-[10px] opacity-60 mt-0.5">{t("generateAI")}</div>
          </div>
        </motion.button>
        <motion.button whileTap={{ scale: 0.96 }}
          onClick={() => { hapticFeedback("light"); nav("/balance"); }}
          className="g-card rounded-2xl py-5 px-4 text-left flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px]"
            style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.25), transparent)" }} />
          <span className="text-[24px]">💎</span>
          <div>
            <div className="font-black text-[14px] text-white">{t("topUp")}</div>
            <div className="text-[10px] text-white/20 mt-0.5">{t("reports15")}</div>
          </div>
        </motion.button>
      </motion.div>

      <motion.div {...s(3)} className="grid grid-cols-3 gap-2.5 mb-5">
        {[
          { path: "/history", val: String(user?.totalReports || 0), sub: t("total"), accent: "#a78bfa", icon: "📄" },
          { path: "/balance", val: String(bal), sub: t("balance"), accent: "#67e8f9", icon: "💰" },
          { path: "/profile", val: lvl.icon, sub: lvl.name, accent: "#fbbf24", icon: "" },
        ].map((it) => (
          <motion.button key={it.path + it.sub} whileTap={{ scale: 0.94 }}
            onClick={() => { hapticFeedback("light"); nav(it.path); }}
            className="g-card rounded-[18px] py-4 px-3 flex flex-col items-center gap-1.5 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px]"
              style={{ background: `linear-gradient(90deg, transparent, ${it.accent}30, transparent)` }} />
            <span className="text-[24px] font-black tabular" style={{ color: it.accent }}>{it.val}</span>
            <span className="text-[9px] text-white/25 font-bold uppercase tracking-wider">{it.sub}</span>
          </motion.button>
        ))}
      </motion.div>

      {recent.length > 0 && (
        <motion.div {...s(4)} className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="section-label">{t("history")}</span>
            <button onClick={() => { hapticFeedback("light"); nav("/history"); }}
              className="text-[11px] font-bold text-[#a78bfa]">{t("allSubjects")}</button>
          </div>
          <div className="space-y-2">
            {recent.map(r => (
              <motion.button key={r.id} whileTap={{ scale: 0.98 }}
                onClick={() => { hapticFeedback("light"); nav("/history"); }}
                className="w-full g-card rounded-2xl p-4 text-left flex items-center gap-3.5">
                <div className="icon-box text-lg"
                  style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.06)" }}>
                  {TYPES[r.reportType]?.icon || "📄"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-white truncate">{r.topic}</div>
                  <div className="text-[11px] text-white/20 mt-0.5">{TYPES[r.reportType]?.label} {SUBJECTS[r.subject]?.label ? `· ${SUBJECTS[r.subject].label}` : ""}</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/8 shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div {...s(5)}>
        <div className="g-card-s rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 -translate-y-1/2 translate-x-1/4"
            style={{ background: "radial-gradient(circle, rgba(16,185,129,0.05), transparent 70%)" }} />
          <div className="flex items-start gap-4 relative z-10">
            <div className="icon-box" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.06)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.7"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
            </div>
            <div className="flex-1">
              <div className="font-bold text-[15px] text-white">{t("inviteFriends")}</div>
              <div className="text-[12px] text-white/20 mt-1">{t("referralBonus")}</div>
              {user?.referralCount !== undefined && user.referralCount > 0 && (
                <span className="badge-g text-[10px] inline-block mt-2">{user.referralCount} {t("invited").toLowerCase()}</span>
              )}
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={copyRef}
            className="mt-4 w-full btn-accent py-[14px] text-[14px] flex items-center justify-center gap-2 relative z-10">
            {refCopied ? (
              <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{t("linkCopied")}</>
            ) : (
              <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>{t("copyLink")}</>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
