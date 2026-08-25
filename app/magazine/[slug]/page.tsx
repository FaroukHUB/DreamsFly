import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { sanityClient } from "@/lib/sanity/client";
import { guideBySlugQuery, allGuideSlugsQuery } from "@/lib/sanity/guide-queries";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  JsonLd,
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  howToSchema,
  organizationSchema,
} from "@/lib/seo/jsonld";
import { urlFor } from "@/lib/sanity/image";

export const revalidate = 300;

type Params = { slug: string };

export async function generateStaticParams() {
  if (!sanityClient) return [];
  try {
    const slugs = await sanityClient.fetch<{ slug: string }[]>(allGuideSlugsQuery);
    return slugs.filter((s) => s.slug).map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  if (!sanityClient) return buildMetadata({ path: `/magazine/${slug}`, noindex: true });
  const g = await sanityClient.fetch<any>(guideBySlugQuery, { slug }).catch(() => null);
  if (!g) return buildMetadata({ path: `/magazine/${slug}`, noindex: true });

  const image = g.coverImage ? urlFor(g.coverImage).width(1200).height(630).url() : undefined;

  return buildMetadata({
    title: g.metaTitle || g.title,
    description: g.metaDescription || g.excerpt,
    path: `/magazine/${slug}`,
    image,
    type: "article",
    publishedTime: g.publishedAt,
    modifiedTime: g.updatedAt || g.publishedAt,
  });
}

const ARTICLE_TYPE_LABELS: Record<string, string> = {
  "buying-guide": "Guide d'achat",
  "how-to": "Tutoriel",
  comparison: "Comparatif",
  health: "Santé du sommeil",
  tips: "Conseils",
  review: "Banc d'essai",
};

const portableComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="mt-12 mb-4 font-sora text-3xl font-semibold tracking-tight text-ink">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 mb-3 font-sora text-2xl font-semibold tracking-tight text-ink">{children}</h3>,
    normal: ({ children }) => <p className="mb-5 text-[17px] leading-relaxed text-ink">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="my-8 rounded-2xl border-l-4 border-midnight bg-sable p-6 italic text-ink">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="my-5 space-y-2 pl-5 text-[17px] leading-relaxed text-ink [&>li]:list-disc">{children}</ul>,
    number: ({ children }) => <ol className="my-5 space-y-2 pl-5 text-[17px] leading-relaxed text-ink [&>li]:list-decimal">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        className="text-midnight underline decoration-midnight/30 underline-offset-4 hover:decoration-midnight"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: any) =>
      value?.asset ? (
        <figure className="my-10 overflow-hidden rounded-2xl">
          <Image
            src={urlFor(value).width(1200).quality(85).url()}
            alt={value.alt || ""}
            width={1200}
            height={700}
            className="h-auto w-full"
          />
          {value.alt && (
            <figcaption className="mt-2 text-center text-sm text-brume">{value.alt}</figcaption>
          )}
        </figure>
      ) : null,
    calloutBlock: ({ value }: any) => (
      <aside className="my-10 border-l-2 border-or bg-creme/40 px-6 py-5">
        {value.title && (
          <h4 className="mb-2 font-serif text-[18px] font-normal text-noir">
            <span className="mr-2 text-or">◆</span>{value.title}
          </h4>
        )}
        <p className="font-sans text-[15px] leading-relaxed text-ink">{value.text}</p>
      </aside>
    ),
    htmlBlock: ({ value }: any) =>
      value?.html ? (
        // Sort du max-w-3xl parent pour occuper toute la largeur du viewport,
        // laisse au HTML custom la place de faire ses grilles / tables larges.
        // HTML sanitizé (DOMPurify) : styles et iframes allowlistés OK, scripts jamais.
        <div
          className="df-html-block relative my-12 w-screen"
          style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(value.html) }}
        />
      ) : null,
    howToStep: ({ value }: any) => (
      <div className="my-6 flex gap-5 rounded-2xl border border-border bg-ivoire p-5">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-midnight font-sora text-sm font-bold text-white">
          •
        </span>
        <div>
          {value.name && <h4 className="font-sora text-lg font-semibold text-ink">{value.name}</h4>}
          {value.text && <p className="mt-1 text-[16px] leading-relaxed text-pierre">{value.text}</p>}
          {value.image && (
            <Image
              src={urlFor(value.image).width(800).url()}
              alt={value.name || "Illustration de l'étape"}
              width={800}
              height={450}
              className="mt-3 rounded-xl"
            />
          )}
        </div>
      </div>
    ),
  },
};

