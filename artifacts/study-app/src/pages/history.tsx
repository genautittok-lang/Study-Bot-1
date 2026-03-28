import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useUser, useLang } from "@/lib/store";
import { getReports, type ReportItem } from "@/lib/api";
import { hapticFeedback, hapticSuccess, shareViaTelegram } from "@/lib/telegram";
import { t, getReportTypeMap, getSubjectMap } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import MarkdownRenderer from "@/components/markdown-renderer";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

export default function History() {
  const user = useUser();
  const [, go] = useLocation();
  useLang();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ReportItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const TYPES = getReportTypeMap();
  const SUBJECTS = getSubjectMap();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getReports(user.telegramId).then(r => setReports(r.reports)).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  const usedTypes = useMemo(() => {
    const types = new Set(reports.map(r => r.reportType));
    return Array.from(types);
  }, [reports]);

  const filtered = useMemo(() => {
    let list = reports;
    if (filterType !== "all") list = list.filter(r => r.reportType === filterType);
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase();
      list = list.filter(r =>
        r.topic.toLowerCase().includes(q) ||
        (TYPES[r.reportType]?.label || "").toLowerCase().includes(q) ||
        (SUBJECTS[r.subject]?.label || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [reports, filterType, searchQ, TYPES, SUBJECTS]);

  function shareReport(r: ReportItem) {
    const preview = (r.content || "").substring(0, 300).replace(/[#*_]/g, "") + "...";
    const icon = TYPES[r.reportType]?.icon || "📄";
    const label = TYPES[r.reportType]?.label || r.reportType;
    shareViaTelegram(`${icon} ${label}: ${r.topic}\n\n${preview}\n\n${t("shareText")}`);
  }

  if (selected) {
    const wc = (selected.content || "").split(/\s+/).filter(Boolean).length;
    const dateStr = new Date(selected.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
    return (
      <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, ease }} className="px-4 pt-6 pb-4">
        <motion.button whileTap={{ scale: 0.95 }}
          onClick={() => { hapticFeedback("light"); setSelected(null); }}
          className="text-[#9ca3af] text-[13px] font-semibold mb-4 flex items-center gap-1 active:text-[#6b7280] transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          {t("back")}
        </motion.button>
        <h2 className="text-[16px] font-bold leading-snug text-balance mb-2">{selected.topic}</h2>
        <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
          <span className="badge">{TYPES[selected.reportType]?.icon} {TYPES[selected.reportType]?.label || selected.reportType}</span>
          <span className="badge-blue">{SUBJECTS[selected.subject]?.label || selected.subject}</span>
        </div>
        <div className="flex items-center gap-2 mb-3 text-[10px] text-[#9ca3af]">
          <span>{dateStr}</span>
          {wc > 0 && <><span>·</span><span className="tabular font-medium">{wc.toLocaleString()} {t("estimatedWords")}</span></>}
        </div>
        <div className="flex gap-2 mb-3">
          <motion.button whileTap={{ scale: 0.96 }}
            onClick={() => { navigator.clipboard.writeText(selected.content || "").then(() => { hapticSuccess(); setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => {}); }}
            className="flex-1 btn-main py-2.5 text-[13px] flex items-center justify-center gap-2">
            {copied
              ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>✓</>
              : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>{t("copy")}</>}
          </motion.button>
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => shareReport(selected)}
            className="py-2.5 px-4 rounded-[14px] text-[13px] font-semibold flex items-center justify-center gap-1.5"
            style={{ background: "rgba(74,144,255,0.06)", color: "#3B82F6" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
            {t("shareReport")}
          </motion.button>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => { hapticFeedback("medium"); go("/new"); }}
          className="w-full mb-3 py-2.5 rounded-[14px] text-[13px] font-semibold flex items-center justify-center gap-2"
          style={{ background: "rgba(124,92,252,0.05)", color: "#7C5CFC" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
          {t("repeatReport")}
        </motion.button>
        <div className="g-card rounded-[16px] p-4 max-h-[55vh] overflow-y-auto scrollbar-hide select-text">
          <MarkdownRenderer content={selected.content || t("contentUnavailable")} />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ease }}>
        <h2 className="text-[22px] font-extrabold tracking-tight mb-0.5">{t("history")}</h2>
        <p className="text-[11px] text-[#9ca3af] mb-3">{reports.length} {t("total").toLowerCase()}</p>
      </motion.div>

      {!loading && reports.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, ease }}>
          <div className="relative mb-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2"
              className="absolute left-3.5 top-1/2 -translate-y-1/2">
              <circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
              placeholder={t("searchReports")} className="input-field pl-10" />
            {searchQ && (
              <button onClick={() => setSearchQ("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] active:text-[#6b7280] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
              </button>
            )}
          </div>

          {usedTypes.length > 1 && (
            <div className="flex gap-1.5 mb-3 overflow-x-auto scrollbar-hide pb-0.5 -mx-4 px-4">
              <motion.button whileTap={{ scale: 0.95 }}
                onClick={() => { hapticFeedback("light"); setFilterType("all"); }}
                className="shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all"
                style={{
                  background: filterType === "all" ? "linear-gradient(135deg, #7C5CFC, #3B82F6)" : "rgba(0,0,0,0.03)",
                  color: filterType === "all" ? "white" : "#9ca3af",
                }}>
                {t("allSubjects")}
              </motion.button>
              {usedTypes.map(type => (
                <motion.button key={type} whileTap={{ scale: 0.95 }}
                  onClick={() => { hapticFeedback("light"); setFilterType(type); }}
                  className="shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all"
                  style={{
                    background: filterType === type ? "linear-gradient(135deg, #7C5CFC, #3B82F6)" : "rgba(0,0,0,0.03)",
                    color: filterType === type ? "white" : "#9ca3af",
                  }}>
                  {TYPES[type]?.icon} {TYPES[type]?.label || type}
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      )}

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
              style={{ background: "rgba(124,92,252,0.04)" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="1" opacity="0.3">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
          </div>
          <h3 className="text-base font-bold mb-1">{t("noHistory")}</h3>
          <p className="text-[12px] text-[#9ca3af] max-w-[220px] mb-4">{t("noHistoryDesc")}</p>
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => { hapticFeedback("medium"); go("/new"); }}
            className="btn-main px-6 py-2.5 text-[13px] flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
            {t("createReport")}
          </motion.button>
        </motion.div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <div className="w-14 h-14 rounded-[16px] mx-auto mb-3 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.03)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
          </div>
          <p className="text-[13px] font-semibold text-[#9ca3af]">{t("noReportsYet")}</p>
          <p className="text-[11px] text-[#d1d5db] mt-1">{searchQ ? `"${searchQ}"` : ""}</p>
        </motion.div>
      ) : (
        <div className="space-y-1.5">
          <AnimatePresence>
            {filtered.map((r, i) => {
              const dateStr = new Date(r.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short" });
              return (
                <motion.button key={r.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.035, duration: 0.25, ease }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { hapticFeedback("light"); setSelected(r); setCopied(false); }}
                  className="w-full g-card rounded-[14px] p-3.5 text-left flex items-center gap-3">
                  <div className="icon-box text-[16px]" style={{ background: "rgba(124,92,252,0.06)" }}>
                    {TYPES[r.reportType]?.icon || "📄"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold truncate leading-tight">{r.topic}</div>
                    <div className="text-[11px] text-[#9ca3af] mt-0.5 flex items-center gap-1">
                      <span>{TYPES[r.reportType]?.label || r.reportType}</span>
                      <span className="text-[#d1d5db]">·</span>
                      <span>{dateStr}</span>
                    </div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
