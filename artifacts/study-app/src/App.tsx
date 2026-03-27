import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useInitApp } from "@/lib/store";
import { hapticFeedback } from "@/lib/telegram";
import Home from "@/pages/home";
import NewReport from "@/pages/new-report";
import History from "@/pages/history";
import Balance from "@/pages/balance";

const queryClient = new QueryClient();

function BottomNav() {
  const [location, setLocation] = useLocation();

  const tabs = [
    { path: "/", label: "Головна", icon: "🏠" },
    { path: "/new", label: "Створити", icon: "✨" },
    { path: "/history", label: "Історія", icon: "📚" },
    { path: "/balance", label: "Баланс", icon: "💰" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const active = location === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => {
                hapticFeedback("light");
                setLocation(tab.path);
              }}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-4 rounded-xl transition-colors ${
                active
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className={`text-[10px] font-medium ${active ? "text-primary" : ""}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
          <span className="text-3xl">🎓</span>
        </div>
        <h1 className="text-lg font-bold text-foreground mb-2">StudyBot</h1>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorScreen({ error, retry }: { error: string; retry: () => void }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-6">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
          <span className="text-3xl">😔</span>
        </div>
        <h1 className="text-lg font-bold text-foreground mb-2">Помилка</h1>
        <p className="text-sm text-muted-foreground mb-6">{error}</p>
        <button
          onClick={retry}
          className="bg-primary text-primary-foreground rounded-xl px-6 py-3 font-semibold text-sm"
        >
          Спробувати ще раз
        </button>
      </div>
    </div>
  );
}

function AppContent() {
  const { loading, error, retry } = useInitApp();

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} retry={retry} />;

  return (
    <>
      <div className="min-h-screen bg-background">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/new" component={NewReport} />
          <Route path="/history" component={History} />
          <Route path="/balance" component={Balance} />
          <Route>
            <Home />
          </Route>
        </Switch>
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
