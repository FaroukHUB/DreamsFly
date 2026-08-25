"use client";
import Link from "next/link";
import { Logo } from "./logo";
import { useCart } from "@/lib/cart/store";
import { useEffect, useState } from "react";
import { UspStrip } from "./usp-strip";

type MenuItem = { label?: string; link?: string; highlight?: boolean };

export function Header({ settings }: { settings?: any }) {
  const topbar = settings?.topbar;
  const menu: MenuItem[] = settings?.mainMenu || DEFAULT_MENU;
  const { toggle, count } = useCart();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      {topbar?.enabled !== false && topbar?.message && (
        <div className="bg-noir px-4 py-2.5 text-center font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-ivoire md:text-[12px]">
          {topbar.link ? (
            <Link href={topbar.link} className="hover:text-or transition-colors">{topbar.message}</Link>
          ) : (
            topbar.message
          )}
        </div>
      )}

      <header className="sticky top-0 z-50 border-b border-ink/10 bg-page/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-site items-center justify-between px-4 py-4 md:px-8 md:py-5">
          {/* Hamburger mobile */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
            className="flex h-10 w-10 items-center justify-center text-ink lg:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <line x1="3" y1="7" x2="21" y2="7" />
              <line x1="3" y1="17" x2="21" y2="17" />
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" aria-label="DreamsFly — accueil" className="text-ink">
            <Logo size={26} />
          </Link>

          {/* Nav desktop */}
          <nav>
            <ul className="hidden items-center gap-9 lg:flex">
              {menu.map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.link || "#"}
                    className={`font-sans text-[12px] font-medium uppercase tracking-[0.16em] transition-colors ${item.highlight ? "text-or" : "text-ink hover:text-or"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions droite */}
          <div className="flex items-center gap-1 md:gap-2">
            <button
              aria-label="Rechercher (⌘K)"
              onClick={() => window.dispatchEvent(new Event("df:open-search"))}
              className="group hidden items-center gap-2 rounded-full border border-ink/15 px-3 py-2 font-sans text-[11px] uppercase tracking-[0.14em] text-taupe transition-all hover:border-noir hover:text-noir md:inline-flex"
            >
              <SearchIcon />
              <span className="hidden lg:inline">Rechercher</span>
              <kbd className="hidden rounded border border-ink/15 bg-page px-1.5 py-0.5 text-[10px] font-medium lg:inline">⌘K</kbd>
            </button>
            <button
              aria-label="Rechercher"
              onClick={() => window.dispatchEvent(new Event("df:open-search"))}
              className="p-2.5 text-ink transition-colors hover:text-or md:hidden"
            >
              <SearchIcon />
            </button>
            <button aria-label="Compte" className="hidden p-2.5 text-ink transition-colors hover:text-or md:block">
              <UserIcon />
            </button>
            <button
              onClick={toggle}
              aria-label="Ouvrir le panier"
              className="flex items-center gap-2 p-2.5 font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-ink hover:text-or"
            >
              <BagIcon />
              <span className="hidden md:inline">Panier</span>
              <span className="rounded-full bg-noir px-2 py-0.5 text-[10px] font-semibold text-or">
                {mounted ? count() : 0}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Bandeau USP défilant noir + or — sous le header sur toutes les pages */}
      {settings?.uspStripEnabled !== false && (
        <UspStrip tone="noir" items={settings?.uspStrip} />
      )}

      {/* Menu mobile drawer */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} menu={menu} />
    </>
  );
}

function MobileMenu({ open, onClose, menu }: { open: boolean; onClose: () => void; menu: MenuItem[] }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      <aside
        aria-label="Menu"
        className={`fixed inset-y-0 left-0 z-[70] flex w-full max-w-sm flex-col bg-ivoire shadow-2xl transition-transform duration-300 lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <header className="flex items-center justify-between border-b border-border p-5">
          <div className="text-ink"><Logo size={24} /></div>
          <button onClick={onClose} aria-label="Fermer" className="rounded-full p-2 hover:bg-sable">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        <nav className="flex-1 overflow-y-auto px-5 py-6">
          <ul className="space-y-1">
            {menu.map((item, i) => (
              <li key={i}>
                <Link
                  href={item.link || "#"}
                  onClick={onClose}
                  className={`block rounded-xl px-4 py-3.5 font-sora text-lg font-semibold transition-colors ${item.highlight ? "bg-discount/10 text-discount" : "text-ink hover:bg-sable"}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-border pt-6">
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-pierre">Aide</div>
            <ul className="space-y-1">
              <li><Link href="/aide/contact" onClick={onClose} className="block rounded-xl px-4 py-2.5 text-base text-ink hover:bg-sable">Contact</Link></li>
              <li><Link href="/aide/faq" onClick={onClose} className="block rounded-xl px-4 py-2.5 text-base text-ink hover:bg-sable">FAQ</Link></li>
              <li><Link href="/services/livraison" onClick={onClose} className="block rounded-xl px-4 py-2.5 text-base text-ink hover:bg-sable">Livraison</Link></li>
              <li><Link href="/services/garantie" onClick={onClose} className="block rounded-xl px-4 py-2.5 text-base text-ink hover:bg-sable">Garantie</Link></li>
              <li><Link href="/magasins" onClick={onClose} className="block rounded-xl px-4 py-2.5 text-base text-ink hover:bg-sable">Showrooms</Link></li>
            </ul>
          </div>
        </nav>

        <footer className="border-t border-border bg-sable p-5">
          <div className="text-xs text-pierre">
            <a href="tel:0785889260" className="font-semibold text-midnight">07 85 88 92 60</a>
            <span className="mx-2 text-brume">·</span>
            <a href="mailto:contact@dreamsfly.fr" className="text-midnight underline">contact@dreamsfly.fr</a>
          </div>
        </footer>
      </aside>
    </>
  );
}

const DEFAULT_MENU: MenuItem[] = [
  { label: "Promos", link: "/promos", highlight: true },
  { label: "Matelas", link: "/matelas" },
  { label: "Sommiers", link: "/sommiers" },
  { label: "Oreillers", link: "/oreillers" },
  { label: "Lits", link: "/lits" },
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
