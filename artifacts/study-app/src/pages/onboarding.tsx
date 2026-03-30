import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { t, setLang, getLang, LANGUAGES } from "@/lib/i18n";
import { hapticFeedback, hapticSuccess, hapticSelection } from "@/lib/telegram";

const ONBOARDING_KEY = "studyflush_onboarding_done";

export function isOnboardingDone(): boolean {
  try { return localStorage.getItem(ONBOARDING_KEY) === "1"; } catch { return false; }
}

export function markOnboardingDone(): void {
  try { localStorage.setItem(ONBOARDING_KEY, "1"); } catch {}
}

const TOP_LANGS = ["uk", "ru", "en", "kk", "uz", "pl", "de", "tr"];

function LangStep({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState(getLang());
  const [search, setSearch] = useState("");

  const topLangs = useMemo(() => LANGUAGES.filter(l => TOP_LANGS.includes(l.code)), []);
  const otherLangs = useMemo(() => LANGUAGES.filter(l => !TOP_LANGS.includes(l.code)), []);

  const filtered = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return LANGUAGES.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.nativeName.toLowerCase().includes(q) ||
      l.code.includes(q)
    );
  }, [search]);

  function pick(code: string) {
    hapticSelection();
    setSelected(code);
    setLang(code);
  }

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #F0ECFF 0%, #E8E4FF 40%, #EDF5FF 70%, #F0F8F4 100%)" }}>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center pt-12 pb-4 px-6">
        <motion.div
          className="w-[72px] h-[72px] rounded-[22px] flex items-center justify-center mb-4"
          style={{ background: "rgba(124,92,252,0.06)", border: "1.5px solid rgba(124,92,252,0.1)" }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
          <span className="text-[36px]">🌍</span>
        </motion.div>
        <h1 className="text-[24px] font-extrabold tracking-tight mb-1" style={{ color: "#1a1a2e" }}>
          Choose your language
        </h1>
        <p className="text-[13px] text-center" style={{ color: "#8b90a0" }}>
          Оберіть мову · Выберите язык
        </p>
      </motion.div>

      <div className="px-5 mb-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search language..."
            className="w-full pl-9 pr-4 py-2.5 rounded-[14px] text-[13px] outline-none"
            style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(124,92,252,0.08)", backdropFilter: "blur(20px)", color: "#1a1a2e" }}
          />
          {search && (
            <button onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] text-[16px]">
              ×
            </button>
          )}
        </motion.div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 scrollbar-hide">
        {filtered ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-2">
            {filtered.map((lang, i) => (
              <LangCard key={lang.code} lang={lang} selected={selected === lang.code} onPick={pick} delay={i * 0.03} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-2 text-center py-8 text-[13px] text-[#9ca3af]">No languages found</div>
            )}
          </motion.div>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="mb-3">
              <span className="text-[10px] font-bold text-[#8b90a0] uppercase tracking-[0.08em] px-1">Popular</span>
            </motion.div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {topLangs.map((lang, i) => (
                <LangCard key={lang.code} lang={lang} selected={selected === lang.code} onPick={pick} delay={0.3 + i * 0.04} />
              ))}
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="mb-3">
              <span className="text-[10px] font-bold text-[#8b90a0] uppercase tracking-[0.08em] px-1">All languages</span>
            </motion.div>
            <div className="grid grid-cols-2 gap-2">
              {otherLangs.map((lang, i) => (
                <LangCard key={lang.code} lang={lang} selected={selected === lang.code} onPick={pick} delay={0.65 + i * 0.02} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="px-5 pb-8 pt-3" style={{ background: "linear-gradient(to top, rgba(240,236,255,0.95) 60%, transparent)" }}>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => { hapticFeedback("medium"); onNext(); }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full py-[15px] rounded-[18px] text-[15px] font-bold text-white flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(145deg, #7C5CFC, #6B4CE0)",
            boxShadow: "0 10px 30px rgba(124,92,252,0.35)",
          }}>
          {t("onboardingNext")}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </motion.button>
      </div>
    </div>
  );
}

function LangCard({ lang, selected, onPick, delay }: { lang: typeof LANGUAGES[0]; selected: boolean; onPick: (code: string) => void; delay: number }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onPick(lang.code)}
      className="flex items-center gap-2.5 px-3 py-3 rounded-[14px] text-left transition-all duration-200"
      style={{
        background: selected ? "rgba(124,92,252,0.08)" : "rgba(255,255,255,0.6)",
        border: selected ? "1.5px solid rgba(124,92,252,0.3)" : "1.5px solid rgba(255,255,255,0.5)",
        backdropFilter: "blur(20px)",
        boxShadow: selected ? "0 4px 16px rgba(124,92,252,0.12)" : "0 2px 8px rgba(0,0,0,0.03)",
      }}>
      <span className="text-[22px] leading-none">{lang.flag}</span>
      <div className="flex flex-col min-w-0">
        <span className="text-[12px] font-bold truncate" style={{ color: selected ? "#7C5CFC" : "#1a1a2e" }}>
          {lang.nativeName}
        </span>
        <span className="text-[10px] truncate" style={{ color: "#9ca3af" }}>
          {lang.name}
        </span>
      </div>
      {selected && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
          className="ml-auto w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "#7C5CFC" }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
        </motion.div>
      )}
    </motion.button>
  );
}

