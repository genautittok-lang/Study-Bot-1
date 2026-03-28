export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", flag: "🇺🇦" },
  { code: "kk", name: "Kazakh", nativeName: "Қазақша", flag: "🇰🇿" },
  { code: "uz", name: "Uzbek", nativeName: "O'zbekcha", flag: "🇺🇿" },
  { code: "ky", name: "Kyrgyz", nativeName: "Кыргызча", flag: "🇰🇬" },
  { code: "tg", name: "Tajik", nativeName: "Тоҷикӣ", flag: "🇹🇯" },
  { code: "tk", name: "Turkmen", nativeName: "Türkmençe", flag: "🇹🇲" },
  { code: "az", name: "Azerbaijani", nativeName: "Azərbaycanca", flag: "🇦🇿" },
  { code: "hy", name: "Armenian", nativeName: "Հայերեն", flag: "🇦🇲" },
  { code: "ka", name: "Georgian", nativeName: "ქართული", flag: "🇬🇪" },
  { code: "be", name: "Belarusian", nativeName: "Беларуская", flag: "🇧🇾" },
  { code: "md", name: "Moldovan", nativeName: "Moldovenească", flag: "🇲🇩" },
  { code: "mn", name: "Mongolian", nativeName: "Монгол", flag: "🇲🇳" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "ro", name: "Romanian", nativeName: "Română", flag: "🇷🇴" },
  { code: "cs", name: "Czech", nativeName: "Čeština", flag: "🇨🇿" },
  { code: "bg", name: "Bulgarian", nativeName: "Български", flag: "🇧🇬" },
  { code: "sr", name: "Serbian", nativeName: "Српски", flag: "🇷🇸" },
  { code: "hr", name: "Croatian", nativeName: "Hrvatski", flag: "🇭🇷" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
];

type TranslationKeys = {
  appName: string;
  welcome: string;
  subtitle: string;
  yourBalance: string;
  reportsAvailable: string;
  report1: string;
  reports2_4: string;
  reports5: string;
  firstReportFree: string;
  newReport: string;
  generateAI: string;
  history: string;
  myReports: string;
  topUp: string;
  buyReports: string;
  stats: string;
  quickStart: string;
  quickStartDesc: string;
  createReport: string;
  home: string;
  create: string;
  balance: string;
  profile: string;
  newDocument: string;
  chooseDocType: string;
  subject: string;
  chooseSubject: string;
  details: string;
  describeTask: string;
  topicLabel: string;
  topicPlaceholder: string;
  groupLabel: string;
  groupPlaceholder: string;
  generate: string;
  generating: string;
  generatingDesc: string;
  done: string;
  docGenerated: string;
  copy: string;
  newOne: string;
  error: string;
  tryAgain: string;
  noBalance: string;
  topUpBalance: string;
  connectionError: string;
  back: string;
  reportsGenerated: string;
  docsHere: string;
  noReportsYet: string;
  createFirst: string;
  copyText: string;
  contentUnavailable: string;
  manageReports: string;
  availableReports: string;
  total: string;
  freeReport: string;
  monobank: string;
  cardTransfer: string;
  crypto: string;
  cryptoDesc: string;
  telegramStars: string;
  payViaTelegram: string;
  cardNumber: string;
  important: string;
  monoNote: string;
  iPaid: string;
  cryptoAddress: string;
  cryptoNote: string;
  starsNote: string;
  starsCmd: string;
  payInBot: string;
  thankYou: string;
  paymentPending: string;
  goBack: string;
  reports15: string;
  loadError: string;
  profileTitle: string;
  language: string;
  chooseLanguage: string;
  userId: string;
  joined: string;
  reportReport: string;
  reportSummary: string;
  reportDatabase: string;
  reportLab: string;
  reportEssay: string;
  reportTasks: string;
  reportReportDesc: string;
  reportSummaryDesc: string;
  reportDatabaseDesc: string;
  reportLabDesc: string;
  reportEssayDesc: string;
  reportTasksDesc: string;
  subProgramming: string;
  subMath: string;
  subPhysics: string;
  subChemistry: string;
  subBiology: string;
  subHistory: string;
  subGeography: string;
  subDatabases: string;
  subNetworks: string;
  subEconomics: string;
  subOther: string;
};

