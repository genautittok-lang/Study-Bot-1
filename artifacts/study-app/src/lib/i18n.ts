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
  letsGo: string;
  shareWithFriend: string;
  referralStep1: string;
  referralStep2: string;
  referralStep3: string;
  yourReward: string;
  friendReward: string;
  howItWorks: string;
  sendInvite: string;
  friendsJoined: string;
  earnedReports: string;
  cardPaymentDesc: string;
  cryptoPaymentDesc: string;
  starsPaymentDesc: string;
  sendScreenshot: string;
  sendScreenshotCrypto: string;
  paymentVerification: string;
  payStep1Card: string;
  payStep2Card: string;
  payStep3Card: string;
  payStep1Crypto: string;
  payStep2Crypto: string;
  payStep3Crypto: string;
  adminWillCheck: string;
  uahOnly: string;
  uploadScreenshot: string;
  uploadScreenshotDesc: string;
  screenshotUploaded: string;
  changeScreenshot: string;
  screenshotRequired: string;
  submitting: string;
  paymentSubmitted: string;
  paymentSubmittedDesc: string;
  adminReviewing: string;
  searchReports: string;
  settings: string;
  support: string;
  shareApp: string;
  shareAppDesc: string;
  rateBot: string;
  rateBotDesc: string;
  about: string;
  version: string;
  speedAch: string;
  hundredReportsAch: string;
  genTip1: string;
  genTip2: string;
  genTip3: string;
  genTip4: string;
  genTip5: string;
  genTip6: string;
  supportTitle: string;
  supportDesc: string;
  supportFormTitle: string;
  supportFormDesc: string;
  supportCategory: string;
  supportCatPayment: string;
  supportCatGeneration: string;
  supportCatBug: string;
  supportCatFeature: string;
  supportCatOther: string;
  supportMessageLabel: string;
  supportMessagePlaceholder: string;
  supportSend: string;
  supportSent: string;
  supportSentDesc: string;
  supportInfo: string;
  supportResponseTime: string;
  supportBotNote: string;
  supportViaTelegram: string;
};

