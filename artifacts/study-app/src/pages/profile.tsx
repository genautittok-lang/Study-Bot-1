import { useState } from "react";
import { useUser, useLang } from "@/lib/store";
import { hapticFeedback, hapticSuccess } from "@/lib/telegram";
import { t, getLang, setLang, LANGUAGES, getUserLevel, getNextLevel } from "@/lib/i18n";
import { motion } from "framer-motion";

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

  const fade = (d: number) => ({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { delay: d, duration: 0.25, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
  });

  const filteredLangs = LANGUAGES.filter(l =>
    l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  if (showLangs) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-5 pb-4">
        <motion.button whileTap={{ scale: 0.96 }}
          onClick={() => { hapticFeedback("light"); setShowLangs(false); }}
          className="text-muted-foreground text-[13px] font-medium mb-3 flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          {t("back")}
        </motion.button>
        <h2 className="text-lg font-bold text-foreground tracking-tight mb-0.5">{t("chooseLanguage")}</h2>
        <p className="text-[13px] text-muted-foreground mb-4">30 {t("language").toLowerCase()}</p>
        <div className="relative mb-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40">
            <circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
            className="w-full bg-muted/50 border border-border rounded-xl pl-9 pr-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30 transition-all" />
        </div>
        <div className="space-y-1">
          {filteredLangs.map((lang, i) => {
            const active = lang.code === currentLang;
            return (
              <motion.button key={lang.code}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.015, duration: 0.15 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { hapticSuccess(); setLang(lang.code); setTimeout(() => setShowLangs(false), 150); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${active ? "bg-primary/6 border border-primary/15" : "hover:bg-muted/50"}`}>
                <span className="text-xl">{lang.flag}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium text-[13px]">{lang.nativeName}</div>
                  <div className="text-[11px] text-muted-foreground">{lang.name}</div>
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
    <div className="px-4 pt-5 pb-4">
      <motion.h2 {...fade(0)} className="text-lg font-bold text-foreground tracking-tight mb-5">{t("profileTitle")}</motion.h2>

      <motion.div {...fade(0.03)} className="relative rounded-2xl p-5 mb-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]" />
        <div className="absolute inset-0 shimmer-subtle opacity-40" />
        <div className="relative z-10 text-white">
          <div className="flex items-center gap-3.5 mb-4">
            <div className={`w-14 h-14 bg-gradient-to-br ${level.color} rounded-2xl flex items-center justify-center shadow-lg text-xl font-black`}>
              {(user?.firstName || "S").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-bold">{user?.firstName || "Student"}</div>
              {user?.username && <div className="text-[12px] text-white/40">@{user.username}</div>}
              <div className="text-[11px] text-white/30 mt-0.5">ID: {user?.telegramId}</div>
            </div>
          </div>
          <div className="bg-white/[0.06] border border-white/[0.04] rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-medium text-white/60">{level.icon} {level.name}</span>
              {nextLvl && <span className="text-[10px] text-white/30">{nextLvl.reportsNeeded} to {nextLvl.name}</span>}
            </div>
            <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                className="h-full progress-bar-pro" />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div {...fade(0.06)} className="grid grid-cols-3 gap-2 mb-4">
        <div className="card-pro rounded-xl p-3 text-center">
          <div className="text-lg font-black text-foreground tabular-nums">{total}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{t("total")}</div>
        </div>
        <div className="card-pro rounded-xl p-3 text-center">
          <div className="text-lg font-black text-primary tabular-nums">{balance}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{t("availableReports")}</div>
        </div>
        <div className="card-pro rounded-xl p-3 text-center">
          <div className="text-lg font-black text-emerald-600 tabular-nums">{referralCount}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{t("invited")}</div>
        </div>
      </motion.div>

      <motion.div {...fade(0.09)} className="mb-4">
        <span className="section-label block mb-2.5">{t("achievements")}</span>
        <div className="grid grid-cols-4 gap-2">
          {achievements.map((a, i) => (
            <div key={i} className={`card-pro rounded-xl p-2.5 text-center transition-all ${a.ok ? "" : "opacity-25"}`}>
              <div className={`w-8 h-8 mx-auto rounded-lg flex items-center justify-center mb-1.5 text-[11px] font-black ${a.ok ? "bg-primary/8 text-primary" : "bg-muted text-muted-foreground"}`}>
                {a.icon}
              </div>
              <div className="text-[10px] font-semibold leading-tight">{a.name}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div {...fade(0.12)} className="card-pro card-highlight rounded-2xl p-4 mb-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 bg-emerald-500/8 rounded-xl flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
          </div>
          <div>
            <div className="font-semibold text-[13px]">{t("referralSystem")}</div>
            <div className="text-[11px] text-muted-foreground">{t("referralBonus")}</div>
          </div>
        </div>
        <div className="bg-muted/40 rounded-xl p-3 mb-3">
          <div className="text-[10px] text-muted-foreground mb-0.5">{t("referralCode")}</div>
          <div className="font-mono text-[14px] font-bold tracking-[0.08em]">{referralCode}</div>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={copyRef}
          className="w-full bg-emerald-600 text-white rounded-xl py-2.5 text-[13px] font-semibold flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/15">
          {copied ? (
            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{t("linkCopied")}</>
          ) : (
            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>{t("copyLink")}</>
          )}
        </motion.button>
      </motion.div>

      <motion.button {...fade(0.15)} whileTap={{ scale: 0.98 }}
        onClick={() => { hapticFeedback("light"); setShowLangs(true); }}
        className="w-full card-pro rounded-xl p-3.5 flex items-center gap-3 mb-3">
        <div className="w-9 h-9 bg-primary/6 rounded-xl flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </div>
        <div className="flex-1 text-left">
          <div className="font-semibold text-[13px]">{t("language")}</div>
          <div className="text-[11px] text-muted-foreground">{currentLangObj?.flag} {currentLangObj?.nativeName}</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/25"><polyline points="9 18 15 12 9 6"/></svg>
      </motion.button>

      <motion.div {...fade(0.18)} className="text-center py-3">
        <p className="text-[10px] text-muted-foreground/40">StudyPro v1.0 · @studypro_support</p>
      </motion.div>
    </div>
  );
}
