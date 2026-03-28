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
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        {STEPS.map((_, i) => (
          <div key={i} className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
            <motion.div className="h-full rounded-full"
              style={{ background: i <= idx ? "linear-gradient(90deg, #7c3aed, #06b6d4)" : "transparent" }}
              initial={{ width: "0%" }} animate={{ width: i <= idx ? "100%" : "0%" }}
              transition={{ duration: 0.4, delay: i * 0.08 }} />
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        {labels.map((l, i) => (
          <span key={i} className="text-[9px] font-semibold uppercase tracking-wider"
            style={{ color: i <= idx ? "rgba(139,92,246,0.7)" : "rgba(255,255,255,0.1)" }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.95 }} onClick={() => { hapticFeedback("light"); onClick(); }}
      className="text-white/25 text-[14px] font-bold mb-4 flex items-center gap-1.5 active:text-white/60 transition-colors">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
      {t("back")}
    </motion.button>
  );
}

function EduTabs({ value, onChange }: { value: EduLevel; onChange: (v: EduLevel) => void }) {
  const levels = getEduLevels();
  return (
    <div className="flex gap-1.5 mb-5 p-1 rounded-2xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
      {levels.map(lv => (
        <motion.button key={lv.id} whileTap={{ scale: 0.96 }}
          onClick={() => { hapticFeedback("light"); onChange(lv.id); }}
          className="flex-1 py-2 rounded-xl text-[12px] font-bold transition-all relative"
          style={{
            color: value === lv.id ? "#fff" : "rgba(255,255,255,0.25)",
            background: value === lv.id ? "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(6,182,212,0.15))" : "transparent",
            border: value === lv.id ? "1px solid rgba(124,58,237,0.2)" : "1px solid transparent",
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
        <div className="relative mb-8">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-28 h-28 rounded-full"
            style={{ border: "3px solid rgba(255,255,255,0.03)", borderTopColor: "#7c3aed", borderRightColor: "#06b6d4" }} />
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-[22px] font-black tabular num-glow">{Math.round(progress)}%</span>
          </div>
        </div>
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold text-white mb-2">{t("generating")}...</motion.h2>
        <p className="text-[13px] text-white/20 mb-8 text-center px-6">{t("generatingDesc")}</p>
        <div className="w-64 h-[4px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
          <motion.div className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #7c3aed, #06b6d4, #34d399)" }}
            animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
        </div>
        <div className="mt-8 flex gap-3 flex-wrap justify-center">
          {[t("reportReport"), getSubjectName(subject)].map((tag, i) => tag && (
            <span key={i} className="badge-g text-[11px]">{tag}</span>
          ))}
        </div>
      </div>
    );
  }

  if (step === "done") {
    const selType = TYPES.find(rt => rt.id === reportType);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="px-5 pt-8 pb-4">
        <div className="hero-card rounded-3xl p-5 mb-5">
          <div className="flex items-center gap-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </motion.div>
            <div className="flex-1">
              <h2 className="text-lg font-black text-white">{t("done")}</h2>
              <p className="text-[12px] text-white/30 mt-0.5">{selType?.icon} {selType?.label} · {wordCount.toLocaleString()} words</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mb-5">
          <motion.button whileTap={{ scale: 0.96 }}
            onClick={() => { navigator.clipboard.writeText(result); hapticSuccess(); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="flex-1 btn-main py-3.5 text-[14px] flex items-center justify-center gap-2">
            {copied ? (
              <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>✓</>
            ) : (
              <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>{t("copy")}</>
            )}
          </motion.button>
          <motion.button whileTap={{ scale: 0.96 }} onClick={reset}
            className="flex-1 g-card rounded-2xl py-3.5 text-[14px] font-bold text-white/60 hover:text-white transition-colors">{t("newOne")}</motion.button>
        </div>
        <div className="g-card-s rounded-2xl p-5 max-h-[60vh] overflow-y-auto scrollbar-hide select-text">
          <MarkdownRenderer content={result} />
        </div>
      </motion.div>
    );
  }

  if (step === "error") {
    return (
      <div className="px-5 pt-16 pb-4 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
          style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.1)" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
        </motion.div>
        <h2 className="text-xl font-bold text-white mb-2">{t("error")}</h2>
        <p className="text-[14px] text-white/25 text-center mb-8 px-8">{errorMsg}</p>
        <button onClick={() => setStep("details")} className="btn-main px-10 py-3.5 text-[14px]">{t("tryAgain")}</button>
      </div>
    );
  }

  const colors = ["#a78bfa", "#67e8f9", "#34d399", "#fbbf24", "#f97316", "#f472b6", "#818cf8", "#22d3ee", "#4ade80", "#facc15", "#fb923c"];

  if (step === "type") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pt-8 pb-4">
        <h2 className="text-[28px] font-black text-white tracking-tight mb-1">{t("newDocument")}</h2>
        <p className="text-[13px] text-white/20 mb-5">{t("chooseDocType")}</p>
        <StepBar step={step} />
        <div className="grid grid-cols-2 gap-2.5">
          {TYPES.map((type, i) => (
            <motion.button key={type.id}
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, duration: 0.3, ease }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { hapticFeedback("light"); setReportType(type.id); setStep("category"); }}
              className="g-card rounded-2xl p-3.5 text-left relative overflow-hidden group">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px]"
                style={{ background: `linear-gradient(90deg, transparent, ${colors[i % 11]}30, transparent)` }} />
              <span className="text-[24px] block mb-2">{type.icon}</span>
              <div className="font-black text-[13px] text-white leading-snug">{type.label}</div>
              <div className="text-[10px] text-white/15 mt-1 leading-snug">{type.desc}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  }

  if (step === "category") {
    const totalSubjects = CATS.reduce((a, c) => a + c.subjects.length, 0);
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pt-8 pb-4">
        <BackBtn onClick={() => setStep("type")} />
        <h2 className="text-[26px] font-black text-white tracking-tight mb-1">{t("chooseCategory")}</h2>
        <p className="text-[13px] text-white/20 mb-4">{totalSubjects}+ {t("allSubjects").toLowerCase()}</p>
        <StepBar step={step} />
        <EduTabs value={eduLevel} onChange={setEduLevel} />
        <AnimatePresence mode="wait">
          <motion.div key={eduLevel} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }} className="grid grid-cols-2 gap-2.5">
            {filteredCats.map((cat, i) => (
              <motion.button key={cat.id}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { hapticFeedback("light"); setCategory(cat.id); setStep("subject"); setSearchQ(""); }}
                className="g-card rounded-2xl p-3.5 text-left relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px]"
                  style={{ background: `linear-gradient(90deg, transparent, ${colors[i % 11]}20, transparent)` }} />
                <span className="text-[26px] block mb-2">{cat.icon}</span>
                <div className="font-black text-[12px] text-white leading-snug">{cat.name}</div>
                <div className="text-[10px] text-white/15 mt-1 font-semibold">{cat.subjects.length} {t("allSubjects").toLowerCase()}</div>
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pt-8 pb-4">
        <BackBtn onClick={() => setStep("category")} />
        <div className="flex items-center gap-3 mb-1">
          <span className="text-[28px]">{cat?.icon}</span>
          <h2 className="text-[24px] font-black text-white tracking-tight">{cat?.name}</h2>
        </div>
        <p className="text-[13px] text-white/20 mb-5">{subs.length} {t("allSubjects").toLowerCase()}</p>
        <StepBar step={step} />
        <div className="relative mb-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/12">
            <circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
            placeholder={t("chooseSubject")} aria-label={t("chooseSubject")} className="input-field pl-12" />
          {searchQ && (
            <button onClick={() => setSearchQ("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/15 hover:text-white/40 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
            </button>
          )}
        </div>
        <div className="space-y-2">
          {filtered.length === 0 && searchQ && (
            <div className="text-center py-8 text-white/15 text-[13px]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 text-white/8">
                <circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/>
              </svg>
              Not found
            </div>
          )}
          {filtered.map((sub, i) => (
            <motion.button key={sub.id}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.025, duration: 0.2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { hapticFeedback("light"); setSubject(sub.id); setStep("details"); }}
              className="w-full g-card rounded-2xl p-4 text-left flex items-center gap-3.5">
              <span className="text-lg shrink-0">{sub.icon}</span>
              <span className="font-semibold text-[14px] text-white flex-1">{sub.name}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/8"><polyline points="9 18 15 12 9 6"/></svg>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  }

  const selType = TYPES.find(rt => rt.id === reportType);
  const selSubj = getSubjectName(subject);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pt-8 pb-4">
      <BackBtn onClick={() => setStep("subject")} />
      <h2 className="text-[26px] font-black text-white tracking-tight mb-1">{t("details")}</h2>
      <p className="text-[13px] text-white/20 mb-5">{t("describeTask")}</p>
      <StepBar step={step} />
      <div className="flex gap-2 mb-5 flex-wrap">
        <span className="badge-g">{selType?.icon} {selType?.label}</span>
        <span className="badge-g">{selSubj}</span>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-[13px] font-bold text-white/60 mb-2 block">{t("topicLabel")}</label>
          <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder={t("topicPlaceholder")}
            className="input-field resize-none leading-relaxed" rows={4} />
          {topic.length > 0 && (
            <div className="flex justify-between mt-1.5">
              <div />
              <div className="text-[11px] text-white/12 tabular">{topic.length}</div>
            </div>
          )}
        </div>
        <div>
          <label className="text-[13px] font-bold text-white/60 mb-2 block">{t("groupLabel")}</label>
          <input value={group} onChange={e => setGroup(e.target.value)} placeholder={t("groupPlaceholder")} className="input-field" />
        </div>
        <div>
          <label className="text-[13px] font-bold text-white/60 mb-2 block">{t("attachPhoto")}</label>
          <AnimatePresence mode="wait">
            {imagePreview ? (
              <motion.div key="preview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-2xl overflow-hidden relative" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(124,58,237,0.15)" }}>
                <img src={imagePreview} alt="Task" className="w-full max-h-[200px] object-contain rounded-2xl" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 py-3"
                  style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.8))" }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(52,211,153,0.15)" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span className="text-[12px] font-bold text-emerald-400">{t("photoAttached")}</span>
                  </div>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={removeImage}
                    className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-red-400 transition-colors"
                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.12)" }}>
                    {t("removePhoto")}
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.label key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-3 py-6 rounded-2xl cursor-pointer transition-all active:scale-[0.98]"
                style={{ background: "rgba(124,58,237,0.03)", border: "1px dashed rgba(124,58,237,0.12)" }}>
                <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(124,58,237,0.08)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.5">
                    <rect width="18" height="18" x="3" y="3" rx="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-[13px] font-bold text-violet-400">{t("attachPhoto")}</div>
                  <div className="text-[11px] text-white/20 mt-0.5">{t("attachPhotoDesc")}</div>
                  <div className="text-[10px] text-white/10 mt-1">{t("maxFileSize")}</div>
                </div>
              </motion.label>
            )}
          </AnimatePresence>
        </div>
      </div>
      {!canGenerate && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="mt-5 rounded-2xl p-4 text-[13px] flex items-center gap-3"
          style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.08)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <span className="text-red-400">{t("noBalance")}. <button onClick={() => setLocation("/balance")} className="underline font-bold">{t("topUpBalance")}</button></span>
        </motion.div>
      )}
      <motion.button whileTap={{ scale: 0.97 }} onClick={handleGenerate} disabled={!topic.trim() || !canGenerate}
        className="mt-6 w-full btn-main py-[18px] text-[15px] flex items-center justify-center gap-2.5 disabled:opacity-30">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
        {t("generate")}
      </motion.button>
    </motion.div>
  );
}