const translations: Record<string, TranslationKeys> = {
  en: {
    appName: "StudyFlush",
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
    letsGo: "Let's Go",
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
    receiptNote: "After payment, send a screenshot of the receipt to @studyflush_bot",
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
    starsInstructions: "Send the Stars to @studyflush_bot and press confirm below.",
    supportContact: "Support",
    choosePaymentMethod: "Payment methods",
    currentBalance: "Current balance",
    paymentSent: "I paid",
    paymentNote: "After admin verification, your balance will be credited. Usually within 1-24 hours.",
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
    shareText: "Generated with StudyFlush Bot",
    recentSubjects: "Recent",
    continueWith: "Continue",
    shareWithFriend: "Share with a friend",
    referralStep1: "Send your link to a friend",
    referralStep2: "Friend creates their first report",
    referralStep3: "You both get +2 reports!",
    yourReward: "You get",
    friendReward: "Friend gets",
    howItWorks: "How it works",
    sendInvite: "Send invite via Telegram",
    friendsJoined: "friends joined",
    earnedReports: "reports earned",
    cardPaymentDesc: "Transfer 250 UAH to the card and send a screenshot",
    cryptoPaymentDesc: "Send 5 USDT via TRC-20 network",
    starsPaymentDesc: "Instant payment via Telegram",
    sendScreenshot: "After payment, send a screenshot of the receipt to @studyflush_bot — the admin will verify and credit your balance",
    sendScreenshotCrypto: "After transfer, send a screenshot of the transaction to @studyflush_bot — the admin will verify and credit your balance",
    paymentVerification: "Manual verification by admin",
    payStep1Card: "Transfer 250 UAH to the card",
    payStep2Card: "Upload payment screenshot",
    payStep3Card: "Admin verifies and credits 15 reports",
    payStep1Crypto: "Send 5 USDT (TRC-20) to the address",
    payStep2Crypto: "Upload transaction screenshot",
    payStep3Crypto: "Admin verifies and credits 15 reports",
    adminWillCheck: "Admin will verify your payment manually",
    uahOnly: "Ukraine only",
    uploadScreenshot: "Upload Screenshot",
    uploadScreenshotDesc: "Attach a screenshot of your payment",
    screenshotUploaded: "Screenshot attached ✓",
    changeScreenshot: "Change",
    screenshotRequired: "Please attach a payment screenshot",
    submitting: "Sending...",
    paymentSubmitted: "Request sent!",
    paymentSubmittedDesc: "Admin will verify your payment and credit balance within 1-24 hours. You'll get a notification in the bot!",
    adminReviewing: "Under review",
    searchReports: "Search reports...",
    settings: "Settings",
    support: "Support",
    shareApp: "Share App",
    shareAppDesc: "Tell friends about StudyFlush",
    rateBot: "Rate Bot",
    rateBotDesc: "Leave a review on Telegram",
    about: "About",
    version: "Version",
    speedAch: "Speed Runner",
    hundredReportsAch: "Legend",
    genTip1: "AI is analyzing your topic...",
    genTip2: "Building document structure...",
    genTip3: "Generating content sections...",
    genTip4: "Adding references & sources...",
    genTip5: "Formatting & polishing...",
    genTip6: "Almost ready!",
    supportTitle: "Support",
    supportDesc: "Describe your issue and we'll help",
    supportFormTitle: "Contact Us",
    supportFormDesc: "Your message will be sent to the admin",
    supportCategory: "Category",
    supportCatPayment: "Payment",
    supportCatGeneration: "Generation",
    supportCatBug: "Bug",
    supportCatFeature: "Idea",
    supportCatOther: "Other",
    supportMessageLabel: "Your message",
    supportMessagePlaceholder: "Describe your issue or question in detail...",
    supportSend: "Send Message",
    supportSent: "Message Sent!",
    supportSentDesc: "We received your request. The admin will respond within 24 hours via Telegram bot.",
    supportInfo: "How support works",
    supportResponseTime: "Response time: usually within 1-24 hours",
    supportBotNote: "You can also message @studyflush_bot directly",
    supportViaTelegram: "Open Bot in Telegram",
  },
  ru: {
    appName: "StudyFlush",
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
    letsGo: "Поехали",
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
    receiptNote: "После оплаты отправь скриншот чека в @studyflush_bot",
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
    starsInstructions: "Отправьте Stars боту @studyflush_bot и нажмите подтвердить.",
    supportContact: "Поддержка",
    choosePaymentMethod: "Способы оплаты",
    currentBalance: "Текущий баланс",
    paymentSent: "Я оплатил",
    paymentNote: "После проверки админом баланс будет зачислен. Обычно в течение 1-24 часов.",
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
    shareText: "Сгенерировано в StudyFlush Bot",
    recentSubjects: "Недавние",
    continueWith: "Продолжить",
    shareWithFriend: "Поделись с другом",
    referralStep1: "Отправь ссылку другу",
    referralStep2: "Друг создаёт свой первый отчёт",
    referralStep3: "Вы оба получите +2 отчёта!",
    yourReward: "Ты получишь",
    friendReward: "Друг получит",
    howItWorks: "Как это работает",
    sendInvite: "Отправить через Telegram",
    friendsJoined: "друзей пришло",
    earnedReports: "отчётов заработано",
    cardPaymentDesc: "Переведи 250 грн на карту и отправь скриншот",
    cryptoPaymentDesc: "Отправь 5 USDT по сети TRC-20",
    starsPaymentDesc: "Моментальная оплата через Telegram",
    sendScreenshot: "После оплаты отправь скриншот чека в @studyflush_bot — админ проверит и зачислит баланс",
    sendScreenshotCrypto: "После перевода отправь скриншот транзакции в @studyflush_bot — админ проверит и зачислит баланс",
    paymentVerification: "Ручная проверка админом",
    payStep1Card: "Переведи 250 грн на карту",
    payStep2Card: "Загрузи скриншот оплаты",
    payStep3Card: "Админ проверит и зачислит 15 отчётов",
    payStep1Crypto: "Отправь 5 USDT (TRC-20) на адрес",
    payStep2Crypto: "Загрузи скриншот транзакции",
    payStep3Crypto: "Админ проверит и зачислит 15 отчётов",
    adminWillCheck: "Админ проверит оплату вручную",
    uahOnly: "Только Украина",
    uploadScreenshot: "Загрузить скриншот",
    uploadScreenshotDesc: "Прикрепи скриншот оплаты",
    screenshotUploaded: "Скриншот прикреплён ✓",
    changeScreenshot: "Изменить",
    screenshotRequired: "Пожалуйста, прикрепи скриншот оплаты",
    submitting: "Отправляем...",
    paymentSubmitted: "Заявка отправлена!",
    paymentSubmittedDesc: "Админ проверит оплату и зачислит баланс в течение 1-24 часов. Ты получишь уведомление в боте!",
    adminReviewing: "На проверке",
    searchReports: "Поиск работ...",
    settings: "Настройки",
    support: "Поддержка",
    shareApp: "Поделиться",
    shareAppDesc: "Расскажи друзьям о StudyFlush",
    rateBot: "Оценить бота",
    rateBotDesc: "Оставить отзыв в Telegram",
    about: "О приложении",
    version: "Версия",
    speedAch: "Скоростной",
    hundredReportsAch: "Легенда",
    genTip1: "ИИ анализирует тему...",
    genTip2: "Формируем структуру документа...",
    genTip3: "Генерация основного контента...",
    genTip4: "Добавляем источники и ссылки...",
    genTip5: "Форматирование и шлифовка...",
    genTip6: "Почти готово!",
    supportTitle: "Поддержка",
    supportDesc: "Опиши проблему и мы поможем",
    supportFormTitle: "Написать нам",
    supportFormDesc: "Сообщение будет отправлено админу",
    supportCategory: "Категория",
    supportCatPayment: "Оплата",
    supportCatGeneration: "Генерация",
    supportCatBug: "Баг",
    supportCatFeature: "Идея",
    supportCatOther: "Другое",
    supportMessageLabel: "Ваше сообщение",
    supportMessagePlaceholder: "Опишите вашу проблему или вопрос подробно...",
    supportSend: "Отправить",
    supportSent: "Сообщение отправлено!",
    supportSentDesc: "Мы получили ваш запрос. Админ ответит в течение 24 часов через бота в Telegram.",
    supportInfo: "Как работает поддержка",
    supportResponseTime: "Время ответа: обычно 1-24 часа",
    supportBotNote: "Также можно написать напрямую @studyflush_bot",
    supportViaTelegram: "Открыть бота в Telegram",
  },
  uk: {
    appName: "StudyFlush",
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
    letsGo: "Погнали",
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
    receiptNote: "Після оплати надішли скріншот чеку в @studyflush_bot",
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
    starsInstructions: "Надішліть Stars боту @studyflush_bot та натисніть підтвердити.",
    supportContact: "Підтримка",
    choosePaymentMethod: "Способи оплати",
    currentBalance: "Поточний баланс",
    paymentSent: "Я оплатив",
    paymentNote: "Після перевірки адміном баланс буде зараховано. Зазвичай протягом 1-24 годин.",
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
    shareText: "Згенеровано в StudyFlush Bot",
    recentSubjects: "Нещодавні",
    continueWith: "Продовжити",
    shareWithFriend: "Поділись з другом",
    referralStep1: "Відправ посилання другу",
    referralStep2: "Друг створює свій перший звіт",
    referralStep3: "Ви обидва отримаєте +2 звіти!",
    yourReward: "Ти отримаєш",
    friendReward: "Друг отримає",
    howItWorks: "Як це працює",
    sendInvite: "Надіслати через Telegram",
    friendsJoined: "друзів приєдналось",
    earnedReports: "звітів зароблено",
    cardPaymentDesc: "Переведи 250 грн на картку та надішли скріншот",
    cryptoPaymentDesc: "Надішли 5 USDT через мережу TRC-20",
    starsPaymentDesc: "Миттєва оплата через Telegram",
    sendScreenshot: "Після оплати надішли скріншот чеку в @studyflush_bot — адмін перевірить та зарахує баланс",
    sendScreenshotCrypto: "Після переказу надішли скріншот транзакції в @studyflush_bot — адмін перевірить та зарахує баланс",
    paymentVerification: "Ручна перевірка адміном",
    payStep1Card: "Переведи 250 грн на картку",
    payStep2Card: "Завантаж скріншот оплати",
    payStep3Card: "Адмін перевірить та зарахує 15 звітів",
    payStep1Crypto: "Надішли 5 USDT (TRC-20) на адресу",
    payStep2Crypto: "Завантаж скріншот транзакції",
    payStep3Crypto: "Адмін перевірить та зарахує 15 звітів",
    adminWillCheck: "Адмін перевірить оплату вручну",
    uahOnly: "Тільки Україна",
    uploadScreenshot: "Завантажити скріншот",
    uploadScreenshotDesc: "Прикріпи скріншот оплати",
    screenshotUploaded: "Скріншот прикріплено ✓",
    changeScreenshot: "Змінити",
    screenshotRequired: "Будь ласка, прикріпи скріншот оплати",
    submitting: "Надсилаємо...",
    paymentSubmitted: "Запит надіслано!",
    paymentSubmittedDesc: "Адмін перевірить оплату та зарахує баланс протягом 1-24 годин. Ти отримаєш сповіщення в боті!",
    adminReviewing: "На перевірці",
    searchReports: "Пошук робіт...",
    settings: "Налаштування",
    support: "Підтримка",
    shareApp: "Поділитися",
    shareAppDesc: "Розкажи друзям про StudyFlush",
    rateBot: "Оцінити бота",
    rateBotDesc: "Залишити відгук в Telegram",
    about: "Про додаток",
    version: "Версія",
    speedAch: "Швидкий старт",
    hundredReportsAch: "Легенда",
    genTip1: "ШІ аналізує тему...",
    genTip2: "Формуємо структуру документа...",
    genTip3: "Генерація основного контенту...",
    genTip4: "Додаємо джерела та посилання...",
    genTip5: "Форматування та фінальна обробка...",
    genTip6: "Майже готово!",
    supportTitle: "Підтримка",
    supportDesc: "Опиши проблему і ми допоможемо",
    supportFormTitle: "Написати нам",
    supportFormDesc: "Повідомлення буде відправлено адміну",
    supportCategory: "Категорія",
    supportCatPayment: "Оплата",
    supportCatGeneration: "Генерація",
    supportCatBug: "Баг",
    supportCatFeature: "Ідея",
    supportCatOther: "Інше",
    supportMessageLabel: "Ваше повідомлення",
    supportMessagePlaceholder: "Опишіть вашу проблему або запитання детально...",
    supportSend: "Відправити",
    supportSent: "Повідомлення надіслано!",
    supportSentDesc: "Ми отримали ваш запит. Адмін відповість протягом 24 годин через бота в Telegram.",
    supportInfo: "Як працює підтримка",
    supportResponseTime: "Час відповіді: зазвичай 1-24 години",
    supportBotNote: "Також можна написати напряму @studyflush_bot",
    supportViaTelegram: "Відкрити бота в Telegram",
  },
  kk: {
    appName: "StudyFlush", welcome: "Сәлем", subtitle: "Оқуға арналған ақылды көмекші", yourBalance: "Сіздің балансыңыз", reportsAvailable: "қолжетімді", report1: "есеп", reports2_4: "есеп", reports5: "есеп", firstReportFree: "Бірінші есеп тегін!", newReport: "Жаңа есеп", generateAI: "AI арқылы жасау", history: "Тарих", myReports: "Менің есептерім", topUp: "Толтыру", buyReports: "Есептер сатып алу", stats: "Статистика", quickStart: "Жылдам бастау", quickStartDesc: "Құжат түрін, пәнді және тақырыпты таңдаңыз — AI бәрін 10-30 секундта жасайды!", createReport: "Есеп жасау", home: "Басты", create: "Жасау", letsGo: "Бастайық", balance: "Баланс", profile: "Профиль", newDocument: "Жаңа құжат", chooseDocType: "Құжат түрін таңдаңыз", subject: "Пән", chooseSubject: "Пән таңдаңыз", chooseCategory: "Санат таңдаңыз", details: "Мәліметтер", describeTask: "Не қажет екенін сипаттаңыз", topicLabel: "Тақырып / Тапсырма *", topicPlaceholder: "Мысалы: Python бойынша зертханалық жұмыс", groupLabel: "Топ / Сынып", groupPlaceholder: "Мысалы: IT-21, 11-A (міндетті емес)", attachPhoto: "Фото тіркеу", attachPhotoDesc: "Оқулықтан тапсырма фотосы", photoAttached: "Фото тіркелді", removePhoto: "Жою", maxFileSize: "Макс. 5 МБ, JPG/PNG", generate: "Жасау", generating: "Жасалуда...", generatingDesc: "AI тапсырмаңызбен жұмыс істеуде. Әдетте 10-30 секунд", done: "Дайын!", docGenerated: "Құжатыңыз жасалды", copy: "Көшіру", newOne: "Жаңа", error: "Қате", tryAgain: "Қайта байқап көріңіз", noBalance: "Балансыңызда жеткілікті есеп жоқ", topUpBalance: "Балансты толтыру", connectionError: "Байланыс қатесі. Қайта байқаңыз.", back: "Артқа", reportsGenerated: "құжат жасалды", docsHere: "Құжаттарыңыз мұнда пайда болады", noReportsYet: "Әзірге есептер жоқ.", createFirst: "Біріншісін жасаңыз!", copyText: "Мәтінді көшіру", contentUnavailable: "Контент қолжетімсіз", manageReports: "Есептеріңізді басқарыңыз", availableReports: "Қолжетімді есептер", total: "Барлығы", freeReport: "+1 тегін", crypto: "Крипто", cryptoDesc: "USDT / USDC (TRC-20)", telegramStars: "Telegram Stars", payViaTelegram: "Telegram арқылы төлеу", important: "Маңызды!", iPaid: "Мен төледім", cryptoAddress: "Адрес (TRC-20):", cryptoNote: "Аударымнан кейін транзакция хэшін қолдау чатына жіберіңіз", starsNote: "Telegram Stars арқылы төлеу үшін ботқа команда жіберіңіз:", starsCmd: "немесе бот мәзірінде 'Сатып алу' батырмасын басыңыз", payInBot: "Ботта төлеу", thankYou: "Рахмет!", paymentPending: "Біз төлемді 24 сағат ішінде тексереміз!", goBack: "Оралу", reports15: "15 есеп", loadError: "Жүктелмеді. Қайта байқаңыз.", profileTitle: "Профиль", language: "Тіл", chooseLanguage: "Тіл таңдаңыз", userId: "Пайдаланушы ID", joined: "Тіркелген", visaMastercard: "Visa / Mastercard", cardPayment: "Карта арқылы төлеу", cardNumber: "Карта нөмірі:", cardNote: "Төлем түсіндірмесінде ID нөміріңізді көрсетіңіз:", receiptNote: "Төлемнен кейін чек скриншотын @studyflush_bot-ға жіберіңіз", payAmount: "Төлеу", choosePayment: "Төлем әдісін таңдаңыз", popular: "Танымал", allSubjects: "Барлық пәндер", referralSystem: "Реферал жүйесі", inviteFriends: "Достарды шақыру", referralDesc: "Достарыңызды шақырыңыз және тегін есептер алыңыз! Екеуіңіз де +2 есеп аласыздар.", referralCode: "Реферал кодыңыз", copyLink: "Сілтемені көшіру", linkCopied: "Көшірілді!", invited: "Шақырылған", bonusEarned: "Бонус алынды", referralBonus: "Әр шақыру үшін +2 есеп", level: "Деңгей", nextLevel: "Келесі деңгей", achievements: "Жетістіктер", firstReportAch: "Бірінші қадам", tenReportsAch: "Сарапшы", fiftyReportsAch: "Шебер", referralAch: "Желілік", accountInfo: "Аккаунт", memberSince: "Мүше болған күн", proTip: "Кеңес", proTipText: "5 досыңызды шақырыңыз және 10 тегін есеп алыңыз!", reportReport: "Есеп", reportSummary: "Конспект", reportDatabase: "Деректер базасы", reportLab: "Зертхана", reportEssay: "Реферат", reportTasks: "Есептер", reportCourseWork: "Курстық жұмыс", reportDiploma: "Дипломдық", reportPresentation: "Презентация", reportTest: "Бақылау", reportNotes: "Дәріс конспектісі", reportReportDesc: "Тақырып бойынша ресми есеп", reportSummaryDesc: "Тақырыптың қысқаша мазмұны", reportDatabaseDesc: "SQL кестелер мен сұраулар", reportLabDesc: "Толық зертханалық жұмыс", reportEssayDesc: "Толық реферат", reportTasksDesc: "Есеп шығару", reportCourseWorkDesc: "Бөлімдері бар курстық жұмыс", reportDiplomaDesc: "Дипломдық жоба құрылымы", reportPresentationDesc: "Слайд бойынша презентация жоспары", reportTestDesc: "Бақылау / емтихан жауаптары", reportNotesDesc: "Дәріс конспектілері", eduSchool: "Мектеп", eduCollege: "Колледж", eduUni: "Университет", eduAll: "Барлығы", transferDescription: "Төмендегі картаға аударып, растаңыз", paymentAmount: "Сома", walletAddress: "Әмиян адресі", cryptoPayment: "Крипто USDT", starsDesc: "Telegram Stars арқылы төлеу", starsInstructions: "Stars-ды @studyflush_bot-ға жіберіп, растаңыз.", supportContact: "Қолдау", choosePaymentMethod: "Төлем әдістері", currentBalance: "Ағымдағы баланс", paymentSent: "Мен төледім", paymentNote: "Админ тексергеннен кейін баланс толтырылады. Әдетте 1-24 сағат.", noHistory: "Есептер жоқ", noHistoryDesc: "Мұнда көру үшін бірінші есепті жасаңыз", progress: "Прогресс", lengthShort: "Қысқа", lengthMedium: "Орташа", lengthFull: "Толық", lengthShortDesc: "~500 сөз", lengthMediumDesc: "~1500 сөз", lengthFullDesc: "~3000 сөз", reportLength: "Жұмыс көлемі", estimatedTime: "Уақыт", estimatedWords: "сөз", seconds: "сек", repeatReport: "Қайталау", shareReport: "Бөлісу", shareText: "StudyFlush Bot арқылы жасалды", recentSubjects: "Соңғы", continueWith: "Жалғастыру", shareWithFriend: "Досыңызбен бөлісіңіз", referralStep1: "Сілтемені досыңызға жіберіңіз", referralStep2: "Дос бірінші есебін жасайды", referralStep3: "Екеуіңіз де +2 есеп аласыздар!", yourReward: "Сіз аласыз", friendReward: "Дос алады", howItWorks: "Қалай жұмыс істейді", sendInvite: "Telegram арқылы шақыру жіберу", friendsJoined: "дос қосылды", earnedReports: "есеп табылды", cardPaymentDesc: "250 грн картаға аударып, скриншот жіберіңіз", cryptoPaymentDesc: "TRC-20 желісі арқылы 5 USDT жіберіңіз", starsPaymentDesc: "Telegram арқылы лезде төлеу", sendScreenshot: "Төлемнен кейін скриншотты @studyflush_bot-ға жіберіңіз", sendScreenshotCrypto: "Аударымнан кейін скриншотты @studyflush_bot-ға жіберіңіз", paymentVerification: "Админ қолмен тексеру", payStep1Card: "250 грн картаға аударыңыз", payStep2Card: "Төлем скриншотын жүктеңіз", payStep3Card: "Админ тексеріп, 15 есеп беріледі", payStep1Crypto: "5 USDT (TRC-20) адреске жіберіңіз", payStep2Crypto: "Транзакция скриншотын жүктеңіз", payStep3Crypto: "Админ тексеріп, 15 есеп беріледі", adminWillCheck: "Админ төлемді қолмен тексереді", uahOnly: "Тек Украина", uploadScreenshot: "Скриншот жүктеу", uploadScreenshotDesc: "Төлем скриншотын тіркеңіз", screenshotUploaded: "Скриншот тіркелді ✓", changeScreenshot: "Өзгерту", screenshotRequired: "Төлем скриншотын тіркеңіз", submitting: "Жіберілуде...", paymentSubmitted: "Сұрау жіберілді!", paymentSubmittedDesc: "Админ төлемді тексеріп, 1-24 сағат ішінде баланс толтырады.", adminReviewing: "Тексеруде", searchReports: "Жұмыстарды іздеу...", settings: "Баптаулар", support: "Қолдау", shareApp: "Бөлісу", shareAppDesc: "Достарға StudyFlush туралы айтыңыз", rateBot: "Ботты бағалау", rateBotDesc: "Telegram-да пікір қалдыру", about: "Қосымша туралы", version: "Нұсқа", speedAch: "Жылдам", hundredReportsAch: "Аңыз", genTip1: "AI тақырыпты талдауда...", genTip2: "Құжат құрылымын жасауда...", genTip3: "Мазмұнды генерациялауда...", genTip4: "Дереккөздер қосуда...", genTip5: "Пішімдеу және өңдеу...", genTip6: "Дерлік дайын!", supportTitle: "Қолдау", supportDesc: "Мәселеңізді сипаттаңыз, біз көмектесеміз", supportFormTitle: "Бізге жазу", supportFormDesc: "Хабарлама админге жіберіледі", supportCategory: "Санат", supportCatPayment: "Төлем", supportCatGeneration: "Генерация", supportCatBug: "Қате", supportCatFeature: "Идея", supportCatOther: "Басқа", supportMessageLabel: "Сіздің хабарламаңыз", supportMessagePlaceholder: "Мәселеңізді немесе сұрағыңызды толық сипаттаңыз...", supportSend: "Жіберу", supportSent: "Хабарлама жіберілді!", supportSentDesc: "Сұрауыңыз қабылданды. Админ 24 сағат ішінде жауап береді.", supportInfo: "Қолдау қалай жұмыс істейді", supportResponseTime: "Жауап уақыты: әдетте 1-24 сағат", supportBotNote: "Сондай-ақ @studyflush_bot-ға тікелей жаза аласыз", supportViaTelegram: "Ботты Telegram-да ашу",
  },
  uz: {
    appName: "StudyFlush", welcome: "Salom", subtitle: "O'qish uchun aqlli yordamchi", yourBalance: "Sizning balansingiz", reportsAvailable: "mavjud", report1: "hisobot", reports2_4: "hisobot", reports5: "hisobot", firstReportFree: "Birinchi hisobot bepul!", newReport: "Yangi hisobot", generateAI: "AI bilan yaratish", history: "Tarix", myReports: "Mening hisobotlarim", topUp: "To'ldirish", buyReports: "Hisobotlar sotib olish", stats: "Statistika", quickStart: "Tezkor boshlash", quickStartDesc: "Hujjat turini, fanni va mavzuni tanlang — AI hammasini 10-30 soniyada bajaradi!", createReport: "Hisobot yaratish", home: "Bosh sahifa", create: "Yaratish", letsGo: "Boshlaylik", balance: "Balans", profile: "Profil", newDocument: "Yangi hujjat", chooseDocType: "Hujjat turini tanlang", subject: "Fan", chooseSubject: "Fan tanlang", chooseCategory: "Kategoriya tanlang", details: "Tafsilotlar", describeTask: "Nima kerakligini tasvirlang", topicLabel: "Mavzu / Topshiriq *", topicPlaceholder: "Masalan: Python bo'yicha laboratoriya ishi", groupLabel: "Guruh / Sinf", groupPlaceholder: "Masalan: IT-21, 11-A (ixtiyoriy)", attachPhoto: "Rasm biriktirish", attachPhotoDesc: "Darslikdan topshiriq rasmi", photoAttached: "Rasm biriktirildi", removePhoto: "O'chirish", maxFileSize: "Maks. 5 MB, JPG/PNG", generate: "Yaratish", generating: "Yaratilmoqda...", generatingDesc: "AI topshiriqingiz ustida ishlayapti. Odatda 10-30 soniya", done: "Tayyor!", docGenerated: "Hujjatingiz yaratildi", copy: "Nusxalash", newOne: "Yangi", error: "Xato", tryAgain: "Qayta urinib ko'ring", noBalance: "Balansda yetarli hisobot yo'q", topUpBalance: "Balansni to'ldirish", connectionError: "Ulanish xatosi. Qayta urinib ko'ring.", back: "Orqaga", reportsGenerated: "hujjat yaratildi", docsHere: "Hujjatlaringiz shu yerda paydo bo'ladi", noReportsYet: "Hali hisobotlar yo'q.", createFirst: "Birinchisini yarating!", copyText: "Matnni nusxalash", contentUnavailable: "Kontent mavjud emas", manageReports: "Hisobotlaringizni boshqaring", availableReports: "Mavjud hisobotlar", total: "Jami", freeReport: "+1 bepul", crypto: "Kripto", cryptoDesc: "USDT / USDC (TRC-20)", telegramStars: "Telegram Stars", payViaTelegram: "Telegram orqali to'lash", important: "Muhim!", iPaid: "Men to'ladim", cryptoAddress: "Manzil (TRC-20):", cryptoNote: "O'tkazishdan so'ng tranzaksiya xeshini qo'llab-quvvatlash chatiga yuboring", starsNote: "Telegram Stars orqali to'lash uchun botga buyruq yuboring:", starsCmd: "yoki bot menyusida 'Sotib olish' tugmasini bosing", payInBot: "Botda to'lash", thankYou: "Rahmat!", paymentPending: "Biz to'lovni 24 soat ichida tekshiramiz!", goBack: "Qaytish", reports15: "15 hisobot", loadError: "Yuklanmadi. Qayta urinib ko'ring.", profileTitle: "Profil", language: "Til", chooseLanguage: "Til tanlang", userId: "Foydalanuvchi ID", joined: "Ro'yxatdan o'tgan", visaMastercard: "Visa / Mastercard", cardPayment: "Karta orqali to'lov", cardNumber: "Karta raqami:", cardNote: "To'lov izohida ID raqamingizni ko'rsating:", receiptNote: "To'lovdan so'ng kvitansiya skrinshotini @studyflush_bot ga yuboring", payAmount: "To'lash", choosePayment: "To'lov usulini tanlang", popular: "Ommabop", allSubjects: "Barcha fanlar", referralSystem: "Referal tizimi", inviteFriends: "Do'stlarni taklif qilish", referralDesc: "Do'stlaringizni taklif qiling va bepul hisobotlar oling! Ikkalangiz +2 hisobot olasiz.", referralCode: "Referal kodingiz", copyLink: "Havolani nusxalash", linkCopied: "Nusxalandi!", invited: "Taklif qilingan", bonusEarned: "Bonus olingan", referralBonus: "Har bir taklif uchun +2 hisobot", level: "Daraja", nextLevel: "Keyingi daraja", achievements: "Yutuqlar", firstReportAch: "Birinchi qadam", tenReportsAch: "Ekspert", fiftyReportsAch: "Usta", referralAch: "Tarmoqchi", accountInfo: "Hisob", memberSince: "A'zo bo'lgan sana", proTip: "Maslahat", proTipText: "5 do'stingizni taklif qiling va 10 bepul hisobot oling!", reportReport: "Hisobot", reportSummary: "Konspekt", reportDatabase: "Ma'lumotlar bazasi", reportLab: "Laboratoriya", reportEssay: "Referat", reportTasks: "Masalalar", reportCourseWork: "Kurs ishi", reportDiploma: "Diplom", reportPresentation: "Prezentatsiya", reportTest: "Nazorat", reportNotes: "Ma'ruza yozuvlari", reportReportDesc: "Mavzu bo'yicha rasmiy hisobot", reportSummaryDesc: "Mavzuning qisqacha bayoni", reportDatabaseDesc: "SQL jadvallar va so'rovlar", reportLabDesc: "To'liq laboratoriya ishi", reportEssayDesc: "Batafsil referat", reportTasksDesc: "Masala yechish", reportCourseWorkDesc: "Bo'limli to'liq kurs ishi", reportDiplomaDesc: "Diplom loyiha tuzilishi", reportPresentationDesc: "Slayd bo'yicha prezentatsiya rejasi", reportTestDesc: "Nazorat / imtihon javoblari", reportNotesDesc: "Ma'ruza yozuvlari va bayonlar", eduSchool: "Maktab", eduCollege: "Kollej", eduUni: "Universitet", eduAll: "Hammasi", transferDescription: "Quyidagi kartaga o'tkazing va tasdiqlang", paymentAmount: "Summa", walletAddress: "Hamyon manzili", cryptoPayment: "Kripto USDT", starsDesc: "Telegram Stars orqali to'lash", starsInstructions: "Stars ni @studyflush_bot ga yuboring va tasdiqlang.", supportContact: "Qo'llab-quvvatlash", choosePaymentMethod: "To'lov usullari", currentBalance: "Joriy balans", paymentSent: "Men to'ladim", paymentNote: "Admin tekshirganidan so'ng balans to'ldiriladi. Odatda 1-24 soat.", noHistory: "Hisobotlar yo'q", noHistoryDesc: "Bu yerda ko'rish uchun birinchi hisobotni yarating", progress: "Progress", lengthShort: "Qisqa", lengthMedium: "O'rtacha", lengthFull: "To'liq", lengthShortDesc: "~500 so'z", lengthMediumDesc: "~1500 so'z", lengthFullDesc: "~3000 so'z", reportLength: "Ish hajmi", estimatedTime: "Vaqt", estimatedWords: "so'z", seconds: "son", repeatReport: "Takrorlash", shareReport: "Ulashish", shareText: "StudyFlush Bot orqali yaratildi", recentSubjects: "So'nggi", continueWith: "Davom ettirish", shareWithFriend: "Do'stingiz bilan ulashing", referralStep1: "Havolani do'stingizga yuboring", referralStep2: "Do'st birinchi hisobotini yaratadi", referralStep3: "Ikkalangiz +2 hisobot olasiz!", yourReward: "Siz olasiz", friendReward: "Do'st oladi", howItWorks: "Qanday ishlaydi", sendInvite: "Telegram orqali taklif yuborish", friendsJoined: "do'st qo'shildi", earnedReports: "hisobot topildi", cardPaymentDesc: "250 grn kartaga o'tkazing va skrinshot yuboring", cryptoPaymentDesc: "TRC-20 tarmog'i orqali 5 USDT yuboring", starsPaymentDesc: "Telegram orqali tezkor to'lov", sendScreenshot: "To'lovdan so'ng skrinshotni @studyflush_bot ga yuboring", sendScreenshotCrypto: "O'tkazishdan so'ng skrinshotni @studyflush_bot ga yuboring", paymentVerification: "Admin tomonidan qo'lda tekshirish", payStep1Card: "250 grn kartaga o'tkazing", payStep2Card: "To'lov skrinshotini yuklang", payStep3Card: "Admin tekshiradi va 15 hisobot beriladi", payStep1Crypto: "5 USDT (TRC-20) manzilga yuboring", payStep2Crypto: "Tranzaksiya skrinshotini yuklang", payStep3Crypto: "Admin tekshiradi va 15 hisobot beriladi", adminWillCheck: "Admin to'lovni qo'lda tekshiradi", uahOnly: "Faqat Ukraina", uploadScreenshot: "Skrinshot yuklash", uploadScreenshotDesc: "To'lov skrinshotini biriktiring", screenshotUploaded: "Skrinshot biriktirildi ✓", changeScreenshot: "O'zgartirish", screenshotRequired: "To'lov skrinshotini biriktiring", submitting: "Yuborilmoqda...", paymentSubmitted: "So'rov yuborildi!", paymentSubmittedDesc: "Admin to'lovni tekshirib, 1-24 soat ichida balansni to'ldiradi.", adminReviewing: "Tekshiruvda", searchReports: "Ishlarni qidirish...", settings: "Sozlamalar", support: "Qo'llab-quvvatlash", shareApp: "Ulashish", shareAppDesc: "Do'stlarga StudyFlush haqida ayting", rateBot: "Botni baholash", rateBotDesc: "Telegram da sharh qoldiring", about: "Ilova haqida", version: "Versiya", speedAch: "Tezkor", hundredReportsAch: "Afsona", genTip1: "AI mavzuni tahlil qilmoqda...", genTip2: "Hujjat tuzilishini yaratmoqda...", genTip3: "Asosiy kontentni yaratmoqda...", genTip4: "Manbalar qo'shmoqda...", genTip5: "Formatlash va pardozlash...", genTip6: "Deyarli tayyor!", supportTitle: "Qo'llab-quvvatlash", supportDesc: "Muammoingizni tasvirlang, biz yordam beramiz", supportFormTitle: "Bizga yozing", supportFormDesc: "Xabar adminga yuboriladi", supportCategory: "Kategoriya", supportCatPayment: "To'lov", supportCatGeneration: "Generatsiya", supportCatBug: "Xato", supportCatFeature: "G'oya", supportCatOther: "Boshqa", supportMessageLabel: "Sizning xabaringiz", supportMessagePlaceholder: "Muammo yoki savolingizni batafsil tasvirlang...", supportSend: "Yuborish", supportSent: "Xabar yuborildi!", supportSentDesc: "So'rovingiz qabul qilindi. Admin 24 soat ichida javob beradi.", supportInfo: "Qo'llab-quvvatlash qanday ishlaydi", supportResponseTime: "Javob vaqti: odatda 1-24 soat", supportBotNote: "Shuningdek @studyflush_bot ga to'g'ridan-to'g'ri yozishingiz mumkin", supportViaTelegram: "Botni Telegram da ochish",
  },
  tr: {
    appName: "StudyFlush", welcome: "Merhaba", subtitle: "Akıllı ders asistanın", yourBalance: "Bakiyeniz", reportsAvailable: "mevcut", report1: "rapor", reports2_4: "rapor", reports5: "rapor", firstReportFree: "İlk rapor ücretsiz!", newReport: "Yeni Rapor", generateAI: "AI ile Oluştur", history: "Geçmiş", myReports: "Raporlarım", topUp: "Yükle", buyReports: "Rapor satın al", stats: "İstatistikler", quickStart: "Hızlı Başlangıç", quickStartDesc: "Belge türünü, dersi ve konuyu seçin — AI her şeyi 10-30 saniyede yapar!", createReport: "Rapor Oluştur", home: "Ana Sayfa", create: "Oluştur", letsGo: "Başlayalım", balance: "Bakiye", profile: "Profil", newDocument: "Yeni Belge", chooseDocType: "Belge türünü seçin", subject: "Ders", chooseSubject: "Ders seçin", chooseCategory: "Kategori seçin", details: "Detaylar", describeTask: "Ne gerektiğini açıklayın", topicLabel: "Konu / Ödev *", topicPlaceholder: "Örn: Python laboratuvar çalışması — kabarcık sıralama", groupLabel: "Grup / Sınıf", groupPlaceholder: "Örn: IT-21, 11-A (opsiyonel)", attachPhoto: "Fotoğraf Ekle", attachPhotoDesc: "Ders kitabından ödev fotoğrafı", photoAttached: "Fotoğraf eklendi", removePhoto: "Kaldır", maxFileSize: "Maks. 5 MB, JPG/PNG", generate: "Oluştur", generating: "Oluşturuluyor...", generatingDesc: "AI ödeviniz üzerinde çalışıyor. Genellikle 10-30 saniye sürer", done: "Tamamlandı!", docGenerated: "Belgeniz oluşturuldu", copy: "Kopyala", newOne: "Yeni", error: "Hata", tryAgain: "Tekrar Dene", noBalance: "Bakiyede yeterli rapor yok", topUpBalance: "Bakiye yükle", connectionError: "Bağlantı hatası. Tekrar deneyin.", back: "Geri", reportsGenerated: "belge oluşturuldu", docsHere: "Belgeleriniz burada görünecek", noReportsYet: "Henüz rapor yok.", createFirst: "İlkini oluşturun!", copyText: "Metni kopyala", contentUnavailable: "İçerik mevcut değil", manageReports: "Raporlarınızı yönetin", availableReports: "Mevcut raporlar", total: "Toplam", freeReport: "+1 ücretsiz", crypto: "Kripto", cryptoDesc: "USDT / USDC (TRC-20)", telegramStars: "Telegram Stars", payViaTelegram: "Telegram ile öde", important: "Önemli!", iPaid: "Ödedim", cryptoAddress: "Adres (TRC-20):", cryptoNote: "Transferden sonra işlem hash'ini destek sohbetine gönderin", starsNote: "Telegram Stars ile ödemek için bota komut gönderin:", starsCmd: "veya bot menüsünde 'Satın Al' düğmesine basın", payInBot: "Botta öde", thankYou: "Teşekkürler!", paymentPending: "Ödemeyi 24 saat içinde doğrulayacağız!", goBack: "Geri dön", reports15: "15 rapor", loadError: "Yüklenemedi. Tekrar deneyin.", profileTitle: "Profil", language: "Dil", chooseLanguage: "Dil seçin", userId: "Kullanıcı ID", joined: "Katılım", visaMastercard: "Visa / Mastercard", cardPayment: "Kart ile ödeme", cardNumber: "Kart numarası:", cardNote: "Ödeme açıklamasına ID numaranızı yazın:", receiptNote: "Ödemeden sonra makbuz ekran görüntüsünü @studyflush_bot'a gönderin", payAmount: "Öde", choosePayment: "Ödeme yöntemi seçin", popular: "Popüler", allSubjects: "Tüm dersler", referralSystem: "Referans Sistemi", inviteFriends: "Arkadaş Davet Et", referralDesc: "Arkadaşlarınızı davet edin ve ücretsiz raporlar kazanın! İkiniz de +2 rapor alırsınız.", referralCode: "Referans kodunuz", copyLink: "Bağlantıyı kopyala", linkCopied: "Kopyalandı!", invited: "Davet edilen", bonusEarned: "Bonus kazanıldı", referralBonus: "Her davet için +2 rapor", level: "Seviye", nextLevel: "Sonraki seviye", achievements: "Başarılar", firstReportAch: "İlk Adım", tenReportsAch: "Uzman", fiftyReportsAch: "Usta", referralAch: "Ağ Kurucu", accountInfo: "Hesap", memberSince: "Üyelik tarihi", proTip: "İpucu", proTipText: "5 arkadaşınızı davet edin ve 10 ücretsiz rapor kazanın!", reportReport: "Rapor", reportSummary: "Özet", reportDatabase: "Veritabanı", reportLab: "Laboratuvar", reportEssay: "Makale", reportTasks: "Ödevler", reportCourseWork: "Dönem Ödevi", reportDiploma: "Diploma", reportPresentation: "Sunum", reportTest: "Sınav", reportNotes: "Ders Notları", reportReportDesc: "Konu hakkında resmi rapor", reportSummaryDesc: "Konunun kısa özeti", reportDatabaseDesc: "SQL tabloları ve sorguları", reportLabDesc: "Tam laboratuvar çalışması", reportEssayDesc: "Detaylı makale", reportTasksDesc: "Problem çözme", reportCourseWorkDesc: "Bölümlü tam dönem ödevi", reportDiplomaDesc: "Diploma projesi yapısı", reportPresentationDesc: "Slayt bazlı sunum planı", reportTestDesc: "Sınav / test cevapları", reportNotesDesc: "Ders notları ve özetler", eduSchool: "Okul", eduCollege: "Koleji", eduUni: "Üniversite", eduAll: "Tümü", transferDescription: "Aşağıdaki karta transfer yapın ve onaylayın", paymentAmount: "Tutar", walletAddress: "Cüzdan adresi", cryptoPayment: "Kripto USDT", starsDesc: "Telegram Stars ile öde", starsInstructions: "Stars'ı @studyflush_bot'a gönderin ve onaylayın.", supportContact: "Destek", choosePaymentMethod: "Ödeme yöntemleri", currentBalance: "Mevcut bakiye", paymentSent: "Ödedim", paymentNote: "Admin doğruladıktan sonra bakiye yüklenir. Genellikle 1-24 saat.", noHistory: "Rapor yok", noHistoryDesc: "Burada görmek için ilk raporunuzu oluşturun", progress: "İlerleme", lengthShort: "Kısa", lengthMedium: "Orta", lengthFull: "Tam", lengthShortDesc: "~500 kelime", lengthMediumDesc: "~1500 kelime", lengthFullDesc: "~3000 kelime", reportLength: "Rapor uzunluğu", estimatedTime: "Tahmini süre", estimatedWords: "kelime", seconds: "sn", repeatReport: "Tekrarla", shareReport: "Paylaş", shareText: "StudyFlush Bot ile oluşturuldu", recentSubjects: "Son", continueWith: "Devam et", shareWithFriend: "Arkadaşınla paylaş", referralStep1: "Bağlantıyı arkadaşınıza gönderin", referralStep2: "Arkadaş ilk raporunu oluşturur", referralStep3: "İkiniz de +2 rapor alırsınız!", yourReward: "Siz alırsınız", friendReward: "Arkadaş alır", howItWorks: "Nasıl çalışır", sendInvite: "Telegram ile davet gönder", friendsJoined: "arkadaş katıldı", earnedReports: "rapor kazanıldı", cardPaymentDesc: "250 UAH kartaya transfer edin ve ekran görüntüsü gönderin", cryptoPaymentDesc: "TRC-20 ağı üzerinden 5 USDT gönderin", starsPaymentDesc: "Telegram ile anında ödeme", sendScreenshot: "Ödemeden sonra ekran görüntüsünü @studyflush_bot'a gönderin", sendScreenshotCrypto: "Transferden sonra ekran görüntüsünü @studyflush_bot'a gönderin", paymentVerification: "Admin tarafından manuel doğrulama", payStep1Card: "250 UAH kartaya transfer edin", payStep2Card: "Ödeme ekran görüntüsünü yükleyin", payStep3Card: "Admin doğrular ve 15 rapor verilir", payStep1Crypto: "5 USDT (TRC-20) adrese gönderin", payStep2Crypto: "İşlem ekran görüntüsünü yükleyin", payStep3Crypto: "Admin doğrular ve 15 rapor verilir", adminWillCheck: "Admin ödemeyi manuel olarak doğrulayacak", uahOnly: "Sadece Ukrayna", uploadScreenshot: "Ekran Görüntüsü Yükle", uploadScreenshotDesc: "Ödeme ekran görüntüsünü ekleyin", screenshotUploaded: "Ekran görüntüsü eklendi ✓", changeScreenshot: "Değiştir", screenshotRequired: "Lütfen ödeme ekran görüntüsü ekleyin", submitting: "Gönderiliyor...", paymentSubmitted: "İstek gönderildi!", paymentSubmittedDesc: "Admin ödemeyi doğrulayıp 1-24 saat içinde bakiyenizi yükleyecek.", adminReviewing: "İncelemede", searchReports: "Raporlarda ara...", settings: "Ayarlar", support: "Destek", shareApp: "Paylaş", shareAppDesc: "Arkadaşlarına StudyFlush'ı anlat", rateBot: "Botu Değerlendir", rateBotDesc: "Telegram'da yorum bırakın", about: "Hakkında", version: "Sürüm", speedAch: "Hız Rekortmeni", hundredReportsAch: "Efsane", genTip1: "AI konuyu analiz ediyor...", genTip2: "Belge yapısı oluşturuluyor...", genTip3: "İçerik bölümleri üretiliyor...", genTip4: "Kaynaklar ekleniyor...", genTip5: "Biçimlendirme ve cilalama...", genTip6: "Neredeyse hazır!", supportTitle: "Destek", supportDesc: "Sorununuzu açıklayın, yardımcı olalım", supportFormTitle: "Bize Yazın", supportFormDesc: "Mesajınız admine gönderilecek", supportCategory: "Kategori", supportCatPayment: "Ödeme", supportCatGeneration: "Üretim", supportCatBug: "Hata", supportCatFeature: "Fikir", supportCatOther: "Diğer", supportMessageLabel: "Mesajınız", supportMessagePlaceholder: "Sorununuzu veya sorunuzu detaylı açıklayın...", supportSend: "Gönder", supportSent: "Mesaj Gönderildi!", supportSentDesc: "İsteğiniz alındı. Admin 24 saat içinde yanıt verecek.", supportInfo: "Destek nasıl çalışır", supportResponseTime: "Yanıt süresi: genellikle 1-24 saat", supportBotNote: "Ayrıca @studyflush_bot'a doğrudan yazabilirsiniz", supportViaTelegram: "Botu Telegram'da Aç",
  },
  de: {
    appName: "StudyFlush", welcome: "Hallo", subtitle: "Dein intelligenter Lernassistent", yourBalance: "Dein Guthaben", reportsAvailable: "verfügbar", report1: "Bericht", reports2_4: "Berichte", reports5: "Berichte", firstReportFree: "Erster Bericht kostenlos!", newReport: "Neuer Bericht", generateAI: "Mit KI erstellen", history: "Verlauf", myReports: "Meine Berichte", topUp: "Aufladen", buyReports: "Berichte kaufen", stats: "Statistiken", quickStart: "Schnellstart", quickStartDesc: "Wähle Dokumenttyp, Fach und Thema — KI erledigt alles in 10-30 Sekunden!", createReport: "Bericht erstellen", home: "Start", create: "Erstellen", letsGo: "Los geht's", balance: "Guthaben", profile: "Profil", newDocument: "Neues Dokument", chooseDocType: "Dokumenttyp wählen", subject: "Fach", chooseSubject: "Fach wählen", chooseCategory: "Kategorie wählen", details: "Details", describeTask: "Beschreibe, was du brauchst", topicLabel: "Thema / Aufgabe *", topicPlaceholder: "z.B.: Laborarbeit Python — Bubblesort-Algorithmus", groupLabel: "Gruppe / Klasse", groupPlaceholder: "z.B.: IT-21, 11-A (optional)", attachPhoto: "Foto anhängen", attachPhotoDesc: "Foto der Aufgabe aus dem Lehrbuch", photoAttached: "Foto angehängt", removePhoto: "Entfernen", maxFileSize: "Max. 5 MB, JPG/PNG", generate: "Erstellen", generating: "Wird erstellt...", generatingDesc: "KI arbeitet an deiner Aufgabe. Dauert normalerweise 10-30 Sekunden", done: "Fertig!", docGenerated: "Dein Dokument wurde erstellt", copy: "Kopieren", newOne: "Neu", error: "Fehler", tryAgain: "Erneut versuchen", noBalance: "Nicht genug Berichte im Guthaben", topUpBalance: "Guthaben aufladen", connectionError: "Verbindungsfehler. Versuche es erneut.", back: "Zurück", reportsGenerated: "Dokumente erstellt", docsHere: "Deine Dokumente erscheinen hier", noReportsYet: "Noch keine Berichte.", createFirst: "Erstelle deinen ersten!", copyText: "Text kopieren", contentUnavailable: "Inhalt nicht verfügbar", manageReports: "Verwalte deine Berichte", availableReports: "Verfügbare Berichte", total: "Gesamt", freeReport: "+1 kostenlos", crypto: "Krypto", cryptoDesc: "USDT / USDC (TRC-20)", telegramStars: "Telegram Stars", payViaTelegram: "Über Telegram bezahlen", important: "Wichtig!", iPaid: "Ich habe bezahlt", cryptoAddress: "Adresse (TRC-20):", cryptoNote: "Nach der Überweisung sende den Transaktionshash an den Support-Chat", starsNote: "Um mit Telegram Stars zu bezahlen, sende dem Bot den Befehl:", starsCmd: "oder klicke 'Kaufen' im Bot-Menü", payInBot: "Im Bot bezahlen", thankYou: "Danke!", paymentPending: "Wir prüfen die Zahlung innerhalb von 24 Stunden!", goBack: "Zurück", reports15: "15 Berichte", loadError: "Laden fehlgeschlagen. Versuche es erneut.", profileTitle: "Profil", language: "Sprache", chooseLanguage: "Sprache wählen", userId: "Benutzer-ID", joined: "Beigetreten", visaMastercard: "Visa / Mastercard", cardPayment: "Kartenzahlung", cardNumber: "Kartennummer:", cardNote: "Gib in der Zahlungsbeschreibung deine ID an:", receiptNote: "Sende nach der Zahlung einen Screenshot der Quittung an @studyflush_bot", payAmount: "Bezahlen", choosePayment: "Zahlungsmethode wählen", popular: "Beliebt", allSubjects: "Alle Fächer", referralSystem: "Empfehlungssystem", inviteFriends: "Freunde einladen", referralDesc: "Lade Freunde ein und erhalte kostenlose Berichte! Ihr beide bekommt +2 Berichte.", referralCode: "Dein Empfehlungscode", copyLink: "Link kopieren", linkCopied: "Kopiert!", invited: "Eingeladen", bonusEarned: "Bonus erhalten", referralBonus: "+2 Berichte pro Einladung", level: "Level", nextLevel: "Nächstes Level", achievements: "Erfolge", firstReportAch: "Erster Schritt", tenReportsAch: "Experte", fiftyReportsAch: "Meister", referralAch: "Netzwerker", accountInfo: "Konto", memberSince: "Mitglied seit", proTip: "Profi-Tipp", proTipText: "Lade 5 Freunde ein und erhalte 10 kostenlose Berichte!", reportReport: "Bericht", reportSummary: "Zusammenfassung", reportDatabase: "Datenbank", reportLab: "Laborarbeit", reportEssay: "Aufsatz", reportTasks: "Aufgaben", reportCourseWork: "Kursarbeit", reportDiploma: "Diplomarbeit", reportPresentation: "Präsentation", reportTest: "Klausur", reportNotes: "Vorlesungsnotizen", reportReportDesc: "Offizieller Bericht zu einem Thema", reportSummaryDesc: "Kurze Zusammenfassung eines Themas", reportDatabaseDesc: "SQL-Tabellen und Abfragen", reportLabDesc: "Vollständige Laborarbeit", reportEssayDesc: "Ausführlicher Aufsatz", reportTasksDesc: "Problemlösung", reportCourseWorkDesc: "Vollständige Kursarbeit mit Abschnitten", reportDiplomaDesc: "Struktur der Diplomarbeit", reportPresentationDesc: "Folienpräsentationsplan", reportTestDesc: "Klausur / Prüfungsantworten", reportNotesDesc: "Vorlesungsnotizen und Zusammenfassungen", eduSchool: "Schule", eduCollege: "Fachhochschule", eduUni: "Universität", eduAll: "Alle", transferDescription: "Überweise auf die Karte unten und bestätige", paymentAmount: "Betrag", walletAddress: "Wallet-Adresse", cryptoPayment: "Krypto USDT", starsDesc: "Über Telegram Stars bezahlen", starsInstructions: "Sende Stars an @studyflush_bot und bestätige.", supportContact: "Support", choosePaymentMethod: "Zahlungsmethoden", currentBalance: "Aktuelles Guthaben", paymentSent: "Ich habe bezahlt", paymentNote: "Nach Überprüfung durch den Admin wird das Guthaben gutgeschrieben. Normalerweise 1-24 Stunden.", noHistory: "Keine Berichte", noHistoryDesc: "Erstelle deinen ersten Bericht, um ihn hier zu sehen", progress: "Fortschritt", lengthShort: "Kurz", lengthMedium: "Mittel", lengthFull: "Vollständig", lengthShortDesc: "~500 Wörter", lengthMediumDesc: "~1500 Wörter", lengthFullDesc: "~3000 Wörter", reportLength: "Berichtslänge", estimatedTime: "Geschätzte Zeit", estimatedWords: "Wörter", seconds: "Sek", repeatReport: "Wiederholen", shareReport: "Teilen", shareText: "Erstellt mit StudyFlush Bot", recentSubjects: "Kürzlich", continueWith: "Fortfahren", shareWithFriend: "Mit Freund teilen", referralStep1: "Sende deinen Link an einen Freund", referralStep2: "Freund erstellt seinen ersten Bericht", referralStep3: "Ihr beide bekommt +2 Berichte!", yourReward: "Du bekommst", friendReward: "Freund bekommt", howItWorks: "So funktioniert's", sendInvite: "Einladung über Telegram senden", friendsJoined: "Freunde beigetreten", earnedReports: "Berichte verdient", cardPaymentDesc: "Überweise 250 UAH auf die Karte und sende einen Screenshot", cryptoPaymentDesc: "Sende 5 USDT über das TRC-20 Netzwerk", starsPaymentDesc: "Sofortzahlung über Telegram", sendScreenshot: "Sende nach der Zahlung einen Screenshot an @studyflush_bot", sendScreenshotCrypto: "Sende nach der Überweisung einen Screenshot an @studyflush_bot", paymentVerification: "Manuelle Überprüfung durch Admin", payStep1Card: "Überweise 250 UAH auf die Karte", payStep2Card: "Zahlungsscreenshot hochladen", payStep3Card: "Admin prüft und schreibt 15 Berichte gut", payStep1Crypto: "Sende 5 USDT (TRC-20) an die Adresse", payStep2Crypto: "Transaktionsscreenshot hochladen", payStep3Crypto: "Admin prüft und schreibt 15 Berichte gut", adminWillCheck: "Admin überprüft die Zahlung manuell", uahOnly: "Nur Ukraine", uploadScreenshot: "Screenshot hochladen", uploadScreenshotDesc: "Hänge einen Screenshot deiner Zahlung an", screenshotUploaded: "Screenshot angehängt ✓", changeScreenshot: "Ändern", screenshotRequired: "Bitte hänge einen Zahlungsscreenshot an", submitting: "Wird gesendet...", paymentSubmitted: "Anfrage gesendet!", paymentSubmittedDesc: "Admin wird die Zahlung prüfen und das Guthaben innerhalb von 1-24 Stunden gutschreiben.", adminReviewing: "In Prüfung", searchReports: "Berichte suchen...", settings: "Einstellungen", support: "Support", shareApp: "App teilen", shareAppDesc: "Erzähle Freunden von StudyFlush", rateBot: "Bot bewerten", rateBotDesc: "Bewertung auf Telegram hinterlassen", about: "Über", version: "Version", speedAch: "Schnellläufer", hundredReportsAch: "Legende", genTip1: "KI analysiert dein Thema...", genTip2: "Dokumentstruktur wird erstellt...", genTip3: "Inhaltsabschnitte werden generiert...", genTip4: "Quellen werden hinzugefügt...", genTip5: "Formatierung und Feinschliff...", genTip6: "Fast fertig!", supportTitle: "Support", supportDesc: "Beschreibe dein Problem und wir helfen", supportFormTitle: "Kontakt", supportFormDesc: "Deine Nachricht wird an den Admin gesendet", supportCategory: "Kategorie", supportCatPayment: "Zahlung", supportCatGeneration: "Generierung", supportCatBug: "Fehler", supportCatFeature: "Idee", supportCatOther: "Sonstiges", supportMessageLabel: "Deine Nachricht", supportMessagePlaceholder: "Beschreibe dein Problem oder deine Frage im Detail...", supportSend: "Nachricht senden", supportSent: "Nachricht gesendet!", supportSentDesc: "Wir haben deine Anfrage erhalten. Der Admin antwortet innerhalb von 24 Stunden.", supportInfo: "So funktioniert der Support", supportResponseTime: "Antwortzeit: normalerweise 1-24 Stunden", supportBotNote: "Du kannst auch direkt @studyflush_bot schreiben", supportViaTelegram: "Bot in Telegram öffnen",
  },
  fr: {
    appName: "StudyFlush", welcome: "Bonjour", subtitle: "Ton assistant d'études intelligent", yourBalance: "Ton solde", reportsAvailable: "disponibles", report1: "rapport", reports2_4: "rapports", reports5: "rapports", firstReportFree: "Premier rapport gratuit !", newReport: "Nouveau rapport", generateAI: "Générer avec l'IA", history: "Historique", myReports: "Mes rapports", topUp: "Recharger", buyReports: "Acheter des rapports", stats: "Statistiques", quickStart: "Démarrage rapide", quickStartDesc: "Choisis le type de document, la matière et le sujet — l'IA fait tout en 10-30 secondes !", createReport: "Créer un rapport", home: "Accueil", create: "Créer", letsGo: "C'est parti", balance: "Solde", profile: "Profil", newDocument: "Nouveau document", chooseDocType: "Choisis le type de document", subject: "Matière", chooseSubject: "Choisis la matière", chooseCategory: "Choisis la catégorie", details: "Détails", describeTask: "Décris ce dont tu as besoin", topicLabel: "Sujet / Devoir *", topicPlaceholder: "Ex : TP Python — algorithme de tri à bulles", groupLabel: "Groupe / Classe", groupPlaceholder: "Ex : IT-21, 11-A (optionnel)", attachPhoto: "Joindre une photo", attachPhotoDesc: "Photo du devoir du manuel", photoAttached: "Photo jointe", removePhoto: "Supprimer", maxFileSize: "Max. 5 Mo, JPG/PNG", generate: "Générer", generating: "Génération...", generatingDesc: "L'IA travaille sur ton devoir. Prend généralement 10-30 secondes", done: "Terminé !", docGenerated: "Ton document est généré", copy: "Copier", newOne: "Nouveau", error: "Erreur", tryAgain: "Réessayer", noBalance: "Pas assez de rapports sur le solde", topUpBalance: "Recharger le solde", connectionError: "Erreur de connexion. Réessaie.", back: "Retour", reportsGenerated: "documents générés", docsHere: "Tes documents apparaîtront ici", noReportsYet: "Pas encore de rapports.", createFirst: "Crée ton premier !", copyText: "Copier le texte", contentUnavailable: "Contenu indisponible", manageReports: "Gère tes rapports", availableReports: "Rapports disponibles", total: "Total", freeReport: "+1 gratuit", crypto: "Crypto", cryptoDesc: "USDT / USDC (TRC-20)", telegramStars: "Telegram Stars", payViaTelegram: "Payer via Telegram", important: "Important !", iPaid: "J'ai payé", cryptoAddress: "Adresse (TRC-20) :", cryptoNote: "Après le transfert, envoie le hash de transaction au chat support", starsNote: "Pour payer avec Telegram Stars, envoie la commande au bot :", starsCmd: "ou clique 'Acheter' dans le menu du bot", payInBot: "Payer dans le bot", thankYou: "Merci !", paymentPending: "Nous vérifierons le paiement sous 24h !", goBack: "Retour", reports15: "15 rapports", loadError: "Échec du chargement. Réessaie.", profileTitle: "Profil", language: "Langue", chooseLanguage: "Choisis la langue", userId: "ID utilisateur", joined: "Inscrit", visaMastercard: "Visa / Mastercard", cardPayment: "Paiement par carte", cardNumber: "Numéro de carte :", cardNote: "Indique ton ID dans le commentaire du paiement :", receiptNote: "Après le paiement, envoie une capture d'écran du reçu à @studyflush_bot", payAmount: "Payer", choosePayment: "Choisis le mode de paiement", popular: "Populaire", allSubjects: "Toutes les matières", referralSystem: "Système de parrainage", inviteFriends: "Inviter des amis", referralDesc: "Invite des amis et obtiens des rapports gratuits ! Vous recevez tous les deux +2 rapports.", referralCode: "Ton code de parrainage", copyLink: "Copier le lien", linkCopied: "Copié !", invited: "Invité", bonusEarned: "Bonus obtenu", referralBonus: "+2 rapports par invitation", level: "Niveau", nextLevel: "Niveau suivant", achievements: "Réalisations", firstReportAch: "Premier pas", tenReportsAch: "Expert", fiftyReportsAch: "Maître", referralAch: "Réseau", accountInfo: "Compte", memberSince: "Membre depuis", proTip: "Astuce pro", proTipText: "Invite 5 amis pour débloquer 10 rapports gratuits !", reportReport: "Rapport", reportSummary: "Résumé", reportDatabase: "Base de données", reportLab: "TP", reportEssay: "Dissertation", reportTasks: "Exercices", reportCourseWork: "Travail de cours", reportDiploma: "Mémoire", reportPresentation: "Présentation", reportTest: "Examen", reportNotes: "Notes de cours", reportReportDesc: "Rapport officiel sur un sujet", reportSummaryDesc: "Résumé bref d'un sujet", reportDatabaseDesc: "Tables et requêtes SQL", reportLabDesc: "TP complet", reportEssayDesc: "Dissertation détaillée", reportTasksDesc: "Résolution de problèmes", reportCourseWorkDesc: "Travail de cours complet", reportDiplomaDesc: "Structure du mémoire", reportPresentationDesc: "Plan de présentation diapositive par diapositive", reportTestDesc: "Réponses d'examen", reportNotesDesc: "Notes de cours et résumés", eduSchool: "École", eduCollege: "Lycée", eduUni: "Université", eduAll: "Tous", transferDescription: "Transfère sur la carte ci-dessous et confirme", paymentAmount: "Montant", walletAddress: "Adresse du portefeuille", cryptoPayment: "Crypto USDT", starsDesc: "Payer via Telegram Stars", starsInstructions: "Envoie les Stars à @studyflush_bot et confirme.", supportContact: "Support", choosePaymentMethod: "Modes de paiement", currentBalance: "Solde actuel", paymentSent: "J'ai payé", paymentNote: "Après vérification par l'admin, le solde sera crédité. Généralement 1-24h.", noHistory: "Pas de rapports", noHistoryDesc: "Crée ton premier rapport pour le voir ici", progress: "Progrès", lengthShort: "Court", lengthMedium: "Moyen", lengthFull: "Complet", lengthShortDesc: "~500 mots", lengthMediumDesc: "~1500 mots", lengthFullDesc: "~3000 mots", reportLength: "Longueur du rapport", estimatedTime: "Temps estimé", estimatedWords: "mots", seconds: "sec", repeatReport: "Répéter", shareReport: "Partager", shareText: "Généré avec StudyFlush Bot", recentSubjects: "Récents", continueWith: "Continuer", shareWithFriend: "Partage avec un ami", referralStep1: "Envoie ton lien à un ami", referralStep2: "L'ami crée son premier rapport", referralStep3: "Vous recevez tous les deux +2 rapports !", yourReward: "Tu reçois", friendReward: "L'ami reçoit", howItWorks: "Comment ça marche", sendInvite: "Envoyer une invitation via Telegram", friendsJoined: "amis ont rejoint", earnedReports: "rapports gagnés", cardPaymentDesc: "Transfère 250 UAH sur la carte et envoie une capture d'écran", cryptoPaymentDesc: "Envoie 5 USDT via le réseau TRC-20", starsPaymentDesc: "Paiement instantané via Telegram", sendScreenshot: "Après le paiement, envoie une capture d'écran à @studyflush_bot", sendScreenshotCrypto: "Après le transfert, envoie une capture d'écran à @studyflush_bot", paymentVerification: "Vérification manuelle par l'admin", payStep1Card: "Transfère 250 UAH sur la carte", payStep2Card: "Télécharge la capture d'écran du paiement", payStep3Card: "L'admin vérifie et crédite 15 rapports", payStep1Crypto: "Envoie 5 USDT (TRC-20) à l'adresse", payStep2Crypto: "Télécharge la capture d'écran de la transaction", payStep3Crypto: "L'admin vérifie et crédite 15 rapports", adminWillCheck: "L'admin vérifiera ton paiement manuellement", uahOnly: "Ukraine uniquement", uploadScreenshot: "Télécharger une capture d'écran", uploadScreenshotDesc: "Joins une capture d'écran de ton paiement", screenshotUploaded: "Capture d'écran jointe ✓", changeScreenshot: "Modifier", screenshotRequired: "Joins une capture d'écran de paiement", submitting: "Envoi en cours...", paymentSubmitted: "Demande envoyée !", paymentSubmittedDesc: "L'admin vérifiera ton paiement et créditera le solde sous 1-24h.", adminReviewing: "En cours de vérification", searchReports: "Rechercher des rapports...", settings: "Paramètres", support: "Support", shareApp: "Partager l'appli", shareAppDesc: "Parle de StudyFlush à tes amis", rateBot: "Noter le bot", rateBotDesc: "Laisse un avis sur Telegram", about: "À propos", version: "Version", speedAch: "Sprinter", hundredReportsAch: "Légende", genTip1: "L'IA analyse ton sujet...", genTip2: "Construction de la structure du document...", genTip3: "Génération des sections de contenu...", genTip4: "Ajout des références et sources...", genTip5: "Mise en forme et finition...", genTip6: "Presque prêt !", supportTitle: "Support", supportDesc: "Décris ton problème et nous t'aiderons", supportFormTitle: "Nous contacter", supportFormDesc: "Ton message sera envoyé à l'admin", supportCategory: "Catégorie", supportCatPayment: "Paiement", supportCatGeneration: "Génération", supportCatBug: "Bug", supportCatFeature: "Idée", supportCatOther: "Autre", supportMessageLabel: "Ton message", supportMessagePlaceholder: "Décris ton problème ou ta question en détail...", supportSend: "Envoyer", supportSent: "Message envoyé !", supportSentDesc: "Nous avons reçu ta demande. L'admin répondra sous 24h via le bot Telegram.", supportInfo: "Comment fonctionne le support", supportResponseTime: "Temps de réponse : généralement 1-24h", supportBotNote: "Tu peux aussi écrire directement à @studyflush_bot", supportViaTelegram: "Ouvrir le bot dans Telegram",
  },
  es: {
    appName: "StudyFlush", welcome: "Hola", subtitle: "Tu asistente de estudio inteligente", yourBalance: "Tu saldo", reportsAvailable: "disponibles", report1: "informe", reports2_4: "informes", reports5: "informes", firstReportFree: "¡Primer informe gratis!", newReport: "Nuevo informe", generateAI: "Generar con IA", history: "Historial", myReports: "Mis informes", topUp: "Recargar", buyReports: "Comprar informes", stats: "Estadísticas", quickStart: "Inicio rápido", quickStartDesc: "Elige tipo de documento, asignatura y tema — ¡la IA lo hace todo en 10-30 segundos!", createReport: "Crear informe", home: "Inicio", create: "Crear", letsGo: "¡Vamos!", balance: "Saldo", profile: "Perfil", newDocument: "Nuevo documento", chooseDocType: "Elige tipo de documento", subject: "Asignatura", chooseSubject: "Elige asignatura", chooseCategory: "Elige categoría", details: "Detalles", describeTask: "Describe lo que necesitas", topicLabel: "Tema / Tarea *", topicPlaceholder: "Ej.: Laboratorio de Python — algoritmo burbuja", groupLabel: "Grupo / Clase", groupPlaceholder: "Ej.: IT-21, 11-A (opcional)", attachPhoto: "Adjuntar foto", attachPhotoDesc: "Foto de la tarea del libro", photoAttached: "Foto adjuntada", removePhoto: "Eliminar", maxFileSize: "Máx. 5 MB, JPG/PNG", generate: "Generar", generating: "Generando...", generatingDesc: "La IA está trabajando en tu tarea. Normalmente tarda 10-30 segundos", done: "¡Listo!", docGenerated: "Tu documento ha sido generado", copy: "Copiar", newOne: "Nuevo", error: "Error", tryAgain: "Intentar de nuevo", noBalance: "No hay suficientes informes en el saldo", topUpBalance: "Recargar saldo", connectionError: "Error de conexión. Inténtalo de nuevo.", back: "Atrás", reportsGenerated: "documentos generados", docsHere: "Tus documentos aparecerán aquí", noReportsYet: "Aún no hay informes.", createFirst: "¡Crea el primero!", copyText: "Copiar texto", contentUnavailable: "Contenido no disponible", manageReports: "Gestiona tus informes", availableReports: "Informes disponibles", total: "Total", freeReport: "+1 gratis", crypto: "Cripto", cryptoDesc: "USDT / USDC (TRC-20)", telegramStars: "Telegram Stars", payViaTelegram: "Pagar con Telegram", important: "¡Importante!", iPaid: "Ya pagué", cryptoAddress: "Dirección (TRC-20):", cryptoNote: "Después de la transferencia, envía el hash al chat de soporte", starsNote: "Para pagar con Telegram Stars, envía el comando al bot:", starsCmd: "o haz clic en 'Comprar' en el menú del bot", payInBot: "Pagar en el bot", thankYou: "¡Gracias!", paymentPending: "¡Verificaremos el pago en 24 horas!", goBack: "Volver", reports15: "15 informes", loadError: "Error al cargar. Inténtalo de nuevo.", profileTitle: "Perfil", language: "Idioma", chooseLanguage: "Elige idioma", userId: "ID de usuario", joined: "Registrado", visaMastercard: "Visa / Mastercard", cardPayment: "Pago con tarjeta", cardNumber: "Número de tarjeta:", cardNote: "Indica tu ID en el comentario del pago:", receiptNote: "Después del pago, envía captura del recibo a @studyflush_bot", payAmount: "Pagar", choosePayment: "Elige método de pago", popular: "Popular", allSubjects: "Todas las asignaturas", referralSystem: "Sistema de referidos", inviteFriends: "Invitar amigos", referralDesc: "¡Invita amigos y obtén informes gratis! Ambos reciben +2 informes.", referralCode: "Tu código de referido", copyLink: "Copiar enlace", linkCopied: "¡Copiado!", invited: "Invitados", bonusEarned: "Bonus obtenido", referralBonus: "+2 informes por cada invitación", level: "Nivel", nextLevel: "Siguiente nivel", achievements: "Logros", firstReportAch: "Primer paso", tenReportsAch: "Experto", fiftyReportsAch: "Maestro", referralAch: "Networker", accountInfo: "Cuenta", memberSince: "Miembro desde", proTip: "Consejo pro", proTipText: "¡Invita a 5 amigos para desbloquear 10 informes gratis!", reportReport: "Informe", reportSummary: "Resumen", reportDatabase: "Base de datos", reportLab: "Laboratorio", reportEssay: "Ensayo", reportTasks: "Ejercicios", reportCourseWork: "Trabajo de curso", reportDiploma: "Tesis", reportPresentation: "Presentación", reportTest: "Examen", reportNotes: "Apuntes", reportReportDesc: "Informe oficial sobre un tema", reportSummaryDesc: "Resumen breve de un tema", reportDatabaseDesc: "Tablas y consultas SQL", reportLabDesc: "Laboratorio completo", reportEssayDesc: "Ensayo detallado", reportTasksDesc: "Resolución de problemas", reportCourseWorkDesc: "Trabajo de curso completo", reportDiplomaDesc: "Estructura de tesis", reportPresentationDesc: "Plan de presentación por diapositivas", reportTestDesc: "Respuestas de examen", reportNotesDesc: "Apuntes de clase y resúmenes", eduSchool: "Colegio", eduCollege: "Instituto", eduUni: "Universidad", eduAll: "Todos", transferDescription: "Transfiere a la tarjeta y confirma", paymentAmount: "Monto", walletAddress: "Dirección del monedero", cryptoPayment: "Cripto USDT", starsDesc: "Pagar con Telegram Stars", starsInstructions: "Envía Stars a @studyflush_bot y confirma.", supportContact: "Soporte", choosePaymentMethod: "Métodos de pago", currentBalance: "Saldo actual", paymentSent: "Ya pagué", paymentNote: "Después de la verificación del admin, el saldo será acreditado. Normalmente 1-24 horas.", noHistory: "Sin informes", noHistoryDesc: "Crea tu primer informe para verlo aquí", progress: "Progreso", lengthShort: "Corto", lengthMedium: "Medio", lengthFull: "Completo", lengthShortDesc: "~500 palabras", lengthMediumDesc: "~1500 palabras", lengthFullDesc: "~3000 palabras", reportLength: "Longitud del informe", estimatedTime: "Tiempo est.", estimatedWords: "palabras", seconds: "seg", repeatReport: "Repetir", shareReport: "Compartir", shareText: "Generado con StudyFlush Bot", recentSubjects: "Recientes", continueWith: "Continuar", shareWithFriend: "Comparte con un amigo", referralStep1: "Envía tu enlace a un amigo", referralStep2: "El amigo crea su primer informe", referralStep3: "¡Ambos reciben +2 informes!", yourReward: "Tú recibes", friendReward: "El amigo recibe", howItWorks: "Cómo funciona", sendInvite: "Enviar invitación por Telegram", friendsJoined: "amigos se unieron", earnedReports: "informes ganados", cardPaymentDesc: "Transfiere 250 UAH a la tarjeta y envía captura", cryptoPaymentDesc: "Envía 5 USDT por red TRC-20", starsPaymentDesc: "Pago instantáneo por Telegram", sendScreenshot: "Después del pago, envía captura a @studyflush_bot", sendScreenshotCrypto: "Después de la transferencia, envía captura a @studyflush_bot", paymentVerification: "Verificación manual por admin", payStep1Card: "Transfiere 250 UAH a la tarjeta", payStep2Card: "Sube la captura del pago", payStep3Card: "El admin verifica y acredita 15 informes", payStep1Crypto: "Envía 5 USDT (TRC-20) a la dirección", payStep2Crypto: "Sube la captura de la transacción", payStep3Crypto: "El admin verifica y acredita 15 informes", adminWillCheck: "El admin verificará tu pago manualmente", uahOnly: "Solo Ucrania", uploadScreenshot: "Subir captura", uploadScreenshotDesc: "Adjunta una captura de tu pago", screenshotUploaded: "Captura adjuntada ✓", changeScreenshot: "Cambiar", screenshotRequired: "Por favor adjunta una captura de pago", submitting: "Enviando...", paymentSubmitted: "¡Solicitud enviada!", paymentSubmittedDesc: "El admin verificará tu pago y acreditará el saldo en 1-24 horas.", adminReviewing: "En revisión", searchReports: "Buscar informes...", settings: "Ajustes", support: "Soporte", shareApp: "Compartir app", shareAppDesc: "Cuéntale a tus amigos sobre StudyFlush", rateBot: "Valorar bot", rateBotDesc: "Deja una reseña en Telegram", about: "Acerca de", version: "Versión", speedAch: "Veloz", hundredReportsAch: "Leyenda", genTip1: "La IA está analizando tu tema...", genTip2: "Construyendo la estructura del documento...", genTip3: "Generando secciones de contenido...", genTip4: "Añadiendo referencias y fuentes...", genTip5: "Dando formato y puliendo...", genTip6: "¡Casi listo!", supportTitle: "Soporte", supportDesc: "Describe tu problema y te ayudaremos", supportFormTitle: "Contáctanos", supportFormDesc: "Tu mensaje será enviado al admin", supportCategory: "Categoría", supportCatPayment: "Pago", supportCatGeneration: "Generación", supportCatBug: "Error", supportCatFeature: "Idea", supportCatOther: "Otro", supportMessageLabel: "Tu mensaje", supportMessagePlaceholder: "Describe tu problema o pregunta en detalle...", supportSend: "Enviar", supportSent: "¡Mensaje enviado!", supportSentDesc: "Recibimos tu solicitud. El admin responderá en 24 horas.", supportInfo: "Cómo funciona el soporte", supportResponseTime: "Tiempo de respuesta: normalmente 1-24 horas", supportBotNote: "También puedes escribir directamente a @studyflush_bot", supportViaTelegram: "Abrir bot en Telegram",
  },
  pl: {
    appName: "StudyFlush", welcome: "Cześć", subtitle: "Twój inteligentny asystent nauki", yourBalance: "Twoje saldo", reportsAvailable: "dostępnych", report1: "raport", reports2_4: "raporty", reports5: "raportów", firstReportFree: "Pierwszy raport za darmo!", newReport: "Nowy raport", generateAI: "Generuj z AI", history: "Historia", myReports: "Moje raporty", topUp: "Doładuj", buyReports: "Kup raporty", stats: "Statystyki", quickStart: "Szybki start", quickStartDesc: "Wybierz typ dokumentu, przedmiot i temat — AI zrobi wszystko w 10-30 sekund!", createReport: "Utwórz raport", home: "Strona główna", create: "Utwórz", letsGo: "Zaczynamy", balance: "Saldo", profile: "Profil", newDocument: "Nowy dokument", chooseDocType: "Wybierz typ dokumentu", subject: "Przedmiot", chooseSubject: "Wybierz przedmiot", chooseCategory: "Wybierz kategorię", details: "Szczegóły", describeTask: "Opisz czego potrzebujesz", topicLabel: "Temat / Zadanie *", topicPlaceholder: "Np.: Laboratorium z Pythona — sortowanie bąbelkowe", groupLabel: "Grupa / Klasa", groupPlaceholder: "Np.: IT-21, 11-A (opcjonalnie)", attachPhoto: "Dołącz zdjęcie", attachPhotoDesc: "Zdjęcie zadania z podręcznika", photoAttached: "Zdjęcie dołączone", removePhoto: "Usuń", maxFileSize: "Maks. 5 MB, JPG/PNG", generate: "Generuj", generating: "Generowanie...", generatingDesc: "AI pracuje nad twoim zadaniem. Zwykle zajmuje 10-30 sekund", done: "Gotowe!", docGenerated: "Twój dokument został wygenerowany", copy: "Kopiuj", newOne: "Nowy", error: "Błąd", tryAgain: "Spróbuj ponownie", noBalance: "Za mało raportów na saldzie", topUpBalance: "Doładuj saldo", connectionError: "Błąd połączenia. Spróbuj ponownie.", back: "Wstecz", reportsGenerated: "dokumentów wygenerowano", docsHere: "Twoje dokumenty pojawią się tutaj", noReportsYet: "Brak raportów.", createFirst: "Utwórz pierwszy!", copyText: "Kopiuj tekst", contentUnavailable: "Treść niedostępna", manageReports: "Zarządzaj raportami", availableReports: "Dostępne raporty", total: "Łącznie", freeReport: "+1 za darmo", crypto: "Krypto", cryptoDesc: "USDT / USDC (TRC-20)", telegramStars: "Telegram Stars", payViaTelegram: "Zapłać przez Telegram", important: "Ważne!", iPaid: "Zapłaciłem", cryptoAddress: "Adres (TRC-20):", cryptoNote: "Po przelewie wyślij hash transakcji do czatu wsparcia", starsNote: "Aby zapłacić Telegram Stars, wyślij botowi komendę:", starsCmd: "lub kliknij 'Kup' w menu bota", payInBot: "Zapłać w bocie", thankYou: "Dziękujemy!", paymentPending: "Zweryfikujemy płatność w ciągu 24 godzin!", goBack: "Wróć", reports15: "15 raportów", loadError: "Nie udało się załadować. Spróbuj ponownie.", profileTitle: "Profil", language: "Język", chooseLanguage: "Wybierz język", userId: "ID użytkownika", joined: "Dołączył", visaMastercard: "Visa / Mastercard", cardPayment: "Płatność kartą", cardNumber: "Numer karty:", cardNote: "W komentarzu przelewu podaj swoje ID:", receiptNote: "Po płatności wyślij zrzut ekranu do @studyflush_bot", payAmount: "Zapłać", choosePayment: "Wybierz metodę płatności", popular: "Popularne", allSubjects: "Wszystkie przedmioty", referralSystem: "System poleceń", inviteFriends: "Zaproś znajomych", referralDesc: "Zaproś znajomych i otrzymaj darmowe raporty! Oboje dostajecie +2 raporty.", referralCode: "Twój kod polecenia", copyLink: "Kopiuj link", linkCopied: "Skopiowano!", invited: "Zaproszeni", bonusEarned: "Bonus otrzymany", referralBonus: "+2 raporty za każde zaproszenie", level: "Poziom", nextLevel: "Następny poziom", achievements: "Osiągnięcia", firstReportAch: "Pierwszy krok", tenReportsAch: "Ekspert", fiftyReportsAch: "Mistrz", referralAch: "Networker", accountInfo: "Konto", memberSince: "Członek od", proTip: "Pro tip", proTipText: "Zaproś 5 znajomych i odblokuj 10 darmowych raportów!", reportReport: "Raport", reportSummary: "Streszczenie", reportDatabase: "Baza danych", reportLab: "Laboratorium", reportEssay: "Esej", reportTasks: "Zadania", reportCourseWork: "Praca kursowa", reportDiploma: "Praca dyplomowa", reportPresentation: "Prezentacja", reportTest: "Sprawdzian", reportNotes: "Notatki z wykładów", reportReportDesc: "Oficjalny raport na temat", reportSummaryDesc: "Krótkie streszczenie tematu", reportDatabaseDesc: "Tabele i zapytania SQL", reportLabDesc: "Kompletne laboratorium", reportEssayDesc: "Szczegółowy esej", reportTasksDesc: "Rozwiązywanie zadań", reportCourseWorkDesc: "Pełna praca kursowa z sekcjami", reportDiplomaDesc: "Struktura pracy dyplomowej", reportPresentationDesc: "Plan prezentacji slajd po slajdzie", reportTestDesc: "Odpowiedzi na test / egzamin", reportNotesDesc: "Notatki z wykładów i streszczenia", eduSchool: "Szkoła", eduCollege: "Technikum", eduUni: "Uczelnia", eduAll: "Wszystko", transferDescription: "Przelej na kartę poniżej i potwierdź", paymentAmount: "Kwota", walletAddress: "Adres portfela", cryptoPayment: "Krypto USDT", starsDesc: "Zapłać przez Telegram Stars", starsInstructions: "Wyślij Stars do @studyflush_bot i potwierdź.", supportContact: "Wsparcie", choosePaymentMethod: "Metody płatności", currentBalance: "Bieżące saldo", paymentSent: "Zapłaciłem", paymentNote: "Po weryfikacji przez admina saldo zostanie doładowane. Zwykle 1-24h.", noHistory: "Brak raportów", noHistoryDesc: "Utwórz pierwszy raport, aby go tu zobaczyć", progress: "Postęp", lengthShort: "Krótki", lengthMedium: "Średni", lengthFull: "Pełny", lengthShortDesc: "~500 słów", lengthMediumDesc: "~1500 słów", lengthFullDesc: "~3000 słów", reportLength: "Długość raportu", estimatedTime: "Szac. czas", estimatedWords: "słów", seconds: "sek", repeatReport: "Powtórz", shareReport: "Udostępnij", shareText: "Wygenerowano w StudyFlush Bot", recentSubjects: "Ostatnie", continueWith: "Kontynuuj", shareWithFriend: "Podziel się ze znajomym", referralStep1: "Wyślij link znajomemu", referralStep2: "Znajomy tworzy swój pierwszy raport", referralStep3: "Oboje dostajecie +2 raporty!", yourReward: "Ty dostajesz", friendReward: "Znajomy dostaje", howItWorks: "Jak to działa", sendInvite: "Wyślij zaproszenie przez Telegram", friendsJoined: "znajomych dołączyło", earnedReports: "raportów zarobionych", cardPaymentDesc: "Przelej 250 UAH na kartę i wyślij zrzut ekranu", cryptoPaymentDesc: "Wyślij 5 USDT przez sieć TRC-20", starsPaymentDesc: "Natychmiastowa płatność przez Telegram", sendScreenshot: "Po płatności wyślij zrzut ekranu do @studyflush_bot", sendScreenshotCrypto: "Po przelewie wyślij zrzut ekranu do @studyflush_bot", paymentVerification: "Manualna weryfikacja przez admina", payStep1Card: "Przelej 250 UAH na kartę", payStep2Card: "Prześlij zrzut ekranu płatności", payStep3Card: "Admin zweryfikuje i doda 15 raportów", payStep1Crypto: "Wyślij 5 USDT (TRC-20) na adres", payStep2Crypto: "Prześlij zrzut ekranu transakcji", payStep3Crypto: "Admin zweryfikuje i doda 15 raportów", adminWillCheck: "Admin zweryfikuje płatność ręcznie", uahOnly: "Tylko Ukraina", uploadScreenshot: "Prześlij zrzut ekranu", uploadScreenshotDesc: "Dołącz zrzut ekranu płatności", screenshotUploaded: "Zrzut ekranu dołączony ✓", changeScreenshot: "Zmień", screenshotRequired: "Dołącz zrzut ekranu płatności", submitting: "Wysyłanie...", paymentSubmitted: "Żądanie wysłane!", paymentSubmittedDesc: "Admin zweryfikuje płatność i doda saldo w ciągu 1-24h.", adminReviewing: "W trakcie weryfikacji", searchReports: "Szukaj raportów...", settings: "Ustawienia", support: "Wsparcie", shareApp: "Udostępnij aplikację", shareAppDesc: "Opowiedz znajomym o StudyFlush", rateBot: "Oceń bota", rateBotDesc: "Zostaw opinię na Telegramie", about: "O aplikacji", version: "Wersja", speedAch: "Sprinter", hundredReportsAch: "Legenda", genTip1: "AI analizuje twój temat...", genTip2: "Tworzenie struktury dokumentu...", genTip3: "Generowanie sekcji treści...", genTip4: "Dodawanie źródeł i referencji...", genTip5: "Formatowanie i szlifowanie...", genTip6: "Prawie gotowe!", supportTitle: "Wsparcie", supportDesc: "Opisz swój problem, a pomożemy", supportFormTitle: "Skontaktuj się z nami", supportFormDesc: "Twoja wiadomość zostanie wysłana do admina", supportCategory: "Kategoria", supportCatPayment: "Płatność", supportCatGeneration: "Generowanie", supportCatBug: "Błąd", supportCatFeature: "Pomysł", supportCatOther: "Inne", supportMessageLabel: "Twoja wiadomość", supportMessagePlaceholder: "Opisz swój problem lub pytanie szczegółowo...", supportSend: "Wyślij", supportSent: "Wiadomość wysłana!", supportSentDesc: "Otrzymaliśmy twoje zgłoszenie. Admin odpowie w ciągu 24 godzin.", supportInfo: "Jak działa wsparcie", supportResponseTime: "Czas odpowiedzi: zwykle 1-24h", supportBotNote: "Możesz też napisać bezpośrednio do @studyflush_bot", supportViaTelegram: "Otwórz bota w Telegramie",
  },
};

