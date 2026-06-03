"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartLine = {
  productId: string;
  productSlug: string;
  productName: string;
  variantKey: string;
  variantSize?: string;
  sku?: string;
  unitPrice: number;
  compareAtPrice?: number;
  image?: string;
  stripePriceId?: string;
  quantity: number;
};

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  remove: (variantKey: string) => void;
  setQuantity: (variantKey: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  /** Sous-total avant promo (somme unitPrice × quantity). */
  subtotal: () => number;
  /** Nombre d'articles dans le panier. */
  count: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      add: (line, quantity = 1) => {
        const existing = get().lines.find((l) => l.variantKey === line.variantKey);
        if (existing) {
          set({
            lines: get().lines.map((l) =>
              l.variantKey === line.variantKey ? { ...l, quantity: l.quantity + quantity } : l
            ),
            isOpen: true,
          });
        } else {
          set({ lines: [...get().lines, { ...line, quantity }], isOpen: true });
        }
      },
      remove: (variantKey) =>
        set({ lines: get().lines.filter((l) => l.variantKey !== variantKey) }),
      setQuantity: (variantKey, quantity) => {
        if (quantity <= 0) {
          get().remove(variantKey);
          return;
        }
        set({
          lines: get().lines.map((l) =>
            l.variantKey === variantKey ? { ...l, quantity } : l
          ),
        });
      },
      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set({ isOpen: !get().isOpen }),
      subtotal: () => get().lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0),
      count: () => get().lines.reduce((n, l) => n + l.quantity, 0),
    }),
    {
      name: "dreamsfly-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines }),
    }
  )
);
