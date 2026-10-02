const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// Dates are always formatted in UTC so the server and the browser render the
// same text (no hydration mismatches, no off-by-one-day for rental dates).
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const formatCurrency = (value: number): string => currencyFormatter.format(value);

export const formatDate = (value: string | Date | null | undefined): string => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
};

export const formatDateRange = (start: string, end: string): string =>
  `${formatDate(start)} → ${formatDate(end)}`;

/** Number of billable days — mirrors the backend: ceil(diff), minimum 1. */
export const rentalDays = (start: string, end: string): number => {
  const diff = new Date(end).getTime() - new Date(start).getTime();
  if (Number.isNaN(diff) || diff <= 0) return 0;
  return Math.max(Math.ceil(diff / MS_PER_DAY), 1);
};

export const shortId = (id: string): string => id.slice(0, 8).toUpperCase();

export const todayISO = (): string => new Date().toISOString().slice(0, 10);

export const addDaysISO = (iso: string, days: number): string => {
  const date = new Date(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

export const isHttpUrl = (value: string | null | undefined): value is string => {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const pluralize = (count: number, singular: string, plural = `${singular}s`): string =>
  `${count} ${count === 1 ? singular : plural}`;

export const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "?";
