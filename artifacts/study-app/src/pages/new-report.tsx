import { useState } from "react";
import { useLocation } from "wouter";
import { useUser, setUser, useLang } from "@/lib/store";
import { generateReport } from "@/lib/api";
import { getReportTypes, getSubjectCategories, getSubjectName, t } from "@/lib/i18n";
import { hapticFeedback, hapticSuccess, hapticError } from "@/lib/telegram";
import { motion, AnimatePresence } from "framer-motion";

type Step = "type" | "category" | "subject" | "details" | "generating" | "done" | "error";

const slideIn = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
};

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
  const [result, setResult] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState("");
  const [progress, setProgress] = useState(0);

  const canGenerate = user ? (!user.freeReportsUsed || user.balance > 0) : false;
  const REPORT_TYPES = getReportTypes();
  const CATEGORIES = getSubjectCategories();

  async function handleGenerate() {
    if (!user || !topic.trim()) return;
    if (!canGenerate) {
      hapticError();
      setLocation("/balance");
      return;
    }
    setStep("generating");
    setProgress(0);
    hapticFeedback("medium");

    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 8, 90));
    }, 500);

    try {
      const res = await generateReport({
        telegramId: user.telegramId,
        reportType,
        subject,
        topic: topic.trim(),
        group: group.trim() || undefined,
      });
      clearInterval(interval);
      setProgress(100);

      if (res.success && res.content) {
        hapticSuccess();
        setResult(res.content);
        setUser({ ...user, balance: res.remainingBalance ?? user.balance, freeReportsUsed: true, totalReports: user.totalReports + 1 });
        setTimeout(() => setStep("done"), 400);
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

  function copyToClipboard() {
    navigator.clipboard.writeText(result);
    hapticSuccess();
  }

  if (step === "generating") {
    return (
      <motion.div {...slideIn} className="px-4 pt-20 pb-4 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="relative mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 rounded-full border-4 border-primary/20"
            style={{ borderTopColor: "hsl(var(--primary))" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2">{t("generating")}</h2>
        <p className="text-muted-foreground text-sm text-center max-w-[260px] mb-6">
          {t("generatingDesc")}
        </p>
        <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full progress-bar-gradient rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-xs text-muted-foreground mt-2">{Math.round(progress)}%</span>
      </motion.div>
    );
  }

  if (step === "done") {
    return (
      <motion.div {...slideIn} className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-5">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
          </motion.div>
          <div>
            <h2 className="text-lg font-bold">{t("done")}</h2>
            <p className="text-xs text-muted-foreground">{t("docGenerated")}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={copyToClipboard}
            className="flex-1 premium-btn py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            {t("copy")}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => { setStep("type"); setReportType(""); setCategory(""); setSubject(""); setTopic(""); setGroup(""); setResult(""); }}
            className="flex-1 bg-secondary text-secondary-foreground rounded-xl py-2.5 text-sm font-semibold"
          >
            + {t("newOne")}
          </motion.button>
        </div>

        <div className="card-premium rounded-2xl p-4">
          <div className="prose prose-sm max-w-none text-foreground text-sm leading-relaxed whitespace-pre-wrap break-words select-text">
            {result}
          </div>
        </div>
      </motion.div>
    );
  }

  if (step === "error") {
    return (
      <motion.div {...slideIn} className="px-4 pt-20 pb-4 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
        </motion.div>
        <h2 className="text-xl font-bold mb-2">{t("error")}</h2>
        <p className="text-muted-foreground text-sm text-center mb-6">{errorMsg}</p>
        <motion.button whileTap={{ scale: 0.96 }} onClick={() => setStep("details")} className="premium-btn px-8 py-3 text-sm font-semibold">
          {t("tryAgain")}
        </motion.button>
      </motion.div>
    );
  }

  if (step === "type") {
    return (
      <motion.div {...slideIn} className="px-4 pt-6 pb-4">
        <h2 className="text-xl font-bold mb-1">{t("newDocument")}</h2>
        <p className="text-muted-foreground text-sm mb-5">{t("chooseDocType")}</p>
        <div className="space-y-2.5">
          {REPORT_TYPES.map((type, i) => (
            <motion.button
              key={type.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { hapticFeedback("light"); setReportType(type.id); setStep("category"); }}
              className="w-full card-premium rounded-2xl p-4 text-left flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-2xl">{type.icon}</span>
              </div>
              <div className="flex-1">
                <div className="font-bold text-foreground">{type.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{type.desc}</div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/40"><polyline points="9 18 15 12 9 6"/></svg>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  }

  if (step === "category") {
    return (
      <motion.div {...slideIn} className="px-4 pt-6 pb-4">
        <motion.button whileTap={{ scale: 0.96 }} onClick={() => { hapticFeedback("light"); setStep("type"); }}
          className="text-primary text-sm font-semibold mb-4 flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          {t("back")}
        </motion.button>
        <h2 className="text-xl font-bold mb-1">{t("chooseCategory")}</h2>
        <p className="text-muted-foreground text-sm mb-5">{CATEGORIES.reduce((acc, c) => acc + c.subjects.length, 0)} {t("allSubjects").toLowerCase()}</p>
        <div className="grid grid-cols-2 gap-2.5">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { hapticFeedback("light"); setCategory(cat.id); setStep("subject"); }}
              className="card-premium rounded-2xl p-4 text-left"
            >
              <div className="text-2xl mb-2">{cat.icon}</div>
              <div className="font-semibold text-foreground text-sm">{cat.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{cat.subjects.length} {t("allSubjects").toLowerCase()}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  }

  if (step === "subject") {
    const selectedCategory = CATEGORIES.find((c) => c.id === category);
    const subjects = selectedCategory?.subjects || [];

    return (
      <motion.div {...slideIn} className="px-4 pt-6 pb-4">
        <motion.button whileTap={{ scale: 0.96 }} onClick={() => { hapticFeedback("light"); setStep("category"); }}
          className="text-primary text-sm font-semibold mb-4 flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          {t("back")}
        </motion.button>
        <h2 className="text-xl font-bold mb-1">{selectedCategory?.icon} {selectedCategory?.name}</h2>
        <p className="text-muted-foreground text-sm mb-5">{t("chooseSubject")}</p>
        <div className="space-y-2">
          {subjects.map((sub, i) => (
            <motion.button
              key={sub.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { hapticFeedback("light"); setSubject(sub.id); setStep("details"); }}
              className="w-full card-premium rounded-2xl p-4 text-left flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-xl">{sub.icon}</span>
              </div>
              <div className="font-semibold text-sm flex-1">{sub.name}</div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/30"><polyline points="9 18 15 12 9 6"/></svg>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  }

  const selectedType = REPORT_TYPES.find((rt) => rt.id === reportType);
  const selectedSubjectName = getSubjectName(subject);

  return (
    <motion.div {...slideIn} className="px-4 pt-6 pb-4">
      <motion.button whileTap={{ scale: 0.96 }} onClick={() => { hapticFeedback("light"); setStep("subject"); }}
        className="text-primary text-sm font-semibold mb-4 flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        {t("back")}
      </motion.button>
      <h2 className="text-xl font-bold mb-1">{t("details")}</h2>
      <p className="text-muted-foreground text-sm mb-5">{t("describeTask")}</p>

      <div className="flex gap-2 mb-5 flex-wrap">
        <div className="bg-primary/10 text-primary rounded-xl px-3 py-1.5 text-xs font-semibold">
          {selectedType?.icon} {selectedType?.label}
        </div>
        <div className="bg-emerald-50 text-emerald-700 rounded-xl px-3 py-1.5 text-xs font-semibold">
          {selectedSubjectName}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-foreground mb-1.5 block">{t("topicLabel")}</label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={t("topicPlaceholder")}
            className="w-full bg-card border border-border rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground/50 transition-all"
            rows={4}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-1.5 block">{t("groupLabel")}</label>
          <input
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            placeholder={t("groupPlaceholder")}
            className="w-full bg-card border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground/50 transition-all"
          />
        </div>
      </div>

      {!canGenerate && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 bg-red-50 text-red-700 rounded-xl p-3 text-sm flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          {t("noBalance")}.{" "}
          <button onClick={() => setLocation("/balance")} className="underline font-semibold">{t("topUpBalance")}</button>
        </motion.div>
      )}

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleGenerate}
        disabled={!topic.trim() || !canGenerate}
        className="mt-6 w-full premium-btn py-3.5 font-bold text-sm disabled:opacity-40 flex items-center justify-center gap-2"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
        {t("generate")}
      </motion.button>
    </motion.div>
  );
}
