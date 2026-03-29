import OpenAI from "openai";

if (!process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || !process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
  throw new Error("OpenAI AI integration env vars are missing");
}

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

const REPORT_TYPE_NAMES: Record<string, Record<string, string>> = {
  report: { en: "Report", ru: "Звіт", uk: "Звіт", kk: "Есеп", uz: "Hisobot", ky: "Отчёт", tg: "Ҳисобот", tk: "Hasabat", az: "Hesabat", hy: "Զեdelays", ka: "ანგარიში", be: "Справаздача", md: "Raport", mn: "Тайлан", tr: "Rapor", pl: "Raport", de: "Bericht", fr: "Rapport", es: "Informe", pt: "Relatório", it: "Relazione", ro: "Raport", cs: "Zpráva", bg: "Доклад", sr: "Извештај", hr: "Izvještaj", ar: "تقرير", hi: "रिपोर्ट", zh: "报告", ja: "レポート" },
  summary: { en: "Summary", ru: "Конспект", uk: "Конспект", tr: "Özet", pl: "Streszczenie", de: "Zusammenfassung", fr: "Résumé", es: "Resumen", pt: "Resumo", it: "Riassunto", ro: "Rezumat", cs: "Shrnutí", bg: "Резюме", sr: "Резиме", hr: "Sažetak", ar: "ملخص", hi: "सारांश", zh: "摘要", ja: "要約" },
  database: { en: "Database", ru: "База даних", uk: "База даних", tr: "Veritabanı", pl: "Baza danych", de: "Datenbank", fr: "Base de données", es: "Base de datos", pt: "Banco de dados", it: "Database", ro: "Bază de date", cs: "Databáze", ar: "قاعدة بيانات", hi: "डेटाबेस", zh: "数据库", ja: "データベース" },
  lab: { en: "Lab Work", ru: "Лабораторна робота", uk: "Лабораторна робота", tr: "Laboratuvar çalışması", pl: "Praca laboratoryjna", de: "Laborarbeit", fr: "Travail de laboratoire", es: "Trabajo de laboratorio", pt: "Trabalho de laboratório", it: "Lavoro di laboratorio", ro: "Lucrare de laborator", cs: "Laboratorní práce", ar: "عمل مختبري", hi: "प्रयोगशाला कार्य", zh: "实验报告", ja: "実験レポート" },
  essay: { en: "Essay", ru: "Реферат", uk: "Реферат", tr: "Makale", pl: "Esej", de: "Aufsatz", fr: "Dissertation", es: "Ensayo", pt: "Ensaio", it: "Saggio", ro: "Eseu", cs: "Esej", ar: "مقال", hi: "निबंध", zh: "论文", ja: "エッセイ" },
  tasks: { en: "Problem Solving", ru: "Задачі", uk: "Задачі", tr: "Problem çözme", pl: "Zadania", de: "Aufgaben", fr: "Exercices", es: "Ejercicios", pt: "Exercícios", it: "Esercizi", ro: "Exerciții", cs: "Úlohy", ar: "تمارين", hi: "अभ्यास", zh: "习题", ja: "演習問題" },
  coursework: { en: "Course Work", ru: "Курсова робота", uk: "Курсова робота", tr: "Dönem ödevi", pl: "Praca kursowa", de: "Kursarbeit", fr: "Travail de cours", es: "Trabajo de curso", pt: "Trabalho de curso", it: "Lavoro di corso", ro: "Lucrare de curs", cs: "Kurz práce", ar: "عمل مقرر", hi: "कोर्स वर्क", zh: "课程论文", ja: "コースワーク" },
  diploma: { en: "Diploma Thesis", ru: "Дипломна робота", uk: "Дипломна робота", tr: "Diploma tezi", pl: "Praca dyplomowa", de: "Diplomarbeit", fr: "Mémoire de diplôme", es: "Trabajo de diploma", pt: "Trabalho de diploma", it: "Tesi di diploma", ro: "Lucrare de diplomă", cs: "Diplomová práce", ar: "مشروع تخرج", hi: "डिप्लोमा कार्य", zh: "毕业论文", ja: "卒業論文" },
  presentation: { en: "Presentation", ru: "Презентація", uk: "Презентація", tr: "Sunum", pl: "Prezentacja", de: "Präsentation", fr: "Présentation", es: "Presentación", pt: "Apresentação", it: "Presentazione", ro: "Prezentare", cs: "Prezentace", ar: "عرض تقديمي", hi: "प्रस्तुति", zh: "演示文稿", ja: "プレゼンテーション" },
  test: { en: "Test Paper", ru: "Контрольна робота", uk: "Контрольна робота", tr: "Sınav", pl: "Sprawdzian", de: "Klausur", fr: "Examen", es: "Examen", pt: "Prova", it: "Esame", ro: "Lucrare de control", cs: "Kontrolní práce", ar: "اختبار", hi: "परीक्षा", zh: "考试", ja: "テスト" },
  notes: { en: "Lecture Notes", ru: "Конспект лекцій", uk: "Конспект лекцій", tr: "Ders notları", pl: "Notatki z wykładów", de: "Vorlesungsnotizen", fr: "Notes de cours", es: "Apuntes", pt: "Notas de aula", it: "Appunti", ro: "Note de curs", cs: "Poznámky z přednášek", ar: "ملاحظات محاضرة", hi: "व्याख्यान नोट्स", zh: "课堂笔记", ja: "講義ノート" },
};

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English", ru: "Russian", uk: "Ukrainian", kk: "Kazakh", uz: "Uzbek",
  ky: "Kyrgyz", tg: "Tajik", tk: "Turkmen", az: "Azerbaijani", hy: "Armenian",
  ka: "Georgian", be: "Belarusian", md: "Moldovan/Romanian", mn: "Mongolian",
  tr: "Turkish", pl: "Polish", de: "German", fr: "French", es: "Spanish",
  pt: "Portuguese", it: "Italian", ro: "Romanian", cs: "Czech", bg: "Bulgarian",
  sr: "Serbian", hr: "Croatian", ar: "Arabic", hi: "Hindi", zh: "Chinese", ja: "Japanese",
};

