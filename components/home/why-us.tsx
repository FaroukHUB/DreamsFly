import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { defaultWhyUs } from "@/lib/homepage-defaults";
import { LineIcon, iconNameForEmoji } from "@/components/line-icon";

type Pillar = { icon?: string; title?: string; text?: string };
type Data = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  image?: any;
  pillars?: Pillar[];
};

export function WhyUs({ data }: { data?: Data }) {
  const d = {
    eyebrow: data?.eyebrow || defaultWhyUs.eyebrow,
    title: data?.title || defaultWhyUs.title,
    subtitle: data?.subtitle || defaultWhyUs.subtitle,
    image: data?.image,
    pillars: data?.pillars?.length ? data.pillars : defaultWhyUs.pillars,
  };
  const imgUrl = d.image?.asset ? urlFor(d.image).width(1200).quality(85).url() : null;

  return (
    <section className="section-noir section-editorial relative">
      {/* Halo doux en fond.
          `overflow-hidden` sur ce calque : le cercle est décalé de -160 px
          hors du cadre (-bottom-40 -right-40) et, sans découpe, il élargit
          le document de 160 px. Sur mobile, cela rendait toute la page
          déplaçable latéralement, avec une bande blanche à droite. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-90" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-noir-doux/60 to-transparent" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-or/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-site px-6 md:px-8">
        <div className={`mb-16 grid gap-12 md:mb-24 ${imgUrl ? "md:grid-cols-[1.1fr_1fr] md:items-end md:gap-16" : ""}`}>
          <div className={`reveal ${imgUrl ? "" : "mx-auto max-w-3xl"}`}>
            <span className="eyebrow-editorial mb-4">{d.eyebrow}</span>
            <h2 className="display-serif mt-4 text-[2.2rem] font-normal text-ivoire md:text-[3.8rem]">
              {typographyEmify(d.title)}
            </h2>
            <p className={`mt-6 font-sans text-[15px] leading-relaxed text-ivoire/70 md:text-base ${imgUrl ? "max-w-lg" : "max-w-2xl"}`}>
              {d.subtitle}
            </p>
          </div>
          {imgUrl && (
            <div className="reveal relative aspect-[4/3] overflow-hidden rounded-[28px] bg-noir-doux md:aspect-[5/4]" style={{ transitionDelay: "120ms" }}>
              <Image src={imgUrl} alt={d.image?.alt || d.title} fill sizes="(max-width:768px) 100vw, 40vw" className="object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-tr from-noir/60 via-noir/10 to-transparent" />
            </div>
          )}
        </div>

        <div className="rule-noir mb-14" />

        <div className="grid gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {d.pillars.map((p, i) => (
            <div key={i} className="reveal" style={{ transitionDelay: `${i * 70}ms` }}>
              <div className="mb-6 flex items-center gap-5">
                <span className="num-editorial !text-[42px] !text-or leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="h-px flex-1 bg-white/15" aria-hidden="true" />
                <LineIcon name={iconNameForEmoji(p.icon)} size={26} className="text-or" />
              </div>
              <h3 className="display-serif text-[1.5rem] font-normal text-ivoire md:text-[1.8rem]">{p.title}</h3>
              <p className="mt-4 font-sans text-[14px] leading-relaxed text-ivoire/65 md:text-[15px] max-w-[38ch]">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Ajoute des balises <em>…</em> autour du dernier mot d'un titre
 * pour que la police Fraunces l'affiche en italique or.
 */
function typographyEmify(title: string): React.ReactNode {
  const words = title.trim().split(" ");
  if (words.length < 2) return title;
  const last = words.pop() as string;
  return (
    <>
      {words.join(" ")} <em>{last}</em>
    </>
  );
}
