/**
 * Marques de paiement et garanties affichées dans le tunnel.
 *
 * Les marques sont dessinées en SVG inline : la CSP du site interdit les
 * ressources externes, et un logo distant ajouterait une requête bloquante
 * sur la page la plus critique du parcours.
 *
 * Rendu sobre et monochrome, à deux exceptions près (Mastercard, CB) dont
 * la géométrie EST l'identité. Reproduire approximativement un logo de
 * marque fait plus amateur qu'un traitement typographique assumé.
 */

/**
 * Correspondance entre les `payment_method_types` renvoyés par Stripe et ce
 * qu'on affiche. La carte se décline en plusieurs réseaux ; les autres
 * moyens ont une entrée chacun.
 *
 * Un type inconnu (Stripe en ajoute régulièrement) est simplement ignoré
 * plutôt que rendu sous une forme approximative.
 */
const BRANDS: Record<string, { key: string; render: () => React.ReactNode }[]> = {
  card: [
    { key: "visa", render: () => <Visa /> },
    { key: "mastercard", render: () => <Mastercard /> },
    { key: "cb", render: () => <CarteBancaire /> },
    { key: "amex", render: () => <Wordmark label="AMEX" /> },
  ],
  paypal: [{ key: "paypal", render: () => <Wordmark label="PayPal" /> }],
  alma: [{ key: "alma", render: () => <Wordmark label="Alma" /> }],
  klarna: [{ key: "klarna", render: () => <Wordmark label="Klarna" /> }],
  link: [{ key: "link", render: () => <Wordmark label="Link" /> }],
  sepa_debit: [{ key: "sepa", render: () => <Wordmark label="SEPA" /> }],
  bancontact: [{ key: "bancontact", render: () => <Wordmark label="Bancontact" /> }],
  revolut_pay: [{ key: "revolut", render: () => <Wordmark label="Revolut" /> }],
};

/**
 * Bandeau des moyens de paiement acceptés.
 *
 * `types` vient du PaymentIntent, donc de la configuration réelle du compte
 * Stripe. Apple Pay et Google Pay ne figurent pas dans cette liste : Stripe
 * les expose sous le type « card », et leur disponibilité dépend de
 * l'appareil du visiteur — les annoncer ici serait une promesse qu'on ne
 * peut pas tenir sur tous les navigateurs.
 */
export function AcceptedMethods({ types }: { types: string[] }) {
  const brands = types.flatMap((t) => BRANDS[t] || []);
  if (brands.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {brands.map((b) => (
        <span
          key={b.key}
          className="flex h-9 min-w-[54px] items-center justify-center rounded-[7px] border border-border bg-ivoire px-2.5"
        >
          {b.render()}
        </span>
      ))}
    </div>
  );
}

/** Trois garanties factuelles, vérifiables — aucune promesse commerciale. */
export function SecurityAssurances() {
  const items = [
    {
      icon: <LockIcon />,
      title: "Paiement chiffré",
      text: "Connexion TLS et authentification 3-D Secure exigée par votre banque.",
    },
    {
      icon: <ShieldIcon />,
      title: "Coordonnées jamais stockées",
      text: "Votre numéro de carte est transmis directement à Stripe, prestataire certifié PCI-DSS niveau 1. Il ne transite pas par nos serveurs.",
    },
    {
      icon: <ScaleIcon />,
      title: "Rétractation 14 jours",
      text: "Droit légal de rétractation sur toute commande en ligne (article L221-18 du Code de la consommation).",
    },
  ];

  return (
    <ul className="grid gap-6 sm:grid-cols-3">
      {items.map((it) => (
        <li key={it.title}>
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-noir text-or">
            {it.icon}
          </span>
          <p className="font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-ink">
            {it.title}
          </p>
          <p className="mt-1.5 font-sans text-[12.5px] leading-relaxed text-pierre">{it.text}</p>
        </li>
      ))}
    </ul>
  );
}

// ─────────────────────────────────────────────────────────────
// Marques
// ─────────────────────────────────────────────────────────────

/** Traitement typographique — assumé plutôt qu'un logo mal reproduit. */
function Wordmark({ label }: { label: string }) {
  return (
    <span className="font-sans text-[11px] font-semibold tracking-[0.04em] text-ink/75">{label}</span>
  );
}

function Visa() {
  return (
    <span className="font-sans text-[12px] font-bold italic tracking-[0.06em] text-ink/75">VISA</span>
  );
}

/** Les deux disques entrelacés : ici la géométrie fait l'identité. */
function Mastercard() {
  return (
    <svg width="32" height="20" viewBox="0 0 32 20" aria-hidden="true">
      <circle cx="12" cy="10" r="7" fill="#EB001B" opacity="0.85" />
      <circle cx="20" cy="10" r="7" fill="#F79E1B" opacity="0.85" />
      <path
        d="M16 4.6a7 7 0 0 0 0 10.8 7 7 0 0 0 0-10.8Z"
        fill="#FF5F00"
        opacity="0.95"
      />
    </svg>
  );
}

/** Carte Bancaire — le réseau français, distinct de Visa/Mastercard. */
function CarteBancaire() {
  return (
    <svg width="30" height="20" viewBox="0 0 30 20" aria-hidden="true">
      <rect x="0.5" y="2.5" width="29" height="15" rx="2.5" fill="#0B3B7A" opacity="0.85" />
      <text
        x="15"
        y="13.2"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="8.5"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        CB
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Icônes
// ─────────────────────────────────────────────────────────────

function LockIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 3l7 3v5c0 4.4-3 8.4-7 10-4-1.6-7-5.6-7-10V6l7-3Z" />
      <path d="M9.5 12l1.8 1.8L15 10" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 4v16M6 8h12M4 8l-2 6h4l-2-6ZM20 8l-2 6h4l-2-6ZM8 20h8" />
    </svg>
  );
}
