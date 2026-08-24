/**
 * Bibliothèque d'icônes ligne — direction A (luxe éditorial).
 * Style : stroke 1.4, currentColor, fill none, geometry Feather-esque.
 * Aucune émoji nulle part sur le site.
 *
 * Utilisation :
 *   <LineIcon name="feather" size={22} />
 *   <LineIcon name="moon" className="text-or" />
 *
 * Mapping fallback pour l'ancien contenu emoji → nom d'icône équivalent.
 */
type Props = {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
};

/** Emojis courantes du site → nom d'icône ligne. Ajouter au fil de l'eau. */
const EMOJI_MAP: Record<string, string> = {
  "🎓": "award",
  "🎯": "target",
  "🛡️": "shield",
  "🤝": "handshake",
  "💬": "chat",
  "🚚": "truck",
  "🛏️": "bed",
  "🛋️": "sofa",
  "🪑": "chair",
  "🌙": "moon",
  "✨": "sparkle",
  "♾️": "infinity",
  "👥": "users",
  "❤️": "heart",
  "🛌": "bed",
  "💑": "couple",
  "🏙️": "city",
  "🇫🇷": "flag-fr",
  "📞": "phone",
  "✉️": "mail",
  "📧": "mail",
  "🏬": "store",
  "📐": "ruler",
  "📚": "book",
  "⚠️": "alert",
  "❓": "help",
  "⭐": "star",
  "🖼️": "image",
  "📖": "book",
  "📊": "chart",
  "💡": "bulb",
  "👨‍⚕️": "stethoscope",
  "📷": "camera",
  "🌟": "sparkle",
  "🎁": "gift",
  "🧣": "linen",
  "📦": "box",
  "🍃": "leaf",
  "🌿": "leaf",
  "🔒": "lock",
  "🏆": "award",
  "🎥": "video",
  "📰": "newspaper",
  "◾": "square",
};

export function iconNameForEmoji(input?: string): string {
  if (!input) return "square";
  return EMOJI_MAP[input.trim()] || input.trim();
}

