import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useInitApp, useUser, useLang } from "@/lib/store";
import { hapticFeedback, getTelegramWebApp } from "@/lib/telegram";
import { t } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import Home from "@/pages/home";
import NewReport from "@/pages/new-report";
import History from "@/pages/history";
import Balance from "@/pages/balance";
import Profile from "@/pages/profile";

const queryClient = new QueryClient();

function useThemeSync() {
  useEffect(() => {
    function sync() {
      const tg = getTelegramWebApp();
      const scheme = tg?.colorScheme || "light";
      document.documentElement.classList.toggle("dark", scheme === "dark");
    }
    sync();
    const interval = setInterval(sync, 1000);
    return () => clearInterval(interval);
  }, []);
}

function BottomNav() {
  const [location, setLocation] = useLocation();
  const user = useUser();
  useLang();

  const hasBalance = user ? (!user.freeReportsUsed ? user.balance + 1 : user.balance) : 0;

  const tabs = [
    { path: "/", label: t("home"), icon: (a: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? "hsl(var(--primary))" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg> },
    { path: "/new", label: t("create"), icon: (_a: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg> },
    { path: "/history", label: t("history"), icon: (a: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? "hsl(var(--primary))" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    { path: "/balance", label: t("balance"), icon: (a: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? "hsl(var(--primary))" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>, badge: hasBalance > 0 ? String(hasBalance) : undefined },
    { path: "/profile", label: t("profile"), icon: (a: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? "hsl(var(--primary))" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
      <div className="nav-glass px-2 py-1.5">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const active = tab.path === "/" ? location === "/" : location.startsWith(tab.path);
            return (
              <button
                key={tab.path}
                onClick={() => { hapticFeedback("light"); setLocation(tab.path); }}
                className="relative flex flex-col items-center gap-0.5 py-2 px-4 rounded-2xl transition-all duration-150"
              >
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-2xl"
                    style={{ background: "hsl(var(--primary) / 0.06)" }}
                    transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
                  />
                )}
                <span className={`relative z-10 transition-colors duration-150 ${active ? "text-primary" : "text-muted-foreground/40"}`}>
                  {tab.icon(active)}
                </span>
                <span className={`relative z-10 text-[10px] tracking-tight transition-colors duration-150 ${active ? "text-primary font-semibold" : "text-muted-foreground/40 font-medium"}`}>
                  {tab.label}
                </span>
                {tab.badge && (
                  <span className="absolute -top-0.5 right-1.5 bg-primary text-white text-[8px] font-bold min-w-[16px] h-[16px] flex items-center justify-center rounded-full px-1 shadow-sm shadow-primary/30">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        className="flex flex-col items-center"
      >
        <div className="relative mb-6">
          <div className="w-[72px] h-[72px] rounded-[22px] hero-card flex items-center justify-center shadow-2xl">
            <span className="text-white font-black text-2xl tracking-tighter relative z-10">SP</span>
          </div>
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-3 rounded-3xl bg-primary/5 -z-10 blur-lg"
          />
        </div>
        <h1 className="text-lg font-bold text-foreground tracking-tight mb-0.5">StudyPro</h1>
        <p className="text-xs text-muted-foreground/50 mb-6">{t("subtitle")}</p>
        <div className="w-36 h-[3px] bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full progress-fill"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: [0.4, 0, 0.6, 1] as [number, number, number, number] }}
          />
        </div>
      </motion.div>
    </div>
  );
}

function ErrorScreen({ error, retry }: { error: string; retry: () => void }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center"
      >
        <div className="w-14 h-14 bg-destructive/8 rounded-2xl flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--destructive))" strokeWidth="1.8">
            <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
          </svg>
        </div>
        <h1 className="text-lg font-bold text-foreground mb-1">{t("error")}</h1>
        <p className="text-sm text-muted-foreground mb-5">{error}</p>
        <button onClick={retry} className="btn-primary px-6 py-2.5 text-sm font-semibold">{t("tryAgain")}</button>
      </motion.div>
    </div>
  );
}

const pageVariants = {
  enter: { opacity: 0, y: 8 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};
const pageTrans = { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] };

function AnimatedPage({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        variants={pageVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={pageTrans}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function AppContent() {
  const { loading, error, retry } = useInitApp();
  useThemeSync();
  useLang();

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} retry={retry} />;

  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        <AnimatedPage>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/new" component={NewReport} />
            <Route path="/history" component={History} />
            <Route path="/balance" component={Balance} />
            <Route path="/profile" component={Profile} />
            <Route><Home /></Route>
          </Switch>
        </AnimatedPage>
      </div>
      <BottomNav />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppContent />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