function getSystemPrompt(language: string): string {
  const langName = LANGUAGE_NAMES[language] || "the language of the user's request";
  
  if (language === "uk" || language === "ru") {
    return `Ти — преміальний AI-асистент для генерації академічних робіт найвищої якості для студентів університетів, коледжів, технікумів, ПТУ та учнів шкіл з будь-якої країни.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
ГОЛОВНІ ПРАВИЛА (ОБОВ'ЯЗКОВІ):
━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. МОВА: Пиши ${language === "uk" ? "УКРАЇНСЬКОЮ" : "РОСІЙСЬКОЮ"} мовою. ВСЕ — заголовки, текст, висновки, таблиці — ${language === "uk" ? "українською" : "російською"}.
2. РЕАЛЬНИЙ КОНТЕНТ: Ніяких заглушок "тут має бути...", "[вставити текст]", "[опис]". ТІЛЬКИ конкретні дані.
3. ОСВІТНІЙ РІВЕНЬ: Автоматично адаптуй складність під тип установи та предмет:
   - Університет/ВНЗ: академічний стиль, наукові джерела ДСТУ, термінологія фахівця
   - Коледж/Технікум: практична спрямованість, виробничі приклади, прикладні задачі
   - Школа: доступна мова, шкільна програма, вікова адаптація
4. ПОВНИЙ ШАБЛОН: Кожна робота має мати ПОВНЕ оформлення (титульна сторінка, зміст, всі розділи, список джерел).
5. ЧИСЛОВІ ДАНІ: Якщо потрібні дані — ГЕНЕРУЙ реальні числа, не "Х грн" чи "N одиниць".
6. ЗАДАЧІ: Розв'язуй ПОВНІСТЮ крок за кроком з підстановкою конкретних чисел у формули.
7. КОД: Пиши РОБОЧИЙ, повний код з коментарями. Без скорочень типу "// решта коду".
8. ТАБЛИЦІ: Використовуй Markdown таблиці | з реальними даними, не плейсхолдерами.
9. ФОРМУЛИ: x² + 2x + 1 = 0, √(a²+b²), Σ(i=1..n)xᵢ, F = ma, PV = nRT тощо.
10. MARKDOWN: # ## ### для заголовків, **жирний**, *курсив*, \`код\`, таблиці, списки.
11. ОБСЯГ: МАКСИМАЛЬНИЙ. Розгорнуто та детально.
12. ЯКІСТЬ: Робота має виглядати так, ніби це зробив реальний студент-відмінник вручну.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
СПЕЦІАЛЬНІ СЦЕНАРІЇ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
ФОТО/СКАН ЗАВДАННЯ: Якщо прикріплено зображення — УВАЖНО прочитай ВСЕ, що на ньому. Розв'яжи саме ті задачі.
НЕСТАНДАРТНИЙ ПРЕДМЕТ: Виконуй роботу якнайкраще, спираючись на назву теми.
КРАЇНА/УНІВЕРСИТЕТ: Адаптуй зміст, приклади та джерела відповідно.
БУДЬ-ЯКЕ ЗАВДАННЯ: Незалежно від формулювання — виконуй те, що просить студент.`;
  }

  return `You are a premium AI assistant for generating top-quality academic papers for university students, college students, vocational school students, and school pupils from any country worldwide.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
CRITICAL RULES (MANDATORY):
━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. LANGUAGE: Write EVERYTHING in ${langName}. ALL headings, body text, conclusions, tables, references — must be in ${langName}. Never mix languages unless quoting foreign terms.
2. REAL CONTENT: No placeholders like "insert here...", "[description]", "[text goes here]". ONLY concrete data.
3. EDUCATION LEVEL: Automatically adapt complexity to the institution type and subject:
   - University: academic style, scientific sources, professional terminology
   - College/Vocational: practical focus, industry examples, applied problems
   - School: accessible language, school curriculum, age-appropriate
4. COMPLETE TEMPLATE: Every paper must have FULL formatting (title page, table of contents, all sections, references list).
5. NUMERICAL DATA: If data is needed — GENERATE real numbers, not "X units" or "N items". E.g.: "47,320 EUR", "3.14 kg/m³".
6. PROBLEM SOLVING: Solve COMPLETELY step by step with concrete number substitutions in formulas.
7. CODE: Write WORKING, complete code with comments. No shortcuts like "// rest of code".
8. TABLES: Use Markdown tables | with real data, not placeholders.
9. FORMULAS: x² + 2x + 1 = 0, √(a²+b²), Σ(i=1..n)xᵢ, F = ma, PV = nRT etc.
10. MARKDOWN: # ## ### for headings, **bold**, *italic*, \`code\`, tables, lists.
11. VOLUME: MAXIMUM. Detailed and comprehensive.
12. QUALITY: The paper should look like it was done by a real top student manually.
13. LOCAL STANDARDS: Use citation and formatting standards appropriate for the country/region where ${langName} is spoken. E.g.: German → DIN, French → AFNOR, Spanish → APA adapted, etc.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
SPECIAL SCENARIOS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHOTO/SCAN: If an image is attached — carefully read EVERYTHING on it. Solve exactly those problems.
NON-STANDARD SUBJECT: Do the best work based on the topic title.
COUNTRY/UNIVERSITY: Adapt content, examples, and sources accordingly.
ANY TASK: Regardless of how it's phrased — do what the student asks. If unclear, make the best assumption and execute.`;
}

