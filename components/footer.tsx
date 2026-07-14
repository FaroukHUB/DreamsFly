import Link from "next/link";
import { Logo } from "./logo";

type Link = { label: string; link: string };
type Column = { title: string; links: Link[] };

export function Footer({ settings }: { settings?: any }) {
  const columns: Column[] = settings?.footerColumns?.length ? settings.footerColumns : DEFAULT_COLUMNS;
  const tagline =
    settings?.footerTagline ||
    "Une literie premium fabriquée en Europe, livrée avec un service pensé pour durer.";
  const payments: string[] = settings?.paymentMethods?.length
    ? settings.paymentMethods
    : ["VISA", "MasterCard", "CB", "Apple Pay", "Alma 4×"];
  const socials = settings?.socials || {};
  const contact = settings?.contact || {};

  return (
    <footer className="bg-ink text-white/70">
      {/* Section principale */}
      <div className="mx-auto max-w-site px-6 pt-16 md:px-8 md:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.8fr_repeat(5,1fr)] lg:gap-8">
          {/* Bloc marque */}
          <div>
            <div className="text-white">
              <Logo size={28} color="#FBF9F4" />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{tagline}</p>

            {/* Contact rapide */}
            {(contact.phone || contact.email) && (
              <div className="mt-5 space-y-1 text-sm">
                {contact.phone && (
                  <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="block text-white/80 hover:text-aurora">
                    📞 {contact.phone}
                  </a>
                )}
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="block text-white/80 hover:text-aurora">
                    ✉️ {contact.email}
                  </a>
                )}
              </div>
            )}

            {/* Socials */}
            {(socials.instagram || socials.facebook || socials.tiktok || socials.youtube) && (
              <ul className="mt-5 flex gap-3">
                {socials.instagram && (
                  <li>
                    <a href={socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-aurora hover:text-midnight">
                      <SocialIcon name="instagram" />
                    </a>
                  </li>
                )}
                {socials.facebook && (
                  <li>
                    <a href={socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-aurora hover:text-midnight">
                      <SocialIcon name="facebook" />
                    </a>
                  </li>
                )}
                {socials.tiktok && (
                  <li>
                    <a href={socials.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-aurora hover:text-midnight">
                      <SocialIcon name="tiktok" />
                    </a>
                  </li>
                )}
                {socials.youtube && (
                  <li>
                    <a href={socials.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-aurora hover:text-midnight">
                      <SocialIcon name="youtube" />
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* Colonnes de liens */}
          {columns.slice(0, 5).map((col, i) => (
            <div key={i}>
              <h4 className="mb-4 font-sora text-sm font-semibold uppercase tracking-wide text-white">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {(col.links || []).map((l, j) => (
                  <li key={j}>
                    <Link
                      href={l.link || "#"}
                      className="text-sm text-white/60 transition-colors hover:text-aurora"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bandeau newsletter */}
        <div className="mt-14 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:mt-16 md:flex md:items-center md:justify-between md:gap-6 md:p-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-aurora">Newsletter</div>
            <h3 className="mt-1 font-sora text-lg font-semibold text-white md:text-xl">
              Conseils sommeil + offres exclusives, chaque semaine.
            </h3>
          </div>
          <Link
            href="/#newsletter"
            className="mt-4 inline-flex items-center gap-2 rounded-pill bg-aurora px-5 py-2.5 font-sora text-sm font-semibold text-midnight transition-all hover:-translate-y-px md:mt-0"
          >
            Je m'inscris →
          </Link>
        </div>
      </div>

      {/* Barre bas */}
      <div className="mx-auto mt-12 max-w-site border-t border-white/10 px-6 pb-8 pt-6 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-white/40">
            © {new Date().getFullYear()} DreamsFly · Fabriqué avec ♥ en Europe
          </div>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/50">
            <li><Link href="/mentions-legales" className="hover:text-aurora">Mentions légales</Link></li>
            <li><Link href="/cgv" className="hover:text-aurora">CGV</Link></li>
            <li><Link href="/confidentialite" className="hover:text-aurora">Confidentialité</Link></li>
            <li><Link href="/cookies" className="hover:text-aurora">Cookies</Link></li>
          </ul>
          <div className="flex flex-wrap gap-1.5">
            {payments.map((p) => (
              <span
                key={p}
                className="rounded bg-white/10 px-2.5 py-1 text-[10.5px] font-semibold text-white/80"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ name }: { name: string }) {
  const common = { width: 16, height: 16, fill: "currentColor", "aria-hidden": true } as const;
  switch (name) {
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 5.5a4.34 4.34 0 100 8.68 4.34 4.34 0 000-8.68zm0 7.16a2.82 2.82 0 110-5.64 2.82 2.82 0 010 5.64zm5.53-7.34a1.02 1.02 0 100-2.03 1.02 1.02 0 000 2.03z" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.5-3.9 3.79-3.9 1.1 0 2.24.2 2.24.2v2.47h-1.27c-1.24 0-1.63.78-1.63 1.57V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0022 12z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M19.6 6.8a5 5 0 01-3.1-1.1v9.1a5.3 5.3 0 11-5.3-5.3l.4.02v2.66a2.66 2.66 0 102.66 2.66V2h2.63a5 5 0 002.72 4.15c.53.28 1.13.44 1.76.46V6.8h-1.77z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M21.58 7.19a2.51 2.51 0 00-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42A2.51 2.51 0 002.42 7.19 26.36 26.36 0 002 12a26.36 26.36 0 00.42 4.81 2.51 2.51 0 001.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42a2.51 2.51 0 001.77-1.77A26.36 26.36 0 0022 12a26.36 26.36 0 00-.42-4.81zM10 15.5v-7l6 3.5-6 3.5z" />
        </svg>
      );
    default:
      return null;
  }
}

const DEFAULT_COLUMNS: Column[] = [
  {
    title: "Catalogue",
    links: [
      { label: "Matelas", link: "/matelas" },
      { label: "Lits", link: "/lits" },
      { label: "Sommiers", link: "/sommiers" },
      { label: "Oreillers", link: "/oreillers" },
      { label: "Linge de lit", link: "/linge-de-lit" },
      { label: "Packs", link: "/packs" },
    ],
  },
  {
    title: "Guides & Blog",
    links: [
      { label: "Nos guides", link: "/magazine" },
      { label: "Comparatifs", link: "/comparatifs" },
      { label: "Glossaire", link: "/glossaire" },
      { label: "Blog sommeil", link: "/magazine" },
      { label: "Quiz matelas", link: "/quiz" },
    ],
  },
  {
    title: "Aide",
    links: [
      { label: "FAQ", link: "/aide/faq" },
      { label: "Livraison", link: "/services/livraison" },
      { label: "Garantie", link: "/services/garantie" },
      { label: "Retour & remboursement", link: "/services/retour" },
      { label: "Nous contacter", link: "/aide/contact" },
    ],
  },
  {
    title: "Marque",
    links: [
      { label: "Qui sommes-nous", link: "/marque/qui-sommes-nous" },
      { label: "Nos experts", link: "/marque/nos-experts" },
      { label: "Engagements", link: "/marque/engagements" },
      { label: "Marques partenaires", link: "/marque/partenaires" },
      { label: "Showrooms", link: "/magasins" },
      { label: "Presse", link: "/marque/presse" },
    ],
  },
  {
    title: "Info",
    links: [
      { label: "Paiement en 4×", link: "/services/paiement" },
      { label: "Programme fidélité", link: "/services/fidelite" },
      { label: "Parrainage", link: "/services/parrainage" },
      { label: "Cartes cadeaux", link: "/services/cartes-cadeaux" },
      { label: "Professionnels", link: "/services/pro" },
    ],
  },
];
