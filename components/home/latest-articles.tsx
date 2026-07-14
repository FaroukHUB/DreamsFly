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
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-site px-6 md:px-8">
        <div className="mb-10 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="eyebrow mb-3">{d.eyebrow}</div>
            <h2 className="mb-3 font-sora text-3xl font-semibold tracking-tight text-ink md:text-5xl">{d.title}</h2>
            <p className="text-base text-pierre md:text-lg">{d.subtitle}</p>
          </div>
          <Link href="/magazine" className="hidden text-sm font-semibold text-midnight underline decoration-dotted underline-offset-4 hover:decoration-solid md:inline-block">
            Voir tout le magazine →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {d.items.map((a, i) => (
            <Link
              key={i}
              href={a.link || "#"}
              className="group flex flex-col"
            >
              <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-2xl bg-ivoire">
                {a.image?.asset ? (
                  <Image src={urlFor(a.image).width(700).url()} alt={a.image.alt || a.title || ""} fill sizes="(max-width:1024px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-aurora/30 to-sable" aria-hidden />
                )}
                {a.category && (
                  <span className="absolute left-3 top-3 rounded-pill bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-midnight">
                    {a.category}
                  </span>
                )}
              </div>
              <h3 className="font-sora text-lg font-semibold text-ink transition-colors group-hover:text-midnight md:text-xl">
                {a.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-pierre md:text-base">{a.excerpt}</p>
              {a.date && <time dateTime={a.date} className="mt-3 text-xs text-brume">{formatDate(a.date)}</time>}
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link href="/magazine" className="text-sm font-semibold text-midnight underline decoration-dotted underline-offset-4">
            Voir tout le magazine →
          </Link>
        </div>
      </div>
    </section>
  );
}
