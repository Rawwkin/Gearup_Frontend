"use client";

import Link from "next/link";
import { Boxes, ClipboardList, Hourglass, Truck } from "lucide-react";
import Alert from "@/app/ui/Alert";
import Button from "@/app/ui/Button";
import EmptyState from "@/app/ui/EmptyState";
import ErrorState from "@/app/ui/ErrorState";
import PageHeader from "@/app/ui/PageHeader";
import StatCard from "@/app/ui/StatCard";
import ListSkeleton from "@/app/ui/dashboard/ListSkeleton";
import OrderCard from "@/app/ui/orders/OrderCard";
import { providerApi } from "@/lib/api";
import { buttonStyles } from "@/lib/button-styles";
import { pluralize } from "@/lib/format";
import { useAsync } from "@/hooks/useAsync";

const ProviderOverview = () => {
  const gear = useAsync(providerApi.myGear);
  const orders = useAsync(providerApi.myOrders);

  const error = gear.error ?? orders.error;
  if (error) {
    return (
      <ErrorState
        message={error}
        action={
          <Button
            variant="outline"
            onClick={() => {
              gear.reload();
              orders.reload();
            }}
          >
            Try again
          </Button>
        }
      />
    );
  }
  if (!gear.data || !orders.data) return <ListSkeleton stats />;

  const pending = orders.data.filter((order) => order.status === "PLACED");
  const inProgress = orders.data.filter((order) => order.status === "PAID" || order.status === "PICKED_UP");
  const availableUnits = gear.data.reduce(
    (sum, item) => sum + (item.isAvailable ? item.availableQuantity : 0),
    0,
  );

  return (
    <div>
      <PageHeader
        title="Provider overview"
        description="Manage your listings and incoming rental requests."
        actions={
          <Link href="/dashboard/provider/inventory/new" className={buttonStyles()}>
            Add gear
          </Link>
        }
      />

      {pending.length > 0 && (
        <Alert variant="warning" title="Requests waiting for you" className="mb-6">
          You have {pluralize(pending.length, "new rental request")}.{" "}
          <Link href="/dashboard/provider/orders" className="font-semibold underline">
            Review them
          </Link>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Listings" value={gear.data.length} icon={Boxes} />
        <StatCard label="Units available" value={availableUnits} icon={Truck} />
        <StatCard label="Pending requests" value={pending.length} icon={Hourglass} />
        <StatCard label="Rentals in progress" value={inProgress.length} icon={ClipboardList} />
      </div>

      <h2 className="mb-3 mt-10 text-lg font-semibold text-slate-900">Latest orders</h2>
      {orders.data.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No orders yet"
          description="When customers request your gear, their orders appear here."
        />
      ) : (
        <ul className="space-y-3">
          {orders.data.slice(0, 5).map((order) => (
            <li key={order.id}>
              <OrderCard order={order} href="/dashboard/provider/orders" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProviderOverview;
