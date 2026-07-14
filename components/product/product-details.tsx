import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/lib/sanity/image";

/** Points forts en badges — 3 à 5 arguments courts. */
export function ProductHighlights({ highlights }: { highlights?: { icon?: string; label?: string }[] }) {
  if (!highlights?.length) return null;
  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      {highlights.map((h, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-2 rounded-pill border border-border bg-ivoire px-3.5 py-2 text-xs font-medium text-ink md:px-4 md:text-sm"
        >
          {h.icon && <span aria-hidden>{h.icon}</span>}
          {h.label}
        </span>
      ))}
    </div>
  );
}

/** Image lifestyle plein cadre entre buy box et sections. */
export function ProductLifestyle({ image, name }: { image?: any; name?: string }) {
  if (!image?.asset) return null;
  return (
    <section className="-mx-6 md:mx-0">
      <div className="relative aspect-[16/9] overflow-hidden md:aspect-[21/9] md:rounded-3xl">
        <Image
          src={urlFor(image).width(1800).quality(85).url()}
          alt={image.alt || name || ""}
          fill sizes="100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}

/** Conseils d'expert — 3 à 6 astuces. */
export function ProductTips({ tips }: { tips?: { icon?: string; title?: string; text?: string }[] }) {
  if (!tips?.length) return null;
  return (
    <section>
      <div className="eyebrow mb-3">Nos conseils</div>
      <h2 className="mb-2 font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        Le mot des experts DreamsFly
      </h2>
      <p className="mb-8 max-w-2xl text-pierre">
        Ce qu'on aurait aimé savoir avant de choisir — issu de 6 ans d'échanges clients.
      </p>
      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        {tips.map((t, i) => (
          <div key={i} className="rounded-2xl border border-border bg-ivoire p-5 md:p-6">
            <div className="mb-2 flex items-center gap-3">
              {t.icon && <span aria-hidden className="text-2xl">{t.icon}</span>}
              <h3 className="font-sora text-lg font-semibold text-ink md:text-xl">{t.title}</h3>
            </div>
            {t.text && <p className="text-sm leading-relaxed text-pierre md:text-base">{t.text}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

/** Guide d'entretien (portable text). */
export function ProductCareGuide({ careGuide }: { careGuide?: any }) {
  if (!careGuide?.length) return null;
  return (
    <section>
      <div className="eyebrow mb-3">Entretien</div>
      <h2 className="mb-4 font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        Bien entretenir votre produit
      </h2>
      <div className="prose-content max-w-3xl">
        <PortableText value={careGuide} />
      </div>
    </section>
  );
}

/** FAQ produit — details/summary + JSON-LD injecté séparément. */
export function ProductFaq({ faq }: { faq?: { question: string; answer: string }[] }) {
  if (!faq?.length) return null;
  return (
    <section>
      <div className="eyebrow mb-3">FAQ</div>
      <h2 className="mb-2 font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        Questions fréquentes
      </h2>
      <p className="mb-8 max-w-2xl text-pierre">
        Les questions qui reviennent le plus sur ce produit — réponses directes.
      </p>
      <div className="space-y-3">
        {faq.map((f, i) => (
          <details
            key={i}
            className="group rounded-2xl border border-border bg-white p-5 open:border-midnight md:p-6"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
              <h3 className="font-sora text-base font-semibold text-ink md:text-lg">{f.question}</h3>
              <span className="mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full border border-border text-midnight transition-transform group-open:rotate-45">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </span>
            </summary>
            <p className="mt-4 text-sm leading-relaxed text-pierre md:text-base">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/** CTA secondaire éditorial (rdv showroom, guide, contact…). */
export function ProductExtraCta({
  cta,
}: {
  cta?: { title?: string; subtitle?: string; ctaLabel?: string; ctaLink?: string };
}) {
  if (!cta?.title || !cta?.ctaLabel || !cta?.ctaLink) return null;
  return (
    <section className="rounded-3xl border border-border bg-gradient-to-br from-midnight to-midnight-dark p-6 text-white md:p-10">
      <div className="grid gap-6 md:grid-cols-[2fr_1fr] md:items-center">
        <div>
          <h2 className="font-sora text-2xl font-semibold tracking-tight md:text-3xl">
            {cta.title}
          </h2>
          {cta.subtitle && <p className="mt-3 text-base text-white/85 md:text-lg">{cta.subtitle}</p>}
        </div>
        <div className="flex md:justify-end">
          <Link
            href={cta.ctaLink}
            className="inline-flex items-center gap-2 rounded-pill bg-ivoire px-6 py-3.5 font-sora text-sm font-semibold text-midnight transition-all hover:bg-aurora hover:-translate-y-px md:px-7 md:text-base"
          >
            {cta.ctaLabel}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Composition du matelas en couches. */
export function ProductComposition({ composition }: { composition?: { label: string }[] }) {
  if (!composition?.length) return null;
  return (
    <section>
      <h2 className="mb-2 font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        Composition couche par couche
      </h2>
      <p className="mb-8 max-w-2xl text-pierre">
        Du tissu d'accueil à la base de soutien, chaque couche joue un rôle précis dans votre confort.
      </p>
      <ol className="space-y-3">
        {composition.map((c, i) => (
          <li key={i} className="flex items-start gap-4 rounded-2xl border border-border bg-ivoire p-5">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-midnight font-sora text-sm font-bold text-white">
              {i + 1}
            </span>
            <span className="text-[15.5px] leading-relaxed text-ink">{c.label}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Spécifications techniques adaptatives selon productType. */
export function ProductSpecs({ product }: { product: any }) {
  const specs = getSpecsForType(product);
  if (!specs.length) return null;

  return (
    <section>
      <h2 className="mb-6 font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        Caractéristiques techniques
      </h2>
      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <tbody>
            {specs.map((s, i) => (
              <tr key={i} className={i % 2 ? "bg-sable" : "bg-ivoire"}>
                <th className="w-1/3 border-b border-border p-4 text-left font-sora font-semibold text-ink">
                  {s.label}
                </th>
                <td className="border-b border-border p-4 text-pierre">{s.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function getSpecsForType(product: any): { label: string; value: string | number }[] {
  const pType = product.productType || "matelas";
  const raw: { label: string; value?: string | number | boolean | null }[] = [];

  if (pType === "matelas") {
    raw.push(
      { label: "Type", value: product.type ? TYPE_LABELS[product.type] : undefined },
      { label: "Fermeté", value: product.firmness ? FIRMNESS_LABELS[product.firmness] : undefined },
      { label: "Accueil", value: product.welcome },
      { label: "Épaisseur", value: product.thicknessCm ? `${product.thicknessCm} cm` : undefined },
      { label: "Mémoire de forme", value: product.features?.memoireDeForme ? "Oui" : undefined },
      { label: "Hypoallergénique", value: product.features?.hypoallergenique ? "Oui" : undefined },
      { label: "Certification", value: product.features?.oekoTex ? "OEKO-TEX Standard 100" : undefined },
      { label: "Indépendance de couchage", value: product.features?.independanceCouchage },
      { label: "Fabrication", value: product.features?.fabriqueEurope ? "Europe" : undefined },
      { label: "Garantie", value: product.features?.garantieAns ? `${product.features.garantieAns} ans` : undefined },
    );
  } else if (pType === "lit") {
    raw.push(
      { label: "Matière", value: product.litMaterial ? LIT_MATERIAL_LABELS[product.litMaterial] : undefined },
      { label: "Couleur", value: product.litColor },
      { label: "Type de coffre", value: product.litCoffreType ? LIT_COFFRE_LABELS[product.litCoffreType] : undefined },
      { label: "Capacité du coffre", value: product.litCoffreCapacityL ? `${product.litCoffreCapacityL} L` : undefined },
      { label: "Force des vérins", value: product.litVerinsForceKg ? `${product.litVerinsForceKg} kg / vérin` : undefined },
      { label: "Tête de lit", value: product.litIncludes?.headboard ? "Incluse" : undefined },
      { label: "Sommier", value: product.litIncludes?.sommier ? "Inclus" : undefined },
      { label: "Matelas", value: product.litIncludes?.matelas ? "Inclus" : "Non inclus" },
      { label: "Pieds", value: product.litIncludes?.feet ? "Inclus" : undefined },
      {
        label: "Montage",
        value: product.litAssembly?.required
          ? `${product.litAssembly.timeMin || "~45"} min · ${product.litAssembly.peopleNeeded || 2} personnes${product.litAssembly.toolsIncluded ? " · outils fournis" : ""}`
          : "Aucun montage",
      },
    );
  } else if (pType === "sommier") {
    raw.push(
      { label: "Type", value: product.sommierType ? SOMMIER_TYPE_LABELS[product.sommierType] : undefined },
      { label: "Nombre de lattes", value: product.sommierLattes },
      { label: "Épaisseur", value: product.thicknessCm ? `${product.thicknessCm} cm` : undefined },
      { label: "Pieds inclus", value: product.sommierFeet?.included ? "Oui" : undefined },
      { label: "Hauteur des pieds", value: product.sommierFeet?.heightCm ? `${product.sommierFeet.heightCm} cm` : undefined },
      { label: "Matériau pieds", value: product.sommierFeet?.material },
    );
  } else if (pType === "oreiller") {
    raw.push(
      { label: "Garnissage", value: product.oreillerFilling ? OREILLER_FILL_LABELS[product.oreillerFilling] : undefined },
      { label: "Forme", value: product.oreillerShape ? OREILLER_SHAPE_LABELS[product.oreillerShape] : undefined },
      { label: "Dimensions", value: product.oreillerDimensions },
      { label: "Fermeté", value: product.firmness ? FIRMNESS_LABELS[product.firmness] : undefined },
      { label: "Épaisseur", value: product.thicknessCm ? `${product.thicknessCm} cm` : undefined },
      { label: "Lavable en machine", value: product.oreillerCare?.washable ? `Oui — ${product.oreillerCare.washTemperatureC || 40}°C max` : undefined },
      { label: "Housse amovible", value: product.oreillerCare?.removableCover ? "Oui" : undefined },
    );
  }

  return raw
    .filter((s) => s.value !== undefined && s.value !== null && s.value !== "" && s.value !== false)
    .map((s) => ({ label: s.label, value: s.value as string | number }));
}

const TYPE_LABELS: Record<string, string> = {
  "mousse-polyurethane": "Mousse polyuréthane",
  "mousse-hr-ressorts": "Mousse HR + ressorts ensachés",
  "memoire-ressorts": "Mémoire de forme + ressorts ensachés",
  "mousse-ressorts": "Mousse + ressorts ensachés",
};
const FIRMNESS_LABELS: Record<string, string> = {
  moelleux: "Moelleux",
  equilibre: "Équilibré",
  "mi-ferme": "Mi-ferme",
  ferme: "Ferme",
  "tres-ferme": "Très ferme",
};
const LIT_MATERIAL_LABELS: Record<string, string> = {
  velours: "Velours",
  "tissu-trame": "Tissu tramé",
  lin: "Lin",
  capitonne: "Capitonné",
  "simili-cuir": "Simili cuir",
};
const LIT_COFFRE_LABELS: Record<string, string> = {
  frontal: "Ouverture frontale (pieds du lit)",
  lateral: "Ouverture latérale",
  aucun: "Lit classique (sans coffre)",
};
const SOMMIER_TYPE_LABELS: Record<string, string> = {
  "lattes-apparentes": "À lattes apparentes",
  "lattes-recouvertes": "À lattes recouvertes",
  tapissier: "Tapissier semi-rigide",
  ressorts: "À ressorts",
  coffre: "Coffre avec rangement",
};
const OREILLER_FILL_LABELS: Record<string, string> = {
  "duvet-oie": "Duvet d'oie",
  plumes: "Plumes",
  "memoire-forme": "Mousse à mémoire de forme",
  latex: "Latex naturel",
  "fibre-recyclee": "Fibre polyester recyclée",
  microfibre: "Microfibre",
};
const OREILLER_SHAPE_LABELS: Record<string, string> = {
  rectangulaire: "Rectangulaire classique",
  carre: "Carré",
  ergonomique: "Ergonomique (vague / cervical)",
  traversin: "Traversin",
};

/** Description longue produit en portable text. */
export function ProductDescription({ description, title }: { description?: any; title?: string }) {
  if (!description?.length) return null;
  return (
    <section>
      <h2 className="mb-4 font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        {title || "Pourquoi choisir ce produit ?"}
      </h2>
      <div className="prose-content max-w-3xl">
        <PortableText value={description} />
      </div>
    </section>
  );
}

/** Grille des produits liés — basePath adapté au type. */
export function RelatedProducts({ products, basePath = "/matelas" }: { products: any[]; basePath?: string }) {
  if (!products?.length) return null;
  return (
    <section>
      <h2 className="mb-6 font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        Vous aimerez aussi
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <Link
            key={p._id}
            href={`${basePath}/${p.slug}`}
            className="group flex flex-col rounded-2xl border border-border bg-ivoire p-4 transition-all hover:-translate-y-1 hover:border-midnight"
          >
            <div className="relative mb-4 aspect-[5/4] overflow-hidden rounded-xl bg-sable">
              {p.image && (
                <Image
                  src={urlFor(p.image).width(500).url()}
                  alt={p.name}
                  fill
                  sizes="(max-width:1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <h3 className="font-sora text-base font-semibold text-ink">{p.name}</h3>
            <p className="mb-3 line-clamp-2 text-[13px] text-pierre">{p.tagline}</p>
            <div className="mt-auto flex items-baseline gap-2 border-t border-border pt-3">
              <span className="text-[11px] text-brume">Dès</span>
              <span className="font-sora text-lg font-bold text-discount">{p.minPrice} €</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
