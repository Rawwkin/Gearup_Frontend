"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import Button from "@/app/ui/Button";
import EmptyState from "@/app/ui/EmptyState";
import ErrorState from "@/app/ui/ErrorState";
import PageHeader from "@/app/ui/PageHeader";
import ListSkeleton from "@/app/ui/dashboard/ListSkeleton";
import OrderCard from "@/app/ui/orders/OrderCard";
import { rentalsApi } from "@/lib/api";
import { buttonStyles } from "@/lib/button-styles";
import { ACTIVE_ORDER_STATUSES } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { useAsync } from "@/hooks/useAsync";

type Filter = "all" | "active" | "past";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "past", label: "Completed & cancelled" },
];

const CustomerOrders = () => {
  const { data: orders, error, reload } = useAsync(rentalsApi.list);
  const [filter, setFilter] = useState<Filter>("all");

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

  const visible = orders.filter((order) => {
    const active = ACTIVE_ORDER_STATUSES.includes(order.status);
    return filter === "all" || (filter === "active" ? active : !active);
  });

  return (
    <div>
      <PageHeader
        title="My orders"
        description="Track your rental requests, payments and returns."
        actions={
          <Link href="/gear" className={buttonStyles({ variant: "outline" })}>
            Browse gear
          </Link>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Filter orders">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={filter === item.value}
            onClick={() => setFilter(item.value)}
            className={cn(
              "cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium",
              filter === item.value
                ? "border-brand-700 bg-brand-700 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={orders.length === 0 ? "You haven't rented anything yet" : "No orders in this view"}
          description={
            orders.length === 0
              ? "Find some gear and send your first rental request."
              : "Try a different filter."
          }
          action={
            orders.length === 0 ? (
              <Link href="/gear" className={buttonStyles()}>
                Browse gear
              </Link>
            ) : undefined
          }
        />
      ) : (
        <ul className="space-y-3">
          {visible.map((order) => (
            <li key={order.id}>
              <OrderCard order={order} href={`/dashboard/customer/orders/${order.id}`} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomerOrders;