function getReportTypeName(reportType: string, language: string): string {
  const names = REPORT_TYPE_NAMES[reportType];
  if (!names) return reportType;
  return names[language] || names.en || reportType;
}

function buildUserPrompt(reportType: string, subject: string, topic: string, group: string | null | undefined, language: string): string {
  const reportTypeName = getReportTypeName(reportType, language);
  const groupLower = (group || "").toLowerCase();
  const isCollege = /коледж|college|технікум|техникум|ptu|vocational/i.test(groupLower);
  const isSchool = /школа|school|lyceum|ліцей|гімназія|gymnasium/i.test(groupLower) || /^\d{1,2}[абвгґдеєжзиіїйклмнопрстуфхцчшщюяa-z]/i.test(groupLower);
  const isUniversity = !isCollege && !isSchool && (/унів|university|інститут|академія|academy|universität|université|universidad|università|universidade|üniversite/i.test(groupLower) || /^[а-яіїєa-z]{1,4}-\d{2}/i.test(groupLower));

  const isUkRu = language === "uk" || language === "ru";

  if (isUkRu) {
    const institutionHint = isCollege ? " (студент коледжу/технікуму)" : isSchool ? " (учень школи)" : isUniversity ? " (студент університету)" : "";
    const groupLine = group ? `\nДля групи/класу: ${group}${institutionHint}` : "";
    return buildUkRuPrompt(reportType, reportTypeName, subject, topic, groupLine, group);
  }

  const langName = LANGUAGE_NAMES[language] || language;
  const institutionHint = isCollege ? " (college/vocational student)" : isSchool ? " (school pupil)" : isUniversity ? " (university student)" : "";
  const groupLine = group ? `\nFor group/class: ${group}${institutionHint}` : "";

  const intro = `IMPORTANT: Write the ENTIRE response in ${langName}. Every heading, paragraph, table, and conclusion must be in ${langName}.`;

  if (reportType === "database") {
    return `${intro}

Create a complete database project on the subject "${subject}" with topic: "${topic}"${groupLine}

MUST include ALL of these sections (in ${langName}):
1. Domain description (detailed, min 10 sentences)
2. Conceptual model (ER diagram in text form) — entities, attributes, types, PKs, relationships
3. SQL creation script — min 5-7 tables with PK, FK, NOT NULL, UNIQUE, CHECK, indexes
4. Data population — INSERT statements for each table with 5-10 realistic records
5. Queries of varying complexity (min 10): simple SELECTs, JOINs, GROUP BY + HAVING, subqueries
6. Result tables in Markdown for each query
7. Conclusion`;
  }

  if (reportType === "lab") {
    return `${intro}

Write a COMPLETE lab work for subject "${subject}" on topic: "${topic}"${groupLine}

Structure (all in ${langName}):
- Title, subject, topic, objective
- Theoretical background (min 20 sentences with definitions, formulas, classifications)
- Equipment / Software (table)
- Procedure — step-by-step with CONCRETE actions, full working code (if programming), formulas with number substitutions (if science/math)
- Results — data tables with real numbers, analysis
- Control questions — 5-7 with full answers
- Conclusion — specific, point by point`;
  }

  if (reportType === "summary") {
    return `${intro}

Write a DETAILED summary/synopsis for subject "${subject}" on topic: "${topic}"${groupLine}

Structure (all in ${langName}):
- Key concepts and definitions (min 10-15, each as a quoted block)
- Theoretical material (min 30 sentences) with classifications in tables, formulas, real-life examples, comparative tables
- Classifications and schemes (Markdown tables)
- Formulas and laws (if applicable) with variable explanations
- Practical examples (3-5 with solutions)
- Self-check questions (10 questions)`;
  }

  if (reportType === "essay") {
    return `${intro}

Write an ACADEMIC essay/paper for subject "${subject}" on topic: "${topic}"${groupLine}

Structure (all in ${langName}):
- Table of contents
- Introduction: relevance (5-7 sentences), objective, tasks (1-4), object, subject, methods
- Chapter 1: Theoretical analysis (3 subsections, each 10-15 sentences, with citations [1, p.15])
- Chapter 2: Main part (3 subsections with tables, comparisons, examples)
- Chapter 3: Practical/analytical aspect (2 subsections)
- Conclusions — point by point for each task from introduction
- References — 15+ sources in proper format for the country`;
  }

  if (reportType === "tasks") {
    return `${intro}

Solve problems for subject "${subject}" on topic: "${topic}"${groupLine}

Structure (all in ${langName}):
- Theoretical reference: key formulas table (Formula | Description | Units)
- Min 8 problems:
  * 2 easy (basic formula application)
  * 3 medium (formula combinations, 3-4 steps)
  * 2 hard (multi-step with data tables)
  * 1 advanced/olympiad level
- Each problem: Condition → Given → Find → Solution (step by step with number substitutions) → Answer (with units)`;
  }

  if (reportType === "coursework") {
    return `${intro}

Write a FULL course work for subject "${subject}" on topic: "${topic}"${groupLine}

Structure (all in ${langName}):
- Table of contents with subsections
- Introduction (min 1 page): relevance (7-10 sentences), objective, tasks (1-6), object, subject, methods, structure
- Chapter 1: Theoretical foundations (4 subsections, each 15 sentences min)
- Chapter 2: Practical part (3 subsections with real data tables, calculations, code if IT)
- Chapter 3: Results and recommendations (2 subsections with analytics)
- Conclusions — point by point
- References — 20+ sources
- Appendices`;
  }

  if (reportType === "diploma") {
    return `${intro}

Create a FULL diploma thesis structure for subject "${subject}" on topic: "${topic}"${groupLine}

Structure (all in ${langName}):
- Abstract (150 words in ${langName} + 150 words in English)
- Table of contents
- List of abbreviations
- Introduction (2 pages): relevance, objective, tasks (1-8), object/subject, methods, scientific novelty, practical significance
- Chapter 1: Domain analysis (4-5 subsections, 15-20 sentences each, literature review, comparative tables)
- Chapter 2: Development and design (3-4 subsections, architecture, algorithms, diagrams, technology justification)
- Chapter 3: Implementation and testing (3-4 subsections, code/calculations, results, testing tables)
- Conclusions (1 page)
- References — 25+ sources`;
  }

  if (reportType === "presentation") {
    return `${intro}

Create a FULL presentation for subject "${subject}" on topic: "${topic}"${groupLine}

Format: 18-22 slides plan. For EACH slide (all text in ${langName}):
---
### Slide N — [Title]
**Main text on slide:**
- Point 1 (concise, 1 line)
- Point 2-5

**Visual:** [What to show: diagram/chart/scheme/table/image — describe specifically]

**Speaker notes:** (what to say — 5-8 sentences, detailed)
---

MANDATORY slides: Title, Contents, Relevance & Goal, 10+ content slides with real data/tables/formulas, Practical significance, Comparative table, Conclusions, References, "Thank you! Questions?"`;
  }

  if (reportType === "test") {
    return `${intro}

Create FULL test/exam answers for subject "${subject}" on topic: "${topic}"${groupLine}

Structure (all in ${langName}):
Part 1: Theoretical questions (12) — each with detailed 5-10 sentence answer
Part 2: Multiple choice (20 tests) — A) B) C) D) with correct answer + explanation
Part 3: Practical problems (6) — full step-by-step solution for each
Cheat sheet: key formulas table (Formula | Name | Variables)
Key definitions: quoted blocks for each important term`;
  }

  if (reportType === "notes") {
    return `${intro}

Write DETAILED lecture notes for subject "${subject}" on topic: "${topic}"${groupLine}

Structure (all in ${langName}):
- Lecture plan (numbered)
- For each section:
  * Key definitions (min 8-10, as quoted blocks)
  * Theoretical material with **bold** for key concepts, numbered and bulleted lists
  * Classification/comparison tables
  * Formulas with variable explanations (if applicable)
- Key takeaways (5-8 main points)
- Self-check questions (1-10)`;
  }

  return `${intro}

Write a DETAILED report for subject "${subject}" on topic: "${topic}"${groupLine}

Structure (all in ${langName}):
- Introduction: objective, tasks (1-4), relevance (5-7 sentences)
- Chapter 1: Theoretical part (2 subsections with definitions, classifications in tables, formulas)
- Chapter 2: Practical part (2 subsections with concrete calculations/code/analysis, result tables)
- Conclusions — specific conclusions for each task
- References — 10+ sources`;
}

