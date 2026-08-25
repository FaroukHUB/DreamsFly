"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { LineIcon } from "./line-icon";

/**
 * Barre de recherche fullscreen — style éditorial luxe.
 * Ouverture : ⌘K (Mac) ou Ctrl+K (Win/Linux), ou clic sur bouton loupe.
 * Fermeture : Esc ou clic sur backdrop.
 * Navigation clavier : ↑ ↓ pour naviguer, Enter pour ouvrir.
 * Recents : 5 dernières recherches stockées en localStorage.
 */

const LS_KEY = "df:recent-searches";
const RECENT_MAX = 5;

type Result = {
  _id: string;
  _type: string;
  title: string;
  excerpt?: string;
  tagline?: string;
  slug: string;
  type?: string;
  category?: string;
  articleType?: string;
  pageType?: string;
  image?: any;
};

type SearchResults = {
  products?: Result[];
  guides?: Result[];
  glossary?: Result[];
  comparisons?: Result[];
  landings?: Result[];
};

const URL_FOR: Record<string, (r: Result) => string> = {
  product: (r) => productUrl(r),
  guide: (r) => `/magazine/${r.slug}`,
  glossary: (r) => `/glossaire/${r.slug}`,
  comparison: (r) => `/comparatifs/${r.slug}`,
  landingPage: (r) => `/${r.slug}`,
};

function productUrl(r: Result): string {
  const t = r.type || "";
  if (t.includes("lit") && !t.includes("literie")) return `/lits/${r.slug}`;
  if (t.includes("sommier")) return `/sommiers/${r.slug}`;
  if (t.includes("oreiller")) return `/oreillers/${r.slug}`;
  return `/matelas/${r.slug}`;
}

const CATEGORY_LABEL: Record<string, string> = {
  product: "Produit",
  guide: "Magazine",
  glossary: "Glossaire",
  comparison: "Comparatif",
  landingPage: "Guide",
};

