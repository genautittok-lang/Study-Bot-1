import { useState } from "react";
import { useUser, useLang } from "@/lib/store";
import { hapticFeedback, hapticSuccess } from "@/lib/telegram";
import { t, getLang, setLang, LANGUAGES, getUserLevel, getNextLevel } from "@/lib/i18n";
import { motion } from "framer-motion";

const ease4 = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

export default function Profile() {
  const user = useUser();
  useLang();
  const [showLangs, setShowLangs] = useState(false);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);
  const currentLang = getLang();
  const currentLangObj = LANGUAGES.find(l => l.code === currentLang);

  const total = user?.totalReports || 0;
  const level = getUserLevel(total);
  const nextLvl = getNextLevel(total);
  const progress = nextLvl ? Math.min(((total - level.min) / (level.max - level.min + 1)) * 100, 100) : 100;
  const referralCode = user?.referralCode || "---";
  const referralCount = user?.referralCount || 0;
  const balance = user ? (!user.freeReportsUsed ? user.balance + 1 : user.balance) : 0;

  const achievements = [
    { icon: "1", name: t("firstReportAch"), ok: total >= 1 },
    { icon: "10", name: t("tenReportsAch"), ok: total >= 10 },
    { icon: "50", name: t("fiftyReportsAch"), ok: total >= 50 },
    { icon: "R", name: t("referralAch"), ok: referralCount >= 3 },
  ];

  function copyRef() {
    navigator.clipboard.writeText(`https://t.me/studypro_bot?start=ref_${referralCode}`);
    hapticSuccess();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 10 } as const,
    animate: { opacity: 1, y: 0 } as const,
    transition: { delay: i * 0.05, duration: 0.3, ease: ease4 },
  });

  const filteredLangs = LANGUAGES.filter(l =>
    l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  if (showLangs) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-6 pb-4">
        <motion.button whileTap={{ scale: 0.95 }}
          onClick={() => { hapticFeedback("light"); setShowLangs(false); }}
          className="text-muted-foreground text-[13px] font-medium mb-4 flex items-center gap-1 active:text-foreground transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          {t("back")}
        </motion.button>
        <h2 className="text-xl font-bold text-foreground tracking-tight mb-0.5">{t("chooseLanguage")}</h2>
        <p className="text-[13px] text-muted-foreground/60 mb-5">30 {t("language").toLowerCase()}</p>
        <div className="relative mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/25">
            <circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t("chooseLanguage")}
            aria-label={t("chooseLanguage")}
            className="input-field pl-10" />
        </div>
        <div className="space-y-1">
          {filteredLangs.map((lang, i) => {
            const active = lang.code === currentLang;
            return (
              <motion.button key={lang.code}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.012, duration: 0.15 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { hapticSuccess(); setLang(lang.code); setTimeout(() => setShowLangs(false), 150); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? "card-static" : "active:bg-muted/50"}`}
                style={active ? { borderColor: "hsl(var(--primary) / 0.15)" } : {}}>
                <span className="text-lg">{lang.flag}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium text-[13px]">{lang.nativeName}</div>
                  <div className="text-[11px] text-muted-foreground/50">{lang.name}</div>
                </div>
                {active && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-4">
      <motion.h2 {...stagger(0)} className="text-xl font-bold text-foreground tracking-tight mb-5">{t("profileTitle")}</motion.h2>

      <motion.div {...stagger(1)} className="hero-card hero-shimmer p-5 mb-5">
        <div className="relative z-10 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shadow-lg"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(235 72% 48%))" }}>
              {(user?.firstName || "S").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="text-[16px] font-bold">{user?.firstName || "Student"}</div>
              {user?.username && <div className="text-[12px] text-white/30 font-medium">@{user.username}</div>}
              <div className="text-[10px] text-white/15 mt-0.5 tabular-nums font-medium">ID: {user?.telegramId}</div>
            </div>
          </div>
          <div className="bg-white/[0.05] rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[12px] font-semibold text-white/45">{level.icon} {level.name}</span>
              {nextLvl && <span className="text-[10px] text-white/20 font-medium">{nextLvl.reportsNeeded} → {nextLvl.name}</span>}
            </div>
            <div className="w-full h-[5px] bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ delay: 0.4, duration: 0.8, ease: ease4 }}
                className="h-full progress-fill" />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div {...stagger(2)} className="grid grid-cols-3 gap-2.5 mb-5">
        <div className="card-static rounded-xl p-3.5 text-center">
          <div className="text-lg font-black text-foreground tabular-nums">{total}</div>
          <div className="text-[10px] text-muted-foreground/50 mt-0.5 font-medium">{t("total")}</div>
        </div>
        <div className="card-static rounded-xl p-3.5 text-center">
          <div className="text-lg font-black text-primary tabular-nums">{balance}</div>
          <div className="text-[10px] text-muted-foreground/50 mt-0.5 font-medium">{t("availableReports")}</div>
        </div>
        <div className="card-static rounded-xl p-3.5 text-center">
          <div className="text-lg font-black tabular-nums" style={{ color: "hsl(160 60% 40%)" }}>{referralCount}</div>
          <div className="text-[10px] text-muted-foreground/50 mt-0.5 font-medium">{t("invited")}</div>
        </div>
      </motion.div>

      <motion.div {...stagger(3)} className="mb-5">
        <span className="section-title block mb-3">{t("achievements")}</span>
        <div className="grid grid-cols-4 gap-2.5">
          {achievements.map((a, i) => (
            <div key={i} className={`card-static rounded-xl p-3 text-center transition-opacity duration-300 ${a.ok ? "" : "opacity-15"}`}>
              <div className={`w-9 h-9 mx-auto rounded-[10px] flex items-center justify-center mb-1.5 text-[12px] font-black ${a.ok ? "text-primary" : "text-muted-foreground"}`}
                style={a.ok ? { background: "hsl(var(--primary) / 0.08)" } : { background: "hsl(var(--muted))" }}>
                {a.icon}
              </div>
              <div className="text-[10px] font-semibold leading-tight">{a.name}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div {...stagger(4)} className="card-static rounded-2xl p-5 mb-5" style={{ borderColor: "hsl(160 60% 40% / 0.12)" }}>
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: "hsl(160 60% 40% / 0.06)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="hsl(160 60% 40%)" strokeWidth="1.7"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
          </div>
          <div>
            <div className="font-semibold text-[14px]">{t("referralSystem")}</div>
            <div className="text-[12px] text-muted-foreground/50">{t("referralBonus")}</div>
          </div>
        </div>
        <div className="bg-muted/40 rounded-xl p-3.5 mb-4">
          <div className="text-[10px] text-muted-foreground/40 mb-1 font-semibold uppercase tracking-wide">{t("referralCode")}</div>
          <div className="font-mono text-[16px] font-bold tracking-[0.12em] text-foreground">{referralCode}</div>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={copyRef}
          className="w-full rounded-[14px] py-3 text-[13px] font-semibold flex items-center justify-center gap-2 transition-all duration-200"
          style={{
            background: copied ? "hsl(160 60% 35%)" : "hsl(160 60% 40%)",
            color: "white",
            boxShadow: "0 2px 8px hsl(160 60% 40% / 0.2)",
          }}>
          {copied ? (
            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{t("linkCopied")}</>
          ) : (
            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>{t("copyLink")}</>
          )}
        </motion.button>
      </motion.div>

      <motion.button {...stagger(5)} whileTap={{ scale: 0.98 }}
        onClick={() => { hapticFeedback("light"); setShowLangs(true); }}
        className="w-full card rounded-xl p-4 flex items-center gap-3.5 mb-4">
        <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: "hsl(var(--primary) / 0.06)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.7">
            <circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </div>
        <div className="flex-1 text-left">
          <div className="font-semibold text-[14px]">{t("language")}</div>
          <div className="text-[11px] text-muted-foreground/50">{currentLangObj?.flag} {currentLangObj?.nativeName}</div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/20"><polyline points="9 18 15 12 9 6"/></svg>
      </motion.button>

      <motion.div {...stagger(6)} className="text-center py-4">
        <p className="text-[10px] text-muted-foreground/25 font-medium">StudyPro v1.0 · @studypro_support</p>
      </motion.div>
    </div>
  );
}
