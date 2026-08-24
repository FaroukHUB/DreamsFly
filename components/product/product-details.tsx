import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/lib/sanity/image";
import type { CareStep, Advantage, Audience, Tip } from "@/lib/product-defaults";
import { deliveryInfo } from "@/lib/product-defaults";
import { LineIcon, iconNameForEmoji } from "@/components/line-icon";

/** Points forts en badges. */
export function ProductHighlights({ highlights }: { highlights?: { icon?: string; label?: string }[] }) {
  if (!highlights?.length) return null;
  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      {highlights.map((h, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-2 rounded-pill border border-ink/15 bg-ivoire px-4 py-2 font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-noir md:px-5"
        >
          {h.icon && <LineIcon name={iconNameForEmoji(h.icon)} size={13} className="text-or" strokeWidth={1.4} />}
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
      <span className="eyebrow-editorial on-cream mb-3">Ses avantages</span>
      <h2 className="mb-8 display-serif on-cream text-[1.8rem] font-normal md:text-[2.6rem]">
        Ce que vous allez ressentir
      </h2>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-6">
        {advantages.map((a, i) => (
          <div key={i} className="flex flex-col rounded-[20px] border border-ink/10 bg-ivoire p-6 md:p-7">
            <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-noir">
              <LineIcon name={iconNameForEmoji(a.icon)} size={20} strokeWidth={1.3} />
            </span>
            <h3 className="display-serif on-cream text-[1.15rem] font-normal md:text-[1.35rem]">{a.title}</h3>
            <p className="mt-2 font-sans text-[14px] leading-relaxed text-taupe">{a.text}</p>
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
    <section className="rounded-[28px] bg-creme p-8 md:p-12">
      <div className="mb-10 max-w-2xl md:mb-12">
        <span className="eyebrow-editorial on-cream mb-2">Pour qui ?</span>
        <h2 className="display-serif on-cream mt-3 text-[1.8rem] font-normal md:text-[2.6rem]">
          Est-ce fait pour <em>vous</em> ?
        </h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2 md:gap-6">
        {audiences.map((a, i) => (
          <div key={i} className="flex items-start gap-5 rounded-[20px] bg-ivoire p-6">
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-ink/15 text-noir">
              <LineIcon name={iconNameForEmoji(a.icon)} size={20} strokeWidth={1.3} />
            </span>
            <div>
              <h3 className="display-serif on-cream text-[1.15rem] font-normal md:text-[1.35rem]">{a.title}</h3>
              <p className="mt-1 font-sans text-[14px] leading-relaxed text-taupe">{a.text}</p>
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
      <span className="eyebrow-editorial on-cream mb-3">Le mot des experts</span>
      <h2 className="mb-2 display-serif on-cream text-[1.8rem] font-normal md:text-[2.6rem]">
        Ce qu'on aurait aimé savoir avant
      </h2>
      <p className="mb-8 max-w-2xl text-pierre">
        Conseils issus des recommandations d'organismes de référence — INSV, INSERM, ANSES, ADEME.
      </p>
      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        {tips.map((t, i) => (
          <div key={i} className="flex flex-col rounded-[20px] border border-ink/10 bg-ivoire p-7 md:p-8">
            <div className="mb-3 flex items-center gap-3">
              {t.icon && (
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-noir">
                  <LineIcon name={iconNameForEmoji(t.icon)} size={16} strokeWidth={1.3} />
                </span>
              )}
              <h3 className="display-serif on-cream text-[1.2rem] font-normal">{t.title}</h3>
            </div>
            {t.text && <p className="font-sans text-[14.5px] leading-relaxed text-taupe md:text-[15px]">{t.text}</p>}
            {t.source && (
              <p className="mt-5 border-t border-ink/10 pt-3 font-sans text-[10.5px] uppercase tracking-[0.16em] text-taupe">
                <span className="mr-2 text-or">◆</span>Source :{" "}
                {t.source.url ? (
                  <a href={t.source.url} target="_blank" rel="noopener noreferrer nofollow" className="text-noir underline decoration-or decoration-2 underline-offset-2">
                    {t.source.label}
                  </a>
                ) : (
                  <span className="text-taupe">{t.source.label}</span>
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
      <span className="eyebrow-editorial on-cream mb-3">Entretien</span>
      <h2 className="mb-2 display-serif on-cream text-[1.8rem] font-normal md:text-[2.6rem]">
        Bien l'entretenir en 4 gestes
      </h2>
      <p className="mb-8 max-w-2xl text-pierre">
        Rien de compliqué. Juste des habitudes qui doublent la durée de vie.
      </p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col rounded-[20px] border border-ink/10 bg-ivoire p-6">
            <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-noir">
              <LineIcon name={iconNameForEmoji(s.icon)} size={18} strokeWidth={1.3} />
            </span>
            <div className="mb-2 font-sans text-[10.5px] font-medium uppercase tracking-[0.18em] text-or">
              {s.frequency}
            </div>
            <h3 className="display-serif on-cream text-[1.05rem] font-normal">{s.title}</h3>
            <p className="mt-2 font-sans text-[14px] leading-relaxed text-taupe">{s.text}</p>
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
      <span className="eyebrow-editorial on-cream mb-3">Guide d'entretien</span>
      <h2 className="mb-4 display-serif on-cream text-[1.8rem] font-normal md:text-[2.6rem]">
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
      <span className="eyebrow-editorial on-cream mb-3">FAQ</span>
      <h2 className="mb-2 display-serif on-cream text-[1.8rem] font-normal md:text-[2.6rem]">
        {faq.length} questions fréquentes
      </h2>
      <p className="mb-8 max-w-2xl text-pierre">
        Ce que les acheteurs demandent le plus — réponses directes, sans langue de bois.
      </p>
      <div className="divide-y divide-ink/10 border-y border-ink/10">
        {faq.map((f, i) => (
          <details key={i} className="group py-6">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
              <h3 className="display-serif on-cream text-[1.15rem] font-normal md:text-[1.35rem]">{f.question}</h3>
              <span aria-hidden className="mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-full text-or transition-transform group-open:rotate-45">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 5v14M5 12h14"/></svg>
              </span>
            </summary>
            <p className="mt-4 max-w-[64ch] font-sans text-[15px] leading-relaxed text-taupe">{f.answer}</p>
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
    <section className="rounded-[28px] bg-noir p-10 text-ivoire md:p-14">
      <div className="grid gap-8 md:grid-cols-[2fr_1fr] md:items-center">
        <div>
          <h2 className="display-serif text-[1.8rem] font-normal text-ivoire md:text-[2.6rem]">
            {cta.title}
          </h2>
          {cta.subtitle && <p className="mt-4 font-serif text-[17px] italic leading-relaxed text-ivoire/70 md:text-[19px]">{cta.subtitle}</p>}
        </div>
        <div className="flex md:justify-end">
          <Link
            href={cta.ctaLink}
            className="inline-flex items-center gap-3 rounded-pill bg-ivoire px-7 py-3.5 font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-noir transition-all hover:bg-or hover:-translate-y-px"
          >
            {cta.ctaLabel}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

/** LIVRAISON — encart factuel (accepte override Sanity). */
export function ProductDelivery({ delivery }: { delivery?: { price?: string; delay?: string; perks?: string[] } }) {
  const d = {
    price: delivery?.price || deliveryInfo.price,
    delay: delivery?.delay || deliveryInfo.delay,
    perks: delivery?.perks?.length ? delivery.perks : deliveryInfo.perks,
  };
  return (
    <section className="grid gap-6 rounded-[28px] border border-ink/10 bg-ivoire p-8 md:grid-cols-[auto_1fr] md:gap-10 md:p-12">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-noir text-or md:h-20 md:w-20">
        <LineIcon name="truck" size={26} strokeWidth={1.3} />
      </div>
      <div>
        <span className="eyebrow-editorial on-cream mb-2">Livraison</span>
        <h2 className="display-serif on-cream mt-3 text-[1.5rem] font-normal md:text-[2rem]">
          {d.price} <span className="text-or">·</span> {d.delay}
        </h2>
        <ul className="mt-5 grid gap-3 font-sans text-[14px] leading-relaxed text-taupe md:grid-cols-2 md:text-[15px]">
          {d.perks.map((p, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span aria-hidden className="mt-0.5 text-or">◆</span>
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
      <span className="eyebrow-editorial on-cream mb-3">Garantie</span>
      <h2 className="mb-6 display-serif on-cream text-[1.8rem] font-normal md:text-[2.6rem]">
        Garantie {warranty.duration}
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[24px] border border-ink/10 bg-ivoire p-7 md:p-8">
          <div className="mb-4 flex items-center gap-3 display-serif on-cream text-[1.15rem] font-normal">
            <LineIcon name="shield" size={22} className="text-or" />
            Ce qui est couvert
          </div>
          <ul className="space-y-2.5 font-sans text-[14.5px] leading-relaxed text-taupe md:text-[15px]">
            {warranty.covers.map((c, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span aria-hidden className="mt-0.5 text-or">◆</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[24px] border border-ink/10 bg-creme p-7 md:p-8">
          <div className="mb-4 flex items-center gap-3 display-serif on-cream text-[1.15rem] font-normal">
            <LineIcon name="alert" size={22} className="text-taupe" />
            Ce qui n'est pas couvert
          </div>
          <ul className="space-y-2.5 font-sans text-[14.5px] leading-relaxed text-taupe md:text-[15px]">
            {warranty.excludes.map((c, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span aria-hidden className="mt-0.5 text-taupe/50">◇</span>
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
      <span className="eyebrow-editorial on-cream mb-3">Anatomie du produit</span>
      <h2 className="mb-2 display-serif on-cream text-[1.8rem] font-normal md:text-[2.6rem]">
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
        <ol className="divide-y divide-ink/10 border-y border-ink/10">
          {composition.map((c, i) => (
            <li key={i} className="flex items-start gap-5 py-5">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-noir font-serif text-[15px] font-normal text-noir">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="pt-1 font-serif text-[17px] leading-relaxed text-ink">{c.label}</span>
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
      <span className="eyebrow-editorial on-cream mb-3">Fiche technique</span>
      <h2 className="mb-6 display-serif on-cream text-[1.8rem] font-normal md:text-[2.6rem]">
        Caractéristiques
      </h2>
      <div className="overflow-hidden rounded-[24px] border border-ink/10 bg-ivoire">
        <table className="w-full text-sm">
          <tbody>
            {specs.map((s, i) => (
              <tr key={i} className={i % 2 ? "bg-creme/40" : "bg-ivoire"}>
                <th className="w-1/3 border-b border-ink/8 p-5 text-left font-serif text-[15px] font-normal text-noir">
                  {s.label}
                </th>
                <td className="border-b border-ink/8 p-5 font-sans text-[14px] text-taupe">{s.value}</td>
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
      <h2 className="mb-4 display-serif on-cream text-[1.8rem] font-normal md:text-[2.6rem]">
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
      <h2 className="mb-6 display-serif on-cream text-[1.8rem] font-normal md:text-[2.6rem]">
        Vous aimerez aussi
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-8">
        {products.map((p) => (
          <Link
            key={p._id}
            href={`${basePath}/${p.slug}`}
            className="group flex flex-col rounded-[24px] border border-ink/10 bg-ivoire p-5 transition-all duration-500 hover:-translate-y-1 hover:border-noir/40 hover:shadow-[0_24px_50px_-20px_rgba(11,11,15,0.2)]"
          >
            <div className="relative mb-5 aspect-[5/4] overflow-hidden rounded-[16px] bg-creme">
              {p.image && (
                <Image
                  src={urlFor(p.image).width(600).url()}
                  alt={p.name}
                  fill
                  sizes="(max-width:1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[900ms] group-hover:scale-105"
                />
              )}
            </div>
            <h3 className="display-serif on-cream text-[1.1rem] font-normal">{p.name}</h3>
            <p className="mt-2 line-clamp-2 font-sans text-[13px] leading-relaxed text-taupe">{p.tagline}</p>
            <div className="mt-4 flex items-baseline gap-2 border-t border-ink/10 pt-3">
              <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-taupe">Dès</span>
              <span className="font-serif text-[1.25rem] font-normal text-noir">{p.minPrice}€</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
