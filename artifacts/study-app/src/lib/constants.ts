export const REPORT_TYPES = [
  { id: "report", label: "Звіт", icon: "📄", desc: "Офіційний звіт з теми" },
  { id: "summary", label: "Конспект", icon: "📝", desc: "Стислий виклад теми" },
  { id: "database", label: "База даних", icon: "🗄", desc: "SQL таблиці та запити" },
  { id: "lab", label: "Лабораторна", icon: "🔬", desc: "Повна лабораторна робота" },
  { id: "essay", label: "Реферат", icon: "📋", desc: "Розгорнутий реферат" },
  { id: "tasks", label: "Задачі", icon: "🧮", desc: "Розв'язання задач" },
];

export const SUBJECTS = [
  { id: "programming", label: "Програмування", icon: "💻" },
  { id: "math", label: "Математика", icon: "📐" },
  { id: "physics", label: "Фізика", icon: "⚡" },
  { id: "chemistry", label: "Хімія", icon: "🧪" },
  { id: "biology", label: "Біологія", icon: "🌿" },
  { id: "history", label: "Історія", icon: "📜" },
  { id: "geography", label: "Географія", icon: "🌍" },
  { id: "databases", label: "Бази Даних", icon: "🗃" },
  { id: "networks", label: "Мережі", icon: "🌐" },
  { id: "economics", label: "Економіка", icon: "💰" },
  { id: "other", label: "Інше", icon: "📚" },
];

export const REPORT_TYPE_MAP = Object.fromEntries(REPORT_TYPES.map(r => [r.id, r]));
export const SUBJECT_MAP = Object.fromEntries(SUBJECTS.map(s => [s.id, s]));
