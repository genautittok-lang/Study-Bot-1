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
  chooseCategory: string;
  details: string;
  describeTask: string;
  topicLabel: string;
  topicPlaceholder: string;
  groupLabel: string;
  groupPlaceholder: string;
  attachPhoto: string;
  attachPhotoDesc: string;
  photoAttached: string;
  removePhoto: string;
  maxFileSize: string;
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
  crypto: string;
  cryptoDesc: string;
  telegramStars: string;
  payViaTelegram: string;
  important: string;
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
  visaMastercard: string;
  cardPayment: string;
  cardNumber: string;
  cardNote: string;
  receiptNote: string;
  payAmount: string;
  choosePayment: string;
  popular: string;
  allSubjects: string;
  referralSystem: string;
  inviteFriends: string;
  referralDesc: string;
  referralCode: string;
  copyLink: string;
  linkCopied: string;
  invited: string;
  bonusEarned: string;
  referralBonus: string;
  level: string;
  nextLevel: string;
  achievements: string;
  firstReportAch: string;
  tenReportsAch: string;
  fiftyReportsAch: string;
  referralAch: string;
  accountInfo: string;
  memberSince: string;
  proTip: string;
  proTipText: string;
  reportReport: string;
  reportSummary: string;
  reportDatabase: string;
  reportLab: string;
  reportEssay: string;
  reportTasks: string;
  reportCourseWork: string;
  reportDiploma: string;
  reportPresentation: string;
  reportTest: string;
  reportNotes: string;
  reportReportDesc: string;
  reportSummaryDesc: string;
  reportDatabaseDesc: string;
  reportLabDesc: string;
  reportEssayDesc: string;
  reportTasksDesc: string;
  reportCourseWorkDesc: string;
  reportDiplomaDesc: string;
  reportPresentationDesc: string;
  reportTestDesc: string;
  reportNotesDesc: string;
  eduSchool: string;
  eduCollege: string;
  eduUni: string;
  eduAll: string;
  transferDescription: string;
  paymentAmount: string;
  walletAddress: string;
  cryptoPayment: string;
  starsDesc: string;
  starsInstructions: string;
  supportContact: string;
  choosePaymentMethod: string;
  currentBalance: string;
  paymentSent: string;
  paymentNote: string;
  noHistory: string;
  noHistoryDesc: string;
  progress: string;
  lengthShort: string;
  lengthMedium: string;
  lengthFull: string;
  lengthShortDesc: string;
  lengthMediumDesc: string;
  lengthFullDesc: string;
  reportLength: string;
  estimatedTime: string;
  estimatedWords: string;
  seconds: string;
  repeatReport: string;
  shareReport: string;
  shareText: string;
  recentSubjects: string;
  continueWith: string;
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
    chooseCategory: "Choose category",
    details: "Details",
    describeTask: "Describe what you need",
    topicLabel: "Topic / Task *",
    topicPlaceholder: "e.g.: Lab work on Python — bubble sort algorithm",
    groupLabel: "Group / Class",
    groupPlaceholder: "e.g.: IT-21, 11-A (optional)",
    attachPhoto: "Attach Photo",
    attachPhotoDesc: "Photo of the task from textbook",
    photoAttached: "Photo attached",
    removePhoto: "Remove",
    maxFileSize: "Max 5 MB, JPG/PNG",
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
    crypto: "Crypto",
    cryptoDesc: "USDT / USDC (TRC-20)",
    telegramStars: "Telegram Stars",
    payViaTelegram: "Pay via Telegram",
    important: "Important!",
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
    visaMastercard: "Visa / Mastercard",
    cardPayment: "Card payment",
    cardNumber: "Card number:",
    cardNote: "In the payment comment, specify your ID:",
    receiptNote: "After payment, send a screenshot of the receipt to the moderator @studypro_support",
    payAmount: "Pay",
    choosePayment: "Choose payment method",
    popular: "Popular",
    allSubjects: "All subjects",
    referralSystem: "Referral System",
    inviteFriends: "Invite Friends",
    referralDesc: "Invite friends and get free reports! You and your friend both receive +2 reports.",
    referralCode: "Your referral code",
    copyLink: "Copy link",
    linkCopied: "Copied!",
    invited: "Invited",
    bonusEarned: "Bonus earned",
    referralBonus: "+2 reports for each invite",
    level: "Level",
    nextLevel: "Next level",
    achievements: "Achievements",
    firstReportAch: "First Step",
    tenReportsAch: "Expert",
    fiftyReportsAch: "Master",
    referralAch: "Networker",
    accountInfo: "Account",
    memberSince: "Member since",
    proTip: "Pro Tip",
    proTipText: "Invite 5 friends to unlock 10 free reports!",
    reportReport: "Report",
    reportSummary: "Summary",
    reportDatabase: "Database",
    reportLab: "Lab Work",
    reportEssay: "Essay",
    reportTasks: "Tasks",
    reportCourseWork: "Course Work",
    reportDiploma: "Diploma",
    reportPresentation: "Presentation",
    reportTest: "Test Paper",
    reportNotes: "Notes",
    reportReportDesc: "Official report on a topic",
    reportSummaryDesc: "Brief summary of a topic",
    reportDatabaseDesc: "SQL tables and queries",
    reportLabDesc: "Complete lab work",
    reportEssayDesc: "Detailed essay",
    reportTasksDesc: "Problem solving",
    reportCourseWorkDesc: "Full course work with sections",
    reportDiplomaDesc: "Diploma project structure",
    reportPresentationDesc: "Slide-by-slide presentation plan",
    reportTestDesc: "Test / exam answers",
    reportNotesDesc: "Lecture notes and summaries",
    eduSchool: "School",
    eduCollege: "College",
    eduUni: "University",
    eduAll: "All",
    transferDescription: "Transfer to the card below and press confirm",
    paymentAmount: "Amount",
    walletAddress: "Wallet address",
    cryptoPayment: "Crypto USDT",
    starsDesc: "Pay via Telegram Stars",
    starsInstructions: "Send the Stars to @studypro_support bot and press confirm below.",
    supportContact: "Support",
    choosePaymentMethod: "Payment methods",
    currentBalance: "Current balance",
    paymentSent: "I paid",
    paymentNote: "Balance will be credited within 15 minutes after verification.",
    noHistory: "No reports yet",
    noHistoryDesc: "Create your first report to see it here",
    progress: "Progress",
    lengthShort: "Short",
    lengthMedium: "Medium",
    lengthFull: "Full",
    lengthShortDesc: "~500 words",
    lengthMediumDesc: "~1500 words",
    lengthFullDesc: "~3000 words",
    reportLength: "Report length",
    estimatedTime: "Est. time",
    estimatedWords: "words",
    seconds: "sec",
    repeatReport: "Repeat",
    shareReport: "Share",
    shareText: "Generated with StudyPro Bot",
    recentSubjects: "Recent",
    continueWith: "Continue",
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
    chooseCategory: "Выбери категорию",
    details: "Детали",
    describeTask: "Опиши что нужно",
    topicLabel: "Тема / Задание *",
    topicPlaceholder: "Например: Лабораторная работа по Python — сортировка массивов пузырьковым методом",
    groupLabel: "Группа / Класс",
    groupPlaceholder: "Например: ИТ-21, 11-А (необязательно)",
    attachPhoto: "Прикрепить фото",
    attachPhotoDesc: "Фото задания из учебника",
    photoAttached: "Фото прикреплено",
    removePhoto: "Удалить",
    maxFileSize: "Макс. 5 МБ, JPG/PNG",
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
    crypto: "Крипто",
    cryptoDesc: "USDT / USDC (TRC-20)",
    telegramStars: "Telegram Stars",
    payViaTelegram: "Оплата через Telegram",
    important: "Важно!",
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
    visaMastercard: "Visa / Mastercard",
    cardPayment: "Оплата картой",
    cardNumber: "Номер карты:",
    cardNote: "В комментарии к переводу укажи свой ID:",
    receiptNote: "После оплаты отправь скриншот чека модератору @studypro_support",
    payAmount: "Оплатить",
    choosePayment: "Выбери способ оплаты",
    popular: "Популярное",
    allSubjects: "Все предметы",
    referralSystem: "Реферальная система",
    inviteFriends: "Пригласи друзей",
    referralDesc: "Пригласи друзей и получи бесплатные отчёты! Ты и друг получите по +2 отчёта.",
    referralCode: "Твой реферальный код",
    copyLink: "Скопировать ссылку",
    linkCopied: "Скопировано!",
    invited: "Приглашено",
    bonusEarned: "Бонус получен",
    referralBonus: "+2 отчёта за каждое приглашение",
    level: "Уровень",
    nextLevel: "Следующий уровень",
    achievements: "Достижения",
    firstReportAch: "Первый шаг",
    tenReportsAch: "Эксперт",
    fiftyReportsAch: "Мастер",
    referralAch: "Нетворкер",
    accountInfo: "Аккаунт",
    memberSince: "Участник с",
    proTip: "Совет",
    proTipText: "Пригласи 5 друзей и получи 10 бесплатных отчётов!",
    reportReport: "Отчёт",
    reportSummary: "Конспект",
    reportDatabase: "База данных",
    reportLab: "Лабораторная",
    reportEssay: "Реферат",
    reportTasks: "Задачи",
    reportCourseWork: "Курсовая",
    reportDiploma: "Дипломная",
    reportPresentation: "Презентация",
    reportTest: "Контрольная",
    reportNotes: "Конспект лекций",
    reportReportDesc: "Официальный отчёт по теме",
    reportSummaryDesc: "Краткое изложение темы",
    reportDatabaseDesc: "SQL таблицы и запросы",
    reportLabDesc: "Полная лабораторная работа",
    reportEssayDesc: "Развёрнутый реферат",
    reportTasksDesc: "Решение задач",
    reportCourseWorkDesc: "Полная курсовая с разделами",
    reportDiplomaDesc: "Структура дипломного проекта",
    reportPresentationDesc: "План презентации по слайдам",
    reportTestDesc: "Ответы на контрольную / экзамен",
    reportNotesDesc: "Конспект лекций и изложение",
    eduSchool: "Школа",
    eduCollege: "Колледж",
    eduUni: "Универ",
    eduAll: "Все",
    transferDescription: "Переведите на карту ниже и нажмите подтвердить",
    paymentAmount: "Сумма",
    walletAddress: "Адрес кошелька",
    cryptoPayment: "Крипто USDT",
    starsDesc: "Оплата через Telegram Stars",
    starsInstructions: "Отправьте Stars боту @studypro_support и нажмите подтвердить.",
    supportContact: "Поддержка",
    choosePaymentMethod: "Способы оплаты",
    currentBalance: "Текущий баланс",
    paymentSent: "Я оплатил",
    paymentNote: "Баланс будет зачислен в течение 15 минут после проверки.",
    noHistory: "Нет отчётов",
    noHistoryDesc: "Создайте первый отчёт, чтобы увидеть его здесь",
    progress: "Прогресс",
    lengthShort: "Короткий",
    lengthMedium: "Средний",
    lengthFull: "Полный",
    lengthShortDesc: "~500 слов",
    lengthMediumDesc: "~1500 слов",
    lengthFullDesc: "~3000 слов",
    reportLength: "Объём работы",
    estimatedTime: "Время",
    estimatedWords: "слов",
    seconds: "сек",
    repeatReport: "Повторить",
    shareReport: "Поделиться",
    shareText: "Сгенерировано в StudyPro Bot",
    recentSubjects: "Недавние",
    continueWith: "Продолжить",
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
    chooseCategory: "Вибери категорію",
    details: "Деталі",
    describeTask: "Опиши що потрібно",
    topicLabel: "Тема / Завдання *",
    topicPlaceholder: "Наприклад: Лабораторна робота з Python — сортування масивів бульбашковим методом",
    groupLabel: "Група / Клас",
    groupPlaceholder: "Наприклад: ІТ-21, 11-А (необов'язково)",
    attachPhoto: "Прикріпити фото",
    attachPhotoDesc: "Фото завдання з підручника",
    photoAttached: "Фото прикріплено",
    removePhoto: "Видалити",
    maxFileSize: "Макс. 5 МБ, JPG/PNG",
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
    crypto: "Крипто",
    cryptoDesc: "USDT / USDC (TRC-20)",
    telegramStars: "Telegram Stars",
    payViaTelegram: "Оплата через Telegram",
    important: "Важливо!",
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
    visaMastercard: "Visa / Mastercard",
    cardPayment: "Оплата карткою",
    cardNumber: "Номер картки:",
    cardNote: "В коментарі до переказу вкажи свій ID:",
    receiptNote: "Після оплати надішли скріншот чеку модератору @studypro_support",
    payAmount: "Оплатити",
    choosePayment: "Вибери спосіб оплати",
    popular: "Популярне",
    allSubjects: "Усі предмети",
    referralSystem: "Реферальна система",
    inviteFriends: "Запроси друзів",
    referralDesc: "Запроси друзів і отримай безкоштовні звіти! Ти і друг отримаєте по +2 звіти.",
    referralCode: "Твій реферальний код",
    copyLink: "Скопіювати посилання",
    linkCopied: "Скопійовано!",
    invited: "Запрошено",
    bonusEarned: "Бонус отримано",
    referralBonus: "+2 звіти за кожне запрошення",
    level: "Рівень",
    nextLevel: "Наступний рівень",
    achievements: "Досягнення",
    firstReportAch: "Перший крок",
    tenReportsAch: "Експерт",
    fiftyReportsAch: "Майстер",
    referralAch: "Нетворкер",
    accountInfo: "Акаунт",
    memberSince: "Учасник з",
    proTip: "Порада",
    proTipText: "Запроси 5 друзів і отримай 10 безкоштовних звітів!",
    reportReport: "Звіт",
    reportSummary: "Конспект",
    reportDatabase: "База даних",
    reportLab: "Лабораторна",
    reportEssay: "Реферат",
    reportTasks: "Задачі",
    reportCourseWork: "Курсова",
    reportDiploma: "Дипломна",
    reportPresentation: "Презентація",
    reportTest: "Контрольна",
    reportNotes: "Конспект лекцій",
    reportReportDesc: "Офіційний звіт з теми",
    reportSummaryDesc: "Стислий виклад теми",
    reportDatabaseDesc: "SQL таблиці та запити",
    reportLabDesc: "Повна лабораторна робота",
    reportEssayDesc: "Розгорнутий реферат",
    reportTasksDesc: "Розв'язання задач",
    reportCourseWorkDesc: "Повна курсова з розділами",
    reportDiplomaDesc: "Структура дипломного проекту",
    reportPresentationDesc: "План презентації по слайдам",
    reportTestDesc: "Відповіді на контрольну / іспит",
    reportNotesDesc: "Конспект лекцій та виклад",
    eduSchool: "Школа",
    eduCollege: "Коледж",
    eduUni: "Універ",
    eduAll: "Все",
    transferDescription: "Переведіть на картку нижче та натисніть підтвердити",
    paymentAmount: "Сума",
    walletAddress: "Адреса гаманця",
    cryptoPayment: "Крипто USDT",
    starsDesc: "Оплата через Telegram Stars",
    starsInstructions: "Надішліть Stars боту @studypro_support та натисніть підтвердити.",
    supportContact: "Підтримка",
    choosePaymentMethod: "Способи оплати",
    currentBalance: "Поточний баланс",
    paymentSent: "Я оплатив",
    paymentNote: "Баланс буде зараховано протягом 15 хвилин після перевірки.",
    noHistory: "Немає звітів",
    noHistoryDesc: "Створіть перший звіт, щоб побачити його тут",
    progress: "Прогрес",
    lengthShort: "Короткий",
    lengthMedium: "Середній",
    lengthFull: "Повний",
    lengthShortDesc: "~500 слів",
    lengthMediumDesc: "~1500 слів",
    lengthFullDesc: "~3000 слів",
    reportLength: "Обсяг роботи",
    estimatedTime: "Час",
    estimatedWords: "слів",
    seconds: "сек",
    repeatReport: "Повторити",
    shareReport: "Поділитися",
    shareText: "Згенеровано в StudyPro Bot",
    recentSubjects: "Нещодавні",
    continueWith: "Продовжити",
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
        const cisLangs = ["kk", "ky", "tg", "tk", "az", "hy", "ka", "be", "md", "mn"];
        currentLang = cisLangs.includes(detected) ? "ru" : "en";
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
    { id: "coursework", label: t("reportCourseWork"), icon: "📚", desc: t("reportCourseWorkDesc") },
    { id: "diploma", label: t("reportDiploma"), icon: "🎓", desc: t("reportDiplomaDesc") },
    { id: "presentation", label: t("reportPresentation"), icon: "📊", desc: t("reportPresentationDesc") },
    { id: "test", label: t("reportTest"), icon: "✅", desc: t("reportTestDesc") },
    { id: "notes", label: t("reportNotes"), icon: "📒", desc: t("reportNotesDesc") },
  ];
}

