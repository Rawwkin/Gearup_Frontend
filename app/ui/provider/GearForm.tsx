"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Alert from "@/app/ui/Alert";
import Button from "@/app/ui/Button";
import Card from "@/app/ui/Card";
import Input from "@/app/ui/Input";
import SafeImage from "@/app/ui/SafeImage";
import Select from "@/app/ui/Select";
import Textarea from "@/app/ui/Textarea";
import { useToast } from "@/app/ui/ToastProvider";
import { providerApi } from "@/lib/api";
import { buttonStyles } from "@/lib/button-styles";
import { isHttpUrl } from "@/lib/format";
import { getErrorMessage } from "@/lib/http";
import type { Category, GearItem } from "@/types";

const MAX_IMAGES = 8;

interface FieldErrors {
  name?: string;
  description?: string;
  categoryId?: string;
  pricePerDay?: string;
  quantity?: string;
  images?: string;
}

const parseImages = (raw: string): string[] =>
  raw
    .split(/\r?\n|,/)
    .map((line) => line.trim())
    .filter(Boolean);

const GearForm = ({ categories, gear }: { categories: Category[]; gear?: GearItem }) => {
  const router = useRouter();
  const toast = useToast();
  const isEdit = Boolean(gear);

  const [name, setName] = useState(gear?.name ?? "");
  const [description, setDescription] = useState(gear?.description ?? "");
  const [brand, setBrand] = useState(gear?.brand ?? "");
  const [location, setLocation] = useState(gear?.location ?? "");
  const [categoryId, setCategoryId] = useState(gear?.categoryId ?? "");
  const [pricePerDay, setPricePerDay] = useState(gear ? String(gear.pricePerDay) : "");
  const [quantity, setQuantity] = useState(gear ? String(gear.quantity) : "1");
  const [imagesText, setImagesText] = useState(gear?.images.join("\n") ?? "");
  const [isAvailable, setIsAvailable] = useState(gear?.isAvailable ?? true);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const images = parseImages(imagesText);
  const validImages = images.filter(isHttpUrl);

  const validate = (): FieldErrors => {
    const result: FieldErrors = {};
    if (name.trim().length < 2) result.name = "Give your gear a name.";
    if (description.trim().length < 10) result.description = "Describe the gear in at least 10 characters.";
    if (!categoryId) result.categoryId = "Choose a category.";
    const price = Number(pricePerDay);
    if (!pricePerDay || !Number.isFinite(price) || price <= 0) {
      result.pricePerDay = "Enter a price greater than 0.";
    }
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1) result.quantity = "Quantity must be a whole number, at least 1.";
    if (images.length > MAX_IMAGES) result.images = `Add at most ${MAX_IMAGES} images.`;
    else if (images.some((url) => !isHttpUrl(url))) {
      result.images = "Every image must be a full URL starting with http:// or https://.";
    }
    return result;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        brand: brand.trim() || undefined,
        location: location.trim() || undefined,
        categoryId,
        pricePerDay: Number(pricePerDay),
        quantity: Number(quantity),
        images: validImages,
      };
      if (gear) {
        await providerApi.updateGear(gear.id, { ...payload, isAvailable });
        toast.success("Listing updated.");
      } else {
        await providerApi.addGear(payload);
        toast.success("Gear added to your inventory.");
      }
      router.push("/dashboard/provider/inventory");
    } catch (submitError) {
      setFormError(getErrorMessage(submitError, "We couldn't save this listing."));
      setSubmitting(false);
    }
  };

  if (categories.length === 0) {
    return (
      <Alert variant="warning" title="No categories available yet">
        Gear must belong to a category, and only an admin can create categories. Ask an admin to add
        one, then come back.
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {formError && <Alert variant="error">{formError}</Alert>}

      <Card className="space-y-4 p-5 sm:p-6">
        <h2 className="font-semibold text-slate-900">Basics</h2>
        <Input
          label="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={errors.name}
          maxLength={255}
          required
        />
        <Textarea
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          error={errors.description}
          rows={5}
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Category"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            error={errors.categoryId}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Input label="Brand" value={brand} onChange={(event) => setBrand(event.target.value)} />
        </div>
        <Input
          label="Pickup location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="e.g. Chittagong"
        />
      </Card>

      <Card className="space-y-4 p-5 sm:p-6">
        <h2 className="font-semibold text-slate-900">Pricing &amp; stock</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Price per day (USD)"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={pricePerDay}
            onChange={(event) => setPricePerDay(event.target.value)}
            error={errors.pricePerDay}
            required
          />
          <Input
            label="Total quantity"
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            error={errors.quantity}
            hint={isEdit ? "Units currently rented out stay reserved." : undefined}
            required
          />
        </div>
        {isEdit && (
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(event) => setIsAvailable(event.target.checked)}
              className="size-4 rounded border-slate-300 accent-brand-700"
            />
            Listed and available for new rentals
          </label>
        )}
      </Card>

      <Card className="space-y-4 p-5 sm:p-6">
        <h2 className="font-semibold text-slate-900">Photos</h2>
        <Textarea
          label="Image URLs"
          value={imagesText}
          onChange={(event) => setImagesText(event.target.value)}
          error={errors.images}
          hint={`One URL per line, up to ${MAX_IMAGES}. The first image is the cover.`}
          rows={4}
          placeholder="https://example.com/photo.jpg"
        />
        {validImages.length > 0 && (
          <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {validImages.slice(0, MAX_IMAGES).map((url, index) => (
              <li key={`${url}-${index}`} className="relative aspect-square overflow-hidden rounded-lg bg-slate-100">
                <SafeImage src={url} alt={`Preview ${index + 1}`} sizes="120px" />
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Link href="/dashboard/provider/inventory" className={buttonStyles({ variant: "outline", size: "lg" })}>
          Cancel
        </Link>
        <Button type="submit" size="lg" loading={submitting}>
          {isEdit ? "Save changes" : "Add to inventory"}
        </Button>
      </div>
    </form>
  );
};

export default GearForm;
