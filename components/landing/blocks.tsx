/**
 * Renderer des sections d'une landingPage Sanity.
 * Chaque bloc est rendu différemment selon son `_type`.
 * Tous incluent leur fragment de schema.org si pertinent.
 */
import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/lib/sanity/image";
import { JsonLd, faqSchema, definedTermSchema } from "@/lib/seo/jsonld";

type Block = any;

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="mt-12 mb-4 font-sora text-3xl font-semibold tracking-tight">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 mb-3 font-sora text-2xl font-semibold tracking-tight">{children}</h3>,
    normal: ({ children }) => <p className="mb-4 text-[16.5px] leading-relaxed text-pierre">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="my-4 space-y-2 pl-5 text-[16px] leading-relaxed text-pierre [&>li]:list-disc">{children}</ul>,
    number: ({ children }) => <ol className="my-4 space-y-2 pl-5 text-[16px] leading-relaxed text-pierre [&>li]:list-decimal">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
    link: ({ value, children }) => (
      <a href={value?.href} className="text-midnight underline decoration-midnight/30 underline-offset-4 hover:decoration-midnight">
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: any) =>
      value?.asset ? (
        <figure className="my-8 overflow-hidden rounded-2xl">
          <Image
            src={urlFor(value).width(1200).quality(85).url()}
            alt={value.alt || ""}
            width={1200}
            height={750}
            className="h-auto w-full"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-brume">
              {value.caption}
            </figcaption>
          )}
        </figure>
      ) : null,
  },
};

import { getShellClasses } from "./section-shells";

type LayoutVariant = "editorial" | "comparative" | "showcase" | "tutorial" | "compact";

