"use client";

import { useState } from "react";
import { CalendarDays, ClipboardList, Mail, Phone } from "lucide-react";
import Button from "@/app/ui/Button";
import Card from "@/app/ui/Card";
import ConfirmDialog from "@/app/ui/ConfirmDialog";
import EmptyState from "@/app/ui/EmptyState";
import ErrorState from "@/app/ui/ErrorState";
import PageHeader from "@/app/ui/PageHeader";
import { OrderStatusBadge, PaymentStatusBadge } from "@/app/ui/StatusBadge";
import { useToast } from "@/app/ui/ToastProvider";
import ListSkeleton from "@/app/ui/dashboard/ListSkeleton";
import OrderItemsTable from "@/app/ui/orders/OrderItemsTable";
import { providerApi } from "@/lib/api";
import { PROVIDER_ACTIONS, ORDER_STATUS_META } from "@/lib/constants";
import { formatCurrency, formatDate, formatDateRange, shortId } from "@/lib/format";
import { getErrorMessage } from "@/lib/http";
import { cn } from "@/lib/cn";
import { useAsync } from "@/hooks/useAsync";
import type { RentalOrder, RentalOrderStatus } from "@/types";

type Filter = "ALL" | RentalOrderStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PLACED", label: "New" },
  { value: "CONFIRMED", label: "Awaiting payment" },
  { value: "PAID", label: "Ready for pickup" },
  { value: "PICKED_UP", label: "Out on rent" },
  { value: "RETURNED", label: "Returned" },
  { value: "CANCELLED", label: "Cancelled" },
];

interface PendingAction {
  order: RentalOrder;
  status: RentalOrderStatus;
  label: string;
}

const IncomingOrders = () => {
  const toast = useToast();
  const { data: orders, error, reload } = useAsync(providerApi.myOrders);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingAction | null>(null);

  if (error) {
    return (
      <ErrorState
        title="We couldn't load your orders"
        message={error}
        action={
          <Button variant="outline" onClick={reload}>
            Try again
          </Button>
        }
      />
    );
  }
  if (!orders) return <ListSkeleton />;

  const visible = orders.filter((order) => filter === "ALL" || order.status === filter);

  const applyStatus = async (order: RentalOrder, status: RentalOrderStatus) => {
    setBusyId(order.id);
    try {
      await providerApi.updateOrderStatus(order.id, status);
      toast.success(`Order #${shortId(order.id)} is now “${ORDER_STATUS_META[status].label}”.`);
      reload();
    } catch (updateError) {
      toast.error(getErrorMessage(updateError, "We couldn't update this order."));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Incoming orders"
        description="Confirm requests, hand over gear and mark it returned."
      />

      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Filter orders">
        {FILTERS.map((item) => {
          const count =
            item.value === "ALL" ? orders.length : orders.filter((order) => order.status === item.value).length;
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={filter === item.value}
              onClick={() => setFilter(item.value)}
              className={cn(
                "cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium",
                filter === item.value
                  ? "border-brand-700 bg-brand-700 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
              )}
            >
              {item.label} <span className="opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No orders here"
          description={orders.length === 0 ? "Orders from customers will appear here." : "Try another filter."}
        />
      ) : (
        <ul className="space-y-5">
          {visible.map((order) => {
            const actions = PROVIDER_ACTIONS[order.status];
            return (
              <li key={order.id}>
                <Card className="p-4 sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-slate-900">Order #{shortId(order.id)}</h2>
                        <OrderStatusBadge status={order.status} />
                        {order.payment && <PaymentStatusBadge status={order.payment.status} />}
                      </div>
                      <p className="mt-1 flex items-center gap-1 text-sm text-slate-600">
                        <CalendarDays className="size-4" aria-hidden="true" />
                        {formatDateRange(order.startDate, order.endDate)} · placed {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-slate-900">{formatCurrency(order.totalAmount)}</p>
                  </div>

                  {order.customer && (
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                      <span className="font-medium text-slate-900">{order.customer.name}</span>
                      <span className="inline-flex items-center gap-1">
                        <Mail className="size-4" aria-hidden="true" />
                        {order.customer.email}
                      </span>
                      {order.customer.phoneNumber && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="size-4" aria-hidden="true" />
                          {order.customer.phoneNumber}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-4">
                    <OrderItemsTable items={order.items ?? []} linkToGear={false} />
                  </div>

                  {actions.length > 0 && (
                    <div className="mt-4 flex flex-wrap justify-end gap-2">
                      {actions.map((action) => (
                        <Button
                          key={action.status}
                          variant={action.variant}
                          loading={busyId === order.id}
                          onClick={() =>
                            action.variant === "danger"
                              ? setPending({ order, status: action.status, label: action.label })
                              : applyStatus(order, action.status)
                          }
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={pending !== null}
        onClose={() => setPending(null)}
        onConfirm={async () => {
          if (pending) await applyStatus(pending.order, pending.status);
          setPending(null);
        }}
        title={`${pending?.label ?? "Update order"}?`}
        description="The customer will be notified through their order status and the reserved stock will be released. This can't be undone."
        confirmLabel={pending?.label ?? "Confirm"}
        destructive
      />
    </div>
  );
};

export default IncomingOrders;
