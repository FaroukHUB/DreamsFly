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
    <section className="border-t border-ink/10 bg-creme py-14 md:py-20">
      <div className="mx-auto max-w-site px-6 md:px-10">
        <div className="mb-10 text-center md:mb-14">
          {d.eyebrow && <span className="eyebrow-editorial on-cream mb-3 mx-auto">{d.eyebrow}</span>}
          {d.title && <h2 className="display-serif on-cream mt-4 text-[1.6rem] font-normal md:text-[2.2rem]">{d.title}</h2>}
        </div>
        <ul className="grid grid-cols-3 items-center justify-items-center gap-8 sm:grid-cols-4 md:grid-cols-6 md:gap-12">
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
              <span className="font-serif text-[15px] font-normal uppercase tracking-[0.14em] text-taupe transition-colors hover:text-noir md:text-[17px]">
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
