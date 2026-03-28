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

export default function Home() {
  const user = useUser();
  const photoUrl = usePhotoUrl();
  const [, setLocation] = useLocation();
  useLang();
  const [recentReports, setRecentReports] = useState<ReportItem[]>([]);
  const [refCopied, setRefCopied] = useState(false);

  const balance = user ? (!user.freeReportsUsed ? user.balance + 1 : user.balance) : 0;
  const level = getUserLevel(user?.totalReports || 0);
  const nextLvl = getNextLevel(user?.totalReports || 0);
  const TYPES = getReportTypeMap();
  const SUBJECTS = getSubjectMap();

  useEffect(() => {
    if (!user) return;
    getReports(user.telegramId)
      .then((res) => setRecentReports(res.reports.slice(0, 3)))
      .catch(() => {});
  }, [user]);

  function copyRef() {
    const link = `https://t.me/studypro_bot?start=ref_${user?.referralCode || "---"}`;
    navigator.clipboard.writeText(link);
    hapticSuccess();
    setRefCopied(true);
    setTimeout(() => setRefCopied(false), 2000);
  }

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 16 } as const,
    animate: { opacity: 1, y: 0 } as const,
    transition: { delay: i * 0.07, duration: 0.4, ease },
  });

  return (
    <div className="px-5 pt-6 pb-4">
      <motion.div {...stagger(0)} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-foreground tracking-tight leading-tight">
            {t("welcome")}, {user?.firstName || "Student"}
          </h1>
          <p className="text-muted-foreground/50 text-[13px] mt-1 font-medium">{t("subtitle")}</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => { hapticFeedback("light"); setLocation("/profile"); }}
          className="avatar-ring"
        >
          {photoUrl ? (
            <img src={photoUrl} alt="" className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white premium-gradient">
              {(user?.firstName || "S").charAt(0).toUpperCase()}
            </div>
          )}
        </motion.button>
      </motion.div>

      <motion.div {...stagger(1)} className="hero-card hero-shimmer p-6 mb-5">
        <div className="shimmer-bar" />
        <div className="relative z-10 text-white">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] text-white/30 font-semibold tracking-[0.1em] uppercase">{t("yourBalance")}</span>
            <span className="text-[10px] text-white/20 flex items-center gap-1.5 font-medium">{level.icon} {level.name}</span>
          </div>
          <div className="flex items-end gap-3 mb-2">
            <span className="text-[52px] font-black tabular leading-none tracking-tighter">
              <AnimatedNumber value={balance} />
            </span>
            <span className="text-[14px] text-white/25 pb-2.5 font-medium">{t("reportsAvailable")}</span>
          </div>
          {!user?.freeReportsUsed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="mt-3 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl"
              style={{ background: "rgba(67, 233, 123, 0.1)", border: "1px solid rgba(67, 233, 123, 0.15)" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#43e97b" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              <span className="text-[11px] font-semibold" style={{ color: "rgba(67, 233, 123, 0.9)" }}>{t("firstReportFree")}</span>
            </motion.div>
          )}
          {nextLvl && (
            <div className="mt-4">
              <div className="flex justify-between mb-1.5">
                <span className="text-[10px] text-white/20 font-medium">{t("progress")}</span>
                <span className="text-[10px] text-white/15 font-medium">{nextLvl.reportsNeeded} → {nextLvl.name}</span>
              </div>
              <div className="w-full h-[4px] bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(((user?.totalReports || 0) - level.min) / (level.max - level.min + 1) * 100, 100)}%` }}
                  transition={{ delay: 0.6, duration: 0.8, ease }}
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #667eea, #764ba2)" }}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div {...stagger(2)} className="mb-5">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { hapticFeedback("medium"); setLocation("/new"); }}
          className="w-full btn-primary py-4 font-semibold text-[15px] flex items-center justify-center gap-2.5"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          {t("createReport")}
        </motion.button>
      </motion.div>

      <motion.div {...stagger(3)} className="grid grid-cols-3 gap-3 mb-5">
        {[
          { path: "/history", value: String(user?.totalReports || 0), sub: t("total"), color: "hsl(var(--foreground))" },
          { path: "/balance", value: "15", sub: t("reports5"), color: "#667eea" },
          { path: "/profile", value: level.icon, sub: level.name, color: "hsl(var(--foreground))" },
        ].map((item) => (
          <motion.button
            key={item.path}
            whileTap={{ scale: 0.95 }}
            onClick={() => { hapticFeedback("light"); setLocation(item.path); }}
            className="card-interactive rounded-2xl py-4 px-3 flex flex-col items-center gap-1"
          >
            <span className="stat-value" style={{ color: item.color }}>{item.value}</span>
            <span className="text-[11px] text-muted-foreground/50 font-medium">{item.sub}</span>
          </motion.button>
        ))}
      </motion.div>

      {recentReports.length > 0 && (
        <motion.div {...stagger(4)} className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="section-title">{t("history")}</span>
            <button onClick={() => { hapticFeedback("light"); setLocation("/history"); }} className="text-[12px] font-semibold" style={{ color: "#667eea" }}>{t("allSubjects")}</button>
          </div>
          <div className="space-y-2">
            {recentReports.map((r) => (
              <motion.button
                key={r.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => { hapticFeedback("light"); setLocation("/history"); }}
                className="w-full card-interactive rounded-2xl p-4 text-left flex items-center gap-3.5"
              >
                <div className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 text-lg"
                  style={{ background: "linear-gradient(135deg, rgba(102,126,234,0.08), rgba(118,75,162,0.05))" }}>
                  {TYPES[r.reportType]?.icon || "~"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-foreground truncate">{r.topic}</div>
                  <div className="text-[12px] text-muted-foreground/50 mt-0.5">
                    {TYPES[r.reportType]?.label} {SUBJECTS[r.subject]?.label ? `· ${SUBJECTS[r.subject].label}` : ""}
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/20 shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div {...stagger(5)}>
        <div className="card rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/4 opacity-50"
            style={{ background: "radial-gradient(circle, rgba(67,233,123,0.08), transparent 70%)" }} />
          <div className="flex items-start gap-3.5 relative z-10">
            <div className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(67,233,123,0.1), rgba(56,249,215,0.05))" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#43e97b" strokeWidth="1.7"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-[15px] text-foreground">{t("inviteFriends")}</div>
              <div className="text-[12px] text-muted-foreground/50 mt-0.5">{t("referralBonus")}</div>
              {user?.referralCount !== undefined && user.referralCount > 0 && (
                <div className="text-[11px] font-semibold mt-1.5" style={{ color: "#43e97b" }}>
                  {user.referralCount} {t("invited").toLowerCase()}
                </div>
              )}
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={copyRef}
            className={`mt-4 w-full rounded-[14px] py-3.5 text-[14px] font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${refCopied ? "btn-success" : "btn-success"}`}
          >
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
