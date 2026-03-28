import { useState, useEffect } from "react";
import { useUser, useLang } from "@/lib/store";
import { getReports, type ReportItem } from "@/lib/api";
import { getReportTypeMap, getSubjectMap, t } from "@/lib/i18n";
import { hapticFeedback, hapticSuccess } from "@/lib/telegram";
import { motion } from "framer-motion";

export default function History() {
  const user = useUser();
  useLang();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ReportItem | null>(null);
  const [searchQ, setSearchQ] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const TYPES = getReportTypeMap();
  const SUBJECTS = getSubjectMap();

  useEffect(() => {
    if (!user) return;
    getReports(user.telegramId)
      .then(res => setReports(res.reports))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const filtered = searchQ
    ? reports.filter(r => r.topic.toLowerCase().includes(searchQ.toLowerCase()))
    : reports;

  function copyContent(text: string, id: number) {
    navigator.clipboard.writeText(text);
    hapticSuccess();
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  if (selected) {
    const wordCount = selected.content ? selected.content.split(/\s+/).filter(Boolean).length : 0;
    const isCopied = copiedId === selected.id;
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-6 pb-4">
        <motion.button whileTap={{ scale: 0.95 }}
          onClick={() => { hapticFeedback("light"); setSelected(null); }}
          className="text-muted-foreground text-[13px] font-medium mb-4 flex items-center gap-1 active:text-foreground transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          {t("back")}
        </motion.button>
        <div className="flex items-start gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 text-base" style={{ background: "hsl(var(--primary) / 0.06)" }}>
            {TYPES[selected.reportType]?.icon || "~"}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[15px] font-bold text-foreground leading-snug text-balance">{selected.topic}</h2>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="badge">{TYPES[selected.reportType]?.label || selected.reportType}</span>
              <span className="badge">{SUBJECTS[selected.subject]?.label || selected.subject}</span>
              {wordCount > 0 && <span className="text-[10px] text-muted-foreground/40 tabular-nums font-medium">{wordCount.toLocaleString()}</span>}
            </div>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.96 }}
          onClick={() => { if (selected.content) copyContent(selected.content, selected.id); }}
          className="w-full rounded-[16px] py-3 text-[13px] font-semibold flex items-center justify-center gap-2 mb-5 transition-all duration-200"
          style={{
            background: isCopied ? "hsl(160 60% 40%)" : "linear-gradient(135deg, hsl(var(--primary)), hsl(235 72% 48%))",
            color: "white",
            boxShadow: isCopied ? "0 2px 8px hsl(160 60% 40% / 0.25)" : "0 2px 8px hsl(var(--primary) / 0.25)",
          }}>
          {isCopied ? (
            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{t("linkCopied")}</>
          ) : (
            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>{t("copyText")}</>
          )}
        </motion.button>
        <div className="card-static rounded-2xl p-5 max-h-[60vh] overflow-y-auto scrollbar-hide">
          <div className="prose prose-sm max-w-none text-foreground text-[13px] leading-[1.8] whitespace-pre-wrap break-words select-text">
            {selected.content || t("contentUnavailable")}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-6 pb-4">
      <h2 className="text-xl font-bold text-foreground tracking-tight mb-0.5">{t("history")}</h2>
      <p className="text-[13px] text-muted-foreground/60 mb-5">
        {reports.length > 0 ? `${reports.length} ${t("reportsGenerated")}` : t("docsHere")}
      </p>

      {reports.length > 3 && (
        <div className="relative mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/25">
            <circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/>
          </svg>
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
            placeholder={t("history")} aria-label={t("history")}
            className="input-field pl-10" />
        </div>
      )}

      {loading && (
        <div className="space-y-2.5 py-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="card-static rounded-xl p-4">
              <div className="flex items-center gap-3.5">
                <div className="skeleton w-10 h-10 shrink-0 rounded-[12px]" />
                <div className="flex-1 space-y-2.5">
                  <div className="skeleton h-3.5 w-3/4 rounded-md" />
                  <div className="skeleton h-3 w-1/2 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && reports.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.2" opacity="0.25">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <p className="text-[14px] text-muted-foreground/60 font-medium">{t("noReportsYet")}</p>
          <p className="text-[12px] text-muted-foreground/30 mt-1">{t("createFirst")}</p>
        </div>
      )}

      {!loading && filtered.length === 0 && reports.length > 0 && searchQ && (
        <div className="text-center py-14">
          <p className="text-[13px] text-muted-foreground/50">{t("noReportsYet")}</p>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((report, i) => (
          <motion.button
            key={report.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { hapticFeedback("light"); setSelected(report); }}
            className="w-full card rounded-xl p-4 text-left"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 text-base" style={{ background: "hsl(var(--primary) / 0.06)" }}>
                {TYPES[report.reportType]?.icon || "~"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[13px] text-foreground truncate">{report.topic}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[11px] text-muted-foreground/60">{TYPES[report.reportType]?.label}</span>
                  <span className="text-[11px] text-muted-foreground/20">·</span>
                  <span className="text-[11px] text-muted-foreground/60">{SUBJECTS[report.subject]?.label || report.subject}</span>
                </div>
                <div className="text-[10px] text-muted-foreground/25 mt-1.5 tabular-nums font-medium">
                  {new Date(report.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/15 mt-2 shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
