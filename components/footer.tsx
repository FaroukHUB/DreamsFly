import Link from "next/link";
import { Logo } from "./logo";
import { LineIcon } from "./line-icon";

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
    <footer className="bg-noir text-ivoire/65">
      {/* Bloc éditorial de tête */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-site px-6 py-16 md:px-8 md:py-24 grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div>
            <span className="eyebrow-editorial mb-4">Manufacture de literie française · depuis 2013</span>
            <h2 className="display-serif mt-4 text-[2rem] font-normal text-ivoire md:text-[3.4rem]">
              Dormir mieux, <em>vivre plus</em>.
            </h2>
          </div>
          <p className="max-w-md font-sans text-[15px] leading-relaxed text-ivoire/60 md:text-base">
            Bois de forêts françaises. Coton biologique certifié GOTS. Ressorts ensachés assemblés à la main. Chaque nuit, une exigence tenue.
          </p>
        </div>
      </div>

      {/* Section principale */}
      <div className="mx-auto max-w-site px-6 pt-16 md:px-8 md:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.8fr_repeat(5,1fr)] lg:gap-8">
          {/* Bloc marque */}
          <div>
            <div className="text-ivoire">
              <Logo size={28} color="#F0E9DC" />
            </div>
            <p className="mt-4 max-w-xs font-sans text-sm leading-relaxed">{tagline}</p>

            {/* Contact rapide */}
            {(contact.phone || contact.email) && (
              <ul className="mt-6 space-y-3 font-sans text-sm">
                {contact.phone && (
                  <li>
                    <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="group inline-flex items-center gap-3 text-ivoire/80 hover:text-or transition-colors">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 group-hover:border-or">
                        <LineIcon name="phone" size={14} />
                      </span>
                      {contact.phone}
                    </a>
                  </li>
                )}
                {contact.email && (
                  <li>
                    <a href={`mailto:${contact.email}`} className="group inline-flex items-center gap-3 text-ivoire/80 hover:text-or transition-colors">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 group-hover:border-or">
                        <LineIcon name="mail" size={14} />
                      </span>
                      {contact.email}
                    </a>
                  </li>
                )}
              </ul>
            )}

            {/* Socials */}
            {(socials.instagram || socials.facebook || socials.tiktok || socials.youtube) && (
              <ul className="mt-5 flex gap-3">
                {socials.instagram && (
                  <li>
                    <a href={socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-or hover:text-noir">
                      <SocialIcon name="instagram" />
                    </a>
                  </li>
                )}
                {socials.facebook && (
                  <li>
                    <a href={socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-or hover:text-noir">
                      <SocialIcon name="facebook" />
                    </a>
                  </li>
                )}
                {socials.tiktok && (
                  <li>
                    <a href={socials.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-or hover:text-noir">
                      <SocialIcon name="tiktok" />
                    </a>
                  </li>
                )}
                {socials.youtube && (
                  <li>
                    <a href={socials.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-or hover:text-noir">
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
              <h4 className="mb-5 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-or">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {(col.links || []).map((l, j) => (
                  <li key={j}>
                    <Link
                      href={l.link || "#"}
                      className="font-sans text-[14px] text-ivoire/60 transition-colors hover:text-or"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bandeau newsletter éditorial */}
        <div className="mt-16 border-t border-white/10 pt-10 md:mt-20 md:flex md:items-center md:justify-between md:gap-10">
          <div>
            <span className="eyebrow-editorial mb-2">Newsletter</span>
            <h3 className="display-serif mt-3 text-2xl font-normal text-ivoire md:text-3xl">
              Conseils sommeil, <em>rendez-vous</em> et essayages en avant-première.
            </h3>
          </div>
          <Link
            href="/#newsletter"
            className="mt-6 inline-flex items-center gap-3 rounded-pill border border-or bg-transparent px-7 py-3.5 font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-or transition-all hover:bg-or hover:text-noir md:mt-0"
          >
            Je m'inscris
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </Link>
        </div>
      </div>

      {/* Barre bas */}
      <div className="mx-auto mt-16 max-w-site border-t border-white/10 px-6 pb-10 pt-8 md:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-ivoire/40">
            © {new Date().getFullYear()} DreamsFly · Manufacture française
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-1 font-sans text-[12px] text-ivoire/50">
            <li><Link href="/mentions-legales" className="hover:text-or">Mentions légales</Link></li>
            <li><Link href="/cgv" className="hover:text-or">CGV</Link></li>
            <li><Link href="/confidentialite" className="hover:text-or">Confidentialité</Link></li>
            <li><Link href="/cookies" className="hover:text-or">Cookies</Link></li>
          </ul>
          <div className="flex flex-wrap gap-2">
            {payments.map((p) => (
              <span
                key={p}
                className="rounded-full border border-white/15 bg-transparent px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.1em] text-ivoire/70"
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
