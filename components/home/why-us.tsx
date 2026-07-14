import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { defaultWhyUs } from "@/lib/homepage-defaults";

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
    <section className="bg-ivoire py-16 md:py-24">
      <div className="mx-auto grid max-w-site gap-10 px-6 md:grid-cols-[1fr_1.1fr] md:gap-16 md:px-8">
        <div>
          <div className="eyebrow mb-3">{d.eyebrow}</div>
          <h2 className="mb-5 font-sora text-3xl font-semibold leading-tight tracking-tight text-ink md:text-5xl">
            {d.title}
          </h2>
          <p className="mb-8 max-w-lg text-base leading-relaxed text-pierre md:text-lg">{d.subtitle}</p>
          {imgUrl && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-sable md:aspect-[5/4]">
              <Image src={imgUrl} alt={d.image?.alt || d.title} fill sizes="(max-width:768px) 100vw, 40vw" className="object-cover" loading="lazy" />
            </div>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {d.pillars.map((p, i) => (
            <div key={i} className="rounded-2xl border border-border bg-white p-5 md:p-6">
              <span aria-hidden className="mb-3 block text-3xl">{p.icon}</span>
              <h3 className="font-sora text-lg font-semibold text-ink md:text-xl">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-pierre">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
