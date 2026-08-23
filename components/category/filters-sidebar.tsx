"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

type Group = {
  key: string; // "types" | "sizes" | ...
  label: string;
  options: { value: string; label: string; count: number }[];
};

type PriceGroup = {
  label: string;
  min: number;
  max: number;
  suggestions?: { label: string; min?: number; max?: number }[];
};

export function FiltersSidebar({
  groups,
  price,
  totalCount,
  filteredCount,
}: {
  groups: Group[];
  price?: PriceGroup;
  totalCount: number;
  filteredCount: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Récupère les valeurs sélectionnées depuis l'URL
  const selected = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    for (const g of groups) {
      const raw = searchParams.get(g.key);
      map[g.key] = new Set(raw ? raw.split(",").filter(Boolean) : []);
    }
    return map;
  }, [groups, searchParams]);

  const priceMin = Number(searchParams.get("priceMin") || price?.min || 0);
  const priceMax = Number(searchParams.get("priceMax") || price?.max || 5000);
  const sort = searchParams.get("sort") || "featured";

  const activeCount =
    groups.reduce((n, g) => n + selected[g.key].size, 0) +
    (searchParams.get("priceMin") || searchParams.get("priceMax") ? 1 : 0);

  const updateUrl = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === undefined || value === "") params.delete(key);
    else params.set(key, value);
    router.push(`${pathname}?${params.toString()}#modeles`, { scroll: false });
  };

  const toggleValue = (groupKey: string, value: string) => {
    const current = new Set(selected[groupKey]);
    if (current.has(value)) current.delete(value);
    else current.add(value);
    updateUrl(groupKey, current.size > 0 ? Array.from(current).join(",") : undefined);
  };

  const clearAll = () => {
    router.push(`${pathname}#modeles`, { scroll: false });
  };

  return (
    <>
      {/* Bouton mobile */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-pill border border-border bg-white px-5 py-3 font-sora text-sm font-semibold text-ink md:hidden"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        Filtrer & trier
        {activeCount > 0 && (
          <span className="ml-1 rounded-full bg-midnight px-2 py-0.5 text-xs font-bold text-white">
            {activeCount}
          </span>
        )}
      </button>

      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-full max-w-sm flex-col overflow-hidden bg-white shadow-xl transition-transform md:sticky md:top-24 md:z-auto md:h-fit md:max-w-none md:translate-x-0 md:shadow-none md:bg-transparent ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header mobile */}
        <div className="flex items-center justify-between border-b border-border p-5 md:hidden">
          <h2 className="font-sora text-lg font-semibold text-ink">Filtres</h2>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Fermer"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink hover:border-midnight"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 md:p-0">
          {/* Tri (desktop et mobile) */}
          <details open className="group mb-6 border-b border-border pb-6 last:border-0 md:mb-5 md:pb-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-sora text-sm font-semibold uppercase tracking-widest text-ink">
              Trier par
              <svg className="text-brume transition-transform group-open:rotate-180" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>
            <div className="mt-4 space-y-2">
              {[
                { value: "featured", label: "Sélection DreamsFly" },
                { value: "price-asc", label: "Prix croissant" },
                { value: "price-desc", label: "Prix décroissant" },
                { value: "name", label: "Nom (A → Z)" },
              ].map((s) => (
                <label key={s.value} className="flex cursor-pointer items-center gap-3 text-sm">
                  <input
                    type="radio"
                    name="sort"
                    value={s.value}
                    checked={sort === s.value}
                    onChange={() => updateUrl("sort", s.value === "featured" ? undefined : s.value)}
                    className="h-4 w-4 accent-midnight"
                  />
                  <span className="text-ink">{s.label}</span>
                </label>
              ))}
            </div>
          </details>

          {/* Chaque groupe de filtres */}
          {groups.map((g) => (
            <details key={g.key} open className="group mb-6 border-b border-border pb-6 last:border-0 md:mb-5 md:pb-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-sora text-sm font-semibold uppercase tracking-widest text-ink">
                {g.label}
                {selected[g.key].size > 0 && (
                  <span className="ml-auto mr-3 rounded-full bg-midnight px-2 py-0.5 text-[10px] font-bold text-white">
                    {selected[g.key].size}
                  </span>
                )}
                <svg className="text-brume transition-transform group-open:rotate-180" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <ul className="mt-4 space-y-2">
                {g.options.map((opt) => {
                  const isChecked = selected[g.key].has(opt.value);
                  const disabled = opt.count === 0 && !isChecked;
                  return (
                    <li key={opt.value}>
                      <label
                        className={`flex cursor-pointer items-center gap-3 text-sm transition-colors ${
                          disabled ? "cursor-not-allowed opacity-40" : "hover:text-midnight"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={disabled}
                          onChange={() => toggleValue(g.key, opt.value)}
                          className="h-4 w-4 accent-midnight"
                        />
                        <span className="flex-1 text-ink">{opt.label}</span>
                        <span className="text-xs text-brume">{opt.count}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </details>
          ))}

          {/* Prix */}
          {price && (
            <details open className="group mb-6 border-b border-border pb-6 last:border-0 md:mb-5 md:pb-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-sora text-sm font-semibold uppercase tracking-widest text-ink">
                Prix
                {(searchParams.get("priceMin") || searchParams.get("priceMax")) && (
                  <span className="ml-auto mr-3 rounded-full bg-midnight px-2 py-0.5 text-[10px] font-bold text-white">
                    1
                  </span>
                )}
                <svg className="text-brume transition-transform group-open:rotate-180" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <PriceFilter
                min={price.min}
                max={price.max}
                currentMin={priceMin}
                currentMax={priceMax}
                suggestions={price.suggestions}
                onChange={(newMin, newMax) => {
                  const params = new URLSearchParams(searchParams.toString());
                  if (newMin > price.min) params.set("priceMin", String(newMin));
                  else params.delete("priceMin");
                  if (newMax < price.max) params.set("priceMax", String(newMax));
                  else params.delete("priceMax");
                  router.push(`${pathname}?${params.toString()}#modeles`, { scroll: false });
                }}
              />
            </details>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-white p-4 md:border-0 md:bg-transparent md:p-0">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-pierre">
              <strong className="text-ink">{filteredCount}</strong> résultat{filteredCount > 1 ? "s" : ""}
              {activeCount > 0 && ` (sur ${totalCount})`}
            </span>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs font-semibold text-midnight underline decoration-dotted underline-offset-4 hover:decoration-solid"
              >
                Tout effacer
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="w-full rounded-pill bg-midnight px-5 py-3 font-sora text-sm font-semibold text-white md:hidden"
          >
            Voir les {filteredCount} résultat{filteredCount > 1 ? "s" : ""}
          </button>
        </div>
      </aside>
    </>
  );
}

function PriceFilter({
  min,
  max,
  currentMin,
  currentMax,
  suggestions,
  onChange,
}: {
  min: number;
  max: number;
  currentMin: number;
  currentMax: number;
  suggestions?: { label: string; min?: number; max?: number }[];
  onChange: (min: number, max: number) => void;
}) {
  const [localMin, setLocalMin] = useState(currentMin);
  const [localMax, setLocalMax] = useState(currentMax);

  // Sync local state when URL changes externally
  useEffect(() => {
    setLocalMin(currentMin);
    setLocalMax(currentMax);
  }, [currentMin, currentMax]);

  const commit = () => onChange(localMin, localMax);

  return (
    <div className="mt-4">
      {/* Suggestions rapides */}
      {suggestions && suggestions.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {suggestions.map((s, i) => {
            const isActive = (s.min ?? min) === localMin && (s.max ?? max) === localMax;
            return (
              <button
                key={i}
                type="button"
                onClick={() => onChange(s.min ?? min, s.max ?? max)}
                className={`rounded-pill border px-3 py-1.5 text-[11px] font-medium transition-all ${
                  isActive
                    ? "border-midnight bg-midnight text-white"
                    : "border-border bg-white text-ink hover:border-midnight"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Fourchette actuelle */}
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-medium text-ink">{localMin} €</span>
        <span className="text-brume">—</span>
        <span className="font-medium text-ink">{localMax} €</span>
      </div>

      {/* Sliders min/max */}
      <div className="space-y-3">
        <label className="block">
          <span className="mb-1 block text-[11px] uppercase tracking-widest text-brume">Minimum</span>
          <input
            type="range"
            min={min}
            max={max}
            step={50}
            value={localMin}
            onChange={(e) => setLocalMin(Math.min(parseInt(e.target.value, 10), localMax))}
            onMouseUp={commit}
            onTouchEnd={commit}
            className="w-full accent-midnight"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] uppercase tracking-widest text-brume">Maximum</span>
          <input
            type="range"
            min={min}
            max={max}
            step={50}
            value={localMax}
            onChange={(e) => setLocalMax(Math.max(parseInt(e.target.value, 10), localMin))}
            onMouseUp={commit}
            onTouchEnd={commit}
            className="w-full accent-midnight"
          />
        </label>
      </div>
    </div>
  );
}