export type EduLevel = "all" | "school" | "college" | "uni";

export function getEduLevels(): { id: EduLevel; label: string }[] {
  return [
    { id: "all", label: t("eduAll") },
    { id: "school", label: t("eduSchool") },
    { id: "college", label: t("eduCollege") },
    { id: "uni", label: t("eduUni") },
  ];
}

const EDU_LEVEL_MAP: Record<string, EduLevel> = {
  school_math: "school", school_ukr: "school", school_science: "school",
  school_history: "school", school_langs: "school", school_other: "school",
  college_it: "college", college_tech: "college",
  uni_math: "uni", uni_it: "uni", uni_humanities: "uni",
  uni_business: "uni", uni_law: "uni", uni_eng: "uni", uni_medicine: "uni",
  other: "all",
};

export function getCategoryEduLevel(categoryId: string): EduLevel {
  return EDU_LEVEL_MAP[categoryId] || "all";
}

interface SubjectCategoryData {
  id: string;
  icon: string;
  name: Record<string, string>;
  subjects: Array<{ id: string; icon: string; name: Record<string, string> }>;
}

const SUBJECT_CATEGORIES: SubjectCategoryData[] = [
  {
    id: "school_math", icon: "📐",
    name: { en: "Mathematics (School)", ru: "Математика (Школа)", uk: "Математика (Школа)" },
    subjects: [
      { id: "math_7", icon: "📐", name: { en: "Mathematics 7th grade", ru: "Математика 7 класс", uk: "Математика 7 клас" } },
      { id: "algebra_7", icon: "🔢", name: { en: "Algebra 7th grade", ru: "Алгебра 7 класс", uk: "Алгебра 7 клас" } },
      { id: "geometry_7", icon: "📏", name: { en: "Geometry 7th grade", ru: "Геометрия 7 класс", uk: "Геометрія 7 клас" } },
      { id: "algebra_8", icon: "🔢", name: { en: "Algebra 8th grade", ru: "Алгебра 8 класс", uk: "Алгебра 8 клас" } },
      { id: "geometry_8", icon: "📏", name: { en: "Geometry 8th grade", ru: "Геометрия 8 класс", uk: "Геометрія 8 клас" } },
      { id: "algebra_9", icon: "🔢", name: { en: "Algebra 9th grade", ru: "Алгебра 9 класс", uk: "Алгебра 9 клас" } },
      { id: "geometry_9", icon: "📏", name: { en: "Geometry 9th grade", ru: "Геометрия 9 класс", uk: "Геометрія 9 клас" } },
      { id: "algebra_10", icon: "🧮", name: { en: "Algebra 10th grade", ru: "Алгебра 10 класс", uk: "Алгебра 10 клас" } },
      { id: "geometry_10", icon: "📐", name: { en: "Geometry 10th grade", ru: "Геометрия 10 класс", uk: "Геометрія 10 клас" } },
      { id: "algebra_11", icon: "🧮", name: { en: "Algebra 11th grade", ru: "Алгебра 11 класс", uk: "Алгебра 11 клас" } },
      { id: "geometry_11", icon: "📐", name: { en: "Geometry 11th grade", ru: "Геометрия 11 класс", uk: "Геометрія 11 клас" } },
    ],
  },
  {
    id: "school_ukr", icon: "🇺🇦",
    name: { en: "Ukrainian Language & Lit", ru: "Укр. язык и Литература", uk: "Українська мова і Література" },
    subjects: [
      { id: "ukr_mova_7", icon: "✍️", name: { en: "Ukrainian Language 7th", ru: "Укр. язык 7 класс", uk: "Українська мова 7 клас" } },
      { id: "ukr_mova_8", icon: "✍️", name: { en: "Ukrainian Language 8th", ru: "Укр. язык 8 класс", uk: "Українська мова 8 клас" } },
      { id: "ukr_mova_9", icon: "✍️", name: { en: "Ukrainian Language 9th", ru: "Укр. язык 9 класс", uk: "Українська мова 9 клас" } },
      { id: "ukr_mova_10", icon: "✍️", name: { en: "Ukrainian Language 10th", ru: "Укр. язык 10 класс", uk: "Українська мова 10 клас" } },
      { id: "ukr_mova_11", icon: "✍️", name: { en: "Ukrainian Language 11th", ru: "Укр. язык 11 класс", uk: "Українська мова 11 клас" } },
      { id: "ukr_lit_7", icon: "📖", name: { en: "Ukrainian Literature 7th", ru: "Укр. литература 7 класс", uk: "Українська література 7 клас" } },
      { id: "ukr_lit_8", icon: "📖", name: { en: "Ukrainian Literature 8th", ru: "Укр. литература 8 класс", uk: "Українська література 8 клас" } },
      { id: "ukr_lit_9", icon: "📖", name: { en: "Ukrainian Literature 9th", ru: "Укр. литература 9 класс", uk: "Українська література 9 клас" } },
      { id: "ukr_lit_10", icon: "📖", name: { en: "Ukrainian Literature 10th", ru: "Укр. литература 10 класс", uk: "Українська література 10 клас" } },
      { id: "ukr_lit_11", icon: "📖", name: { en: "Ukrainian Literature 11th", ru: "Укр. литература 11 класс", uk: "Українська література 11 клас" } },
    ],
  },
  {
    id: "school_science", icon: "🔬",
    name: { en: "Sciences (School)", ru: "Естественные (Школа)", uk: "Природничі (Школа)" },
    subjects: [
      { id: "physics_7", icon: "⚡", name: { en: "Physics 7th grade", ru: "Физика 7 класс", uk: "Фізика 7 клас" } },
      { id: "physics_8", icon: "⚡", name: { en: "Physics 8th grade", ru: "Физика 8 класс", uk: "Фізика 8 клас" } },
      { id: "physics_9", icon: "⚡", name: { en: "Physics 9th grade", ru: "Физика 9 класс", uk: "Фізика 9 клас" } },
      { id: "physics_10", icon: "⚡", name: { en: "Physics 10th grade", ru: "Физика 10 класс", uk: "Фізика 10 клас" } },
      { id: "physics_11", icon: "⚡", name: { en: "Physics 11th grade", ru: "Физика 11 класс", uk: "Фізика 11 клас" } },
      { id: "chemistry_7", icon: "🧪", name: { en: "Chemistry 7th grade", ru: "Химия 7 класс", uk: "Хімія 7 клас" } },
      { id: "chemistry_8", icon: "🧪", name: { en: "Chemistry 8th grade", ru: "Химия 8 класс", uk: "Хімія 8 клас" } },
      { id: "chemistry_9", icon: "🧪", name: { en: "Chemistry 9th grade", ru: "Химия 9 класс", uk: "Хімія 9 клас" } },
      { id: "chemistry_10", icon: "🧪", name: { en: "Chemistry 10th grade", ru: "Химия 10 класс", uk: "Хімія 10 клас" } },
      { id: "chemistry_11", icon: "🧪", name: { en: "Chemistry 11th grade", ru: "Химия 11 класс", uk: "Хімія 11 клас" } },
      { id: "biology_7", icon: "🌿", name: { en: "Biology 7th grade", ru: "Биология 7 класс", uk: "Біологія 7 клас" } },
      { id: "biology_8", icon: "🌿", name: { en: "Biology 8th grade", ru: "Биология 8 класс", uk: "Біологія 8 клас" } },
      { id: "biology_9", icon: "🌿", name: { en: "Biology 9th grade", ru: "Биология 9 класс", uk: "Біологія 9 клас" } },
      { id: "biology_10", icon: "🌿", name: { en: "Biology 10th grade", ru: "Биология 10 класс", uk: "Біологія 10 клас" } },
      { id: "biology_11", icon: "🌿", name: { en: "Biology 11th grade", ru: "Биология 11 класс", uk: "Біологія 11 клас" } },
      { id: "astronomy_11", icon: "🌌", name: { en: "Astronomy 11th grade", ru: "Астрономия 11 класс", uk: "Астрономія 11 клас" } },
    ],
  },
  {
    id: "school_history", icon: "📜",
    name: { en: "History & Geography (School)", ru: "История и Геогр. (Школа)", uk: "Історія та Геогр. (Школа)" },
    subjects: [
      { id: "history_ukraine_7", icon: "🇺🇦", name: { en: "History of Ukraine 7th", ru: "История Украины 7 класс", uk: "Історія України 7 клас" } },
      { id: "history_ukraine_8", icon: "🇺🇦", name: { en: "History of Ukraine 8th", ru: "История Украины 8 класс", uk: "Історія України 8 клас" } },
      { id: "history_ukraine_9", icon: "🇺🇦", name: { en: "History of Ukraine 9th", ru: "История Украины 9 класс", uk: "Історія України 9 клас" } },
      { id: "history_ukraine_10", icon: "🇺🇦", name: { en: "History of Ukraine 10th", ru: "История Украины 10 класс", uk: "Історія України 10 клас" } },
      { id: "history_ukraine_11", icon: "🇺🇦", name: { en: "History of Ukraine 11th", ru: "История Украины 11 класс", uk: "Історія України 11 клас" } },
      { id: "world_history_7", icon: "🌍", name: { en: "World History 7th", ru: "Всемирная история 7 класс", uk: "Всесвітня історія 7 клас" } },
      { id: "world_history_8", icon: "🌍", name: { en: "World History 8th", ru: "Всемирная история 8 класс", uk: "Всесвітня історія 8 клас" } },
      { id: "world_history_9", icon: "🌍", name: { en: "World History 9th", ru: "Всемирная история 9 класс", uk: "Всесвітня історія 9 клас" } },
      { id: "world_history_10", icon: "🌍", name: { en: "World History 10th", ru: "Всемирная история 10 класс", uk: "Всесвітня історія 10 клас" } },
      { id: "world_history_11", icon: "🌍", name: { en: "World History 11th", ru: "Всемирная история 11 класс", uk: "Всесвітня історія 11 клас" } },
      { id: "geography_7", icon: "🗺", name: { en: "Geography 7th", ru: "География 7 класс", uk: "Географія 7 клас" } },
      { id: "geography_8", icon: "🗺", name: { en: "Geography 8th", ru: "География 8 класс", uk: "Географія 8 клас" } },
      { id: "geography_9", icon: "🗺", name: { en: "Geography 9th", ru: "География 9 класс", uk: "Географія 9 клас" } },
      { id: "geography_10", icon: "🗺", name: { en: "Geography 10th", ru: "География 10 класс", uk: "Географія 10 клас" } },
    ],
  },
  {
    id: "school_langs", icon: "🗣",
    name: { en: "Foreign Languages (School)", ru: "Ин. языки (Школа)", uk: "Іноземні мови (Школа)" },
    subjects: [
      { id: "english_7", icon: "🇬🇧", name: { en: "English 7th", ru: "Английский 7 класс", uk: "Англійська мова 7 клас" } },
      { id: "english_8", icon: "🇬🇧", name: { en: "English 8th", ru: "Английский 8 класс", uk: "Англійська мова 8 клас" } },
      { id: "english_9", icon: "🇬🇧", name: { en: "English 9th", ru: "Английский 9 класс", uk: "Англійська мова 9 клас" } },
      { id: "english_10", icon: "🇬🇧", name: { en: "English 10th", ru: "Английский 10 класс", uk: "Англійська мова 10 клас" } },
      { id: "english_11", icon: "🇬🇧", name: { en: "English 11th", ru: "Английский 11 класс", uk: "Англійська мова 11 клас" } },
      { id: "german_school", icon: "🇩🇪", name: { en: "German (School)", ru: "Немецкий (Школа)", uk: "Німецька мова (Школа)" } },
      { id: "french_school", icon: "🇫🇷", name: { en: "French (School)", ru: "Французский (Школа)", uk: "Французька мова (Школа)" } },
      { id: "polish_school", icon: "🇵🇱", name: { en: "Polish (School)", ru: "Польский (Школа)", uk: "Польська мова (Школа)" } },
    ],
  },
  {
    id: "school_other", icon: "📚",
    name: { en: "Other School Subjects", ru: "Другие (Школа)", uk: "Інші предмети (Школа)" },
    subjects: [
      { id: "informatics_school", icon: "💻", name: { en: "Informatics (School)", ru: "Информатика (Школа)", uk: "Інформатика (Школа)" } },
      { id: "world_literature_school", icon: "📕", name: { en: "World Literature (School)", ru: "Зарубежная литература", uk: "Зарубіжна література" } },
      { id: "pravoznavstvo", icon: "⚖️", name: { en: "Legal Studies (School)", ru: "Правоведение", uk: "Правознавство" } },
      { id: "economics_school", icon: "💰", name: { en: "Economics (School)", ru: "Экономика (Школа)", uk: "Економіка (Школа)" } },
      { id: "ecology_school", icon: "🌱", name: { en: "Ecology (School)", ru: "Экология (Школа)", uk: "Екологія (Школа)" } },
      { id: "health_basics", icon: "❤️", name: { en: "Health Basics", ru: "Основы здоровья", uk: "Основи здоров'я" } },
      { id: "defense_ukraine", icon: "🛡", name: { en: "Defense of Ukraine", ru: "Защита Отечества", uk: "Захист України" } },
      { id: "art_school", icon: "🎨", name: { en: "Art (School)", ru: "Искусство (Школа)", uk: "Мистецтво (Школа)" } },
      { id: "music_school", icon: "🎵", name: { en: "Music (School)", ru: "Музыка (Школа)", uk: "Музика (Школа)" } },
      { id: "physical_ed", icon: "🏃", name: { en: "Physical Education", ru: "Физкультура", uk: "Фізкультура" } },
      { id: "technology_school", icon: "🔧", name: { en: "Technology (School)", ru: "Трудовое обучение", uk: "Трудове навчання" } },
    ],
  },
  {
    id: "college_it", icon: "💻",
    name: { en: "IT & Programming (College)", ru: "IT (Колледж/ПТУ)", uk: "IT (Коледж/ПТУ)" },
    subjects: [
      { id: "programming", icon: "💻", name: { en: "Programming", ru: "Программирование", uk: "Програмування" } },
      { id: "web_dev", icon: "🌐", name: { en: "Web Development", ru: "Веб-разработка", uk: "Веб-розробка" } },
      { id: "databases", icon: "🗃", name: { en: "Databases", ru: "Базы данных", uk: "Бази даних" } },
      { id: "networks", icon: "🔗", name: { en: "Computer Networks", ru: "Компьютерные сети", uk: "Комп'ютерні мережі" } },
      { id: "algorithms", icon: "⚙️", name: { en: "Algorithms", ru: "Алгоритмы", uk: "Алгоритми" } },
      { id: "oop", icon: "🧱", name: { en: "OOP", ru: "ООП", uk: "ООП" } },
      { id: "os_college", icon: "🖥", name: { en: "Operating Systems", ru: "Операционные системы", uk: "Операційні системи" } },
      { id: "hardware", icon: "🔌", name: { en: "Computer Hardware", ru: "Аппаратное обеспечение", uk: "Апаратне забезпечення" } },
      { id: "mobile_dev", icon: "📱", name: { en: "Mobile Development", ru: "Мобильная разработка", uk: "Мобільна розробка" } },
      { id: "cybersecurity", icon: "🔒", name: { en: "Cybersecurity", ru: "Кибербезопасность", uk: "Кібербезпека" } },
    ],
  },
  {
    id: "college_tech", icon: "🔧",
    name: { en: "Technical (College/Vocational)", ru: "Технические (Колледж/ПТУ)", uk: "Технічні (Коледж/ПТУ)" },
    subjects: [
      { id: "electrical_eng", icon: "⚡", name: { en: "Electrical Engineering", ru: "Электротехника", uk: "Електротехніка" } },
      { id: "mechanics_college", icon: "⚙️", name: { en: "Mechanics", ru: "Механика", uk: "Механіка" } },
      { id: "engineering_graphics", icon: "📐", name: { en: "Engineering Graphics", ru: "Инженерная графика", uk: "Інженерна графіка" } },
      { id: "material_science", icon: "🔩", name: { en: "Material Science", ru: "Материаловедение", uk: "Матеріалознавство" } },
      { id: "metrology", icon: "📏", name: { en: "Metrology", ru: "Метрология", uk: "Метрологія" } },
      { id: "auto_repair", icon: "🚗", name: { en: "Auto Repair", ru: "Автослесарное дело", uk: "Автослюсарна справа" } },
      { id: "welding", icon: "🔥", name: { en: "Welding", ru: "Сварочное дело", uk: "Зварювальна справа" } },
      { id: "construction_tech", icon: "🏗", name: { en: "Construction Tech", ru: "Строительные технологии", uk: "Будівельні технології" } },
      { id: "plumbing", icon: "🔧", name: { en: "Plumbing", ru: "Сантехника", uk: "Сантехніка" } },
      { id: "electronics", icon: "📟", name: { en: "Electronics", ru: "Электроника", uk: "Електроніка" } },
    ],
  },
  {
    id: "uni_math", icon: "∫",
    name: { en: "Mathematics (University)", ru: "Математика (Универ)", uk: "Математика (Універ)" },
    subjects: [
      { id: "higher_math", icon: "∫", name: { en: "Higher Mathematics", ru: "Высшая математика", uk: "Вища математика" } },
      { id: "math_analysis", icon: "∑", name: { en: "Mathematical Analysis", ru: "Математический анализ", uk: "Математичний аналіз" } },
      { id: "linear_algebra", icon: "📊", name: { en: "Linear Algebra", ru: "Линейная алгебра", uk: "Лінійна алгебра" } },
      { id: "discrete_math", icon: "🔢", name: { en: "Discrete Mathematics", ru: "Дискретная математика", uk: "Дискретна математика" } },
      { id: "statistics", icon: "📈", name: { en: "Statistics & Probability", ru: "Статистика и вероятность", uk: "Статистика та ймовірність" } },
      { id: "diff_equations", icon: "📉", name: { en: "Differential Equations", ru: "Дифференциальные уравнения", uk: "Диференціальні рівняння" } },
      { id: "num_methods", icon: "🔣", name: { en: "Numerical Methods", ru: "Численные методы", uk: "Чисельні методи" } },
      { id: "complex_analysis", icon: "🔮", name: { en: "Complex Analysis", ru: "Комплексный анализ", uk: "Комплексний аналіз" } },
    ],
  },
  {
    id: "uni_it", icon: "🖥",
    name: { en: "IT (University)", ru: "IT (Универ)", uk: "IT (Універ)" },
    subjects: [
      { id: "prog_uni", icon: "💻", name: { en: "Programming (Uni)", ru: "Программирование (Универ)", uk: "Програмування (Універ)" } },
      { id: "ai_ml", icon: "🤖", name: { en: "AI & Machine Learning", ru: "AI и Machine Learning", uk: "AI та Machine Learning" } },
      { id: "sysadmin", icon: "🖥", name: { en: "System Administration", ru: "Системное администрирование", uk: "Системне адміністрування" } },
      { id: "devops", icon: "🚀", name: { en: "DevOps", ru: "DevOps", uk: "DevOps" } },
      { id: "db_uni", icon: "🗃", name: { en: "Databases (Uni)", ru: "Базы данных (Универ)", uk: "Бази даних (Універ)" } },
      { id: "software_eng", icon: "📦", name: { en: "Software Engineering", ru: "Программная инженерия", uk: "Програмна інженерія" } },
      { id: "computer_architecture", icon: "🧬", name: { en: "Computer Architecture", ru: "Архитектура компьютеров", uk: "Архітектура комп'ютерів" } },
      { id: "data_science", icon: "📊", name: { en: "Data Science", ru: "Data Science", uk: "Data Science" } },
    ],
  },
  {
    id: "uni_humanities", icon: "📜",
    name: { en: "Humanities (University)", ru: "Гуманитарные (Универ)", uk: "Гуманітарні (Універ)" },
    subjects: [
      { id: "philosophy", icon: "🤔", name: { en: "Philosophy", ru: "Философия", uk: "Філософія" } },
      { id: "psychology", icon: "🧠", name: { en: "Psychology", ru: "Психология", uk: "Психологія" } },
      { id: "sociology", icon: "👥", name: { en: "Sociology", ru: "Социология", uk: "Соціологія" } },
      { id: "political_science", icon: "🏛", name: { en: "Political Science", ru: "Политология", uk: "Політологія" } },
      { id: "cultural_studies", icon: "🎭", name: { en: "Cultural Studies", ru: "Культурология", uk: "Культурологія" } },
      { id: "pedagogy", icon: "📖", name: { en: "Pedagogy", ru: "Педагогика", uk: "Педагогіка" } },
      { id: "history_uni", icon: "📜", name: { en: "History (Uni)", ru: "История (Универ)", uk: "Історія (Універ)" } },
      { id: "ukr_mova_uni", icon: "🇺🇦", name: { en: "Ukrainian Language (Uni)", ru: "Укр. язык (Универ)", uk: "Українська мова (Універ)" } },
      { id: "english_uni", icon: "🇬🇧", name: { en: "English (Uni)", ru: "Английский (Универ)", uk: "Англійська мова (Універ)" } },
      { id: "linguistics", icon: "🔤", name: { en: "Linguistics", ru: "Лингвистика", uk: "Лінгвістика" } },
    ],
  },
  {
    id: "uni_business", icon: "💼",
    name: { en: "Business & Economics (Uni)", ru: "Бизнес и Экономика (Универ)", uk: "Бізнес та Економіка (Універ)" },
    subjects: [
      { id: "economics_uni", icon: "💰", name: { en: "Economics", ru: "Экономика", uk: "Економіка" } },
      { id: "management", icon: "📋", name: { en: "Management", ru: "Менеджмент", uk: "Менеджмент" } },
      { id: "marketing", icon: "📣", name: { en: "Marketing", ru: "Маркетинг", uk: "Маркетинг" } },
      { id: "accounting", icon: "🧾", name: { en: "Accounting", ru: "Бухгалтерский учёт", uk: "Бухгалтерський облік" } },
      { id: "finance", icon: "🏦", name: { en: "Finance", ru: "Финансы", uk: "Фінанси" } },
      { id: "business_plan", icon: "📑", name: { en: "Business Planning", ru: "Бизнес-планирование", uk: "Бізнес-планування" } },
      { id: "international_economics", icon: "🌐", name: { en: "International Economics", ru: "Международная экономика", uk: "Міжнародна економіка" } },
      { id: "econometrics", icon: "📉", name: { en: "Econometrics", ru: "Эконометрика", uk: "Економетрика" } },
    ],
  },
  {
    id: "uni_law", icon: "⚖️",
    name: { en: "Law (University)", ru: "Право (Универ)", uk: "Право (Універ)" },
    subjects: [
      { id: "law_uni", icon: "⚖️", name: { en: "Law Theory", ru: "Теория права", uk: "Теорія права" } },
      { id: "constitutional_law", icon: "📜", name: { en: "Constitutional Law", ru: "Конституционное право", uk: "Конституційне право" } },
      { id: "criminal_law", icon: "🔨", name: { en: "Criminal Law", ru: "Уголовное право", uk: "Кримінальне право" } },
      { id: "civil_law", icon: "📝", name: { en: "Civil Law", ru: "Гражданское право", uk: "Цивільне право" } },
      { id: "admin_law", icon: "🏢", name: { en: "Administrative Law", ru: "Административное право", uk: "Адміністративне право" } },
      { id: "labor_law", icon: "👷", name: { en: "Labor Law", ru: "Трудовое право", uk: "Трудове право" } },
      { id: "international_law", icon: "🌐", name: { en: "International Law", ru: "Международное право", uk: "Міжнародне право" } },
    ],
  },
  {
    id: "uni_eng", icon: "🏗",
    name: { en: "Engineering (University)", ru: "Инженерия (Универ)", uk: "Інженерія (Універ)" },
    subjects: [
      { id: "theoretical_mechanics", icon: "⚙️", name: { en: "Theoretical Mechanics", ru: "Теоретическая механика", uk: "Теоретична механіка" } },
      { id: "resistance_materials", icon: "🔩", name: { en: "Strength of Materials", ru: "Сопромат", uk: "Опір матеріалів" } },
      { id: "thermodynamics", icon: "🌡", name: { en: "Thermodynamics", ru: "Термодинамика", uk: "Термодинаміка" } },
      { id: "fluid_mechanics", icon: "💧", name: { en: "Fluid Mechanics", ru: "Гидравлика", uk: "Гідравліка" } },
      { id: "architecture", icon: "🏛", name: { en: "Architecture", ru: "Архитектура", uk: "Архітектура" } },
      { id: "construction", icon: "🏗", name: { en: "Construction", ru: "Строительство", uk: "Будівництво" } },
      { id: "eng_graphics_uni", icon: "📐", name: { en: "Eng. Graphics (Uni)", ru: "Инж. графика (Универ)", uk: "Інж. графіка (Універ)" } },
    ],
  },
  {
    id: "uni_medicine", icon: "🏥",
    name: { en: "Medicine (University)", ru: "Медицина (Универ)", uk: "Медицина (Універ)" },
    subjects: [
      { id: "anatomy", icon: "🫀", name: { en: "Anatomy", ru: "Анатомия", uk: "Анатомія" } },
      { id: "physiology", icon: "🫁", name: { en: "Physiology", ru: "Физиология", uk: "Фізіологія" } },
      { id: "pharmacology", icon: "💊", name: { en: "Pharmacology", ru: "Фармакология", uk: "Фармакологія" } },
      { id: "histology", icon: "🔬", name: { en: "Histology", ru: "Гистология", uk: "Гістологія" } },
      { id: "microbiology", icon: "🦠", name: { en: "Microbiology", ru: "Микробиология", uk: "Мікробіологія" } },
      { id: "biochemistry", icon: "🧬", name: { en: "Biochemistry", ru: "Биохимия", uk: "Біохімія" } },
      { id: "nursing", icon: "👨‍⚕️", name: { en: "Nursing", ru: "Сестринское дело", uk: "Медсестринство" } },
      { id: "public_health", icon: "🏥", name: { en: "Public Health", ru: "Общественное здоровье", uk: "Громадське здоров'я" } },
    ],
  },
  {
    id: "other", icon: "📚",
    name: { en: "Other", ru: "Другое", uk: "Інше" },
    subjects: [
      { id: "ecology", icon: "🌱", name: { en: "Ecology", ru: "Экология", uk: "Екологія" } },
      { id: "geography_uni", icon: "🌍", name: { en: "Geography", ru: "География", uk: "Географія" } },
      { id: "art", icon: "🎨", name: { en: "Art & Design", ru: "Искусство и Дизайн", uk: "Мистецтво та Дизайн" } },
      { id: "music", icon: "🎵", name: { en: "Music", ru: "Музыка", uk: "Музика" } },
      { id: "physical_ed_uni", icon: "🏃", name: { en: "Physical Education", ru: "Физкультура", uk: "Фізкультура" } },
      { id: "bzd", icon: "🛡", name: { en: "Safety of Life", ru: "БЖД", uk: "БЖД (Безпека життєдіяльності)" } },
      { id: "other", icon: "📚", name: { en: "Other", ru: "Другое", uk: "Інше" } },
    ],
  },
];

