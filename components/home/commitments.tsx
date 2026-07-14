import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { defaultCommitments } from "@/lib/homepage-defaults";

type Item = { icon?: string; title?: string; text?: string; image?: any };
type Data = { eyebrow?: string; title?: string; subtitle?: string; items?: Item[] };

export function Commitments({ data }: { data?: Data }) {
  const d = {
    eyebrow: data?.eyebrow || defaultCommitments.eyebrow,
    title: data?.title || defaultCommitments.title,
    subtitle: data?.subtitle || defaultCommitments.subtitle,
    items: data?.items?.length ? data.items : defaultCommitments.items,
  };

  return (
    <section className="bg-midnight py-16 text-white md:py-24">
      <div className="mx-auto max-w-site px-6 md:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-aurora">{d.eyebrow}</div>
          <h2 className="mb-4 font-sora text-3xl font-semibold tracking-tight md:text-5xl">{d.title}</h2>
          <p className="text-base text-white/80 md:text-lg">{d.subtitle}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {d.items.map((it, i) => (
            <div key={i} className="relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
              {it.image?.asset && (
                <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl">
                  <Image src={urlFor(it.image).width(500).url()} alt={it.image.alt || it.title || ""} fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover" loading="lazy" />
                </div>
              )}
              <span aria-hidden className="mb-2 text-3xl">{it.icon}</span>
              <h3 className="font-sora text-lg font-semibold md:text-xl">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