export default async function GuidePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (!sanityClient) notFound();

  const [g, siteSettings] = await Promise.all([
    sanityClient.fetch<any>(guideBySlugQuery, { slug }).catch(() => null),
    sanityClient.fetch<any>(siteSettingsQuery).catch(() => null),
  ]);

  if (!g) notFound();

  const breadcrumbs = [
    { name: "Accueil", url: "/" },
    { name: "Magazine", url: "/magazine" },
    { name: g.title, url: `/magazine/${slug}` },
  ];

  const date = g.publishedAt ? new Date(g.publishedAt) : null;
  const updated = g.updatedAt ? new Date(g.updatedAt) : null;
  const fmt = (d: Date) =>
    d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  const isHowTo = g.articleType === "how-to";
  const howToSteps = g.body?.filter((b: any) => b._type === "howToStep").map((s: any) => ({
    name: s.name,
    text: s.text,
    image: s.image ? urlFor(s.image).width(800).url() : undefined,
  })) || [];

  return (
    <>
      <Header settings={siteSettings} />

      <main className="mx-auto max-w-3xl px-6 py-14 md:px-8 md:py-20">
        <nav aria-label="Fil d'Ariane" className="mb-10 flex flex-wrap items-center gap-2 font-sans text-[11px] uppercase tracking-[0.14em] text-taupe">
          <Link href="/" className="transition-colors hover:text-or">Accueil</Link>
          <span className="opacity-40">/</span>
          <Link href="/magazine" className="transition-colors hover:text-or">Magazine</Link>
          <span className="opacity-40">/</span>
          <span className="text-ink line-clamp-1">{g.title}</span>
        </nav>

        <article>
          <header className="mb-14">
            {g.articleType && (
              <span className="eyebrow-editorial on-cream mb-3">
                {ARTICLE_TYPE_LABELS[g.articleType as string] || "Article"}
              </span>
            )}
            <h1 className="display-serif on-cream mt-4 text-[2.2rem] font-normal md:text-[3.6rem]">
              {g.title}
            </h1>
            {g.excerpt && (
              <p className="mt-6 font-serif text-[18px] italic leading-relaxed text-taupe md:text-[22px]">{g.excerpt}</p>
            )}

            {/* Auteur + date */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-pierre">
              {g.author?.name && !g.author?.isPlaceholder && (
                <span>
                  Par <strong className="text-ink">{g.author.name}</strong>
                  {g.author.role && <span>, {g.author.role}</span>}
                </span>
              )}
              {date && <time dateTime={g.publishedAt}>Publié le {fmt(date)}</time>}
              {updated && updated > date! && (
                <time dateTime={g.updatedAt}>Mis à jour le {fmt(updated)}</time>
              )}
            </div>
          </header>

          {/* Image cover */}
          {g.coverImage && (
            <div className="mb-12 overflow-hidden rounded-3xl">
              <Image
                src={urlFor(g.coverImage).width(1400).quality(90).url()}
                alt={g.title}
                width={1400}
                height={800}
                className="h-auto w-full"
                priority
              />
            </div>
          )}

          {/* Corps */}
          <div className="prose-content">
            <PortableText value={g.body || []} components={portableComponents} />
          </div>

          {/* FAQ */}
          {g.faq?.length > 0 && (
            <section className="mt-16">
              <h2 className="mb-8 font-sora text-3xl font-semibold tracking-tight text-ink">Questions fréquentes</h2>
              <div className="divide-y divide-border border-y border-border">
                {g.faq.map((q: any, i: number) => (
                  <details key={i} className="group py-5">
                    <summary className="flex cursor-pointer items-start justify-between gap-4 font-sora text-lg font-semibold text-ink">
                      {q.question}
                      <span className="text-2xl font-light text-midnight transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-pierre">{q.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Sources */}
          {g.sources?.length > 0 && (
            <aside className="mt-16 rounded-2xl border border-border bg-sable p-6">
              <h3 className="mb-3 font-sora text-base font-semibold uppercase tracking-wide text-pierre">
                Sources et références
              </h3>
              <ul className="space-y-1.5 text-sm text-pierre">
                {g.sources.map((s: any, i: number) => (
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
          )}

          {/* E-E-A-T : auteur card */}
          {g.author?.name && !g.author?.isPlaceholder && (
            <footer className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-border bg-ivoire p-6 sm:flex-row sm:items-center">
              {g.author.photo && (
                <Image
                  src={urlFor(g.author.photo).width(120).url()}
                  alt={g.author.name}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full object-cover"
                />
              )}
              <div>
                <div className="font-sora text-base font-semibold text-ink">{g.author.name}</div>
                {g.author.role && <div className="text-sm text-pierre">{g.author.role}</div>}
                {g.author.bioShort && (
                  <p className="mt-2 max-w-prose text-sm text-pierre">{g.author.bioShort}</p>
                )}
              </div>
            </footer>
          )}

          {/* Articles liés */}
          {g.relatedGuides?.length > 0 && (
            <section className="mt-16 border-t border-border pt-10">
              <h2 className="mb-6 font-sora text-2xl font-semibold tracking-tight">À lire aussi</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {g.relatedGuides.map((r: any) => (
                  <Link
                    key={r._id}
                    href={`/magazine/${r.slug}`}
                    className="group flex flex-col rounded-2xl border border-border bg-ivoire p-5 transition-all hover:-translate-y-1 hover:border-midnight"
                  >
                    <h3 className="font-sora text-base font-semibold tracking-tight text-ink group-hover:text-midnight">
                      {r.title}
                    </h3>
                    {r.excerpt && <p className="mt-2 line-clamp-2 text-[13.5px] text-pierre">{r.excerpt}</p>}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>

      <Footer settings={siteSettings} />

      {/* JSON-LD */}
      <JsonLd data={organizationSchema({ name: "DreamsFly" })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={articleSchema({
          title: g.title,
          description: g.metaDescription || g.excerpt,
          image: g.coverImage ? urlFor(g.coverImage).width(1200).url() : undefined,
          url: `/magazine/${slug}`,
          publishedAt: g.publishedAt,
          updatedAt: g.updatedAt,
          author:
            g.author?.name && !g.author?.isPlaceholder
              ? { name: g.author.name }
              : undefined,
          reviewedBy:
            g.reviewer?.name && !g.reviewer?.isPlaceholder
              ? { name: g.reviewer.name }
              : undefined,
        })}
      />
      <JsonLd data={faqSchema(g.faq || [])} />
      {isHowTo && howToSteps.length > 0 && (
        <JsonLd
          data={howToSchema({
            name: g.title,
            description: g.excerpt,
            steps: howToSteps,
          })}
        />
      )}
    </>
  );
}
