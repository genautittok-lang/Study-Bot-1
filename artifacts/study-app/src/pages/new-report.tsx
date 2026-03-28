import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useUser, setUser, useLang } from "@/lib/store";
import { generateReport } from "@/lib/api";
import { getReportTypes, getSubjectCategories, getSubjectName, getEduLevels, getCategoryEduLevel, t } from "@/lib/i18n";
import type { EduLevel } from "@/lib/i18n";
import { hapticFeedback, hapticSuccess, hapticError } from "@/lib/telegram";
import { motion, AnimatePresence } from "framer-motion";
import MarkdownRenderer from "@/components/markdown-renderer";

type Step = "type" | "category" | "subject" | "details" | "generating" | "done" | "error";
const STEPS = ["type", "category", "subject", "details"] as const;
const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

function StepBar({ step }: { step: Step }) {
  const idx = STEPS.indexOf(step as typeof STEPS[number]);
  if (idx < 0) return null;
  const labels = [t("chooseDocType"), t("chooseCategory"), t("chooseSubject"), t("details")];
  return (
    <div className="mb-5">
      <div className="flex items-center gap-1.5 mb-1.5">
        {STEPS.map((_, i) => (
          <div key={i} className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ background: "#e0e1e5" }}>
            <motion.div className="h-full rounded-full"
              style={{ background: i <= idx ? "linear-gradient(90deg, #7c3aed, #06b6d4)" : "transparent" }}
              initial={{ width: "0%" }} animate={{ width: i <= idx ? "100%" : "0%" }}
              transition={{ duration: 0.4, delay: i * 0.08 }} />
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        {labels.map((l, i) => (
          <span key={i} className="text-[8px] font-semibold uppercase tracking-wider"
            style={{ color: i <= idx ? "#7c3aed" : "#ccc" }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.95 }} onClick={() => { hapticFeedback("light"); onClick(); }}
      className="text-[#999] text-[13px] font-semibold mb-3 flex items-center gap-1 active:text-[#666] transition-colors">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
      {t("back")}
    </motion.button>
  );
}

function EduTabs({ value, onChange }: { value: EduLevel; onChange: (v: EduLevel) => void }) {
  const levels = getEduLevels();
  return (
    <div className="flex gap-1 mb-4 p-1 rounded-xl" style={{ background: "#e8e9ed", border: "1px solid rgba(0,0,0,0.03)" }}>
      {levels.map(lv => (
        <motion.button key={lv.id} whileTap={{ scale: 0.96 }}
          onClick={() => { hapticFeedback("light"); onChange(lv.id); }}
          className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all relative"
          style={{
            color: value === lv.id ? "#1a1b23" : "#999",
            background: value === lv.id ? "#fff" : "transparent",
            boxShadow: value === lv.id ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
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

  const canGenerate = user ? (!user.freeReportsUsed || user.balance > 0) : false;
  const TYPES = getReportTypes();
  const CATS = getSubjectCategories();

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
    try {
      const res = await generateReport({ telegramId: user.telegramId, reportType, subject, topic: topic.trim(), group: group.trim() || undefined, imageData: imageData || undefined });
      clearInterval(iv); setProgress(100);
      if (res.success && res.content) {
        hapticSuccess(); setResult(res.content);
        setUser({ ...user, balance: res.remainingBalance ?? user.balance, freeReportsUsed: true, totalReports: user.totalReports + 1 });
        setTimeout(() => setStep("done"), 400);
      } else { hapticError(); setErrorMsg(res.error === "no_balance" ? t("noBalance") : t("error")); setStep("error"); }
    } catch { clearInterval(iv); hapticError(); setErrorMsg(t("connectionError")); setStep("error"); }
  }

  function reset() { setStep("type"); setReportType(""); setCategory(""); setSubject(""); setTopic(""); setGroup(""); setResult(""); setSearchQ(""); setCopied(false); setImageData(null); setImagePreview(null); }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { hapticError(); return; }
    if (!file.type.startsWith("image/")) { hapticError(); return; }
    hapticFeedback("light");
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImageData(base64);
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function removeImage() {
    hapticFeedback("light");
    setImageData(null);
    setImagePreview(null);
  }

  if (step === "generating") {
    return (
      <div className="px-5 pt-16 pb-4 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="relative mb-6">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 rounded-full"
            style={{ border: "3px solid #e0e1e5", borderTopColor: "#7c3aed", borderRightColor: "#06b6d4" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[20px] font-extrabold tabular text-[#7c3aed]">{Math.round(progress)}%</span>
          </div>
        </div>
        <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="text-lg font-bold text-[#1a1b23] mb-1.5">{t("generating")}...</motion.h2>
        <p className="text-[12px] text-[#888] mb-6 text-center px-8">{t("generatingDesc")}</p>
        <div className="w-56 h-[3px] rounded-full overflow-hidden" style={{ background: "#e0e1e5" }}>
          <motion.div className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #7c3aed, #06b6d4, #10b981)" }}
            animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
        </div>
        <div className="mt-6 flex gap-2 flex-wrap justify-center">
          {[t("reportReport"), getSubjectName(subject)].map((tag, i) => tag && (
            <span key={i} className="badge-g text-[10px]">{tag}</span>
          ))}
        </div>
      </div>
    );
  }

  if (step === "done") {
    const selType = TYPES.find(rt => rt.id === reportType);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="px-5 pt-7 pb-4">
        <div className="hero-card rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-3.5 relative z-10">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(16,185,129,0.12)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </motion.div>
            <div className="flex-1">
              <h2 className="text-base font-bold text-white">{t("done")}</h2>
              <p className="text-[11px] text-white/40 mt-0.5">{selType?.icon} {selType?.label} · {wordCount.toLocaleString()} words</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2.5 mb-4">
          <motion.button whileTap={{ scale: 0.96 }}
            onClick={() => { navigator.clipboard.writeText(result); hapticSuccess(); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="flex-1 btn-main py-3 text-[13px] flex items-center justify-center gap-2">
            {copied ? (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>✓</>
            ) : (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>{t("copy")}</>
            )}
          </motion.button>
          <motion.button whileTap={{ scale: 0.96 }} onClick={reset}
            className="flex-1 g-card rounded-xl py-3 text-[13px] font-semibold text-[#888] hover:text-[#555] transition-colors">{t("newOne")}</motion.button>
        </div>
        <div className="g-card rounded-xl p-4 max-h-[60vh] overflow-y-auto scrollbar-hide select-text">
          <MarkdownRenderer content={result} />
        </div>
      </motion.div>
    );
  }

  if (step === "error") {
    return (
      <div className="px-5 pt-16 pb-4 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: "rgba(239,68,68,0.06)" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
        </motion.div>
        <h2 className="text-lg font-bold text-[#1a1b23] mb-1.5">{t("error")}</h2>
        <p className="text-[13px] text-[#888] text-center mb-6 px-8">{errorMsg}</p>
        <button onClick={() => setStep("details")} className="btn-main px-10 py-3 text-[13px]">{t("tryAgain")}</button>
      </div>
    );
  }

  const colors = ["#7c3aed", "#06b6d4", "#10b981", "#f59e0b", "#f97316", "#ec4899", "#6366f1", "#14b8a6", "#22c55e", "#eab308", "#f97316"];

  if (step === "type") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pt-7 pb-4">
        <h2 className="text-[22px] font-extrabold text-[#1a1b23] tracking-tight mb-0.5">{t("newDocument")}</h2>
        <p className="text-[11px] text-[#888] mb-4">{t("chooseDocType")}</p>
        <StepBar step={step} />
        <div className="grid grid-cols-2 gap-2">
          {TYPES.map((type, i) => (
            <motion.button key={type.id}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, duration: 0.25, ease }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { hapticFeedback("light"); setReportType(type.id); setStep("category"); }}
              className="g-card rounded-xl p-3 text-left">
              <span className="text-[20px] block mb-1.5">{type.icon}</span>
              <div className="font-bold text-[12px] text-[#1a1b23] leading-snug">{type.label}</div>
              <div className="text-[9px] text-[#999] mt-0.5 leading-snug">{type.desc}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  }

  if (step === "category") {
    const totalSubjects = CATS.reduce((a, c) => a + c.subjects.length, 0);
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pt-7 pb-4">
        <BackBtn onClick={() => setStep("type")} />
        <h2 className="text-[22px] font-extrabold text-[#1a1b23] tracking-tight mb-0.5">{t("chooseCategory")}</h2>
        <p className="text-[11px] text-[#888] mb-4">{totalSubjects}+ {t("allSubjects").toLowerCase()}</p>
        <StepBar step={step} />
        <EduTabs value={eduLevel} onChange={setEduLevel} />
        <AnimatePresence mode="wait">
          <motion.div key={eduLevel} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }} className="grid grid-cols-2 gap-2">
            {filteredCats.map((cat, i) => (
              <motion.button key={cat.id}
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.025, duration: 0.2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { hapticFeedback("light"); setCategory(cat.id); setStep("subject"); setSearchQ(""); }}
                className="g-card rounded-xl p-3 text-left">
                <span className="text-[22px] block mb-1.5">{cat.icon}</span>
                <div className="font-bold text-[11px] text-[#1a1b23] leading-snug">{cat.name}</div>
                <div className="text-[9px] text-[#999] mt-0.5 font-medium">{cat.subjects.length} {t("allSubjects").toLowerCase()}</div>
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pt-7 pb-4">
        <BackBtn onClick={() => setStep("category")} />
        <div className="flex items-center gap-2.5 mb-0.5">
          <span className="text-[22px]">{cat?.icon}</span>
          <h2 className="text-[20px] font-extrabold text-[#1a1b23] tracking-tight">{cat?.name}</h2>
        </div>
        <p className="text-[11px] text-[#888] mb-4">{subs.length} {t("allSubjects").toLowerCase()}</p>
        <StepBar step={step} />
        <div className="relative mb-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ccc]">
            <circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
            placeholder={t("chooseSubject")} aria-label={t("chooseSubject")} className="input-field pl-10" />
          {searchQ && (
            <button onClick={() => setSearchQ("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#ccc] hover:text-[#888] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
            </button>
          )}
        </div>
        <div className="space-y-1.5">
          {filtered.length === 0 && searchQ && (
            <div className="text-center py-8 text-[#999] text-[12px]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-2 text-[#ccc]">
                <circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/>
              </svg>
              Not found
            </div>
          )}
          {filtered.map((sub, i) => (
            <motion.button key={sub.id}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02, duration: 0.15 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { hapticFeedback("light"); setSubject(sub.id); setStep("details"); }}
              className="w-full g-card rounded-xl p-3.5 text-left flex items-center gap-3">
              <span className="text-base shrink-0">{sub.icon}</span>
              <span className="font-semibold text-[13px] text-[#1a1b23] flex-1">{sub.name}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#ccc]"><polyline points="9 18 15 12 9 6"/></svg>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  }

  const selType = TYPES.find(rt => rt.id === reportType);
  const selSubj = getSubjectName(subject);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pt-7 pb-4">
      <BackBtn onClick={() => setStep("subject")} />
      <h2 className="text-[22px] font-extrabold text-[#1a1b23] tracking-tight mb-0.5">{t("details")}</h2>
      <p className="text-[11px] text-[#888] mb-4">{t("describeTask")}</p>
      <StepBar step={step} />
      <div className="flex gap-1.5 mb-4 flex-wrap">
        <span className="badge-g">{selType?.icon} {selType?.label}</span>
        <span className="badge-g">{selSubj}</span>
      </div>
      <div className="space-y-3.5">
        <div>
          <label className="text-[12px] font-semibold text-[#666] mb-1.5 block">{t("topicLabel")}</label>
          <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder={t("topicPlaceholder")}
            className="input-field resize-none leading-relaxed" rows={4} />
          {topic.length > 0 && (
            <div className="flex justify-end mt-1">
              <div className="text-[10px] text-[#bbb] tabular">{topic.length}</div>
            </div>
          )}
        </div>
        <div>
          <label className="text-[12px] font-semibold text-[#666] mb-1.5 block">{t("groupLabel")}</label>
          <input value={group} onChange={e => setGroup(e.target.value)} placeholder={t("groupPlaceholder")} className="input-field" />
        </div>
        <div>
          <label className="text-[12px] font-semibold text-[#666] mb-1.5 block">{t("attachPhoto")}</label>
          <AnimatePresence mode="wait">
            {imagePreview ? (
              <motion.div key="preview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-xl overflow-hidden relative" style={{ border: "1px solid rgba(124,58,237,0.12)" }}>
                <img src={imagePreview} alt="Task" className="w-full max-h-[180px] object-contain rounded-xl bg-[#f5f6f8]" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-3 py-2.5"
                  style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(52,211,153,0.15)" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-400">{t("photoAttached")}</span>
                  </div>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={removeImage}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-semibold text-red-400"
                    style={{ background: "rgba(239,68,68,0.1)" }}>
                    {t("removePhoto")}
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.label key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-2.5 py-5 rounded-xl cursor-pointer transition-all active:scale-[0.98]"
                style={{ background: "rgba(124,58,237,0.03)", border: "1px dashed rgba(124,58,237,0.12)" }}>
                <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(124,58,237,0.08)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5">
                    <rect width="18" height="18" x="3" y="3" rx="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-[12px] font-semibold text-[#7c3aed]">{t("attachPhoto")}</div>
                  <div className="text-[10px] text-[#999] mt-0.5">{t("attachPhotoDesc")}</div>
                  <div className="text-[9px] text-[#bbb] mt-0.5">{t("maxFileSize")}</div>
                </div>
              </motion.label>
            )}
          </AnimatePresence>
        </div>
      </div>
      {!canGenerate && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-xl p-3.5 text-[12px] flex items-center gap-2.5"
          style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.08)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <span className="text-red-500">{t("noBalance")}. <button onClick={() => setLocation("/balance")} className="underline font-semibold">{t("topUpBalance")}</button></span>
        </motion.div>
      )}
      <motion.button whileTap={{ scale: 0.97 }} onClick={handleGenerate} disabled={!topic.trim() || !canGenerate}
        className="mt-5 w-full btn-main py-[16px] text-[14px] flex items-center justify-center gap-2 disabled:opacity-30">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
        {t("generate")}
      </motion.button>
    </motion.div>
  );
}
