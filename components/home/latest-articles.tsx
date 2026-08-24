import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { defaultLatestArticles } from "@/lib/homepage-defaults";

type Item = { image?: any; category?: string; title?: string; excerpt?: string; date?: string; link?: string };
type Data = { eyebrow?: string; title?: string; subtitle?: string; items?: Item[] };

function formatDate(iso?: string) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function LatestArticles({ data }: { data?: Data }) {
  const d = {
    eyebrow: data?.eyebrow || defaultLatestArticles.eyebrow,
    title: data?.title || defaultLatestArticles.title,
    subtitle: data?.subtitle || defaultLatestArticles.subtitle,
    items: data?.items?.length ? data.items : defaultLatestArticles.items,
  };

  return (
    <section className="section-cream section-editorial">
      <div className="mx-auto max-w-site">
        <div className="mb-14 flex flex-col justify-between gap-6 reveal md:mb-20 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="eyebrow-editorial on-cream mb-3">{d.eyebrow}</span>
            <h2 className="display-serif on-cream mt-5 text-[2.4rem] font-normal md:text-[4rem]">{d.title}</h2>
            <p className="mt-6 max-w-lg font-sans text-[15px] leading-relaxed text-taupe md:text-[17px]">{d.subtitle}</p>
          </div>
          <Link href="/magazine" className="hidden border-b border-noir pb-1 font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-noir transition-colors hover:text-or hover:border-or md:inline-block">
            Voir tout le magazine
          </Link>
        </div>
        <div className="rule-cream mb-12" />
        <div className="grid gap-8 md:grid-cols-3 md:gap-10">
          {d.items.map((a, i) => (
            <Link
              key={i}
              href={a.link || "#"}
              style={{ transitionDelay: `${i * 80}ms` }}
              className="group reveal flex flex-col"
            >
              <div className="relative mb-7 aspect-[3/4] overflow-hidden rounded-[28px] bg-noir md:min-h-[520px]">
                {a.image?.asset ? (
                  <Image src={urlFor(a.image).width(800).url()} alt={a.image.alt || a.title || ""} fill sizes="(max-width:1024px) 100vw, 33vw" className="object-cover transition-transform duration-[900ms] group-hover:scale-105" loading="lazy" />
                ) : (
                  <div className="absolute inset-0" style={{ background: "radial-gradient(120% 100% at 20% 0%, #262229 0%, #0b0b0f 65%)" }} aria-hidden />
                )}
                {a.category && (
                  <span className="absolute left-4 top-4 font-sans text-[10.5px] font-medium uppercase tracking-[0.22em] text-or">
                    <span className="mr-2 inline-block h-px w-6 align-middle bg-or" />
                    {a.category}
                  </span>
                )}
              </div>
              <h3 className="display-serif on-cream text-[1.6rem] font-normal leading-tight md:text-[1.95rem]">
                {a.title}
              </h3>
              <p className="mt-4 line-clamp-3 font-sans text-[15px] leading-relaxed text-taupe md:text-[16px]">{a.excerpt}</p>
              {a.date && <time dateTime={a.date} className="mt-4 font-sans text-[11px] uppercase tracking-[0.14em] text-taupe">{formatDate(a.date)}</time>}
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center md:hidden">
          <Link href="/magazine" className="border-b border-noir pb-1 font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-noir hover:text-or">
            Voir tout le magazine
          </Link>
        </div>
      </div>
    </section>
  );
}
