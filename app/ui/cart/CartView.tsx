"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Alert from "@/app/ui/Alert";
import Button from "@/app/ui/Button";
import Card from "@/app/ui/Card";
import EmptyState from "@/app/ui/EmptyState";
import Input from "@/app/ui/Input";
import SafeImage from "@/app/ui/SafeImage";
import { useAuth } from "@/app/ui/auth/AuthProvider";
import { useToast } from "@/app/ui/ToastProvider";
import { rentalsApi } from "@/lib/api";
import { buttonStyles } from "@/lib/button-styles";
import {
  cartActions,
  cartDays,
  cartTotal,
  useCart,
  validateDates,
} from "@/lib/cart-store";
import { addDaysISO, formatCurrency, pluralize } from "@/lib/format";
import { getErrorMessage } from "@/lib/http";
import { useToday } from "@/hooks/useToday";

const CartView = () => {
  const router = useRouter();
  const toast = useToast();
  const { user, status } = useAuth();
  const cart = useCart();
  const today = useToday();

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (cart.items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        description="Find some gear and pick your rental dates to get started."
        action={
          <Link href="/gear" className={buttonStyles()}>
            Browse gear
          </Link>
        }
      />
    );
  }

  const days = cartDays(cart);
  const total = cartTotal(cart);
  const providerName = cart.items[0]?.providerName;
  const blocked = user !== null && user.role !== "CUSTOMER";

  const handleStartChange = (value: string) => {
    const nextEnd = cart.endDate && cart.endDate > value ? cart.endDate : value ? addDaysISO(value, 1) : "";
    cartActions.setDates(value, nextEnd);
    setError(null);
  };

  const handleCheckout = async () => {
    setError(null);

    if (status === "unauthenticated") {
      router.push("/login?next=/cart");
      return;
    }
    if (blocked) {
      setError("Only customer accounts can place rental orders.");
      return;
    }
    const problem = validateDates(cart.startDate, cart.endDate);
    if (problem) {
      setError(problem);
      return;
    }

    setSubmitting(true);
    try {
      const order = await rentalsApi.create({
        items: cart.items.map(({ gearItemId, quantity }) => ({ gearItemId, quantity })),
        startDate: new Date(cart.startDate).toISOString(),
        endDate: new Date(cart.endDate).toISOString(),
      });
      cartActions.clear();
      toast.success("Rental request sent! You can pay once the provider confirms.");
      router.push(`/dashboard/customer/orders/${order.id}`);
    } catch (submitError) {
      setError(getErrorMessage(submitError, "We couldn't place your request."));
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
      <div className="space-y-4">
        <Card className="p-4 sm:p-5">
          <h2 className="font-semibold text-slate-900">Rental dates</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Input
              label="Start date"
              type="date"
              value={cart.startDate}
              min={today || undefined}
              onChange={(event) => handleStartChange(event.target.value)}
            />
            <Input
              label="End date"
              type="date"
              value={cart.endDate}
              min={cart.startDate ? addDaysISO(cart.startDate, 1) : today || undefined}
              onChange={(event) => {
                cartActions.setDates(cart.startDate, event.target.value);
                setError(null);
              }}
            />
          </div>
        </Card>

        <Card>
          <ul className="divide-y divide-slate-100">
            {cart.items.map((item) => (
              <li key={item.gearItemId} className="flex gap-4 p-4 sm:p-5">
                <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:size-28">
                  <SafeImage src={item.image} alt={item.name} sizes="112px" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/gear/${item.gearItemId}`}
                        className="line-clamp-2 font-semibold text-slate-900 hover:text-brand-700"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-0.5 text-sm text-slate-600">
                        {formatCurrency(item.pricePerDay)} / day
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => cartActions.remove(item.gearItemId)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="cursor-pointer rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                    <div className="flex items-center rounded-lg border border-slate-300">
                      <button
                        type="button"
                        onClick={() => cartActions.setQuantity(item.gearItemId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="cursor-pointer rounded-l-lg p-2 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Minus className="size-4" aria-hidden="true" />
                      </button>
                      <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => cartActions.setQuantity(item.gearItemId, item.quantity + 1)}
                        disabled={item.quantity >= item.maxQuantity}
                        aria-label={`Increase quantity of ${item.name}`}
                        className="cursor-pointer rounded-r-lg p-2 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Plus className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                    <p className="font-semibold text-slate-900">
                      {days > 0 ? formatCurrency(item.pricePerDay * item.quantity * days) : "—"}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-5 lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
        <p className="mt-1 text-sm text-slate-600">Provider: {providerName}</p>

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-600">Items</dt>
            <dd className="font-medium text-slate-900">
              {pluralize(
                cart.items.reduce((sum, item) => sum + item.quantity, 0),
                "unit",
              )}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-600">Duration</dt>
            <dd className="font-medium text-slate-900">
              {days > 0 ? pluralize(days, "day") : "Choose dates"}
            </dd>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-3 text-base">
            <dt className="font-semibold text-slate-900">Total</dt>
            <dd className="font-bold text-slate-900">{days > 0 ? formatCurrency(total) : "—"}</dd>
          </div>
        </dl>

        {error && (
          <Alert variant="error" className="mt-4">
            {error}
          </Alert>
        )}
        {blocked && !error && (
          <Alert variant="info" className="mt-4">
            You&apos;re signed in as a {user?.role.toLowerCase()}. Only customer accounts can place
            rental orders.
          </Alert>
        )}

        <Button
          size="lg"
          fullWidth
          className="mt-5"
          loading={submitting}
          disabled={status === "loading" || blocked}
          onClick={handleCheckout}
        >
          {status === "unauthenticated" ? "Sign in to continue" : "Send rental request"}
        </Button>
        <p className="mt-3 text-xs text-slate-500">
          You won&apos;t be charged yet. The provider reviews your request first — once they
          confirm, you can pay securely by card.
        </p>
        <button
          type="button"
          onClick={() => cartActions.clear()}
          className="mt-4 w-full cursor-pointer text-center text-sm font-medium text-slate-600 hover:text-red-600"
        >
          Clear cart
        </button>
      </Card>
    </div>
  );
};

export default CartView;
