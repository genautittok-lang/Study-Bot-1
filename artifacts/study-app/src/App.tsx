import { useEffect, useMemo } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useInitApp, useUser, useLang } from "@/lib/store";
import { hapticFeedback } from "@/lib/telegram";
import { t } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import Home from "@/pages/home";
import NewReport from "@/pages/new-report";
import History from "@/pages/history";
import Balance from "@/pages/balance";
import Profile from "@/pages/profile";
import Admin from "@/pages/admin";

const queryClient = new QueryClient();
const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

function LiquidBackground() {
  return (
    <>
      <div className="app-bg">
        <div className="liquid-blob liquid-blob-1" />
        <div className="liquid-blob liquid-blob-2" />
        <div className="liquid-blob liquid-blob-3" />
        <div className="liquid-blob liquid-blob-4" />
        <div className="liquid-blob liquid-blob-5" />
      </div>
      <WaterParticles />
    </>
  );
}

function WaterParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 0.8,
      duration: Math.random() * 18 + 14,
      delay: Math.random() * 14,
      opacity: Math.random() * 0.35 + 0.08,
      color: i % 4 === 0
        ? 'rgba(0,200,255,0.55)'
        : i % 4 === 1
        ? 'rgba(0,255,180,0.45)'
        : i % 4 === 2
        ? 'rgba(160,100,255,0.55)'
        : 'rgba(255,100,200,0.35)',
    })), []);

  return (
    <div className="particles">
      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          left: p.left,
          width: p.size,
          height: p.size,
          background: p.color,
          animationDuration: `${p.duration}s`,
          animationDelay: `${p.delay}s`,
          opacity: p.opacity,
          boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
        }} />
      ))}
    </div>
  );
}

