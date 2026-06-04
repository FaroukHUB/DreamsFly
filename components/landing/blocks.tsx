import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/lib/sanity/image";
import { JsonLd, faqSchema, definedTermSchema } from "@/lib/seo/jsonld";
import { getShellClasses } from "./section-shells";

type Block = any;
type LayoutVariant = "editorial" | "comparative" | "showcase" | "tutorial" | "compact";

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="mt-10 mb-4 font-sora text-3xl font-semibold tracking-tight text-ink">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-7 mb-3 font-sora text-2xl font-semibold tracking-tight text-ink">{children}</h3>,
    normal: ({ children }) => <p className="mb-4 text-[17px] leading-relaxed text-ink/85">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="my-4 space-y-2 pl-5 text-[17px] leading-relaxed text-ink/85 [&>li]:list-disc [&>li]:marker:text-midnight">{children}</ul>,
    number: ({ children }) => <ol className="my-4 space-y-2 pl-5 text-[17px] leading-relaxed text-ink/85 [&>li]:list-decimal [&>li]:marker:text-midnight [&>li]:marker:font-bold">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
    link: ({ value, children }) => (
      <a href={value?.href} className="text-midnight underline decoration-midnight/30 underline-offset-4 hover:decoration-midnight">{children}</a>
    ),
  },
  types: {
    image: ({ value }: any) =>
      value?.asset ? (
        <figure className="my-8 overflow-hidden rounded-2xl shadow-[0_12px_36px_rgba(15,23,42,0.08)]">
          <Image src={urlFor(value).width(1200).quality(85).url()} alt={value.alt || ""} width={1200} height={750} className="h-auto w-full" />
          {value.caption && <figcaption className="mt-2 text-center text-sm italic text-brume">{value.caption}</figcaption>}
        </figure>
      ) : null,
  },
};

export function Sections({
  sections,
  layout = "editorial",
  withShells = false,
}: {
  sections?: Block[];
  layout?: LayoutVariant;
  withShells?: boolean;
}) {
  if (!sections?.length) return null;

  if (!withShells) {
    return (
      <div className="space-y-16">
        {sections.map((b, i) => (
          <BlockRenderer key={`${b._type}-${i}`} block={b} />
        ))}
      </div>
    );
  }

  return (
    <div className="-mx-8">
      {sections.map((b, i) => {
        const { outer, inner } = getShellClasses({ layout, index: i, blockType: b._type });
        return (
          <section key={`${b._type}-${i}`} className={outer}>
            <div className={inner}>
              <BlockRenderer block={b} />
            </div>
          </section>
        );
      })}
    </div>
  );
}

function BlockRenderer({ block: b }: { block: Block }) {
  switch (b._type) {
    case "definitionBlock": return <DefinitionBlock data={b} />;
    case "comparisonTable": return <ComparisonTable data={b} />;
    case "recommendationBlock": return <RecommendationBlock data={b} />;
    case "productsGrid": return <ProductsGridBlock data={b} />;
    case "useCaseBlock": return <UseCaseBlock data={b} />;
    case "faqBlock": return <FaqBlock data={b} />;
    case "tipsBlock": return <TipsBlock data={b} />;
    case "expertQuoteBlock": return <ExpertQuoteBlock data={b} />;
    case "sourcesBlock": return <SourcesBlock data={b} />;
    case "richTextBlock": return <RichTextBlock data={b} />;
    case "ctaBlock": return <CtaBlock data={b} />;
    case "relatedPagesBlock": return <RelatedPagesBlock data={b} />;
    case "conseilDreamsFly": return <ConseilDreamsFly data={b} />;
    case "lifestyleImageBlock": return <LifestyleImageBlock data={b} />;
    default: return null;
  }
}

