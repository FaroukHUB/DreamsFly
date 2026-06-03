import Link from "next/link";

/**
 * QuickChooser — block « Trouvez votre matelas en 2 clics ».
 * Aide à la décision sur la home + maillage interne fort vers les silos profil.
 */
export function QuickChooser() {
  const profiles = [
    {
      title: "J'ai mal au dos",
      subtitle: "Soutien renforcé, mémoire de forme",
      href: "/matelas-mal-de-dos",
      icon: "🦴",
    },
    {
      title: "Je dors en couple",
      subtitle: "Indépendance de couchage maximale",
      href: "/matelas-couple",
      icon: "💑",
    },
    {
      title: "Je dors chaud",
      subtitle: "Tissus respirants, thermorégulation",
      href: "/matelas-rafraichissant",
      icon: "❄️",
    },
    {
      title: "Petit budget",
      subtitle: "Qualité essentielle à prix juste",
      href: "/matelas-pas-cher",
      icon: "💰",
    },
  ];

  return (
    <section className="mx-auto max-w-site px-8 py-20">
      <div className="mb-10 max-w-2xl">
        <div className="eyebrow mb-3">Aide au choix</div>
        <h2 className="font-sora text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          Quel dormeur êtes-vous ?
        </h2>
        <p className="mt-3 text-lg text-pierre">
          Le bon matelas dépend avant tout de votre profil de sommeil. Faites votre choix ci-dessous.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {profiles.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="group flex flex-col rounded-2xl border border-border bg-ivoire p-6 transition-all hover:-translate-y-1 hover:border-midnight hover:shadow-[0_12px_32px_rgba(15,23,42,0.06)]"
          >
            <div aria-hidden className="mb-3 text-3xl">{p.icon}</div>
            <h3 className="mb-1.5 font-sora text-base font-semibold tracking-tight text-ink group-hover:text-midnight">
              {p.title}
            </h3>
            <p className="text-[13px] leading-relaxed text-pierre">{p.subtitle}</p>
            <span className="mt-4 text-xs font-semibold uppercase tracking-wide text-midnight">
              Voir les matelas →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