function BottomNav() {
  const [location, setLocation] = useLocation();
  const user = useUser();
  useLang();

  const hasBalance = user ? (!user.freeReportsUsed ? user.balance + 1 : user.balance) : 0;

  if (location.startsWith("/admin")) return null;

  const tabs = [
    {
      path: "/", label: t("home"),
      icon: (a: boolean) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth={a ? "0" : "1.5"}>
          <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
          <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        </svg>
      )
    },
    {
      path: "/history", label: t("history"),
      icon: (a: boolean) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth={a ? "0" : "1.5"}>
          <circle cx="12" cy="12" r="10"/>
          {!a && <polyline points="12 6 12 12 16 14"/>}
        </svg>
      )
    },
    {
      path: "/new", label: t("create"), special: true,
      icon: (_a: boolean) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" x2="12" y1="5" y2="19"/>
          <line x1="5" x2="19" y1="12" y2="12"/>
        </svg>
      )
    },
    {
      path: "/balance", label: t("balance"),
      icon: (a: boolean) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth={a ? "0" : "1.5"}>
          <rect width="20" height="14" x="2" y="5" rx="2"/>
          {!a && <line x1="2" x2="22" y1="10" y2="10"/>}
        </svg>
      ),
      badge: hasBalance > 0 ? String(hasBalance) : undefined
    },
    {
      path: "/profile", label: t("profile"),
      icon: (a: boolean) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth={a ? "0" : "1.5"}>
          <circle cx="12" cy="8" r="5"/>
          <path d="M20 21a8 8 0 0 0-16 0"/>
        </svg>
      )
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="nav-bar px-2 pt-1.5 pb-2">
        <div className="flex items-end justify-around">
          {tabs.map((tab) => {
            const active = tab.path === "/" ? location === "/" : location.startsWith(tab.path);
            const isSpecial = (tab as any).special;
            return (
              <button
                key={tab.path}
                onClick={() => { hapticFeedback("light"); setLocation(tab.path); }}
                className={`relative flex flex-col items-center gap-0.5 min-w-[52px] ${isSpecial ? 'pb-1' : 'py-1.5 px-2'}`}
              >
                {isSpecial ? (
                  <motion.div
                    whileTap={{ scale: 0.88 }}
                    className="w-[56px] h-[56px] rounded-[20px] flex items-center justify-center -mt-7 create-btn-glow"
                    style={{
                      background: "linear-gradient(135deg, rgba(130,80,255,0.9), rgba(100,40,240,0.95), rgba(60,10,200,0.9))",
                      border: "1px solid rgba(255,255,255,0.18)",
                      backdropFilter: "blur(20px)",
                    }}>
                    <span className="text-white">{tab.icon(false)}</span>
                  </motion.div>
                ) : (
                  <>
                    {active && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-[3px] rounded-full"
                        style={{
                          background: "linear-gradient(90deg, #9B7FFF, #06B6D4)",
                          boxShadow: "0 0 12px rgba(155,127,255,0.7), 0 0 24px rgba(155,127,255,0.3)"
                        }}
                        transition={{ type: "spring", bounce: 0.1, duration: 0.45 }}
                      />
                    )}
                    <span className={`relative z-10 transition-colors duration-200 ${active ? "text-[#c4b5fd]" : "text-[rgba(255,255,255,0.22)]"}`}>
                      {tab.icon(active)}
                    </span>
                  </>
                )}
                <span className={`relative z-10 text-[10px] font-semibold transition-colors duration-200 ${isSpecial ? "text-[#c4b5fd]" : active ? "text-[#c4b5fd]" : "text-[rgba(255,255,255,0.22)]"}`}>
                  {tab.label}
                </span>
                {tab.badge && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute top-0.5 right-0.5 text-white text-[8px] font-bold min-w-[16px] h-[16px] flex items-center justify-center rounded-full px-1 z-20"
                    style={{
                      background: "linear-gradient(135deg, #9B7FFF, #06B6D4)",
                      boxShadow: "0 0 10px rgba(155,127,255,0.5)"
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
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden" style={{ background: "#03040a" }}>
      <div className="app-bg">
        <div className="liquid-blob liquid-blob-1" />
        <div className="liquid-blob liquid-blob-2" />
        <div className="liquid-blob liquid-blob-3" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center relative z-10"
      >
        <div className="relative mb-8">
          <motion.div
            className="w-[80px] h-[80px] rounded-[26px] flex items-center justify-center relative overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(60px) saturate(200%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 0 80px rgba(110,50,255,0.4), 0 8px 40px rgba(110,50,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
            animate={{
              boxShadow: [
                "0 0 80px rgba(110,50,255,0.4), 0 8px 40px rgba(110,50,255,0.2)",
                "0 0 120px rgba(0,200,255,0.4), 0 8px 40px rgba(0,200,255,0.2)",
                "0 0 80px rgba(110,50,255,0.4), 0 8px 40px rgba(110,50,255,0.2)",
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="gradient-text font-extrabold text-[32px] tracking-tighter relative z-10">S</span>
            <div className="absolute inset-0 rounded-[26px]"
              style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 60%)" }} />
          </motion.div>

          {/* Spinning holographic ring */}
          <motion.div
            className="absolute -inset-5 rounded-[40px]"
            style={{
              border: "1px solid transparent",
              background: "linear-gradient(#03040a, #03040a) padding-box, conic-gradient(from 0deg, #8B5CF6, #06B6D4, #10B981, #EC4899, #8B5CF6) border-box",
              opacity: 0.3,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute -inset-8 rounded-[48px]"
            style={{ border: "1px solid rgba(140,80,255,0.15)" }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.08, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </div>

        <h1 className="text-[26px] font-extrabold tracking-tight mb-1.5 gradient-text text-glow-purple">StudyPro</h1>
        <p className="text-[12px] text-white/20 mb-8 font-medium">{t("subtitle")}</p>

        <div className="w-44 h-[2px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #8B5CF6, #06B6D4, #10B981, #8B5CF6)", backgroundSize: "200% 100%" }}
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
    <div className="min-h-screen w-full flex items-center justify-center px-6" style={{ background: "#03040a" }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.4 }}
          className="w-16 h-16 rounded-[22px] flex items-center justify-center mb-5"
          style={{
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.12)",
            backdropFilter: "blur(40px)",
            boxShadow: "0 0 30px rgba(239,68,68,0.08)"
          }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" x2="12" y1="8" y2="12"/>
            <line x1="12" x2="12.01" y1="16" y2="16"/>
          </svg>
        </motion.div>
        <h1 className="text-lg font-bold text-white mb-1">{t("error")}</h1>
        <p className="text-sm text-white/35 mb-6">{error}</p>
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
        initial={{ opacity: 0, y: 10, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.99 }}
        transition={{ duration: 0.28, ease }}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function AppContent() {
  const { loading, error, retry } = useInitApp();
  useLang();

  useEffect(() => {
    document.documentElement.style.colorScheme = 'dark';
  }, []);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} retry={retry} />;

  return (
    <>
      <LiquidBackground />
      <div className="min-h-screen relative z-10 pb-20">
        <AnimatedPage>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/new" component={NewReport} />
            <Route path="/history" component={History} />
            <Route path="/balance" component={Balance} />
            <Route path="/profile" component={Profile} />
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
