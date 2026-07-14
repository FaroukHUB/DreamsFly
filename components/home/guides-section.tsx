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
    <section className="bg-sable py-16 md:py-24">
      <div className="mx-auto max-w-site px-6 md:px-8">
        <div className="mb-10 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="eyebrow mb-3">{d.eyebrow}</div>
            <h2 className="mb-3 font-sora text-3xl font-semibold tracking-tight text-ink md:text-5xl">{d.title}</h2>
            <p className="text-base text-pierre md:text-lg">{d.subtitle}</p>
          </div>
          <Link href="/magazine" className="hidden text-sm font-semibold text-midnight underline decoration-dotted underline-offset-4 hover:decoration-solid md:inline-block">
            Tous les guides →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {d.items.map((it, i) => (
            <Link
              key={i}
              href={it.ctaLink || "#"}
              className="group flex flex-col overflow-hidden rounded-3xl bg-white transition-all hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-ivoire">
                {it.image?.asset ? (
                  <Image src={urlFor(it.image).width(600).url()} alt={it.image.alt || it.title || ""} fill sizes="(max-width:1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-midnight/10 to-aurora/20" aria-hidden />
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-sora text-lg font-semibold text-ink md:text-xl">{it.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-pierre md:text-base">{it.summary}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-midnight transition-transform group-hover:translate-x-1">
                  {it.ctaLabel || "Lire"} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
