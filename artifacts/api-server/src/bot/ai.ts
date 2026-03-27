import OpenAI from "openai";

if (!process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || !process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
  throw new Error("OpenAI AI integration env vars are missing");
}

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

const REPORT_TYPE_NAMES: Record<string, string> = {
  report: "Звіт",
  summary: "Конспект",
  database: "База даних",
  lab: "Лабораторна робота",
  essay: "Реферат",
  tasks: "Задачі",
};

const SUBJECT_NAMES: Record<string, string> = {
  programming: "Програмування",
  math: "Математика",
  physics: "Фізика",
  chemistry: "Хімія",
  biology: "Біологія",
  history: "Історія",
  geography: "Географія",
  databases: "Бази Даних",
  networks: "Комп'ютерні мережі",
  economics: "Економіка",
  other: "Загальний предмет",
};

export async function generateReport(
  reportType: string,
  subject: string,
  topic: string,
  group?: string | null
): Promise<string> {
  const reportTypeName = REPORT_TYPE_NAMES[reportType] || reportType;
  const subjectName = SUBJECT_NAMES[subject] || subject;

  const systemPrompt = `Ти — експертний викладач та автор академічних робіт українською мовою. 
Твоя задача — генерувати якісні навчальні матеріали для студентів та учнів. 
Завжди пиши українською мовою. Роботи мають бути структурованими, детальними та академічними.
Використовуй відповідне форматування: заголовки, підзаголовки, списки, таблиці де потрібно.`;

  let userPrompt = "";

  if (reportType === "database") {
    userPrompt = `Створи базу даних (${subjectName}) на тему: "${topic}"
${group ? `Для групи/класу: ${group}` : ""}

Включи:
1. Опис предметної області
2. ER-діаграму (текстовий опис сутностей та зв'язків)
3. SQL-скрипт створення таблиць (мінімум 4-5 таблиць)
4. Приклади INSERT запитів (по 3-5 записів в кожну таблицю)
5. Приклади SELECT запитів різної складності (мінімум 5 запитів)
6. Висновок

Формат відповіді: структурований текст з кодом у блоках \`\`\`sql`;
  } else if (reportType === "lab") {
    userPrompt = `Напиши повну лабораторну роботу з предмету "${subjectName}" на тему: "${topic}"
${group ? `Для групи/класу: ${group}` : ""}

Структура:
1. Тема лабораторної роботи
2. Мета роботи
3. Обладнання та матеріали / Програмне забезпечення
4. Теоретичні відомості (розгорнуто)
5. Хід роботи (покроково з поясненнями)
6. Код програми (якщо є, у блоках \`\`\`)
7. Результати виконання
8. Висновки`;
  } else if (reportType === "summary") {
    userPrompt = `Напиши детальний конспект з предмету "${subjectName}" на тему: "${topic}"
${group ? `Для групи/класу: ${group}` : ""}

Структура:
1. Основні поняття та визначення
2. Ключові теоретичні аспекти (розгорнуто)
3. Схеми та класифікації
4. Практичне застосування
5. Приклади
6. Запитання для самоперевірки`;
  } else if (reportType === "essay") {
    userPrompt = `Напиши академічний реферат з предмету "${subjectName}" на тему: "${topic}"
${group ? `Для групи/класу: ${group}` : ""}

Структура:
1. Вступ (актуальність, мета, завдання)
2. Основна частина (3-4 розділи з підрозділами)
3. Висновки
4. Список використаних джерел (10+ джерел)

Обсяг: розгорнутий, академічний стиль`;
  } else if (reportType === "tasks") {
    userPrompt = `Склади та розв'яжи задачі з предмету "${subjectName}" на тему: "${topic}"
${group ? `Для групи/класу: ${group}` : ""}

Включи:
1. 5 задач різної складності (від простих до складних)
2. Для кожної задачі: умова, розв'язання, відповідь
3. Пояснення методів розв'язання
4. Теоретичну довідку до теми`;
  } else {
    userPrompt = `Напиши детальний звіт з предмету "${subjectName}" на тему: "${topic}"
${group ? `Для групи/класу: ${group}` : ""}

Структура:
1. Вступ (мета, завдання, актуальність)
2. Теоретична частина (розгорнуто)
3. Практична частина
4. Аналіз результатів
5. Висновки та рекомендації`;
  }

  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 8192,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  return response.choices[0]?.message?.content ?? "Помилка генерації. Спробуй ще раз.";
}