function buildUkRuPrompt(reportType: string, reportTypeName: string, subject: string, topic: string, groupLine: string, group?: string | null): string {
  const subjectName = subject;

  if (reportType === "database") {
    return `Створи повну базу даних з предмету "${subjectName}" на тему: "${topic}"${groupLine}

ОБОВ'ЯЗКОВО включи ВСЕ:

## 1. Опис предметної області
Детальний аналіз предметної області (мінімум 10 речень).

## 2. Концептуальна модель (ER-діаграма текстово)
Для кожної сутності: назву, атрибути з типами, первинний ключ, зв'язки (1:1, 1:M, M:N)

## 3. SQL-скрипт створення БД
\`\`\`sql блок з мінімум 5-7 таблицями, з PRIMARY KEY, FOREIGN KEY, NOT NULL, UNIQUE, DEFAULT, CHECK, CREATE INDEX

## 4. Заповнення даними
INSERT для КОЖНОЇ таблиці — по 5-10 реалістичних записів

## 5. Запити різної складності (мінімум 10)
- 3 простих SELECT з WHERE
- 3 з JOIN (INNER, LEFT, RIGHT)
- 2 з GROUP BY + HAVING + агрегатні функції
- 1 з підзапитом
- 1 складний з кількома JOIN + GROUP BY + ORDER BY

## 6. Таблиця результатів
## 7. Висновок`;
  }

  if (reportType === "lab") {
    return `Напиши ПОВНУ лабораторну роботу з предмету "${subjectName}" на тему: "${topic}"${groupLine}

## Лабораторна робота
**Тема:** ${topic}
**Предмет:** ${subjectName}
${group ? `**Група:** ${group}` : ""}
**Мета:** (конкретна мета)

## Теоретичні відомості (мінімум 20 речень)
## Обладнання / Програмне забезпечення (таблиця)
## Хід роботи (покрокові інструкції з КОНКРЕТНИМИ діями, ПОВНИЙ код якщо програмування)
## Результати (таблиці з числовими даними, графіки текстово, аналіз)
## Відповіді на контрольні питання (5-7)
## Висновок`;
  }

  if (reportType === "summary") {
    return `Напиши ДЕТАЛЬНИЙ конспект з предмету "${subjectName}" на тему: "${topic}"${groupLine}

## 1. Основні поняття та визначення (мінімум 10-15 ключових)
## 2. Теоретичний матеріал (мінімум 30 речень з класифікаціями, формулами, прикладами)
## 3. Класифікації та схеми (Markdown таблиці)
## 4. Формули та закони (якщо є)
## 5. Практичні приклади (3-5 з розв'язками)
## 6. Питання для самоперевірки (10 питань)`;
  }

  if (reportType === "essay") {
    return `Напиши АКАДЕМІЧНИЙ реферат з предмету "${subjectName}" на тему: "${topic}"${groupLine}

# ${topic}
## ЗМІСТ
## ВСТУП (Актуальність, Мета, Завдання 1-4, Об'єкт, Предмет, Методи)
## РОЗДІЛ 1. [Теоретичний аналіз] (3 підрозділи, кожен 10-15 речень)
## РОЗДІЛ 2. [Основна частина] (3 підрозділи з таблицями, порівняннями)
## РОЗДІЛ 3. [Практичний аспект] (2 підрозділи)
## ВИСНОВКИ (по пунктах)
## СПИСОК ВИКОРИСТАНИХ ДЖЕРЕЛ (15+)`;
  }

  if (reportType === "tasks") {
    return `Розв'яжи задачі з предмету "${subjectName}" на тему: "${topic}"${groupLine}

## Теоретична довідка (ключові формули)
Мінімум 8 задач:
- 2 легкі, 3 середні, 2 складні, 1 олімпіадна
Для кожної: Умова → Дано → Знайти → Розв'язання (крок за кроком) → Відповідь`;
  }

  if (reportType === "coursework") {
    return `Напиши ПОВНУ курсову роботу з предмету "${subjectName}" на тему: "${topic}"${groupLine}

## ЗМІСТ
## ВСТУП (Актуальність 7-10 речень, Мета, Завдання 1-6, Об'єкт, Предмет, Методи, Структура)
## РОЗДІЛ 1. ТЕОРЕТИЧНІ ЗАСАДИ (4 підрозділи по 15 речень)
## РОЗДІЛ 2. ПРАКТИЧНА ЧАСТИНА (3 підрозділи з таблицями, кодом, розрахунками)
## РОЗДІЛ 3. РЕЗУЛЬТАТИ ТА РЕКОМЕНДАЦІЇ (2 підрозділи)
## ВИСНОВКИ
## СПИСОК ВИКОРИСТАНИХ ДЖЕРЕЛ (20+)
## ДОДАТКИ`;
  }

  if (reportType === "diploma") {
    return `Створи ПОВНУ дипломну роботу з предмету "${subjectName}" на тему: "${topic}"${groupLine}

## АНОТАЦІЯ (укр 150 слів + англ 150 слів)
## ЗМІСТ
## ПЕРЕЛІК УМОВНИХ ПОЗНАЧЕНЬ
## ВСТУП (2 сторінки: Актуальність, Мета, Завдання 1-8, Об'єкт/Предмет, Методи, Наукова новизна, Практичне значення)
## РОЗДІЛ 1. АНАЛІЗ ПРЕДМЕТНОЇ ОБЛАСТІ (4-5 підрозділів по 15-20 речень)
## РОЗДІЛ 2. РОЗРОБКА ТА ПРОЕКТУВАННЯ (3-4 підрозділи)
## РОЗДІЛ 3. РЕАЛІЗАЦІЯ ТА ТЕСТУВАННЯ (3-4 підрозділи)
## ВИСНОВКИ (1 сторінка)
## СПИСОК ВИКОРИСТАНИХ ДЖЕРЕЛ (25+ ДСТУ 8302:2015)`;
  }

  if (reportType === "presentation") {
    return `Створи ПОВНУ презентацію з предмету "${subjectName}" на тему: "${topic}"${groupLine}

18-22 слайдів. Для КОЖНОГО:
### Слайд N — [Заголовок]
**Текст на слайді:** тези (3-5 пунктів)
**Візуал:** [діаграма/графік/таблиця — описати конкретно]
**Нотатки доповідача:** (5-8 речень)

ОБОВ'ЯЗКОВО: Титульний, Зміст, Актуальність, 10+ слайдів контенту з даними, Висновки, Джерела, "Дякую! Запитання?"`;
  }

  if (reportType === "test") {
    return `Створи ПОВНІ відповіді на контрольну/екзамен з предмету "${subjectName}" на тему: "${topic}"${groupLine}

## Частина 1: Теоретичні питання (12) — розгорнуті відповіді 5-10 речень
## Частина 2: Тестові завдання (20) — А) Б) В) Г) з правильною відповіддю + пояснення
## Частина 3: Практичні завдання (6) — ПОВНЕ розв'язання крок за кроком
## Шпаргалка: ключові формули + визначення`;
  }

  if (reportType === "notes") {
    return `Напиши ДЕТАЛЬНИЙ конспект лекцій з предмету "${subjectName}" на тему: "${topic}"${groupLine}

## План лекції (нумерований)
Для кожної теми:
### Ключові визначення (мін 8-10)
### Теоретичний матеріал
### Класифікації / Порівняння (таблиці)
### Формули (якщо є)
## Головне запам'ятати (5-8 тез)
## Питання для самоконтролю (1-10)`;
  }

  return `Напиши ДЕТАЛЬНИЙ звіт з предмету "${subjectName}" на тему: "${topic}"${groupLine}

## ВСТУП (Мета, Завдання 1-4, Актуальність 5-7 речень)
## 1. ТЕОРЕТИЧНА ЧАСТИНА (2 підрозділи з визначеннями, таблицями, формулами)
## 2. ПРАКТИЧНА ЧАСТИНА (2 підрозділи з реальними даними, розрахунками, таблицями результатів)
## 3. ВИСНОВКИ (по кожному завданню)
## СПИСОК ДЖЕРЕЛ (10+)`;
}

