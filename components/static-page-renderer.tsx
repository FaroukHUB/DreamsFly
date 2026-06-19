import Link from "next/link";
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/lib/sanity/image";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="mt-10 mb-4 font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-7 mb-3 font-sora text-xl font-semibold tracking-tight text-ink md:text-2xl">{children}</h3>,
    normal: ({ children }) => <p className="mb-4 text-[16px] leading-relaxed text-ink/85 md:text-[17px]">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="my-4 space-y-2 pl-5 text-[16px] leading-relaxed text-ink/85 [&>li]:list-disc [&>li]:marker:text-midnight">{children}</ul>,
    number: ({ children }) => <ol className="my-4 space-y-2 pl-5 text-[16px] leading-relaxed text-ink/85 [&>li]:list-decimal [&>li]:marker:text-midnight">{children}</ol>,
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
        <figure className="my-8 overflow-hidden rounded-2xl">
          <Image src={urlFor(value).width(1200).quality(85).url()} alt={value.alt || ""} width={1200} height={750} className="h-auto w-full" />
          {value.caption && <figcaption className="mt-2 text-center text-sm italic text-brume">{value.caption}</figcaption>}
        </figure>
      ) : null,
    calloutBlock: ({ value }: any) => (
      <aside className="my-8 rounded-2xl border border-sky/30 bg-aurora/15 p-6">
        {value.title && <h4 className="mb-2 font-sora text-base font-semibold text-midnight">💡 {value.title}</h4>}
        <p className="text-[15.5px] leading-relaxed text-ink">{value.text}</p>
      </aside>
    ),
    faqItem: ({ value }: any) => (
      <details className="group my-4 overflow-hidden rounded-2xl border border-border bg-ivoire transition-all hover:border-midnight">
        <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 font-sora text-base font-semibold text-ink md:text-lg">
          <span>{value.question}</span>
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-sable text-midnight transition-transform group-open:rotate-45">+</span>
        </summary>
        <div className="border-t border-border bg-sable/40 px-5 pb-5 pt-4">
          <p className="text-[15.5px] leading-relaxed text-pierre">{value.answer}</p>
        </div>
      </details>
    ),
  },
};

export type StaticPageProps = {
  page: any;
  breadcrumbs?: { name: string; url: string }[];
};

export function StaticPageContent({ page, breadcrumbs }: StaticPageProps) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 md:px-8 md:py-16">
      {breadcrumbs && (
        <nav aria-label="Fil d'Ariane" className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-pierre">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-brume">/</span>}
              {i === breadcrumbs.length - 1 ? (
                <span className="font-medium text-ink">{b.name}</span>
              ) : (
                <Link href={b.url} className="hover:text-midnight">{b.name}</Link>
              )}
            </span>
          ))}
        </nav>
      )}

      <header className="mb-10">
        <h1 className="font-sora text-3xl font-semibold leading-tight tracking-tight text-ink md:text-5xl">{page.title}</h1>
        {page.excerpt && <p className="mt-5 text-lg leading-relaxed text-pierre md:text-xl">{page.excerpt}</p>}
      </header>

      <article>
        <PortableText value={page.body || []} components={components} />
      </article>
    </main>
  );
}
