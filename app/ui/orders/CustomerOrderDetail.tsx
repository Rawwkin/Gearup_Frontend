"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Alert from "@/app/ui/Alert";
import Button from "@/app/ui/Button";
import Card from "@/app/ui/Card";
import ConfirmDialog from "@/app/ui/ConfirmDialog";
import ErrorState from "@/app/ui/ErrorState";
import { OrderStatusBadge, PaymentStatusBadge } from "@/app/ui/StatusBadge";
import ListSkeleton from "@/app/ui/dashboard/ListSkeleton";
import OrderItemsTable from "@/app/ui/orders/OrderItemsTable";
import OrderProgress from "@/app/ui/orders/OrderProgress";
import ReviewAction from "@/app/ui/orders/ReviewAction";
import { useToast } from "@/app/ui/ToastProvider";
import { paymentsApi, rentalsApi } from "@/lib/api";
import { ORDER_STATUS_META } from "@/lib/constants";
import { providerName } from "@/lib/gear";
import { formatCurrency, formatDate, formatDateRange, shortId } from "@/lib/format";
import { getErrorMessage } from "@/lib/http";
import { useAsync } from "@/hooks/useAsync";

const CustomerOrderDetail = ({ orderId }: { orderId: string }) => {
  const toast = useToast();
  const fetchOrder = useCallback(() => rentalsApi.get(orderId), [orderId]);
  const { data: order, error, reload } = useAsync(fetchOrder);

  const [cancelOpen, setCancelOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (error) {
    return (
      <ErrorState
        title="We couldn't load this order"
        message={error}
        action={
          <Button variant="outline" onClick={reload}>
            Try again
          </Button>
        }
      />
    );
  }
  if (!order) return <ListSkeleton rows={3} />;

  const items = order.items ?? [];
  const meta = ORDER_STATUS_META[order.status];

  const handleCancel = async () => {
    try {
      await rentalsApi.cancel(order.id);
      toast.success("Your order was cancelled.");
      setCancelOpen(false);
      reload();
    } catch (cancelError) {
      toast.error(getErrorMessage(cancelError, "We couldn't cancel this order."));
      setCancelOpen(false);
    }
  };

  const handlePay = async () => {
    setPaying(true);
    setActionError(null);
    try {
      const { checkoutUrl } = await paymentsApi.createCheckout(order.id);
      if (!checkoutUrl) throw new Error("Stripe did not return a checkout link. Please try again.");
      window.location.assign(checkoutUrl);
    } catch (payError) {
      setActionError(getErrorMessage(payError, "We couldn't start the payment."));
      setPaying(false);
    }
  };

  return (
    <div>
      <Link
        href="/dashboard/customer/orders"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-brand-700"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All orders
      </Link>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Order #{shortId(order.id)}
            </h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Placed {formatDate(order.createdAt)} · {formatDateRange(order.startDate, order.endDate)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {order.status === "CONFIRMED" && (
            <Button size="lg" onClick={handlePay} loading={paying}>
              Pay {formatCurrency(order.totalAmount)}
            </Button>
          )}
          {order.status === "PLACED" && (
            <Button variant="outline" onClick={() => setCancelOpen(true)}>
              Cancel order
            </Button>
          )}
        </div>
      </div>

      {actionError && (
        <Alert variant="error" className="mb-4">
          {actionError}
        </Alert>
      )}

      <Card className="p-5">
        <OrderProgress status={order.status} />
        <p className="mt-4 text-sm text-slate-600">{meta.hint}</p>
      </Card>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_320px] xl:items-start">
        <section aria-labelledby="items-heading">
          <h2 id="items-heading" className="mb-3 text-lg font-semibold text-slate-900">
            Items
          </h2>
          <OrderItemsTable
            items={items}
            renderAction={
              order.status === "RETURNED"
                ? (item) => (
                    <ReviewAction
                      gearItemId={item.gearItemId}
                      gearName={item.gearItem?.name ?? "this gear"}
                    />
                  )
                : undefined
            }
          />
        </section>

        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="font-semibold text-slate-900">Summary</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-600">Provider</dt>
                <dd className="text-right font-medium text-slate-900">{providerName(order.provider)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-600">Start</dt>
                <dd className="font-medium text-slate-900">{formatDate(order.startDate)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-600">End</dt>
                <dd className="font-medium text-slate-900">{formatDate(order.endDate)}</dd>
              </div>
              <div className="flex justify-between gap-3 border-t border-slate-200 pt-3 text-base">
                <dt className="font-semibold text-slate-900">Total</dt>
                <dd className="font-bold text-slate-900">{formatCurrency(order.totalAmount)}</dd>
              </div>
            </dl>
          </Card>

          {order.payment && (
            <Card className="p-5">
              <h2 className="font-semibold text-slate-900">Payment</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-600">Status</dt>
                  <dd>
                    <PaymentStatusBadge status={order.payment.status} />
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-600">Amount</dt>
                  <dd className="font-medium text-slate-900">{formatCurrency(order.payment.amount)}</dd>
                </div>
                {order.payment.paidAt && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-600">Paid on</dt>
                    <dd className="font-medium text-slate-900">{formatDate(order.payment.paidAt)}</dd>
                  </div>
                )}
              </dl>
            </Card>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancel}
        title="Cancel this order?"
        description="The reserved gear will be released for other renters. This can't be undone."
        confirmLabel="Cancel order"
        destructive
      />
    </div>
  );
};

export default CustomerOrderDetail;
