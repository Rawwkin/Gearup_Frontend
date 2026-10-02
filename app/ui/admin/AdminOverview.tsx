"use client";

import Link from "next/link";
import { Boxes, ClipboardList, Users, Wallet } from "lucide-react";
import Button from "@/app/ui/Button";
import ErrorState from "@/app/ui/ErrorState";
import PageHeader from "@/app/ui/PageHeader";
import StatCard from "@/app/ui/StatCard";
import { OrderStatusBadge } from "@/app/ui/StatusBadge";
import { Table, Td, Th } from "@/app/ui/Table";
import ListSkeleton from "@/app/ui/dashboard/ListSkeleton";
import { adminApi } from "@/lib/api";
import { providerName } from "@/lib/gear";
import { formatCurrency, formatDate, shortId } from "@/lib/format";
import { useAsync } from "@/hooks/useAsync";

const PAID_STATUSES = ["PAID", "PICKED_UP", "RETURNED"];

const AdminOverview = () => {
  const users = useAsync(adminApi.users);
  const gear = useAsync(adminApi.gear);
  const orders = useAsync(adminApi.rentals);

  const error = users.error ?? gear.error ?? orders.error;
  if (error) {
    return (
      <ErrorState
        message={error}
        action={
          <Button
            variant="outline"
            onClick={() => {
              users.reload();
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
  if (!users.data || !gear.data || !orders.data) return <ListSkeleton stats />;

  const providers = users.data.filter((user) => user.role === "PROVIDER").length;
  const volume = orders.data
    .filter((order) => PAID_STATUSES.includes(order.status))
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div>
      <PageHeader title="Admin overview" description="A snapshot of the GearUp marketplace." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Users" value={users.data.length} icon={Users} hint={`${providers} providers`} />
        <StatCard label="Gear listings" value={gear.data.length} icon={Boxes} />
        <StatCard label="Rental orders" value={orders.data.length} icon={ClipboardList} />
        <StatCard label="Paid order volume" value={formatCurrency(volume)} icon={Wallet} />
      </div>

      <div className="mb-3 mt-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Latest orders</h2>
        <Link href="/dashboard/admin/orders" className="text-sm font-semibold text-brand-700 hover:underline">
          View all
        </Link>
      </div>
      <Table>
        <thead>
          <tr>
            <Th>Order</Th>
            <Th>Customer</Th>
            <Th>Provider</Th>
            <Th>Placed</Th>
            <Th className="text-right">Total</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {orders.data.slice(0, 6).map((order) => (
            <tr key={order.id}>
              <Td className="font-medium text-slate-900">#{shortId(order.id)}</Td>
              <Td>{order.customer?.name ?? "—"}</Td>
              <Td>{providerName(order.provider)}</Td>
              <Td>{formatDate(order.createdAt)}</Td>
              <Td className="text-right">{formatCurrency(order.totalAmount)}</Td>
              <Td>
                <OrderStatusBadge status={order.status} />
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminOverview;