const slides = () => [
  {
    icon: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="url(#og1)" strokeWidth="1.2">
        <defs><linearGradient id="og1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#7C5CFC"/><stop offset="100%" stopColor="#3B82F6"/></linearGradient></defs>
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
      </svg>
    ),
    title: t("onboarding1Title"),
    desc: t("onboarding1Desc"),
    bg: "linear-gradient(160deg, #F0ECFF 0%, #E8E4FF 50%, #EDF5FF 100%)",
    accent: "#7C5CFC",
  },
  {
    icon: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="url(#og2)" strokeWidth="1.2">
        <defs><linearGradient id="og2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3B82F6"/><stop offset="100%" stopColor="#06D6A0"/></linearGradient></defs>
        <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9"/>
        <path d="M8 12h.01M12 12h.01M16 12h.01"/>
      </svg>
    ),
    title: t("onboarding2Title"),
    desc: t("onboarding2Desc"),
    bg: "linear-gradient(160deg, #E8F4FD 0%, #E0F7FA 50%, #E8FFE8 100%)",
    accent: "#3B82F6",
  },
  {
    icon: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="url(#og3)" strokeWidth="1.2">
        <defs><linearGradient id="og3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#10B981"/><stop offset="100%" stopColor="#06D6A0"/></linearGradient></defs>
        <path d="M12 3v3m6.36-.64-2.12 2.12M21 12h-3m.64 6.36-2.12-2.12M12 21v-3m-6.36.64 2.12-2.12M3 12h3m-.64-6.36 2.12 2.12"/>
        <circle cx="12" cy="12" r="4"/>
      </svg>
    ),
    title: t("onboarding3Title"),
    desc: t("onboarding3Desc"),
    bg: "linear-gradient(160deg, #E6FFF5 0%, #E0FFF0 50%, #F0FFEA 100%)",
    accent: "#10B981",
  },
];

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<"lang" | "slides">("lang");
  const [idx, setIdx] = useState(0);
  const data = slides();

  function next() {
    hapticFeedback("light");
    if (idx < data.length - 1) setIdx(idx + 1);
    else finish();
  }

  function finish() {
    hapticSuccess();
    markOnboardingDone();
    onDone();
  }

  if (step === "lang") {
    return <LangStep onNext={() => { hapticFeedback("medium"); setStep("slides"); }} />;
  }

  const slide = data[idx];
  const isLast = idx === data.length - 1;

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden" style={{ background: slide.bg }}>
      <div className="flex justify-end px-5 pt-5">
        {!isLast && (
          <motion.button whileTap={{ scale: 0.95 }} onClick={finish}
            className="text-[12px] font-semibold px-4 py-1.5 rounded-full"
            style={{ color: "#9ca3af", background: "rgba(0,0,0,0.04)" }}>
            {t("onboardingSkip")}
          </motion.button>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div key={idx}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center text-center">
            <motion.div
              className="w-[140px] h-[140px] rounded-[40px] flex items-center justify-center mb-10"
              style={{ background: `${slide.accent}08`, border: `1.5px solid ${slide.accent}15` }}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                {slide.icon}
              </motion.div>
            </motion.div>

            <h1 className="text-[26px] font-extrabold tracking-tight leading-tight mb-3" style={{ color: "#1a1a2e" }}>
              {slide.title}
            </h1>
            <p className="text-[14px] leading-relaxed max-w-[300px]" style={{ color: "#6b7280" }}>
              {slide.desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-6 pb-10">
        <div className="flex items-center justify-center gap-2 mb-6">
          {data.map((_, i) => (
            <motion.div key={i}
              animate={{ width: i === idx ? 24 : 8, background: i === idx ? slide.accent : "rgba(0,0,0,0.1)" }}
              className="h-[6px] rounded-full"
              transition={{ duration: 0.3 }} />
          ))}
        </div>

        <motion.button whileTap={{ scale: 0.96 }} onClick={next}
          className="w-full py-[16px] rounded-[18px] text-[16px] font-bold text-white flex items-center justify-center gap-2"
          style={{
            background: `linear-gradient(145deg, ${slide.accent}, ${slide.accent}DD)`,
            boxShadow: `0 10px 30px ${slide.accent}40`,
          }}>
          {isLast ? (
            <>{t("onboardingStart")} <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg></>
          ) : (
            <>{t("onboardingNext")} <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg></>
          )}
        </motion.button>

        {isLast && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-3 mt-4">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold" style={{ color: slide.accent }}>10,000+</span>
              <span className="text-[10px] text-[#9ca3af]">{t("studentsUsing")}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[#d1d5db]" />
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold" style={{ color: slide.accent }}>4.8 ⭐</span>
              <span className="text-[10px] text-[#9ca3af]">{t("avgRating")}</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
