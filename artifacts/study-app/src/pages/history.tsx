import { useState, useEffect } from "react";
import { useUser } from "@/lib/store";
import { getReports, type ReportItem } from "@/lib/api";
import { REPORT_TYPE_MAP, SUBJECT_MAP } from "@/lib/constants";
import { hapticFeedback, hapticSuccess } from "@/lib/telegram";

export default function History() {
  const user = useUser();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  useEffect(() => {
    if (!user) return;
    getReports(user.telegramId)
      .then((res) => setReports(res.reports))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (selectedReport) {
    return (
      <div className="px-4 pt-6 pb-28">
        <button
          onClick={() => {
            hapticFeedback("light");
            setSelectedReport(null);
          }}
          className="text-primary text-sm font-medium mb-4 flex items-center gap-1"
        >
          ← Назад
        </button>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">
            {REPORT_TYPE_MAP[selectedReport.reportType]?.icon || "📄"}
          </span>
          <h2 className="text-lg font-bold">{selectedReport.topic}</h2>
        </div>

        <div className="flex gap-2 mb-4">
          <div className="bg-blue-50 text-blue-700 rounded-lg px-2.5 py-1 text-xs font-medium">
            {REPORT_TYPE_MAP[selectedReport.reportType]?.label || selectedReport.reportType}
          </div>
          <div className="bg-green-50 text-green-700 rounded-lg px-2.5 py-1 text-xs font-medium">
            {SUBJECT_MAP[selectedReport.subject]?.label || selectedReport.subject}
          </div>
        </div>

        <button
          onClick={() => {
            if (selectedReport.content) {
              navigator.clipboard.writeText(selectedReport.content);
              hapticSuccess();
            }
          }}
          className="w-full bg-primary text-primary-foreground rounded-xl py-2.5 text-sm font-medium mb-4 active:scale-[0.98] transition-transform"
        >
          📋 Копіювати текст
        </button>

        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
          <div className="prose prose-sm max-w-none text-foreground text-sm leading-relaxed whitespace-pre-wrap break-words select-text">
            {selectedReport.content || "Контент недоступний"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-28">
      <h2 className="text-xl font-bold mb-1">Історія</h2>
      <p className="text-muted-foreground text-sm mb-5">
        {reports.length > 0
          ? `${reports.length} документів згенеровано`
          : "Тут будуть твої документи"}
      </p>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {!loading && reports.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
            <span className="text-3xl">📭</span>
          </div>
          <p className="text-muted-foreground text-sm text-center">
            Поки що немає звітів.
            <br />
            Створи перший!
          </p>
        </div>
      )}

      <div className="space-y-2.5">
        {reports.map((report) => (
          <button
            key={report.id}
            onClick={() => {
              hapticFeedback("light");
              setSelectedReport(report);
            }}
            className="w-full bg-card rounded-2xl p-4 text-left shadow-sm border border-border active:scale-[0.98] transition-transform"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-lg">
                  {REPORT_TYPE_MAP[report.reportType]?.icon || "📄"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-foreground truncate">
                  {report.topic}
                </div>
                <div className="flex gap-1.5 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {REPORT_TYPE_MAP[report.reportType]?.label || report.reportType}
                  </span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">
                    {SUBJECT_MAP[report.subject]?.label || report.subject}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground/60 mt-1">
                  {new Date(report.createdAt).toLocaleDateString("uk-UA", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <span className="text-muted-foreground/40 text-lg">›</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
