import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { defaultBuyingGuide } from "@/lib/homepage-defaults";

type Guide = {
  icon?: string;
  title?: string;
  text?: string;
  ctaLabel?: string;
  ctaLink?: string;
  image?: any;
};
type Data = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  guides?: Guide[];
};

export function BuyingGuide({ data }: { data?: Data }) {
  const d = {
    eyebrow: data?.eyebrow || defaultBuyingGuide.eyebrow,
    title: data?.title || defaultBuyingGuide.title,
    subtitle: data?.subtitle || defaultBuyingGuide.subtitle,
    guides: data?.guides?.length ? data.guides : defaultBuyingGuide.guides,
  };

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-site px-6 md:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <div className="eyebrow mb-3">{d.eyebrow}</div>
          <h2 className="mb-4 font-sora text-3xl font-semibold tracking-tight text-ink md:text-5xl">
            {d.title}
          </h2>
          <p className="text-base text-pierre md:text-lg">{d.subtitle}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          {d.guides.map((g, i) => (
            <Link
              key={i}
              href={g.ctaLink || "#"}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-white transition-all hover:-translate-y-1 hover:border-midnight md:flex-row"
            >
              {g.image?.asset && (
                <div className="relative aspect-[4/3] md:aspect-auto md:w-[40%] md:min-h-[220px]">
                  <Image src={urlFor(g.image).width(600).url()} alt={g.image.alt || g.title || ""} fill sizes="(max-width:768px) 100vw, 30vw" className="object-cover" loading="lazy" />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6 md:p-8">
                {g.icon && <span aria-hidden className="mb-2 text-3xl">{g.icon}</span>}
                <h3 className="font-sora text-xl font-semibold text-ink md:text-2xl">{g.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-pierre md:text-base">{g.text}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-midnight transition-transform group-hover:translate-x-1">
                  {g.ctaLabel || "Lire le guide"} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
