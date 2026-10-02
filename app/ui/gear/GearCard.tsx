import Link from "next/link";
import { MapPin } from "lucide-react";
import Badge from "@/app/ui/Badge";
import Rating from "@/app/ui/Rating";
import SafeImage from "@/app/ui/SafeImage";
import { averageRating, isRentable, providerName } from "@/lib/gear";
import { formatCurrency } from "@/lib/format";
import type { GearItem } from "@/types";

const GearCard = ({ gear }: { gear: GearItem }) => {
  const rentable = isRentable(gear);
  const reviews = gear.reviews ?? [];

  return (
    <Link
      href={`/gear/${gear.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <SafeImage
          src={gear.images[0]}
          alt={gear.name}
          className="transition-transform duration-300 group-hover:scale-105"
        />
        {!rentable && (
          <div className="absolute left-3 top-3">
            <Badge tone="danger">Unavailable</Badge>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
          <span className="truncate font-medium uppercase tracking-wide">
            {gear.category?.name ?? "Gear"}
          </span>
          {gear.brand && <span className="truncate">{gear.brand}</span>}
        </div>
        <h3 className="mt-1 line-clamp-2 text-base font-semibold text-slate-900 group-hover:text-brand-700">
          {gear.name}
        </h3>
        <p className="mt-1 truncate text-sm text-slate-600">by {providerName(gear.provider)}</p>
        <div className="mt-2">
          <Rating value={averageRating(reviews)} count={reviews.length} />
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <p className="text-lg font-bold text-slate-900">
            {formatCurrency(gear.pricePerDay)}
            <span className="text-sm font-normal text-slate-500"> / day</span>
          </p>
          {gear.location && (
            <p className="flex min-w-0 items-center gap-1 text-xs text-slate-500">
              <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{gear.location}</span>
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default GearCard;
