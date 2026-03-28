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
  const currentLangObj = LANGUAGES.find((l) => l.code === currentLang);

  const totalReports = user?.totalReports || 0;
  const level = getUserLevel(totalReports);
  const nextLvl = getNextLevel(totalReports);
  const progressToNext = nextLvl ? ((totalReports - level.min) / (level.max - level.min + 1)) * 100 : 100;

  const referralCode = user?.referralCode || "---";
  const referralCount = user?.referralCount || 0;

  const achievements = [
    { id: "first", icon: "🎯", name: t("firstReportAch"), desc: "1 report", unlocked: totalReports >= 1 },
    { id: "ten", icon: "🔥", name: t("tenReportsAch"), desc: "10 reports", unlocked: totalReports >= 10 },
    { id: "fifty", icon: "💎", name: t("fiftyReportsAch"), desc: "50 reports", unlocked: totalReports >= 50 },
    { id: "referral", icon: "🤝", name: t("referralAch"), desc: "3 referrals", unlocked: referralCount >= 3 },
  ];

  function copyReferralLink() {
    const link = `https://t.me/studypro_bot?start=ref_${referralCode}`;
    navigator.clipboard.writeText(link);
    hapticSuccess();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const filteredLangs = LANGUAGES.filter((l) =>
    l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  if (showLangs) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="px-4 pt-6 pb-4"
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => { hapticFeedback("light"); setShowLangs(false); }}
          className="text-primary text-sm font-semibold mb-4 flex items-center gap-1"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          {t("back")}
        </motion.button>

        <h2 className="text-xl font-bold mb-1">{t("chooseLanguage")}</h2>
        <p className="text-muted-foreground text-sm mb-4">30 {t("language").toLowerCase()}</p>

        <div className="relative mb-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/>
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full bg-card border border-border rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="space-y-1.5">
          {filteredLangs.map((lang, i) => {
            const isActive = lang.code === currentLang;
            return (
              <motion.button
                key={lang.code}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  hapticSuccess();
                  setLang(lang.code);
                  setTimeout(() => setShowLangs(false), 200);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-primary/10 border-2 border-primary/30"
                    : "bg-card border border-border hover:bg-muted/50"
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm">{lang.nativeName}</div>
                  <div className="text-xs text-muted-foreground">{lang.name}</div>
                </div>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 pt-6 pb-4"
    >
      <h2 className="text-xl font-bold mb-5">{t("profileTitle")}</h2>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 mb-4 text-white"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900" />
        <div className="absolute inset-0 shimmer-bg opacity-30" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 bg-gradient-to-br ${level.color} rounded-2xl flex items-center justify-center shadow-xl text-2xl font-black`}>
              {(user?.firstName || "S").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold">{user?.firstName || "Student"}</div>
              {user?.username && <div className="text-sm text-white/60">@{user.username}</div>}
            </div>
            <div className="text-3xl">{level.icon}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">{t("level")}: {level.name}</span>
              {nextLvl && <span className="text-xs text-white/60">{nextLvl.reportsNeeded} → {nextLvl.name}</span>}
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressToNext, 100)}%` }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                className="h-full progress-bar-gradient rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="card-premium card-glow rounded-2xl p-4 mb-3"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
            <span className="text-lg">🏆</span>
          </div>
          <div className="font-bold text-sm">{t("achievements")}</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                ach.unlocked ? "bg-primary/5" : "bg-muted/30 opacity-40"
              }`}
            >
              <span className="text-2xl mb-1">{ach.icon}</span>
              <span className="text-[10px] font-semibold text-center leading-tight">{ach.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="card-premium rounded-2xl p-4 mb-3 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-full" />
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center">
            <span className="text-lg">🎁</span>
          </div>
          <div>
            <div className="font-bold text-sm">{t("referralSystem")}</div>
            <div className="text-xs text-muted-foreground">{t("referralBonus")}</div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-3">{t("referralDesc")}</p>

        <div className="bg-muted/50 rounded-xl p-3 mb-3">
          <div className="text-xs text-muted-foreground mb-1">{t("referralCode")}</div>
          <div className="font-mono text-base font-bold tracking-wider">{referralCode}</div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-primary/5 rounded-xl p-2.5 text-center">
            <div className="text-xl font-black text-primary">{referralCount}</div>
            <div className="text-[10px] text-muted-foreground">{t("invited")}</div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-2.5 text-center">
            <div className="text-xl font-black text-emerald-500">{referralCount * 2}</div>
            <div className="text-[10px] text-muted-foreground">{t("bonusEarned")}</div>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={copyReferralLink}
          className="w-full premium-btn py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
        >
          {copied ? (
            <>{t("linkCopied")}</>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              {t("copyLink")}
            </>
          )}
        </motion.button>
      </motion.div>

      <div className="space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="card-premium rounded-2xl p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
            </div>
            <div className="font-bold text-sm">{t("stats")}</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-muted/50 rounded-xl p-2.5 text-center">
              <div className="text-xl font-black text-primary">{user?.totalReports || 0}</div>
              <div className="text-[10px] text-muted-foreground">{t("total")}</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-2.5 text-center">
              <div className="text-xl font-black text-emerald-500">
                {user ? (!user.freeReportsUsed ? user.balance + 1 : user.balance) : 0}
              </div>
              <div className="text-[10px] text-muted-foreground">{t("availableReports")}</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-2.5 text-center">
              <div className="text-xl font-black text-amber-500">{referralCount}</div>
              <div className="text-[10px] text-muted-foreground">{t("invited")}</div>
            </div>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { hapticFeedback("light"); setShowLangs(true); }}
          className="w-full card-premium rounded-2xl p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <div className="flex-1 text-left">
            <div className="font-bold text-sm">{t("language")}</div>
            <div className="text-xs text-muted-foreground">{currentLangObj?.flag} {currentLangObj?.nativeName}</div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/40"><polyline points="9 18 15 12 9 6"/></svg>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="card-premium rounded-2xl p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div className="font-bold text-sm">{t("accountInfo")}</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-muted/50 rounded-xl px-3 py-2.5">
              <span className="text-xs text-muted-foreground">{t("userId")}</span>
              <span className="font-mono text-sm font-semibold">{user?.telegramId}</span>
            </div>
            <div className="flex items-center justify-between bg-muted/50 rounded-xl px-3 py-2.5">
              <span className="text-xs text-muted-foreground">{t("level")}</span>
              <span className="text-sm font-semibold">{level.icon} {level.name}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
