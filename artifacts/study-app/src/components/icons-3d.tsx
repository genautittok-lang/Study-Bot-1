import { motion } from "framer-motion";

const gradients: Record<string, [string, string]> = {
  report: ["#7B68EE", "#5B4CCF"],
  summary: ["#FF8A50", "#E67E22"],
  database: ["#4A90FF", "#3D7FE8"],
  lab: ["#00D4AA", "#00C48C"],
  essay: ["#FF6B9D", "#E84393"],
  tasks: ["#00C48C", "#00A87A"],
  coursework: ["#7B68EE", "#5143C2"],
  diploma: ["#FFB347", "#F39C12"],
  presentation: ["#4A90FF", "#2F6ECF"],
  test: ["#00D4AA", "#00A87A"],
  notes: ["#A29BFE", "#7B68EE"],
  topup: ["#00D4AA", "#4A90FF"],
  history: ["#FF8A50", "#E67E22"],
  profile: ["#7B68EE", "#FF6B9D"],
  invite: ["#00C48C", "#00D4AA"],
  balance: ["#4A90FF", "#00D4AA"],
  star: ["#FFB347", "#FFA502"],
  card: ["#7B68EE", "#5B4CCF"],
  crypto: ["#00C48C", "#00A87A"],
  share: ["#4A90FF", "#00D4AA"],
  repeat: ["#7B68EE", "#A29BFE"],
  copy: ["#00C48C", "#00D4AA"],
};

function Icon3D({ id, size = 44 }: { id: string; size?: number }) {
  const [c1, c2] = gradients[id] || ["#7B68EE", "#5B4CCF"];
  const inner = Math.round(size * 0.52);
  const gid = `g3d_${id}_${size}`;

  return (
    <div
      className="shrink-0 flex items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.32,
        background: `linear-gradient(145deg, ${c1}14, ${c2}0A)`,
        boxShadow: `0 2px 10px ${c1}12, inset 0 1px 0 rgba(255,255,255,0.6)`,
        border: `1px solid ${c1}10`,
      }}
    >
      <svg width={inner} height={inner} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
        </defs>
        {getPath(id, gid)}
      </svg>
    </div>
  );
}

