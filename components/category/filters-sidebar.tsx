"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

type Group = {
  key: string;
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

  const selected = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    for (const g of groups) {
      const raw = searchParams.get(g.key);
      map[g.key] = new Set(raw ? raw.split(",").filter(Boolean) : []);
    }
    return map;
  }, [groups, searchParams]);

  const priceMinURL = searchParams.get("priceMin");
  const priceMaxURL = searchParams.get("priceMax");
  const priceMin = Number(priceMinURL || price?.min || 0);
  const priceMax = Number(priceMaxURL || price?.max || 5000);
  const sort = searchParams.get("sort") || "featured";

  const activeCount =
    groups.reduce((n, g) => n + selected[g.key].size, 0) +
    (priceMinURL || priceMaxURL ? 1 : 0);

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

  // Chips actifs — pour affichage en haut
  const activeChips: { key: string; value: string; label: string }[] = [];
  for (const g of groups) {
    for (const val of selected[g.key]) {
      const opt = g.options.find((o) => o.value === val);
      if (opt) activeChips.push({ key: g.key, value: val, label: opt.label });
    }
  }
  if (priceMinURL || priceMaxURL) {
    activeChips.push({
      key: "__price",
      value: "__price",
      label: `${priceMin} € — ${priceMax} €`,
    });
  }

  const removeChip = (chip: { key: string; value: string }) => {
    if (chip.key === "__price") {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("priceMin");
      params.delete("priceMax");
      router.push(`${pathname}?${params.toString()}#modeles`, { scroll: false });
      return;
    }
    toggleValue(chip.key, chip.value);
  };

  return (
    <>
      {/* Bouton mobile flottant */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 font-sora text-sm font-semibold text-ink shadow-[0_2px_12px_rgba(15,23,42,0.06)] transition-all hover:shadow-[0_4px_16px_rgba(15,23,42,0.1)] md:hidden"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="6" y1="12" x2="18" y2="12" />
          <line x1="10" y1="18" x2="14" y2="18" />
        </svg>
        Filtrer & trier
        {activeCount > 0 && (
          <span className="ml-1 flex h-6 min-w-[24px] items-center justify-center rounded-full bg-midnight px-2 text-xs font-bold text-white">
            {activeCount}
          </span>
        )}
      </button>

      {/* Chips actifs mobile (hors drawer) */}
      {activeChips.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2 md:hidden">
          {activeChips.map((c) => (
            <button
              key={`${c.key}-${c.value}`}
              type="button"
              onClick={() => removeChip(c)}
              className="inline-flex items-center gap-1.5 rounded-full bg-midnight px-3 py-1.5 text-xs font-medium text-white transition-transform hover:-translate-y-px"
            >
              {c.label}
              <span aria-hidden className="text-white/70">✕</span>
            </button>
          ))}
        </div>
      )}

      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-full max-w-sm flex-col overflow-hidden bg-white shadow-2xl transition-transform duration-300 md:sticky md:top-24 md:z-auto md:h-fit md:max-w-none md:translate-x-0 md:overflow-visible md:rounded-3xl md:bg-white md:shadow-[0_2px_20px_rgba(15,23,42,0.05)] ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header mobile */}
        <div className="flex items-center justify-between border-b border-lin p-5 md:hidden">
          <div>
            <h2 className="font-sora text-lg font-semibold text-ink">Filtres</h2>
            <p className="mt-0.5 text-xs text-pierre">{filteredCount} résultat{filteredCount > 1 ? "s" : ""}</p>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Fermer"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-page text-ink transition-colors hover:bg-lin"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 md:p-6">
          {/* Chips actifs desktop */}
          {activeChips.length > 0 && (
            <div className="mb-6 hidden md:block">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-xs font-semibold text-pierre">
                  {activeCount} filtre{activeCount > 1 ? "s" : ""} actif{activeCount > 1 ? "s" : ""}
                </div>
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs font-medium text-midnight hover:underline"
                >
                  Tout effacer
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeChips.map((c) => (
                  <button
                    key={`${c.key}-${c.value}`}
                    type="button"
                    onClick={() => removeChip(c)}
                    className="group inline-flex items-center gap-1.5 rounded-full bg-midnight/[0.06] px-3 py-1.5 text-xs font-medium text-midnight transition-colors hover:bg-midnight hover:text-white"
                  >
                    {c.label}
                    <span aria-hidden className="text-midnight/50 transition-colors group-hover:text-white/70">✕</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TRI */}
          <FilterSection title="Trier par" defaultOpen>
            <div className="space-y-1">
              {[
                { value: "featured", label: "Sélection DreamsFly", icon: "★" },
                { value: "price-asc", label: "Prix croissant", icon: "↑" },
                { value: "price-desc", label: "Prix décroissant", icon: "↓" },
                { value: "name", label: "Nom (A → Z)", icon: "A" },
              ].map((s) => {
                const isActive = sort === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => updateUrl("sort", s.value === "featured" ? undefined : s.value)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
                      isActive
                        ? "bg-midnight text-white"
                        : "bg-transparent text-ink hover:bg-page"
                    }`}
                  >
                    <span aria-hidden className={`flex h-5 w-5 flex-none items-center justify-center rounded-full text-[10px] font-bold ${isActive ? "bg-white/20" : "bg-lin"}`}>
                      {s.icon}
                    </span>
                    <span className="flex-1 font-medium">{s.label}</span>
                    {isActive && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </FilterSection>

          {/* Groupes de filtres (chips modernes) */}
          {groups.map((g) => (
            <FilterSection key={g.key} title={g.label} count={selected[g.key].size} defaultOpen>
              <div className="flex flex-wrap gap-2">
                {g.options.map((opt) => {
                  const isSelected = selected[g.key].has(opt.value);
                  const isDisabled = opt.count === 0 && !isSelected;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => toggleValue(g.key, opt.value)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-all ${
                        isSelected
                          ? "border-midnight bg-midnight text-white shadow-sm"
                          : isDisabled
                            ? "cursor-not-allowed border-lin bg-page/60 text-brume opacity-60"
                            : "border-lin bg-white text-ink hover:border-midnight hover:-translate-y-px"
                      }`}
                    >
                      {opt.label}
                      <span className={`text-[10px] ${isSelected ? "text-white/70" : "text-brume"}`}>
                        {opt.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </FilterSection>
          ))}

          {/* Prix */}
          {price && (
            <FilterSection title="Budget" count={priceMinURL || priceMaxURL ? 1 : 0} defaultOpen>
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
            </FilterSection>
          )}
        </div>

        {/* Footer mobile */}
        <div className="border-t border-lin bg-white p-4 md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-midnight px-5 py-4 font-sora text-sm font-semibold text-white transition-all hover:bg-midnight-dark"
          >
            Voir les {filteredCount} résultat{filteredCount > 1 ? "s" : ""}
          </button>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="mt-2 flex w-full items-center justify-center py-2 text-xs font-medium text-pierre hover:text-midnight"
            >
              Effacer tous les filtres
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// FilterSection — accordéon moderne
// ─────────────────────────────────────────────────────────────
function FilterSection({
  title,
  count,
  defaultOpen = false,
  children,
}: {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-lin py-5 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 py-1 text-left font-sora"
      >
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-semibold text-ink">{title}</span>
          {count !== undefined && count > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-midnight px-1.5 text-[10px] font-bold text-white">
              {count}
            </span>
          )}
        </div>
        <span
          aria-hidden
          className={`flex h-6 w-6 items-center justify-center rounded-full bg-page text-ink transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Price filter — presets + range slider custom
// ─────────────────────────────────────────────────────────────
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

  useEffect(() => {
    setLocalMin(currentMin);
    setLocalMax(currentMax);
  }, [currentMin, currentMax]);

  const commit = () => onChange(localMin, localMax);
  const range = max - min;
  const leftPct = range > 0 ? ((localMin - min) / range) * 100 : 0;
  const rightPct = range > 0 ? ((max - localMax) / range) * 100 : 0;

  return (
    <div>
      {/* Presets */}
      {suggestions && suggestions.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-1.5">
          {suggestions.map((s, i) => {
            const isActive = (s.min ?? min) === localMin && (s.max ?? max) === localMax;
            return (
              <button
                key={i}
                type="button"
                onClick={() => onChange(s.min ?? min, s.max ?? max)}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all ${
                  isActive
                    ? "border-midnight bg-midnight text-white"
                    : "border-lin bg-white text-ink hover:border-midnight"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Fourchette actuelle en gros */}
      <div className="mb-4 flex items-baseline justify-between rounded-2xl bg-page px-4 py-3">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-brume">Min</div>
          <div className="font-sora text-lg font-bold text-ink">{localMin} €</div>
        </div>
        <span className="text-brume">—</span>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-widest text-brume">Max</div>
          <div className="font-sora text-lg font-bold text-ink">{localMax} €</div>
        </div>
      </div>

      {/* Range slider double — rail rempli visuel */}
      <div className="relative mb-3 h-6">
        {/* Track background */}
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-lin" aria-hidden />
        {/* Track filled */}
        <div
          aria-hidden
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-midnight transition-all"
          style={{ left: `${leftPct}%`, right: `${rightPct}%` }}
        />
        {/* Inputs superposés */}
        <input
          type="range"
          min={min}
          max={max}
          step={50}
          value={localMin}
          onChange={(e) => setLocalMin(Math.min(parseInt(e.target.value, 10), localMax - 50))}
          onMouseUp={commit}
          onTouchEnd={commit}
          className="pointer-events-none absolute inset-0 h-6 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-midnight [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-midnight [&::-moz-range-thumb]:bg-white"
          aria-label="Prix minimum"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={50}
          value={localMax}
          onChange={(e) => setLocalMax(Math.max(parseInt(e.target.value, 10), localMin + 50))}
          onMouseUp={commit}
          onTouchEnd={commit}
          className="pointer-events-none absolute inset-0 h-6 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-midnight [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-midnight [&::-moz-range-thumb]:bg-white"
          aria-label="Prix maximum"
        />
      </div>

      <div className="flex justify-between text-[10px] text-brume">
        <span>{min} €</span>
        <span>{max} €</span>
      </div>
    </div>
  );
}
