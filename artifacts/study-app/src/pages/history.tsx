import { useState, useEffect } from "react";
import { useUser, useLang } from "@/lib/store";
import { getReports, type ReportItem } from "@/lib/api";
import { getReportTypeMap, getSubjectMap, t } from "@/lib/i18n";
import { hapticFeedback, hapticSuccess } from "@/lib/telegram";
import { motion, AnimatePresence } from "framer-motion";

export default function History() {
  const user = useUser();
  useLang();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  const REPORT_TYPE_MAP = getReportTypeMap();
  const SUBJECT_MAP = getSubjectMap();

  useEffect(() => {
    if (!user) return;
    getReports(user.telegramId)
      .then((res) => setReports(res.reports))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (selectedReport) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        className="px-4 pt-6 pb-4"
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => { hapticFeedback("light"); setSelectedReport(null); }}
          className="text-primary text-sm font-semibold mb-4 flex items-center gap-1"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          {t("back")}
        </motion.button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">{REPORT_TYPE_MAP[selectedReport.reportType]?.icon || "📄"}</span>
          </div>
          <h2 className="text-lg font-bold flex-1">{selectedReport.topic}</h2>
        </div>

        <div className="flex gap-2 mb-4">
          <div className="bg-primary/10 text-primary rounded-lg px-2.5 py-1 text-xs font-semibold">
            {REPORT_TYPE_MAP[selectedReport.reportType]?.label || selectedReport.reportType}
          </div>
          <div className="bg-emerald-50 text-emerald-700 rounded-lg px-2.5 py-1 text-xs font-semibold">
            {SUBJECT_MAP[selectedReport.subject]?.label || selectedReport.subject}
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            if (selectedReport.content) { navigator.clipboard.writeText(selectedReport.content); hapticSuccess(); }
          }}
          className="w-full premium-btn py-2.5 text-sm font-semibold mb-4 flex items-center justify-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          {t("copyText")}
        </motion.button>

        <div className="card-premium rounded-2xl p-4">
          <div className="prose prose-sm max-w-none text-foreground text-sm leading-relaxed whitespace-pre-wrap break-words select-text">
            {selectedReport.content || t("contentUnavailable")}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 pt-6 pb-4"
    >
      <h2 className="text-xl font-bold mb-1">{t("history")}</h2>
      <p className="text-muted-foreground text-sm mb-5">
        {reports.length > 0
          ? `${reports.length} ${t("reportsGenerated")}`
          : t("docsHere")}
      </p>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                className="w-2 h-2 bg-primary rounded-full"
              />
            ))}
          </div>
        </div>
      )}

      {!loading && reports.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-5">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" opacity="0.5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <p className="text-muted-foreground text-sm text-center font-medium">
            {t("noReportsYet")}
          </p>
          <p className="text-muted-foreground/60 text-xs mt-1">{t("createFirst")}</p>
        </motion.div>
      )}

      <div className="space-y-2.5">
        <AnimatePresence>
          {reports.map((report, i) => (
            <motion.button
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { hapticFeedback("light"); setSelectedReport(report); }}
              className="w-full card-premium rounded-2xl p-4 text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-lg">{REPORT_TYPE_MAP[report.reportType]?.icon || "📄"}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-foreground truncate">{report.topic}</div>
                  <div className="flex gap-1.5 mt-1">
                    <span className="text-xs text-muted-foreground">{REPORT_TYPE_MAP[report.reportType]?.label || report.reportType}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{SUBJECT_MAP[report.subject]?.label || report.subject}</span>
                  </div>
                  <div className="text-xs text-muted-foreground/50 mt-1">
                    {new Date(report.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/30 mt-2"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
