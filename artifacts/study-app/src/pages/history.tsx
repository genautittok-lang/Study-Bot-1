import { useState, useEffect } from "react";
import { useUser, useLang } from "@/lib/store";
import { getReports, type ReportItem } from "@/lib/api";
import { hapticFeedback, hapticSuccess } from "@/lib/telegram";
import { t, getReportTypeMap, getSubjectMap } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";

export default function History() {
  const user = useUser();
  useLang();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ReportItem | null>(null);

  const TYPES = getReportTypeMap();
  const SUBJECTS = getSubjectMap();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getReports(user.telegramId)
      .then((r) => setReports(r.reports))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (selected) {
    const wordCount = (selected.content || "").split(/\s+/).filter(Boolean).length;
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pt-6 pb-4">
        <motion.button whileTap={{ scale: 0.95 }}
          onClick={() => { hapticFeedback("light"); setSelected(null); }}
          className="text-muted-foreground text-[14px] font-medium mb-5 flex items-center gap-1.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          {t("back")}
        </motion.button>
        <div className="mb-5">
          <h2 className="text-[18px] font-bold text-foreground leading-snug text-balance mb-3">{selected.topic}</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="badge">{TYPES[selected.reportType]?.icon} {TYPES[selected.reportType]?.label || selected.reportType}</span>
            <span className="badge">{SUBJECTS[selected.subject]?.label || selected.subject}</span>
            {wordCount > 0 && <span className="text-[11px] text-muted-foreground/35 tabular font-medium">{wordCount.toLocaleString()}</span>}
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.96 }}
          onClick={() => { navigator.clipboard.writeText(selected.content || ""); hapticSuccess(); }}
          className="btn-primary px-5 py-3 text-[14px] font-semibold flex items-center gap-2 mb-5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          {t("copy")}
        </motion.button>
        <div className="card rounded-2xl p-5 max-h-[55vh] overflow-y-auto scrollbar-hide">
          <div className="prose prose-sm max-w-none text-foreground text-[14px] leading-[1.8] whitespace-pre-wrap break-words select-text">{selected.content || t("contentUnavailable")}</div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-4">
      <h2 className="text-[22px] font-bold text-foreground tracking-tight mb-1">{t("history")}</h2>
      <p className="text-[14px] text-muted-foreground/50 mb-6">{reports.length} {t("total").toLowerCase()}</p>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card rounded-2xl p-4 flex gap-3.5 items-center">
              <div className="skeleton w-11 h-11 rounded-[14px] shrink-0" />
              <div className="flex-1 space-y-2.5"><div className="skeleton h-4 w-3/4 rounded-lg" /><div className="skeleton h-3 w-1/2 rounded-lg" /></div>
            </div>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center pt-16 text-center">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
            style={{ background: "linear-gradient(135deg, rgba(102,126,234,0.06), rgba(118,75,162,0.04))" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.3" opacity="0.3"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">{t("noHistory")}</h3>
          <p className="text-[13px] text-muted-foreground/40">{t("noHistoryDesc")}</p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {reports.map((r, i) => (
              <motion.button
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { hapticFeedback("light"); setSelected(r); }}
                className="w-full card-interactive rounded-2xl p-4 text-left flex items-center gap-3.5"
              >
                <div className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 text-lg"
                  style={{ background: "linear-gradient(135deg, rgba(102,126,234,0.08), rgba(118,75,162,0.05))" }}>
                  {TYPES[r.reportType]?.icon || "📄"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-foreground truncate">{r.topic}</div>
                  <div className="text-[12px] text-muted-foreground/45 mt-0.5 flex items-center gap-1.5">
                    <span>{TYPES[r.reportType]?.label || r.reportType}</span>
                    <span className="text-muted-foreground/20">·</span>
                    <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/15 shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
