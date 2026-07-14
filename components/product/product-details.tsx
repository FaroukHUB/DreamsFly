import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/lib/sanity/image";
import type { CareStep, Advantage, Audience, Tip } from "@/lib/product-defaults";
import { deliveryInfo } from "@/lib/product-defaults";

/** Points forts en badges. */
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

/** Image lifestyle plein cadre. */
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

/** AVANTAGES — 6 icônes courtes, grille 2×3 mobile / 3×2 desktop. */
export function ProductAdvantages({ advantages }: { advantages?: Advantage[] }) {
  if (!advantages?.length) return null;
  return (
    <section>
      <div className="eyebrow mb-3">Ses avantages</div>
      <h2 className="mb-8 font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        Ce que vous allez ressentir
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
        {advantages.map((a, i) => (
          <div key={i} className="flex flex-col rounded-2xl border border-border bg-white p-5 md:p-6">
            <span aria-hidden className="mb-3 text-3xl">{a.icon}</span>
            <h3 className="font-sora text-base font-semibold text-ink md:text-lg">{a.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-pierre">{a.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** POUR QUI — cartes horizontales avec icône. */
export function ProductAudiences({ audiences }: { audiences?: Audience[] }) {
  if (!audiences?.length) return null;
  return (
    <section className="rounded-3xl bg-sable p-6 md:p-10">
      <div className="mb-6 max-w-2xl md:mb-8">
        <div className="eyebrow mb-2">Pour qui ?</div>
        <h2 className="font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
          Est-ce fait pour vous ?
        </h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2 md:gap-4">
        {audiences.map((a, i) => (
          <div key={i} className="flex items-start gap-4 rounded-2xl bg-white p-4 md:p-5">
            <span aria-hidden className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-aurora text-xl md:h-12 md:w-12">
              {a.icon}
            </span>
            <div>
              <h3 className="font-sora text-base font-semibold text-ink md:text-lg">{a.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-pierre">{a.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Conseils d'expert avec source citée. */
export function ProductTips({ tips }: { tips?: Tip[] }) {
  if (!tips?.length) return null;
  return (
    <section>
      <div className="eyebrow mb-3">Le mot des experts</div>
      <h2 className="mb-2 font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        Ce qu'on aurait aimé savoir avant
      </h2>
      <p className="mb-8 max-w-2xl text-pierre">
        Conseils issus des recommandations d'organismes de référence — INSV, INSERM, ANSES, ADEME.
      </p>
      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        {tips.map((t, i) => (
          <div key={i} className="flex flex-col rounded-2xl border border-border bg-ivoire p-5 md:p-6">
            <div className="mb-2 flex items-center gap-3">
              {t.icon && <span aria-hidden className="text-2xl">{t.icon}</span>}
              <h3 className="font-sora text-lg font-semibold text-ink">{t.title}</h3>
            </div>
            {t.text && <p className="text-sm leading-relaxed text-pierre md:text-base">{t.text}</p>}
            {t.source && (
              <p className="mt-4 border-t border-border pt-3 text-[11px] uppercase tracking-widest text-brume md:text-xs">
                Source :{" "}
                {t.source.url ? (
                  <a href={t.source.url} target="_blank" rel="noopener noreferrer nofollow" className="text-midnight underline decoration-dotted underline-offset-2 hover:decoration-solid">
                    {t.source.label}
                  </a>
                ) : (
                  <span className="text-pierre">{t.source.label}</span>
                )}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/** ENTRETIEN en 3-4 étapes cartes (icone + fréquence + titre + texte court). */
export function ProductCareSteps({ steps }: { steps?: CareStep[] }) {
  if (!steps?.length) return null;
  return (
    <section>
      <div className="eyebrow mb-3">Entretien</div>
      <h2 className="mb-2 font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        Bien l'entretenir en 4 gestes
      </h2>
      <p className="mb-8 max-w-2xl text-pierre">
        Rien de compliqué. Juste des habitudes qui doublent la durée de vie.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col rounded-2xl border border-border bg-white p-5">
            <span aria-hidden className="mb-3 text-3xl">{s.icon}</span>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-or">
              {s.frequency}
            </div>
            <h3 className="font-sora text-base font-semibold text-ink">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-pierre">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Portable Text riche (fallback pour careGuide Sanity si rempli). */
export function ProductCareGuide({ careGuide }: { careGuide?: any }) {
  if (!careGuide?.length) return null;
  return (
    <section>
      <div className="eyebrow mb-3">Guide d'entretien</div>
      <h2 className="mb-4 font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        Bien entretenir votre produit
      </h2>
      <div className="prose-content max-w-3xl">
        <PortableText value={careGuide} />
      </div>
    </section>
  );
}

/** FAQ produit — details/summary. */
export function ProductFaq({ faq }: { faq?: { question: string; answer: string }[] }) {
  if (!faq?.length) return null;
  return (
    <section>
      <div className="eyebrow mb-3">FAQ</div>
      <h2 className="mb-2 font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        {faq.length} questions fréquentes
      </h2>
      <p className="mb-8 max-w-2xl text-pierre">
        Ce que les acheteurs demandent le plus — réponses directes, sans langue de bois.
      </p>
      <div className="space-y-3">
        {faq.map((f, i) => (
          <details
            key={i}
            className="group rounded-2xl border border-border bg-white p-5 open:border-midnight md:p-6"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
              <h3 className="font-sora text-base font-semibold text-ink md:text-lg">{f.question}</h3>
              <span aria-hidden className="mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full border border-border text-midnight transition-transform group-open:rotate-45">
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

/** CTA secondaire éditorial. */
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

/** LIVRAISON — encart factuel. */
export function ProductDelivery() {
  return (
    <section className="grid gap-4 rounded-3xl border border-border bg-ivoire p-6 md:grid-cols-[auto_1fr] md:gap-8 md:p-10">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-midnight text-3xl text-white md:h-20 md:w-20 md:text-4xl">
        🚚
      </div>
      <div>
        <div className="eyebrow mb-2">Livraison</div>
        <h2 className="mb-3 font-sora text-xl font-semibold tracking-tight text-ink md:text-2xl">
          {deliveryInfo.price} · {deliveryInfo.delay}
        </h2>
        <ul className="grid gap-2 text-sm text-pierre md:grid-cols-2 md:text-base">
          {deliveryInfo.perks.map((p, i) => (
            <li key={i} className="flex items-start gap-2">
              <span aria-hidden className="mt-0.5 text-vert-menthe">✓</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** GARANTIE — encart avec ce qui est couvert / exclu. */
export function ProductWarranty({ warranty }: { warranty: { duration: string; covers: string[]; excludes: string[] } }) {
  return (
    <section>
      <div className="eyebrow mb-3">Garantie</div>
      <h2 className="mb-6 font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        Garantie {warranty.duration}
      </h2>
      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        <div className="rounded-2xl border-2 border-vert-menthe/40 bg-vert-menthe/5 p-5 md:p-6">
          <div className="mb-3 flex items-center gap-2 font-sora text-base font-semibold text-ink">
            <span aria-hidden className="text-lg">✅</span> Ce qui est couvert
          </div>
          <ul className="space-y-2 text-sm text-pierre md:text-base">
            {warranty.covers.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <span aria-hidden className="mt-0.5 text-vert-menthe">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border-2 border-brume/40 bg-sable/60 p-5 md:p-6">
          <div className="mb-3 flex items-center gap-2 font-sora text-base font-semibold text-ink">
            <span aria-hidden className="text-lg">✋</span> Ce qui n'est pas couvert
          </div>
          <ul className="space-y-2 text-sm text-pierre md:text-base">
            {warranty.excludes.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <span aria-hidden className="mt-0.5 text-brume">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** COMPOSITION — placeholder image/vidéo à gauche, liste couches à droite. */
export function ProductComposition({
  composition,
  compositionImage,
  compositionVideo,
  name,
}: {
  composition?: { label: string }[];
  compositionImage?: any;
  compositionVideo?: { asset?: { url?: string } };
  name?: string;
}) {
  if (!composition?.length) return null;

  const hasMedia = compositionImage?.asset || compositionVideo?.asset?.url;

  return (
    <section>
      <div className="eyebrow mb-3">Anatomie du produit</div>
      <h2 className="mb-2 font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        Composition couche par couche
      </h2>
      <p className="mb-8 max-w-2xl text-pierre">
        Du tissu d'accueil au support de base — chaque couche joue un rôle précis.
      </p>
      <div className="grid gap-6 md:grid-cols-[1fr_1.2fr] md:gap-10">
        {/* Media / placeholder */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-midnight to-midnight-dark md:sticky md:top-24 md:self-start">
          {compositionVideo?.asset?.url ? (
            <video
              src={compositionVideo.asset.url}
              autoPlay muted loop playsInline
              className="absolute inset-0 h-full w-full object-cover"
              aria-hidden="true"
            />
          ) : compositionImage?.asset ? (
            <Image
              src={urlFor(compositionImage).width(800).quality(85).url()}
              alt={compositionImage.alt || `Coupe transversale ${name || "du produit"}`}
              fill sizes="(max-width:768px) 100vw, 40vw"
              className="object-cover"
            />
          ) : (
            <CompositionPlaceholder />
          )}
        </div>

        {/* Liste des couches */}
        <ol className="space-y-3">
          {composition.map((c, i) => (
            <li key={i} className="flex items-start gap-4 rounded-2xl border border-border bg-white p-5">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-midnight font-sora text-sm font-bold text-white">
                {i + 1}
              </span>
              <span className="pt-1 text-[15px] leading-relaxed text-ink">{c.label}</span>
            </li>
          ))}
        </ol>
      </div>
      {!hasMedia && (
        <p className="mt-4 text-center text-xs text-brume">
          Photo de coupe technique à venir prochainement.
        </p>
      )}
    </section>
  );
}

/** Placeholder décoratif pour la composition — illustration SVG stylisée de couches. */
function CompositionPlaceholder() {
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center p-8">
      <svg viewBox="0 0 200 250" className="h-full w-full opacity-90">
        <defs>
          <linearGradient id="layer1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#BFE4F2" />
            <stop offset="1" stopColor="#7FD4F5" />
          </linearGradient>
          <linearGradient id="layer2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#C8A876" />
            <stop offset="1" stopColor="#B08F5F" />
          </linearGradient>
        </defs>
        <rect x="20" y="30" width="160" height="20" rx="4" fill="#F5EFE6" opacity="0.9" />
        <rect x="20" y="55" width="160" height="30" rx="4" fill="url(#layer1)" opacity="0.9" />
        <rect x="20" y="90" width="160" height="60" rx="4" fill="url(#layer2)" opacity="0.75" />
        <g stroke="white" strokeWidth="0.8" opacity="0.6">
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1={20 + (i * 160) / 11} y1="150" x2={20 + (i * 160) / 11} y2="200" />
          ))}
        </g>
        <rect x="20" y="150" width="160" height="50" rx="4" fill="#172554" opacity="0.6" />
        <rect x="20" y="205" width="160" height="15" rx="4" fill="#0F172A" opacity="0.7" />
        <text x="100" y="240" textAnchor="middle" fill="white" fontSize="8" opacity="0.7" fontFamily="system-ui">
          Coupe schématique — visuel réel à venir
        </text>
      </svg>
    </div>
  );
}

/** Spécifications techniques adaptatives. */
export function ProductSpecs({ product }: { product: any }) {
  const specs = getSpecsForType(product);
  if (!specs.length) return null;
  return (
    <section>
      <div className="eyebrow mb-3">Fiche technique</div>
      <h2 className="mb-6 font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        Caractéristiques
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

/** Description longue portable text. */
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

/** Grille des produits liés. */
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
