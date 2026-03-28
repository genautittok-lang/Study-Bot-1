import { useState, useEffect } from "react";
import { useUser, useLang } from "@/lib/store";
import { useLocation } from "wouter";
import { getReports, type ReportItem } from "@/lib/api";
import { hapticFeedback, hapticSuccess } from "@/lib/telegram";
import { t, getUserLevel, getReportTypeMap, getSubjectMap } from "@/lib/i18n";
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

export default function Home() {
  const user = useUser();
  const [, setLocation] = useLocation();
  useLang();
  const [recentReports, setRecentReports] = useState<ReportItem[]>([]);
  const [refCopied, setRefCopied] = useState(false);

  const balance = user ? (!user.freeReportsUsed ? user.balance + 1 : user.balance) : 0;
  const level = getUserLevel(user?.totalReports || 0);
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
    initial: { opacity: 0, y: 10 } as const,
    animate: { opacity: 1, y: 0 } as const,
    transition: { delay: i * 0.05, duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  });

  return (
    <div className="px-4 pt-5 pb-4">
      <motion.div {...stagger(0)} className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-bold text-foreground tracking-tight">
            {t("welcome")}, {user?.firstName || "Student"}
          </h1>
          <p className="text-muted-foreground text-[13px] mt-0.5">{t("subtitle")}</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => { hapticFeedback("light"); setLocation("/profile"); }}
          className={`w-11 h-11 bg-gradient-to-br ${level.color} rounded-[15px] flex items-center justify-center shadow-lg text-[14px] font-black text-white`}
        >
          {(user?.firstName || "S").charAt(0).toUpperCase()}
        </motion.button>
      </motion.div>

      <motion.div {...stagger(1)} className="relative rounded-2xl p-5 mb-4 overflow-hidden">
        <div className="absolute inset-0 dark-card" />
        <div className="absolute inset-0 shimmer-subtle" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/[0.02] rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/[0.015] rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] text-white/40 font-medium tracking-wide uppercase">{t("yourBalance")}</span>
            <span className="text-[11px] text-white/25 flex items-center gap-1">{level.icon} {level.name}</span>
          </div>
          <div className="flex items-end gap-2.5 mb-1.5">
            <span className="text-[42px] font-black tabular-nums leading-none tracking-tighter">
              <AnimatedNumber value={balance} />
            </span>
            <span className="text-[13px] text-white/35 pb-1">{t("reportsAvailable")}</span>
          </div>
          {!user?.freeReportsUsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="mt-2 bg-emerald-500/15 border border-emerald-500/10 rounded-xl px-3 py-2 inline-flex items-center gap-2"
            >
              <div className="w-4 h-4 bg-emerald-400/20 rounded-md flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span className="text-[11px] font-medium text-emerald-300/90">{t("firstReportFree")}</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.div {...stagger(2)} className="mb-4">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => { hapticFeedback("medium"); setLocation("/new"); }}
          className="w-full premium-btn py-[14px] font-semibold text-[14px] flex items-center justify-center gap-2.5"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          {t("createReport")}
        </motion.button>
      </motion.div>

      <motion.div {...stagger(3)} className="grid grid-cols-3 gap-2 mb-4">
        {[
          { path: "/history", label: t("history"), icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, value: String(user?.totalReports || 0), sub: t("total").toLowerCase() },
          { path: "/balance", label: t("topUp"), icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>, value: "15", sub: t("reports5").toLowerCase() },
          { path: "/profile", label: t("profile"), icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>, value: level.icon, sub: level.name },
        ].map((item) => (
          <motion.button
            key={item.path}
            whileTap={{ scale: 0.95 }}
            onClick={() => { hapticFeedback("light"); setLocation(item.path); }}
            className="card-pro rounded-2xl p-3.5 flex flex-col items-center gap-1.5"
          >
            <span className="text-muted-foreground/50">{item.icon}</span>
            <span className="text-[13px] font-bold text-foreground">{item.value}</span>
            <span className="text-[10px] text-muted-foreground">{item.sub}</span>
          </motion.button>
        ))}
      </motion.div>

      {recentReports.length > 0 && (
        <motion.div {...stagger(4)} className="mb-4">
          <div className="flex items-center justify-between mb-2.5">
            <span className="section-label">{t("history")}</span>
            <button onClick={() => { hapticFeedback("light"); setLocation("/history"); }} className="text-primary text-[11px] font-semibold">{t("allSubjects")}</button>
          </div>
          <div className="space-y-1.5">
            {recentReports.map((r) => (
              <motion.button
                key={r.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => { hapticFeedback("light"); setLocation("/history"); }}
                className="w-full card-pro rounded-xl p-3 text-left flex items-center gap-3"
              >
                <div className="w-9 h-9 bg-primary/6 rounded-[10px] flex items-center justify-center shrink-0 text-sm">
                  {TYPES[r.reportType]?.icon || "~"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-foreground truncate">{r.topic}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {TYPES[r.reportType]?.label} {SUBJECTS[r.subject]?.label ? `· ${SUBJECTS[r.subject].label}` : ""}
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/20 shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div {...stagger(5)}>
        <div className="card-pro card-highlight rounded-2xl p-4 relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-emerald-500/8 rounded-xl flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-[13px] text-foreground">{t("inviteFriends")}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{t("referralBonus")}</div>
              {user?.referralCount !== undefined && user.referralCount > 0 && (
                <div className="text-[10px] text-emerald-600 mt-1 font-medium">
                  {user.referralCount} {t("invited").toLowerCase()}
                </div>
              )}
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={copyRef}
            className="mt-3 w-full bg-emerald-600 text-white rounded-xl py-2.5 text-[13px] font-semibold flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 active:bg-emerald-700 transition-colors"
          >
            {refCopied ? (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{t("linkCopied")}</>
            ) : (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>{t("copyLink")}</>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
