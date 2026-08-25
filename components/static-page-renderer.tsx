import Link from "next/link";
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/lib/sanity/image";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="mt-14 mb-5 font-serif text-[1.7rem] font-normal leading-tight tracking-tight text-noir md:text-[2.2rem]">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-10 mb-3 font-serif text-[1.3rem] font-normal leading-tight text-noir md:text-[1.55rem]">{children}</h3>,
    normal: ({ children }) => <p className="mb-5 font-sans text-[16px] leading-[1.75] text-ink/85 md:text-[17px]">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="my-5 space-y-2 pl-5 font-sans text-[16px] leading-relaxed text-ink/85 [&>li]:list-disc [&>li]:marker:text-or">{children}</ul>,
    number: ({ children }) => <ol className="my-5 space-y-2 pl-5 font-sans text-[16px] leading-relaxed text-ink/85 [&>li]:list-decimal [&>li]:marker:text-or">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-medium text-noir">{children}</strong>,
    link: ({ value, children }) => (
      <a href={value?.href} className="text-noir underline decoration-or decoration-2 underline-offset-4 transition-colors hover:text-or">{children}</a>
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
      <aside className="my-10 border-l-2 border-or bg-creme/40 px-6 py-5">
        {value.title && (
          <h4 className="mb-2 font-serif text-[18px] font-normal text-noir">
            <span className="mr-2 text-or">◆</span>
            {value.title}
          </h4>
        )}
        <p className="font-sans text-[15px] leading-relaxed text-ink">{value.text}</p>
      </aside>
    ),
    htmlBlock: ({ value }: any) =>
      value?.html ? (
        <div
          className="df-html-block relative my-12 w-screen"
          style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
          dangerouslySetInnerHTML={{ __html: value.html }}
        />
      ) : null,
    faqItem: ({ value }: any) => (
      <details className="group my-4 border-b border-ink/10">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-serif text-[19px] font-normal text-noir md:text-[21px]">
          <span className="flex-1">{value.question}</span>
          <span className="text-or transition-transform group-open:rotate-45" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 5v14M5 12h14"/></svg>
          </span>
        </summary>
        <p className="mb-6 max-w-[64ch] whitespace-pre-line font-sans text-[15px] leading-relaxed text-taupe">
          {value.answer}
        </p>
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
    <main className="mx-auto max-w-3xl px-6 py-14 md:px-8 md:py-20">
      {breadcrumbs && (
        <nav aria-label="Fil d'Ariane" className="mb-10 flex flex-wrap items-center gap-2 font-sans text-[11px] uppercase tracking-[0.14em] text-taupe">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="opacity-40">/</span>}
              {i === breadcrumbs.length - 1 ? (
                <span className="text-ink">{b.name}</span>
              ) : (
                <Link href={b.url} className="transition-colors hover:text-or">{b.name}</Link>
              )}
            </span>
          ))}
        </nav>
      )}

      <header className="mb-14">
        {breadcrumbs && breadcrumbs.length > 1 && (
          <span className="eyebrow-editorial on-cream mb-3">{breadcrumbs[breadcrumbs.length - 2].name}</span>
        )}
        <h1 className="display-serif on-cream mt-4 text-[2.2rem] font-normal md:text-[3.6rem]">{page.title}</h1>
        {page.excerpt && <p className="mt-6 font-serif text-[18px] italic leading-relaxed text-taupe md:text-[22px]">{page.excerpt}</p>}
      </header>

      <article>
        <PortableText value={page.body || []} components={components} />
      </article>
    </main>
  );
}