export interface SubjectCategory {
  id: string;
  icon: string;
  name: string;
  subjects: Array<{ id: string; icon: string; name: string }>;
}

export function getSubjectCategories(): SubjectCategory[] {
  const lang = currentLang;
  return SUBJECT_CATEGORIES.map(cat => ({
    id: cat.id,
    icon: cat.icon,
    name: cat.name[lang] || cat.name.ru || cat.name.en,
    subjects: cat.subjects.map(s => ({
      id: s.id,
      icon: s.icon,
      name: s.name[lang] || s.name.ru || s.name.en,
    })),
  }));
}

export function getAllSubjects() {
  const lang = currentLang;
  return SUBJECT_CATEGORIES.flatMap(cat =>
    cat.subjects.map(s => ({
      id: s.id,
      icon: s.icon,
      name: s.name[lang] || s.name.ru || s.name.en,
      category: cat.name[lang] || cat.name.ru || cat.name.en,
    }))
  );
}

export function getSubjectName(subjectId: string): string {
  const lang = currentLang;
  for (const cat of SUBJECT_CATEGORIES) {
    for (const s of cat.subjects) {
      if (s.id === subjectId) return s.name[lang] || s.name.ru || s.name.en;
    }
  }
  return subjectId;
}

export function getCategoryName(categoryId: string): string {
  const lang = currentLang;
  const cat = SUBJECT_CATEGORIES.find(c => c.id === categoryId);
  return cat ? (cat.name[lang] || cat.name.ru || cat.name.en) : categoryId;
}

