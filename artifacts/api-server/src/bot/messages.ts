export const MESSAGES = {
  WELCOME: (firstName: string) => `
🎓 *Welcome to StudyFlush, ${firstName}!*
Your smart AI assistant for academic work!

✨ *What I can do:*
📄 Generate reports on any subject
📝 Create summaries & notes
📊 Write lab reports
📋 Essays, coursework & more

🎁 *Your first report is FREE!*
Try it now — no payment needed!

—

🇺🇦 *Привіт, ${firstName}!*
Ласкаво просимо до *StudyFlush* — твій AI-помічник для навчання!

✨ *Що я вмію:*
📄 Генерую звіти з будь-якого предмету
📝 Роблю конспекти та шпаргалки
📊 Пишу лабораторні роботи
🔢 Вирішую задачі по темі

🎁 *Перший звіт — безкоштовно!*

👇 Tap the button below / Натисни кнопку нижче:
`,

  MAIN_MENU: `
🏠 *Головне меню*

Обери що хочеш зробити:
`,

  SELECT_REPORT_TYPE: `
📋 *Вибери тип документу*

Що потрібно згенерувати?
`,

  SELECT_SUBJECT: `
📚 *Вибери предмет*

З якого предмету генерувати?
`,

  ENTER_TOPIC: (reportType: string, subject: string) => `
✏️ *Введи тему*

Тип: *${reportType}*
Предмет: *${subject}*

Напиши тему або завдання детально. Чим більше деталей — тим кращий результат!

_Наприклад: "Лабораторна робота з програмування мовою Python, тема: сортування масивів"_
`,

  ENTER_GROUP: `
👥 *Введи групу/клас (необов'язково)*

Введи номер групи або клас (наприклад: ІТ-21, 11-А)
або натисни /skip щоб пропустити
`,

  GENERATING: `
⚙️ *Генерую для тебе...*

Зачекай трохи, AI працює над твоїм завданням! 🤖

_Зазвичай займає 10-30 секунд_
`,

  NO_BALANCE: `
❌ *Недостатньо звітів*

На твоєму балансі немає доступних звітів.

💳 *Придбай підписку:*
15 звітів за *250 грн* або *5$* в крипті

Обери спосіб оплати 👇
`,

  BALANCE: (balance: number, freeUsed: boolean, totalReports: number) => `
💰 *Твій баланс*

📊 Доступних звітів: *${balance}*
${!freeUsed ? "🎁 Безкоштовний звіт: *доступний*" : "🎁 Безкоштовний звіт: *використано*"}
📈 Всього згенеровано: *${totalReports}*

💳 *Придбати більше звітів:*
`,

  PAYMENT_MONO: `
💳 *Оплата через Monobank*

Сума: *250 грн* за 15 звітів

📲 Переведи 250 грн на:
\`\`\`
5232 4410 5654 6307
\`\`\`
Отримувач: *StudyFlush*

⚠️ *ВАЖЛИВО:* В коментарі до переказу обов'язково вкажи свій Telegram ID:
\`${0}\`

Після оплати надішли скріншот прямо сюди в чат з ботом 👇
`,

  PAYMENT_CRYPTO: `
💎 *Оплата в криптовалюті*

Сума: *5 USDT* або *5 USDC*

📍 Адреса гаманця (TRC-20 / ERC-20):
\`\`\`
TRYbty4Ew9knf61brdrixeY5M34mQTt3zY
\`\`\`

⚠️ *ВАЖЛИВО:* Після оплати надішли скріншот транзакції прямо сюди в чат з ботом 👇
`,

  PAYMENT_STARS: `
⭐ *Оплата Telegram Stars*

Сума: *500 Stars* = 15 звітів

Натисни кнопку нижче для оплати через Telegram:
`,

  PAYMENT_PENDING: `
⏳ *Очікуємо підтвердження оплати*

Ми перевіряємо твою оплату. Зазвичай це займає до 24 годин.
Після підтвердження ти отримаєш повідомлення.

Питання? Напиши /help або /menu
`,

  REPORT_READY: (content: string) => `✅ *Готово!*\n\n${content}`,

  HELP: `
ℹ️ *Help / Довідка*

🇬🇧 *How to use the bot:*
1️⃣ Tap "Open StudyFlush"
2️⃣ Choose document type
3️⃣ Select a subject
4️⃣ Enter your topic
5️⃣ Get your document!

🇺🇦 *Як користуватися ботом:*
1️⃣ Натисни "Open StudyFlush"
2️⃣ Вибери тип документу
3️⃣ Вибери предмет
4️⃣ Введи тему
5️⃣ Отримай готовий документ!

📄 Reports, summaries, lab work, essays, coursework, diploma & more

💬 Need help? Send /menu or /help
`,
};

export const REPORT_TYPES = [
  { id: "report", label: "📄 Звіт" },
  { id: "summary", label: "📝 Конспект" },
  { id: "database", label: "🗄 База даних" },
  { id: "lab", label: "📊 Лабораторна" },
  { id: "essay", label: "📋 Реферат" },
  { id: "tasks", label: "🔢 Задачі" },
];

export const SUBJECTS = [
  { id: "programming", label: "💻 Програмування" },
  { id: "math", label: "🔢 Математика" },
  { id: "physics", label: "⚡ Фізика" },
  { id: "chemistry", label: "🧪 Хімія" },
  { id: "biology", label: "🌿 Біологія" },
  { id: "history", label: "📜 Історія" },
  { id: "geography", label: "🌍 Географія" },
  { id: "databases", label: "🗄 Бази Даних" },
  { id: "networks", label: "🌐 Мережі" },
  { id: "economics", label: "💰 Економіка" },
  { id: "other", label: "📚 Інше" },
];
