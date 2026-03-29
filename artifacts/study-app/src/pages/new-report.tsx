import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { useUser, setUser, useLang, addRecentItem, saveLastResult, getLastResult, clearLastResult } from "@/lib/store";
import { generateReport, improveText, getStructurePreview } from "@/lib/api";
import { getReportTypes, getSubjectCategories, getSubjectName, getEduLevels, getCategoryEduLevel, t, getLang } from "@/lib/i18n";
import type { EduLevel } from "@/lib/i18n";
import { hapticFeedback, hapticSuccess, hapticError, hapticSelection, shareViaTelegram, useBackButton } from "@/lib/telegram";
import { motion, AnimatePresence } from "framer-motion";
import MarkdownRenderer from "@/components/markdown-renderer";
import Icon3D, { REPORT_ICON_MAP } from "@/components/icons-3d";

type Step = "type" | "freeform" | "category" | "subject" | "details" | "structure" | "generating" | "done" | "error";
const STEPS = ["type", "category", "subject", "details"] as const;
const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const PAYWALL_KEY_PREFIX = "studyflush_paywall_shown_";
function wasPaywallShown(userId?: number): boolean {
  try { return localStorage.getItem(PAYWALL_KEY_PREFIX + (userId || "0")) === "1"; } catch { return false; }
}
function markPaywallShown(userId?: number): void {
  try { localStorage.setItem(PAYWALL_KEY_PREFIX + (userId || "0"), "1"); } catch {}
}

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

