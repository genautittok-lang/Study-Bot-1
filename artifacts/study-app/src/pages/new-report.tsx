import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useUser, setUser, useLang } from "@/lib/store";
import { generateReport } from "@/lib/api";
import { getReportTypes, getSubjectCategories, getSubjectName, t } from "@/lib/i18n";
import { hapticFeedback, hapticSuccess, hapticError } from "@/lib/telegram";
import { motion } from "framer-motion";

type Step = "type" | "category" | "subject" | "details" | "generating" | "done" | "error";
const STEPS = ["type", "category", "subject", "details"] as const;

function StepBar({ step }: { step: Step }) {
  const idx = STEPS.indexOf(step as typeof STEPS[number]);
  if (idx < 0) return null;
  return (
    <div className="flex items-center gap-2 mb-6">
      {STEPS.map((_, i) => (
        <div key={i} className="flex-1 h-[4px] rounded-full overflow-hidden bg-muted">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #667eea, #764ba2)" }}
            initial={{ width: "0%" }}
            animate={{ width: i <= idx ? "100%" : "0%" }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          />
        </div>
      ))}
    </div>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.95 }} onClick={() => { hapticFeedback("light"); onClick(); }}
      className="text-muted-foreground text-[14px] font-medium mb-4 flex items-center gap-1.5 active:text-foreground transition-colors">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
      {t("back")}
    </motion.button>
  );
}

