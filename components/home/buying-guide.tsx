import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { defaultBuyingGuide } from "@/lib/homepage-defaults";
import { LineIcon, iconNameForEmoji } from "@/components/line-icon";

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
    <section className="section-cream section-editorial">
      <div className="mx-auto max-w-site">
        <div className="mb-16 max-w-3xl reveal md:mb-24">
          <span className="eyebrow-editorial on-cream mb-3">{d.eyebrow}</span>
          <h2 className="display-serif on-cream mt-5 text-[2.2rem] font-normal md:text-[3.8rem]">
            {emphasizeLast(d.title)}
          </h2>
          <p className="mt-6 max-w-[52ch] font-sans text-[15px] leading-relaxed text-taupe md:text-[17px]">
            {d.subtitle}
          </p>
        </div>
        <div className="rule-cream mb-12" />
        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          {d.guides.map((g, i) => (
            <Link
              key={i}
              href={g.ctaLink || "#"}
              style={{ transitionDelay: `${i * 80}ms` }}
              className="group reveal flex flex-col overflow-hidden rounded-[28px] border border-ink/10 bg-ivoire transition-all hover:-translate-y-1 hover:border-noir/50 md:flex-row"
            >
              {g.image?.asset && (
                <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:w-[42%] md:min-h-[280px]">
                  <Image src={urlFor(g.image).width(700).url()} alt={g.image.alt || g.title || ""} fill sizes="(max-width:768px) 100vw, 30vw" className="object-cover transition-transform duration-[900ms] group-hover:scale-105" loading="lazy" />
                </div>
              )}
              <div className="flex flex-1 flex-col p-8 md:p-10">
                {g.icon && (
                  <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-noir">
                    <LineIcon name={iconNameForEmoji(g.icon)} size={20} />
                  </span>
                )}
                <h3 className="display-serif on-cream text-[1.4rem] font-normal md:text-[1.7rem]">{g.title}</h3>
                <p className="mt-3 flex-1 font-sans text-[14px] leading-relaxed text-taupe md:text-[15px]">{g.text}</p>
                <span className="mt-6 inline-flex items-center gap-3 border-b border-noir pb-1 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-noir transition-transform group-hover:translate-x-1 self-start">
                  {g.ctaLabel || "Lire le guide"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function emphasizeLast(title: string): React.ReactNode {
  const words = title.trim().split(/\s+/);
  if (words.length < 2) return title;
  const last = words.pop() as string;
  return (
    <>
      {words.join(" ")} <em>{last}</em>
    </>
  );
}
