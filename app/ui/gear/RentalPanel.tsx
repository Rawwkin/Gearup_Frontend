"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import Alert from "@/app/ui/Alert";
import Button from "@/app/ui/Button";
import ConfirmDialog from "@/app/ui/ConfirmDialog";
import Input from "@/app/ui/Input";
import { useAuth } from "@/app/ui/auth/AuthProvider";
import { useToast } from "@/app/ui/ToastProvider";
import { cartActions, useCart, validateDates, type CartItem } from "@/lib/cart-store";
import { addDaysISO, formatCurrency, pluralize, rentalDays } from "@/lib/format";
import { useToday } from "@/hooks/useToday";

/** The serializable subset of a gear item the panel needs. */
export interface RentalPanelGear {
  id: string;
  name: string;
  image: string | null;
  pricePerDay: number;
  availableQuantity: number;
  rentable: boolean;
  providerId: string;
  providerName: string;
}

const RentalPanel = ({ gear }: { gear: RentalPanelGear }) => {
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();
  const cart = useCart();
  const today = useToday();

  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [replaceOpen, setReplaceOpen] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState(false);

  const { startDate, endDate } = cart;
  const days = rentalDays(startDate, endDate);
  const total = gear.pricePerDay * quantity * days;
  const cannotRent = user !== null && user.role !== "CUSTOMER";

  const item: CartItem = {
    gearItemId: gear.id,
    name: gear.name,
    image: gear.image,
    pricePerDay: gear.pricePerDay,
    quantity,
    maxQuantity: gear.availableQuantity,
    providerId: gear.providerId,
    providerName: gear.providerName,
  };

  const handleStartChange = (value: string) => {
    const nextEnd = endDate && endDate > value ? endDate : value ? addDaysISO(value, 1) : "";
    cartActions.setDates(value, nextEnd);
    setError(null);
  };

  const handleEndChange = (value: string) => {
    cartActions.setDates(startDate, value);
    setError(null);
  };

  const submit = (goToCart: boolean) => {
    const problem = validateDates(startDate, endDate);
    if (problem) {
      setError(problem);
      return;
    }
    const result = cartActions.add(item);
    if (!result.ok) {
      setPendingCheckout(goToCart);
      setReplaceOpen(true);
      return;
    }
    if (goToCart) router.push("/cart");
    else toast.success(`${gear.name} was added to your cart.`);
  };

  const confirmReplace = () => {
    cartActions.replaceWith(item);
    setReplaceOpen(false);
    if (pendingCheckout) router.push("/cart");
    else toast.success("Your cart now contains this gear.");
  };

  if (!gear.rentable) {
    return (
      <Alert variant="warning" title="Currently unavailable">
        All units of this gear are booked right now. Check back soon or browse similar gear.
      </Alert>
    );
  }

  if (cannotRent) {
    return (
      <Alert variant="info" title="Customer accounts only">
        You&apos;re signed in as a {user?.role.toLowerCase()}. Sign in with a customer account to
        rent gear.
      </Alert>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h2 className="text-sm font-semibold text-slate-900">Plan your rental</h2>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Input
          label="Start date"
          type="date"
          value={startDate}
          min={today || undefined}
          onChange={(event) => handleStartChange(event.target.value)}
        />
        <Input
          label="End date"
          type="date"
          value={endDate}
          min={startDate ? addDaysISO(startDate, 1) : today || undefined}
          onChange={(event) => handleEndChange(event.target.value)}
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-700">Quantity</p>
          <p className="text-xs text-slate-500">{gear.availableQuantity} available</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="cursor-pointer rounded-l-lg p-2.5 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus className="size-4" aria-hidden="true" />
          </button>
          <span className="min-w-8 text-center text-sm font-semibold" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.min(gear.availableQuantity, current + 1))}
            disabled={quantity >= gear.availableQuantity}
            aria-label="Increase quantity"
            className="cursor-pointer rounded-r-lg p-2.5 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-white p-3 text-sm ring-1 ring-slate-200">
        {days > 0 ? (
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-600">
              {formatCurrency(gear.pricePerDay)} × {pluralize(quantity, "unit")} ×{" "}
              {pluralize(days, "day")}
            </span>
            <span className="text-base font-bold text-slate-900">{formatCurrency(total)}</span>
          </div>
        ) : (
          <p className="text-slate-600">Choose your dates to see the total.</p>
        )}
      </div>

      {error && (
        <Alert variant="error" className="mt-3">
          {error}
        </Alert>
      )}

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Button variant="outline" size="lg" onClick={() => submit(false)}>
          Add to cart
        </Button>
        <Button size="lg" onClick={() => submit(true)}>
          Rent now
        </Button>
      </div>

      {!user && (
        <p className="mt-3 text-center text-xs text-slate-600">
          You&apos;ll need to{" "}
          <Link href="/login?next=/cart" className="font-semibold text-brand-700 underline">
            sign in
          </Link>{" "}
          to place your request.
        </p>
      )}

      <ConfirmDialog
        open={replaceOpen}
        onClose={() => setReplaceOpen(false)}
        onConfirm={confirmReplace}
        title="Start a new cart?"
        description="Your cart already has gear from another provider. A single rental order can only include one provider's gear."
        confirmLabel="Replace cart"
        destructive
      />
    </div>
  );
};

export default RentalPanel;
