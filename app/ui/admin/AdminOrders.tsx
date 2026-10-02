"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import Button from "@/app/ui/Button";
import EmptyState from "@/app/ui/EmptyState";
import ErrorState from "@/app/ui/ErrorState";
import PageHeader from "@/app/ui/PageHeader";
import Select from "@/app/ui/Select";
import { OrderStatusBadge, PaymentStatusBadge } from "@/app/ui/StatusBadge";
import { Table, Td, Th } from "@/app/ui/Table";
import ListSkeleton from "@/app/ui/dashboard/ListSkeleton";
import { adminApi } from "@/lib/api";
import { ORDER_STATUS_META } from "@/lib/constants";
import { providerName } from "@/lib/gear";
import { formatCurrency, formatDate, formatDateRange, shortId } from "@/lib/format";
import { useAsync } from "@/hooks/useAsync";
import type { RentalOrderStatus } from "@/types";

const STATUSES = Object.keys(ORDER_STATUS_META) as RentalOrderStatus[];

const AdminOrders = () => {
  const { data: orders, error, reload } = useAsync(adminApi.rentals);
  const [status, setStatus] = useState<"" | RentalOrderStatus>("");

  if (error) {
    return (
      <ErrorState
        title="We couldn't load orders"
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

  const visible = orders.filter((order) => !status || order.status === status);

  return (
    <div>
      <PageHeader title="All orders" description="Every rental order on the platform." />

      <div className="mb-4 max-w-xs">
        <Select
          label="Filter by status"
          value={status}
          onChange={(event) => setStatus(event.target.value as "" | RentalOrderStatus)}
        >
          <option value="">All statuses</option>
          {STATUSES.map((value) => (
            <option key={value} value={value}>
              {ORDER_STATUS_META[value].label}
            </option>
          ))}
        </Select>
      </div>

      {visible.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No orders found" />
      ) : (
        <Table className="min-w-[900px]">
          <thead>
            <tr>
              <Th>Order</Th>
              <Th>Customer</Th>
              <Th>Provider</Th>
              <Th>Rental period</Th>
              <Th>Placed</Th>
              <Th className="text-right">Total</Th>
              <Th>Status</Th>
              <Th>Payment</Th>
            </tr>
          </thead>
          <tbody>
            {visible.map((order) => (
              <tr key={order.id}>
                <Td className="font-medium text-slate-900">#{shortId(order.id)}</Td>
                <Td>
                  <p>{order.customer?.name ?? "—"}</p>
                  <p className="text-xs text-slate-500">{order.customer?.email}</p>
                </Td>
                <Td>{providerName(order.provider)}</Td>
                <Td className="whitespace-nowrap">{formatDateRange(order.startDate, order.endDate)}</Td>
                <Td>{formatDate(order.createdAt)}</Td>
                <Td className="text-right font-semibold text-slate-900">{formatCurrency(order.totalAmount)}</Td>
                <Td>
                  <OrderStatusBadge status={order.status} />
                </Td>
                <Td>{order.payment ? <PaymentStatusBadge status={order.payment.status} /> : "—"}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default AdminOrders;