function getPath(id: string, gid: string) {
  const s = `url(#${gid})`;
  switch (id) {
    case "report":
      return (
        <>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" stroke={s} strokeWidth="1.8" fill="none" />
          <path d="M14 2v6h6" stroke={s} strokeWidth="1.8" fill="none" />
          <line x1="8" y1="13" x2="16" y2="13" stroke={s} strokeWidth="1.5" opacity="0.5" />
          <line x1="8" y1="17" x2="13" y2="17" stroke={s} strokeWidth="1.5" opacity="0.5" />
        </>
      );
    case "summary":
      return (
        <>
          <rect x="3" y="3" width="18" height="18" rx="2.5" stroke={s} strokeWidth="1.8" fill="none" />
          <path d="M7 7h10M7 11h10M7 15h6" stroke={s} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        </>
      );
    case "database":
      return (
        <>
          <ellipse cx="12" cy="5.5" rx="8" ry="3.5" stroke={s} strokeWidth="1.8" fill="none" />
          <path d="M4 5.5v5c0 1.93 3.58 3.5 8 3.5s8-1.57 8-3.5v-5" stroke={s} strokeWidth="1.8" fill="none" />
          <path d="M4 10.5v5c0 1.93 3.58 3.5 8 3.5s8-1.57 8-3.5v-5" stroke={s} strokeWidth="1.8" fill="none" />
        </>
      );
    case "lab":
      return (
        <>
          <path d="M9 3v6l-5 8.5c-.7 1.2.2 2.5 1.6 2.5h12.8c1.4 0 2.3-1.3 1.6-2.5L15 9V3" stroke={s} strokeWidth="1.8" fill="none" />
          <line x1="9" y1="3" x2="15" y2="3" stroke={s} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M8.5 14h7" stroke={s} strokeWidth="1.5" opacity="0.4" />
        </>
      );
    case "essay":
      return (
        <>
          <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" stroke={s} strokeWidth="1.8" fill="none" />
          <path d="M15 5l4 4" stroke={s} strokeWidth="1.5" opacity="0.4" />
        </>
      );
    case "tasks":
      return (
        <>
          <rect x="3" y="3" width="6" height="6" rx="1.5" stroke={s} strokeWidth="1.8" fill="none" />
          <path d="M4.5 6l1.5 1.5 3-3" stroke={s} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="3" y="13" width="6" height="6" rx="1.5" stroke={s} strokeWidth="1.8" fill="none" />
          <line x1="13" y1="6" x2="21" y2="6" stroke={s} strokeWidth="1.8" strokeLinecap="round" />
          <line x1="13" y1="16" x2="21" y2="16" stroke={s} strokeWidth="1.8" strokeLinecap="round" />
        </>
      );
    case "coursework":
      return (
        <>
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" stroke={s} strokeWidth="1.8" fill="none" />
          <path d="M10 2v8l2.5-2 2.5 2V2" stroke={s} strokeWidth="1.5" fill="none" opacity="0.6" />
        </>
      );
    case "diploma":
      return (
        <>
          <circle cx="12" cy="10" r="6" stroke={s} strokeWidth="1.8" fill="none" />
          <path d="M12 16v6M9 20l3-2 3 2" stroke={s} strokeWidth="1.8" fill="none" />
          <path d="M12 7v3l2 1" stroke={s} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        </>
      );
    case "presentation":
      return (
        <>
          <rect x="2" y="3" width="20" height="14" rx="2" stroke={s} strokeWidth="1.8" fill="none" />
          <line x1="12" y1="17" x2="12" y2="21" stroke={s} strokeWidth="1.8" />
          <line x1="8" y1="21" x2="16" y2="21" stroke={s} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M7 8l3 3 2-2 5 4" stroke={s} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
        </>
      );
    case "test":
      return (
        <>
          <rect x="4" y="2" width="16" height="20" rx="2" stroke={s} strokeWidth="1.8" fill="none" />
          <path d="M9 11l2 2 4-4" stroke={s} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="8" y1="17" x2="16" y2="17" stroke={s} strokeWidth="1.5" opacity="0.4" />
          <line x1="8" y1="6" x2="16" y2="6" stroke={s} strokeWidth="1.5" opacity="0.4" />
        </>
      );
    case "notes":
      return (
        <>
          <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" stroke={s} strokeWidth="1.8" fill="none" />
          <path d="M15 3v6h6" stroke={s} strokeWidth="1.8" fill="none" />
          <path d="M7 13h5M7 17h8" stroke={s} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        </>
      );
    case "topup":
      return (
        <>
          <path d="M6 3h12l4 6-10 13L2 9Z" stroke={s} strokeWidth="1.8" fill="none" strokeLinejoin="round" />
          <path d="M2 9h20M9 3l-1 6 4 13M15 3l1 6-4 13" stroke={s} strokeWidth="1.2" opacity="0.4" />
        </>
      );
    case "history":
      return (
        <>
          <circle cx="12" cy="12" r="10" stroke={s} strokeWidth="1.8" fill="none" />
          <path d="M12 6v6l4 2" stroke={s} strokeWidth="2" strokeLinecap="round" />
        </>
      );
    case "profile":
      return (
        <>
          <circle cx="12" cy="8" r="5" stroke={s} strokeWidth="1.8" fill="none" />
          <path d="M20 21a8 8 0 0 0-16 0" stroke={s} strokeWidth="1.8" fill="none" />
        </>
      );
    case "invite":
      return (
        <>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke={s} strokeWidth="1.8" fill="none" />
          <circle cx="9" cy="7" r="4" stroke={s} strokeWidth="1.8" fill="none" />
          <path d="M19 8v6M22 11h-6" stroke={s} strokeWidth="2" strokeLinecap="round" />
        </>
      );
    case "balance":
      return (
        <>
          <rect x="2" y="5" width="20" height="14" rx="2" stroke={s} strokeWidth="1.8" fill="none" />
          <line x1="2" y1="10" x2="22" y2="10" stroke={s} strokeWidth="1.5" opacity="0.4" />
          <circle cx="17" cy="14.5" r="1.5" fill={s} opacity="0.6" />
        </>
      );
    case "star":
      return (
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z" stroke={s} strokeWidth="1.8" fill="none" strokeLinejoin="round" />
      );
    case "card":
      return (
        <>
          <rect x="2" y="5" width="20" height="14" rx="2.5" stroke={s} strokeWidth="1.8" fill="none" />
          <line x1="2" y1="10" x2="22" y2="10" stroke={s} strokeWidth="1.8" />
          <line x1="6" y1="15" x2="10" y2="15" stroke={s} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          <line x1="14" y1="15" x2="18" y2="15" stroke={s} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        </>
      );
    case "crypto":
      return (
        <>
          <circle cx="12" cy="12" r="10" stroke={s} strokeWidth="1.8" fill="none" />
          <path d="M9 8h4.5a2.5 2.5 0 0 1 0 5H9V7M9 13h5a2.5 2.5 0 0 1 0 5H9v-6" stroke={s} strokeWidth="1.5" fill="none" />
          <line x1="10" y1="5" x2="10" y2="7" stroke={s} strokeWidth="1.5" />
          <line x1="14" y1="5" x2="14" y2="7" stroke={s} strokeWidth="1.5" />
          <line x1="10" y1="18" x2="10" y2="20" stroke={s} strokeWidth="1.5" />
          <line x1="14" y1="18" x2="14" y2="20" stroke={s} strokeWidth="1.5" />
        </>
      );
    case "share":
      return (
        <>
          <circle cx="18" cy="5" r="3" stroke={s} strokeWidth="1.8" fill="none" />
          <circle cx="6" cy="12" r="3" stroke={s} strokeWidth="1.8" fill="none" />
          <circle cx="18" cy="19" r="3" stroke={s} strokeWidth="1.8" fill="none" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke={s} strokeWidth="1.5" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke={s} strokeWidth="1.5" />
        </>
      );
    default:
      return (
        <>
          <circle cx="12" cy="12" r="10" stroke={s} strokeWidth="1.8" fill="none" />
          <line x1="12" y1="8" x2="12" y2="12" stroke={s} strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="16" r="1" fill={s} />
        </>
      );
  }
}

export function Icon3DAnimated({ id, size = 44, delay = 0 }: { id: string; size?: number; delay?: number }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.3, type: "spring", bounce: 0.3 }}
    >
      <Icon3D id={id} size={size} />
    </motion.div>
  );
}

export default Icon3D;

export const REPORT_ICON_MAP: Record<string, string> = {
  report: "report",
  summary: "summary",
  database: "database",
  lab: "lab",
  essay: "essay",
  tasks: "tasks",
  coursework: "coursework",
  diploma: "diploma",
  presentation: "presentation",
  test: "test",
  notes: "notes",
};