const translations: Record<string, TranslationKeys> = {
  en: {
    appName: "StudyPro",
    welcome: "Hello",
    subtitle: "Your smart study assistant",
    yourBalance: "Your balance",
    reportsAvailable: "reports available",
    report1: "report",
    reports2_4: "reports",
    reports5: "reports",
    firstReportFree: "First report is free!",
    newReport: "New Report",
    generateAI: "Generate with AI",
    history: "History",
    myReports: "My reports",
    topUp: "Top Up",
    buyReports: "Buy reports",
    stats: "Statistics",
    quickStart: "Quick Start",
    quickStartDesc: "Choose document type, subject and topic — AI will do everything for you in 10-30 seconds!",
    createReport: "Create Report",
    home: "Home",
    create: "Create",
    balance: "Balance",
    profile: "Profile",
    newDocument: "New Document",
    chooseDocType: "Choose document type",
    subject: "Subject",
    chooseSubject: "Choose subject",
    details: "Details",
    describeTask: "Describe what you need",
    topicLabel: "Topic / Task *",
    topicPlaceholder: "e.g.: Lab work on Python — bubble sort algorithm",
    groupLabel: "Group / Class",
    groupPlaceholder: "e.g.: IT-21, 11-A (optional)",
    generate: "Generate",
    generating: "Generating...",
    generatingDesc: "AI is working on your task. Usually takes 10-30 seconds",
    done: "Done!",
    docGenerated: "Your document is generated",
    copy: "Copy",
    newOne: "New",
    error: "Error",
    tryAgain: "Try Again",
    noBalance: "Not enough reports on balance",
    topUpBalance: "Top up balance",
    connectionError: "Connection error. Try again.",
    back: "Back",
    reportsGenerated: "documents generated",
    docsHere: "Your documents will appear here",
    noReportsYet: "No reports yet.",
    createFirst: "Create your first one!",
    copyText: "Copy text",
    contentUnavailable: "Content unavailable",
    manageReports: "Manage your reports",
    availableReports: "Available reports",
    total: "Total",
    freeReport: "+1 free",
    monobank: "Monobank",
    cardTransfer: "Card transfer",
    crypto: "Crypto",
    cryptoDesc: "USDT / USDC (TRC-20)",
    telegramStars: "Telegram Stars",
    payViaTelegram: "Pay via Telegram",
    cardNumber: "Card number:",
    important: "Important!",
    monoNote: "In the payment comment, specify your ID:",
    iPaid: "I paid",
    cryptoAddress: "Address (TRC-20):",
    cryptoNote: "After transfer, send the transaction hash to support chat",
    starsNote: "To pay with Telegram Stars, send the bot command:",
    starsCmd: "or click 'Buy' in the bot menu",
    payInBot: "Pay in bot",
    thankYou: "Thank you!",
    paymentPending: "We will verify payment within 24 hours. Your balance will be topped up after confirmation!",
    goBack: "Go back",
    reports15: "15 reports",
    loadError: "Failed to load. Try again.",
    profileTitle: "Profile",
    language: "Language",
    chooseLanguage: "Choose language",
    userId: "User ID",
    joined: "Joined",
    reportReport: "Report",
    reportSummary: "Summary",
    reportDatabase: "Database",
    reportLab: "Lab Work",
    reportEssay: "Essay",
    reportTasks: "Tasks",
    reportReportDesc: "Official report on a topic",
    reportSummaryDesc: "Brief summary of a topic",
    reportDatabaseDesc: "SQL tables and queries",
    reportLabDesc: "Complete lab work",
    reportEssayDesc: "Detailed essay",
    reportTasksDesc: "Problem solving",
    subProgramming: "Programming",
    subMath: "Mathematics",
    subPhysics: "Physics",
    subChemistry: "Chemistry",
    subBiology: "Biology",
    subHistory: "History",
    subGeography: "Geography",
    subDatabases: "Databases",
    subNetworks: "Networks",
    subEconomics: "Economics",
    subOther: "Other",
  },
  ru: {
    appName: "StudyPro",
    welcome: "Привет",
    subtitle: "Твой умный помощник в учёбе",
    yourBalance: "Твой баланс",
    reportsAvailable: "доступно",
    report1: "отчёт",
    reports2_4: "отчёта",
    reports5: "отчётов",
    firstReportFree: "Первый отчёт бесплатно!",
    newReport: "Новый отчёт",
    generateAI: "Сгенерировать AI",
    history: "История",
    myReports: "Мои отчёты",
    topUp: "Пополнить",
    buyReports: "Купить отчёты",
    stats: "Статистика",
    quickStart: "Быстрый старт",
    quickStartDesc: "Выбери тип документа, предмет и тему — AI сделает всё за тебя за 10-30 секунд!",
    createReport: "Создать отчёт",
    home: "Главная",
    create: "Создать",
    balance: "Баланс",
    profile: "Профиль",
    newDocument: "Новый документ",
    chooseDocType: "Выбери тип документа",
    subject: "Предмет",
    chooseSubject: "Выбери предмет",
    details: "Детали",
    describeTask: "Опиши что нужно",
    topicLabel: "Тема / Задание *",
    topicPlaceholder: "Например: Лабораторная работа по Python — сортировка массивов пузырьковым методом",
    groupLabel: "Группа / Класс",
    groupPlaceholder: "Например: ИТ-21, 11-А (необязательно)",
    generate: "Сгенерировать",
    generating: "Генерирую...",
    generatingDesc: "AI работает над твоим заданием. Обычно это занимает 10-30 секунд",
    done: "Готово!",
    docGenerated: "Твой документ сгенерирован",
    copy: "Копировать",
    newOne: "Новый",
    error: "Ошибка",
    tryAgain: "Попробовать снова",
    noBalance: "Недостаточно отчётов на балансе",
    topUpBalance: "Пополнить баланс",
    connectionError: "Ошибка соединения. Попробуй снова.",
    back: "Назад",
    reportsGenerated: "документов сгенерировано",
    docsHere: "Здесь будут твои документы",
    noReportsYet: "Пока нет отчётов.",
    createFirst: "Создай первый!",
    copyText: "Копировать текст",
    contentUnavailable: "Контент недоступен",
    manageReports: "Управляй своими отчётами",
    availableReports: "Доступно отчётов",
    total: "Всего",
    freeReport: "+1 бесплатный",
    monobank: "Monobank",
    cardTransfer: "Перевод на карту",
    crypto: "Крипто",
    cryptoDesc: "USDT / USDC (TRC-20)",
    telegramStars: "Telegram Stars",
    payViaTelegram: "Оплата через Telegram",
    cardNumber: "Номер карты:",
    important: "Важно!",
    monoNote: "В комментарии к переводу укажи свой ID:",
    iPaid: "Я оплатил",
    cryptoAddress: "Адрес (TRC-20):",
    cryptoNote: "После перевода отправь хеш транзакции в чат поддержки",
    starsNote: "Для оплаты через Telegram Stars напиши боту команду:",
    starsCmd: "или нажми кнопку 'Купить' в меню бота",
    payInBot: "Оплатить в боте",
    thankYou: "Спасибо!",
    paymentPending: "Мы проверим оплату в течение 24 часов. После подтверждения баланс будет пополнен!",
    goBack: "Вернуться",
    reports15: "15 отчётов",
    loadError: "Не удалось загрузить. Попробуй снова.",
    profileTitle: "Профиль",
    language: "Язык",
    chooseLanguage: "Выбери язык",
    userId: "ID пользователя",
    joined: "Зарегистрирован",
    reportReport: "Отчёт",
    reportSummary: "Конспект",
    reportDatabase: "База данных",
    reportLab: "Лабораторная",
    reportEssay: "Реферат",
    reportTasks: "Задачи",
    reportReportDesc: "Официальный отчёт по теме",
    reportSummaryDesc: "Краткое изложение темы",
    reportDatabaseDesc: "SQL таблицы и запросы",
    reportLabDesc: "Полная лабораторная работа",
    reportEssayDesc: "Развёрнутый реферат",
    reportTasksDesc: "Решение задач",
    subProgramming: "Программирование",
    subMath: "Математика",
    subPhysics: "Физика",
    subChemistry: "Химия",
    subBiology: "Биология",
    subHistory: "История",
    subGeography: "География",
    subDatabases: "Базы данных",
    subNetworks: "Сети",
    subEconomics: "Экономика",
    subOther: "Другое",
  },
  uk: {
    appName: "StudyPro",
    welcome: "Привіт",
    subtitle: "Твій розумний помічник для навчання",
    yourBalance: "Твій баланс",
    reportsAvailable: "доступно",
    report1: "звіт",
    reports2_4: "звіти",
    reports5: "звітів",
    firstReportFree: "Перший звіт безкоштовно!",
    newReport: "Новий звіт",
    generateAI: "Згенерувати AI",
    history: "Історія",
    myReports: "Мої звіти",
    topUp: "Поповнити",
    buyReports: "Купити звіти",
    stats: "Статистика",
    quickStart: "Швидкий старт",
    quickStartDesc: "Вибери тип документу, предмет і тему — AI зробить все за тебе за 10-30 секунд!",
    createReport: "Створити звіт",
    home: "Головна",
    create: "Створити",
    balance: "Баланс",
    profile: "Профіль",
    newDocument: "Новий документ",
    chooseDocType: "Вибери тип документу",
    subject: "Предмет",
    chooseSubject: "Вибери предмет",
    details: "Деталі",
    describeTask: "Опиши що потрібно",
    topicLabel: "Тема / Завдання *",
    topicPlaceholder: "Наприклад: Лабораторна робота з Python — сортування масивів бульбашковим методом",
    groupLabel: "Група / Клас",
    groupPlaceholder: "Наприклад: ІТ-21, 11-А (необов'язково)",
    generate: "Згенерувати",
    generating: "Генерую...",
    generatingDesc: "AI працює над твоїм завданням. Зазвичай це займає 10-30 секунд",
    done: "Готово!",
    docGenerated: "Твій документ згенеровано",
    copy: "Копіювати",
    newOne: "Новий",
    error: "Помилка",
    tryAgain: "Спробувати ще",
    noBalance: "Недостатньо звітів на балансі",
    topUpBalance: "Поповнити баланс",
    connectionError: "Помилка з'єднання. Спробуй ще раз.",
    back: "Назад",
    reportsGenerated: "документів згенеровано",
    docsHere: "Тут будуть твої документи",
    noReportsYet: "Поки що немає звітів.",
    createFirst: "Створи перший!",
    copyText: "Копіювати текст",
    contentUnavailable: "Контент недоступний",
    manageReports: "Керуй своїми звітами",
    availableReports: "Доступно звітів",
    total: "Всього",
    freeReport: "+1 безкоштовний",
    monobank: "Monobank",
    cardTransfer: "Переказ на картку",
    crypto: "Крипто",
    cryptoDesc: "USDT / USDC (TRC-20)",
    telegramStars: "Telegram Stars",
    payViaTelegram: "Оплата через Telegram",
    cardNumber: "Номер картки:",
    important: "Важливо!",
    monoNote: "В коментарі до переказу вкажи свій ID:",
    iPaid: "Я оплатив",
    cryptoAddress: "Адреса (TRC-20):",
    cryptoNote: "Після переказу надішли хеш транзакції в чат підтримки",
    starsNote: "Для оплати через Telegram Stars напиши боту команду:",
    starsCmd: "або натисни кнопку 'Купити' в меню бота",
    payInBot: "Оплатити в боті",
    thankYou: "Дякуємо!",
    paymentPending: "Ми перевіримо оплату протягом 24 годин. Після підтвердження баланс буде поповнено!",
    goBack: "Повернутися",
    reports15: "15 звітів",
    loadError: "Не вдалося завантажити. Спробуй ще раз.",
    profileTitle: "Профіль",
    language: "Мова",
    chooseLanguage: "Вибери мову",
    userId: "ID користувача",
    joined: "Зареєстрований",
    reportReport: "Звіт",
    reportSummary: "Конспект",
    reportDatabase: "База даних",
    reportLab: "Лабораторна",
    reportEssay: "Реферат",
    reportTasks: "Задачі",
    reportReportDesc: "Офіційний звіт з теми",
    reportSummaryDesc: "Стислий виклад теми",
    reportDatabaseDesc: "SQL таблиці та запити",
    reportLabDesc: "Повна лабораторна робота",
    reportEssayDesc: "Розгорнутий реферат",
    reportTasksDesc: "Розв'язання задач",
    subProgramming: "Програмування",
    subMath: "Математика",
    subPhysics: "Фізика",
    subChemistry: "Хімія",
    subBiology: "Біологія",
    subHistory: "Історія",
    subGeography: "Географія",
    subDatabases: "Бази Даних",
    subNetworks: "Мережі",
    subEconomics: "Економіка",
    subOther: "Інше",
  },
};

