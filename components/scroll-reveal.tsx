"use client";
import { useEffect } from "react";

/**
 * Observe toutes les balises portant la classe `reveal`
 * et leur ajoute `reveal-visible` quand elles entrent dans le viewport.
 * Aucun re-render, aucun state React. Un seul effet global au mount.
 * Respecte prefers-reduced-motion (via le CSS).
 */
export function ScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const els = document.querySelectorAll<HTMLElement>(".reveal:not(.reveal-visible)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("reveal-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
