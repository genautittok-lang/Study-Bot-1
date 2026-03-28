import { useState, useEffect } from "react";
import { useUser, useLang } from "@/lib/store";
import { getReports, type ReportItem } from "@/lib/api";
import { hapticFeedback, hapticSuccess } from "@/lib/telegram";
import { t, getReportTypeMap, getSubjectMap } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import MarkdownRenderer from "@/components/markdown-renderer";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

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
    getReports(user.telegramId).then(r => setReports(r.reports)).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  if (selected) {
    const wc = (selected.content || "").split(/\s+/).filter(Boolean).length;
    return (
      <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, ease }} className="px-4 pt-6 pb-4">
        <motion.button whileTap={{ scale: 0.95 }}
          onClick={() => { hapticFeedback("light"); setSelected(null); }}
          className="text-[#9ca3af] text-[13px] font-semibold mb-4 flex items-center gap-1 active:text-[#6b7280] transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          {t("back")}
        </motion.button>
        <h2 className="text-[16px] font-bold leading-snug text-balance mb-2">{selected.topic}</h2>
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          <span className="badge">{TYPES[selected.reportType]?.icon} {TYPES[selected.reportType]?.label || selected.reportType}</span>
          <span className="badge-blue">{SUBJECTS[selected.subject]?.label || selected.subject}</span>
          {wc > 0 && <span className="text-[10px] text-[#9ca3af] tabular font-medium">{wc.toLocaleString()} words</span>}
        </div>
        <motion.button whileTap={{ scale: 0.96 }}
          onClick={() => { navigator.clipboard.writeText(selected.content || "").then(() => hapticSuccess()).catch(() => {}); }}
          className="btn-main px-5 py-2.5 text-[13px] flex items-center gap-2 mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          {t("copy")}
        </motion.button>
        <div className="g-card rounded-[16px] p-4 max-h-[60vh] overflow-y-auto scrollbar-hide select-text">
          <MarkdownRenderer content={selected.content || t("contentUnavailable")} />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ease }}>
        <h2 className="text-[22px] font-extrabold tracking-tight mb-0.5">{t("history")}</h2>
        <p className="text-[11px] text-[#9ca3af] mb-4">{reports.length} {t("total").toLowerCase()}</p>
      </motion.div>
      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="g-card rounded-[14px] p-3.5 flex gap-3 items-center">
              <div className="skeleton w-10 h-10 rounded-[12px] shrink-0" />
              <div className="flex-1 space-y-2"><div className="skeleton h-3.5 w-3/4 rounded-[8px]" /><div className="skeleton h-2.5 w-1/2 rounded-[8px]" /></div>
            </div>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}
          className="flex flex-col items-center justify-center pt-14 text-center">
          <div className="relative mb-5">
            <div className="w-20 h-20 rounded-[22px] flex items-center justify-center"
              style={{ background: "rgba(108,92,231,0.04)" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="1" opacity="0.3">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
          </div>
          <h3 className="text-base font-bold mb-1">{t("noHistory")}</h3>
          <p className="text-[12px] text-[#9ca3af] max-w-[220px]">{t("noHistoryDesc")}</p>
        </motion.div>
      ) : (
        <div className="space-y-1.5">
          <AnimatePresence>
            {reports.map((r, i) => (
              <motion.button key={r.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.035, duration: 0.25, ease }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { hapticFeedback("light"); setSelected(r); }}
                className="w-full g-card rounded-[14px] p-3.5 text-left flex items-center gap-3">
                <div className="icon-box text-[16px]" style={{ background: "rgba(108,92,231,0.06)" }}>
                  {TYPES[r.reportType]?.icon || "📄"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold truncate leading-tight">{r.topic}</div>
                  <div className="text-[11px] text-[#9ca3af] mt-0.5 flex items-center gap-1">
                    <span>{TYPES[r.reportType]?.label || r.reportType}</span>
                    <span className="text-[#d1d5db]">·</span>
                    <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