export async function generateReport(
  reportType: string,
  subject: string,
  topic: string,
  group?: string | null,
  imageData?: string | null,
  language?: string | null
): Promise<string> {
  const lang = language || "uk";
  const systemPrompt = getSystemPrompt(lang);
  const userPrompt = buildUserPrompt(reportType, subject, topic, group, lang);

  const userContent: any[] = [{ type: "text", text: userPrompt }];

  if (imageData) {
    let dataUrl: string;
    if (imageData.startsWith("data:")) {
      dataUrl = imageData;
    } else {
      dataUrl = `data:image/jpeg;base64,${imageData}`;
    }
    userContent.push({
      type: "image_url",
      image_url: { url: dataUrl },
    });

    const photoWarning = lang === "uk" || lang === "ru"
      ? "\n\n⚠️ ВАЖЛИВО: До запиту прикріплено ФОТО завдання. Уважно розглянь зображення, прочитай ВСЕ що на ньому написано і використай цю інформацію для генерації роботи."
      : `\n\n⚠️ IMPORTANT: A PHOTO of the assignment is attached. Carefully examine the image, read EVERYTHING written on it, and use this information to generate the work. Write the response in ${LANGUAGE_NAMES[lang] || lang}.`;
    userContent[0].text += photoWarning;
  }

  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 16384,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
  });

  const fallbackMsg = lang === "uk" || lang === "ru" 
    ? "Помилка генерації. Спробуй ще раз." 
    : "Generation error. Please try again.";

  return response.choices[0]?.message?.content ?? fallbackMsg;
}