const IP_TO_LANG: Record<string, string> = {
  RU: "ru", UA: "uk", KZ: "kk", UZ: "uz", KG: "ky", TJ: "tg",
  TM: "tk", AZ: "az", AM: "hy", GE: "ka", BY: "be", MD: "md",
  MN: "mn", TR: "tr", PL: "pl", DE: "de", FR: "fr", ES: "es",
  PT: "pt", IT: "it", RO: "ro", CZ: "cs", BG: "bg", RS: "sr",
  HR: "hr", SA: "ar", IN: "hi", CN: "zh", JP: "ja",
};

let currentLang = "en";
const langListeners = new Set<() => void>();

export function initLanguage() {
  const saved = localStorage.getItem("studypro_lang");
  if (saved) {
    currentLang = saved;
    return;
  }
  const tgLang = window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code;
  if (tgLang && translations[tgLang]) {
    currentLang = tgLang;
    return;
  }
  if (tgLang === "ru" || tgLang === "uk" || tgLang === "be") {
    currentLang = tgLang === "be" ? "ru" : tgLang;
    return;
  }
}

export async function detectLanguageByIP() {
  const saved = localStorage.getItem("studypro_lang");
  if (saved) return;

  try {
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    const countryCode = data.country_code;
    if (countryCode && IP_TO_LANG[countryCode]) {
      const detected = IP_TO_LANG[countryCode];
      if (translations[detected]) {
        currentLang = detected;
      } else {
        currentLang = detected === "kk" || detected === "ky" || detected === "tg" ||
                      detected === "tk" || detected === "az" || detected === "hy" ||
                      detected === "ka" || detected === "be" || detected === "md" ||
                      detected === "mn" ? "ru" : "en";
      }
      langListeners.forEach((l) => l());
    }
  } catch {}
}

