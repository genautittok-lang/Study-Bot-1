import { useUser, useLang } from "@/lib/store";
import { useLocation } from "wouter";
import { hapticFeedback } from "@/lib/telegram";
import { t } from "@/lib/i18n";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

export default function Home() {
  const user = useUser();
  const [, setLocation] = useLocation();
  useLang();

  const availableReports = user
    ? (!user.freeReportsUsed ? user.balance + 1 : user.balance)
    : 0;

  return (
    <motion.div
      className="px-4 pt-6 pb-4"
      initial="initial"
      animate="animate"
      variants={stagger}
    >
      <motion.div className="mb-5" variants={fadeUp}>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          {t("welcome")}, {user?.firstName || "Student"}! <span className="wave-emoji">👋</span>
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {t("subtitle")}
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="relative overflow-hidden rounded-3xl p-5 mb-5 text-white shadow-2xl shadow-primary/25"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-500 to-violet-600" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white/80">{t("yourBalance")}</span>
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
            </motion.div>
          </div>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", bounce: 0.4 }}
            className="text-5xl font-black mb-0.5 tabular-nums"
          >
            {availableReports}
          </motion.div>
          <div className="text-sm text-white/70">{t("reportsAvailable")}</div>
          {!user?.freeReportsUsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-3 bg-white/15 backdrop-blur-sm rounded-xl px-3.5 py-2 inline-flex items-center gap-2"
            >
              <span className="text-lg">🎁</span>
              <span className="text-sm font-semibold">{t("firstReportFree")}</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-2 gap-3 mb-5" variants={stagger}>
        {[
          { path: "/new", label: t("newReport"), sub: t("generateAI"), gradient: "from-blue-500 to-blue-600", iconColor: "text-blue-500", bgColor: "bg-blue-50",
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg> },
          { path: "/history", label: t("history"), sub: t("myReports"), gradient: "from-emerald-500 to-green-600", iconColor: "text-emerald-500", bgColor: "bg-emerald-50",
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
          { path: "/balance", label: t("topUp"), sub: t("buyReports"), gradient: "from-violet-500 to-purple-600", iconColor: "text-violet-500", bgColor: "bg-violet-50",
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg> },
          { path: "/profile", label: t("stats"), sub: `${user?.totalReports || 0} ${t("report1")}`, gradient: "from-amber-500 to-orange-600", iconColor: "text-amber-500", bgColor: "bg-amber-50",
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg> },
        ].map((item) => (
          <motion.button
            key={item.path}
            variants={fadeUp}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              hapticFeedback("medium");
              setLocation(item.path);
            }}
            className="card-premium rounded-2xl p-4 text-left"
          >
            <div className={`w-11 h-11 ${item.bgColor} rounded-xl flex items-center justify-center mb-3 ${item.iconColor}`}>
              {item.icon}
            </div>
            <div className="font-bold text-foreground text-sm">{item.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{item.sub}</div>
          </motion.button>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="card-premium rounded-2xl p-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <div className="font-bold text-sm">{t("quickStart")}</div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {t("quickStartDesc")}
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              hapticFeedback("medium");
              setLocation("/new");
            }}
            className="w-full premium-btn py-3 text-sm font-bold"
          >
            {t("createReport")}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
