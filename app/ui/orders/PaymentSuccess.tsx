"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, CircleAlert } from "lucide-react";
import Button from "@/app/ui/Button";
import Card from "@/app/ui/Card";
import Spinner from "@/app/ui/Spinner";
import { useAuth } from "@/app/ui/auth/AuthProvider";
import { paymentsApi } from "@/lib/api";
import { buttonStyles } from "@/lib/button-styles";
import { formatCurrency } from "@/lib/format";
import { getErrorMessage } from "@/lib/http";
import type { Payment } from "@/types";

type Phase =
  | { name: "confirming" }
  | { name: "success"; payment: Payment }
  | { name: "error"; message: string };

const MAX_ATTEMPTS = 4;
const RETRY_DELAY_MS = 2500;

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/**
 * Stripe redirects here with only `?orderId=`. The backend needs the Checkout session id to
 * verify the payment, so we look up the pending payment for this order, then confirm it.
 */
const PaymentSuccess = ({ orderId }: { orderId: string | null }) => {
  const { status } = useAuth();
  const [attempt, setAttempt] = useState(0);
  const [phase, setPhase] = useState<Phase>({ name: "confirming" });

  useEffect(() => {
    if (status !== "authenticated" || !orderId) return;
    let ignore = false;

    const run = async () => {
      try {
        const payments = await paymentsApi.list();
        const payment = payments.find((entry) => entry.rentalOrderId === orderId);
        if (!payment) throw new Error("We couldn't find a payment for this order.");
        if (payment.status === "COMPLETED") {
          if (!ignore) setPhase({ name: "success", payment });
          return;
        }
        if (!payment.sessionId) throw new Error("This payment has no active checkout session.");

        let lastError = "We couldn't confirm your payment yet.";
        for (let tries = 0; tries < MAX_ATTEMPTS; tries += 1) {
          if (ignore) return;
          try {
            const confirmed = await paymentsApi.confirm({ sessionId: payment.sessionId });
            if (!ignore) setPhase({ name: "success", payment: confirmed });
            return;
          } catch (confirmError) {
            lastError = getErrorMessage(confirmError, lastError);
            // Stripe can take a moment to mark the session as paid — retry only for that case.
            if (!/not completed yet/i.test(lastError)) break;
            await wait(RETRY_DELAY_MS);
          }
        }
        throw new Error(lastError);
      } catch (runError) {
        if (!ignore) setPhase({ name: "error", message: getErrorMessage(runError) });
      }
    };

    void run();
    return () => {
      ignore = true;
    };
  }, [status, orderId, attempt]);

  const retry = () => {
    setPhase({ name: "confirming" });
    setAttempt((current) => current + 1);
  };

  const orderHref = orderId ? `/dashboard/customer/orders/${orderId}` : "/dashboard/customer/orders";

  if (!orderId) {
    return (
      <Card className="mx-auto max-w-lg p-8 text-center">
        <CircleAlert className="mx-auto size-12 text-amber-500" aria-hidden="true" />
        <h1 className="mt-4 text-xl font-bold text-slate-900">Missing order reference</h1>
        <p className="mt-2 text-sm text-slate-600">
          We couldn&apos;t tell which order this payment belongs to. Check your orders for the latest
          status.
        </p>
        <Link href="/dashboard/customer/orders" className={buttonStyles({ className: "mt-6" })}>
          View my orders
        </Link>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-lg p-8 text-center" aria-live="polite">
      {phase.name === "confirming" && (
        <>
          <Spinner className="mx-auto size-10 text-brand-700" />
          <h1 className="mt-4 text-xl font-bold text-slate-900">Confirming your payment…</h1>
          <p className="mt-2 text-sm text-slate-600">
            This only takes a moment. Please don&apos;t close this page.
          </p>
        </>
      )}

      {phase.name === "success" && (
        <>
          <CheckCircle2 className="mx-auto size-14 text-emerald-600" aria-hidden="true" />
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Payment successful</h1>
          <p className="mt-2 text-sm text-slate-600">
            We received {formatCurrency(phase.payment.amount)}. Your order is now paid — arrange
            pick-up with the provider.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link href={orderHref} className={buttonStyles()}>
              View order
            </Link>
            <Link href="/gear" className={buttonStyles({ variant: "outline" })}>
              Keep browsing
            </Link>
          </div>
        </>
      )}

      {phase.name === "error" && (
        <>
          <CircleAlert className="mx-auto size-14 text-amber-500" aria-hidden="true" />
          <h1 className="mt-4 text-xl font-bold text-slate-900">We couldn&apos;t confirm your payment</h1>
          <p className="mt-2 text-sm text-slate-600">{phase.message}</p>
          <p className="mt-2 text-xs text-slate-500">
            If you were charged, don&apos;t pay again — try confirming once more or check your order.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button onClick={retry}>Try again</Button>
            <Link href={orderHref} className={buttonStyles({ variant: "outline" })}>
              View order
            </Link>
          </div>
        </>
      )}
    </Card>
  );
};

export default PaymentSuccess;
