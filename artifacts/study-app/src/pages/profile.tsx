import { useState } from "react";
import { useUser, usePhotoUrl, useLang } from "@/lib/store";
import { hapticFeedback, hapticSuccess } from "@/lib/telegram";
import { t, getLang, setLang, LANGUAGES, getUserLevel, getNextLevel } from "@/lib/i18n";
import { motion } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

function ProgressRing({ progress, size = 52, stroke = 3.5, color = "#6C5CE7" }: { progress: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth={stroke} />
      <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ delay: 0.3, duration: 1, ease }}
        strokeDasharray={circ} />
    </svg>
  );
}

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
    { icon: "🎯", name: t("firstReportAch"), ok: total >= 1, color: "#6C5CE7", p: total >= 1 ? 100 : (total / 1) * 100 },
    { icon: "🔥", name: t("tenReportsAch"), ok: total >= 10, color: "#FF9F43", p: Math.min((total / 10) * 100, 100) },
    { icon: "💎", name: t("fiftyReportsAch"), ok: total >= 50, color: "#0984E3", p: Math.min((total / 50) * 100, 100) },
    { icon: "👥", name: t("referralAch"), ok: refCount >= 3, color: "#00B894", p: Math.min((refCount / 3) * 100, 100) },
  ];

  function copyRef() {
    navigator.clipboard.writeText(`https://t.me/studypro_bot?start=ref_${refCode}`)
      .then(() => { hapticSuccess(); setCopied(true); setTimeout(() => setCopied(false), 2000); })
      .catch(() => {});
  }

  const a = (i: number) => ({
    initial: { opacity: 0, y: 16 } as const,
    animate: { opacity: 1, y: 0 } as const,
    transition: { delay: i * 0.06, duration: 0.4, ease },
  });

  const filteredLangs = LANGUAGES.filter(l =>
    l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  if (showLangs) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-5 pb-4">
        <motion.button whileTap={{ scale: 0.95 }}
          onClick={() => { hapticFeedback("light"); setShowLangs(false); }}
          className="text-[#9ca3af] text-[13px] font-semibold mb-4 flex items-center gap-1 active:text-[#6b7280] transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          {t("back")}
        </motion.button>
        <h2 className="text-[22px] font-extrabold tracking-tight mb-0.5">{t("chooseLanguage")}</h2>
        <p className="text-[11px] text-[#9ca3af] mb-3">{LANGUAGES.length} {t("language").toLowerCase()}</p>
        <div className="relative mb-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2"
            className="absolute left-3.5 top-1/2 -translate-y-1/2">
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
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-[14px] transition-all ${active ? "g-card" : "active:bg-black/[0.02]"}`}>
                <span className="text-lg">{lang.flag}</span>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-[13px]">{lang.nativeName}</div>
                  <div className="text-[10px] text-[#9ca3af]">{lang.name}</div>
                </div>
                {active && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "#6C5CE7" }}>
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
    <div className="px-4 pt-5 pb-4">
      {/* PROFILE HEADER */}
      <motion.div {...a(0)} className="relative rounded-[28px] overflow-hidden mb-4"
        style={{ background: "linear-gradient(145deg, #6C5CE7 0%, #5A4BD1 40%, #4834B5 100%)", boxShadow: "0 12px 40px rgba(108,92,231,0.25)" }}>
        <div className="absolute top-0 right-0 w-44 h-44 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, white 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
        <div className="p-5 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="avatar-ring">
              {photo
                ? <img src={photo} alt="" className="w-[56px] h-[56px] rounded-full object-cover" />
                : <div className="w-[56px] h-[56px] rounded-full flex items-center justify-center text-xl font-bold text-white"
                    style={{ background: "rgba(255,255,255,0.15)" }}>
                    {(user?.firstName || "S")[0].toUpperCase()}
                  </div>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[20px] font-extrabold text-white tracking-tight truncate leading-tight">
                {user?.firstName || "Student"} {user?.lastName || ""}
              </div>
              {user?.username && (
                <div className="text-[12px] font-medium mt-0.5 text-white/55 leading-tight">@{user.username}</div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-[14px]"
            style={{ background: "rgba(255,255,255,0.1)" }}>
            <span className="text-[14px]">{lvl.icon}</span>
            <div className="flex-1">
              <div className="text-[11px] font-semibold text-white/60">{lvl.name}</div>
              <div className="w-full h-[3px] rounded-full mt-1 overflow-hidden" style={{ background: "rgba(255,255,255,0.15)" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                  transition={{ delay: 0.4, duration: 0.8, ease }}
                  className="h-full rounded-full bg-white" />
              </div>
            </div>
            {nxt && <span className="text-[9px] text-white/30 font-medium tabular">{total}/{nxt.reportsNeeded}</span>}
          </div>
        </div>
      </motion.div>

      {/* STATS */}
      <motion.div {...a(1)} className="grid grid-cols-3 gap-2 mb-4">
        {[
          { val: total, label: t("total"), color: "#6C5CE7" },
          { val: bal, label: t("balance"), color: "#0984E3" },
          { val: refCount, label: t("invited"), color: "#00B894" },
        ].map((s, i) => (
          <div key={i} className="g-card rounded-[18px] py-3.5 px-2 text-center">
            <div className="text-[26px] font-extrabold tabular leading-none" style={{ color: s.color }}>{s.val}</div>
            <div className="text-[8px] text-[#b0b0c0] mt-1.5 font-bold uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* ACHIEVEMENTS WITH PROGRESS RINGS */}
      <motion.div {...a(2)} className="mb-4">
        <div className="flex items-center gap-2 mb-2.5 px-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF9F43] animate-pulse" />
          <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider">{t("achievements")}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {achievements.map((ac, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.06, ease }}
              className="g-card rounded-[18px] p-3 flex items-center gap-3"
              style={{ opacity: ac.ok ? 1 : 0.45 }}>
              <div className="relative shrink-0">
                <ProgressRing progress={ac.p} size={42} stroke={3} color={ac.color} />
                <div className="absolute inset-0 flex items-center justify-center text-[16px]">{ac.icon}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold leading-snug truncate">{ac.name}</div>
                <div className="text-[9px] text-[#b0b0c0] mt-0.5 font-semibold">
                  {ac.ok ? "✓ Done" : `${Math.round(ac.p)}%`}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* REFERRAL */}
      <motion.div {...a(3)} className="g-card rounded-[22px] p-4 mb-3">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center shrink-0"
            style={{ background: "rgba(0,184,148,0.06)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00B894" strokeWidth="1.8">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-bold text-[14px] leading-tight">{t("referralSystem")}</div>
            <div className="text-[11px] text-[#9ca3af] mt-0.5">{t("referralBonus")}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-[14px] p-3 mb-3"
          style={{ background: "rgba(108,92,231,0.03)", border: "1px solid rgba(108,92,231,0.06)" }}>
          <div className="flex-1">
            <div className="text-[8px] text-[#b0b0c0] font-bold uppercase tracking-wider mb-0.5">{t("referralCode")}</div>
            <div className="font-mono text-[16px] font-extrabold tracking-[0.1em] gradient-text">{refCode}</div>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={copyRef}
            className="w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0"
            style={{ background: copied ? "rgba(0,184,148,0.06)" : "rgba(108,92,231,0.06)" }}>
            {copied
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00B894" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="1.8"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>}
          </motion.button>
        </div>

        <motion.button whileTap={{ scale: 0.97 }} onClick={copyRef}
          className="w-full btn-accent py-[12px] text-[13px] flex items-center justify-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
          {copied ? t("linkCopied") : t("copyLink")}
        </motion.button>
      </motion.div>

      {/* SETTINGS */}
      <motion.div {...a(4)} className="space-y-1.5">
        {[
          {
            label: t("language"),
            desc: `${curLangObj?.flag} ${curLangObj?.nativeName}`,
            action: () => { hapticFeedback("light"); setShowLangs(true); },
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
            bg: "rgba(108,92,231,0.05)",
          },
        ].map((item, i) => (
          <motion.button key={i} whileTap={{ scale: 0.98 }} onClick={item.action}
            className="w-full g-card rounded-[18px] p-3.5 flex items-center gap-3">
            <div className="w-[38px] h-[38px] rounded-[12px] flex items-center justify-center shrink-0"
              style={{ background: item.bg }}>{item.icon}</div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-[14px]">{item.label}</div>
              <div className="text-[11px] text-[#9ca3af] mt-0.5">{item.desc}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </motion.button>
        ))}
      </motion.div>

      <div className="text-center pt-5 pb-2">
        <p className="text-[9px] text-[#d1d5db] font-medium">StudyPro v2.0</p>
      </div>
    </div>
  );
}
