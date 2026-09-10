import Link from "next/link";

/**
 * Accès au quiz depuis les pages catégories.
 *
 * Le quiz existe, il est complet — trois parcours distincts matelas, lit et
 * oreiller — mais on ne pouvait y accéder que depuis la page d'accueil et le
 * menu. Un visiteur arrivé directement sur /matelas ou /sommiers depuis
 * Google, c'est-à-dire la majorité du trafic organique, ne savait pas qu'un
 * outil d'aide au choix existait.
 *
 * Le bandeau se place après la grille de produits, à l'endroit précis où
 * l'hésitation se manifeste : le visiteur a vu les modèles, il ne sait pas
 * lequel prendre.
 */
export function QuizBanner({
  question = "Vous ne savez pas quel modèle choisir ?",
  lead = "Répondez à quelques questions et découvrez les modèles adaptés à votre sommeil.",
  label = "Faire le quiz",
}: {
  question?: string;
  lead?: string;
  label?: string;
}) {
  return (
    <section className="mt-16 md:mt-20">
      <div className="flex flex-col gap-6 rounded-[28px] bg-noir px-6 py-10 text-ivoire md:flex-row md:items-center md:justify-between md:px-12 md:py-14">
        <div className="max-w-xl">
          <span className="eyebrow-editorial mb-3 text-or/90">Aide au choix · 1 minute</span>
          <h2 className="display-serif mt-3 text-[1.8rem] font-normal leading-tight md:text-[2.4rem]">
            {question}
          </h2>
          <p className="mt-4 font-sans text-[15px] leading-relaxed text-ivoire/70 md:text-base">
            {lead}
          </p>
        </div>
        <Link
          href="/quiz"
          className="group inline-flex w-fit flex-none items-center gap-3 rounded-pill bg-ivoire px-8 py-4 font-sans text-sm font-semibold text-noir transition-all hover:bg-or hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-noir md:text-base"
        >
          {label}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
