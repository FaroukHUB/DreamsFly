import Link from "next/link";
import { Logo } from "./logo";

export function Footer({ settings }: { settings?: any }) {
  const columns = settings?.footerColumns || DEFAULT_COLUMNS;
  const tagline = settings?.footerTagline || "Le matelas pensé pour votre meilleur sommeil. Fabriqué en France, livré dans toute la France.";
  const payments = settings?.paymentMethods || ["VISA", "MasterCard", "CB", "PayPal", "Alma 4×"];

  return (
    <footer className="bg-ink px-8 pb-10 pt-20 text-white/70">
      <div className="mx-auto grid max-w-site gap-12 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
        <div>
          <div className="text-white">
            <Logo size={28} color="#FBF9F4" />
          </div>
          <p className="mt-4 max-w-xs text-sm">{tagline}</p>
        </div>
        {columns.map((col: any, i: number) => (
          <div key={i}>
            <h4 className="mb-4 font-sora text-sm font-semibold tracking-wide text-white">
              {col.title}
            </h4>
            <ul className="space-y-2">
              {(col.links || []).map((l: any, j: number) => (
                <li key={j}>
                  <Link href={l.link || "#"} className="text-sm text-white/60 transition-colors hover:text-aurora">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-12 flex max-w-site flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-7 text-xs text-white/40">
        <div>© {new Date().getFullYear()} DreamsFly · Fabriqué avec ♥ en France</div>
        <div className="flex gap-2">
          {payments.map((p: string) => (
            <span key={p} className="rounded bg-white/10 px-2.5 py-1 text-[10.5px] font-semibold">
              {p}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}

const DEFAULT_COLUMNS = [
  {
    title: "Produits",
    links: [
      { label: "Matelas", link: "/matelas" },
      { label: "Sommiers", link: "/sommiers" },
      { label: "Oreillers", link: "/oreillers" },
      { label: "Linge de lit", link: "/linge-de-lit" },
      { label: "Packs", link: "/packs" },
    ],
  },
  {
    title: "Aide",
    links: [
      { label: "FAQ", link: "/aide/faq" },
      { label: "Livraison", link: "/services/livraison" },
      { label: "Essai 100 nuits", link: "/services/essai-100-nuits" },
      { label: "Garantie", link: "/services/garantie" },
      { label: "Contact", link: "/aide/contact" },
    ],
  },
  {
    title: "Marque",
    links: [
      { label: "Qui sommes-nous", link: "/marque/qui-sommes-nous" },
      { label: "Nos experts", link: "/marque/nos-experts" },
      { label: "Engagements", link: "/marque/engagements" },
      { label: "Magazine", link: "/guides" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "Mentions légales", link: "/mentions-legales" },
      { label: "CGV", link: "/cgv" },
      { label: "Confidentialité", link: "/confidentialite" },
      { label: "Cookies", link: "/cookies" },
    ],
  },
];
