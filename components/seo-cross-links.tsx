import Link from "next/link";

/**
 * Bloc de maillage interne SEO — rangée discrète de liens croisés entre
 * pages piliers, landings et guides. Fait circuler le "jus" SEO entre les
 * pages sœurs et donne aux crawlers (Google + LLM) des chemins thématiques.
 *
 * Rendu volontairement sobre : une ligne de titre + liens texte hairline,
 * dans la charte existante. Aucune image, aucun composant lourd.
 */
type CrossLink = { href: string; label: string };

export function SeoCrossLinks({ title = "À explorer également", links }: { title?: string; links: CrossLink[] }) {
  if (!links?.length) return null;
  return (
    <nav aria-label="Pages liées" className="mx-auto max-w-site px-6 pb-16 md:px-10 md:pb-20">
      <div className="border-t border-ink/10 pt-8">
        <span className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-taupe">
          <span className="mr-2 text-or">◆</span>
          {title}
        </span>
        <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="font-sans text-[14px] text-ink transition-colors hover:text-or"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