function makeFallback(lang: string, base: string): TranslationKeys {
  const src = translations[base] || translations.en;
  return { ...src };
}

const CIS_LANGS = ["ky", "tg", "tk", "az", "hy", "ka", "be", "md", "mn"];
const EU_LANGS = ["pt", "it", "ro", "cs", "bg", "sr", "hr"];
const ASIAN_LANGS = ["ar", "hi", "zh", "ja"];

for (const code of CIS_LANGS) {
  if (!translations[code]) {
    translations[code] = makeFallback(code, "ru");
  }
}
for (const code of EU_LANGS) {
  if (!translations[code]) {
    translations[code] = makeFallback(code, "en");
  }
}
for (const code of ASIAN_LANGS) {
  if (!translations[code]) {
    translations[code] = makeFallback(code, "en");
  }
}

const pt: TranslationKeys = { appName: "StudyFlush", welcome: "Olá", subtitle: "Seu assistente de estudos inteligente", yourBalance: "Seu saldo", reportsAvailable: "disponíveis", report1: "relatório", reports2_4: "relatórios", reports5: "relatórios", firstReportFree: "Primeiro relatório grátis!", newReport: "Novo relatório", generateAI: "Gerar com IA", history: "Histórico", myReports: "Meus relatórios", topUp: "Recarregar", buyReports: "Comprar relatórios", stats: "Estatísticas", quickStart: "Início rápido", quickStartDesc: "Escolha o tipo de documento, disciplina e tema — a IA faz tudo em 10-30 segundos!", createReport: "Criar relatório", home: "Início", create: "Criar", letsGo: "Vamos lá", balance: "Saldo", profile: "Perfil", newDocument: "Novo documento", chooseDocType: "Escolha o tipo de documento", subject: "Disciplina", chooseSubject: "Escolha a disciplina", chooseCategory: "Escolha a categoria", details: "Detalhes", describeTask: "Descreva o que precisa", topicLabel: "Tema / Tarefa *", topicPlaceholder: "Ex.: Laboratório de Python — algoritmo bubble sort", groupLabel: "Turma / Classe", groupPlaceholder: "Ex.: IT-21, 11-A (opcional)", attachPhoto: "Anexar foto", attachPhotoDesc: "Foto da tarefa do livro", photoAttached: "Foto anexada", removePhoto: "Remover", maxFileSize: "Máx. 5 MB, JPG/PNG", generate: "Gerar", generating: "Gerando...", generatingDesc: "A IA está trabalhando na sua tarefa. Normalmente leva 10-30 segundos", done: "Pronto!", docGenerated: "Seu documento foi gerado", copy: "Copiar", newOne: "Novo", error: "Erro", tryAgain: "Tentar novamente", noBalance: "Relatórios insuficientes no saldo", topUpBalance: "Recarregar saldo", connectionError: "Erro de conexão. Tente novamente.", back: "Voltar", reportsGenerated: "documentos gerados", docsHere: "Seus documentos aparecerão aqui", noReportsYet: "Ainda sem relatórios.", createFirst: "Crie o primeiro!", copyText: "Copiar texto", contentUnavailable: "Conteúdo indisponível", manageReports: "Gerencie seus relatórios", availableReports: "Relatórios disponíveis", total: "Total", freeReport: "+1 grátis", crypto: "Cripto", cryptoDesc: "USDT / USDC (TRC-20)", telegramStars: "Telegram Stars", payViaTelegram: "Pagar via Telegram", important: "Importante!", iPaid: "Eu paguei", cryptoAddress: "Endereço (TRC-20):", cryptoNote: "Após a transferência, envie o hash da transação ao suporte", starsNote: "Para pagar com Telegram Stars, envie o comando ao bot:", starsCmd: "ou clique 'Comprar' no menu do bot", payInBot: "Pagar no bot", thankYou: "Obrigado!", paymentPending: "Verificaremos o pagamento em 24 horas!", goBack: "Voltar", reports15: "15 relatórios", loadError: "Falha ao carregar. Tente novamente.", profileTitle: "Perfil", language: "Idioma", chooseLanguage: "Escolha o idioma", userId: "ID do usuário", joined: "Registrado", visaMastercard: "Visa / Mastercard", cardPayment: "Pagamento com cartão", cardNumber: "Número do cartão:", cardNote: "No comentário do pagamento, indique seu ID:", receiptNote: "Após o pagamento, envie captura do comprovante a @studyflush_bot", payAmount: "Pagar", choosePayment: "Escolha o método de pagamento", popular: "Popular", allSubjects: "Todas as disciplinas", referralSystem: "Sistema de indicação", inviteFriends: "Convidar amigos", referralDesc: "Convide amigos e ganhe relatórios grátis! Ambos recebem +2 relatórios.", referralCode: "Seu código de indicação", copyLink: "Copiar link", linkCopied: "Copiado!", invited: "Convidados", bonusEarned: "Bônus ganho", referralBonus: "+2 relatórios por convite", level: "Nível", nextLevel: "Próximo nível", achievements: "Conquistas", firstReportAch: "Primeiro passo", tenReportsAch: "Especialista", fiftyReportsAch: "Mestre", referralAch: "Networker", accountInfo: "Conta", memberSince: "Membro desde", proTip: "Dica pro", proTipText: "Convide 5 amigos para desbloquear 10 relatórios grátis!", reportReport: "Relatório", reportSummary: "Resumo", reportDatabase: "Banco de dados", reportLab: "Laboratório", reportEssay: "Ensaio", reportTasks: "Exercícios", reportCourseWork: "Trabalho de curso", reportDiploma: "TCC", reportPresentation: "Apresentação", reportTest: "Prova", reportNotes: "Notas de aula", reportReportDesc: "Relatório oficial sobre um tema", reportSummaryDesc: "Resumo breve de um tema", reportDatabaseDesc: "Tabelas e consultas SQL", reportLabDesc: "Laboratório completo", reportEssayDesc: "Ensaio detalhado", reportTasksDesc: "Resolução de problemas", reportCourseWorkDesc: "Trabalho de curso completo", reportDiplomaDesc: "Estrutura do TCC", reportPresentationDesc: "Plano de apresentação por slides", reportTestDesc: "Respostas de prova/exame", reportNotesDesc: "Notas de aula e resumos", eduSchool: "Escola", eduCollege: "Técnico", eduUni: "Universidade", eduAll: "Todos", transferDescription: "Transfira para o cartão abaixo e confirme", paymentAmount: "Valor", walletAddress: "Endereço da carteira", cryptoPayment: "Cripto USDT", starsDesc: "Pagar via Telegram Stars", starsInstructions: "Envie Stars para @studyflush_bot e confirme.", supportContact: "Suporte", choosePaymentMethod: "Métodos de pagamento", currentBalance: "Saldo atual", paymentSent: "Eu paguei", paymentNote: "Após verificação do admin, o saldo será creditado. Normalmente 1-24h.", noHistory: "Sem relatórios", noHistoryDesc: "Crie seu primeiro relatório para vê-lo aqui", progress: "Progresso", lengthShort: "Curto", lengthMedium: "Médio", lengthFull: "Completo", lengthShortDesc: "~500 palavras", lengthMediumDesc: "~1500 palavras", lengthFullDesc: "~3000 palavras", reportLength: "Tamanho do relatório", estimatedTime: "Tempo est.", estimatedWords: "palavras", seconds: "seg", repeatReport: "Repetir", shareReport: "Compartilhar", shareText: "Gerado com StudyFlush Bot", recentSubjects: "Recentes", continueWith: "Continuar", shareWithFriend: "Compartilhe com um amigo", referralStep1: "Envie seu link para um amigo", referralStep2: "Amigo cria seu primeiro relatório", referralStep3: "Ambos recebem +2 relatórios!", yourReward: "Você recebe", friendReward: "Amigo recebe", howItWorks: "Como funciona", sendInvite: "Enviar convite via Telegram", friendsJoined: "amigos entraram", earnedReports: "relatórios ganhos", cardPaymentDesc: "Transfira 250 UAH para o cartão e envie captura", cryptoPaymentDesc: "Envie 5 USDT pela rede TRC-20", starsPaymentDesc: "Pagamento instantâneo via Telegram", sendScreenshot: "Após o pagamento, envie captura a @studyflush_bot", sendScreenshotCrypto: "Após a transferência, envie captura a @studyflush_bot", paymentVerification: "Verificação manual pelo admin", payStep1Card: "Transfira 250 UAH para o cartão", payStep2Card: "Envie captura do pagamento", payStep3Card: "Admin verifica e credita 15 relatórios", payStep1Crypto: "Envie 5 USDT (TRC-20) para o endereço", payStep2Crypto: "Envie captura da transação", payStep3Crypto: "Admin verifica e credita 15 relatórios", adminWillCheck: "Admin verificará seu pagamento manualmente", uahOnly: "Apenas Ucrânia", uploadScreenshot: "Enviar captura", uploadScreenshotDesc: "Anexe uma captura do seu pagamento", screenshotUploaded: "Captura anexada ✓", changeScreenshot: "Alterar", screenshotRequired: "Por favor, anexe uma captura de pagamento", submitting: "Enviando...", paymentSubmitted: "Solicitação enviada!", paymentSubmittedDesc: "Admin verificará seu pagamento e creditará o saldo em 1-24h.", adminReviewing: "Em análise", searchReports: "Buscar relatórios...", settings: "Configurações", support: "Suporte", shareApp: "Compartilhar app", shareAppDesc: "Conte aos amigos sobre o StudyFlush", rateBot: "Avaliar bot", rateBotDesc: "Deixe uma avaliação no Telegram", about: "Sobre", version: "Versão", speedAch: "Velocista", hundredReportsAch: "Lenda", genTip1: "IA analisando seu tema...", genTip2: "Construindo estrutura do documento...", genTip3: "Gerando seções de conteúdo...", genTip4: "Adicionando referências e fontes...", genTip5: "Formatando e polindo...", genTip6: "Quase pronto!", supportTitle: "Suporte", supportDesc: "Descreva seu problema e ajudaremos", supportFormTitle: "Fale conosco", supportFormDesc: "Sua mensagem será enviada ao admin", supportCategory: "Categoria", supportCatPayment: "Pagamento", supportCatGeneration: "Geração", supportCatBug: "Bug", supportCatFeature: "Ideia", supportCatOther: "Outro", supportMessageLabel: "Sua mensagem", supportMessagePlaceholder: "Descreva seu problema ou pergunta em detalhes...", supportSend: "Enviar", supportSent: "Mensagem enviada!", supportSentDesc: "Recebemos sua solicitação. O admin responderá em 24 horas.", supportInfo: "Como funciona o suporte", supportResponseTime: "Tempo de resposta: normalmente 1-24h", supportBotNote: "Você também pode escrever diretamente para @studyflush_bot", supportViaTelegram: "Abrir bot no Telegram" };
translations.pt = pt;

