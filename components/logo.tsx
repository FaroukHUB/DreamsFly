type LogoProps = {
  /** Couleur principale du logo. Par défaut hérite de la couleur CSS courante. */
  color?: string;
  /** Hauteur en pixels du wordmark. Le reste s'adapte. */
  size?: number;
  /** Affiche uniquement le pictogramme (sans le wordmark DREAMS · fly). */
  iconOnly?: boolean;
  className?: string;
};

/**
 * Logo DreamsFly recréé en SVG inline depuis le PDF source.
 * Lit double + petit avion qui survole + 3 nuages stylisés + wordmark.
 */
export function Logo({ color = "currentColor", size = 40, iconOnly = false, className }: LogoProps) {
  const width = iconOnly ? size * 1.4 : size * 4.3;
  const height = iconOnly ? size * 1.4 : size * 2.6;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={iconOnly ? "0 0 200 200" : "0 0 580 360"}
      width={width}
      height={height}
      fill={color}
      className={className}
      role="img"
      aria-label="DreamsFly"
    >
      {/* Tête de lit + 2 oreillers */}
      <g transform={iconOnly ? "translate(20, 10)" : "translate(210, 10)"}>
        {/* Tête de lit */}
        <path d="M0 30 Q0 0 30 0 L130 0 Q160 0 160 30 L160 50 L0 50 Z" />
        {/* Trous oreillers (effet creux) */}
        <rect x="20" y="20" width="50" height="28" rx="6" fill="var(--logo-bg, #000)" />
        <rect x="90" y="20" width="50" height="28" rx="6" fill="var(--logo-bg, #000)" />
      </g>

      {/* Matelas + nuages + avion */}
      <g transform={iconOnly ? "translate(20, 65)" : "translate(210, 65)"}>
        {/* Matelas (forme arrondie en haut) */}
        <path d="M0 0 Q0 -10 12 -10 L148 -10 Q160 -10 160 0 L160 50 L0 50 Z" />
        {/* Nuages en bas du matelas */}
        <path
          d="M0 50 L0 45 Q15 30 35 45 Q55 25 75 45 Q95 30 120 45 Q140 35 160 45 L160 50 Z"
          fill="var(--logo-bg, #000)"
        />
        {/* Petit avion en haut à droite */}
        <g transform="translate(120, 8) scale(0.7)">
          <path d="M22 4 L18 8 L8 6 L6 8 L14 12 L8 16 L4 15 L2 17 L7 19 L9 21 L11 19 L10 15 L14 12 L24 14 L22 4 Z" />
        </g>
      </g>

      {/* Wordmark DREAMS · fly */}
      {!iconOnly && (
        <g transform="translate(0, 200)">
          {/* Point gauche */}
          <circle cx="80" cy="40" r="6" />
          {/* DREAMS */}
          <text
            x="290"
            y="58"
            textAnchor="middle"
            fontFamily="Sora, system-ui, sans-serif"
            fontWeight="700"
            fontSize="60"
            letterSpacing="2"
          >
            DREAMS
          </text>
          {/* Point droite */}
          <circle cx="500" cy="40" r="6" />
          {/* fly */}
          <text
            x="290"
            y="120"
            textAnchor="middle"
            fontFamily="Sora, system-ui, sans-serif"
            fontWeight="400"
            fontSize="38"
            letterSpacing="1"
          >
            fly
          </text>
        </g>
      )}
    </svg>
  );
}

/**
 * Variante compacte du logo (pictogramme uniquement) pour le header sticky.
 */
export function LogoIcon({ color, size = 32, className }: Omit<LogoProps, "iconOnly">) {
  return <Logo iconOnly color={color} size={size} className={className} />;
}
