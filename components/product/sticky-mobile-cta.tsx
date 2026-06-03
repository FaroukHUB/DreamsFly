"use client";

import { useEffect, useState } from "react";

/**
 * Sticky CTA mobile — apparaît en bas de l'écran sur mobile dès qu'on
 * scrolle au-delà du buy box principal. Conversion +15-25% sur mobile.
 */
export function StickyMobileCTA({
  productName,
  price,
  compareAtPrice,
}: {
  productName: string;
  price?: number;
  compareAtPrice?: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!price) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-ivoire/95 backdrop-blur-md transition-transform duration-300 lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      role="region"
      aria-label="Acheter ce matelas"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex flex-1 flex-col">
          <span className="line-clamp-1 text-[12px] font-medium text-pierre">{productName}</span>
          <span className="flex items-baseline gap-1.5">
            <span className="font-sora text-lg font-bold text-discount">{price} €</span>
            {compareAtPrice && compareAtPrice > price && (
              <span className="text-xs text-brume line-through">{compareAtPrice} €</span>
            )}
          </span>
        </div>
        <button
          onClick={() => {
            const target = document.getElementById("buy-box");
            target?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
          className="rounded-pill bg-midnight px-5 py-2.5 font-sora text-sm font-semibold text-white"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}