// ───────────────────────────────────────
// 📸 IMAGE EN SITUATION — 4 layouts
// ───────────────────────────────────────
function LifestyleImageBlock({ data }: { data: Block }) {
  const layout = data.layout || "image-left";
  const imageSrc = data.image?.asset
    ? urlFor(data.image).width(1400).quality(85).url()
    : data.fallbackUrl;
  const alt = data.image?.alt || data.title || "Image lifestyle DreamsFly";

  if (!imageSrc) return null;

  if (layout === "image-solo") {
    return (
      <figure className="relative overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
        <Image
          src={imageSrc}
          alt={alt}
          width={1400}
          height={800}
          className="h-auto w-full"
        />
        {data.tag && (
          <span className="absolute left-5 top-5 rounded-pill bg-ivoire/95 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-midnight backdrop-blur-sm">
            {data.tag}
          </span>
        )}
        {data.title && (
          <figcaption className="mt-4 text-center text-sm italic text-brume">{data.title}</figcaption>
        )}
      </figure>
    );
  }

  if (layout === "image-full") {
    return (
      <section className="relative overflow-hidden rounded-3xl shadow-[0_24px_60px_rgba(15,23,42,0.15)] min-h-[440px]">
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
        <div className="relative z-10 flex h-full min-h-[440px] flex-col justify-end p-8 text-white md:p-12">
          {data.tag && (
            <span className="mb-3 inline-block w-fit rounded-pill bg-aurora/30 px-3 py-1 text-xs font-bold uppercase tracking-widest text-aurora backdrop-blur-sm">
              {data.tag}
            </span>
          )}
          {data.title && (
            <h2 className="max-w-2xl font-sora text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              {data.title}
            </h2>
          )}
          {data.description && (
            <div className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/90 [&>p]:mb-2">
              <PortableText value={data.description} />
            </div>
          )}
        </div>
      </section>
    );
  }

  // image-left ou image-right
  const isRight = layout === "image-right";
  return (
    <section className={`grid items-center gap-10 lg:grid-cols-2 ${isRight ? "lg:grid-flow-col-dense" : ""}`}>
      <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_18px_48px_rgba(15,23,42,0.12)] ${isRight ? "lg:col-start-2" : ""}`}>
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        {data.tag && (
          <span className="absolute left-4 top-4 rounded-pill bg-ivoire/95 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-midnight backdrop-blur-sm">
            {data.tag}
          </span>
        )}
      </div>
      <div className={isRight ? "lg:col-start-1 lg:row-start-1" : ""}>
        {data.title && (
          <h2 className="mb-4 font-sora text-3xl font-semibold leading-tight tracking-tight text-ink md:text-4xl">
            {data.title}
          </h2>
        )}
        {data.description && (
          <div className="prose-content text-[16.5px] leading-relaxed text-pierre">
            <PortableText value={data.description} />
          </div>
        )}
      </div>
    </section>
  );
}

// ───────────────────────────────────────
// DÉFINITION — Card éditoriale avec gradient + grande typo
// ───────────────────────────────────────
function DefinitionBlock({ data }: { data: Block }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-aurora/40 bg-gradient-to-br from-aurora/15 via-ivoire to-aurora/5 p-10 md:p-12">
      {/* Décor */}
      <div aria-hidden className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-aurora/30 blur-3xl" />
      <div aria-hidden className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-or/15 blur-2xl" />

      <div className="relative z-10 max-w-3xl">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-midnight font-sora text-lg font-bold text-white">
            📖
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-midnight">Définition</span>
        </div>
        <h2 className="mb-4 font-sora text-3xl font-semibold leading-tight tracking-tight text-ink md:text-4xl">
          Qu'est-ce qu'un <span className="bg-gradient-to-r from-midnight to-sky bg-clip-text text-transparent">{data.term}</span> ?
        </h2>
        <p className="text-lg leading-relaxed text-ink/85">{data.definition}</p>
      </div>
      <JsonLd data={definedTermSchema(data.term, data.definition)} />
    </section>
  );
}

// ───────────────────────────────────────
// TABLEAU COMPARATIF — colonne DreamsFly highlightée
// ───────────────────────────────────────
function ComparisonTable({ data }: { data: Block }) {
  return (
    <section>
      {data.title && (
        <div className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-pill bg-or/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-or-dark">
            📊 Comparatif
          </div>
          <h2 className="font-sora text-3xl font-semibold tracking-tight text-ink md:text-4xl">{data.title}</h2>
        </div>
      )}
      <div className="overflow-x-auto rounded-2xl border border-border bg-ivoire shadow-[0_8px_32px_rgba(15,23,42,0.05)]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-midnight to-midnight-dark text-white">
              {data.columns?.map((c: string, i: number) => (
                <th key={i} className="border-b border-border p-4 text-left font-sora text-[15px] font-semibold">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows?.map((row: any, i: number) => (
              <tr key={i} className={i % 2 ? "bg-sable" : "bg-ivoire"}>
                <td className="border-b border-border p-4 font-sora font-semibold text-ink">{row.label}</td>
                {row.values?.map((v: string, j: number) => (
                  <td key={j} className="border-b border-border p-4 text-[14.5px] text-pierre">
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ───────────────────────────────────────
// RECOMMANDATIONS — cards profil avec icônes + accent or
// ───────────────────────────────────────
const PROFILE_ICONS: Record<string, string> = {
  couple: "💑",
  studio: "🏙️",
  ami: "🛌",
  étudiant: "🎓",
  enfant: "🧒",
  bébé: "👶",
  adulte: "🧍",
  appart: "🏠",
  morpho: "💪",
  dos: "🦴",
  chaud: "🔥",
  froid: "❄️",
};

function getProfileIcon(profile: string): string {
  const lower = profile.toLowerCase();
  for (const [key, icon] of Object.entries(PROFILE_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return "✨";
}

function RecommendationBlock({ data }: { data: Block }) {
  return (
    <section>
      {data.heading && (
        <div className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-pill bg-aurora/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-midnight">
            🎯 Pour qui ?
          </div>
          <h2 className="font-sora text-3xl font-semibold tracking-tight text-ink md:text-4xl">{data.heading}</h2>
        </div>
      )}
      <div className="grid gap-5 md:grid-cols-2">
        {data.items?.map((it: any, i: number) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-2xl border border-border bg-ivoire p-6 transition-all hover:-translate-y-0.5 hover:border-midnight hover:shadow-[0_12px_32px_rgba(15,23,42,0.06)]"
          >
            <div className="absolute right-0 top-0 h-24 w-24 -translate-y-12 translate-x-12 rounded-full bg-aurora/15 transition-transform group-hover:translate-x-8" />
            <div className="relative">
              <div className="mb-3 flex items-center gap-3">
                <span aria-hidden className="text-3xl">{getProfileIcon(it.profile || "")}</span>
                <h3 className="font-sora text-lg font-semibold text-ink">{it.profile}</h3>
              </div>
              <p className="text-[15px] leading-relaxed text-pierre">{it.advice}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ───────────────────────────────────────
// PRODUITS GRID — déjà visuel, on garde
// ───────────────────────────────────────
function ProductsGridBlock({ data }: { data: Block }) {
  const products = data.manualProducts || [];
  if (!products.length) return null;
  return (
    <section>
      {data.heading && (
        <div className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-pill bg-discount/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-discount">
            🛏️ Notre sélection
          </div>
          <h2 className="font-sora text-3xl font-semibold tracking-tight text-ink md:text-4xl">{data.heading}</h2>
        </div>
      )}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, data.maxItems || 4).map((p: any) => (
          <Link
            key={p._id}
            href={`/matelas/${p.slug}`}
            className="group flex flex-col rounded-2xl border border-border bg-ivoire p-4 transition-all hover:-translate-y-1 hover:border-midnight"
          >
            <div className="relative mb-4 aspect-[5/4] overflow-hidden rounded-xl bg-sable">
              {p.image && (
                <Image src={urlFor(p.image).width(500).url()} alt={p.name} fill sizes="(max-width:768px) 100vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              )}
            </div>
            <h3 className="font-sora text-lg font-semibold text-ink">{p.name}</h3>
            <p className="mb-3 text-[13px] text-pierre">{p.tagline}</p>
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

// ───────────────────────────────────────
// CAS D'USAGE — visuel chambre + texte
// ───────────────────────────────────────
function UseCaseBlock({ data }: { data: Block }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-lin via-sable to-ivoire p-8 md:p-12">
      <div aria-hidden className="absolute right-0 top-0 h-96 w-96 -translate-y-1/3 translate-x-1/3 rounded-full bg-or/10 blur-3xl" />
      <div className="relative">
        {data.heading && (
          <div className="mb-6">
            <div className="mb-2 inline-flex items-center gap-2 rounded-pill bg-or/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-or-dark">
              💡 En pratique
            </div>
            <h2 className="font-sora text-3xl font-semibold tracking-tight text-ink md:text-4xl">{data.heading}</h2>
          </div>
        )}
        <div className="prose-content max-w-none">
          <PortableText value={data.content || []} components={portableTextComponents} />
        </div>
      </div>
    </section>
  );
}

// ───────────────────────────────────────
// FAQ — accordéon avec icônes, hover gradient
// ───────────────────────────────────────
function FaqBlock({ data }: { data: Block }) {
  if (!data.questions?.length) return null;
  return (
    <section>
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-pill bg-midnight/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-midnight">
          ❓ FAQ
        </div>
        <h2 className="font-sora text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          {data.heading || "Questions fréquentes"}
        </h2>
        <p className="mt-3 text-pierre">Les réponses aux questions que vous vous posez avant l'achat.</p>
      </div>
      <div className="space-y-3">
        {data.questions.map((q: any, i: number) => (
          <details
            key={i}
            className="group overflow-hidden rounded-2xl border border-border bg-ivoire transition-all hover:border-midnight"
          >
            <summary className="flex cursor-pointer items-start justify-between gap-4 p-5 font-sora text-base font-semibold text-ink md:text-lg">
              <span className="flex items-start gap-3">
                <span aria-hidden className="font-sora text-sm font-bold text-midnight bg-aurora/30 rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{q.question}</span>
              </span>
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-sable text-midnight transition-transform group-open:rotate-45">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </span>
            </summary>
            <div className="border-t border-border bg-sable/40 px-5 pb-5 pt-4">
              <p className="max-w-3xl pl-10 text-[16px] leading-relaxed text-pierre">{q.answer}</p>
            </div>
          </details>
        ))}
      </div>
      <JsonLd data={faqSchema(data.questions)} />
    </section>
  );
}

// ───────────────────────────────────────
// TIPS — grands numéros gradient
// ───────────────────────────────────────
function TipsBlock({ data }: { data: Block }) {
  return (
    <section>
      {data.heading && (
        <div className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-pill bg-success/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-success">
            ✅ Le mode d'emploi
          </div>
          <h2 className="font-sora text-3xl font-semibold tracking-tight text-ink md:text-4xl">{data.heading}</h2>
        </div>
      )}
      <ol className="space-y-4">
        {data.tips?.map((tip: string, i: number) => (
          <li
            key={i}
            className="group flex items-start gap-5 rounded-2xl border border-border bg-ivoire p-6 transition-all hover:-translate-y-0.5 hover:border-midnight hover:shadow-[0_8px_24px_rgba(15,23,42,0.05)]"
          >
            <span
              aria-hidden
              className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-midnight to-sky font-sora text-2xl font-bold text-white shadow-lg"
            >
              {i + 1}
            </span>
            <span className="pt-2 text-[16.5px] leading-relaxed text-ink">{tip}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

// ───────────────────────────────────────
// CITATION EXPERT — grande card avec photo (E-E-A-T)
// ───────────────────────────────────────
function ExpertQuoteBlock({ data }: { data: Block }) {
  const e = data.expert;
  if (e?.isPlaceholder) return null;
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-midnight to-midnight-dark p-8 text-white md:p-12">
      <div aria-hidden className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-aurora/20 blur-3xl" />
      <div aria-hidden className="absolute -left-10 -bottom-20 h-60 w-60 rounded-full bg-or/15 blur-2xl" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
        {e?.photo && (
          <Image
            src={urlFor(e.photo).width(200).url()}
            alt={e.name}
            width={140}
            height={140}
            className="h-32 w-32 rounded-full border-4 border-aurora/40 object-cover md:h-36 md:w-36"
          />
        )}
        <div className="flex-1">
          <div className="mb-4 text-6xl leading-none text-aurora/60">"</div>
          <blockquote>
            <p className="font-sora text-xl font-light italic leading-relaxed md:text-2xl">{data.quote}</p>
            {e && (
              <footer className="mt-5 flex flex-col">
                <strong className="font-sora text-base font-semibold text-aurora">— {e.name}</strong>
                {e.role && <span className="text-sm text-white/75">{e.role}</span>}
              </footer>
            )}
          </blockquote>
        </div>
      </div>
    </section>
  );
}

// ───────────────────────────────────────
// SOURCES — propre, autorité
// ───────────────────────────────────────
function SourcesBlock({ data }: { data: Block }) {
  if (!data.sources?.length) return null;
  return (
    <aside className="rounded-2xl border border-border bg-sable p-6">
      <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pierre">
        📚 {data.heading || "Sources et références"}
      </div>
      <ul className="space-y-2 text-[14px] text-pierre">
        {data.sources.map((s: any, i: number) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1 text-midnight">→</span>
            <span>
              {s.url ? (
                <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="underline decoration-pierre/30 underline-offset-4 hover:text-midnight">
                  {s.title}
                </a>
              ) : (
                <span>{s.title}</span>
              )}
              {s.publisher && <span className="text-brume">, {s.publisher}</span>}
              {s.year && <span className="text-brume"> ({s.year})</span>}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

// ───────────────────────────────────────
// RICH TEXT — meilleur rendu inline
// ───────────────────────────────────────
function RichTextBlock({ data }: { data: Block }) {
  return (
    <section>
      {data.heading && (
        <h2 className="mb-6 font-sora text-3xl font-semibold tracking-tight text-ink md:text-4xl">{data.heading}</h2>
      )}
      <PortableText value={data.content || []} components={portableTextComponents} />
    </section>
  );
}

// ───────────────────────────────────────
// CTA — gradient + halo + plane
// ───────────────────────────────────────
function CtaBlock({ data }: { data: Block }) {
  const styles: Record<string, { bg: string; text: string; halo: string; btn: string }> = {
    "midnight-dark": {
      bg: "bg-gradient-to-br from-midnight to-midnight-dark",
      text: "text-white",
      halo: "bg-aurora/25",
      btn: "bg-ivoire text-midnight hover:bg-aurora",
    },
    "soft-light": {
      bg: "bg-gradient-to-br from-lin to-sable",
      text: "text-ink",
      halo: "bg-or/20",
      btn: "bg-midnight text-white hover:bg-midnight-dark",
    },
    "gold-accent": {
      bg: "bg-gradient-to-br from-or to-[#D9BB85]",
      text: "text-ink",
      halo: "bg-midnight/15",
      btn: "bg-midnight text-white hover:bg-midnight-dark",
    },
  };
  const s = styles[data.style] || styles["midnight-dark"];

  return (
    <section className={`relative overflow-hidden rounded-3xl p-12 text-center ${s.bg} ${s.text}`}>
      <div aria-hidden className={`absolute -top-32 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full blur-3xl ${s.halo}`} />

      <div className="relative">
        {data.heading && (
          <h2 className="font-sora text-3xl font-semibold leading-tight tracking-tight md:text-4xl">{data.heading}</h2>
        )}
        {data.subtitle && <p className="mx-auto mt-4 max-w-md text-lg opacity-90">{data.subtitle}</p>}
        {data.buttonLink && data.buttonLabel && (
          <Link
            href={data.buttonLink}
            className={`mt-7 inline-flex items-center gap-2 rounded-pill px-8 py-4 font-sora text-base font-semibold transition-all hover:-translate-y-0.5 ${s.btn}`}
          >
            {data.buttonLabel}
            <span>→</span>
          </Link>
        )}
      </div>
    </section>
  );
}

// ───────────────────────────────────────
// PAGES LIÉES — cards visuelles
// ───────────────────────────────────────
function RelatedPagesBlock({ data }: { data: Block }) {
  const links = data.manualLinks || [];
  if (!links.length) return null;
  return (
    <section>
      <h2 className="mb-6 font-sora text-3xl font-semibold tracking-tight text-ink">{data.heading || "Vous aimerez aussi"}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((l: any) => {
          const url = l._type === "guide" ? `/magazine/${l.slug}` : `/${l.slug}`;
          const title = l._type === "guide" ? l.title : l.h1;
          const excerpt = l._type === "guide" ? l.excerpt : l.intro;
          return (
            <Link
              key={l._id}
              href={url}
              className="group rounded-2xl border border-border bg-ivoire p-5 transition-all hover:-translate-y-1 hover:border-midnight"
            >
              <h3 className="mb-2 font-sora text-base font-semibold tracking-tight text-ink group-hover:text-midnight">{title}</h3>
              {excerpt && <p className="line-clamp-2 text-[13.5px] text-pierre">{excerpt}</p>}
              <div className="mt-3 text-xs font-semibold text-midnight">Lire la suite →</div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ───────────────────────────────────────
// 🆕 LE CONSEIL DREAMSFLY — bloc humain signé
// ───────────────────────────────────────
function ConseilDreamsFly({ data }: { data: Block }) {
  return (
    <aside className="relative overflow-hidden rounded-3xl border-2 border-or/40 bg-gradient-to-br from-or/10 via-ivoire to-or/5 p-8 md:p-10">
      <div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-or/20 blur-2xl" />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-start md:gap-8">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-or to-or-dark text-3xl shadow-lg">
          💎
        </div>
        <div className="flex-1">
          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-or-dark">
            {data.label || "Le conseil DreamsFly"}
          </div>
          {data.title && (
            <h3 className="mb-3 font-sora text-xl font-semibold tracking-tight text-ink md:text-2xl">{data.title}</h3>
          )}
          <p className="text-[16.5px] leading-relaxed text-ink">{data.advice}</p>
          {data.signature && (
            <p className="mt-4 text-sm font-medium italic text-pierre">— {data.signature}</p>
          )}
        </div>
      </div>
    </aside>
  );
}
