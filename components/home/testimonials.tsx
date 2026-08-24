import { defaultTestimonials } from "@/lib/homepage-defaults";
import { TestimonialsSlider } from "@/components/home/testimonials-slider";

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
  moreReviewsUrl?: string;
  moreReviewsLabel?: string;
  items?: Item[];
};

function GoogleG({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.2 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} sur 5 étoiles`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 20 20" className={i < n ? "text-[#F5B400]" : "text-gray-200"} fill="currentColor" aria-hidden>
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
    moreReviewsUrl: data?.moreReviewsUrl || defaultTestimonials.moreReviewsUrl,
    moreReviewsLabel: data?.moreReviewsLabel || defaultTestimonials.moreReviewsLabel,
    items: data?.items?.length ? data.items : defaultTestimonials.items,
  };

  return (
    <section className="section-cream section-editorial">
      <div className="mx-auto max-w-site">
        <div className="mx-auto mb-14 max-w-2xl text-center md:mb-20 reveal">
          <span className="eyebrow-editorial on-cream mb-3 mx-auto">{d.eyebrow}</span>
          <h2 className="display-serif on-cream mt-5 text-[2.4rem] font-normal md:text-[4rem]">{d.title}</h2>
          {d.subtitle && <p className="mt-6 font-serif text-[17px] italic leading-relaxed text-taupe md:text-[19px]">{d.subtitle}</p>}

          {/* Note globale style Google */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-ink/15 bg-ivoire px-6 py-3">
            <GoogleG size={20} />
            <div className="flex items-center gap-2">
              <Stars n={Math.round(d.averageRating)} />
              <strong className="font-serif text-[17px] font-normal text-noir">{d.averageRating.toFixed(1)}</strong>
              <span className="font-sans text-[13px] text-taupe">
                · {d.totalReviews.toLocaleString("fr-FR")} avis
              </span>
            </div>
          </div>
        </div>

        {d.items.length > 0 && <TestimonialsSlider items={d.items} />}

        {d.moreReviewsUrl && (
          <div className={`text-center ${d.items.length > 0 ? "mt-12 md:mt-16" : "mt-10"}`}>
            <a
              href={d.moreReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-pill border border-noir bg-transparent px-7 py-3.5 font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-noir transition-all hover:bg-noir hover:text-or"
            >
              <GoogleG size={16} />
              {d.moreReviewsLabel}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 17 17 7M17 7H8M17 7V16"/></svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