const it: TranslationKeys = { appName: "StudyFlush", welcome: "Ciao", subtitle: "Il tuo assistente di studio intelligente", yourBalance: "Il tuo saldo", reportsAvailable: "disponibili", report1: "relazione", reports2_4: "relazioni", reports5: "relazioni", firstReportFree: "Prima relazione gratis!", newReport: "Nuova relazione", generateAI: "Genera con IA", history: "Cronologia", myReports: "Le mie relazioni", topUp: "Ricarica", buyReports: "Acquista relazioni", stats: "Statistiche", quickStart: "Avvio rapido", quickStartDesc: "Scegli tipo di documento, materia e argomento — l'IA fa tutto in 10-30 secondi!", createReport: "Crea relazione", home: "Home", create: "Crea", letsGo: "Andiamo", balance: "Saldo", profile: "Profilo", newDocument: "Nuovo documento", chooseDocType: "Scegli il tipo di documento", subject: "Materia", chooseSubject: "Scegli la materia", chooseCategory: "Scegli la categoria", details: "Dettagli", describeTask: "Descrivi cosa ti serve", topicLabel: "Argomento / Compito *", topicPlaceholder: "Es.: Lab Python — algoritmo bubble sort", groupLabel: "Gruppo / Classe", groupPlaceholder: "Es.: IT-21, 11-A (opzionale)", attachPhoto: "Allega foto", attachPhotoDesc: "Foto del compito dal libro", photoAttached: "Foto allegata", removePhoto: "Rimuovi", maxFileSize: "Max 5 MB, JPG/PNG", generate: "Genera", generating: "Generazione...", generatingDesc: "L'IA sta lavorando al tuo compito. Di solito richiede 10-30 secondi", done: "Fatto!", docGenerated: "Il tuo documento è stato generato", copy: "Copia", newOne: "Nuovo", error: "Errore", tryAgain: "Riprova", noBalance: "Relazioni insufficienti nel saldo", topUpBalance: "Ricarica saldo", connectionError: "Errore di connessione. Riprova.", back: "Indietro", reportsGenerated: "documenti generati", docsHere: "I tuoi documenti appariranno qui", noReportsYet: "Ancora nessuna relazione.", createFirst: "Crea la prima!", copyText: "Copia testo", contentUnavailable: "Contenuto non disponibile", manageReports: "Gestisci le tue relazioni", availableReports: "Relazioni disponibili", total: "Totale", freeReport: "+1 gratis", crypto: "Cripto", cryptoDesc: "USDT / USDC (TRC-20)", telegramStars: "Telegram Stars", payViaTelegram: "Paga via Telegram", important: "Importante!", iPaid: "Ho pagato", cryptoAddress: "Indirizzo (TRC-20):", cryptoNote: "Dopo il trasferimento, invia l'hash al supporto", starsNote: "Per pagare con Telegram Stars, invia il comando al bot:", starsCmd: "o clicca 'Acquista' nel menu del bot", payInBot: "Paga nel bot", thankYou: "Grazie!", paymentPending: "Verificheremo il pagamento entro 24 ore!", goBack: "Torna", reports15: "15 relazioni", loadError: "Caricamento fallito. Riprova.", profileTitle: "Profilo", language: "Lingua", chooseLanguage: "Scegli la lingua", userId: "ID utente", joined: "Iscritto", visaMastercard: "Visa / Mastercard", cardPayment: "Pagamento con carta", cardNumber: "Numero carta:", cardNote: "Nel commento del pagamento indica il tuo ID:", receiptNote: "Dopo il pagamento invia screenshot della ricevuta a @studyflush_bot", payAmount: "Paga", choosePayment: "Scegli il metodo di pagamento", popular: "Popolare", allSubjects: "Tutte le materie", referralSystem: "Sistema referral", inviteFriends: "Invita amici", referralDesc: "Invita amici e ottieni relazioni gratis! Entrambi ricevete +2 relazioni.", referralCode: "Il tuo codice referral", copyLink: "Copia link", linkCopied: "Copiato!", invited: "Invitati", bonusEarned: "Bonus ottenuto", referralBonus: "+2 relazioni per ogni invito", level: "Livello", nextLevel: "Prossimo livello", achievements: "Traguardi", firstReportAch: "Primo passo", tenReportsAch: "Esperto", fiftyReportsAch: "Maestro", referralAch: "Networker", accountInfo: "Account", memberSince: "Membro dal", proTip: "Consiglio", proTipText: "Invita 5 amici per sbloccare 10 relazioni gratis!", reportReport: "Relazione", reportSummary: "Riassunto", reportDatabase: "Database", reportLab: "Laboratorio", reportEssay: "Saggio", reportTasks: "Esercizi", reportCourseWork: "Lavoro di corso", reportDiploma: "Tesi", reportPresentation: "Presentazione", reportTest: "Esame", reportNotes: "Appunti", reportReportDesc: "Relazione ufficiale su un argomento", reportSummaryDesc: "Riassunto breve di un argomento", reportDatabaseDesc: "Tabelle e query SQL", reportLabDesc: "Laboratorio completo", reportEssayDesc: "Saggio dettagliato", reportTasksDesc: "Risoluzione problemi", reportCourseWorkDesc: "Lavoro di corso completo", reportDiplomaDesc: "Struttura della tesi", reportPresentationDesc: "Piano di presentazione per slide", reportTestDesc: "Risposte esame", reportNotesDesc: "Appunti e riassunti", eduSchool: "Scuola", eduCollege: "Istituto", eduUni: "Università", eduAll: "Tutti", transferDescription: "Trasferisci sulla carta sotto e conferma", paymentAmount: "Importo", walletAddress: "Indirizzo wallet", cryptoPayment: "Cripto USDT", starsDesc: "Paga via Telegram Stars", starsInstructions: "Invia Stars a @studyflush_bot e conferma.", supportContact: "Supporto", choosePaymentMethod: "Metodi di pagamento", currentBalance: "Saldo attuale", paymentSent: "Ho pagato", paymentNote: "Dopo la verifica dell'admin, il saldo sarà accreditato. Di solito 1-24h.", noHistory: "Nessuna relazione", noHistoryDesc: "Crea la tua prima relazione per vederla qui", progress: "Progresso", lengthShort: "Breve", lengthMedium: "Medio", lengthFull: "Completo", lengthShortDesc: "~500 parole", lengthMediumDesc: "~1500 parole", lengthFullDesc: "~3000 parole", reportLength: "Lunghezza relazione", estimatedTime: "Tempo stimato", estimatedWords: "parole", seconds: "sec", repeatReport: "Ripeti", shareReport: "Condividi", shareText: "Generato con StudyFlush Bot", recentSubjects: "Recenti", continueWith: "Continua", shareWithFriend: "Condividi con un amico", referralStep1: "Invia il tuo link a un amico", referralStep2: "L'amico crea la sua prima relazione", referralStep3: "Entrambi ricevete +2 relazioni!", yourReward: "Tu ricevi", friendReward: "L'amico riceve", howItWorks: "Come funziona", sendInvite: "Invia invito via Telegram", friendsJoined: "amici uniti", earnedReports: "relazioni guadagnate", cardPaymentDesc: "Trasferisci 250 UAH sulla carta e invia screenshot", cryptoPaymentDesc: "Invia 5 USDT via rete TRC-20", starsPaymentDesc: "Pagamento istantaneo via Telegram", sendScreenshot: "Dopo il pagamento invia screenshot a @studyflush_bot", sendScreenshotCrypto: "Dopo il trasferimento invia screenshot a @studyflush_bot", paymentVerification: "Verifica manuale dall'admin", payStep1Card: "Trasferisci 250 UAH sulla carta", payStep2Card: "Carica screenshot del pagamento", payStep3Card: "L'admin verifica e accredita 15 relazioni", payStep1Crypto: "Invia 5 USDT (TRC-20) all'indirizzo", payStep2Crypto: "Carica screenshot della transazione", payStep3Crypto: "L'admin verifica e accredita 15 relazioni", adminWillCheck: "L'admin verificherà il pagamento manualmente", uahOnly: "Solo Ucraina", uploadScreenshot: "Carica screenshot", uploadScreenshotDesc: "Allega screenshot del pagamento", screenshotUploaded: "Screenshot allegato ✓", changeScreenshot: "Modifica", screenshotRequired: "Allega screenshot del pagamento", submitting: "Invio...", paymentSubmitted: "Richiesta inviata!", paymentSubmittedDesc: "L'admin verificherà il pagamento e accrediterà il saldo in 1-24h.", adminReviewing: "In revisione", searchReports: "Cerca relazioni...", settings: "Impostazioni", support: "Supporto", shareApp: "Condividi app", shareAppDesc: "Parla di StudyFlush ai tuoi amici", rateBot: "Valuta bot", rateBotDesc: "Lascia una recensione su Telegram", about: "Info", version: "Versione", speedAch: "Velocista", hundredReportsAch: "Leggenda", genTip1: "L'IA analizza il tuo argomento...", genTip2: "Costruzione struttura documento...", genTip3: "Generazione sezioni di contenuto...", genTip4: "Aggiunta riferimenti e fonti...", genTip5: "Formattazione e rifinitura...", genTip6: "Quasi pronto!", supportTitle: "Supporto", supportDesc: "Descrivi il tuo problema e ti aiuteremo", supportFormTitle: "Contattaci", supportFormDesc: "Il tuo messaggio sarà inviato all'admin", supportCategory: "Categoria", supportCatPayment: "Pagamento", supportCatGeneration: "Generazione", supportCatBug: "Bug", supportCatFeature: "Idea", supportCatOther: "Altro", supportMessageLabel: "Il tuo messaggio", supportMessagePlaceholder: "Descrivi il tuo problema o domanda in dettaglio...", supportSend: "Invia", supportSent: "Messaggio inviato!", supportSentDesc: "Abbiamo ricevuto la tua richiesta. L'admin risponderà entro 24 ore.", supportInfo: "Come funziona il supporto", supportResponseTime: "Tempo di risposta: di solito 1-24h", supportBotNote: "Puoi anche scrivere direttamente a @studyflush_bot", supportViaTelegram: "Apri bot su Telegram" };
translations.it = it;

