import type { GearItem, ProviderProfile, Review } from "@/types";

export const averageRating = (reviews: Review[] | undefined): number => {
  if (!reviews || reviews.length === 0) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return total / reviews.length;
};

export const providerName = (provider: ProviderProfile | undefined): string =>
  provider?.businessName?.trim() || provider?.user?.name || "GearUp provider";

export const isRentable = (gear: GearItem): boolean =>
  gear.isAvailable && gear.availableQuantity > 0;

export type GearSort = "newest" | "price_asc" | "price_desc" | "rating";

export const GEAR_SORT_OPTIONS: { value: GearSort; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

export interface GearFilterState {
  q?: string;
  location?: string;
  available?: boolean;
  minRating?: number;
  sort?: GearSort;
}

/**
 * The backend only filters by category, brand and price. Everything else
 * (search text, location, availability, rating, sorting) is applied here.
 */
export const refineGear = (items: GearItem[], filters: GearFilterState): GearItem[] => {
  const query = filters.q?.trim().toLowerCase();
  const location = filters.location?.trim().toLowerCase();

  const result = items.filter((item) => {
    if (query) {
      const haystack = [item.name, item.brand, item.description, item.category?.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (location && !(item.location ?? "").toLowerCase().includes(location)) return false;
    if (filters.available && !isRentable(item)) return false;
    if (filters.minRating && averageRating(item.reviews) < filters.minRating) return false;
    return true;
  });

  switch (filters.sort) {
    case "price_asc":
      return [...result].sort((a, b) => a.pricePerDay - b.pricePerDay);
    case "price_desc":
      return [...result].sort((a, b) => b.pricePerDay - a.pricePerDay);
    case "rating":
      return [...result].sort((a, b) => averageRating(b.reviews) - averageRating(a.reviews));
    default:
      return result;
  }
};