const POPULAR_QUERIES = [
  "matelas mémoire de forme",
  "matelas mal de dos",
  "140 x 190",
  "sommier électrique",
  "oreiller ergonomique",
  "lit coffre",
];

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResults>({});
  const [recent, setRecent] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Ouverture globale ⌘K / Ctrl+K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        return;
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
        return;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Écoute l'événement custom lancé par le bouton header
  useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("df:open-search", onOpen);
    return () => window.removeEventListener("df:open-search", onOpen);
  }, []);

  // Focus input à l'ouverture
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 30);
      // Charge recents
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) setRecent(JSON.parse(raw));
      } catch {}
    } else {
      document.body.style.overflow = "";
      setQ("");
      setResults({});
      setSelectedIndex(0);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (!open) return;
    const trimmed = q.trim();
    if (trimmed.length < 2) {
      setResults({});
      setLoading(false);
      return;
    }
    setLoading(true);
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, { signal: ac.signal });
        const data = await res.json();
        setResults(data);
        setSelectedIndex(0);
      } catch (err: any) {
        if (err?.name !== "AbortError") setResults({});
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => clearTimeout(t);
  }, [q, open]);

  const flatResults = useMemo(() => {
    const list: Array<Result & { section: string }> = [];
    (results.products || []).forEach((r) => list.push({ ...r, section: "product" }));
    (results.landings || []).forEach((r) => list.push({ ...r, section: "landingPage" }));
    (results.guides || []).forEach((r) => list.push({ ...r, section: "guide" }));
    (results.comparisons || []).forEach((r) => list.push({ ...r, section: "comparison" }));
    (results.glossary || []).forEach((r) => list.push({ ...r, section: "glossary" }));
    return list;
  }, [results]);

  const totalCount = flatResults.length;

  function saveRecent(query: string) {
    const next = [query, ...recent.filter((r) => r !== query)].slice(0, RECENT_MAX);
    setRecent(next);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch {}
  }

  function handleSelect(r: Result & { section: string }) {
    saveRecent(q.trim());
    setOpen(false);
    const href = URL_FOR[r.section]?.(r) || "/";
    // Nav via anchor click for real navigation
    window.location.href = href;
  }

  // Nav clavier
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, totalCount - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && flatResults[selectedIndex]) {
        e.preventDefault();
        handleSelect(flatResults[selectedIndex]);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, selectedIndex, totalCount, flatResults]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-noir/85 px-4 pt-[10vh] backdrop-blur-md md:pt-[15vh]"
      role="dialog"
      aria-modal="true"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/10 bg-page shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-4 border-b border-ink/10 bg-ivoire px-6 py-5">
          <LineIcon name="target" size={20} className="text-noir opacity-60" strokeWidth={1.4} />
          <input
            ref={inputRef}
            type="search"
            autoComplete="off"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un modèle, un guide, un terme…"
            className="flex-1 bg-transparent font-serif text-[22px] italic text-ink outline-none placeholder:text-taupe/70 md:text-[24px]"
          />
          <kbd className="hidden font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-taupe md:inline">
            Esc
          </kbd>
        </div>

        {/* Résultats */}
        <div className="max-h-[60vh] overflow-y-auto">
          {q.trim().length < 2 ? (
            <EmptyState recent={recent} onPick={setQ} />
          ) : loading ? (
            <div className="px-6 py-14 text-center font-sans text-[13px] uppercase tracking-[0.14em] text-taupe">
              Recherche…
            </div>
          ) : totalCount === 0 ? (
            <div className="px-6 py-14 text-center">
              <span className="eyebrow-editorial on-cream mb-3 mx-auto">Aucun résultat</span>
              <p className="mt-3 font-serif italic text-taupe">
                Rien pour « {q} ». Essayez un autre terme.
              </p>
            </div>
          ) : (
            <ResultsList
              results={results}
              selectedIndex={selectedIndex}
              onSelect={handleSelect}
            />
          )}
        </div>

        {/* Footer */}
        <div className="hidden items-center justify-between border-t border-ink/10 bg-creme px-6 py-3 font-sans text-[11px] uppercase tracking-[0.14em] text-taupe md:flex">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2">
              <kbd className="rounded border border-ink/15 bg-ivoire px-1.5 py-0.5">↑</kbd>
              <kbd className="rounded border border-ink/15 bg-ivoire px-1.5 py-0.5">↓</kbd>
              Naviguer
            </span>
            <span className="flex items-center gap-2">
              <kbd className="rounded border border-ink/15 bg-ivoire px-1.5 py-0.5">↵</kbd>
              Ouvrir
            </span>
            <span className="flex items-center gap-2">
              <kbd className="rounded border border-ink/15 bg-ivoire px-1.5 py-0.5">Esc</kbd>
              Fermer
            </span>
          </div>
          <span>DreamsFly · recherche</span>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ recent, onPick }: { recent: string[]; onPick: (q: string) => void }) {
  return (
    <div className="px-6 py-8 md:px-8 md:py-10">
      {recent.length > 0 && (
        <>
          <span className="eyebrow-editorial on-cream mb-4">Recherches récentes</span>
          <ul className="mt-4 mb-8 space-y-1">
            {recent.map((r) => (
              <li key={r}>
                <button
                  onClick={() => onPick(r)}
                  className="group flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-ivoire"
                >
                  <LineIcon name="quote" size={14} className="text-taupe" />
                  <span className="font-serif text-[16px] italic text-ink">{r}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      <span className="eyebrow-editorial on-cream mb-4">Recherches populaires</span>
      <ul className="mt-4 flex flex-wrap gap-2">
        {POPULAR_QUERIES.map((q) => (
          <li key={q}>
            <button
              onClick={() => onPick(q)}
              className="rounded-pill border border-ink/15 bg-ivoire px-4 py-2 font-sans text-[13px] text-noir transition-all hover:border-noir hover:bg-noir hover:text-or"
            >
              {q}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResultsList({
  results,
  selectedIndex,
  onSelect,
}: {
  results: SearchResults;
  selectedIndex: number;
  onSelect: (r: any) => void;
}) {
  let cursor = 0;
  const sections: Array<{ key: string; label: string; items?: Result[] }> = [
    { key: "product", label: "Produits", items: results.products },
    { key: "landingPage", label: "Guides", items: results.landings },
    { key: "guide", label: "Magazine", items: results.guides },
    { key: "comparison", label: "Comparatifs", items: results.comparisons },
    { key: "glossary", label: "Glossaire", items: results.glossary },
  ];

  return (
    <div className="px-4 py-4 md:px-6 md:py-6">
      {sections.map((sec) => {
        if (!sec.items || sec.items.length === 0) return null;
        return (
          <div key={sec.key} className="mb-6 last:mb-0">
            <div className="mb-2 flex items-center gap-3 px-3">
              <span className="h-px w-6 bg-or" aria-hidden="true" />
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-taupe">
                {sec.label} · {sec.items.length}
              </span>
            </div>
            <ul>
              {sec.items.map((r) => {
                const isSelected = cursor === selectedIndex;
                cursor++;
                return (
                  <li key={r._id}>
                    <button
                      onClick={() => onSelect({ ...r, section: sec.key })}
                      onMouseEnter={() => {}}
                      className={`group flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left transition-colors ${
                        isSelected ? "bg-noir text-ivoire" : "hover:bg-ivoire"
                      }`}
                    >
                      {r.image ? (
                        <div className={`relative h-12 w-12 flex-none overflow-hidden rounded-md ${isSelected ? "bg-white/10" : "bg-creme"}`}>
                          <Image
                            src={urlFor(r.image).width(80).quality(80).url()}
                            alt={r.title || ""}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className={`flex h-12 w-12 flex-none items-center justify-center rounded-md ${isSelected ? "border border-white/20 text-or" : "border border-ink/15 text-noir"}`}>
                          <LineIcon name={iconForSection(sec.key)} size={18} />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className={`font-serif text-[17px] leading-tight ${isSelected ? "text-ivoire" : "text-noir"} truncate`}>
                          {r.title}
                        </div>
                        {(r.excerpt || r.tagline) && (
                          <div className={`mt-0.5 truncate font-sans text-[13px] ${isSelected ? "text-ivoire/70" : "text-taupe"}`}>
                            {r.tagline || r.excerpt}
                          </div>
                        )}
                      </div>
                      <span className={`ml-2 font-sans text-[10px] uppercase tracking-[0.14em] ${isSelected ? "text-or" : "text-taupe"}`}>
                        {CATEGORY_LABEL[sec.key]}
                      </span>
                      <LineIcon
                        name="arrow"
                        size={16}
                        className={`transition-transform ${isSelected ? "text-or translate-x-1" : "text-taupe opacity-0 group-hover:opacity-100"}`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function iconForSection(section: string): string {
  switch (section) {
    case "product":
      return "bed";
    case "guide":
      return "newspaper";
    case "glossary":
      return "book";
    case "comparison":
      return "chart";
    case "landingPage":
      return "sparkle";
    default:
      return "square";
  }
}