function PaywallModal({ onClose, onBuy }: { onClose: () => void; onBuy: () => void }) {
  const [timer, setTimer] = useState(600);
  useEffect(() => {
    const iv = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(iv);
  }, []);
  const min = Math.floor(timer / 60);
  const sec = timer % 60;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)" }}>
      <motion.div initial={{ scale: 0.85, y: 30 }} animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.3 }}
        className="mx-5 w-full max-w-[360px] rounded-[28px] overflow-hidden"
        style={{ background: "white", boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}>
        <div className="relative p-6 text-center"
          style={{ background: "linear-gradient(145deg, #8B6CFF, #6336F5)" }}>
          <div className="absolute top-0 right-0 w-36 h-36 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, white 0%, transparent 70%)", transform: "translate(25%, -35%)" }} />
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
            className="text-[48px] mb-3">🎉</motion.div>
          <h2 className="text-[22px] font-extrabold text-white mb-1">{t("wantMore")}</h2>
          <p className="text-[13px] text-white/60">{t("firstPurchaseOffer")}</p>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-center gap-2 mb-4 py-2.5 rounded-[14px]"
            style={{ background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.1)" }}>
            <span className="text-[12px] font-bold text-[#FF6B6B]">{t("limitedOffer")}</span>
            <span className="text-[14px] font-extrabold text-[#FF6B6B] tabular">{min}:{sec.toString().padStart(2, "0")}</span>
          </div>

          <div className="space-y-2 mb-4">
            {[
              { label: "30 reports", price: "250 UAH", sale: "125 UAH", tag: "-50%" },
            ].map((pkg, i) => (
              <motion.button key={i} whileTap={{ scale: 0.97 }} onClick={onBuy}
                className="w-full card-3d rounded-[18px] p-4 text-left flex items-center gap-3 relative overflow-hidden"
                style={{ borderColor: "rgba(124,92,252,0.15)" }}>
                <div className="absolute top-0 right-0 px-2.5 py-1 rounded-bl-[12px] text-[9px] font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #FF6B6B, #FF4757)" }}>{pkg.tag}</div>
                <div className="w-11 h-11 rounded-[14px] flex items-center justify-center"
                  style={{ background: "rgba(124,92,252,0.06)" }}>
                  <span className="text-[18px]">💎</span>
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-bold">{pkg.label}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[12px] text-[#9ca3af] line-through">{pkg.price}</span>
                    <span className="text-[14px] font-extrabold text-[#7C5CFC]">{pkg.sale}</span>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </motion.button>
            ))}
          </div>

          <motion.button whileTap={{ scale: 0.97 }} onClick={onClose}
            className="w-full py-3 rounded-[14px] text-[13px] font-semibold text-[#9ca3af] text-center"
            style={{ background: "rgba(0,0,0,0.03)" }}>
            {t("maybeLater")}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function NewReport() {
  const user = useUser();
  const [, setLocation] = useLocation();
  useLang();

  const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const prefillType = urlParams.get("type") || "";
  const prefillSubject = urlParams.get("subject") || "";

  const savedResult = useMemo(() => getLastResult(), []);

  const [step, setStep] = useState<Step>(() => {
    if (savedResult) return "done";
    if (prefillType === "freeform") return "freeform";
    if (prefillType && prefillSubject) return "details";
    if (prefillType) return "category";
    return "type";
  });
  const [reportType, setReportType] = useState(savedResult?.reportType || prefillType);
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState(savedResult?.subject || (prefillType === "freeform" ? "any" : prefillSubject));
  const [topic, setTopic] = useState(savedResult?.topic || "");
  const [group, setGroup] = useState("");
  const [result, setResult] = useState(savedResult?.result || "");
  const [errorMsg, setErrorMsg] = useState("");
  const [progress, setProgress] = useState(0);
  const [wordCount, setWordCount] = useState(savedResult?.wordCount || 0);
  const [searchQ, setSearchQ] = useState("");
  const [eduLevel, setEduLevel] = useState<EduLevel>("all");
  const [copied, setCopied] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [length, setLength] = useState<"short" | "medium" | "full">("medium");
  const [typingDone, setTypingDone] = useState(!!savedResult);
  const [displayedResult, setDisplayedResult] = useState(savedResult?.result || "");
  const typingRef = useRef<number | null>(null);
  const [improving, setImproving] = useState(false);
  const [structureText, setStructureText] = useState("");
  const [structureLoading, setStructureLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showFormatPicker, setShowFormatPicker] = useState(false);
  const [genStartTime, setGenStartTime] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [finalGenTime, setFinalGenTime] = useState(savedResult?.finalGenTime || 0);

  useEffect(() => {
    if (step !== "generating" || !genStartTime) return;
    const iv = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - genStartTime) / 1000));
    }, 1000);
    return () => clearInterval(iv);
  }, [step, genStartTime]);

  const isFreeform = reportType === "freeform";
  const FREEFORM_TYPE = { id: "freeform", label: t("anyTask"), icon: "✨", desc: "" };
  const getTypeMeta = () => TYPES.find(rt => rt.id === reportType) || (isFreeform ? FREEFORM_TYPE : undefined);

  useBackButton(() => {
    if (showPaywall) { setShowPaywall(false); return; }
    if (showFormatPicker) { setShowFormatPicker(false); return; }
    if (step === "done" || step === "error") { reset(); }
    else if (step === "generating") { /* don't interrupt */ }
    else if (step === "structure") { setStep(isFreeform ? "freeform" : "details"); }
    else if (step === "freeform") { setStep("type"); }
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

  useEffect(() => {
    if (step !== "done" || !result || typingDone) return;
    let idx = 0;
    const len = result.length;
    const speed = Math.max(1, Math.floor(len / 300));
    typingRef.current = window.setInterval(() => {
      idx += speed;
      if (idx >= len) {
        idx = len;
        setDisplayedResult(result);
        setTypingDone(true);
        if (typingRef.current) clearInterval(typingRef.current);
      } else {
        setDisplayedResult(result.substring(0, idx));
      }
    }, 8);
    return () => { if (typingRef.current) clearInterval(typingRef.current); };
  }, [step, result, typingDone]);

  function skipTyping() {
    if (typingRef.current) clearInterval(typingRef.current);
    setDisplayedResult(result);
    setTypingDone(true);
  }

  async function handleStructurePreview() {
    if (!topic.trim()) return;
    setStructureLoading(true);
    setStep("structure");
    hapticFeedback("medium");
    try {
      const res = await getStructurePreview({ reportType, subject, topic: topic.trim(), language: getLang() });
      if (res.success && res.structure) {
        setStructureText(res.structure);
      } else {
        setStructureText(`${t("planIntro")}\n${t("planMain")}\n${t("planConclusion")}`);
      }
    } catch {
      setStructureText(`${t("planIntro")}\n${t("planMain")}\n${t("planConclusion")}`);
    } finally {
      setStructureLoading(false);
    }
  }

  async function handleGenerate() {
    if (!user || !topic.trim()) return;
    if (!canGenerate) { hapticError(); setLocation("/balance"); return; }
    setStep("generating"); setProgress(0); hapticFeedback("medium");
    setTypingDone(false); setDisplayedResult("");
    const startTs = Date.now(); setGenStartTime(startTs); setElapsedSeconds(0);
    const iv = setInterval(() => { setProgress(p => Math.min(p + Math.random() * 5 + 1.5, 92)); }, 700);

    const lengthHint = length === "short" ? " (short, ~500 words)" : length === "full" ? " (detailed, ~3000 words)" : "";
    const fullTopic = topic.trim() + lengthHint;

    try {
      const res = await generateReport({ telegramId: user.telegramId, reportType, subject, topic: fullTopic, group: group.trim() || undefined, imageData: imageData || undefined, language: getLang(), cost: currentCost });
      clearInterval(iv); setProgress(100);
      setFinalGenTime(Math.round((Date.now() - startTs) / 1000));
      if (res.success && res.content) {
        hapticSuccess(); setResult(res.content);
        const genTime = Math.round((Date.now() - startTs) / 1000);
        const wc = res.content.split(/\s+/).filter(Boolean).length;
        const wasFree = !user.freeReportsUsed;
        setUser({ ...user, balance: res.remainingBalance ?? user.balance, freeReportsUsed: true, totalReports: user.totalReports + 1 });
        const rType = getTypeMeta();
        addRecentItem({ reportType, subject, subjectName: getSubjectName(subject), typeName: rType?.label || reportType, typeIcon: rType?.icon || "📄" });
        saveLastResult({ result: res.content, reportType, subject, topic: topic.trim(), wordCount: wc, finalGenTime: genTime, ts: Date.now() });
        setTimeout(() => {
          setStep("done");
          if (wasFree && !wasPaywallShown(user.telegramId)) {
            setTimeout(() => { setShowPaywall(true); markPaywallShown(user.telegramId); }, 2000);
          }
        }, 400);
      } else { hapticError(); setErrorMsg(res.error === "no_balance" ? t("noBalance") : t("error")); setStep("error"); }
    } catch { clearInterval(iv); hapticError(); setErrorMsg(t("connectionError")); setStep("error"); }
  }

  async function handleImprove(action: "rephrase" | "harder" | "simpler" | "humanize") {
    if (!result || improving) return;
    setImproving(true);
    hapticFeedback("medium");
    try {
      const res = await improveText({ content: result, action, language: getLang() });
      if (res.success && res.content) {
        hapticSuccess();
        setResult(res.content);
        setDisplayedResult(res.content);
        setTypingDone(true);
        const newWc = res.content.split(/\s+/).filter(Boolean).length;
        setWordCount(newWc);
        saveLastResult({ result: res.content, reportType, subject, topic, wordCount: newWc, finalGenTime, ts: Date.now() });
      }
    } catch {} finally {
      setImproving(false);
    }
  }

  function shareResult() {
    const selType = getTypeMeta();
    const preview = result.substring(0, 300).replace(/[#*_]/g, "") + "...";
    shareViaTelegram(`${selType?.icon} ${selType?.label}: ${topic.trim()}\n\n${preview}\n\n${t("shareText")}`);
  }

  function copyAsPost() {
    const selType = getTypeMeta();
    const preview = result.substring(0, 200).replace(/[#*_]/g, "");
    const post = `${selType?.icon} ${selType?.label}: ${topic.trim()}\n\n${preview}...\n\n🤖 Generated with StudyFlush`;
    navigator.clipboard.writeText(post).then(() => { hapticSuccess(); setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => {});
  }

  function downloadResult(format: "txt" | "md" | "html" = "txt") {
    hapticSuccess();
    setShowFormatPicker(false);
    const selType = getTypeMeta();
    const baseName = `${selType?.label || "document"} — ${topic.trim().substring(0, 40)}`.replace(/[/\\?%*:|"<>]/g, "_");

    let content = result;
    let mimeType = "text/plain;charset=utf-8";
    let ext = ".txt";

    if (format === "md") {
      ext = ".md";
      mimeType = "text/markdown;charset=utf-8";
    } else if (format === "html") {
      ext = ".html";
      mimeType = "text/html;charset=utf-8";
      content = `<!DOCTYPE html>
<html lang="${getLang()}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(selType?.label || "Document")} — ${escapeHtml(topic.trim().substring(0, 60))}</title>
<style>
body { font-family: 'Inter', -apple-system, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 24px; color: #1a1a2e; line-height: 1.8; }
h1 { font-size: 24px; font-weight: 900; margin: 32px 0 16px; }
h2 { font-size: 20px; font-weight: 800; margin: 28px 0 12px; border-bottom: 2px solid #7C5CFC20; padding-bottom: 8px; }
h3 { font-size: 17px; font-weight: 700; margin: 20px 0 8px; }
p { margin: 0 0 14px; color: #4a4a6a; }
ul, ol { padding-left: 20px; margin: 12px 0; }
li { margin: 6px 0; color: #4a4a6a; }
table { width: 100%; border-collapse: collapse; margin: 16px 0; }
th { background: #7C5CFC10; padding: 12px 16px; text-align: left; font-weight: 700; border: 1px solid #7C5CFC20; }
td { padding: 10px 16px; border: 1px solid #eee; }
blockquote { margin: 12px 0; padding: 12px 16px; border-left: 3px solid #7C5CFC; background: #7C5CFC08; border-radius: 0 8px 8px 0; }
code { font-family: 'SF Mono', monospace; padding: 2px 6px; background: #7C5CFC08; border-radius: 4px; font-size: 13px; }
pre { background: #1e1e2e; color: #e2e8f0; padding: 16px; border-radius: 12px; overflow-x: auto; }
.footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #eee; color: #9ca3af; font-size: 12px; text-align: center; }
</style>
</head>
<body>
${markdownToHtml(result)}
<div class="footer">Generated with StudyFlush</div>
</body>
</html>`;
    } else {
      content = result.replace(/#{1,6}\s/g, "").replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").replace(/`(.*?)`/g, "$1");
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = baseName + ext;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function escapeHtml(str: string): string {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function markdownToHtml(md: string): string {
    const safe = escapeHtml(md);
    return safe
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/^\- (.*$)/gm, "<li>$1</li>")
      .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
      .replace(/&gt; (.*$)/gm, "<blockquote><p>$1</p></blockquote>")
      .replace(/\n{2,}/g, "</p><p>")
      .replace(/^(?!<[hlubo])/gm, (line) => line ? `<p>${line}</p>` : "")
      .replace(/<p><\/p>/g, "");
  }

  function reset() { clearLastResult(); setStep("type"); setReportType(""); setCategory(""); setSubject(""); setTopic(""); setGroup(""); setResult(""); setSearchQ(""); setCopied(false); setImageData(null); setImagePreview(null); setLength("medium"); setTypingDone(false); setDisplayedResult(""); setStructureText(""); setShowFormatPicker(false); }

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

  if (step === "structure") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-6 pb-4">
        <BackBtn onClick={() => setStep("details")} />
        <h2 className="text-[22px] font-extrabold tracking-tight mb-0.5">{t("structurePreview")}</h2>
        <p className="text-[11px] text-[#9ca3af] mb-4">{topic.trim().substring(0, 60)}</p>

        {structureLoading ? (
          <div className="space-y-3 mb-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton h-4 rounded-[8px]" style={{ width: `${70 + Math.random() * 30}%`, opacity: 1 - i * 0.15 }} />
            ))}
          </div>
        ) : (
          <div className="card-3d rounded-[20px] p-4 mb-4 select-text">
            <MarkdownRenderer content={structureText} />
          </div>
        )}

        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.96 }} onClick={handleGenerate}
            disabled={structureLoading}
            className="flex-1 btn-main py-[15px] text-[14px] flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
            </svg>
            {t("approveStructure")}
          </motion.button>
          <motion.button whileTap={{ scale: 0.96 }} onClick={handleStructurePreview}
            disabled={structureLoading}
            className="btn-ghost px-4 py-3 text-[12px]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
            </svg>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (step === "generating") {
    const selType = getTypeMeta();
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="flex items-center gap-1.5 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC] animate-pulse" />
          <span className="text-[13px] font-bold tabular text-[#7C5CFC]">
            {Math.floor(elapsedSeconds / 60)}:{String(elapsedSeconds % 60).padStart(2, "0")}
          </span>
          <span className="text-[11px] text-[#9ca3af]">{t("seconds")}</span>
        </motion.div>

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
    const selType = getTypeMeta();
    const readTime = Math.max(1, Math.round(wordCount / 200));
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="px-4 pt-6 pb-4">
        <AnimatePresence>{showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} onBuy={() => { setShowPaywall(false); setLocation("/balance"); }} />}</AnimatePresence>

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
              { val: `${finalGenTime} ${t("seconds")}`, label: t("generatedIn") },
            ].map((s, i) => (
              <div key={i} className="flex-1 rounded-[12px] py-2 text-center" style={{ background: "rgba(255,255,255,0.12)" }}>
                <div className="text-[16px] font-extrabold text-white tabular">{s.val}</div>
                <div className="text-[8px] text-white/50 font-bold uppercase tracking-wider mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="mb-3">
          <div className="flex items-center gap-1.5 mb-2 px-0.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="2">
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
            </svg>
            <span className="text-[10px] font-bold text-[#8b90a0] uppercase tracking-[0.08em]">AI {t("rephrase").split(" ")[0]}</span>
            {improving && <div className="spinner w-3 h-3 ml-1" />}
          </div>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5 -mx-4 px-4">
            {([
              { action: "rephrase" as const, label: t("rephrase"), icon: "✏️", color: "#7C5CFC" },
              { action: "harder" as const, label: t("makeHarder"), icon: "📈", color: "#3B82F6" },
              { action: "simpler" as const, label: t("makeSimpler"), icon: "🧒", color: "#10B981" },
              { action: "humanize" as const, label: t("humanize"), icon: "🧠", color: "#F97316" },
            ]).map((btn, i) => (
              <motion.button key={i}
                initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={improving}
                onClick={() => handleImprove(btn.action)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-[12px] text-[11px] font-semibold disabled:opacity-40"
                style={{ background: `${btn.color}08`, border: `1px solid ${btn.color}15`, color: btn.color }}>
                <span className="text-[13px]">{btn.icon}</span>
                {btn.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

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

        <div className="relative mb-2">
          <div className="flex gap-2">
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => { hapticSelection(); setShowFormatPicker(!showFormatPicker); }}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="flex-1 py-3 rounded-[14px] text-[12px] font-semibold flex items-center justify-center gap-1.5"
              style={{ background: "rgba(16,185,129,0.06)", color: "#10B981", border: "1px solid rgba(16,185,129,0.1)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              {t("downloadFile")} ▾
            </motion.button>
            <motion.button whileTap={{ scale: 0.96 }} onClick={shareResult}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="flex-1 py-3 rounded-[14px] text-[12px] font-semibold flex items-center justify-center gap-1.5"
              style={{ background: "rgba(74,144,255,0.06)", color: "#3B82F6", border: "1px solid rgba(74,144,255,0.1)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
              {t("shareReport")}
            </motion.button>
          </div>
          {showFormatPicker && (
            <div className="fixed inset-0 z-10" onClick={() => setShowFormatPicker(false)} />
          )}
          <AnimatePresence>
            {showFormatPicker && (
              <motion.div key="format-picker" initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-full mt-1.5 z-20 card-3d rounded-[16px] p-2 flex gap-1.5"
                style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
                {([
                  { fmt: "txt" as const, label: "TXT", desc: t("plainText"), icon: "📄", color: "#6b7280", gradient: "linear-gradient(135deg, rgba(107,114,128,0.08), rgba(107,114,128,0.02))" },
                  { fmt: "md" as const, label: "Markdown", desc: "GitHub / Notion", icon: "📝", color: "#7C5CFC", gradient: "linear-gradient(135deg, rgba(124,92,252,0.1), rgba(59,130,246,0.04))" },
                  { fmt: "html" as const, label: "HTML", desc: t("formatted"), icon: "🌐", color: "#3B82F6", gradient: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(6,214,160,0.04))" },
                ]).map((f, i) => (
                  <motion.button key={f.fmt}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => downloadResult(f.fmt)}
                    className="flex-1 rounded-[14px] py-3 px-2.5 text-center relative overflow-hidden"
                    style={{ background: f.gradient, border: `1.5px solid ${f.color}18` }}>
                    <div className="text-[20px] mb-1.5">{f.icon}</div>
                    <div className="text-[12px] font-extrabold tracking-tight" style={{ color: f.color }}>{f.label}</div>
                    <div className="text-[9px] text-[#9ca3af] mt-0.5 font-medium">{f.desc}</div>
                    <div className="absolute top-1 right-1.5">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={f.color} strokeWidth="2" opacity="0.3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex gap-2 mb-3">
          <motion.button whileTap={{ scale: 0.96 }} onClick={copyAsPost}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="flex-1 py-3 rounded-[14px] text-[12px] font-semibold flex items-center justify-center gap-1.5"
            style={{ background: "rgba(236,72,153,0.06)", color: "#EC4899", border: "1px solid rgba(236,72,153,0.1)" }}>
            <span className="text-[11px]">📋</span>
            {t("copyAsPost")}
          </motion.button>
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => {
            hapticFeedback("medium");
            const cType = getTypeMeta();
            const cardText = `📚 ${cType?.label}: ${topic.trim()}\n📊 ${wordCount} words\n🤖 AI-generated · StudyFlush`;
            shareViaTelegram(cardText);
          }}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex-1 py-3 rounded-[14px] text-[12px] font-semibold flex items-center justify-center gap-1.5"
            style={{ background: "rgba(124,92,252,0.05)", color: "#7C5CFC", border: "1px solid rgba(124,92,252,0.08)" }}>
            <span className="text-[11px]">🎴</span>
            {t("shareAsCard")}
          </motion.button>
          <motion.button whileTap={{ scale: 0.96 }} onClick={reset}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
            className="py-3 px-4 rounded-[14px] text-[12px] font-semibold flex items-center justify-center gap-1.5"
            style={{ background: "rgba(0,0,0,0.03)", color: "#6b7280" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          </motion.button>
        </div>

        {!typingDone && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileTap={{ scale: 0.96 }}
            onClick={skipTyping}
            className="w-full mb-2 py-2 rounded-[12px] text-[11px] font-semibold text-[#9ca3af] text-center"
            style={{ background: "rgba(0,0,0,0.03)" }}>
            {t("skipTyping")} ⏭
          </motion.button>
        )}

        <div className="g-card rounded-[16px] p-4 max-h-[60vh] overflow-y-auto scrollbar-hide select-text relative">
          {!typingDone && <span className="typing-cursor" />}
          <MarkdownRenderer content={displayedResult || result} />
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
            onClick={() => { hapticFeedback("medium"); setStep(isFreeform ? "freeform" : "details"); }}
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

  if (step === "freeform") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-6 pb-4">
        <BackBtn onClick={() => { setStep("type"); setReportType(""); }} />
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-10 h-10 rounded-[14px] flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(124,92,252,0.1), rgba(59,130,246,0.08))" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="1.8">
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-[20px] font-extrabold tracking-tight leading-tight">{t("anyTask")}</h2>
            <p className="text-[11px] text-[#9ca3af]">{t("anyTaskDesc")}</p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-[12px] font-semibold text-[#6b7280] mb-1.5 block">{t("describeYourTask")}</label>
            <textarea value={topic} onChange={e => setTopic(e.target.value)}
              placeholder={t("anyTaskPlaceholder")}
              className="input-field resize-none leading-relaxed" rows={5} />
            {topic.length > 0 && (
              <div className="flex justify-end mt-1"><div className="text-[10px] text-[#9ca3af] tabular">{topic.length}</div></div>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5 -mx-4 px-4">
            {([
              { label: t("writeEssay"), prompt: t("writeEssayPrompt"), icon: "✍️" },
              { label: t("solveTask"), prompt: t("solveTaskPrompt"), icon: "🧮" },
              { label: t("writePoem"), prompt: t("writePoemPrompt"), icon: "📜" },
              { label: t("explainTopic"), prompt: t("explainTopicPrompt"), icon: "💡" },
            ]).map((hint, i) => (
              <motion.button key={i}
                initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { hapticFeedback("light"); setTopic(hint.prompt); }}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-[12px] text-[11px] font-semibold"
                style={{ background: "rgba(124,92,252,0.05)", border: "1px solid rgba(124,92,252,0.1)", color: "#7C5CFC" }}>
                <span className="text-[13px]">{hint.icon}</span>
                {hint.label}
              </motion.button>
            ))}
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
                  className="flex items-center gap-3 py-3.5 px-4 rounded-[14px] cursor-pointer transition-all active:scale-[0.98]"
                  style={{ background: "rgba(124,92,252,0.03)", border: "1.5px dashed rgba(124,92,252,0.15)" }}>
                  <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                  <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: "rgba(124,92,252,0.06)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="1.5">
                      <rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-[12px] font-semibold text-[#7C5CFC]">{t("attachPhotoAnalyze")}</div>
                    <div className="text-[9px] text-[#9ca3af] mt-0.5">{t("photoAnalyzeDesc")}</div>
                  </div>
                </motion.label>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label className="text-[12px] font-semibold text-[#6b7280] mb-1.5 block">{t("reportLength")}</label>
            <div className="flex gap-1.5 p-1 rounded-[14px]" style={{ background: "rgba(0,0,0,0.03)" }}>
              {LENGTH_OPTIONS.map(opt => (
                <motion.button key={opt.id} whileTap={{ scale: 0.96 }}
                  onClick={() => { hapticSelection(); setLength(opt.id); }}
                  className="flex-1 py-2.5 rounded-[10px] text-center transition-all"
                  style={{
                    color: length === opt.id ? "#1a1a2e" : "#9ca3af",
                    background: length === opt.id ? "white" : "transparent",
                    boxShadow: length === opt.id ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                  }}>
                  <div className="text-[11px] font-bold">{opt.label}</div>
                  <div className="text-[9px] font-bold mt-1" style={{ color: length === opt.id ? "#10B981" : "#c4c4d0" }}>
                    {user && !user.freeReportsUsed ? "🎁 Free" : `💎 ${opt.cost}`}
                  </div>
                </motion.button>
              ))}
            </div>
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

  if (step === "type") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-6 pb-4">
        <h2 className="text-[22px] font-extrabold tracking-tight mb-0.5">{t("newDocument")}</h2>
        <p className="text-[11px] text-[#9ca3af] mb-3">{t("chooseDocType")}</p>

        <motion.button
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { hapticFeedback("medium"); setReportType("freeform"); setSubject("any"); setStep("freeform"); }}
          className="w-full rounded-[20px] p-4 mb-3 text-left relative overflow-hidden"
          style={{
            background: "linear-gradient(145deg, rgba(124,92,252,0.06), rgba(59,130,246,0.04))",
            border: "1.5px solid rgba(124,92,252,0.12)",
          }}>
          <div className="absolute top-0 right-0 w-28 h-28 rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, rgba(124,92,252,0.15) 0%, transparent 70%)", transform: "translate(30%, -40%)" }} />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #7C5CFC, #3B82F6)", boxShadow: "0 4px 12px rgba(124,92,252,0.3)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-extrabold leading-tight">{t("anyTask")}</div>
              <div className="text-[11px] text-[#9ca3af] mt-0.5 leading-snug">{t("anyTaskShort")}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </motion.button>

        <div className="flex items-center gap-2 mb-2.5 px-0.5">
          <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.06)" }} />
          <span className="text-[9px] font-semibold text-[#c4c4d0] uppercase tracking-wider">{t("orChooseType")}</span>
          <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.06)" }} />
        </div>

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

  const selType = getTypeMeta();
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
      <div className="flex gap-2 mt-4">
        <motion.button whileTap={{ scale: 0.97 }} onClick={handleStructurePreview} disabled={!topic.trim()}
          className="py-[16px] px-5 rounded-[18px] text-[13px] font-bold flex items-center justify-center gap-2 disabled:opacity-30"
          style={{ background: "rgba(124,92,252,0.06)", color: "#7C5CFC", border: "1px solid rgba(124,92,252,0.1)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          {t("structurePreview")}
        </motion.button>
        <motion.button whileTap={{ scale: 0.97 }} onClick={handleGenerate} disabled={!topic.trim() || !canGenerate}
          className="flex-1 py-[16px] rounded-[18px] text-[15px] font-bold flex items-center justify-center gap-2.5 disabled:opacity-30"
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
      </div>
    </motion.div>
  );
}