export default function NewReport() {
  const user = useUser();
  const [, setLocation] = useLocation();
  useLang();
  const [step, setStep] = useState<Step>("type");
  const [reportType, setReportType] = useState("");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [group, setGroup] = useState("");
  const [result, setResult] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [progress, setProgress] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [searchQ, setSearchQ] = useState("");

  const canGenerate = user ? (!user.freeReportsUsed || user.balance > 0) : false;
  const REPORT_TYPES = getReportTypes();
  const CATEGORIES = getSubjectCategories();

  useEffect(() => {
    if (result) setWordCount(result.split(/\s+/).filter(Boolean).length);
  }, [result]);

  async function handleGenerate() {
    if (!user || !topic.trim()) return;
    if (!canGenerate) { hapticError(); setLocation("/balance"); return; }
    setStep("generating"); setProgress(0); hapticFeedback("medium");
    const interval = setInterval(() => { setProgress((p) => Math.min(p + Math.random() * 5 + 1.5, 92)); }, 700);
    try {
      const res = await generateReport({ telegramId: user.telegramId, reportType, subject, topic: topic.trim(), group: group.trim() || undefined });
      clearInterval(interval); setProgress(100);
      if (res.success && res.content) {
        hapticSuccess(); setResult(res.content);
        setUser({ ...user, balance: res.remainingBalance ?? user.balance, freeReportsUsed: true, totalReports: user.totalReports + 1 });
        setTimeout(() => setStep("done"), 400);
      } else { hapticError(); setErrorMsg(res.error === "no_balance" ? t("noBalance") : t("error")); setStep("error"); }
    } catch { clearInterval(interval); hapticError(); setErrorMsg(t("connectionError")); setStep("error"); }
  }

  function resetForm() { setStep("type"); setReportType(""); setCategory(""); setSubject(""); setTopic(""); setGroup(""); setResult(""); setSearchQ(""); }

  if (step === "generating") {
    return (
      <div className="px-5 pt-20 pb-4 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="relative mb-10">
          <div className="w-20 h-20 spinner" style={{ borderWidth: "3px" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-base font-bold tabular" style={{ color: "#667eea" }}>{Math.round(progress)}%</span>
          </div>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">{t("generating")}...</h2>
        <p className="text-[13px] text-muted-foreground/50 mb-8">{t("generatingDesc")}</p>
        <div className="w-60 h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #667eea, #764ba2)" }}
            animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
        </div>
      </div>
    );
  }

  if (step === "done") {
    const selectedType = REPORT_TYPES.find(rt => rt.id === reportType);
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center pop-in"
            style={{ background: "linear-gradient(135deg, rgba(67,233,123,0.1), rgba(56,249,215,0.05))" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#43e97b" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{t("done")}</h2>
            <p className="text-[13px] text-muted-foreground/50">{selectedType?.label} · {wordCount.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex gap-3 mb-5">
          <motion.button whileTap={{ scale: 0.96 }}
            onClick={() => { navigator.clipboard.writeText(result); hapticSuccess(); }}
            className="flex-1 btn-primary py-3.5 text-[14px] font-semibold flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            {t("copy")}
          </motion.button>
          <motion.button whileTap={{ scale: 0.96 }} onClick={resetForm}
            className="flex-1 btn-ghost py-3.5 text-[14px] font-semibold">{t("newOne")}</motion.button>
        </div>
        <div className="card rounded-2xl p-5 max-h-[55vh] overflow-y-auto scrollbar-hide">
          <div className="prose prose-sm max-w-none text-foreground text-[14px] leading-[1.8] whitespace-pre-wrap break-words select-text">{result}</div>
        </div>
      </motion.div>
    );
  }

  if (step === "error") {
    return (
      <div className="px-5 pt-20 pb-4 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-16 h-16 bg-destructive/8 rounded-2xl flex items-center justify-center mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--destructive))" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
        </div>
        <h2 className="text-xl font-bold mb-2">{t("error")}</h2>
        <p className="text-[14px] text-muted-foreground text-center mb-6">{errorMsg}</p>
        <button onClick={() => setStep("details")} className="btn-primary px-8 py-3 text-[14px] font-semibold">{t("tryAgain")}</button>
      </div>
    );
  }

  if (step === "type") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pt-6 pb-4">
        <h2 className="text-[22px] font-bold text-foreground tracking-tight mb-1">{t("newDocument")}</h2>
        <p className="text-[14px] text-muted-foreground/50 mb-5">{t("chooseDocType")}</p>
        <StepBar step={step} />
        <div className="space-y-2.5">
          {REPORT_TYPES.map((type, i) => (
            <motion.button key={type.id}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { hapticFeedback("light"); setReportType(type.id); setStep("category"); }}
              className="w-full card-interactive rounded-2xl p-4 text-left flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-xl"
                style={{ background: "linear-gradient(135deg, rgba(102,126,234,0.08), rgba(118,75,162,0.05))" }}>{type.icon}</div>
              <div className="flex-1">
                <div className="font-semibold text-[15px] text-foreground">{type.label}</div>
                <div className="text-[12px] text-muted-foreground/45 mt-0.5">{type.desc}</div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/20"><polyline points="9 18 15 12 9 6"/></svg>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  }

  if (step === "category") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pt-6 pb-4">
        <BackBtn onClick={() => setStep("type")} />
        <h2 className="text-[22px] font-bold text-foreground tracking-tight mb-1">{t("chooseCategory")}</h2>
        <p className="text-[14px] text-muted-foreground/50 mb-5">{CATEGORIES.reduce((a, c) => a + c.subjects.length, 0)}+ {t("allSubjects").toLowerCase()}</p>
        <StepBar step={step} />
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat, i) => (
            <motion.button key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { hapticFeedback("light"); setCategory(cat.id); setStep("subject"); setSearchQ(""); }}
              className="card-interactive rounded-2xl p-4 text-left">
              <span className="text-2xl block mb-2">{cat.icon}</span>
              <div className="font-semibold text-[13px] text-foreground leading-snug">{cat.name}</div>
              <div className="text-[11px] text-muted-foreground/40 mt-1">{cat.subjects.length} {t("allSubjects").toLowerCase()}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  }

  if (step === "subject") {
    const cat = CATEGORIES.find(c => c.id === category);
    const subjects = cat?.subjects || [];
    const filtered = searchQ ? subjects.filter(s => s.name.toLowerCase().includes(searchQ.toLowerCase())) : subjects;
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pt-6 pb-4">
        <BackBtn onClick={() => setStep("category")} />
        <h2 className="text-[22px] font-bold text-foreground tracking-tight mb-1">{cat?.icon} {cat?.name}</h2>
        <p className="text-[14px] text-muted-foreground/50 mb-5">{t("chooseSubject")}</p>
        <StepBar step={step} />
        {subjects.length > 5 && (
          <div className="relative mb-4">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/25">
              <circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/>
            </svg>
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
              placeholder={t("chooseSubject")} aria-label={t("chooseSubject")} className="input-field pl-12" />
          </div>
        )}
        <div className="space-y-2">
          {filtered.map((sub, i) => (
            <motion.button key={sub.id}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { hapticFeedback("light"); setSubject(sub.id); setStep("details"); }}
              className="w-full card-interactive rounded-2xl p-4 text-left flex items-center gap-3.5">
              <span className="text-lg shrink-0">{sub.icon}</span>
              <span className="font-medium text-[14px] flex-1">{sub.name}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/15"><polyline points="9 18 15 12 9 6"/></svg>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  }

  const selectedType = REPORT_TYPES.find(rt => rt.id === reportType);
  const selectedSubjectName = getSubjectName(subject);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pt-6 pb-4">
      <BackBtn onClick={() => setStep("subject")} />
      <h2 className="text-[22px] font-bold text-foreground tracking-tight mb-1">{t("details")}</h2>
      <p className="text-[14px] text-muted-foreground/50 mb-5">{t("describeTask")}</p>
      <StepBar step={step} />
      <div className="flex gap-2 mb-5 flex-wrap">
        <span className="badge">{selectedType?.icon} {selectedType?.label}</span>
        <span className="badge">{selectedSubjectName}</span>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-[13px] font-semibold text-foreground mb-2 block">{t("topicLabel")}</label>
          <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder={t("topicPlaceholder")}
            className="input-field resize-none leading-relaxed" rows={4} />
          {topic.length > 0 && <div className="text-[11px] text-muted-foreground/30 mt-1.5 text-right tabular">{topic.length}</div>}
        </div>
        <div>
          <label className="text-[13px] font-semibold text-foreground mb-2 block">{t("groupLabel")}</label>
          <input value={group} onChange={e => setGroup(e.target.value)} placeholder={t("groupPlaceholder")} className="input-field" />
        </div>
      </div>
      {!canGenerate && (
        <div className="mt-4 bg-destructive/5 border border-destructive/10 text-destructive rounded-2xl p-4 text-[13px] flex items-center gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <span>{t("noBalance")}. <button onClick={() => setLocation("/balance")} className="underline font-semibold">{t("topUpBalance")}</button></span>
        </div>
      )}
      <motion.button whileTap={{ scale: 0.97 }} onClick={handleGenerate} disabled={!topic.trim() || !canGenerate}
        className="mt-6 w-full btn-primary py-4 font-semibold text-[15px] flex items-center justify-center gap-2.5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
        {t("generate")}
      </motion.button>
    </motion.div>
  );
}
