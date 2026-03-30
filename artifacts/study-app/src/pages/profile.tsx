import { useState } from "react";
import { useUser, usePhotoUrl, useLang } from "@/lib/store";
import { hapticFeedback, hapticSuccess, hapticSelection, shareViaTelegram, openExternalLink, openTelegramLink, useBackButton } from "@/lib/telegram";
import { t, getLang, setLang, LANGUAGES, getUserLevel, getNextLevel } from "@/lib/i18n";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import Icon3D from "@/components/icons-3d";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

function ProgressRing({ progress, size = 52, stroke = 3.5, color = "#7C5CFC" }: { progress: number; size?: number; stroke?: number; color?: string }) {
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
  const [, go] = useLocation();
  useBackButton(() => {
    if (showLangs) {
      setShowLangs(false);
    } else {
      go("/");
    }
  });

  const curLang = getLang();
  const curLangObj = LANGUAGES.find(l => l.code === curLang);

  const total = user?.totalReports || 0;
  const lvl = getUserLevel(total);
  const nxt = getNextLevel(total);
  const progress = nxt ? Math.min(((total - lvl.min) / (lvl.max - lvl.min + 1)) * 100, 100) : 100;
  const refCode = user?.referralCode || "";
  const refCount = user?.referralCount || 0;
  const bal = user ? (!user.freeReportsUsed ? user.balance + 1 : user.balance) : 0;

  const achievements = [
    { icon: "🎯", name: t("firstReportAch"), ok: total >= 1, color: "#7C5CFC", p: total >= 1 ? 100 : (total / 1) * 100 },
    { icon: "🔥", name: t("tenReportsAch"), ok: total >= 10, color: "#FF9F43", p: Math.min((total / 10) * 100, 100) },
    { icon: "💎", name: t("fiftyReportsAch"), ok: total >= 50, color: "#3B82F6", p: Math.min((total / 50) * 100, 100) },
    { icon: "👥", name: t("referralAch"), ok: refCount >= 3, color: "#00C48C", p: Math.min((refCount / 3) * 100, 100) },
    { icon: "⚡", name: t("speedAch") || "Speed Runner", ok: total >= 5, color: "#FF6B9D", p: Math.min((total / 5) * 100, 100) },
    { icon: "🏆", name: t("hundredReportsAch") || "Legend", ok: total >= 100, color: "#FFD700", p: Math.min((total / 100) * 100, 100) },
  ];

  const refLink = refCode
    ? `https://t.me/studyflush_bot?start=ref_${refCode}`
    : "https://t.me/studyflush_bot";

  function copyRef() {
    navigator.clipboard.writeText(refLink)
      .then(() => { hapticSuccess(); setCopied(true); setTimeout(() => setCopied(false), 2000); })
      .catch(() => {});
  }

  function shareRefTelegram() {
    hapticFeedback("medium");
    shareViaTelegram(`🎓 ${t("shareWithFriend")}!\n\n${t("referralStep3")}\n\n${refLink}`);
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
          className="flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-full text-[12px] font-semibold"
          style={{ background: "rgba(124,92,252,0.07)", color: "#7C5CFC" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
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
                onClick={() => { hapticSelection(); setLang(lang.code); setTimeout(() => setShowLangs(false), 150); }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-[16px] transition-all ${active ? "card-3d ring-glow" : "active:bg-black/[0.02]"}`}>
                <span className="text-lg">{lang.flag}</span>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-[13px]">{lang.nativeName}</div>
                  <div className="text-[10px] text-[#9ca3af]">{lang.name}</div>
                </div>
                {active && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "#7C5CFC" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
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
    <div className="px-4 pt-5 pb-4">
      <motion.div {...a(0)} className="relative rounded-[28px] overflow-hidden mb-4"
        style={{ background: "linear-gradient(145deg, #8B6CFF 0%, #7C5CFC 30%, #6336F5 60%, #5226E8 100%)", boxShadow: "0 14px 44px rgba(124,92,252,0.28)" }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, white 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-8"
          style={{ background: "radial-gradient(circle, #06D6A0 0%, transparent 70%)", transform: "translate(-20%, 20%)" }} />
        <div className="p-5 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.4, delay: 0.15 }}
              className="avatar-ring">
              {photo
                ? <img src={photo} alt="" className="w-[58px] h-[58px] rounded-full object-cover" />
                : <div className="w-[58px] h-[58px] rounded-full flex items-center justify-center text-xl font-bold text-white"
                    style={{ background: "rgba(255,255,255,0.15)" }}>
                    {(user?.firstName || "S")[0].toUpperCase()}
                  </div>}
            </motion.div>
            <div className="flex-1 min-w-0">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="text-[20px] font-extrabold text-white tracking-tight truncate leading-tight">
                {user?.firstName || "Student"} {user?.lastName || ""}
              </motion.div>
              {user?.username && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                  className="text-[12px] font-medium mt-0.5 text-white/50 leading-tight">@{user.username}</motion.div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 px-3.5 py-3 rounded-[16px]"
            style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}>
            <span className="text-[15px]">{lvl.icon}</span>
            <div className="flex-1">
              <div className="text-[11px] font-semibold text-white/60 mb-1">{lvl.name}</div>
              <div className="w-full h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.15)" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                  transition={{ delay: 0.4, duration: 0.8, ease }}
                  className="h-full rounded-full bg-white" />
              </div>
            </div>
            {nxt && <span className="text-[9px] text-white/30 font-medium tabular">{total}/{nxt.reportsNeeded}</span>}
          </div>
        </div>
      </motion.div>

      <motion.div {...a(1)} className="grid grid-cols-3 gap-2 mb-4">
        {[
          { val: total, label: t("total"), color: "#7C5CFC", gradient: "linear-gradient(135deg, #7C5CFC, #6336F5)" },
          { val: bal, label: t("balance"), color: "#3B82F6", gradient: "linear-gradient(135deg, #3B82F6, #2563EB)" },
          { val: refCount, label: t("invited"), color: "#00C48C", gradient: "linear-gradient(135deg, #10B981, #06D6A0)" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.08, type: "spring", bounce: 0.3 }}
            className="stat-card py-4 px-2 text-center">
            <div className="absolute top-0 left-0 right-0 h-[2.5px]" style={{ background: s.gradient }} />
            <div className="text-[28px] font-extrabold tabular leading-none" style={{ color: s.color }}>{s.val}</div>
            <div className="text-[8px] text-[#b0b0c0] mt-2 font-bold uppercase tracking-wider">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div {...a(2)} className="mb-4">
        <div className="flex items-center gap-2 mb-2.5 px-0.5">
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-[#FF9F43]" />
          <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider">{t("achievements")}</span>
          <span className="text-[9px] text-[#d1d5db] font-medium ml-auto">{achievements.filter(a => a.ok).length}/{achievements.length}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {achievements.map((ac, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.06, type: "spring", bounce: 0.2 }}
              className="card-3d rounded-[20px] p-3.5 flex items-center gap-3"
              style={{ opacity: ac.ok ? 1 : 0.4, boxShadow: ac.ok ? `0 4px 16px ${ac.color}15, 0 2px 8px rgba(0,0,0,0.03)` : undefined }}>
              <div className="relative shrink-0">
                <ProgressRing progress={ac.p} size={44} stroke={3} color={ac.color} />
                <div className="absolute inset-0 flex items-center justify-center text-[17px]">{ac.icon}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold leading-snug truncate">{ac.name}</div>
                <div className="text-[9px] mt-0.5 font-semibold" style={{ color: ac.ok ? ac.color : "#b0b0c0" }}>
                  {ac.ok ? "✓ Done" : `${Math.round(ac.p)}%`}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div {...a(3)} className="relative rounded-[24px] overflow-hidden mb-3.5"
        style={{
          background: "linear-gradient(145deg, #2AABEE 0%, #229ED9 40%, #1E96CC 70%, #1A8FBF 100%)",
          boxShadow: "0 12px 40px rgba(42,171,238,0.25), 0 4px 12px rgba(0,0,0,0.06)",
        }}>
        <div className="absolute top-0 right-0 w-44 h-44 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, white 0%, transparent 65%)", transform: "translate(30%, -40%)" }} />
        <div className="relative z-10 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-[44px] h-[44px] rounded-[14px] flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" x2="19" y1="8" y2="14"/>
                <line x1="22" x2="16" y1="11" y2="11"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-extrabold text-[15px] text-white leading-tight">{t("referralSystem")}</div>
              <div className="text-[11px] text-white/50 mt-0.5">{t("referralBonus")}</div>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <div className="flex-1 rounded-[14px] py-2.5 px-3 text-center"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <div className="text-[22px] font-extrabold tabular leading-none text-white">{refCount}</div>
              <div className="text-[7px] text-white/40 font-bold uppercase tracking-wider mt-1">{t("friendsJoined")}</div>
            </div>
            <div className="flex-1 rounded-[14px] py-2.5 px-3 text-center"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <div className="text-[22px] font-extrabold tabular leading-none text-white">{refCount * 2}</div>
              <div className="text-[7px] text-white/40 font-bold uppercase tracking-wider mt-1">{t("earnedReports")}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-[14px] p-3 mb-4"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="flex-1 min-w-0">
              <div className="text-[8px] text-white/30 font-bold uppercase tracking-wider mb-0.5">{t("referralCode")}</div>
              <div className="font-mono text-[15px] font-extrabold tracking-[0.1em] text-white truncate">{refCode || "..."}</div>
            </div>
            <motion.button whileTap={{ scale: 0.88 }} onClick={copyRef}
              className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
              style={{ background: copied ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.12)" }}>
              {copied
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>}
            </motion.button>
          </div>

          <motion.button whileTap={{ scale: 0.97 }} onClick={shareRefTelegram}
            className="w-full py-[13px] text-[13px] font-bold flex items-center justify-center gap-2 rounded-[14px]"
            style={{ background: "rgba(255,255,255,0.95)", color: "#229ED9" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            {t("sendInvite")}
          </motion.button>
        </div>
      </motion.div>

      <motion.div {...a(4)} className="space-y-1.5 mb-3.5">
        <div className="flex items-center gap-2 mb-1 px-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
          <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider">{t("settings") || "Settings"}</span>
        </div>
        {[
          {
            label: t("language"),
            desc: `${curLangObj?.flag} ${curLangObj?.nativeName}`,
            action: () => { hapticSelection(); setShowLangs(true); },
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
            bg: "rgba(124,92,252,0.05)",
          },
          {
            label: t("support") || "Support",
            desc: t("supportDesc") || "Get help",
            action: () => { hapticFeedback("light"); go("/support"); },
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
            bg: "rgba(59,130,246,0.05)",
          },
          {
            label: t("shareApp") || "Share App",
            desc: t("shareAppDesc") || "Tell friends about StudyFlush",
            action: () => {
              hapticFeedback("light");
              shareViaTelegram(`🎓 StudyFlush — ${t("subtitle")}!\n\nhttps://t.me/studyflush_bot`);
            },
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF9F43" strokeWidth="1.5"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>,
            bg: "rgba(255,159,67,0.05)",
          },
          {
            label: t("rateBot") || "Rate Bot",
            desc: t("rateBotDesc") || "Leave a review on Telegram",
            action: () => {
              hapticFeedback("light");
              openTelegramLink("https://t.me/studyflush_bot");
            },
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
            bg: "rgba(245,158,11,0.05)",
          },
        ].map((item, i) => (
          <motion.button key={i} whileTap={{ scale: 0.97 }} onClick={item.action}
            className="w-full card-3d rounded-[20px] p-3.5 flex items-center gap-3">
            <div className="w-[40px] h-[40px] rounded-[13px] flex items-center justify-center shrink-0"
              style={{ background: item.bg }}>{item.icon}</div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-[14px]">{item.label}</div>
              <div className="text-[11px] text-[#9ca3af] mt-0.5">{item.desc}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </motion.button>
        ))}
      </motion.div>

      <motion.div {...a(5)} className="card-3d rounded-[20px] p-3.5 mb-3.5">
        <div className="flex items-center gap-2 mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider">{t("about") || "About"}</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[#6b7280]">Telegram ID</span>
            <span className="text-[12px] font-mono font-semibold text-[#1a1a2e]">{user?.telegramId || "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[#6b7280]">{t("version") || "Version"}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-mono font-semibold text-[#1a1a2e]">2.2.0</span>
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: "linear-gradient(135deg, #10B981, #06D6A0)" }}>NEW</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[#6b7280]">{t("total")}</span>
            <span className="text-[12px] font-mono font-semibold text-[#7C5CFC]">{user?.totalReports || 0} reports</span>
          </div>
        </div>
      </motion.div>

      <motion.div {...a(6)} className="text-center pt-2 pb-2">
        <p className="text-[9px] text-[#d1d5db] font-medium">StudyFlush v2.2 · Made with 💜</p>
      </motion.div>
    </div>
  );
}
