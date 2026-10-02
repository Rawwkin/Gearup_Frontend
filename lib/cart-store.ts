import { useSyncExternalStore } from "react";
import { addDaysISO, rentalDays, todayISO } from "@/lib/format";

/**
 * Client-side rental cart persisted in localStorage.
 * Implemented as an external store so it is safe with SSR / hydration.
 */

export interface CartItem {
  gearItemId: string;
  name: string;
  image: string | null;
  pricePerDay: number;
  quantity: number;
  maxQuantity: number;
  providerId: string;
  providerName: string;
}

export interface CartState {
  items: CartItem[];
  startDate: string;
  endDate: string;
}

const STORAGE_KEY = "gearup:cart:v1";
const EMPTY_CART: CartState = { items: [], startDate: "", endDate: "" };

let cache: CartState | null = null;
const listeners = new Set<() => void>();

const isCartItem = (value: unknown): value is CartItem => {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.gearItemId === "string" &&
    typeof item.name === "string" &&
    typeof item.pricePerDay === "number" &&
    typeof item.quantity === "number" &&
    typeof item.maxQuantity === "number" &&
    typeof item.providerId === "string" &&
    typeof item.providerName === "string"
  );
};

const parseCart = (raw: string | null): CartState => {
  if (!raw) return EMPTY_CART;
  try {
    const parsed = JSON.parse(raw) as Partial<CartState>;
    return {
      items: Array.isArray(parsed.items) ? parsed.items.filter(isCartItem) : [],
      startDate: typeof parsed.startDate === "string" ? parsed.startDate : "",
      endDate: typeof parsed.endDate === "string" ? parsed.endDate : "",
    };
  } catch {
    return EMPTY_CART;
  }
};

const read = (): CartState => {
  if (cache) return cache;
  try {
    cache = parseCart(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    cache = EMPTY_CART;
  }
  return cache;
};

const write = (next: CartState) => {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage may be unavailable (private mode / quota) — keep the in-memory copy.
  }
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
};

export const useCart = (): CartState =>
  useSyncExternalStore(subscribe, read, () => EMPTY_CART);

export type AddResult = { ok: true } | { ok: false; reason: "provider-mismatch" };

export const cartActions = {
  add(item: CartItem): AddResult {
    const state = read();
    const other = state.items[0];
    if (other && other.providerId !== item.providerId) {
      return { ok: false, reason: "provider-mismatch" };
    }
    const existing = state.items.find((entry) => entry.gearItemId === item.gearItemId);
    const items = existing
      ? state.items.map((entry) =>
          entry.gearItemId === item.gearItemId
            ? {
                ...entry,
                ...item,
                quantity: Math.min(entry.quantity + item.quantity, item.maxQuantity),
              }
            : entry,
        )
      : [...state.items, { ...item, quantity: Math.min(item.quantity, item.maxQuantity) }];
    write({ ...state, items });
    return { ok: true };
  },
  replaceWith(item: CartItem) {
    const state = read();
    write({ ...state, items: [{ ...item, quantity: Math.min(item.quantity, item.maxQuantity) }] });
  },
  setQuantity(gearItemId: string, quantity: number) {
    const state = read();
    write({
      ...state,
      items: state.items.map((entry) =>
        entry.gearItemId === gearItemId
          ? { ...entry, quantity: Math.max(1, Math.min(quantity, entry.maxQuantity)) }
          : entry,
      ),
    });
  },
  remove(gearItemId: string) {
    const state = read();
    write({ ...state, items: state.items.filter((entry) => entry.gearItemId !== gearItemId) });
  },
  setDates(startDate: string, endDate: string) {
    write({ ...read(), startDate, endDate });
  },
  clear() {
    write(EMPTY_CART);
  },
};

export const cartCount = (state: CartState): number =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

export const cartDays = (state: CartState): number => rentalDays(state.startDate, state.endDate);

export const cartTotal = (state: CartState): number =>
  state.items.reduce((sum, item) => sum + item.pricePerDay * item.quantity, 0) *
  cartDays(state);

/** Returns a human-readable problem with the chosen dates, or null when they are valid. */
export const validateDates = (startDate: string, endDate: string): string | null => {
  if (!startDate || !endDate) return "Choose a start and end date.";
  if (startDate < todayISO()) return "The start date can't be in the past.";
  if (endDate <= startDate) return "The end date must be after the start date.";
  return null;
};

export const defaultEndDate = (startDate: string): string => addDaysISO(startDate, 1);
