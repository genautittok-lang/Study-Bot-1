import { useState, useEffect, useMemo, useCallback } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useInitApp, useUser, useLang } from "@/lib/store";
import { hapticFeedback, showBackButton, hideBackButton } from "@/lib/telegram";
import { t } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import Home from "@/pages/home";
import NewReport from "@/pages/new-report";
import History from "@/pages/history";
import Balance from "@/pages/balance";
import Profile from "@/pages/profile";
import Support from "@/pages/support";
import Admin from "@/pages/admin";
import Onboarding, { isOnboardingDone } from "@/pages/onboarding";

const queryClient = new QueryClient();
const spring = { type: "spring" as const, bounce: 0.2, duration: 0.5 };

function AmbientBg() {
  return (
    <div className="app-bg">
      <div className="liquid-orb liquid-orb-1" />
      <div className="liquid-orb liquid-orb-2" />
      <div className="liquid-orb liquid-orb-3" />
    </div>
  );
}

function BottomNav() {
  const [location, setLocation] = useLocation();
  const user = useUser();
  useLang();

  const bal = user ? (!user.freeReportsUsed ? user.balance + 1 : user.balance) : 0;

  if (location.startsWith("/admin")) return null;

  const tabs = [
    {
      path: "/", label: t("home"),
      icon: (a: boolean) => (
        <svg width="21" height="21" viewBox="0 0 24 24" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth={a ? "0" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
          <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        </svg>
      )
    },
    {
      path: "/history", label: t("history"),
      icon: (a: boolean) => (
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" fill={a ? "currentColor" : "none"}/>
          {!a && <><polyline points="12 6 12 12 16 14"/></>}
        </svg>
      )
    },
    {
      path: "/new", label: t("letsGo"), special: true,
      icon: () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" x2="12" y1="5" y2="19"/>
          <line x1="5" x2="19" y1="12" y2="12"/>
        </svg>
      )
    },
    {
      path: "/balance", label: t("balance"),
      icon: (a: boolean) => (
        <svg width="21" height="21" viewBox="0 0 24 24" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth={a ? "0" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="5" rx="2"/>
          {!a && <line x1="2" x2="22" y1="10" y2="10"/>}
        </svg>
      ),
      badge: bal > 0 ? String(bal) : undefined
    },
    {
      path: "/profile", label: t("profile"),
      icon: (a: boolean) => (
        <svg width="21" height="21" viewBox="0 0 24 24" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth={a ? "0" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="5"/>
          <path d="M20 21a8 8 0 0 0-16 0"/>
        </svg>
      )
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="nav-floating px-1.5 pt-1.5 pb-2">
        <div className="flex items-end justify-around">
          {tabs.map((tab) => {
            const active = tab.path === "/" ? location === "/" : location.startsWith(tab.path);
            const isSpecial = (tab as any).special;
            return (
              <button
                key={tab.path}
                onClick={() => { hapticFeedback("light"); setLocation(tab.path); }}
                className={`relative flex flex-col items-center min-w-[48px] ${isSpecial ? 'pb-0' : 'py-0.5'}`}
              >
                {isSpecial ? (
                  <motion.div
                    whileTap={{ scale: 0.82 }}
                    className="w-[46px] h-[46px] rounded-[14px] flex items-center justify-center -mt-4 create-btn-glow"
                    style={{
                      background: "linear-gradient(145deg, #7C5CFC, #6336F5, #5226E8)",
                    }}>
                    {tab.icon(false)}
                  </motion.div>
                ) : (
                  <>
                    {active && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-[2.5px] rounded-full"
                        style={{ background: "linear-gradient(90deg, #7C5CFC, #3B82F6)" }}
                        transition={spring}
                      />
                    )}
                    <span className={`transition-colors duration-150 ${active ? "text-[#7C5CFC]" : "text-[#c4c4d0]"}`}>
                      {tab.icon(active)}
                    </span>
                  </>
                )}
                <span className={`text-[9px] font-semibold mt-0.5 transition-colors duration-150 ${
                  isSpecial ? "text-[#7C5CFC]" : active ? "text-[#7C5CFC]" : "text-[#c4c4d0]"
                }`}>
                  {tab.label}
                </span>
                {tab.badge && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-0.5 right-0 text-white text-[7px] font-bold min-w-[15px] h-[15px] flex items-center justify-center rounded-full px-1 z-20"
                    style={{
                      background: "linear-gradient(135deg, #7C5CFC, #3B82F6)",
                      boxShadow: "0 2px 8px rgba(124,92,252,0.35)",
                    }}>
                    {tab.badge}
                  </motion.span>
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
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden" style={{ background: "linear-gradient(160deg, #EEEDF8, #F0F0F8, #EDF5FF)" }}>
      <div className="app-bg">
        <div className="liquid-orb liquid-orb-1" />
        <div className="liquid-orb liquid-orb-2" />
        <div className="liquid-orb liquid-orb-3" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center relative z-10"
      >
        <div className="relative mb-8">
          <motion.div
            className="w-[80px] h-[80px] rounded-[24px] flex items-center justify-center"
            style={{
              background: "linear-gradient(145deg, #7C5CFC, #6336F5)",
              boxShadow: "0 12px 40px rgba(124,92,252,0.35), 0 2px 8px rgba(0,0,0,0.08)",
            }}
            animate={{ rotateY: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-white font-extrabold text-[32px] tracking-tighter" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>S</span>
          </motion.div>
          <motion.div
            className="absolute -inset-4 rounded-[30px]"
            style={{ border: "1.5px solid rgba(124,92,252,0.12)" }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.08, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute -inset-8 rounded-[36px]"
            style={{ border: "1px solid rgba(124,92,252,0.06)" }}
            animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.05, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
          />
        </div>
        <h1 className="text-[28px] font-extrabold tracking-tight mb-1.5 gradient-text-animated">StudyFlush</h1>
        <p className="text-[12px] text-[#8b90a0] mb-8 font-medium tracking-wide">{t("subtitle")}</p>
        <div className="w-36 h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(124,92,252,0.06)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #7C5CFC, #3B82F6, #06D6A0)" }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.2, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          />
        </div>
      </motion.div>
    </div>
  );
}

function ErrorScreen({ error, retry }: { error: string; retry: () => void }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6" style={{ background: "linear-gradient(160deg, #EEEDF8, #F0F0F8)" }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.4 }}
          className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-5"
          style={{ background: "rgba(255,90,90,0.08)" }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FF5A5A" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
        </motion.div>
        <h1 className="text-lg font-bold mb-1">{t("error")}</h1>
        <p className="text-sm text-[#8b90a0] mb-6">{error}</p>
        <button onClick={retry} className="btn-main px-8 py-3 text-sm">{t("tryAgain")}</button>
      </motion.div>
    </div>
  );
}

function AnimatedPage({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function useBackButton() {
  const [location, setLocation] = useLocation();
  const isHome = location === "/" || location === "";
  const goHome = useCallback(() => {
    hapticFeedback("light");
    setLocation("/");
  }, [setLocation]);

  useEffect(() => {
    if (isHome) {
      hideBackButton(goHome);
    } else {
      showBackButton(goHome);
    }
    return () => hideBackButton(goHome);
  }, [isHome, goHome]);
}

function AppContent() {
  const { loading, error, retry } = useInitApp();
  useLang();
  useBackButton();
  const [showOnboarding, setShowOnboarding] = useState(() => !isOnboardingDone());

  useEffect(() => {
    document.documentElement.style.colorScheme = 'light';
  }, []);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} retry={retry} />;
  if (showOnboarding) return <Onboarding onDone={() => setShowOnboarding(false)} />;

  return (
    <>
      <AmbientBg />
      <div className="min-h-screen relative z-10 pb-[88px]">
        <AnimatedPage>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/new" component={NewReport} />
            <Route path="/history" component={History} />
            <Route path="/balance" component={Balance} />
            <Route path="/profile" component={Profile} />
            <Route path="/support" component={Support} />
            <Route path="/admin" component={Admin} />
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
