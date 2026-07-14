"use client";
import { useEffect, useRef, useState } from "react";
import { HeroSlideMedia, HeroSlideOverlay, type HeroSlideData } from "@/components/hero";

const AUTOPLAY_MS = 6000;

export function HeroSlider({ slides }: { slides: HeroSlideData[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    timerRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index, paused, slides.length]);

  const goTo = (i: number) => setIndex(((i % slides.length) + slides.length) % slides.length);
  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  return (
    <div
      className="relative min-h-[480px] overflow-hidden bg-midnight md:min-h-[420px] md:rounded-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <HeroSlideMedia slide={slide} priority={i === 0} />
          <HeroSlideOverlay slide={slide} />
        </div>
      ))}

      {/* Flèches — cachées mobile, visibles desktop */}
      <button
        type="button"
        onClick={prev}
        aria-label="Slide précédente"
        className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/15 p-2.5 text-white backdrop-blur-md transition-all hover:bg-white/30 md:flex md:left-5"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Slide suivante"
        className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/15 p-2.5 text-white backdrop-blur-md transition-all hover:bg-white/30 md:flex md:right-5"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Pagination dots */}
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 md:bottom-7">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Aller à la slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-8 bg-white" : "w-2.5 bg-white/45 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
