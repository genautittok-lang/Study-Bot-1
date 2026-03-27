import { useUser } from "@/lib/store";
import { useLocation } from "wouter";
import { hapticFeedback } from "@/lib/telegram";

export default function Home() {
  const user = useUser();
  const [, setLocation] = useLocation();

  const availableReports = user
    ? (!user.freeReportsUsed ? user.balance + 1 : user.balance)
    : 0;

  return (
    <div className="px-4 pt-6 pb-28">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Привіт, {user?.firstName || "Студент"}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Твій розумний помічник для навчання
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 mb-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium opacity-90">Твій баланс</span>
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-lg">✨</span>
          </div>
        </div>
        <div className="text-4xl font-bold mb-1">{availableReports}</div>
        <div className="text-sm opacity-80">
          {availableReports === 1 ? "звіт" : availableReports < 5 ? "звіти" : "звітів"} доступно
        </div>
        {!user?.freeReportsUsed && (
          <div className="mt-3 bg-white/20 rounded-xl px-3 py-2 inline-block">
            <span className="text-sm font-medium">🎁 Перший звіт безкоштовно!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => {
            hapticFeedback("medium");
            setLocation("/new");
          }}
          className="bg-card rounded-2xl p-4 text-left shadow-sm border border-border active:scale-[0.97] transition-transform"
        >
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
            <span className="text-xl">📝</span>
          </div>
          <div className="font-semibold text-foreground text-sm">Новий звіт</div>
          <div className="text-xs text-muted-foreground mt-0.5">Згенерувати AI</div>
        </button>

        <button
          onClick={() => {
            hapticFeedback("light");
            setLocation("/history");
          }}
          className="bg-card rounded-2xl p-4 text-left shadow-sm border border-border active:scale-[0.97] transition-transform"
        >
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-3">
            <span className="text-xl">📚</span>
          </div>
          <div className="font-semibold text-foreground text-sm">Історія</div>
          <div className="text-xs text-muted-foreground mt-0.5">Мої звіти</div>
        </button>

        <button
          onClick={() => {
            hapticFeedback("light");
            setLocation("/balance");
          }}
          className="bg-card rounded-2xl p-4 text-left shadow-sm border border-border active:scale-[0.97] transition-transform"
        >
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-3">
            <span className="text-xl">💳</span>
          </div>
          <div className="font-semibold text-foreground text-sm">Поповнити</div>
          <div className="text-xs text-muted-foreground mt-0.5">Купити звіти</div>
        </button>

        <button
          onClick={() => {
            hapticFeedback("light");
            setLocation("/balance");
          }}
          className="bg-card rounded-2xl p-4 text-left shadow-sm border border-border active:scale-[0.97] transition-transform"
        >
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-3">
            <span className="text-xl">📊</span>
          </div>
          <div className="font-semibold text-foreground text-sm">Статистика</div>
          <div className="text-xs text-muted-foreground mt-0.5">{user?.totalReports || 0} звітів</div>
        </button>
      </div>

      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
            <span className="text-base">⚡</span>
          </div>
          <div className="font-semibold text-sm">Швидкий старт</div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Вибери тип документу, предмет і тему — AI зробить все за тебе
          за 10-30 секунд!
        </p>
        <button
          onClick={() => {
            hapticFeedback("medium");
            setLocation("/new");
          }}
          className="mt-3 w-full bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-sm active:scale-[0.98] transition-transform"
        >
          Створити звіт
        </button>
      </div>
    </div>
  );
}
