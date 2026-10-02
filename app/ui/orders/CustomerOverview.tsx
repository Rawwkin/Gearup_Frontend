"use client";

import Link from "next/link";
import { ClipboardList, CreditCard, PackageCheck, Wallet } from "lucide-react";
import Alert from "@/app/ui/Alert";
import Button from "@/app/ui/Button";
import EmptyState from "@/app/ui/EmptyState";
import ErrorState from "@/app/ui/ErrorState";
import PageHeader from "@/app/ui/PageHeader";
import StatCard from "@/app/ui/StatCard";
import { useAuth } from "@/app/ui/auth/AuthProvider";
import ListSkeleton from "@/app/ui/dashboard/ListSkeleton";
import OrderCard from "@/app/ui/orders/OrderCard";
import { rentalsApi } from "@/lib/api";
import { buttonStyles } from "@/lib/button-styles";
import { ACTIVE_ORDER_STATUSES } from "@/lib/constants";
import { formatCurrency, pluralize } from "@/lib/format";
import { useAsync } from "@/hooks/useAsync";

const CustomerOverview = () => {
  const { user } = useAuth();
  const { data: orders, error, reload } = useAsync(rentalsApi.list);

  if (error) {
    return (
      <ErrorState
        message={error}
        action={
          <Button variant="outline" onClick={reload}>
            Try again
          </Button>
        }
      />
    );
  }
  if (!orders) return <ListSkeleton stats />;

  const active = orders.filter((order) => ACTIVE_ORDER_STATUSES.includes(order.status));
  const awaitingPayment = orders.filter((order) => order.status === "CONFIRMED");
  const completed = orders.filter((order) => order.status === "RETURNED");
  const spent = orders
    .filter((order) => ["PAID", "PICKED_UP", "RETURNED"].includes(order.status))
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div>
      <PageHeader
        title={`Hi, ${user?.name.split(" ")[0] ?? "there"} 👋`}
        description="Here's what's happening with your rentals."
        actions={
          <Link href="/gear" className={buttonStyles()}>
            Rent more gear
          </Link>
        }
      />

      {awaitingPayment.length > 0 && (
        <Alert variant="info" title="Payment needed" className="mb-6">
          {pluralize(awaitingPayment.length, "order")} confirmed by the provider and waiting for
          payment.{" "}
          <Link
            href={`/dashboard/customer/orders/${awaitingPayment[0]?.id}`}
            className="font-semibold underline"
          >
            Pay now
          </Link>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active orders" value={active.length} icon={ClipboardList} />
        <StatCard label="Awaiting payment" value={awaitingPayment.length} icon={CreditCard} />
        <StatCard label="Completed rentals" value={completed.length} icon={PackageCheck} />
        <StatCard label="Total paid" value={formatCurrency(spent)} icon={Wallet} />
      </div>

      <h2 className="mb-3 mt-10 text-lg font-semibold text-slate-900">Recent orders</h2>
      {orders.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No orders yet"
          description="Your rental orders will show up here."
          action={
            <Link href="/gear" className={buttonStyles()}>
              Browse gear
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {orders.slice(0, 5).map((order) => (
            <li key={order.id}>
              <OrderCard order={order} href={`/dashboard/customer/orders/${order.id}`} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomerOverview;
