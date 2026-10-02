import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, ChevronRight, MapPin, Package } from "lucide-react";
import Badge from "@/app/ui/Badge";
import Card from "@/app/ui/Card";
import Container from "@/app/ui/Container";
import ErrorState from "@/app/ui/ErrorState";
import Rating from "@/app/ui/Rating";
import GearGallery from "@/app/ui/gear/GearGallery";
import RentalPanel from "@/app/ui/gear/RentalPanel";
import ReviewList from "@/app/ui/gear/ReviewList";
import { buttonStyles } from "@/lib/button-styles";
import { gearApi } from "@/lib/api";
import { averageRating, isRentable, providerName } from "@/lib/gear";
import { ApiError, getErrorMessage } from "@/lib/http";
import { formatCurrency } from "@/lib/format";
import type { GearItem } from "@/types";

type Params = { params: Promise<{ id: string }> };

// De-duplicates the request between generateMetadata() and the page within one render.
const getGear = cache((id: string) => gearApi.get(id));

const loadGear = async (
  id: string,
): Promise<{ gear: GearItem; error?: undefined } | { gear?: undefined; error: string }> => {
  try {
    return { gear: await getGear(id) };
  } catch (error) {
    // Unknown ids surface as 404 (or 400 for malformed ids) — treat both as "not found".
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) notFound();
    return { error: getErrorMessage(error, "Unable to load this gear right now.") };
  }
};

export const generateMetadata = async ({ params }: Params): Promise<Metadata> => {
  const { id } = await params;
  try {
    const gear = await getGear(id);
    return { title: gear.name, description: gear.description.slice(0, 160) };
  } catch {
    return { title: "Gear details" };
  }
};

const GearDetailPage = async ({ params }: Params) => {
  const { id } = await params;
  const result = await loadGear(id);

  if (result.error !== undefined) {
    return (
      <Container className="py-12">
        <ErrorState
          message={result.error}
          action={
            <Link href={`/gear/${id}`} className={buttonStyles({ variant: "outline" })}>
              Try again
            </Link>
          }
        />
      </Container>
    );
  }

  const { gear } = result;
  const reviews = gear.reviews ?? [];
  const seller = providerName(gear.provider);

  return (
    <Container className="py-8 sm:py-10">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
        <Link href="/gear" className="hover:text-brand-700">
          Browse gear
        </Link>
        {gear.category && (
          <>
            <ChevronRight className="size-4" aria-hidden="true" />
            <Link
              href={`/gear?category=${encodeURIComponent(gear.category.name)}`}
              className="hover:text-brand-700"
            >
              {gear.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="size-4" aria-hidden="true" />
        <span className="truncate text-slate-700" aria-current="page">
          {gear.name}
        </span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <GearGallery images={gear.images} name={gear.name} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {gear.category && <Badge tone="brand">{gear.category.name}</Badge>}
            {gear.brand && <Badge>{gear.brand}</Badge>}
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{gear.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            <Rating value={averageRating(reviews)} count={reviews.length} size="md" />
            {gear.location && (
              <span className="flex items-center gap-1 text-sm text-slate-600">
                <MapPin className="size-4" aria-hidden="true" />
                {gear.location}
              </span>
            )}
          </div>

          <p className="mt-5 text-3xl font-extrabold text-slate-900">
            {formatCurrency(gear.pricePerDay)}
            <span className="text-base font-normal text-slate-500"> / day</span>
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
            <Package className="size-4" aria-hidden="true" />
            {isRentable(gear)
              ? `${gear.availableQuantity} of ${gear.quantity} available`
              : "Currently unavailable"}
          </p>

          <div className="mt-6">
            <RentalPanel
              gear={{
                id: gear.id,
                name: gear.name,
                image: gear.images[0] ?? null,
                pricePerDay: gear.pricePerDay,
                availableQuantity: gear.availableQuantity,
                rentable: isRentable(gear),
                providerId: gear.providerId,
                providerName: seller,
              }}
            />
          </div>

          <Card className="mt-6 flex items-center gap-3 p-4">
            <span className="flex size-11 items-center justify-center rounded-full bg-brand-50 text-brand-700">
              <BadgeCheck className="size-6" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-slate-500">Provided by</p>
              <p className="truncate font-semibold text-slate-900">{seller}</p>
              {gear.provider?.verified && <p className="text-xs text-emerald-700">Verified provider</p>}
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <section aria-labelledby="description-heading">
          <h2 id="description-heading" className="text-xl font-bold text-slate-900">
            About this gear
          </h2>
          <p className="mt-3 whitespace-pre-line text-slate-700">{gear.description}</p>
        </section>
        <section aria-labelledby="reviews-heading">
          <h2 id="reviews-heading" className="text-xl font-bold text-slate-900">
            Reviews ({reviews.length})
          </h2>
          <div className="mt-3">
            <ReviewList reviews={reviews} />
          </div>
        </section>
      </div>
    </Container>
  );
};

export default GearDetailPage;
