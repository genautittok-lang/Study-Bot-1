import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useUser, setUser, useLang } from "@/lib/store";
import { generateReport } from "@/lib/api";
import { getReportTypes, getSubjectCategories, getSubjectName, t } from "@/lib/i18n";
import { hapticFeedback, hapticSuccess, hapticError } from "@/lib/telegram";
import { motion } from "framer-motion";

type Step = "type" | "category" | "subject" | "details" | "generating" | "done" | "error";

const STEP_INDEX: Record<string, number> = { type: 0, category: 1, subject: 2, details: 3 };

function StepIndicator({ step }: { step: Step }) {
  const idx = STEP_INDEX[step] ?? -1;
  if (idx < 0) return null;
  const labels = [t("chooseDocType"), t("chooseCategory"), t("chooseSubject"), t("details")];
  return (
    <div className="flex items-center gap-1.5 mb-5">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-1.5 flex-1">
          <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= idx ? "bg-primary" : "bg-muted"}`} />
        </div>
      ))}
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.96 }} onClick={() => { hapticFeedback("light"); onClick(); }}
      className="text-muted-foreground text-[13px] font-medium mb-3 flex items-center gap-1 active:text-foreground transition-colors">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
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
    setStep("generating");
    setProgress(0);
    hapticFeedback("medium");

    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 6 + 2, 92));
    }, 600);

    try {
      const res = await generateReport({
        telegramId: user.telegramId,
        reportType, subject,
        topic: topic.trim(),
        group: group.trim() || undefined,
      });
      clearInterval(interval);
      setProgress(100);

      if (res.success && res.content) {
        hapticSuccess();
        setResult(res.content);
        setUser({ ...user, balance: res.remainingBalance ?? user.balance, freeReportsUsed: true, totalReports: user.totalReports + 1 });
        setTimeout(() => setStep("done"), 300);
      } else {
        hapticError();
        setErrorMsg(res.error === "no_balance" ? t("noBalance") : t("error"));
        setStep("error");
      }
    } catch {
      clearInterval(interval);
      hapticError();
      setErrorMsg(t("connectionError"));
      setStep("error");
    }
  }

  function resetForm() {
    setStep("type"); setReportType(""); setCategory(""); setSubject("");
    setTopic(""); setGroup(""); setResult(""); setSearchQ("");
  }

  if (step === "generating") {
    const stages = [
      { at: 0, text: "Analyzing request..." },
      { at: 25, text: "Generating content..." },
      { at: 60, text: "Formatting document..." },
      { at: 85, text: "Final review..." },
    ];
    const currentStage = [...stages].reverse().find(s => progress >= s.at)?.text || stages[0].text;

    return (
      <div className="px-4 pt-16 pb-4 flex flex-col items-center justify-center min-h-[75vh]">
        <div className="relative mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-full border-[3px] border-muted"
            style={{ borderTopColor: "hsl(var(--primary))" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-primary/8 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2"><path d="M12 3v3m6.366-.366-2.12 2.12M21 12h-3m.366 6.366-2.12-2.12M12 21v-3m-6.366.366 2.12-2.12M3 12h3m-.366-6.366 2.12 2.12"/></svg>
            </div>
          </div>
        </div>
        <h2 className="text-lg font-bold text-foreground mb-1">{t("generating")}</h2>
        <p className="text-[13px] text-muted-foreground mb-6">{currentStage}</p>
        <div className="w-56 h-1.5 bg-muted rounded-full overflow-hidden mb-2">
          <motion.div className="h-full progress-bar-pro" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
        </div>
        <span className="text-[11px] text-muted-foreground tabular-nums">{Math.round(progress)}%</span>
      </div>
    );
  }

  if (step === "done") {
    const selectedType = REPORT_TYPES.find(rt => rt.id === reportType);
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-5 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-emerald-500/8 rounded-xl flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">{t("done")}</h2>
            <p className="text-[11px] text-muted-foreground">{selectedType?.label} · {wordCount} words</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <motion.button whileTap={{ scale: 0.96 }}
            onClick={() => { navigator.clipboard.writeText(result); hapticSuccess(); }}
            className="flex-1 premium-btn py-2.5 text-[13px] font-semibold flex items-center justify-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            {t("copy")}
          </motion.button>
          <motion.button whileTap={{ scale: 0.96 }} onClick={resetForm}
            className="flex-1 bg-secondary text-secondary-foreground border border-border rounded-[14px] py-2.5 text-[13px] font-semibold">
            {t("newOne")}
          </motion.button>
        </div>

        <div className="card-elevated rounded-2xl p-4 max-h-[60vh] overflow-y-auto">
          <div className="prose prose-sm max-w-none text-foreground text-[13px] leading-[1.7] whitespace-pre-wrap break-words select-text">
            {result}
          </div>
        </div>
      </motion.div>
    );
  }

  if (step === "error") {
    return (
      <div className="px-4 pt-16 pb-4 flex flex-col items-center justify-center min-h-[75vh]">
        <div className="w-14 h-14 bg-destructive/8 rounded-2xl flex items-center justify-center mb-5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--destructive))" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
        </div>
        <h2 className="text-lg font-bold mb-1">{t("error")}</h2>
        <p className="text-[13px] text-muted-foreground text-center mb-5">{errorMsg}</p>
        <button onClick={() => setStep("details")} className="premium-btn px-6 py-2.5 text-[13px] font-semibold">{t("tryAgain")}</button>
      </div>
    );
  }

  if (step === "type") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-5 pb-4">
        <h2 className="text-lg font-bold text-foreground tracking-tight mb-0.5">{t("newDocument")}</h2>
        <p className="text-[13px] text-muted-foreground mb-4">{t("chooseDocType")}</p>
        <StepIndicator step={step} />
        <div className="space-y-2">
          {REPORT_TYPES.map((type, i) => (
            <motion.button
              key={type.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { hapticFeedback("light"); setReportType(type.id); setStep("category"); }}
              className="w-full card-pro rounded-xl p-3.5 text-left flex items-center gap-3.5"
            >
              <div className="w-10 h-10 bg-primary/6 rounded-xl flex items-center justify-center shrink-0 text-lg">{type.icon}</div>
              <div className="flex-1">
                <div className="font-semibold text-[13px] text-foreground">{type.label}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{type.desc}</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/25"><polyline points="9 18 15 12 9 6"/></svg>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  }

  if (step === "category") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-5 pb-4">
        <BackButton onClick={() => setStep("type")} />
        <h2 className="text-lg font-bold text-foreground tracking-tight mb-0.5">{t("chooseCategory")}</h2>
        <p className="text-[13px] text-muted-foreground mb-4">{CATEGORIES.reduce((a, c) => a + c.subjects.length, 0)}+ {t("allSubjects").toLowerCase()}</p>
        <StepIndicator step={step} />
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, duration: 0.2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { hapticFeedback("light"); setCategory(cat.id); setStep("subject"); setSearchQ(""); }}
              className="card-pro rounded-xl p-3.5 text-left"
            >
              <span className="text-xl block mb-1.5">{cat.icon}</span>
              <div className="font-semibold text-[12px] text-foreground leading-snug">{cat.name}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{cat.subjects.length}</div>
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-5 pb-4">
        <BackButton onClick={() => setStep("category")} />
        <h2 className="text-lg font-bold text-foreground tracking-tight mb-0.5">{cat?.icon} {cat?.name}</h2>
        <p className="text-[13px] text-muted-foreground mb-4">{t("chooseSubject")}</p>
        <StepIndicator step={step} />
        {subjects.length > 5 && (
          <div className="relative mb-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40">
              <circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/>
            </svg>
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder={t("chooseSubject")}
              aria-label={t("chooseSubject")}
              className="w-full bg-muted/50 border border-border rounded-xl pl-9 pr-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30 transition-all" />
          </div>
        )}
        <div className="space-y-1.5">
          {filtered.map((sub, i) => (
            <motion.button
              key={sub.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { hapticFeedback("light"); setSubject(sub.id); setStep("details"); }}
              className="w-full card-pro rounded-xl p-3 text-left flex items-center gap-3"
            >
              <span className="text-base shrink-0">{sub.icon}</span>
              <span className="font-medium text-[13px] flex-1">{sub.name}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/20"><polyline points="9 18 15 12 9 6"/></svg>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  }

  const selectedType = REPORT_TYPES.find(rt => rt.id === reportType);
  const selectedSubjectName = getSubjectName(subject);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-5 pb-4">
      <BackButton onClick={() => setStep("subject")} />
      <h2 className="text-lg font-bold text-foreground tracking-tight mb-0.5">{t("details")}</h2>
      <p className="text-[13px] text-muted-foreground mb-4">{t("describeTask")}</p>
      <StepIndicator step={step} />

      <div className="flex gap-1.5 mb-4">
        <span className="badge-pro">{selectedType?.icon} {selectedType?.label}</span>
        <span className="badge-pro">{selectedSubjectName}</span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-[12px] font-semibold text-foreground mb-1.5 block">{t("topicLabel")}</label>
          <textarea value={topic} onChange={e => setTopic(e.target.value)}
            placeholder={t("topicPlaceholder")}
            className="w-full bg-card border border-border rounded-xl px-3.5 py-3 text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30 placeholder:text-muted-foreground/40 transition-all leading-relaxed"
            rows={4} />
          {topic.length > 0 && <div className="text-[10px] text-muted-foreground mt-1 text-right">{topic.length} chars</div>}
        </div>
        <div>
          <label className="text-[12px] font-semibold text-foreground mb-1.5 block">{t("groupLabel")}</label>
          <input value={group} onChange={e => setGroup(e.target.value)}
            placeholder={t("groupPlaceholder")}
            className="w-full bg-card border border-border rounded-xl px-3.5 py-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30 placeholder:text-muted-foreground/40 transition-all" />
        </div>
      </div>

      {!canGenerate && (
        <div className="mt-3 bg-destructive/5 border border-destructive/10 text-destructive rounded-xl p-3 text-[12px] flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <span>{t("noBalance")}. <button onClick={() => setLocation("/balance")} className="underline font-semibold">{t("topUpBalance")}</button></span>
        </div>
      )}

      <motion.button whileTap={{ scale: 0.98 }} onClick={handleGenerate}
        disabled={!topic.trim() || !canGenerate}
        className="mt-5 w-full premium-btn py-3.5 font-semibold text-[14px] disabled:opacity-35 flex items-center justify-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v3m6.366-.366-2.12 2.12M21 12h-3m.366 6.366-2.12-2.12M12 21v-3m-6.366.366 2.12-2.12M3 12h3m-.366-6.366 2.12 2.12"/></svg>
        {t("generate")}
      </motion.button>
    </motion.div>
  );
}
