import Link from "next/link";

/**
 * Section « Pourquoi DreamsFly ? » — 4 raisons narratives + storytelling marque.
 * Plus profonde que la strip USP, c'est ici qu'on installe la confiance.
 */
export function WhyDreamsFly() {
  return (
    <section className="border-t border-border bg-sable">
      <div className="mx-auto max-w-site px-8 py-20">
        <div className="mb-12 text-center">
          <div className="eyebrow mb-3">Notre engagement</div>
          <h2 className="font-sora text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Pourquoi DreamsFly ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pierre">
            Le sommeil n'est pas un produit. C'est une expérience. Voici comment nous la construisons.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Reason
            number="01"
            title="Confection française dans nos ateliers"
            text="Tous nos matelas sont assemblés en Europe par des artisans literie experts. Chaque couche est contrôlée, mesurée, validée avant d'arriver chez vous."
          />
          <Reason
            number="02"
            title="Des matériaux nobles, certifiés"
            text="Tissus OEKO-TEX Standard 100, mousses hypoallergéniques, latex naturel sur nos gammes premium. Aucun compromis sur la qualité des matériaux qui touchent votre peau toute la nuit."
          />
          <Reason
            number="03"
            title="Un service humain, jamais une plateforme"
            text="Nos conseillers vous accompagnent avant, pendant et après l'achat. Téléphone, email, WhatsApp ou en magasin — votre interlocuteur reste le même."
            link={{ label: "Nous contacter", href: "/aide/contact" }}
          />
          <Reason
            number="04"
            title="Trois showrooms physiques"
            text="Parce qu'on n'achète pas un matelas sans l'avoir touché, ressenti, testé. Venez essayer nos modèles en boutique et repartez avec celui qui vous correspond vraiment."
            link={{ label: "Trouver un showroom", href: "/magasins" }}
          />
        </div>
      </div>
    </section>
  );
}

function Reason({
  number,
  title,
  text,
  link,
}: {
  number: string;
  title: string;
  text: string;
  link?: { label: string; href: string };
}) {
  return (
    <div className="group rounded-2xl border border-border bg-ivoire p-7 transition-all hover:border-midnight hover:shadow-[0_8px_28px_rgba(15,23,42,0.05)]">
      <div className="mb-4 font-sora text-3xl font-light text-aurora">{number}</div>
      <h3 className="mb-2.5 font-sora text-xl font-semibold tracking-tight text-ink">{title}</h3>
      <p className="text-[15.5px] leading-relaxed text-pierre">{text}</p>
      {link && (
        <Link
          href={link.href}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-midnight hover:text-midnight-dark"
        >
          {link.label}
          <span>→</span>
        </Link>
      )}
    </div>
  );
}
