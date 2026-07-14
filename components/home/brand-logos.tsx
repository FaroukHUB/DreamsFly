import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { defaultBrandLogos } from "@/lib/homepage-defaults";

type Item = { name?: string; logo?: any; url?: string };
type Data = { eyebrow?: string; title?: string; items?: Item[] };

export function BrandLogos({ data }: { data?: Data }) {
  const d = {
    eyebrow: data?.eyebrow || defaultBrandLogos.eyebrow,
    title: data?.title || defaultBrandLogos.title,
    items: data?.items?.length ? data.items : defaultBrandLogos.items,
  };

  return (
    <section className="border-t border-border bg-white py-12 md:py-16">
      <div className="mx-auto max-w-site px-6 md:px-8">
        <div className="mb-8 text-center md:mb-10">
          {d.eyebrow && <div className="text-[11px] font-semibold uppercase tracking-widest text-brume">{d.eyebrow}</div>}
          {d.title && <h2 className="mt-2 font-sora text-xl font-semibold tracking-tight text-ink md:text-2xl">{d.title}</h2>}
        </div>
        <ul className="grid grid-cols-3 items-center justify-items-center gap-6 sm:grid-cols-4 md:grid-cols-6 md:gap-10">
          {d.items.map((b, i) => {
            const inner = b.logo?.asset ? (
              <Image
                src={urlFor(b.logo).width(160).url()}
                alt={b.name || ""}
                width={120}
                height={40}
                className="h-8 w-auto object-contain opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0 md:h-10"
                loading="lazy"
              />
            ) : (
              <span className="font-sora text-sm font-semibold uppercase tracking-widest text-pierre transition-colors hover:text-ink md:text-base">
                {b.name}
              </span>
            );
            return (
              <li key={i} className="flex h-12 items-center justify-center">
                {b.url ? (
                  <a href={b.url} target="_blank" rel="noopener noreferrer" aria-label={b.name}>
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