const PATHS: Record<string, React.ReactNode> = {
  moon: <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18" />
    </>
  ),
  star: <polygon points="12 3 14.5 9 21 9.5 16 14 17.5 20.5 12 17 6.5 20.5 8 14 3 9.5 9.5 9 12 3" />,
  heart: <path d="M20.4 12.5 12 21l-8.4-8.5a4.6 4.6 0 0 1 6.5-6.5l1.9 1.9 1.9-1.9a4.6 4.6 0 0 1 6.5 6.5Z" />,
  shield: (
    <>
      <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  truck: (
    <>
      <rect x="1" y="6" width="14" height="11" rx="1" />
      <path d="M15 9h4l3 3v5h-7V9Z" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </>
  ),
  store: (
    <>
      <path d="M3 9 5 3h14l2 6" />
      <path d="M3 9v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9" />
      <path d="M9 21v-8h6v8" />
    </>
  ),
  home: <path d="M3 11 12 3l9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9Z" />,
  bed: (
    <>
      <path d="M3 20V6M21 20v-8a3 3 0 0 0-3-3H3M3 15h18" />
      <circle cx="8" cy="12" r="1.4" />
    </>
  ),
  sofa: (
    <>
      <path d="M4 12v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6M4 12a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2M4 12v-2a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v2" />
      <path d="M3 19v2M21 19v2" />
    </>
  ),
  chair: (
    <>
      <path d="M6 3h12v9H6zM6 12v3M18 12v3M6 15h12M9 18v3M15 18v3" />
    </>
  ),
  pillow: (
    <path d="M5 9c0-2 1.5-3 3.5-3h7c2 0 3.5 1 3.5 3v6c0 2-1.5 3-3.5 3h-7C6.5 18 5 17 5 15V9Z" />
  ),
  feather: (
    <>
      <path d="M20 4 8 16v4h4L20 8V4Z" />
      <path d="M13 11H9M12 4v3" />
    </>
  ),
  leaf: (
    <>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19.2 3c1.4 9.3-1.7 18-8.2 17Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6" />
    </>
  ),
  tree: (
    <>
      <path d="M12 3 6 12h3v6h6v-6h3L12 3Z" />
      <path d="M12 18v3" />
    </>
  ),
  handshake: (
    <path d="M2 12l4-4 3 3-4 4-3-3ZM22 12l-4-4-3 3 4 4 3-3ZM9 15l6-6M8 8l4 4M13 14l-2 2" />
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  couple: (
    <>
      <circle cx="8" cy="7" r="3" />
      <circle cx="16" cy="7" r="3" />
      <path d="M2 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2M14 21v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2" />
    </>
  ),
  city: (
    <>
      <path d="M3 21V9l6-4v16M9 21V3l6 4v14M15 21V13l6 4v4" />
      <path d="M6 12v2M6 16v2M12 8v2M12 12v2M12 16v2M18 18v2" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="m9 15-2 6 5-3 5 3-2-6" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="M7 15V9M12 17V5M17 17v-8" />
    </>
  ),
  book: (
    <>
      <path d="M4 4h9a4 4 0 0 1 4 4v13" />
      <path d="M4 4v14a1 1 0 0 0 1 1h12" />
      <path d="M20 8v13a1 1 0 0 1-1 1H7" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c1 1 1.5 2 1.5 3.5h5c0-1.5.5-2.5 1.5-3.5A6 6 0 0 0 12 3Z" />
    </>
  ),
  gift: (
    <>
      <rect x="3" y="9" width="18" height="11" rx="1" />
      <path d="M3 13h18M12 9v11" />
      <path d="M8 9a2 2 0 1 1 0-4c2 0 4 4 4 4M16 9a2 2 0 1 0 0-4c-2 0-4 4-4 4" />
    </>
  ),
  chat: (
    <>
      <path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-9l-6 5v-5H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
    </>
  ),
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 20 20 0 0 1-8.7-3.1 19.5 19.5 0 0 1-6-6A20 20 0 0 1 2 4.1 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .6 2.9a2 2 0 0 1-.4 2L8 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2-.4c1 .3 2 .5 2.9.6A2 2 0 0 1 22 16.9Z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="m3 6 9 7 9-7" />
    </>
  ),
  ruler: (
    <>
      <path d="m2 15 7-13 13 7L15 22 2 15Z" />
      <path d="M7 8l2 1M9 5l2 1M11 12l2 1M14 9l2 1M16 15l2 1" />
    </>
  ),
  alert: (
    <>
      <path d="M12 2 2 20h20L12 2Z" />
      <path d="M12 10v5M12 18v.5" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 4M12 17.5v.5" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="1" />
      <circle cx="8.5" cy="10" r="1.5" />
      <path d="m4 18 5-5 4 4 3-3 4 4" />
    </>
  ),
  stethoscope: (
    <>
      <path d="M6 3v6a4 4 0 0 0 8 0V3" />
      <path d="M10 13v3a5 5 0 0 0 10 0v-3M20 13a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6" width="14" height="12" rx="1" />
      <path d="m17 10 4-2v8l-4-2Z" />
    </>
  ),
  newspaper: (
    <>
      <path d="M2 6h14v14a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V9h-3" />
      <path d="M6 10h6M6 13h6M6 16h6M14 13h2M14 16h2" />
    </>
  ),
  flag: <path d="M4 3v18M4 4h14l-3 4 3 4H4" />,
  "flag-fr": (
    <>
      <path d="M4 3v18M4 4h14l-3 4 3 4H4" />
    </>
  ),
  box: (
    <>
      <path d="M3 8v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8" />
      <path d="M2 4h20v4H2zM10 12h4" />
    </>
  ),
  linen: <path d="M4 6h16v12H4zM4 10h16M4 14h16M8 6v12M16 6v12" />,
  infinity: <path d="M18 12c0-2-1.5-4-4-4s-4 3-4 3-1.5 3-4 3-4-1.5-4-3 1.5-3 4-3 4 3 4 3 1.5 3 4 3 4-1 4-3Z" />,
  quote: <path d="M6 8v6a4 4 0 0 1-4 4V8h4ZM18 8v6a4 4 0 0 1-4 4V8h4Z" />,
  square: <rect x="6" y="6" width="12" height="12" rx="1" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
};

export function LineIcon({ name, size = 22, className, strokeWidth = 1.4 }: Props) {
  const key = name in PATHS ? name : iconNameForEmoji(name);
  const paths = PATHS[key] || PATHS.square;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths}
    </svg>
  );
}
