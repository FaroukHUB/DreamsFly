"use client";
import Link from "next/link";
import { Logo } from "./logo";
import { useCart } from "@/lib/cart/store";
import { useEffect, useState } from "react";

type MenuItem = { label?: string; link?: string; highlight?: boolean };

export function Header({ settings }: { settings?: any }) {
  const topbar = settings?.topbar;
  const menu: MenuItem[] = settings?.mainMenu || DEFAULT_MENU;
  const { toggle, count } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      {topbar?.enabled !== false && topbar?.message && (
        <div className="bg-midnight px-5 py-2.5 text-center text-[13px] font-medium text-white">
          {topbar.link ? (
            <Link href={topbar.link} className="hover:text-aurora">
              {topbar.message}
            </Link>
          ) : (
            topbar.message
          )}
        </div>
      )}

      <header className="sticky top-0 z-50 border-b border-border bg-ivoire/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-site items-center justify-between px-8 py-4">
          <Link href="/" aria-label="DreamsFly — accueil" className="text-ink">
            <Logo size={28} />
          </Link>

          <nav>
            <ul className="hidden items-center gap-7 lg:flex">
              {menu.map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.link || "#"}
                    className={`text-sm font-medium transition-colors ${
                      item.highlight ? "text-discount font-semibold" : "text-ink hover:text-midnight"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <button aria-label="Recherche" className="p-2 text-ink transition-colors hover:text-midnight">
              <SearchIcon />
            </button>
            <button aria-label="Compte" className="p-2 text-ink transition-colors hover:text-midnight">
              <UserIcon />
            </button>
            <button
              onClick={toggle}
              aria-label="Ouvrir le panier"
              className="flex items-center gap-1.5 p-2 text-sm font-medium text-ink hover:text-midnight"
            >
              <BagIcon />
              <span className="hidden sm:inline">Panier</span>
              <span className="rounded-pill bg-midnight px-2 py-0.5 text-[11px] font-semibold text-white">
                {mounted ? count() : 0}
              </span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

const DEFAULT_MENU: MenuItem[] = [
  { label: "Promos", link: "/promos", highlight: true },
  { label: "Matelas", link: "/matelas" },
  { label: "Sommiers", link: "/sommiers" },
  { label: "Oreillers", link: "/oreillers" },
  { label: "Linge de lit", link: "/linge-de-lit" },
  { label: "Magazine", link: "/magazine" },
  { label: "Magasins", link: "/magasins" },
];

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
