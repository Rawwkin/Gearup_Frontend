import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/app/ui/Container";
import EmptyState from "@/app/ui/EmptyState";
import ErrorState from "@/app/ui/ErrorState";
import GearFilters, { type GearFilterValues } from "@/app/ui/gear/GearFilters";
import GearGrid from "@/app/ui/gear/GearGrid";
import Pagination from "@/app/ui/Pagination";
import { buttonStyles } from "@/lib/button-styles";
import { categoriesApi, gearApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/http";
import { GEAR_SORT_OPTIONS, refineGear, type GearSort } from "@/lib/gear";
import { pluralize } from "@/lib/format";
import type { Category, GearItem } from "@/types";

export const metadata: Metadata = {
  title: "Browse gear",
  description: "Search and filter gear available to rent by the day.",
};

const PAGE_SIZE = 12;

type SearchParams = { [key: string]: string | string[] | undefined };

const first = (value: string | string[] | undefined): string =>
  (Array.isArray(value) ? value[0] : value)?.trim() ?? "";

/** Keep only non-negative numbers — the backend runs Number() on these and rejects NaN. */
const positiveNumber = (value: string): string => {
  if (value === "") return "";
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? String(parsed) : "";
};

const GearPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const params = await searchParams;

  const values: GearFilterValues = {
    q: first(params.q),
    category: first(params.category),
    brand: first(params.brand),
    location: first(params.location),
    minPrice: positiveNumber(first(params.minPrice)),
    maxPrice: positiveNumber(first(params.maxPrice)),
    minRating: ["2", "3", "4"].includes(first(params.minRating)) ? first(params.minRating) : "",
    available: first(params.available) === "true",
    sort: GEAR_SORT_OPTIONS.some((option) => option.value === first(params.sort))
      ? first(params.sort)
      : "newest",
  };
  const requestedPage = Number.parseInt(first(params.page), 10);

  let categories: Category[] = [];
  let items: GearItem[] = [];
  let loadError: string | null = null;

  const [categoriesResult, gearResult] = await Promise.allSettled([
    categoriesApi.list(),
    gearApi.list({
      category: values.category,
      brand: values.brand,
      minPrice: values.minPrice,
      maxPrice: values.maxPrice,
    }),
  ]);
  if (categoriesResult.status === "fulfilled") categories = categoriesResult.value;
  if (gearResult.status === "fulfilled") items = gearResult.value;
  else loadError = getErrorMessage(gearResult.reason, "Unable to load gear right now.");

  const filtered = refineGear(items, {
    q: values.q,
    location: values.location,
    available: values.available,
    minRating: values.minRating ? Number(values.minRating) : undefined,
    sort: values.sort as GearSort,
  });

  const totalPages = Math.max(Math.ceil(filtered.length / PAGE_SIZE), 1);
  const page = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1;
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hrefFor = (target: number): string => {
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries(values)) {
      if (value !== "" && value !== false && !(key === "sort" && value === "newest")) {
        next.set(key, String(value));
      }
    }
    if (target > 1) next.set("page", String(target));
    const query = next.toString();
    return query ? `/gear?${query}` : "/gear";
  };

  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Browse gear</h1>
        <p className="mt-1 text-slate-600">
          {loadError
            ? "Find the right gear for your next project or adventure."
            : `${pluralize(filtered.length, "item")} available to rent`}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
        <GearFilters categories={categories} values={values} />

        <div>
          {loadError ? (
            <ErrorState
              message={loadError}
              action={
                <Link href={hrefFor(page)} className={buttonStyles({ variant: "outline" })}>
                  Try again
                </Link>
              }
            />
          ) : visible.length === 0 ? (
            <EmptyState
              title="No gear matches your filters"
              description="Try widening your search or clearing some filters."
              action={
                <Link href="/gear" className={buttonStyles({ variant: "outline" })}>
                  Clear all filters
                </Link>
              }
            />
          ) : (
            <>
              <GearGrid items={visible} />
              <Pagination page={page} totalPages={totalPages} hrefFor={hrefFor} />
            </>
          )}
        </div>
      </div>
    </Container>
  );
};

export default GearPage;
