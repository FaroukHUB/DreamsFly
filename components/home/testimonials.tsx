import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { defaultTestimonials } from "@/lib/homepage-defaults";

type Item = {
  photo?: any;
  name?: string;
  location?: string;
  rating?: number;
  text?: string;
  productBought?: string;
  date?: string;
};
type Data = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  averageRating?: number;
  totalReviews?: number;
  items?: Item[];
};

function Stars({ n }: { n: number }) {
  return (
    <div className="flex text-or" aria-label={`${n} sur 5 étoiles`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill={i < n ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M10 1l2.6 6h6.4l-5.2 4 2 6.4L10 13.5 4.2 17.4 6.2 11 1 7h6.4z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials({ data }: { data?: Data }) {
  const d = {
    eyebrow: data?.eyebrow || defaultTestimonials.eyebrow,
    title: data?.title || defaultTestimonials.title,
    subtitle: data?.subtitle || defaultTestimonials.subtitle,
    averageRating: data?.averageRating ?? defaultTestimonials.averageRating,
    totalReviews: data?.totalReviews ?? defaultTestimonials.totalReviews,
    items: data?.items?.length ? data.items : defaultTestimonials.items,
  };

  return (
    <section className="bg-ivoire py-16 md:py-24">
      <div className="mx-auto max-w-site px-6 md:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <div className="eyebrow mb-3">{d.eyebrow}</div>
          <h2 className="mb-4 font-sora text-3xl font-semibold tracking-tight text-ink md:text-5xl">{d.title}</h2>
          {d.subtitle && <p className="text-base text-pierre md:text-lg">{d.subtitle}</p>}
          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-pierre">
            <Stars n={Math.round(d.averageRating)} />
            <strong className="text-ink">{d.averageRating.toFixed(1)} / 5</strong>
            <span>· {d.totalReviews.toLocaleString("fr-FR")} avis</span>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {d.items.map((it, i) => (
            <figure key={i} className="flex flex-col rounded-2xl border border-border bg-white p-5 md:p-6">
              <Stars n={it.rating || 5} />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink md:text-base">
                « {it.text} »
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                {it.photo?.asset ? (
                  <Image src={urlFor(it.photo).width(80).height(80).fit("crop").url()} alt={it.name || ""} width={40} height={40} className="h-10 w-10 rounded-full object-cover" loading="lazy" />
                ) : (
                  <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-full bg-aurora text-sm font-bold text-midnight">
                    {(it.name || "?").slice(0, 1)}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-ink">{it.name}</div>
                  <div className="truncate text-xs text-pierre">
                    {[it.location, it.productBought].filter(Boolean).join(" · ")}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
