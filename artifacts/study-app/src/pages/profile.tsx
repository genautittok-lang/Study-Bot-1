import { useState } from "react";
import { useUser, usePhotoUrl, useLang } from "@/lib/store";
import { hapticFeedback, hapticSuccess } from "@/lib/telegram";
import { t, getLang, setLang, LANGUAGES, getUserLevel, getNextLevel } from "@/lib/i18n";
import { motion } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

export default function Profile() {
  const user = useUser();
  const photo = usePhotoUrl();
  useLang();
  const [showLangs, setShowLangs] = useState(false);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);
  const curLang = getLang();
  const curLangObj = LANGUAGES.find(l => l.code === curLang);

  const total = user?.totalReports || 0;
  const lvl = getUserLevel(total);
  const nxt = getNextLevel(total);
  const progress = nxt ? Math.min(((total - lvl.min) / (lvl.max - lvl.min + 1)) * 100, 100) : 100;
  const refCode = user?.referralCode || "---";
  const refCount = user?.referralCount || 0;
  const bal = user ? (!user.freeReportsUsed ? user.balance + 1 : user.balance) : 0;

  const achievements = [
    { icon: "🎯", name: t("firstReportAch"), ok: total >= 1, color: "#7c5aff" },
    { icon: "🔥", name: t("tenReportsAch"), ok: total >= 10, color: "#f97316" },
    { icon: "💎", name: t("fiftyReportsAch"), ok: total >= 50, color: "#06b6d4" },
    { icon: "👥", name: t("referralAch"), ok: refCount >= 3, color: "#10b981" },
  ];

  function copyRef() {
    navigator.clipboard.writeText(`https://t.me/studypro_bot?start=ref_${refCode}`);
    hapticSuccess(); setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  const a = (i: number) => ({
    initial: { opacity: 0, y: 14 } as const,
    animate: { opacity: 1, y: 0 } as const,
    transition: { delay: i * 0.05, duration: 0.4, ease },
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
          className="text-white/28 text-[13px] font-semibold mb-4 flex items-center gap-1 active:text-white/50 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          {t("back")}
        </motion.button>
        <h2 className="text-[22px] font-extrabold text-white tracking-tight mb-0.5">{t("chooseLanguage")}</h2>
        <p className="text-[11px] text-white/20 mb-4">{LANGUAGES.length} {t("language").toLowerCase()}</p>
        <div className="relative mb-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/14">
            <circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t("chooseLanguage")}
            aria-label={t("chooseLanguage")} className="input-field pl-10" />
        </div>
        <div className="space-y-0.5">
          {filteredLangs.map((lang, i) => {
            const active = lang.code === curLang;
            return (
              <motion.button key={lang.code}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.008 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { hapticSuccess(); setLang(lang.code); setTimeout(() => setShowLangs(false), 150); }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-[14px] transition-all ${active ? "g-card" : "active:bg-white/[0.02]"}`}>
                <span className="text-lg">{lang.flag}</span>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-[13px] text-white/88">{lang.nativeName}</div>
                  <div className="text-[10px] text-white/22">{lang.name}</div>
                </div>
                {active && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #7c5aff, #06b6d4)" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
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
      <motion.div {...a(0)} className="mb-5">
        <h2 className="text-[22px] font-extrabold text-white tracking-tight">{t("profileTitle")}</h2>
      </motion.div>

      {/* Profile Card */}
      <motion.div {...a(1)} className="hero-card hero-shimmer p-5 mb-3">
        <div className="shimmer-bar" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="avatar-ring">
              {photo
                ? <img src={photo} alt="" className="w-[50px] h-[50px] rounded-full object-cover" />
                : <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center text-lg font-bold text-white premium-gradient">
                    {(user?.firstName || "S")[0].toUpperCase()}
                  </div>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[18px] font-extrabold text-white tracking-tight truncate leading-tight">
                {user?.firstName || "Student"} {user?.lastName || ""}
              </div>
              {user?.username && (
                <div className="text-[12px] font-medium mt-0.5 gradient-text leading-tight">@{user.username}</div>
              )}
              <div className="text-[10px] text-white/14 mt-0.5 tabular font-medium">ID: {user?.telegramId}</div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="rounded-[14px] p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-white/28 flex items-center gap-1.5">{lvl.icon} {lvl.name}</span>
              {nxt && <span className="text-[9px] text-white/14 font-medium tabular">{total}/{nxt.reportsNeeded} → {nxt.name}</span>}
            </div>
            <div className="w-full h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                transition={{ delay: 0.4, duration: 0.8, ease }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #7c5aff, #06b6d4)" }} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div {...a(2)} className="grid grid-cols-3 gap-2 mb-3">
        {[
          { val: total, label: t("total"), color: "#b8a4ff" },
          { val: bal, label: t("availableReports"), color: "#7dd3fc" },
          { val: refCount, label: t("invited"), color: "#6ee7b7" },
        ].map((s, i) => (
          <div key={i} className="g-card rounded-[16px] py-3.5 px-2 text-center">
            <div className="stat-num" style={{ color: s.color, textShadow: `0 0 18px ${s.color}35` }}>{s.val}</div>
            <div className="text-[8px] text-white/18 mt-1.5 font-semibold uppercase tracking-wider leading-tight">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Achievements */}
      <motion.div {...a(3)} className="mb-3">
        <span className="section-label block mb-2">{t("achievements")}</span>
        <div className="grid grid-cols-4 gap-2">
          {achievements.map((ac, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: ac.ok ? 1 : 0.2, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.06, ease }}
              className="g-card rounded-[14px] p-2.5 text-center">
              <div className="text-[20px] mb-1">{ac.icon}</div>
              <div className="text-[7px] font-semibold leading-tight text-white/28">{ac.name}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Referral */}
      <motion.div {...a(4)} className="g-card rounded-[20px] p-4 mb-2.5">
        <div className="flex items-center gap-3 mb-3">
          <div className="icon-box" style={{ background: "rgba(16,185,129,0.06)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>
            </svg>
          </div>
          <div>
            <div className="font-bold text-[13px] text-white/88 leading-tight">{t("referralSystem")}</div>
            <div className="text-[10px] text-white/22 mt-0.5">{t("referralBonus")}</div>
          </div>
        </div>
        <div className="rounded-[12px] p-3 mb-3" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="text-[8px] text-white/18 mb-1 font-semibold uppercase tracking-[0.1em]">{t("referralCode")}</div>
          <div className="font-mono text-[17px] font-extrabold tracking-[0.12em] gradient-text">{refCode}</div>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={copyRef}
          className="w-full btn-accent py-[11px] text-[13px] flex items-center justify-center gap-2">
          {copied
            ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{t("linkCopied")}</>
            : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>{t("copyLink")}</>}
        </motion.button>
      </motion.div>

      {/* Language */}
      <motion.button {...a(5)} whileTap={{ scale: 0.98 }}
        onClick={() => { hapticFeedback("light"); setShowLangs(true); }}
        className="w-full g-card rounded-[18px] p-3.5 flex items-center gap-3 mb-2.5">
        <div className="icon-box" style={{ background: "rgba(120,80,255,0.06)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b8a4ff" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </div>
        <div className="flex-1 text-left">
          <div className="font-semibold text-[13px] text-white/88">{t("language")}</div>
          <div className="text-[10px] text-white/22 mt-0.5">{curLangObj?.flag} {curLangObj?.nativeName}</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/12"><polyline points="9 18 15 12 9 6"/></svg>
      </motion.button>

      <motion.div {...a(6)} className="text-center py-3">
        <p className="text-[9px] text-white/10 font-medium">StudyPro v2.0 · @studypro_support</p>
      </motion.div>
    </div>
  );
}
