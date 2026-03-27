import { useState } from "react";
import { useLocation } from "wouter";
import { useUser, setUser } from "@/lib/store";
import { generateReport } from "@/lib/api";
import { REPORT_TYPES, SUBJECTS } from "@/lib/constants";
import { hapticFeedback, hapticSuccess, hapticError } from "@/lib/telegram";

type Step = "type" | "subject" | "details" | "generating" | "done" | "error";

export default function NewReport() {
  const user = useUser();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>("type");
  const [reportType, setReportType] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [group, setGroup] = useState("");
  const [result, setResult] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState("");

  const canGenerate = user
    ? (!user.freeReportsUsed || user.balance > 0)
    : false;

  async function handleGenerate() {
    if (!user || !topic.trim()) return;

    if (!canGenerate) {
      hapticError();
      setLocation("/balance");
      return;
    }

    setStep("generating");
    hapticFeedback("medium");

    try {
      const res = await generateReport({
        telegramId: user.telegramId,
        reportType,
        subject,
        topic: topic.trim(),
        group: group.trim() || undefined,
      });

      if (res.success && res.content) {
        hapticSuccess();
        setResult(res.content);
        setUser({
          ...user,
          balance: res.remainingBalance ?? user.balance,
          freeReportsUsed: true,
          totalReports: user.totalReports + 1,
        });
        setStep("done");
      } else {
        hapticError();
        setErrorMsg(res.error === "no_balance" ? "Недостатньо звітів на балансі" : "Помилка генерації");
        setStep("error");
      }
    } catch {
      hapticError();
      setErrorMsg("Помилка з'єднання. Спробуй ще раз.");
      setStep("error");
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(result);
    hapticSuccess();
  }

  if (step === "generating") {
    return (
      <div className="px-4 pt-16 pb-28 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
          <span className="text-3xl">🤖</span>
        </div>
        <h2 className="text-xl font-bold mb-2">Генерую...</h2>
        <p className="text-muted-foreground text-sm text-center max-w-[250px]">
          AI працює над твоїм завданням. Зазвичай це займає 10-30 секунд
        </p>
        <div className="mt-6 flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="px-4 pt-6 pb-28">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
            <span className="text-xl">✅</span>
          </div>
          <div>
            <h2 className="text-lg font-bold">Готово!</h2>
            <p className="text-xs text-muted-foreground">Твій документ згенеровано</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={copyToClipboard}
            className="flex-1 bg-primary text-primary-foreground rounded-xl py-2.5 text-sm font-medium active:scale-[0.97] transition-transform"
          >
            📋 Копіювати
          </button>
          <button
            onClick={() => {
              setStep("type");
              setReportType("");
              setSubject("");
              setTopic("");
              setGroup("");
              setResult("");
            }}
            className="flex-1 bg-secondary text-secondary-foreground rounded-xl py-2.5 text-sm font-medium active:scale-[0.97] transition-transform"
          >
            ➕ Новий
          </button>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
          <div className="prose prose-sm max-w-none text-foreground text-sm leading-relaxed whitespace-pre-wrap break-words select-text">
            {result}
          </div>
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="px-4 pt-16 pb-28 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
          <span className="text-3xl">😔</span>
        </div>
        <h2 className="text-xl font-bold mb-2">Помилка</h2>
        <p className="text-muted-foreground text-sm text-center mb-6">{errorMsg}</p>
        <button
          onClick={() => setStep("details")}
          className="bg-primary text-primary-foreground rounded-xl px-6 py-3 font-semibold text-sm"
        >
          Спробувати ще
        </button>
      </div>
    );
  }

  if (step === "type") {
    return (
      <div className="px-4 pt-6 pb-28">
        <h2 className="text-xl font-bold mb-1">Новий документ</h2>
        <p className="text-muted-foreground text-sm mb-5">Вибери тип документу</p>

        <div className="space-y-2.5">
          {REPORT_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                hapticFeedback("light");
                setReportType(type.id);
                setStep("subject");
              }}
              className="w-full bg-card rounded-2xl p-4 text-left shadow-sm border border-border flex items-center gap-4 active:scale-[0.98] transition-transform"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-2xl">{type.icon}</span>
              </div>
              <div>
                <div className="font-semibold text-foreground">{type.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{type.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === "subject") {
    return (
      <div className="px-4 pt-6 pb-28">
        <button
          onClick={() => {
            hapticFeedback("light");
            setStep("type");
          }}
          className="text-primary text-sm font-medium mb-4 flex items-center gap-1"
        >
          ← Назад
        </button>
        <h2 className="text-xl font-bold mb-1">Предмет</h2>
        <p className="text-muted-foreground text-sm mb-5">Вибери предмет</p>

        <div className="grid grid-cols-2 gap-2.5">
          {SUBJECTS.map((sub) => (
            <button
              key={sub.id}
              onClick={() => {
                hapticFeedback("light");
                setSubject(sub.id);
                setStep("details");
              }}
              className="bg-card rounded-2xl p-4 text-left shadow-sm border border-border active:scale-[0.97] transition-transform"
            >
              <div className="text-2xl mb-2">{sub.icon}</div>
              <div className="font-medium text-foreground text-sm">{sub.label}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const selectedType = REPORT_TYPES.find((t) => t.id === reportType);
  const selectedSubject = SUBJECTS.find((s) => s.id === subject);

  return (
    <div className="px-4 pt-6 pb-28">
      <button
        onClick={() => {
          hapticFeedback("light");
          setStep("subject");
        }}
        className="text-primary text-sm font-medium mb-4 flex items-center gap-1"
      >
        ← Назад
      </button>
      <h2 className="text-xl font-bold mb-1">Деталі</h2>
      <p className="text-muted-foreground text-sm mb-5">Опиши що потрібно</p>

      <div className="flex gap-2 mb-5">
        <div className="bg-blue-50 text-blue-700 rounded-xl px-3 py-1.5 text-xs font-medium">
          {selectedType?.icon} {selectedType?.label}
        </div>
        <div className="bg-green-50 text-green-700 rounded-xl px-3 py-1.5 text-xs font-medium">
          {selectedSubject?.icon} {selectedSubject?.label}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">
            Тема / Завдання *
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Наприклад: Лабораторна робота з Python — сортування масивів бульбашковим методом"
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground/60"
            rows={4}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">
            Група / Клас
          </label>
          <input
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            placeholder="Наприклад: ІТ-21, 11-А (необов'язково)"
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      {!canGenerate && (
        <div className="mt-4 bg-red-50 text-red-700 rounded-xl p-3 text-sm">
          ❌ Недостатньо звітів.{" "}
          <button
            onClick={() => setLocation("/balance")}
            className="underline font-medium"
          >
            Поповнити баланс
          </button>
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={!topic.trim() || !canGenerate}
        className="mt-6 w-full bg-primary text-primary-foreground rounded-xl py-3.5 font-semibold text-sm disabled:opacity-40 active:scale-[0.98] transition-transform"
      >
        ✨ Згенерувати
      </button>
    </div>
  );
}
