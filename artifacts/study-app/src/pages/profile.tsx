import { useState } from "react";
import { useUser, useLang } from "@/lib/store";
import { hapticFeedback, hapticSuccess } from "@/lib/telegram";
import { t, getLang, setLang, LANGUAGES } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";

export default function Profile() {
  const user = useUser();
  useLang();
  const [showLangs, setShowLangs] = useState(false);
  const [search, setSearch] = useState("");
  const currentLang = getLang();
  const currentLangObj = LANGUAGES.find((l) => l.code === currentLang);

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
        className="relative overflow-hidden rounded-3xl p-6 mb-5 text-white"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-violet-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30 text-2xl font-black">
            {(user?.firstName || "S").charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-lg font-bold">{user?.firstName || "Student"}</div>
            {user?.username && <div className="text-sm text-white/60">@{user.username}</div>}
          </div>
        </div>
      </motion.div>

      <div className="space-y-3">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            hapticFeedback("light");
            setShowLangs(true);
          }}
          className="w-full card-premium rounded-2xl p-4 flex items-center gap-4"
        >
          <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          transition={{ delay: 0.15 }}
          className="card-premium rounded-2xl p-4"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-11 h-11 bg-violet-50 rounded-xl flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
            </div>
            <div className="font-bold text-sm">{t("stats")}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-primary">{user?.totalReports || 0}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{t("total")}</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-emerald-500">
                {user ? (!user.freeReportsUsed ? user.balance + 1 : user.balance) : 0}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{t("availableReports")}</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-premium rounded-2xl p-4"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div className="font-bold text-sm">{t("userId")}</div>
          </div>
          <div className="bg-muted/50 rounded-xl px-3 py-2.5">
            <span className="font-mono text-sm text-foreground">{user?.telegramId}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