export function getSubjects() {
  return getAllSubjects().map(s => ({ id: s.id, label: s.name, icon: s.icon }));
}

export function getReportTypeMap() {
  return Object.fromEntries(getReportTypes().map(r => [r.id, r]));
}

export function getSubjectMap() {
  return Object.fromEntries(getSubjects().map(s => [s.id, { ...s, label: s.label }]));
}

export function getUserLevel(totalReports: number): { name: string; icon: string; min: number; max: number; color: string } {
  const lang = currentLang as "en" | "ru" | "uk";
  const levels = [
    { min: 0, max: 5, icon: "🌱", color: "from-green-400 to-emerald-500",
      name: { en: "Beginner", ru: "Новичок", uk: "Початківець" } as Record<string, string> },
    { min: 6, max: 20, icon: "📚", color: "from-blue-400 to-blue-600",
      name: { en: "Student", ru: "Студент", uk: "Студент" } as Record<string, string> },
    { min: 21, max: 50, icon: "🎓", color: "from-violet-400 to-purple-600",
      name: { en: "Expert", ru: "Эксперт", uk: "Експерт" } as Record<string, string> },
    { min: 51, max: 100, icon: "🏆", color: "from-amber-400 to-orange-600",
      name: { en: "Master", ru: "Мастер", uk: "Майстер" } as Record<string, string> },
    { min: 101, max: 999999, icon: "👑", color: "from-yellow-300 to-amber-500",
      name: { en: "Legend", ru: "Легенда", uk: "Легенда" } as Record<string, string> },
  ];

  const level = levels.find(l => totalReports >= l.min && totalReports <= l.max) || levels[0];
  return { name: level.name[lang] || level.name["en"], icon: level.icon, min: level.min, max: level.max, color: level.color };
}

export function getNextLevel(totalReports: number): { name: string; reportsNeeded: number } | null {
  const lang = currentLang as string;
  const thresholds = [
    { at: 6, name: { en: "Student", ru: "Студент", uk: "Студент" } as Record<string, string> },
    { at: 21, name: { en: "Expert", ru: "Эксперт", uk: "Експерт" } as Record<string, string> },
    { at: 51, name: { en: "Master", ru: "Мастер", uk: "Майстер" } as Record<string, string> },
    { at: 101, name: { en: "Legend", ru: "Легенда", uk: "Легенда" } as Record<string, string> },
  ];
  const next = thresholds.find(t => totalReports < t.at);
  if (!next) return null;
  return { name: next.name[lang] || next.name["en"], reportsNeeded: next.at - totalReports };
}