const zh: TranslationKeys = { appName: "StudyFlush", welcome: "你好", subtitle: "你的智能学习助手", yourBalance: "你的余额", reportsAvailable: "可用", report1: "份报告", reports2_4: "份报告", reports5: "份报告", firstReportFree: "第一份报告免费！", newReport: "新报告", generateAI: "AI生成", history: "历史", myReports: "我的报告", topUp: "充值", buyReports: "购买报告", stats: "统计", quickStart: "快速开始", quickStartDesc: "选择文档类型、学科和主题——AI将在10-30秒内完成一切！", createReport: "创建报告", home: "首页", create: "创建", letsGo: "开始吧", balance: "余额", profile: "个人资料", newDocument: "新文档", chooseDocType: "选择文档类型", subject: "学科", chooseSubject: "选择学科", chooseCategory: "选择分类", details: "详情", describeTask: "描述你的需求", topicLabel: "主题/任务 *", topicPlaceholder: "例如：Python实验——冒泡排序算法", groupLabel: "班级/年级", groupPlaceholder: "例如：IT-21、高三A班（可选）", attachPhoto: "附加照片", attachPhotoDesc: "课本上的作业照片", photoAttached: "照片已附加", removePhoto: "删除", maxFileSize: "最大5MB，JPG/PNG", generate: "生成", generating: "生成中...", generatingDesc: "AI正在处理你的任务，通常需要10-30秒", done: "完成！", docGenerated: "你的文档已生成", copy: "复制", newOne: "新建", error: "错误", tryAgain: "重试", noBalance: "余额不足", topUpBalance: "充值余额", connectionError: "连接错误，请重试。", back: "返回", reportsGenerated: "份文档已生成", docsHere: "你的文档将显示在这里", noReportsYet: "暂无报告。", createFirst: "创建第一份！", copyText: "复制文本", contentUnavailable: "内容不可用", manageReports: "管理你的报告", availableReports: "可用报告", total: "总计", freeReport: "+1免费", crypto: "加密货币", cryptoDesc: "USDT / USDC (TRC-20)", telegramStars: "Telegram Stars", payViaTelegram: "通过Telegram支付", important: "重要！", iPaid: "我已支付", cryptoAddress: "地址 (TRC-20)：", cryptoNote: "转账后，将交易哈希发送到客服聊天", starsNote: "使用Telegram Stars支付，请向机器人发送命令：", starsCmd: "或点击机器人菜单中的'购买'", payInBot: "在机器人中支付", thankYou: "谢谢！", paymentPending: "我们将在24小时内验证付款！", goBack: "返回", reports15: "15份报告", loadError: "加载失败，请重试。", profileTitle: "个人资料", language: "语言", chooseLanguage: "选择语言", userId: "用户ID", joined: "注册时间", visaMastercard: "Visa / Mastercard", cardPayment: "银行卡支付", cardNumber: "卡号：", cardNote: "在付款备注中注明你的ID：", receiptNote: "付款后，将收据截图发送到 @studyflush_bot", payAmount: "支付", choosePayment: "选择支付方式", popular: "热门", allSubjects: "所有学科", referralSystem: "推荐系统", inviteFriends: "邀请朋友", referralDesc: "邀请朋友获得免费报告！你和朋友各获+2份报告。", referralCode: "你的推荐码", copyLink: "复制链接", linkCopied: "已复制！", invited: "已邀请", bonusEarned: "获得奖励", referralBonus: "每次邀请+2份报告", level: "等级", nextLevel: "下一级", achievements: "成就", firstReportAch: "第一步", tenReportsAch: "专家", fiftyReportsAch: "大师", referralAch: "社交达人", accountInfo: "账户", memberSince: "注册日期", proTip: "专业提示", proTipText: "邀请5位朋友解锁10份免费报告！", reportReport: "报告", reportSummary: "摘要", reportDatabase: "数据库", reportLab: "实验报告", reportEssay: "论文", reportTasks: "习题", reportCourseWork: "课程论文", reportDiploma: "毕业论文", reportPresentation: "演示文稿", reportTest: "考试", reportNotes: "课堂笔记", reportReportDesc: "关于某主题的正式报告", reportSummaryDesc: "主题简要摘要", reportDatabaseDesc: "SQL表和查询", reportLabDesc: "完整实验报告", reportEssayDesc: "详细论文", reportTasksDesc: "解题", reportCourseWorkDesc: "完整课程论文", reportDiplomaDesc: "毕业论文结构", reportPresentationDesc: "逐页演示计划", reportTestDesc: "考试答案", reportNotesDesc: "课堂笔记和摘要", eduSchool: "中学", eduCollege: "专科", eduUni: "大学", eduAll: "全部", transferDescription: "转账到下方卡号并确认", paymentAmount: "金额", walletAddress: "钱包地址", cryptoPayment: "加密货币USDT", starsDesc: "通过Telegram Stars支付", starsInstructions: "将Stars发送到 @studyflush_bot 并确认。", supportContact: "客服", choosePaymentMethod: "支付方式", currentBalance: "当前余额", paymentSent: "我已支付", paymentNote: "管理员验证后余额将充值，通常1-24小时。", noHistory: "暂无报告", noHistoryDesc: "创建第一份报告即可在此查看", progress: "进度", lengthShort: "简短", lengthMedium: "中等", lengthFull: "完整", lengthShortDesc: "约500字", lengthMediumDesc: "约1500字", lengthFullDesc: "约3000字", reportLength: "报告长度", estimatedTime: "预计时间", estimatedWords: "字", seconds: "秒", repeatReport: "重复", shareReport: "分享", shareText: "由StudyFlush Bot生成", recentSubjects: "最近", continueWith: "继续", shareWithFriend: "分享给朋友", referralStep1: "将链接发送给朋友", referralStep2: "朋友创建第一份报告", referralStep3: "你们都获得+2份报告！", yourReward: "你获得", friendReward: "朋友获得", howItWorks: "如何运作", sendInvite: "通过Telegram发送邀请", friendsJoined: "位朋友已加入", earnedReports: "份报告已赚取", cardPaymentDesc: "转账250 UAH到卡上并发送截图", cryptoPaymentDesc: "通过TRC-20网络发送5 USDT", starsPaymentDesc: "Telegram即时支付", sendScreenshot: "支付后将截图发送到 @studyflush_bot", sendScreenshotCrypto: "转账后将截图发送到 @studyflush_bot", paymentVerification: "管理员手动验证", payStep1Card: "转账250 UAH到卡上", payStep2Card: "上传支付截图", payStep3Card: "管理员验证并充值15份报告", payStep1Crypto: "发送5 USDT (TRC-20)到地址", payStep2Crypto: "上传交易截图", payStep3Crypto: "管理员验证并充值15份报告", adminWillCheck: "管理员将手动验证你的付款", uahOnly: "仅限乌克兰", uploadScreenshot: "上传截图", uploadScreenshotDesc: "附上你的支付截图", screenshotUploaded: "截图已附加 ✓", changeScreenshot: "更换", screenshotRequired: "请附上支付截图", submitting: "发送中...", paymentSubmitted: "请求已发送！", paymentSubmittedDesc: "管理员将在1-24小时内验证付款并充值余额。", adminReviewing: "审核中", searchReports: "搜索报告...", settings: "设置", support: "客服", shareApp: "分享应用", shareAppDesc: "告诉朋友StudyFlush", rateBot: "评价机器人", rateBotDesc: "在Telegram上留下评价", about: "关于", version: "版本", speedAch: "速度达人", hundredReportsAch: "传奇", genTip1: "AI正在分析你的主题...", genTip2: "构建文档结构...", genTip3: "生成内容部分...", genTip4: "添加参考文献...", genTip5: "格式化和润色...", genTip6: "即将完成！", supportTitle: "客服", supportDesc: "描述你的问题，我们会帮助你", supportFormTitle: "联系我们", supportFormDesc: "你的消息将发送给管理员", supportCategory: "类别", supportCatPayment: "支付", supportCatGeneration: "生成", supportCatBug: "故障", supportCatFeature: "建议", supportCatOther: "其他", supportMessageLabel: "你的消息", supportMessagePlaceholder: "详细描述你的问题或疑问...", supportSend: "发送", supportSent: "消息已发送！", supportSentDesc: "我们已收到你的请求，管理员将在24小时内回复。", supportInfo: "客服如何运作", supportResponseTime: "回复时间：通常1-24小时", supportBotNote: "你也可以直接给 @studyflush_bot 发消息", supportViaTelegram: "在Telegram中打开机器人" };
translations.zh = zh;

