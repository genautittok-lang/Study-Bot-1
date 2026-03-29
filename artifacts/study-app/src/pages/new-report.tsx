import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useUser, setUser, useLang, addRecentItem } from "@/lib/store";
import { generateReport } from "@/lib/api";
import { getReportTypes, getSubjectCategories, getSubjectName, getEduLevels, getCategoryEduLevel, t, getLang } from "@/lib/i18n";
import type { EduLevel } from "@/lib/i18n";
import { hapticFeedback, hapticSuccess, hapticError, hapticSelection, shareViaTelegram, useBackButton } from "@/lib/telegram";
import { motion, AnimatePresence } from "framer-motion";
import MarkdownRenderer from "@/components/markdown-renderer";
import Icon3D, { REPORT_ICON_MAP } from "@/components/icons-3d";

type Step = "type" | "category" | "subject" | "details" | "generating" | "done" | "error";
const STEPS = ["type", "category", "subject", "details"] as const;
const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

function StepBar({ step }: { step: Step }) {
  const idx = STEPS.indexOf(step as typeof STEPS[number]);
  if (idx < 0) return null;
  const labels = [t("chooseDocType"), t("chooseCategory"), t("chooseSubject"), t("details")];
  return (
    <div className="mb-4">
      <div className="flex items-center gap-1.5 mb-1.5">
        {STEPS.map((_, i) => (
          <div key={i} className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.05)" }}>
            <motion.div className="h-full rounded-full"
              style={{ background: i <= idx ? "linear-gradient(90deg, #7C5CFC, #3B82F6)" : "transparent" }}
              initial={{ width: "0%" }} animate={{ width: i <= idx ? "100%" : "0%" }}
              transition={{ duration: 0.35, delay: i * 0.06 }} />
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        {labels.map((l, i) => (
          <span key={i} className="text-[7px] font-semibold uppercase tracking-wider"
            style={{ color: i <= idx ? "#7C5CFC" : "#d1d5db" }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.95 }} onClick={() => { hapticFeedback("light"); onClick(); }}
      className="text-[#9ca3af] text-[13px] font-semibold mb-3 flex items-center gap-1 active:text-[#6b7280] transition-colors">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
      {t("back")}
    </motion.button>
  );
}

function EduTabs({ value, onChange }: { value: EduLevel; onChange: (v: EduLevel) => void }) {
  const levels = getEduLevels();
  return (
    <div className="flex gap-1 mb-3 p-1 rounded-[14px]" style={{ background: "rgba(0,0,0,0.03)" }}>
      {levels.map(lv => (
        <motion.button key={lv.id} whileTap={{ scale: 0.96 }}
          onClick={() => { hapticSelection(); onChange(lv.id); }}
          className="flex-1 py-2 rounded-[10px] text-[11px] font-semibold transition-all"
          style={{
            color: value === lv.id ? "#1a1a2e" : "#9ca3af",
            background: value === lv.id ? "white" : "transparent",
            boxShadow: value === lv.id ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
          }}>
          {lv.label}
        </motion.button>
      ))}
    </div>
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
  const [eduLevel, setEduLevel] = useState<EduLevel>("all");
  const [copied, setCopied] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [length, setLength] = useState<"short" | "medium" | "full">("medium");

  useBackButton(() => {
    if (step === "done" || step === "error") { reset(); }
    else if (step === "generating") { /* don't interrupt */ }
    else if (step === "details") { setStep("subject"); }
    else if (step === "subject") { setStep("category"); }
    else if (step === "category") { setStep("type"); }
    else { setLocation("/"); }
  });

  const TYPES = getReportTypes();
  const CATS = getSubjectCategories();

  const LENGTH_OPTIONS = [
    { id: "short" as const, label: t("lengthShort"), desc: t("lengthShortDesc"), words: 500, time: 15, cost: 1 },
    { id: "medium" as const, label: t("lengthMedium"), desc: t("lengthMediumDesc"), words: 1500, time: 30, cost: 2 },
    { id: "full" as const, label: t("lengthFull"), desc: t("lengthFullDesc"), words: 3000, time: 60, cost: 3 },
  ];
  const selectedLength = LENGTH_OPTIONS.find(l => l.id === length) || LENGTH_OPTIONS[1];
  const currentCost = selectedLength.cost;
  const canGenerate = user ? (!user.freeReportsUsed || user.balance >= currentCost) : false;

  const filteredCats = useMemo(() => {
    if (eduLevel === "all") return CATS;
    return CATS.filter(c => getCategoryEduLevel(c.id) === eduLevel);
  }, [CATS, eduLevel]);

  useEffect(() => { if (result) setWordCount(result.split(/\s+/).filter(Boolean).length); }, [result]);

  async function handleGenerate() {
    if (!user || !topic.trim()) return;
    if (!canGenerate) { hapticError(); setLocation("/balance"); return; }
    setStep("generating"); setProgress(0); hapticFeedback("medium");
    const iv = setInterval(() => { setProgress(p => Math.min(p + Math.random() * 5 + 1.5, 92)); }, 700);

    const lengthHint = length === "short" ? " (short, ~500 words)" : length === "full" ? " (detailed, ~3000 words)" : "";
    const fullTopic = topic.trim() + lengthHint;

    try {
      const res = await generateReport({ telegramId: user.telegramId, reportType, subject, topic: fullTopic, group: group.trim() || undefined, imageData: imageData || undefined, language: getLang(), cost: currentCost });
      clearInterval(iv); setProgress(100);
      if (res.success && res.content) {
        hapticSuccess(); setResult(res.content);
        setUser({ ...user, balance: res.remainingBalance ?? user.balance, freeReportsUsed: true, totalReports: user.totalReports + 1 });
        const selType = TYPES.find(rt => rt.id === reportType);
        addRecentItem({ reportType, subject, subjectName: getSubjectName(subject), typeName: selType?.label || reportType, typeIcon: selType?.icon || "📄" });
        setTimeout(() => setStep("done"), 400);
      } else { hapticError(); setErrorMsg(res.error === "no_balance" ? t("noBalance") : t("error")); setStep("error"); }
    } catch { clearInterval(iv); hapticError(); setErrorMsg(t("connectionError")); setStep("error"); }
  }

  function shareResult() {
    const selType = TYPES.find(rt => rt.id === reportType);
    const preview = result.substring(0, 300).replace(/[#*_]/g, "") + "...";
    shareViaTelegram(`${selType?.icon} ${selType?.label}: ${topic.trim()}\n\n${preview}\n\n${t("shareText")}`);
  }

  function downloadResult() {
    hapticSuccess();
    const selType = TYPES.find(rt => rt.id === reportType);
    const fileName = `${selType?.label || "document"} — ${topic.trim().substring(0, 40)}`.replace(/[/\\?%*:|"<>]/g, "_") + ".txt";
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function reset() { setStep("type"); setReportType(""); setCategory(""); setSubject(""); setTopic(""); setGroup(""); setResult(""); setSearchQ(""); setCopied(false); setImageData(null); setImagePreview(null); setLength("medium"); }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { hapticError(); return; }
    if (!file.type.startsWith("image/")) { hapticError(); return; }
    hapticFeedback("light");
    const reader = new FileReader();
    reader.onload = () => { const b = reader.result as string; setImageData(b); setImagePreview(b); };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function removeImage() { hapticFeedback("light"); setImageData(null); setImagePreview(null); }

  const GEN_TIPS = [
    t("genTip1") || "AI is analyzing your topic...",
    t("genTip2") || "Building document structure...",
    t("genTip3") || "Generating content sections...",
    t("genTip4") || "Adding references & sources...",
    t("genTip5") || "Formatting & polishing...",
    t("genTip6") || "Almost ready!",
  ];

  const [tipIdx, setTipIdx] = useState(0);
  useEffect(() => {
    if (step !== "generating") return;
    const iv = setInterval(() => setTipIdx(i => (i + 1) % GEN_TIPS.length), 3000);
    return () => clearInterval(iv);
  }, [step]);

  if (step === "generating") {
    const selType = TYPES.find(rt => rt.id === reportType);
    const progressPct = Math.round(progress);
    return (
      <div className="px-4 pt-6 pb-4 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="relative mb-6">
          <motion.div className="absolute inset-[-20px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(124,92,252,0.08) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute inset-[-35px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)" }}
            animate={{ scale: [1.1, 0.95, 1.1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} />

          <svg width="120" height="120" viewBox="0 0 120 120" className="relative z-10">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="4" />
            <motion.circle cx="60" cy="60" r="54" fill="none" stroke="url(#genGrad)" strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 54}
              initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
              animate={{ strokeDashoffset: (1 - progress / 100) * 2 * Math.PI * 54 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ transform: "rotate(-90deg)", transformOrigin: "center" }} />
            <circle cx="60" cy="60" r="44" fill="none" stroke="rgba(0,0,0,0.02)" strokeWidth="2" />
            <motion.circle cx="60" cy="60" r="44" fill="none" stroke="url(#genGrad2)" strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 44}
              animate={{ strokeDashoffset: [2 * Math.PI * 44, 0, 2 * Math.PI * 44], rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "center" }} />
            <defs>
              <linearGradient id="genGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C5CFC" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#06D6A0" />
              </linearGradient>
              <linearGradient id="genGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06D6A0" />
                <stop offset="100%" stopColor="#7C5CFC" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col z-20">
            <motion.span
              key={progressPct}
              initial={{ scale: 1.1, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-[28px] font-extrabold tabular gradient-text leading-none">{progressPct}%</motion.span>
          </div>

          {[0, 1, 2, 3, 4, 5].map(i => (
            <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                background: ["#7C5CFC", "#3B82F6", "#06D6A0", "#F59E0B", "#EC4899", "#10B981"][i],
                top: "50%", left: "50%",
              }}
              animate={{
                x: [0, Math.cos((i * Math.PI * 2) / 6) * 70],
                y: [0, Math.sin((i * Math.PI * 2) / 6) * 70],
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }} />
          ))}
        </div>

        <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="text-[18px] font-extrabold mb-1 tracking-tight">{t("generating")}</motion.h2>
        <p className="text-[12px] text-[#9ca3af] mb-3 text-center px-8">{t("generatingDesc")}</p>

        <div className="flex gap-2 flex-wrap justify-center mb-4">
          {[selType?.icon + " " + (selType?.label || ""), getSubjectName(subject)].filter(Boolean).map((tag, i) => (
            <span key={i} className="badge text-[10px]">{tag}</span>
          ))}
        </div>

        <div className="w-64 mb-5">
          <div className="h-[5px] rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.04)" }}>
            <motion.div className="h-full rounded-full gen-progress-bar"
              animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
          </div>
          <div className="flex justify-between mt-1.5 px-0.5">
            <span className="text-[9px] text-[#b0b0c0] font-medium">{t("generating")}...</span>
            <span className="text-[9px] text-[#7C5CFC] font-bold tabular">{progressPct}%</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tipIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-2.5 px-5 py-3 rounded-[16px] max-w-[300px]"
            style={{ background: "rgba(124,92,252,0.04)", border: "1px solid rgba(124,92,252,0.08)" }}>
            <motion.div
              animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="2">
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
              </svg>
            </motion.div>
            <span className="text-[11px] font-medium text-[#6b5ce0] leading-snug">{GEN_TIPS[tipIdx]}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  if (step === "done") {
    const selType = TYPES.find(rt => rt.id === reportType);
    const readTime = Math.max(1, Math.round(wordCount / 200));
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="px-4 pt-6 pb-4">
        <div className="relative overflow-hidden rounded-[22px] p-5 mb-3"
          style={{ background: "linear-gradient(145deg, #10B981 0%, #059669 40%, #047857 100%)", boxShadow: "0 8px 32px rgba(16,185,129,0.25)" }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, white 0%, transparent 70%)", transform: "translate(25%, -35%)" }} />

          {[0,1,2,3,4,5,6,7].map(i => (
            <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                background: ["#FFD700","#FF6B9D","#00D4FF","#FFB800","#FF5733","#C0F","#0FF","#FFF"][i],
                left: `${10 + i * 12}%`, top: "-10px",
              }}
              animate={{ y: [0, 80], opacity: [1, 0], rotate: [0, 720] }}
              transition={{ duration: 1.5, delay: 0.1 + i * 0.08, ease: "easeOut" }} />
          ))}

          <div className="relative z-10 flex items-center gap-3">
            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-white/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </motion.div>
            <div className="flex-1">
              <h2 className="text-[17px] font-extrabold text-white leading-tight">{t("done")}</h2>
              <p className="text-[11px] text-white/60 mt-0.5">{selType?.icon} {selType?.label}</p>
            </div>
          </div>

          <div className="relative z-10 flex gap-3 mt-3">
            {[
              { val: wordCount.toLocaleString(), label: t("estimatedWords") },
              { val: `~${readTime} min`, label: t("estimatedTime") },
            ].map((s, i) => (
              <div key={i} className="flex-1 rounded-[12px] py-2 text-center" style={{ background: "rgba(255,255,255,0.12)" }}>
                <div className="text-[16px] font-extrabold text-white tabular">{s.val}</div>
                <div className="text-[8px] text-white/50 font-bold uppercase tracking-wider mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <motion.button whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          onClick={() => { navigator.clipboard.writeText(result).then(() => { hapticSuccess(); setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => {}); }}
          className="w-full py-[14px] rounded-[16px] text-[14px] font-bold flex items-center justify-center gap-2.5 mb-2.5"
          style={{
            background: "linear-gradient(145deg, #2AABEE 0%, #229ED9 100%)",
            color: "white",
            boxShadow: "0 8px 24px rgba(42,171,238,0.3), 0 2px 6px rgba(0,0,0,0.06)",
          }}>
          {copied
            ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{t("copy")} ✓</>
            : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>{t("copy")}</>}
        </motion.button>

        <div className="flex gap-2 mb-3">
          <motion.button whileTap={{ scale: 0.96 }} onClick={downloadResult}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="flex-1 py-3 rounded-[14px] text-[12px] font-semibold flex items-center justify-center gap-1.5"
            style={{ background: "rgba(16,185,129,0.06)", color: "#10B981", border: "1px solid rgba(16,185,129,0.1)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            {t("downloadFile")}
          </motion.button>
          <motion.button whileTap={{ scale: 0.96 }} onClick={shareResult}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="flex-1 py-3 rounded-[14px] text-[12px] font-semibold flex items-center justify-center gap-1.5"
            style={{ background: "rgba(74,144,255,0.06)", color: "#3B82F6", border: "1px solid rgba(74,144,255,0.1)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
            {t("shareReport")}
          </motion.button>
          <motion.button whileTap={{ scale: 0.96 }} onClick={reset}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="flex-1 py-3 rounded-[14px] text-[12px] font-semibold flex items-center justify-center gap-1.5"
            style={{ background: "rgba(124,92,252,0.05)", color: "#7C5CFC", border: "1px solid rgba(124,92,252,0.08)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
            {t("newOne")}
          </motion.button>
        </div>
        <div className="g-card rounded-[16px] p-4 max-h-[60vh] overflow-y-auto scrollbar-hide select-text">
          <MarkdownRenderer content={result} />
        </div>
      </motion.div>
    );
  }

  if (step === "error") {
    return (
      <div className="px-4 pt-12 pb-4 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="relative mb-6">
          <div className="w-20 h-20 rounded-[24px] flex items-center justify-center"
            style={{ background: "rgba(255,107,107,0.06)" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" x2="9" y1="9" y2="15"/>
              <line x1="9" x2="15" y1="9" y2="15"/>
            </svg>
          </div>
          <motion.div className="absolute -inset-3 rounded-[28px]"
            style={{ border: "1.5px solid rgba(255,107,107,0.1)" }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }} />
        </motion.div>
        <h2 className="text-[18px] font-extrabold mb-1.5">{t("error")}</h2>
        <p className="text-[13px] text-[#9ca3af] text-center mb-6 px-8 leading-relaxed">{errorMsg}</p>
        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.96 }}
            onClick={() => { hapticFeedback("medium"); setStep("details"); }}
            className="btn-main px-8 py-3 text-[13px] flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
            </svg>
            {t("tryAgain")}
          </motion.button>
          <motion.button whileTap={{ scale: 0.96 }}
            onClick={() => { hapticFeedback("light"); reset(); }}
            className="btn-ghost px-5 py-3 text-[13px]">
            {t("back")}
          </motion.button>
        </div>
      </div>
    );
  }

  if (step === "type") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-6 pb-4">
        <h2 className="text-[22px] font-extrabold tracking-tight mb-0.5">{t("newDocument")}</h2>
        <p className="text-[11px] text-[#9ca3af] mb-3">{t("chooseDocType")}</p>
        <StepBar step={step} />
        <div className="grid grid-cols-2 gap-2">
          {TYPES.map((type, i) => (
            <motion.button key={type.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.22, ease }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { hapticFeedback("light"); setReportType(type.id); setStep("category"); }}
              className="g-card rounded-[16px] p-3.5 text-left">
              <div className="mb-2">
                <Icon3D id={REPORT_ICON_MAP[type.id] || "report"} size={38} />
              </div>
              <div className="font-bold text-[13px] leading-snug">{type.label}</div>
              <div className="text-[10px] text-[#9ca3af] mt-0.5 leading-snug">{type.desc}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  }

  if (step === "category") {
    const totalSubjects = CATS.reduce((a, c) => a + c.subjects.length, 0);
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-6 pb-4">
        <BackBtn onClick={() => setStep("type")} />
        <h2 className="text-[22px] font-extrabold tracking-tight mb-0.5">{t("chooseCategory")}</h2>
        <p className="text-[11px] text-[#9ca3af] mb-3">{totalSubjects}+ {t("allSubjects").toLowerCase()}</p>
        <StepBar step={step} />
        <EduTabs value={eduLevel} onChange={setEduLevel} />
        <AnimatePresence mode="wait">
          <motion.div key={eduLevel} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }} className="grid grid-cols-2 gap-2">
            {filteredCats.map((cat, i) => (
              <motion.button key={cat.id}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02, duration: 0.18 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => { hapticFeedback("light"); setCategory(cat.id); setStep("subject"); setSearchQ(""); }}
                className="g-card rounded-[16px] p-3 text-left">
                <span className="text-[24px] block mb-2">{cat.icon}</span>
                <div className="font-bold text-[12px] leading-snug">{cat.name}</div>
                <div className="text-[10px] text-[#9ca3af] mt-0.5 font-medium">{cat.subjects.length} {t("allSubjects").toLowerCase()}</div>
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    );
  }

  if (step === "subject") {
    const cat = CATS.find(c => c.id === category);
    const subs = cat?.subjects || [];
    const filtered = searchQ ? subs.filter(s => s.name.toLowerCase().includes(searchQ.toLowerCase())) : subs;
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-6 pb-4">
        <BackBtn onClick={() => setStep("category")} />
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[22px]">{cat?.icon}</span>
          <h2 className="text-[20px] font-extrabold tracking-tight">{cat?.name}</h2>
        </div>
        <p className="text-[11px] text-[#9ca3af] mb-3">{subs.length} {t("allSubjects").toLowerCase()}</p>
        <StepBar step={step} />
        <div className="relative mb-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2"
            className="absolute left-3.5 top-1/2 -translate-y-1/2">
            <circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
            placeholder={t("chooseSubject")} aria-label={t("chooseSubject")} className="input-field pl-10" />
          {searchQ && (
            <button onClick={() => setSearchQ("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] active:text-[#6b7280] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
            </button>
          )}
        </div>
        <div className="space-y-1.5">
          {filtered.length === 0 && searchQ && (
            <div className="text-center py-8 text-[#9ca3af] text-[12px]">Not found</div>
          )}
          {filtered.map((sub, i) => (
            <motion.button key={sub.id}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.015, duration: 0.15 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { hapticFeedback("light"); setSubject(sub.id); setStep("details"); }}
              className="w-full g-card rounded-[14px] p-3.5 text-left flex items-center gap-3">
              <span className="text-base shrink-0">{sub.icon}</span>
              <span className="font-semibold text-[13px] flex-1">{sub.name}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  }

  const selType = TYPES.find(rt => rt.id === reportType);
  const selSubj = getSubjectName(subject);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-6 pb-4">
      <BackBtn onClick={() => setStep("subject")} />
      <h2 className="text-[22px] font-extrabold tracking-tight mb-0.5">{t("details")}</h2>
      <p className="text-[11px] text-[#9ca3af] mb-3">{t("describeTask")}</p>
      <StepBar step={step} />
      <div className="flex gap-1.5 mb-3 flex-wrap">
        <span className="badge">{selType?.icon} {selType?.label}</span>
        <span className="badge-blue">{selSubj}</span>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-[12px] font-semibold text-[#6b7280] mb-1.5 block">{t("topicLabel")}</label>
          <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder={t("topicPlaceholder")}
            className="input-field resize-none leading-relaxed" rows={4} />
          {topic.length > 0 && (
            <div className="flex justify-end mt-1"><div className="text-[10px] text-[#9ca3af] tabular">{topic.length}</div></div>
          )}
        </div>
        <div>
          <label className="text-[12px] font-semibold text-[#6b7280] mb-1.5 block">{t("reportLength")}</label>
          <div className="flex gap-1.5 p-1 rounded-[14px]" style={{ background: "rgba(0,0,0,0.03)" }}>
            {LENGTH_OPTIONS.map(opt => (
              <motion.button key={opt.id} whileTap={{ scale: 0.96 }}
                onClick={() => { hapticSelection(); setLength(opt.id); }}
                className="flex-1 py-2.5 rounded-[10px] text-center transition-all relative"
                style={{
                  color: length === opt.id ? "#1a1a2e" : "#9ca3af",
                  background: length === opt.id ? "white" : "transparent",
                  boxShadow: length === opt.id ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                }}>
                <div className="text-[11px] font-bold">{opt.label}</div>
                <div className="text-[9px] mt-0.5" style={{ color: length === opt.id ? "#7C5CFC" : "#b0b0c0" }}>{opt.desc}</div>
                <div className="text-[9px] font-bold mt-1" style={{ color: length === opt.id ? "#10B981" : "#c4c4d0" }}>
                  {user && !user.freeReportsUsed ? "🎁 Free" : `💎 ${opt.cost}`}
                </div>
              </motion.button>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-2 px-1">
            <div className="flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span className="text-[10px] text-[#9ca3af] font-medium">{t("estimatedTime")}: ~{selectedLength.time} {t("seconds")}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/></svg>
              <span className="text-[10px] text-[#9ca3af] font-medium">~{selectedLength.words.toLocaleString()} {t("estimatedWords")}</span>
            </div>
          </div>
        </div>
        <div>
          <label className="text-[12px] font-semibold text-[#6b7280] mb-1.5 block">{t("groupLabel")}</label>
          <input value={group} onChange={e => setGroup(e.target.value)} placeholder={t("groupPlaceholder")} className="input-field" />
        </div>
        <div>
          <label className="text-[12px] font-semibold text-[#6b7280] mb-1.5 block">{t("attachPhoto")}</label>
          <AnimatePresence mode="wait">
            {imagePreview ? (
              <motion.div key="preview" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                className="rounded-[14px] overflow-hidden relative border" style={{ borderColor: "rgba(124,92,252,0.15)" }}>
                <img src={imagePreview} alt="Task" className="w-full max-h-[180px] object-contain rounded-[14px]" style={{ background: "#f9fafb" }} />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-3 py-2"
                  style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.6))" }}>
                  <div className="flex items-center gap-1.5">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00C48C" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    <span className="text-[10px] font-semibold text-white/90">{t("photoAttached")}</span>
                  </div>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={removeImage}
                    className="px-2.5 py-1 rounded-[8px] text-[10px] font-semibold text-white/80"
                    style={{ background: "rgba(255,255,255,0.15)" }}>
                    {t("removePhoto")}
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.label key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-2 py-5 rounded-[14px] cursor-pointer transition-all active:scale-[0.98]"
                style={{ background: "rgba(124,92,252,0.03)", border: "1.5px dashed rgba(124,92,252,0.15)" }}>
                <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: "rgba(124,92,252,0.06)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="1.5">
                    <rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-[12px] font-semibold text-[#7C5CFC]">{t("attachPhoto")}</div>
                  <div className="text-[10px] text-[#9ca3af] mt-0.5">{t("attachPhotoDesc")}</div>
                  <div className="text-[9px] text-[#c4c4d0] mt-0.5">{t("maxFileSize")}</div>
                </div>
              </motion.label>
            )}
          </AnimatePresence>
        </div>
      </div>
      {!canGenerate && user?.freeReportsUsed && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="mt-3.5 rounded-[14px] p-3 text-[12px] flex items-center gap-2.5"
          style={{ background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.1)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <span className="text-[#FF6B6B]">{t("noBalance")} (💎 {currentCost}). <button onClick={() => setLocation("/balance")} className="underline font-semibold">{t("topUpBalance")}</button></span>
        </motion.div>
      )}
      <motion.button whileTap={{ scale: 0.97 }} onClick={handleGenerate} disabled={!topic.trim() || !canGenerate}
        className="mt-4 w-full py-[16px] rounded-[18px] text-[15px] font-bold flex items-center justify-center gap-2.5 disabled:opacity-30"
        style={{
          background: (!topic.trim() || !canGenerate) ? "rgba(42,171,238,0.3)" : "linear-gradient(145deg, #2AABEE 0%, #229ED9 100%)",
          color: "white",
          boxShadow: (!topic.trim() || !canGenerate) ? "none" : "0 10px 30px rgba(42,171,238,0.35), 0 2px 6px rgba(0,0,0,0.06)",
        }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
        </svg>
        {t("generate")} {user && !user.freeReportsUsed ? "🎁" : `· 💎 ${currentCost}`}
      </motion.button>
    </motion.div>
  );
}
