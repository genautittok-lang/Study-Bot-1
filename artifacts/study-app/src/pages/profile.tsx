import { useState } from "react";
import { useUser, usePhotoUrl, useLang } from "@/lib/store";
import { hapticFeedback, hapticSuccess } from "@/lib/telegram";
import { t, getLang, setLang, LANGUAGES, getUserLevel, getNextLevel } from "@/lib/i18n";
import { motion } from "framer-motion";

const ease4 = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

export default function Profile() {
  const user = useUser();
  const photoUrl = usePhotoUrl();
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
    { icon: "🎯", name: t("firstReportAch"), ok: total >= 1 },
    { icon: "🔥", name: t("tenReportsAch"), ok: total >= 10 },
    { icon: "💎", name: t("fiftyReportsAch"), ok: total >= 50 },
    { icon: "👥", name: t("referralAch"), ok: referralCount >= 3 },
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pt-6 pb-4">
        <motion.button whileTap={{ scale: 0.95 }}
          onClick={() => { hapticFeedback("light"); setShowLangs(false); }}
          className="text-muted-foreground text-[14px] font-medium mb-5 flex items-center gap-1.5 active:text-foreground transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          {t("back")}
        </motion.button>
        <h2 className="text-[22px] font-bold text-foreground tracking-tight mb-1">{t("chooseLanguage")}</h2>
        <p className="text-[14px] text-muted-foreground/50 mb-5">30 {t("language").toLowerCase()}</p>
        <div className="relative mb-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/25">
            <circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t("chooseLanguage")}
            aria-label={t("chooseLanguage")} className="input-field pl-12" />
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
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all ${active ? "card" : "active:bg-muted/50"}`}
                style={active ? { borderColor: "hsl(var(--primary) / 0.2)" } : {}}>
                <span className="text-xl">{lang.flag}</span>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-[14px]">{lang.nativeName}</div>
                  <div className="text-[11px] text-muted-foreground/40">{lang.name}</div>
                </div>
                {active && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
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
    <div className="px-5 pt-6 pb-4">
      <motion.div {...stagger(0)} className="mb-6">
        <h2 className="text-[22px] font-bold text-foreground tracking-tight">{t("profileTitle")}</h2>
      </motion.div>

      <motion.div {...stagger(1)} className="hero-card hero-shimmer p-6 mb-5">
        <div className="shimmer-bar" />
        <div className="relative z-10 text-white">
          <div className="flex items-center gap-4 mb-5">
            <div className="avatar-ring">
              {photoUrl ? (
                <img src={photoUrl} alt="" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))" }}>
                  {(user?.firstName || "S").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="text-[18px] font-bold tracking-tight">{user?.firstName || "Student"} {user?.lastName || ""}</div>
              {user?.username && (
                <div className="text-[13px] text-white/35 font-medium mt-0.5">@{user.username}</div>
              )}
              <div className="text-[11px] text-white/20 mt-1 tabular font-medium flex items-center gap-1.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-50"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
                ID: {user?.telegramId}
              </div>
            </div>
          </div>
          <div className="bg-white/[0.06] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[12px] font-semibold text-white/45 flex items-center gap-1.5">{level.icon} {level.name}</span>
              {nextLvl && <span className="text-[10px] text-white/20 font-medium">{total}/{nextLvl.reportsNeeded} → {nextLvl.name}</span>}
            </div>
            <div className="w-full h-[5px] bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ delay: 0.4, duration: 0.8, ease: ease4 }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #667eea, #764ba2)" }} />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div {...stagger(2)} className="grid grid-cols-3 gap-3 mb-5">
        <div className="card rounded-2xl py-4 px-3 text-center">
          <div className="stat-value text-foreground">{total}</div>
          <div className="text-[10px] text-muted-foreground/40 mt-0.5 font-medium">{t("total")}</div>
        </div>
        <div className="card rounded-2xl py-4 px-3 text-center">
          <div className="stat-value" style={{ color: "#667eea" }}>{balance}</div>
          <div className="text-[10px] text-muted-foreground/40 mt-0.5 font-medium">{t("availableReports")}</div>
        </div>
        <div className="card rounded-2xl py-4 px-3 text-center">
          <div className="stat-value" style={{ color: "#43e97b" }}>{referralCount}</div>
          <div className="text-[10px] text-muted-foreground/40 mt-0.5 font-medium">{t("invited")}</div>
        </div>
      </motion.div>

      <motion.div {...stagger(3)} className="mb-5">
        <span className="section-title block mb-3">{t("achievements")}</span>
        <div className="grid grid-cols-4 gap-2.5">
          {achievements.map((a, i) => (
            <div key={i} className={`card rounded-2xl p-3.5 text-center transition-opacity duration-300 ${a.ok ? "" : "opacity-20"}`}>
              <div className="text-2xl mb-1.5">{a.icon}</div>
              <div className="text-[10px] font-semibold leading-tight text-foreground">{a.name}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div {...stagger(4)} className="card rounded-2xl p-5 mb-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/4 opacity-50"
          style={{ background: "radial-gradient(circle, rgba(67,233,123,0.08), transparent 70%)" }} />
        <div className="flex items-start gap-3.5 mb-4 relative z-10">
          <div className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, rgba(67,233,123,0.1), rgba(56,249,215,0.05))" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#43e97b" strokeWidth="1.7"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
          </div>
          <div>
            <div className="font-semibold text-[15px] text-foreground">{t("referralSystem")}</div>
            <div className="text-[12px] text-muted-foreground/50 mt-0.5">{t("referralBonus")}</div>
          </div>
        </div>
        <div className="card rounded-2xl p-4 mb-4 relative z-10">
          <div className="text-[10px] text-muted-foreground/35 mb-1 font-semibold uppercase tracking-wide">{t("referralCode")}</div>
          <div className="font-mono text-[18px] font-bold tracking-[0.12em] text-foreground">{referralCode}</div>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={copyRef}
          className="w-full btn-success py-3.5 text-[14px] flex items-center justify-center gap-2 relative z-10">
          {copied ? (
            <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{t("linkCopied")}</>
          ) : (
            <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>{t("copyLink")}</>
          )}
        </motion.button>
      </motion.div>

      <motion.button {...stagger(5)} whileTap={{ scale: 0.98 }}
        onClick={() => { hapticFeedback("light"); setShowLangs(true); }}
        className="w-full card-interactive rounded-2xl p-4 flex items-center gap-3.5 mb-4">
        <div className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, rgba(102,126,234,0.08), rgba(118,75,162,0.05))" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="1.7">
            <circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </div>
        <div className="flex-1 text-left">
          <div className="font-semibold text-[14px] text-foreground">{t("language")}</div>
          <div className="text-[12px] text-muted-foreground/45 mt-0.5">{currentLangObj?.flag} {currentLangObj?.nativeName}</div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/20"><polyline points="9 18 15 12 9 6"/></svg>
      </motion.button>

      <motion.div {...stagger(6)} className="text-center py-4">
        <p className="text-[10px] text-muted-foreground/20 font-medium">StudyPro v1.0 · @studypro_support</p>
      </motion.div>
    </div>
  );
}