export function Sections({
  sections,
  layout = "editorial",
  withShells = false,
}: {
  sections?: Block[];
  layout?: LayoutVariant;
  /** Si true, chaque section reçoit un shell coloré (utilisé sur les landing). */
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

  // Avec shells : alternance de fonds et de containers selon le layout
  return (
    <div className="-mx-8">
      {sections.map((b, i) => {
        const { outer, inner } = getShellClasses({
          layout,
          index: i,
          blockType: b._type,
        });
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
    case "definitionBlock":
      return <DefinitionBlock data={b} />;
    case "comparisonTable":
      return <ComparisonTable data={b} />;
    case "recommendationBlock":
      return <RecommendationBlock data={b} />;
    case "productsGrid":
      return <ProductsGridBlock data={b} />;
    case "useCaseBlock":
      return <UseCaseBlock data={b} />;
    case "faqBlock":
      return <FaqBlock data={b} />;
    case "tipsBlock":
      return <TipsBlock data={b} />;
    case "expertQuoteBlock":
      return <ExpertQuoteBlock data={b} />;
    case "sourcesBlock":
      return <SourcesBlock data={b} />;
    case "richTextBlock":
      return <RichTextBlock data={b} />;
    case "ctaBlock":
      return <CtaBlock data={b} />;
    case "relatedPagesBlock":
      return <RelatedPagesBlock data={b} />;
    default:
      return null;
  }
}

// ───────────────────────────────────────
// Blocks
// ───────────────────────────────────────

function DefinitionBlock({ data }: { data: Block }) {
  return (
    <section className="rounded-3xl border border-border bg-sable p-8">
      <h2 className="font-sora text-2xl font-semibold tracking-tight text-ink">
        Qu'est-ce qu'un {data.term} ?
      </h2>
      <p className="mt-3 text-[17px] leading-relaxed text-ink">{data.definition}</p>
      <JsonLd data={definedTermSchema(data.term, data.definition)} />
    </section>
  );
}

function ComparisonTable({ data }: { data: Block }) {
  return (
    <section>
      {data.title && <h2 className="mb-6 font-sora text-3xl font-semibold tracking-tight">{data.title}</h2>}
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-sable">
            <tr>
              {data.columns?.map((c: string, i: number) => (
                <th key={i} className="border-b border-border p-4 text-left font-sora font-semibold text-ink">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows?.map((row: any, i: number) => (
              <tr key={i} className={i % 2 ? "bg-sable/40" : ""}>
                <td className="border-b border-border p-4 font-semibold text-ink">{row.label}</td>
                {row.values?.map((v: string, j: number) => (
                  <td key={j} className="border-b border-border p-4 text-pierre">
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

function RecommendationBlock({ data }: { data: Block }) {
  return (
    <section>
      {data.heading && <h2 className="mb-6 font-sora text-3xl font-semibold tracking-tight">{data.heading}</h2>}
      <div className="grid gap-4 sm:grid-cols-2">
        {data.items?.map((it: any, i: number) => (
          <div key={i} className="rounded-2xl border border-border bg-ivoire p-6">
            <h3 className="mb-2 font-sora text-lg font-semibold text-ink">{it.profile}</h3>
            <p className="text-[15px] leading-relaxed text-pierre">{it.advice}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductsGridBlock({ data }: { data: Block }) {
  const products = data.manualProducts || [];
  if (!products.length) return null;
  return (
    <section>
      {data.heading && <h2 className="mb-6 font-sora text-3xl font-semibold tracking-tight">{data.heading}</h2>}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, data.maxItems || 4).map((p: any) => (
          <Link
            key={p._id}
            href={`/matelas/${p.slug}`}
            className="group flex flex-col rounded-2xl border border-border bg-ivoire p-4 transition-all hover:-translate-y-1 hover:border-midnight"
          >
            <div className="relative mb-4 aspect-[5/4] overflow-hidden rounded-xl bg-sable">
              {p.image && (
                <Image
                  src={urlFor(p.image).width(500).url()}
                  alt={p.name}
                  fill
                  sizes="(max-width:768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
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

function UseCaseBlock({ data }: { data: Block }) {
  return (
    <section className="rounded-3xl bg-lin p-8 md:p-12">
      {data.heading && <h2 className="mb-4 font-sora text-3xl font-semibold tracking-tight">{data.heading}</h2>}
      <div className="prose-content">
        <PortableText value={data.content || []} components={portableTextComponents} />
      </div>
    </section>
  );
}

function FaqBlock({ data }: { data: Block }) {
  if (!data.questions?.length) return null;
  return (
    <section>
      <h2 className="mb-8 font-sora text-3xl font-semibold tracking-tight">
        {data.heading || "Questions fréquentes"}
      </h2>
      <div className="divide-y divide-border border-y border-border">
        {data.questions.map((q: any, i: number) => (
          <details key={i} className="group py-5">
            <summary className="flex cursor-pointer items-start justify-between gap-4 font-sora text-lg font-semibold text-ink">
              {q.question}
              <span className="text-2xl font-light text-midnight transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-pierre">{q.answer}</p>
          </details>
        ))}
      </div>
      <JsonLd data={faqSchema(data.questions)} />
    </section>
  );
}

function TipsBlock({ data }: { data: Block }) {
  return (
    <section>
      {data.heading && <h2 className="mb-6 font-sora text-3xl font-semibold tracking-tight">{data.heading}</h2>}
      <ol className="space-y-4">
        {data.tips?.map((tip: string, i: number) => (
          <li key={i} className="flex gap-4 rounded-2xl border border-border bg-ivoire p-5">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-midnight font-sora text-sm font-bold text-white">
              {i + 1}
            </span>
            <span className="text-[16px] leading-relaxed text-ink">{tip}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ExpertQuoteBlock({ data }: { data: Block }) {
  const e = data.expert;
  if (e?.isPlaceholder) return null; // E-E-A-T : pas d'expert factice
  return (
    <blockquote className="rounded-3xl border-l-4 border-midnight bg-sable p-8">
      <p className="font-sora text-xl italic leading-relaxed text-ink md:text-2xl">« {data.quote} »</p>
      {e && (
        <footer className="mt-4 text-sm font-semibold text-midnight">
          — {e.name}
          {e.role && <span className="font-normal text-pierre">, {e.role}</span>}
        </footer>
      )}
    </blockquote>
  );
}

function SourcesBlock({ data }: { data: Block }) {
  if (!data.sources?.length) return null;
  return (
    <aside className="rounded-2xl border border-border bg-sable p-6">
      <h3 className="mb-3 font-sora text-base font-semibold tracking-wide uppercase text-pierre">
        {data.heading || "Sources et références"}
      </h3>
      <ul className="space-y-1.5 text-[14px] text-pierre">
        {data.sources.map((s: any, i: number) => (
          <li key={i}>
            {s.url ? (
              <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="underline decoration-pierre/30 underline-offset-4 hover:text-midnight">
                {s.title}
              </a>
            ) : (
              <span>{s.title}</span>
            )}
            {s.publisher && <span className="text-brume">, {s.publisher}</span>}
            {s.year && <span className="text-brume"> ({s.year})</span>}
          </li>
        ))}
      </ul>
    </aside>
  );
}

function RichTextBlock({ data }: { data: Block }) {
  return (
    <section>
      {data.heading && <h2 className="mb-6 font-sora text-3xl font-semibold tracking-tight">{data.heading}</h2>}
      <PortableText value={data.content || []} components={portableTextComponents} />
    </section>
  );
}

function CtaBlock({ data }: { data: Block }) {
  const styles: Record<string, string> = {
    "midnight-dark": "bg-midnight text-white",
    "soft-light": "bg-lin text-ink",
    "gold-accent": "bg-or text-ink",
  };
  return (
    <section className={`rounded-3xl p-12 text-center ${styles[data.style] || styles["midnight-dark"]}`}>
      {data.heading && <h2 className="font-sora text-3xl font-semibold tracking-tight md:text-4xl">{data.heading}</h2>}
      {data.subtitle && <p className="mx-auto mt-4 max-w-md text-lg opacity-90">{data.subtitle}</p>}
      {data.buttonLink && data.buttonLabel && (
        <Link
          href={data.buttonLink}
          className="mt-6 inline-flex items-center gap-2 rounded-pill bg-ivoire px-7 py-3.5 font-sans text-base font-semibold text-ink hover:bg-aurora transition-colors"
        >
          {data.buttonLabel} →
        </Link>
      )}
    </section>
  );
}

function RelatedPagesBlock({ data }: { data: Block }) {
  const links = data.manualLinks || [];
  if (!links.length) return null;
  return (
    <section>
      <h2 className="mb-6 font-sora text-3xl font-semibold tracking-tight">{data.heading || "Vous aimerez aussi"}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((l: any) => {
          const url =
            l._type === "guide" ? `/magazine/${l.slug}` : `/${l.slug}`;
          const title = l._type === "guide" ? l.title : l.h1;
          const excerpt = l._type === "guide" ? l.excerpt : l.intro;
          return (
            <Link
              key={l._id}
              href={url}
              className="group rounded-2xl border border-border bg-ivoire p-5 transition-all hover:-translate-y-1 hover:border-midnight"
            >
              <h3 className="mb-2 font-sora text-base font-semibold tracking-tight text-ink group-hover:text-midnight">
                {title}
              </h3>
              {excerpt && <p className="line-clamp-2 text-[13.5px] text-pierre">{excerpt}</p>}
              <div className="mt-3 text-xs font-semibold text-midnight">Lire la suite →</div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
