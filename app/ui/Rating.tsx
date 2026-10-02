"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

/** Read-only star rating. Pass `count` to show the number of reviews. */
export const Rating = ({
  value,
  count,
  size = "sm",
}: {
  value: number;
  count?: number;
  size?: "sm" | "md";
}) => {
  const dimension = size === "md" ? "size-5" : "size-4";
  const rounded = Math.round(value);
  const label =
    count === 0 || (count === undefined && value === 0)
      ? "No reviews yet"
      : `Rated ${value.toFixed(1)} out of 5`;

  return (
    <div className="flex items-center gap-1.5" role="img" aria-label={label}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              dimension,
              star <= rounded ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200",
            )}
            aria-hidden="true"
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-slate-600">
          {count > 0 ? `${value.toFixed(1)} (${count})` : "New"}
        </span>
      )}
    </div>
  );
};

/** Interactive 1–5 star picker rendered as a radio group. */
export const RatingInput = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div
      role="radiogroup"
      aria-label="Rating"
      className="flex gap-1"
      onMouseLeave={() => setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star === 1 ? "" : "s"}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          className="cursor-pointer rounded p-0.5"
        >
          <Star
            className={cn(
              "size-8 transition-colors",
              star <= active ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-300",
            )}
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  );
};

export default Rating;
