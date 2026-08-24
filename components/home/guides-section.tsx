import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { defaultGuidesSection } from "@/lib/homepage-defaults";

type Item = { image?: any; title?: string; summary?: string; ctaLabel?: string; ctaLink?: string };
type Data = { eyebrow?: string; title?: string; subtitle?: string; items?: Item[] };

export function GuidesSection({ data }: { data?: Data }) {
  const d = {
    eyebrow: data?.eyebrow || defaultGuidesSection.eyebrow,
    title: data?.title || defaultGuidesSection.title,
    subtitle: data?.subtitle || defaultGuidesSection.subtitle,
    items: data?.items?.length ? data.items : defaultGuidesSection.items,
  };

  return (
    <section className="section-cream section-editorial">
      <div className="mx-auto max-w-site">
        <div className="mb-14 flex flex-col justify-between gap-6 reveal md:mb-20 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="eyebrow-editorial on-cream mb-3">{d.eyebrow}</span>
            <h2 className="display-serif on-cream mt-5 text-[2.4rem] font-normal md:text-[4rem]">{d.title}</h2>
            <p className="mt-6 font-sans text-[15px] leading-relaxed text-taupe md:text-[17px]">{d.subtitle}</p>
          </div>
          <Link href="/magazine" className="hidden border-b border-noir pb-1 font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-noir transition-colors hover:text-or hover:border-or md:inline-block">
            Tous les guides
          </Link>
        </div>
        <div className="rule-cream mb-12" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 md:gap-10">
          {d.items.map((it, i) => (
            <Link
              key={i}
              href={it.ctaLink || "#"}
              style={{ transitionDelay: `${i * 80}ms` }}
              className="group reveal flex flex-col overflow-hidden rounded-[24px] border border-ink/10 bg-ivoire transition-all hover:-translate-y-1 hover:border-noir/40"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-creme">
                {it.image?.asset ? (
                  <Image src={urlFor(it.image).width(700).url()} alt={it.image.alt || it.title || ""} fill sizes="(max-width:1024px) 50vw, 33vw" className="object-cover transition-transform duration-[900ms] group-hover:scale-105" loading="lazy" />
                ) : (
                  <div className="absolute inset-0" style={{ background: "radial-gradient(120% 100% at 20% 0%, #f0e4cc 0%, #c8b28a 100%)" }} aria-hidden />
                )}
              </div>
              <div className="flex flex-1 flex-col p-7 md:p-9">
                <h3 className="display-serif on-cream text-[1.35rem] font-normal leading-tight md:text-[1.6rem]">{it.title}</h3>
                <p className="mt-3 flex-1 line-clamp-3 font-sans text-[14px] leading-relaxed text-taupe md:text-[15px]">{it.summary}</p>
                <span className="mt-6 inline-flex items-center gap-3 self-start border-b border-noir pb-1 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-noir transition-transform group-hover:translate-x-1">
                  {it.ctaLabel || "Lire"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
