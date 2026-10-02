"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import Button from "@/app/ui/Button";
import Card from "@/app/ui/Card";
import Input from "@/app/ui/Input";
import Select from "@/app/ui/Select";
import { GEAR_SORT_OPTIONS } from "@/lib/gear";
import type { Category } from "@/types";

export interface GearFilterValues {
  q: string;
  category: string;
  brand: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  minRating: string;
  available: boolean;
  sort: string;
}

const GearFilters = ({
  categories,
  values,
}: {
  categories: Category[];
  values: GearFilterValues;
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    for (const [key, value] of data.entries()) {
      if (typeof value === "string" && value.trim() !== "") params.set(key, value.trim());
    }
    const query = params.toString();
    router.push(query ? `/gear?${query}` : "/gear");
  };

  return (
    <Card className="p-4 lg:sticky lg:top-24">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="gear-filters-form"
        className="flex w-full cursor-pointer items-center justify-between text-left lg:hidden"
      >
        <span className="flex items-center gap-2 font-semibold text-slate-900">
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Filters
        </span>
        <span className="text-sm text-brand-700">{open ? "Hide" : "Show"}</span>
      </button>
      <h2 className="hidden items-center gap-2 font-semibold text-slate-900 lg:flex">
        <SlidersHorizontal className="size-4" aria-hidden="true" />
        Filters
      </h2>

      {/* `key` remounts the form when the URL changes so the fields always match the results. */}
      <form
        key={JSON.stringify(values)}
        id="gear-filters-form"
        onSubmit={handleSubmit}
        className={`${open ? "block" : "hidden"} mt-4 space-y-4 lg:block`}
      >
        <Input label="Search" name="q" defaultValue={values.q} placeholder="Name, brand, keyword…" />
        <Select label="Category" name="category" defaultValue={values.category}>
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </Select>
        <Input label="Brand" name="brand" defaultValue={values.brand} />
        <Input label="Location" name="location" defaultValue={values.location} />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Min price"
            name="minPrice"
            type="number"
            min={0}
            step="0.01"
            inputMode="decimal"
            defaultValue={values.minPrice}
          />
          <Input
            label="Max price"
            name="maxPrice"
            type="number"
            min={0}
            step="0.01"
            inputMode="decimal"
            defaultValue={values.maxPrice}
          />
        </div>
        <Select label="Minimum rating" name="minRating" defaultValue={values.minRating}>
          <option value="">Any rating</option>
          <option value="4">4 stars &amp; up</option>
          <option value="3">3 stars &amp; up</option>
          <option value="2">2 stars &amp; up</option>
        </Select>
        <Select label="Sort by" name="sort" defaultValue={values.sort}>
          {GEAR_SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="available"
            value="true"
            defaultChecked={values.available}
            className="size-4 rounded border-slate-300 accent-brand-700"
          />
          Only show available gear
        </label>
        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            Apply
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/gear")}>
            Clear
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default GearFilters;