const ja: TranslationKeys = { appName: "StudyFlush", welcome: "こんにちは", subtitle: "あなたのスマート学習アシスタント", yourBalance: "残高", reportsAvailable: "利用可能", report1: "レポート", reports2_4: "レポート", reports5: "レポート", firstReportFree: "最初のレポートは無料！", newReport: "新規レポート", generateAI: "AIで生成", history: "履歴", myReports: "マイレポート", topUp: "チャージ", buyReports: "レポートを購入", stats: "統計", quickStart: "クイックスタート", quickStartDesc: "ドキュメントの種類、科目、テーマを選択 — AIが10-30秒ですべてを行います！", createReport: "レポート作成", home: "ホーム", create: "作成", letsGo: "始めよう", balance: "残高", profile: "プロフィール", newDocument: "新規ドキュメント", chooseDocType: "ドキュメントの種類を選択", subject: "科目", chooseSubject: "科目を選択", chooseCategory: "カテゴリーを選択", details: "詳細", describeTask: "必要なことを説明してください", topicLabel: "テーマ / 課題 *", topicPlaceholder: "例：Pythonの実験 — バブルソートアルゴリズム", groupLabel: "グループ / クラス", groupPlaceholder: "例：IT-21、3年A組（任意）", attachPhoto: "写真を添付", attachPhotoDesc: "教科書の課題の写真", photoAttached: "写真添付済み", removePhoto: "削除", maxFileSize: "最大5MB、JPG/PNG", generate: "生成", generating: "生成中...", generatingDesc: "AIがあなたの課題に取り組んでいます。通常10-30秒かかります", done: "完了！", docGenerated: "ドキュメントが生成されました", copy: "コピー", newOne: "新規", error: "エラー", tryAgain: "再試行", noBalance: "残高が不足しています", topUpBalance: "残高をチャージ", connectionError: "接続エラー。再試行してください。", back: "戻る", reportsGenerated: "件のドキュメントが生成されました", docsHere: "ドキュメントはここに表示されます", noReportsYet: "レポートはまだありません。", createFirst: "最初のレポートを作成しましょう！", copyText: "テキストをコピー", contentUnavailable: "コンテンツは利用できません", manageReports: "レポートを管理", availableReports: "利用可能なレポート", total: "合計", freeReport: "+1無料", crypto: "暗号通貨", cryptoDesc: "USDT / USDC (TRC-20)", telegramStars: "Telegram Stars", payViaTelegram: "Telegramで支払う", important: "重要！", iPaid: "支払い済み", cryptoAddress: "アドレス (TRC-20)：", cryptoNote: "送金後、トランザクションハッシュをサポートチャットに送信してください", starsNote: "Telegram Starsで支払うには、ボットにコマンドを送信：", starsCmd: "またはボットメニューの「購入」をクリック", payInBot: "ボットで支払う", thankYou: "ありがとう！", paymentPending: "24時間以内に支払いを確認します！", goBack: "戻る", reports15: "15レポート", loadError: "読み込み失敗。再試行してください。", profileTitle: "プロフィール", language: "言語", chooseLanguage: "言語を選択", userId: "ユーザーID", joined: "登録日", visaMastercard: "Visa / Mastercard", cardPayment: "カード支払い", cardNumber: "カード番号：", cardNote: "支払いコメントにIDを記入：", receiptNote: "支払い後、レシートのスクリーンショットを @studyflush_bot に送信", payAmount: "支払う", choosePayment: "支払い方法を選択", popular: "人気", allSubjects: "全科目", referralSystem: "紹介システム", inviteFriends: "友達を招待", referralDesc: "友達を招待して無料レポートをゲット！お二人とも+2レポートを受け取れます。", referralCode: "紹介コード", copyLink: "リンクをコピー", linkCopied: "コピーしました！", invited: "招待済み", bonusEarned: "ボーナス獲得", referralBonus: "招待ごとに+2レポート", level: "レベル", nextLevel: "次のレベル", achievements: "実績", firstReportAch: "第一歩", tenReportsAch: "エキスパート", fiftyReportsAch: "マスター", referralAch: "ネットワーカー", accountInfo: "アカウント", memberSince: "メンバー登録日", proTip: "プロのヒント", proTipText: "5人の友達を招待して10件の無料レポートを解除！", reportReport: "レポート", reportSummary: "要約", reportDatabase: "データベース", reportLab: "実験レポート", reportEssay: "エッセイ", reportTasks: "演習問題", reportCourseWork: "コースワーク", reportDiploma: "卒業論文", reportPresentation: "プレゼンテーション", reportTest: "テスト", reportNotes: "講義ノート", reportReportDesc: "テーマに関する公式レポート", reportSummaryDesc: "テーマの簡潔な要約", reportDatabaseDesc: "SQLテーブルとクエリ", reportLabDesc: "完全な実験レポート", reportEssayDesc: "詳細なエッセイ", reportTasksDesc: "問題解決", reportCourseWorkDesc: "セクション付き完全コースワーク", reportDiplomaDesc: "卒業論文の構造", reportPresentationDesc: "スライドごとのプレゼン計画", reportTestDesc: "テスト・試験の解答", reportNotesDesc: "講義ノートと要約", eduSchool: "高校", eduCollege: "専門学校", eduUni: "大学", eduAll: "すべて", transferDescription: "下記のカードに送金して確認してください", paymentAmount: "金額", walletAddress: "ウォレットアドレス", cryptoPayment: "暗号通貨USDT", starsDesc: "Telegram Starsで支払う", starsInstructions: "Starsを @studyflush_bot に送信して確認。", supportContact: "サポート", choosePaymentMethod: "支払い方法", currentBalance: "現在の残高", paymentSent: "支払い済み", paymentNote: "管理者の確認後、残高がチャージされます。通常1-24時間。", noHistory: "レポートなし", noHistoryDesc: "最初のレポートを作成してここに表示", progress: "進捗", lengthShort: "短い", lengthMedium: "普通", lengthFull: "完全", lengthShortDesc: "約500字", lengthMediumDesc: "約1500字", lengthFullDesc: "約3000字", reportLength: "レポートの長さ", estimatedTime: "推定時間", estimatedWords: "字", seconds: "秒", repeatReport: "繰り返す", shareReport: "共有", shareText: "StudyFlush Botで生成", recentSubjects: "最近", continueWith: "続ける", shareWithFriend: "友達と共有", referralStep1: "リンクを友達に送信", referralStep2: "友達が最初のレポートを作成", referralStep3: "お二人とも+2レポートを受け取れます！", yourReward: "あなたが受け取る", friendReward: "友達が受け取る", howItWorks: "仕組み", sendInvite: "Telegramで招待を送る", friendsJoined: "人の友達が参加", earnedReports: "レポート獲得", cardPaymentDesc: "250 UAHをカードに送金してスクリーンショットを送信", cryptoPaymentDesc: "TRC-20ネットワークで5 USDTを送信", starsPaymentDesc: "Telegramで即時支払い", sendScreenshot: "支払い後、スクリーンショットを @studyflush_bot に送信", sendScreenshotCrypto: "送金後、スクリーンショットを @studyflush_bot に送信", paymentVerification: "管理者による手動確認", payStep1Card: "250 UAHをカードに送金", payStep2Card: "支払いスクリーンショットをアップロード", payStep3Card: "管理者が確認し15レポートを付与", payStep1Crypto: "5 USDT (TRC-20)をアドレスに送信", payStep2Crypto: "トランザクションスクリーンショットをアップロード", payStep3Crypto: "管理者が確認し15レポートを付与", adminWillCheck: "管理者が支払いを手動で確認します", uahOnly: "ウクライナのみ", uploadScreenshot: "スクリーンショットをアップロード", uploadScreenshotDesc: "支払いスクリーンショットを添付", screenshotUploaded: "スクリーンショット添付済み ✓", changeScreenshot: "変更", screenshotRequired: "支払いスクリーンショットを添付してください", submitting: "送信中...", paymentSubmitted: "リクエスト送信済み！", paymentSubmittedDesc: "管理者が1-24時間以内に支払いを確認し残高をチャージします。", adminReviewing: "審査中", searchReports: "レポートを検索...", settings: "設定", support: "サポート", shareApp: "アプリを共有", shareAppDesc: "友達にStudyFlushを紹介", rateBot: "ボットを評価", rateBotDesc: "Telegramでレビューを投稿", about: "概要", version: "バージョン", speedAch: "スピードランナー", hundredReportsAch: "レジェンド", genTip1: "AIがテーマを分析中...", genTip2: "ドキュメント構造を構築中...", genTip3: "コンテンツセクションを生成中...", genTip4: "参考文献を追加中...", genTip5: "フォーマットと仕上げ...", genTip6: "もうすぐ完成！", supportTitle: "サポート", supportDesc: "問題を説明してください、お手伝いします", supportFormTitle: "お問い合わせ", supportFormDesc: "メッセージは管理者に送信されます", supportCategory: "カテゴリー", supportCatPayment: "支払い", supportCatGeneration: "生成", supportCatBug: "バグ", supportCatFeature: "アイデア", supportCatOther: "その他", supportMessageLabel: "メッセージ", supportMessagePlaceholder: "問題や質問を詳しく説明してください...", supportSend: "送信", supportSent: "メッセージ送信済み！", supportSentDesc: "リクエストを受け取りました。管理者が24時間以内に回答します。", supportInfo: "サポートの仕組み", supportResponseTime: "回答時間：通常1-24時間", supportBotNote: "@studyflush_bot に直接メッセージすることもできます", supportViaTelegram: "Telegramでボットを開く" };
translations.ja = ja;

