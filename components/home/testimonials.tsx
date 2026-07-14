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
    <section className="bg-ivoire py-16 md:py-24">
      <div className="mx-auto max-w-site px-6 md:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <div className="eyebrow mb-3">{d.eyebrow}</div>
          <h2 className="mb-4 font-sora text-3xl font-semibold tracking-tight text-ink md:text-5xl">{d.title}</h2>
          {d.subtitle && <p className="text-base text-pierre md:text-lg">{d.subtitle}</p>}

          {/* Note globale style Google */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border bg-white px-5 py-2.5 shadow-sm">
            <GoogleG size={20} />
            <div className="flex items-center gap-2">
              <Stars n={Math.round(d.averageRating)} />
              <strong className="font-sora text-base text-ink">{d.averageRating.toFixed(1)}</strong>
              <span className="text-sm text-pierre">
                · {d.totalReviews.toLocaleString("fr-FR")} avis
              </span>
            </div>
          </div>
        </div>

        {d.items.length > 0 && <TestimonialsSlider items={d.items} />}

        {d.moreReviewsUrl && (
          <div className={`text-center ${d.items.length > 0 ? "mt-10 md:mt-12" : "mt-8"}`}>
            <a
              href={d.moreReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full border border-border bg-white px-6 py-3.5 font-sora text-sm font-semibold text-ink shadow-sm transition-all hover:-translate-y-px hover:border-midnight md:text-base"
            >
              <GoogleG size={18} />
              {d.moreReviewsLabel}
              <span aria-hidden>↗</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
