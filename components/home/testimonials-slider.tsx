"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";

type Item = {
  photo?: any;
  name?: string;
  location?: string;
  rating?: number;
  text?: string;
  productBought?: string;
  date?: string;
};

function GoogleG({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-label="Google" role="img">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.2 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} sur 5 étoiles`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 20 20" className={i < n ? "text-[#F5B400]" : "text-gray-200"} fill="currentColor" aria-hidden>
          <path d="M10 1l2.6 6h6.4l-5.2 4 2 6.4L10 13.5 4.2 17.4 6.2 11 1 7h6.4z" />
        </svg>
      ))}
    </div>
  );
}

function formatRelative(iso?: string): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffMs = Date.now() - then;
  const day = 24 * 60 * 60 * 1000;
  const diffDays = Math.floor(diffMs / day);
  if (diffDays < 1) return "aujourd'hui";
  if (diffDays === 1) return "hier";
  if (diffDays < 7) return `il y a ${diffDays} jours`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return diffWeeks === 1 ? "il y a 1 semaine" : `il y a ${diffWeeks} semaines`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return diffMonths <= 1 ? "il y a 1 mois" : `il y a ${diffMonths} mois`;
  const diffYears = Math.floor(diffDays / 365);
  return diffYears === 1 ? "il y a 1 an" : `il y a ${diffYears} ans`;
}

const AUTOPLAY_MS = 5000;

export function TestimonialsSlider({ items }: { items: Item[] }) {
  const [start, setStart] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = items.length;

  useEffect(() => {
    if (paused || total <= 3) return;
    timer.current = setTimeout(() => {
      setStart((s) => (s + 1) % total);
    }, AUTOPLAY_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [start, paused, total]);

  // 3 items visibles à partir de start (avec wrap)
  const visible = Array.from({ length: Math.min(3, total) }).map((_, i) => items[(start + i) % total]);

  const goPrev = () => setStart((s) => (s - 1 + total) % total);
  const goNext = () => setStart((s) => (s + 1) % total);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Desktop : 3 cartes visibles */}
      <div className="hidden gap-5 md:grid md:grid-cols-3">
        {visible.map((it, i) => (
          <ReviewCard key={`${start}-${i}`} item={it} />
        ))}
      </div>

      {/* Mobile : 1 carte, scroll snap */}
      <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 md:hidden">
        {items.map((it, i) => (
          <div key={i} className="w-[85%] flex-none snap-center first:ml-6 last:mr-6">
            <ReviewCard item={it} />
          </div>
        ))}
      </div>

      {/* Contrôles desktop */}
      {total > 3 && (
        <div className="mt-8 hidden items-center justify-center gap-4 md:flex">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Avis précédent"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-midnight transition-all hover:border-midnight hover:-translate-y-px"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="flex items-center gap-2" aria-hidden>
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === start ? "w-8 bg-midnight" : "w-2 bg-brume/50"}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={goNext}
            aria-label="Avis suivant"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-midnight transition-all hover:border-midnight hover:-translate-y-px"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

function ReviewCard({ item }: { item: Item }) {
  const rating = item.rating || 5;
  return (
    <figure className="group flex h-full flex-col rounded-3xl border border-border bg-white p-6 shadow-[0_2px_16px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(15,23,42,0.08)] md:p-7">
      {/* Header : avatar + nom + logo Google */}
      <figcaption className="flex items-center gap-3">
        {item.photo?.asset ? (
          <Image
            src={urlFor(item.photo).width(88).height(88).fit("crop").url()}
            alt={item.name || ""}
            width={44}
            height={44}
            className="h-11 w-11 flex-none rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <span
            aria-hidden
            className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gradient-to-br from-aurora to-midnight/20 font-sora text-base font-bold text-midnight"
          >
            {(item.name || "?").slice(0, 1).toUpperCase()}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate font-sora text-sm font-semibold text-ink md:text-base">{item.name}</span>
            <GoogleG size={14} />
          </div>
          {item.location && <div className="text-xs text-brume">{item.location}</div>}
        </div>
      </figcaption>

      {/* Note + date */}
      <div className="mt-4 flex items-center justify-between">
        <Stars n={rating} />
        {item.date && <time dateTime={item.date} className="text-[11px] text-brume">{formatRelative(item.date)}</time>}
      </div>

      {/* Texte */}
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink md:text-base">
        « {item.text} »
      </blockquote>

      {/* Produit acheté */}
      {item.productBought && (
        <div className="mt-5 border-t border-border pt-4 text-xs text-pierre">
          <span className="text-brume">Achat vérifié · </span>
          <span className="font-medium text-ink">{item.productBought}</span>
        </div>
      )}
    </figure>
  );
}