const hi: TranslationKeys = { appName: "StudyFlush", welcome: "नमस्ते", subtitle: "आपका स्मार्ट अध्ययन सहायक", yourBalance: "आपका बैलेंस", reportsAvailable: "उपलब्ध", report1: "रिपोर्ट", reports2_4: "रिपोर्ट", reports5: "रिपोर्ट", firstReportFree: "पहली रिपोर्ट मुफ्त!", newReport: "नई रिपोर्ट", generateAI: "AI से बनाएं", history: "इतिहास", myReports: "मेरी रिपोर्ट", topUp: "रिचार्ज", buyReports: "रिपोर्ट खरीदें", stats: "आंकड़े", quickStart: "त्वरित शुरुआत", quickStartDesc: "दस्तावेज़ प्रकार, विषय और टॉपिक चुनें — AI 10-30 सेकंड में सब कुछ करेगा!", createReport: "रिपोर्ट बनाएं", home: "होम", create: "बनाएं", letsGo: "चलिए शुरू करें", balance: "बैलेंस", profile: "प्रोफ़ाइल", newDocument: "नया दस्तावेज़", chooseDocType: "दस्तावेज़ प्रकार चुनें", subject: "विषय", chooseSubject: "विषय चुनें", chooseCategory: "श्रेणी चुनें", details: "विवरण", describeTask: "बताएं आपको क्या चाहिए", topicLabel: "विषय / कार्य *", topicPlaceholder: "जैसे: Python प्रयोगशाला — बबल सॉर्ट एल्गोरिदम", groupLabel: "समूह / कक्षा", groupPlaceholder: "जैसे: IT-21, 11-A (वैकल्पिक)", attachPhoto: "फोटो संलग्न करें", attachPhotoDesc: "पाठ्यपुस्तक से कार्य का फोटो", photoAttached: "फोटो संलग्न", removePhoto: "हटाएं", maxFileSize: "अधिकतम 5 MB, JPG/PNG", generate: "बनाएं", generating: "बन रहा है...", generatingDesc: "AI आपके कार्य पर काम कर रहा है। आमतौर पर 10-30 सेकंड लगते हैं", done: "हो गया!", docGenerated: "आपका दस्तावेज़ बन गया है", copy: "कॉपी", newOne: "नया", error: "त्रुटि", tryAgain: "पुनः प्रयास करें", noBalance: "बैलेंस में पर्याप्त रिपोर्ट नहीं", topUpBalance: "बैलेंस रिचार्ज करें", connectionError: "कनेक्शन त्रुटि। पुनः प्रयास करें।", back: "वापस", reportsGenerated: "दस्तावेज़ बने", docsHere: "आपके दस्तावेज़ यहां दिखाई देंगे", noReportsYet: "अभी कोई रिपोर्ट नहीं।", createFirst: "पहला बनाएं!", copyText: "टेक्स्ट कॉपी करें", contentUnavailable: "सामग्री अनुपलब्ध", manageReports: "अपनी रिपोर्ट प्रबंधित करें", availableReports: "उपलब्ध रिपोर्ट", total: "कुल", freeReport: "+1 मुफ्त", crypto: "क्रिप्टो", cryptoDesc: "USDT / USDC (TRC-20)", telegramStars: "Telegram Stars", payViaTelegram: "Telegram से भुगतान", important: "महत्वपूर्ण!", iPaid: "मैंने भुगतान किया", cryptoAddress: "पता (TRC-20):", cryptoNote: "ट्रांसफर के बाद ट्रांजैक्शन हैश सपोर्ट चैट में भेजें", starsNote: "Telegram Stars से भुगतान करने के लिए बॉट को कमांड भेजें:", starsCmd: "या बॉट मेनू में 'खरीदें' पर क्लिक करें", payInBot: "बॉट में भुगतान करें", thankYou: "धन्यवाद!", paymentPending: "हम 24 घंटे में भुगतान सत्यापित करेंगे!", goBack: "वापस जाएं", reports15: "15 रिपोर्ट", loadError: "लोड नहीं हो सका। पुनः प्रयास करें।", profileTitle: "प्रोफ़ाइल", language: "भाषा", chooseLanguage: "भाषा चुनें", userId: "यूजर ID", joined: "शामिल हुए", visaMastercard: "Visa / Mastercard", cardPayment: "कार्ड भुगतान", cardNumber: "कार्ड नंबर:", cardNote: "भुगतान टिप्पणी में अपना ID लिखें:", receiptNote: "भुगतान के बाद रसीद का स्क्रीनशॉट @studyflush_bot को भेजें", payAmount: "भुगतान करें", choosePayment: "भुगतान विधि चुनें", popular: "लोकप्रिय", allSubjects: "सभी विषय", referralSystem: "रेफरल सिस्टम", inviteFriends: "दोस्तों को आमंत्रित करें", referralDesc: "दोस्तों को आमंत्रित करें और मुफ्त रिपोर्ट पाएं! दोनों को +2 रिपोर्ट मिलती हैं।", referralCode: "आपका रेफरल कोड", copyLink: "लिंक कॉपी करें", linkCopied: "कॉपी हो गया!", invited: "आमंत्रित", bonusEarned: "बोनस प्राप्त", referralBonus: "हर आमंत्रण पर +2 रिपोर्ट", level: "स्तर", nextLevel: "अगला स्तर", achievements: "उपलब्धियां", firstReportAch: "पहला कदम", tenReportsAch: "विशेषज्ञ", fiftyReportsAch: "मास्टर", referralAch: "नेटवर्कर", accountInfo: "खाता", memberSince: "सदस्य तिथि", proTip: "प्रो टिप", proTipText: "5 दोस्तों को आमंत्रित करें और 10 मुफ्त रिपोर्ट पाएं!", reportReport: "रिपोर्ट", reportSummary: "सारांश", reportDatabase: "डेटाबेस", reportLab: "प्रयोगशाला", reportEssay: "निबंध", reportTasks: "अभ्यास", reportCourseWork: "कोर्स वर्क", reportDiploma: "डिप्लोमा", reportPresentation: "प्रस्तुति", reportTest: "परीक्षा", reportNotes: "व्याख्यान नोट्स", reportReportDesc: "विषय पर आधिकारिक रिपोर्ट", reportSummaryDesc: "विषय का संक्षिप्त सारांश", reportDatabaseDesc: "SQL टेबल और क्वेरी", reportLabDesc: "पूर्ण प्रयोगशाला कार्य", reportEssayDesc: "विस्तृत निबंध", reportTasksDesc: "समस्या समाधान", reportCourseWorkDesc: "पूर्ण कोर्स वर्क", reportDiplomaDesc: "डिप्लोमा परियोजना संरचना", reportPresentationDesc: "स्लाइड-दर-स्लाइड प्रस्तुति योजना", reportTestDesc: "परीक्षा उत्तर", reportNotesDesc: "व्याख्यान नोट्स और सारांश", eduSchool: "स्कूल", eduCollege: "कॉलेज", eduUni: "विश्वविद्यालय", eduAll: "सभी", transferDescription: "नीचे दिए गए कार्ड पर ट्रांसफर करें और पुष्टि करें", paymentAmount: "राशि", walletAddress: "वॉलेट पता", cryptoPayment: "क्रिप्टो USDT", starsDesc: "Telegram Stars से भुगतान", starsInstructions: "Stars @studyflush_bot को भेजें और पुष्टि करें।", supportContact: "सहायता", choosePaymentMethod: "भुगतान विधियां", currentBalance: "वर्तमान बैलेंस", paymentSent: "मैंने भुगतान किया", paymentNote: "एडमिन सत्यापन के बाद बैलेंस जमा होगा। आमतौर पर 1-24 घंटे।", noHistory: "कोई रिपोर्ट नहीं", noHistoryDesc: "यहां देखने के लिए पहली रिपोर्ट बनाएं", progress: "प्रगति", lengthShort: "छोटा", lengthMedium: "मध्यम", lengthFull: "पूर्ण", lengthShortDesc: "~500 शब्द", lengthMediumDesc: "~1500 शब्द", lengthFullDesc: "~3000 शब्द", reportLength: "रिपोर्ट की लंबाई", estimatedTime: "अनुमानित समय", estimatedWords: "शब्द", seconds: "सेकंड", repeatReport: "दोहराएं", shareReport: "साझा करें", shareText: "StudyFlush Bot से बनाया गया", recentSubjects: "हाल के", continueWith: "जारी रखें", shareWithFriend: "दोस्त के साथ साझा करें", referralStep1: "अपना लिंक दोस्त को भेजें", referralStep2: "दोस्त अपनी पहली रिपोर्ट बनाता है", referralStep3: "दोनों को +2 रिपोर्ट मिलती हैं!", yourReward: "आपको मिलेगा", friendReward: "दोस्त को मिलेगा", howItWorks: "यह कैसे काम करता है", sendInvite: "Telegram से आमंत्रण भेजें", friendsJoined: "दोस्त शामिल हुए", earnedReports: "रिपोर्ट अर्जित", cardPaymentDesc: "कार्ड पर 250 UAH ट्रांसफर करें और स्क्रीनशॉट भेजें", cryptoPaymentDesc: "TRC-20 नेटवर्क से 5 USDT भेजें", starsPaymentDesc: "Telegram से तत्काल भुगतान", sendScreenshot: "भुगतान के बाद स्क्रीनशॉट @studyflush_bot को भेजें", sendScreenshotCrypto: "ट्रांसफर के बाद स्क्रीनशॉट @studyflush_bot को भेजें", paymentVerification: "एडमिन द्वारा मैनुअल सत्यापन", payStep1Card: "कार्ड पर 250 UAH ट्रांसफर करें", payStep2Card: "भुगतान स्क्रीनशॉट अपलोड करें", payStep3Card: "एडमिन सत्यापित करेगा और 15 रिपोर्ट देगा", payStep1Crypto: "पते पर 5 USDT (TRC-20) भेजें", payStep2Crypto: "ट्रांजैक्शन स्क्रीनशॉट अपलोड करें", payStep3Crypto: "एडमिन सत्यापित करेगा और 15 रिपोर्ट देगा", adminWillCheck: "एडमिन आपके भुगतान को मैनुअली सत्यापित करेगा", uahOnly: "केवल यूक्रेन", uploadScreenshot: "स्क्रीनशॉट अपलोड करें", uploadScreenshotDesc: "अपने भुगतान का स्क्रीनशॉट संलग्न करें", screenshotUploaded: "स्क्रीनशॉट संलग्न ✓", changeScreenshot: "बदलें", screenshotRequired: "कृपया भुगतान स्क्रीनशॉट संलग्न करें", submitting: "भेजा जा रहा है...", paymentSubmitted: "अनुरोध भेजा गया!", paymentSubmittedDesc: "एडमिन 1-24 घंटे में भुगतान सत्यापित करेगा और बैलेंस जमा करेगा।", adminReviewing: "समीक्षा में", searchReports: "रिपोर्ट खोजें...", settings: "सेटिंग्स", support: "सहायता", shareApp: "ऐप साझा करें", shareAppDesc: "दोस्तों को StudyFlush के बारे में बताएं", rateBot: "बॉट रेट करें", rateBotDesc: "Telegram पर समीक्षा छोड़ें", about: "के बारे में", version: "संस्करण", speedAch: "स्पीड रनर", hundredReportsAch: "लीजेंड", genTip1: "AI आपके विषय का विश्लेषण कर रहा है...", genTip2: "दस्तावेज़ संरचना बना रहा है...", genTip3: "सामग्री अनुभाग बना रहा है...", genTip4: "संदर्भ और स्रोत जोड़ रहा है...", genTip5: "फॉर्मेटिंग और पॉलिशिंग...", genTip6: "लगभग तैयार!", supportTitle: "सहायता", supportDesc: "अपनी समस्या बताएं और हम मदद करेंगे", supportFormTitle: "हमसे संपर्क करें", supportFormDesc: "आपका संदेश एडमिन को भेजा जाएगा", supportCategory: "श्रेणी", supportCatPayment: "भुगतान", supportCatGeneration: "जनरेशन", supportCatBug: "बग", supportCatFeature: "विचार", supportCatOther: "अन्य", supportMessageLabel: "आपका संदेश", supportMessagePlaceholder: "अपनी समस्या या प्रश्न विस्तार से बताएं...", supportSend: "भेजें", supportSent: "संदेश भेजा गया!", supportSentDesc: "हमें आपका अनुरोध मिल गया। एडमिन 24 घंटे में जवाब देगा।", supportInfo: "सहायता कैसे काम करती है", supportResponseTime: "प्रतिक्रिया समय: आमतौर पर 1-24 घंटे", supportBotNote: "आप @studyflush_bot को सीधे भी लिख सकते हैं", supportViaTelegram: "Telegram में बॉट खोलें" };
translations.hi = hi;

const ar: TranslationKeys = { appName: "StudyFlush", welcome: "مرحبا", subtitle: "مساعدك الذكي للدراسة", yourBalance: "رصيدك", reportsAvailable: "متاح", report1: "تقرير", reports2_4: "تقارير", reports5: "تقارير", firstReportFree: "التقرير الأول مجاني!", newReport: "تقرير جديد", generateAI: "إنشاء بالذكاء الاصطناعي", history: "السجل", myReports: "تقاريري", topUp: "شحن", buyReports: "شراء تقارير", stats: "إحصائيات", quickStart: "بداية سريعة", quickStartDesc: "اختر نوع المستند والمادة والموضوع — سيقوم الذكاء الاصطناعي بكل شيء في 10-30 ثانية!", createReport: "إنشاء تقرير", home: "الرئيسية", create: "إنشاء", letsGo: "هيا نبدأ", balance: "الرصيد", profile: "الملف الشخصي", newDocument: "مستند جديد", chooseDocType: "اختر نوع المستند", subject: "المادة", chooseSubject: "اختر المادة", chooseCategory: "اختر الفئة", details: "التفاصيل", describeTask: "صف ما تحتاجه", topicLabel: "الموضوع / المهمة *", topicPlaceholder: "مثال: عمل مختبري بايثون — خوارزمية الفرز الفقاعي", groupLabel: "المجموعة / الصف", groupPlaceholder: "مثال: IT-21 (اختياري)", attachPhoto: "إرفاق صورة", attachPhotoDesc: "صورة المهمة من الكتاب", photoAttached: "تم إرفاق الصورة", removePhoto: "إزالة", maxFileSize: "حد أقصى 5 ميجابايت، JPG/PNG", generate: "إنشاء", generating: "جاري الإنشاء...", generatingDesc: "الذكاء الاصطناعي يعمل على مهمتك. عادة يستغرق 10-30 ثانية", done: "تم!", docGenerated: "تم إنشاء مستندك", copy: "نسخ", newOne: "جديد", error: "خطأ", tryAgain: "حاول مرة أخرى", noBalance: "لا يوجد رصيد كاف", topUpBalance: "شحن الرصيد", connectionError: "خطأ في الاتصال. حاول مرة أخرى.", back: "رجوع", reportsGenerated: "مستندات تم إنشاؤها", docsHere: "ستظهر مستنداتك هنا", noReportsYet: "لا توجد تقارير بعد.", createFirst: "أنشئ الأول!", copyText: "نسخ النص", contentUnavailable: "المحتوى غير متاح", manageReports: "إدارة تقاريرك", availableReports: "تقارير متاحة", total: "المجموع", freeReport: "+1 مجاني", crypto: "كريبتو", cryptoDesc: "USDT / USDC (TRC-20)", telegramStars: "Telegram Stars", payViaTelegram: "الدفع عبر تيليجرام", important: "مهم!", iPaid: "لقد دفعت", cryptoAddress: "العنوان (TRC-20):", cryptoNote: "بعد التحويل، أرسل هاش المعاملة إلى الدعم", starsNote: "للدفع بـ Telegram Stars، أرسل الأمر للبوت:", starsCmd: "أو اضغط 'شراء' في قائمة البوت", payInBot: "الدفع في البوت", thankYou: "شكراً!", paymentPending: "سنتحقق من الدفع خلال 24 ساعة!", goBack: "رجوع", reports15: "15 تقرير", loadError: "فشل التحميل. حاول مرة أخرى.", profileTitle: "الملف الشخصي", language: "اللغة", chooseLanguage: "اختر اللغة", userId: "معرف المستخدم", joined: "تاريخ الانضمام", visaMastercard: "Visa / Mastercard", cardPayment: "الدفع بالبطاقة", cardNumber: "رقم البطاقة:", cardNote: "اكتب معرفك في تعليق الدفع:", receiptNote: "بعد الدفع أرسل لقطة شاشة الإيصال إلى @studyflush_bot", payAmount: "ادفع", choosePayment: "اختر طريقة الدفع", popular: "شائع", allSubjects: "جميع المواد", referralSystem: "نظام الإحالة", inviteFriends: "دعوة الأصدقاء", referralDesc: "ادعُ أصدقاءك واحصل على تقارير مجانية! كلاكما يحصل على +2 تقارير.", referralCode: "رمز الإحالة الخاص بك", copyLink: "نسخ الرابط", linkCopied: "تم النسخ!", invited: "تمت الدعوة", bonusEarned: "تم الحصول على المكافأة", referralBonus: "+2 تقارير لكل دعوة", level: "المستوى", nextLevel: "المستوى التالي", achievements: "الإنجازات", firstReportAch: "الخطوة الأولى", tenReportsAch: "خبير", fiftyReportsAch: "محترف", referralAch: "شبكة علاقات", accountInfo: "الحساب", memberSince: "عضو منذ", proTip: "نصيحة", proTipText: "ادعُ 5 أصدقاء للحصول على 10 تقارير مجانية!", reportReport: "تقرير", reportSummary: "ملخص", reportDatabase: "قاعدة بيانات", reportLab: "عمل مختبري", reportEssay: "مقال", reportTasks: "تمارين", reportCourseWork: "عمل مقرر", reportDiploma: "مشروع تخرج", reportPresentation: "عرض تقديمي", reportTest: "اختبار", reportNotes: "ملاحظات محاضرة", reportReportDesc: "تقرير رسمي حول موضوع", reportSummaryDesc: "ملخص موجز لموضوع", reportDatabaseDesc: "جداول واستعلامات SQL", reportLabDesc: "عمل مختبري كامل", reportEssayDesc: "مقال مفصل", reportTasksDesc: "حل المسائل", reportCourseWorkDesc: "عمل مقرر كامل", reportDiplomaDesc: "هيكل مشروع التخرج", reportPresentationDesc: "خطة عرض تقديمي شريحة بشريحة", reportTestDesc: "إجابات اختبار / امتحان", reportNotesDesc: "ملاحظات محاضرة وملخصات", eduSchool: "مدرسة", eduCollege: "كلية", eduUni: "جامعة", eduAll: "الكل", transferDescription: "حوّل إلى البطاقة أدناه واضغط تأكيد", paymentAmount: "المبلغ", walletAddress: "عنوان المحفظة", cryptoPayment: "كريبتو USDT", starsDesc: "الدفع عبر Telegram Stars", starsInstructions: "أرسل Stars إلى @studyflush_bot واضغط تأكيد.", supportContact: "الدعم", choosePaymentMethod: "طرق الدفع", currentBalance: "الرصيد الحالي", paymentSent: "لقد دفعت", paymentNote: "بعد تحقق المسؤول سيتم شحن رصيدك. عادة 1-24 ساعة.", noHistory: "لا توجد تقارير", noHistoryDesc: "أنشئ أول تقرير لرؤيته هنا", progress: "التقدم", lengthShort: "قصير", lengthMedium: "متوسط", lengthFull: "كامل", lengthShortDesc: "~500 كلمة", lengthMediumDesc: "~1500 كلمة", lengthFullDesc: "~3000 كلمة", reportLength: "طول التقرير", estimatedTime: "الوقت المقدر", estimatedWords: "كلمة", seconds: "ثانية", repeatReport: "تكرار", shareReport: "مشاركة", shareText: "تم الإنشاء بواسطة StudyFlush Bot", recentSubjects: "الأخيرة", continueWith: "متابعة", shareWithFriend: "شارك مع صديق", referralStep1: "أرسل رابطك لصديق", referralStep2: "الصديق ينشئ أول تقرير", referralStep3: "كلاكما يحصل على +2 تقارير!", yourReward: "أنت تحصل على", friendReward: "الصديق يحصل على", howItWorks: "كيف يعمل", sendInvite: "إرسال دعوة عبر تيليجرام", friendsJoined: "أصدقاء انضموا", earnedReports: "تقارير مكتسبة", cardPaymentDesc: "حوّل 250 UAH إلى البطاقة وأرسل لقطة شاشة", cryptoPaymentDesc: "أرسل 5 USDT عبر شبكة TRC-20", starsPaymentDesc: "دفع فوري عبر تيليجرام", sendScreenshot: "بعد الدفع أرسل لقطة شاشة إلى @studyflush_bot", sendScreenshotCrypto: "بعد التحويل أرسل لقطة شاشة إلى @studyflush_bot", paymentVerification: "تحقق يدوي بواسطة المسؤول", payStep1Card: "حوّل 250 UAH إلى البطاقة", payStep2Card: "ارفع لقطة شاشة الدفع", payStep3Card: "المسؤول يتحقق ويضيف 15 تقرير", payStep1Crypto: "أرسل 5 USDT (TRC-20) إلى العنوان", payStep2Crypto: "ارفع لقطة شاشة المعاملة", payStep3Crypto: "المسؤول يتحقق ويضيف 15 تقرير", adminWillCheck: "المسؤول سيتحقق من دفعتك يدوياً", uahOnly: "أوكرانيا فقط", uploadScreenshot: "رفع لقطة شاشة", uploadScreenshotDesc: "أرفق لقطة شاشة الدفع", screenshotUploaded: "تم إرفاق لقطة الشاشة ✓", changeScreenshot: "تغيير", screenshotRequired: "يرجى إرفاق لقطة شاشة الدفع", submitting: "جاري الإرسال...", paymentSubmitted: "تم إرسال الطلب!", paymentSubmittedDesc: "المسؤول سيتحقق من الدفع ويشحن الرصيد خلال 1-24 ساعة.", adminReviewing: "قيد المراجعة", searchReports: "بحث في التقارير...", settings: "الإعدادات", support: "الدعم", shareApp: "مشاركة التطبيق", shareAppDesc: "أخبر أصدقاءك عن StudyFlush", rateBot: "تقييم البوت", rateBotDesc: "اترك تقييماً على تيليجرام", about: "حول", version: "الإصدار", speedAch: "سريع البرق", hundredReportsAch: "أسطورة", genTip1: "الذكاء الاصطناعي يحلل موضوعك...", genTip2: "بناء هيكل المستند...", genTip3: "إنشاء أقسام المحتوى...", genTip4: "إضافة المراجع والمصادر...", genTip5: "التنسيق والتلميع...", genTip6: "شبه جاهز!", supportTitle: "الدعم", supportDesc: "صف مشكلتك وسنساعدك", supportFormTitle: "اتصل بنا", supportFormDesc: "سيتم إرسال رسالتك إلى المسؤول", supportCategory: "الفئة", supportCatPayment: "الدفع", supportCatGeneration: "الإنشاء", supportCatBug: "خطأ", supportCatFeature: "فكرة", supportCatOther: "أخرى", supportMessageLabel: "رسالتك", supportMessagePlaceholder: "صف مشكلتك أو سؤالك بالتفصيل...", supportSend: "إرسال", supportSent: "تم إرسال الرسالة!", supportSentDesc: "تم استلام طلبك. المسؤول سيرد خلال 24 ساعة.", supportInfo: "كيف يعمل الدعم", supportResponseTime: "وقت الرد: عادة 1-24 ساعة", supportBotNote: "يمكنك أيضاً مراسلة @studyflush_bot مباشرة", supportViaTelegram: "فتح البوت في تيليجرام" };
translations.ar = ar;

const be: TranslationKeys = { ...translations.ru, welcome: "Прывітанне", subtitle: "Твой разумны памочнік у вучобе", home: "Галоўная", profile: "Профіль", history: "Гісторыя", settings: "Налады", language: "Мова", chooseLanguage: "Абярыце мову", back: "Назад", create: "Стварыць", generate: "Згенераваць", generating: "Генерацыя...", done: "Гатова!", error: "Памылка", tryAgain: "Паспрабаваць яшчэ", copy: "Капіраваць", newOne: "Новы", support: "Падтрымка", about: "Пра дадатак", version: "Версія", achievements: "Дасягненні", level: "Узровень", nextLevel: "Наступны ўзровень" };
translations.be = be;

const ro: TranslationKeys = { ...translations.en, welcome: "Bună", subtitle: "Asistentul tău inteligent de studiu", home: "Acasă", profile: "Profil", history: "Istoric", settings: "Setări", language: "Limbă", chooseLanguage: "Alegeți limba", back: "Înapoi", create: "Creează", generate: "Generează", generating: "Se generează...", done: "Gata!", error: "Eroare", tryAgain: "Încearcă din nou", copy: "Copiază", newOne: "Nou", support: "Suport", about: "Despre", version: "Versiune", achievements: "Realizări", level: "Nivel", nextLevel: "Nivelul următor", newReport: "Raport nou", generateAI: "Generează cu AI", myReports: "Rapoartele mele", topUp: "Încarcă", buyReports: "Cumpără rapoarte", stats: "Statistici", quickStart: "Start rapid", balance: "Sold", subject: "Materie", details: "Detalii" };
translations.ro = ro;

const cs: TranslationKeys = { ...translations.en, welcome: "Ahoj", subtitle: "Tvůj chytrý studijní asistent", home: "Domů", profile: "Profil", history: "Historie", settings: "Nastavení", language: "Jazyk", chooseLanguage: "Vyberte jazyk", back: "Zpět", create: "Vytvořit", generate: "Generovat", generating: "Generování...", done: "Hotovo!", error: "Chyba", tryAgain: "Zkusit znovu", copy: "Kopírovat", newOne: "Nový", support: "Podpora", about: "O aplikaci", version: "Verze", achievements: "Úspěchy", level: "Úroveň", nextLevel: "Další úroveň", newReport: "Nová zpráva", generateAI: "Generovat s AI", myReports: "Mé zprávy", topUp: "Dobít", buyReports: "Koupit zprávy", stats: "Statistiky", quickStart: "Rychlý start", balance: "Zůstatek", subject: "Předmět", details: "Podrobnosti" };
translations.cs = cs;

const bg: TranslationKeys = { ...translations.ru, welcome: "Здравей", subtitle: "Твоят умен помощник за учене", home: "Начало", profile: "Профил", history: "История", settings: "Настройки", language: "Език", chooseLanguage: "Изберете език", back: "Назад", create: "Създай", generate: "Генерирай", generating: "Генериране...", done: "Готово!", error: "Грешка", tryAgain: "Опитай отново", copy: "Копирай", newOne: "Нов", support: "Поддръжка", about: "За приложението", version: "Версия", achievements: "Постижения", level: "Ниво", nextLevel: "Следващо ниво" };
translations.bg = bg;

