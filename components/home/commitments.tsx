import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { defaultCommitments } from "@/lib/homepage-defaults";
import { LineIcon, iconNameForEmoji } from "@/components/line-icon";

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
    <section className="section-noir section-editorial">
      <div className="mx-auto max-w-site">
        <div className="mx-auto mb-14 max-w-2xl text-center md:mb-20 reveal">
          <span className="eyebrow-editorial mb-3 mx-auto">{d.eyebrow}</span>
          <h2 className="display-serif mt-5 text-[2.4rem] font-normal text-ivoire md:text-[4rem]">{d.title}</h2>
          <p className="mt-6 font-serif text-[17px] italic leading-relaxed text-ivoire/70 md:text-[19px]">{d.subtitle}</p>
        </div>
        <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {d.items.map((it, i) => (
            <div key={i} className="reveal" style={{ transitionDelay: `${i * 70}ms` }}>
              {it.image?.asset && (
                <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-[20px]">
                  <Image src={urlFor(it.image).width(600).url()} alt={it.image.alt || it.title || ""} fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover" loading="lazy" />
                </div>
              )}
              <div className="mb-5 flex items-center gap-4">
                <span className="num-editorial !text-[38px] !text-or">{String(i + 1).padStart(2, "0")}</span>
                <span className="h-px flex-1 bg-white/15" aria-hidden="true" />
                {it.icon && <LineIcon name={iconNameForEmoji(it.icon)} size={22} className="text-or" />}
              </div>
              <h3 className="display-serif text-[1.4rem] font-normal text-ivoire md:text-[1.7rem]">{it.title}</h3>
              <p className="mt-3 max-w-[38ch] font-sans text-[14px] leading-relaxed text-ivoire/65 md:text-[15px]">{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
