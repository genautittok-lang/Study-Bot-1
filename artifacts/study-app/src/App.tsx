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
const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

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
    { path: "/", label: t("home"), icon: (a: boolean) => <svg width="24" height="24" viewBox="0 0 24 24" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth={a ? "0" : "1.5"} strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg> },
    { path: "/new", label: t("create"), icon: (_a: boolean) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg> },
    { path: "/history", label: t("history"), icon: (a: boolean) => <svg width="24" height="24" viewBox="0 0 24 24" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth={a ? "0" : "1.5"} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/>{!a && <polyline points="12 6 12 12 16 14"/>}</svg> },
    { path: "/balance", label: t("balance"), icon: (a: boolean) => <svg width="24" height="24" viewBox="0 0 24 24" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth={a ? "0" : "1.5"} strokeLinecap="round"><rect width="20" height="14" x="2" y="5" rx="2"/>{!a && <line x1="2" x2="22" y1="10" y2="10"/>}</svg>, badge: hasBalance > 0 ? String(hasBalance) : undefined },
    { path: "/profile", label: t("profile"), icon: (a: boolean) => <svg width="24" height="24" viewBox="0 0 24 24" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth={a ? "0" : "1.5"} strokeLinecap="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="nav-glass px-1 pt-1.5 pb-1">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const active = tab.path === "/" ? location === "/" : location.startsWith(tab.path);
            return (
              <button
                key={tab.path}
                onClick={() => { hapticFeedback("light"); setLocation(tab.path); }}
                className="relative flex flex-col items-center gap-[2px] py-1.5 px-5 rounded-2xl transition-all duration-200"
              >
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full"
                    style={{ background: "linear-gradient(90deg, #667eea, #764ba2)" }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className={`transition-colors duration-200 ${active ? "text-primary" : "text-muted-foreground/35"}`}>
                  {tab.icon(active)}
                </span>
                <span className={`text-[10px] transition-colors duration-200 ${active ? "text-primary font-semibold" : "text-muted-foreground/35 font-medium"}`}>
                  {tab.label}
                </span>
                {tab.badge && (
                  <span className="absolute -top-1 right-0.5 text-white text-[8px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1"
                    style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", boxShadow: "0 2px 8px rgba(102,126,234,0.4)" }}>
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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease }}
        className="flex flex-col items-center"
      >
        <div className="relative mb-8">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl"
            style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", boxShadow: "0 12px 40px rgba(102, 126, 234, 0.35)" }}>
            <span className="text-white font-black text-3xl tracking-tighter">S</span>
          </div>
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-4 rounded-[28px] -z-10"
            style={{ background: "linear-gradient(135deg, rgba(102,126,234,0.15), rgba(118,75,162,0.1))" }}
          />
        </div>
        <h1 className="text-xl font-bold text-foreground tracking-tight mb-1">StudyPro</h1>
        <p className="text-[13px] text-muted-foreground/40 mb-8">{t("subtitle")}</p>
        <div className="w-40 h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #667eea, #764ba2)" }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          />
        </div>
      </motion.div>
    </div>
  );
}

function ErrorScreen({ error, retry }: { error: string; retry: () => void }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-destructive/8 rounded-2xl flex items-center justify-center mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--destructive))" strokeWidth="1.8">
            <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
          </svg>
        </div>
        <h1 className="text-lg font-bold text-foreground mb-1">{t("error")}</h1>
        <p className="text-sm text-muted-foreground mb-6">{error}</p>
        <button onClick={retry} className="btn-primary px-8 py-3 text-sm font-semibold">{t("tryAgain")}</button>
      </motion.div>
    </div>
  );
}

const pageVariants = {
  enter: { opacity: 0, y: 10 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function AnimatedPage({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location} variants={pageVariants} initial="enter" animate="center" exit="exit"
        transition={{ duration: 0.25, ease }}>
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
      <div className="min-h-screen bg-background pb-24">
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