const sr: TranslationKeys = { ...translations.ru, welcome: "Здраво", subtitle: "Твој паметни помоћник за учење", home: "Почетна", profile: "Профил", history: "Историја", settings: "Подешавања", language: "Језик", chooseLanguage: "Изаберите језик", back: "Назад", create: "Направи", generate: "Генериши", generating: "Генерисање...", done: "Готово!", error: "Грешка", tryAgain: "Покушај поново", copy: "Копирај", newOne: "Ново", support: "Подршка", about: "О апликацији", version: "Верзија", achievements: "Достигнућа", level: "Ниво", nextLevel: "Следећи ниво" };
translations.sr = sr;

const hr: TranslationKeys = { ...translations.en, welcome: "Bok", subtitle: "Tvoj pametni asistent za učenje", home: "Početna", profile: "Profil", history: "Povijest", settings: "Postavke", language: "Jezik", chooseLanguage: "Odaberite jezik", back: "Natrag", create: "Stvori", generate: "Generiraj", generating: "Generiranje...", done: "Gotovo!", error: "Greška", tryAgain: "Pokušaj ponovno", copy: "Kopiraj", newOne: "Novo", support: "Podrška", about: "O aplikaciji", version: "Verzija", achievements: "Postignuća", level: "Razina", nextLevel: "Sljedeća razina", newReport: "Novi izvještaj", generateAI: "Generiraj s AI", myReports: "Moji izvještaji", topUp: "Nadoplati", buyReports: "Kupi izvještaje", stats: "Statistika", quickStart: "Brzi početak", balance: "Stanje", subject: "Predmet", details: "Detalji" };
translations.hr = hr;

const md: TranslationKeys = { ...translations.ro };
translations.md = md;

const mn: TranslationKeys = { ...translations.ru, welcome: "Сайн уу", subtitle: "Таны ухаалаг сурах туслах", home: "Нүүр", profile: "Профайл", history: "Түүх", settings: "Тохиргоо", language: "Хэл", chooseLanguage: "Хэл сонгоно уу", back: "Буцах", create: "Үүсгэх", generate: "Бий болгох", generating: "Үүсгэж байна...", done: "Дууссан!", error: "Алдаа", tryAgain: "Дахин оролдох", copy: "Хуулах", newOne: "Шинэ", support: "Тусламж", about: "Тухай", version: "Хувилбар" };
translations.mn = mn;

const ky: TranslationKeys = { ...translations.ru, welcome: "Салам", subtitle: "Сенин акылдуу окуу жардамчың", home: "Башкы", profile: "Профиль", history: "Тарых", settings: "Жөндөөлөр", language: "Тил", chooseLanguage: "Тилди тандаңыз", back: "Артка", create: "Түзүү", generate: "Генерациялоо", generating: "Генерацияланууда...", done: "Даяр!", error: "Ката", tryAgain: "Кайра аракет кылуу", copy: "Көчүрүү", newOne: "Жаңы", support: "Колдоо", about: "Колдонмо жөнүндө", version: "Версия" };
translations.ky = ky;

const tg: TranslationKeys = { ...translations.ru, welcome: "Салом", subtitle: "Дастёри ақлонии шумо", home: "Асосӣ", profile: "Профил", history: "Таърих", settings: "Танзимот", language: "Забон", chooseLanguage: "Забонро интихоб кунед", back: "Бозгашт", create: "Сохтан", generate: "Эҷод кардан", generating: "Дар ҳоли эҷод...", done: "Тайёр!", error: "Хато", tryAgain: "Аз нав кӯшиш кунед", copy: "Нусхабардорӣ", newOne: "Нав", support: "Дастгирӣ", about: "Дар бораи барнома", version: "Версия" };
translations.tg = tg;

const tk: TranslationKeys = { ...translations.ru, welcome: "Salam", subtitle: "Akylly okuw kömekçiň", home: "Baş sahypa", profile: "Profil", history: "Taryh", settings: "Sazlamalar", language: "Dil", chooseLanguage: "Dil saýlaň", back: "Yza", create: "Döret", generate: "Döret", generating: "Döredilýär...", done: "Taýýar!", error: "Ýalňyşlyk", tryAgain: "Täzeden synanyşyň", copy: "Göçür", newOne: "Täze", support: "Goldaw", about: "Programma hakynda", version: "Wersiýa" };
translations.tk = tk;

const az: TranslationKeys = { ...translations.tr, welcome: "Salam", subtitle: "Ağıllı tədris köməkçiniz", home: "Ana səhifə", profile: "Profil", history: "Tarix", settings: "Parametrlər", language: "Dil", chooseLanguage: "Dil seçin", back: "Geri", create: "Yarat", generate: "Yarat", generating: "Yaradılır...", done: "Hazırdır!", error: "Xəta", tryAgain: "Yenidən cəhd edin", copy: "Kopyala", newOne: "Yeni", support: "Dəstək", about: "Proqram haqqında", version: "Versiya" };
translations.az = az;

const hy: TranslationKeys = { ...translations.ru, welcome: "Ողջույն", subtitle: "Ձեր խելացի ուսումնական օգնականը", home: "Գլխավոր", profile: "Պdelays", history: "Պատdelays", settings: "Կdelays", language: "Լezu", chooseLanguage: "Ընtrիr lezu", back: "Hет", create: "Stexcel", generate: "Steghcel", generating: "Steghcvum e...", done: "Patras!", error: "Skhал", tryAgain: "Nor phordzel", copy: "Patkerel", newOne: "Nor", support: "Aajaktsutyun", about: "Tsragri masin", version: "Tarberak" };
translations.hy = hy;

const ka: TranslationKeys = { ...translations.en, welcome: "გამარჯობა", subtitle: "თქვენი ჭკვიანი სასწავლო ასისტენტი", home: "მთავარი", profile: "პროფილი", history: "ისტორია", settings: "პარამეტრები", language: "ენა", chooseLanguage: "აირჩიეთ ენა", back: "უკან", create: "შექმნა", generate: "გენერირება", generating: "გენერირდება...", done: "მzad!", error: "შეცdomা", tryAgain: "ხელaxla", copy: "კople", newOne: "ახhole", support: "მxard", about: "აplekaciis sesaxeb", version: "ვersia" };
translations.ka = ka;

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
  const saved = localStorage.getItem("studyflush_lang");
  if (saved) {
    currentLang = saved;
    return;
  }
  const tgLang = window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code;
  if (tgLang && translations[tgLang]) {
    currentLang = tgLang;
    return;
  }
  if (tgLang) {
    const mapped = Object.entries(IP_TO_LANG).find(([, v]) => v === tgLang);
    if (mapped && translations[tgLang]) {
      currentLang = tgLang;
      return;
    }
    const cisLangs = ["kk", "ky", "tg", "tk", "az", "hy", "ka", "be", "md", "mn"];
    if (cisLangs.includes(tgLang)) {
      currentLang = tgLang;
      return;
    }
    if (tgLang === "ru" || tgLang === "uk" || tgLang === "be") {
      currentLang = tgLang;
      return;
    }
  }
}

export async function detectLanguageByIP() {
  const saved = localStorage.getItem("studyflush_lang");
  if (saved) return;

  try {
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    const countryCode = data.country_code;
    if (countryCode && IP_TO_LANG[countryCode]) {
      const detected = IP_TO_LANG[countryCode];
      currentLang = detected;
      langListeners.forEach((l) => l());
    }
  } catch {}
}

export function getLang(): string {
  return currentLang;
}

export function setLang(code: string) {
  currentLang = code;
  localStorage.setItem("studyflush_lang", code);
  langListeners.forEach((l) => l());
}

export function t(key: keyof TranslationKeys): string {
  const dict = translations[currentLang] || translations["en"];
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
  { id: "school_math", icon: "📐", name: { en: "Mathematics (School)", ru: "Математика (Школа)", uk: "Математика (Школа)", tr: "Matematik (Okul)", de: "Mathematik (Schule)", fr: "Mathématiques (École)", es: "Matemáticas (Colegio)", pl: "Matematyka (Szkoła)", zh: "数学（中学）", ja: "数学（高校）", hi: "गणित (स्कूल)", ar: "الرياضيات (مدرسة)" }, subjects: [
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
  ] },
  { id: "school_ukr", icon: "🇺🇦", name: { en: "Ukrainian Language & Lit", ru: "Укр. язык и Литература", uk: "Українська мова і Література" }, subjects: [
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
  ] },
  { id: "school_science", icon: "🔬", name: { en: "Sciences (School)", ru: "Естественные (Школа)", uk: "Природничі (Школа)", tr: "Fen Bilimleri", de: "Naturwissenschaften", fr: "Sciences", es: "Ciencias", pl: "Nauki przyrodnicze" }, subjects: [
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
  ] },
  { id: "school_history", icon: "📜", name: { en: "History & Geography (School)", ru: "История и Геогр. (Школа)", uk: "Історія та Геогр. (Школа)" }, subjects: [
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
  ] },
  { id: "school_langs", icon: "🗣", name: { en: "Foreign Languages (School)", ru: "Ин. языки (Школа)", uk: "Іноземні мови (Школа)" }, subjects: [
    { id: "english_7", icon: "🇬🇧", name: { en: "English 7th", ru: "Английский 7 класс", uk: "Англійська мова 7 клас" } },
    { id: "english_8", icon: "🇬🇧", name: { en: "English 8th", ru: "Английский 8 класс", uk: "Англійська мова 8 клас" } },
    { id: "english_9", icon: "🇬🇧", name: { en: "English 9th", ru: "Английский 9 класс", uk: "Англійська мова 9 клас" } },
    { id: "english_10", icon: "🇬🇧", name: { en: "English 10th", ru: "Английский 10 класс", uk: "Англійська мова 10 клас" } },
    { id: "english_11", icon: "🇬🇧", name: { en: "English 11th", ru: "Английский 11 класс", uk: "Англійська мова 11 клас" } },
    { id: "german_school", icon: "🇩🇪", name: { en: "German (School)", ru: "Немецкий (Школа)", uk: "Німецька мова (Школа)" } },
    { id: "french_school", icon: "🇫🇷", name: { en: "French (School)", ru: "Французский (Школа)", uk: "Французька мова (Школа)" } },
    { id: "polish_school", icon: "🇵🇱", name: { en: "Polish (School)", ru: "Польский (Школа)", uk: "Польська мова (Школа)" } },
  ] },
  { id: "school_other", icon: "📚", name: { en: "Other School Subjects", ru: "Другие (Школа)", uk: "Інші предмети (Школа)" }, subjects: [
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
  ] },
  { id: "college_it", icon: "💻", name: { en: "IT & Programming (College)", ru: "IT (Колледж/ПТУ)", uk: "IT (Коледж/ПТУ)", tr: "BT (Meslek Okulu)", de: "IT (Fachschule)", fr: "Informatique (Lycée)", es: "Informática (Instituto)", pl: "IT (Technikum)" }, subjects: [
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
  ] },
  { id: "college_tech", icon: "🔧", name: { en: "Technical (College/Vocational)", ru: "Технические (Колледж/ПТУ)", uk: "Технічні (Коледж/ПТУ)" }, subjects: [
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
  ] },
  { id: "uni_math", icon: "∫", name: { en: "Mathematics (University)", ru: "Математика (Универ)", uk: "Математика (Універ)", tr: "Matematik (Üniversite)", de: "Mathematik (Uni)", fr: "Mathématiques (Université)", es: "Matemáticas (Universidad)", pl: "Matematyka (Uczelnia)" }, subjects: [
    { id: "higher_math", icon: "∫", name: { en: "Higher Mathematics", ru: "Высшая математика", uk: "Вища математика" } },
    { id: "math_analysis", icon: "∑", name: { en: "Mathematical Analysis", ru: "Математический анализ", uk: "Математичний аналіз" } },
    { id: "linear_algebra", icon: "📊", name: { en: "Linear Algebra", ru: "Линейная алгебра", uk: "Лінійна алгебра" } },
    { id: "discrete_math", icon: "🔢", name: { en: "Discrete Mathematics", ru: "Дискретная математика", uk: "Дискретна математика" } },
    { id: "statistics", icon: "📈", name: { en: "Statistics & Probability", ru: "Статистика и вероятность", uk: "Статистика та ймовірність" } },
    { id: "diff_equations", icon: "📉", name: { en: "Differential Equations", ru: "Дифференциальные уравнения", uk: "Диференціальні рівняння" } },
    { id: "num_methods", icon: "🔣", name: { en: "Numerical Methods", ru: "Численные методы", uk: "Чисельні методи" } },
    { id: "complex_analysis", icon: "🔮", name: { en: "Complex Analysis", ru: "Комплексный анализ", uk: "Комплексний аналіз" } },
  ] },
  { id: "uni_it", icon: "🖥", name: { en: "IT (University)", ru: "IT (Универ)", uk: "IT (Універ)" }, subjects: [
    { id: "prog_uni", icon: "💻", name: { en: "Programming (Uni)", ru: "Программирование (Универ)", uk: "Програмування (Універ)" } },
    { id: "ai_ml", icon: "🤖", name: { en: "AI & Machine Learning", ru: "AI и Machine Learning", uk: "AI та Machine Learning" } },
    { id: "sysadmin", icon: "🖥", name: { en: "System Administration", ru: "Системное администрирование", uk: "Системне адміністрування" } },
    { id: "devops", icon: "🚀", name: { en: "DevOps", ru: "DevOps", uk: "DevOps" } },
    { id: "db_uni", icon: "🗃", name: { en: "Databases (Uni)", ru: "Базы данных (Универ)", uk: "Бази даних (Універ)" } },
    { id: "software_eng", icon: "📦", name: { en: "Software Engineering", ru: "Программная инженерия", uk: "Програмна інженерія" } },
    { id: "computer_architecture", icon: "🧬", name: { en: "Computer Architecture", ru: "Архитектура компьютеров", uk: "Архітектура комп'ютерів" } },
    { id: "data_science", icon: "📊", name: { en: "Data Science", ru: "Data Science", uk: "Data Science" } },
  ] },
  { id: "uni_humanities", icon: "📜", name: { en: "Humanities (University)", ru: "Гуманитарные (Универ)", uk: "Гуманітарні (Універ)" }, subjects: [
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
  ] },
  { id: "uni_business", icon: "💼", name: { en: "Business & Economics (Uni)", ru: "Бизнес и Экономика (Универ)", uk: "Бізнес та Економіка (Універ)" }, subjects: [
    { id: "economics_uni", icon: "💰", name: { en: "Economics", ru: "Экономика", uk: "Економіка" } },
    { id: "management", icon: "📋", name: { en: "Management", ru: "Менеджмент", uk: "Менеджмент" } },
    { id: "marketing", icon: "📣", name: { en: "Marketing", ru: "Маркетинг", uk: "Маркетинг" } },
    { id: "accounting", icon: "🧾", name: { en: "Accounting", ru: "Бухгалтерский учёт", uk: "Бухгалтерський облік" } },
    { id: "finance", icon: "🏦", name: { en: "Finance", ru: "Финансы", uk: "Фінанси" } },
    { id: "business_plan", icon: "📑", name: { en: "Business Planning", ru: "Бизнес-планирование", uk: "Бізнес-планування" } },
    { id: "international_economics", icon: "🌐", name: { en: "International Economics", ru: "Международная экономика", uk: "Міжнародна економіка" } },
    { id: "econometrics", icon: "📉", name: { en: "Econometrics", ru: "Эконометрика", uk: "Економетрика" } },
  ] },
  { id: "uni_law", icon: "⚖️", name: { en: "Law (University)", ru: "Право (Универ)", uk: "Право (Універ)" }, subjects: [
    { id: "law_uni", icon: "⚖️", name: { en: "Law Theory", ru: "Теория права", uk: "Теорія права" } },
    { id: "constitutional_law", icon: "📜", name: { en: "Constitutional Law", ru: "Конституционное право", uk: "Конституційне право" } },
    { id: "criminal_law", icon: "🔨", name: { en: "Criminal Law", ru: "Уголовное право", uk: "Кримінальне право" } },
    { id: "civil_law", icon: "📝", name: { en: "Civil Law", ru: "Гражданское право", uk: "Цивільне право" } },
    { id: "admin_law", icon: "🏢", name: { en: "Administrative Law", ru: "Административное право", uk: "Адміністративне право" } },
    { id: "labor_law", icon: "👷", name: { en: "Labor Law", ru: "Трудовое право", uk: "Трудове право" } },
    { id: "international_law", icon: "🌐", name: { en: "International Law", ru: "Международное право", uk: "Міжнародне право" } },
  ] },
  { id: "uni_eng", icon: "🏗", name: { en: "Engineering (University)", ru: "Инженерия (Универ)", uk: "Інженерія (Універ)" }, subjects: [
    { id: "theoretical_mechanics", icon: "⚙️", name: { en: "Theoretical Mechanics", ru: "Теоретическая механика", uk: "Теоретична механіка" } },
    { id: "resistance_materials", icon: "🔩", name: { en: "Strength of Materials", ru: "Сопромат", uk: "Опір матеріалів" } },
    { id: "thermodynamics", icon: "🌡", name: { en: "Thermodynamics", ru: "Термодинамика", uk: "Термодинаміка" } },
    { id: "fluid_mechanics", icon: "💧", name: { en: "Fluid Mechanics", ru: "Гидравлика", uk: "Гідравліка" } },
    { id: "architecture", icon: "🏛", name: { en: "Architecture", ru: "Архитектура", uk: "Архітектура" } },
    { id: "construction", icon: "🏗", name: { en: "Construction", ru: "Строительство", uk: "Будівництво" } },
    { id: "eng_graphics_uni", icon: "📐", name: { en: "Eng. Graphics (Uni)", ru: "Инж. графика (Универ)", uk: "Інж. графіка (Універ)" } },
  ] },
  { id: "uni_medicine", icon: "🏥", name: { en: "Medicine (University)", ru: "Медицина (Универ)", uk: "Медицина (Універ)" }, subjects: [
    { id: "anatomy", icon: "🫀", name: { en: "Anatomy", ru: "Анатомия", uk: "Анатомія" } },
    { id: "physiology", icon: "🫁", name: { en: "Physiology", ru: "Физиология", uk: "Фізіологія" } },
    { id: "pharmacology", icon: "💊", name: { en: "Pharmacology", ru: "Фармакология", uk: "Фармакологія" } },
    { id: "histology", icon: "🔬", name: { en: "Histology", ru: "Гистология", uk: "Гістологія" } },
    { id: "microbiology", icon: "🦠", name: { en: "Microbiology", ru: "Микробиология", uk: "Мікробіологія" } },
    { id: "biochemistry", icon: "🧬", name: { en: "Biochemistry", ru: "Биохимия", uk: "Біохімія" } },
    { id: "nursing", icon: "👨‍⚕️", name: { en: "Nursing", ru: "Сестринское дело", uk: "Медсестринство" } },
    { id: "public_health", icon: "🏥", name: { en: "Public Health", ru: "Общественное здоровье", uk: "Громадське здоров'я" } },
  ] },
  { id: "other", icon: "📚", name: { en: "Other", ru: "Другое", uk: "Інше" }, subjects: [
    { id: "ecology", icon: "🌱", name: { en: "Ecology", ru: "Экология", uk: "Екологія" } },
    { id: "geography_uni", icon: "🌍", name: { en: "Geography", ru: "География", uk: "Географія" } },
    { id: "art", icon: "🎨", name: { en: "Art & Design", ru: "Искусство и Дизайн", uk: "Мистецтво та Дизайн" } },
    { id: "music", icon: "🎵", name: { en: "Music", ru: "Музыка", uk: "Музика" } },
    { id: "physical_ed_uni", icon: "🏃", name: { en: "Physical Education", ru: "Физкультура", uk: "Фізкультура" } },
    { id: "bzd", icon: "🛡", name: { en: "Safety of Life", ru: "БЖД", uk: "БЖД (Безпека життєдіяльності)" } },
    { id: "other", icon: "📚", name: { en: "Other", ru: "Другое", uk: "Інше" } },
  ] },
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
  const lang = currentLang;
  const levels = [
    { min: 0, max: 5, icon: "🌱", color: "from-green-400 to-emerald-500",
      name: { en: "Beginner", ru: "Новичок", uk: "Початківець", tr: "Başlangıç", de: "Anfänger", fr: "Débutant", es: "Principiante", pl: "Początkujący", zh: "初学者", ja: "初心者", hi: "शुरुआती", ar: "مبتدئ" } as Record<string, string> },
    { min: 6, max: 20, icon: "📚", color: "from-blue-400 to-blue-600",
      name: { en: "Student", ru: "Студент", uk: "Студент", tr: "Öğrenci", de: "Student", fr: "Étudiant", es: "Estudiante", pl: "Student", zh: "学生", ja: "学生", hi: "छात्र", ar: "طالب" } as Record<string, string> },
    { min: 21, max: 50, icon: "🎓", color: "from-violet-400 to-purple-600",
      name: { en: "Expert", ru: "Эксперт", uk: "Експерт", tr: "Uzman", de: "Experte", fr: "Expert", es: "Experto", pl: "Ekspert", zh: "专家", ja: "エキスパート", hi: "विशेषज्ञ", ar: "خبير" } as Record<string, string> },
    { min: 51, max: 100, icon: "🏆", color: "from-amber-400 to-orange-600",
      name: { en: "Master", ru: "Мастер", uk: "Майстер", tr: "Usta", de: "Meister", fr: "Maître", es: "Maestro", pl: "Mistrz", zh: "大师", ja: "マスター", hi: "मास्टर", ar: "محترف" } as Record<string, string> },
    { min: 101, max: 999999, icon: "👑", color: "from-yellow-300 to-amber-500",
      name: { en: "Legend", ru: "Легенда", uk: "Легенда", tr: "Efsane", de: "Legende", fr: "Légende", es: "Leyenda", pl: "Legenda", zh: "传奇", ja: "レジェンド", hi: "लीजेंड", ar: "أسطورة" } as Record<string, string> },
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