export function getLang(): string {
  return currentLang;
}

export function setLang(code: string) {
  currentLang = code;
  localStorage.setItem("studypro_lang", code);
  langListeners.forEach((l) => l());
}

export function t(key: keyof TranslationKeys): string {
  const dict = translations[currentLang] || translations["ru"] || translations["en"];
  return dict[key] || translations["en"][key] || key;
}

export function subscribeLang(fn: () => void) {
  langListeners.add(fn);
  return () => { langListeners.delete(fn); };
}

export function getReportTypes() {
  return [
    { id: "report", label: t("reportReport"), icon: "📄", desc: t("reportReportDesc") },
    { id: "summary", label: t("reportSummary"), icon: "📝", desc: t("reportSummaryDesc") },
    { id: "database", label: t("reportDatabase"), icon: "🗄", desc: t("reportDatabaseDesc") },
    { id: "lab", label: t("reportLab"), icon: "🔬", desc: t("reportLabDesc") },
    { id: "essay", label: t("reportEssay"), icon: "📋", desc: t("reportEssayDesc") },
    { id: "tasks", label: t("reportTasks"), icon: "🧮", desc: t("reportTasksDesc") },
  ];
}

export function getSubjects() {
  return [
    { id: "programming", label: t("subProgramming"), icon: "💻" },
    { id: "math", label: t("subMath"), icon: "📐" },
    { id: "physics", label: t("subPhysics"), icon: "⚡" },
    { id: "chemistry", label: t("subChemistry"), icon: "🧪" },
    { id: "biology", label: t("subBiology"), icon: "🌿" },
    { id: "history", label: t("subHistory"), icon: "📜" },
    { id: "geography", label: t("subGeography"), icon: "🌍" },
    { id: "databases", label: t("subDatabases"), icon: "🗃" },
    { id: "networks", label: t("subNetworks"), icon: "🌐" },
    { id: "economics", label: t("subEconomics"), icon: "💰" },
    { id: "other", label: t("subOther"), icon: "📚" },
  ];
}

export function getReportTypeMap() {
  return Object.fromEntries(getReportTypes().map(r => [r.id, r]));
}

export function getSubjectMap() {
  return Object.fromEntries(getSubjects().map(s => [s.id, s]));
}
