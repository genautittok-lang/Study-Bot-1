import { useState } from "react";
import { useUser } from "@/lib/store";
import { createPayment } from "@/lib/api";
import { hapticFeedback, hapticSuccess } from "@/lib/telegram";

type PaymentView = "main" | "mono" | "crypto" | "stars" | "pending";

export default function Balance() {
  const user = useUser();
  const [view, setView] = useState<PaymentView>("main");

  const availableReports = user
    ? (!user.freeReportsUsed ? user.balance + 1 : user.balance)
    : 0;

  async function handlePaymentConfirm(method: string) {
    if (!user) return;
    hapticFeedback("medium");
    await createPayment({
      telegramId: user.telegramId,
      paymentMethod: method,
    });
    hapticSuccess();
    setView("pending");
  }

  if (view === "mono") {
    return (
      <div className="px-4 pt-6 pb-28">
        <button
          onClick={() => {
            hapticFeedback("light");
            setView("main");
          }}
          className="text-primary text-sm font-medium mb-4 flex items-center gap-1"
        >
          ← Назад
        </button>

        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💳</span>
            </div>
            <div>
              <div className="font-bold">Monobank</div>
              <div className="text-sm text-muted-foreground">250 грн = 15 звітів</div>
            </div>
          </div>

          <div className="bg-muted rounded-xl p-3 mb-4">
            <div className="text-xs text-muted-foreground mb-1">Номер картки:</div>
            <div className="font-mono text-lg font-bold tracking-wider">5375 4141 2121 2120</div>
          </div>

          <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-sm">
            <div className="font-medium text-yellow-800 mb-1">⚠️ Важливо!</div>
            <div className="text-yellow-700">
              В коментарі до переказу вкажи свій ID:
              <div className="font-mono font-bold mt-1">{user?.telegramId}</div>
            </div>
          </div>
        </div>

        <button
          onClick={() => handlePaymentConfirm("mono")}
          className="w-full bg-primary text-primary-foreground rounded-xl py-3.5 font-semibold text-sm active:scale-[0.98] transition-transform"
        >
          ✅ Я оплатив
        </button>
      </div>
    );
  }

  if (view === "crypto") {
    return (
      <div className="px-4 pt-6 pb-28">
        <button
          onClick={() => {
            hapticFeedback("light");
            setView("main");
          }}
          className="text-primary text-sm font-medium mb-4 flex items-center gap-1"
        >
          ← Назад
        </button>

        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💎</span>
            </div>
            <div>
              <div className="font-bold">Криптовалюта</div>
              <div className="text-sm text-muted-foreground">5 USDT = 15 звітів</div>
            </div>
          </div>

          <div className="bg-muted rounded-xl p-3 mb-4">
            <div className="text-xs text-muted-foreground mb-1">Адреса (TRC-20):</div>
            <div className="font-mono text-xs font-bold break-all">
              TLdH6NMj7g3jKcB6pnEPr5wfbUjqTe5GxP
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-700">
            Після переказу надішли хеш транзакції в чат підтримки
          </div>
        </div>

        <button
          onClick={() => handlePaymentConfirm("crypto")}
          className="w-full bg-primary text-primary-foreground rounded-xl py-3.5 font-semibold text-sm active:scale-[0.98] transition-transform"
        >
          ✅ Я оплатив
        </button>
      </div>
    );
  }

  if (view === "stars") {
    return (
      <div className="px-4 pt-6 pb-28">
        <button
          onClick={() => {
            hapticFeedback("light");
            setView("main");
          }}
          className="text-primary text-sm font-medium mb-4 flex items-center gap-1"
        >
          ← Назад
        </button>

        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
            <div>
              <div className="font-bold">Telegram Stars</div>
              <div className="text-sm text-muted-foreground">500 Stars = 15 звітів</div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-700">
            Для оплати через Telegram Stars напиши боту команду:
            <div className="font-mono font-bold mt-1">/buy_stars</div>
            або натисни кнопку "Купити" в меню бота
          </div>
        </div>

        <button
          onClick={() => handlePaymentConfirm("stars")}
          className="w-full bg-primary text-primary-foreground rounded-xl py-3.5 font-semibold text-sm active:scale-[0.98] transition-transform"
        >
          Оплатити в боті
        </button>
      </div>
    );
  }

  if (view === "pending") {
    return (
      <div className="px-4 pt-16 pb-28 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
          <span className="text-3xl">⏳</span>
        </div>
        <h2 className="text-xl font-bold mb-2">Дякуємо!</h2>
        <p className="text-muted-foreground text-sm text-center max-w-[260px] mb-6">
          Ми перевіримо оплату протягом 24 годин. Після підтвердження баланс буде поповнено!
        </p>
        <button
          onClick={() => setView("main")}
          className="bg-secondary text-secondary-foreground rounded-xl px-6 py-3 font-medium text-sm"
        >
          🏠 Повернутися
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-28">
      <h2 className="text-xl font-bold mb-1">Баланс</h2>
      <p className="text-muted-foreground text-sm mb-5">Керуй своїми звітами</p>

      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 mb-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium opacity-90">Доступно звітів</span>
          <span className="text-sm opacity-70">Всього: {user?.totalReports || 0}</span>
        </div>
        <div className="text-5xl font-bold mb-1">{availableReports}</div>
        {!user?.freeReportsUsed && (
          <div className="mt-2 bg-white/20 rounded-lg px-3 py-1.5 inline-block text-sm">
            🎁 +1 безкоштовний
          </div>
        )}
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-sm mb-3">Поповнити баланс</h3>
        <div className="space-y-2.5">
          <button
            onClick={() => {
              hapticFeedback("light");
              setView("mono");
            }}
            className="w-full bg-card rounded-2xl p-4 text-left shadow-sm border border-border flex items-center gap-4 active:scale-[0.98] transition-transform"
          >
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-2xl">💳</span>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">Monobank</div>
              <div className="text-xs text-muted-foreground">Переказ на картку</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-sm text-foreground">250 ₴</div>
              <div className="text-xs text-muted-foreground">15 звітів</div>
            </div>
          </button>

          <button
            onClick={() => {
              hapticFeedback("light");
              setView("crypto");
            }}
            className="w-full bg-card rounded-2xl p-4 text-left shadow-sm border border-border flex items-center gap-4 active:scale-[0.98] transition-transform"
          >
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-2xl">💎</span>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">Крипто</div>
              <div className="text-xs text-muted-foreground">USDT / USDC (TRC-20)</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-sm text-foreground">5 $</div>
              <div className="text-xs text-muted-foreground">15 звітів</div>
            </div>
          </button>

          <button
            onClick={() => {
              hapticFeedback("light");
              setView("stars");
            }}
            className="w-full bg-card rounded-2xl p-4 text-left shadow-sm border border-border flex items-center gap-4 active:scale-[0.98] transition-transform"
          >
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-2xl">⭐</span>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">Telegram Stars</div>
              <div className="text-xs text-muted-foreground">Оплата через Telegram</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-sm text-foreground">500 ⭐</div>
              <div className="text-xs text-muted-foreground">15 звітів</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
