"use client";

import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import Badge from "@/app/ui/Badge";
import Button from "@/app/ui/Button";
import EmptyState from "@/app/ui/EmptyState";
import ErrorState from "@/app/ui/ErrorState";
import PageHeader from "@/app/ui/PageHeader";
import SafeImage from "@/app/ui/SafeImage";
import { Table, Td, Th } from "@/app/ui/Table";
import ListSkeleton from "@/app/ui/dashboard/ListSkeleton";
import { adminApi } from "@/lib/api";
import { providerName } from "@/lib/gear";
import { formatCurrency, formatDate } from "@/lib/format";
import { useAsync } from "@/hooks/useAsync";

const AdminGear = () => {
  const { data: items, error, reload } = useAsync(adminApi.gear);

  if (error) {
    return (
      <ErrorState
        title="We couldn't load gear listings"
        message={error}
        action={
          <Button variant="outline" onClick={reload}>
            Try again
          </Button>
        }
      />
    );
  }
  if (!items) return <ListSkeleton />;

  return (
    <div>
      <PageHeader title="All gear" description="Every listing across all providers." />
      {items.length === 0 ? (
        <EmptyState icon={LayoutGrid} title="No listings yet" description="Provider listings will appear here." />
      ) : (
        <Table className="min-w-[820px]">
          <thead>
            <tr>
              <Th>Gear</Th>
              <Th>Provider</Th>
              <Th>Category</Th>
              <Th className="text-right">Price / day</Th>
              <Th className="text-right">Stock</Th>
              <Th>Status</Th>
              <Th>Listed</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      <SafeImage src={item.images[0]} alt="" sizes="40px" />
                    </div>
                    <Link
                      href={`/gear/${item.id}`}
                      className="max-w-52 truncate font-medium text-slate-900 hover:text-brand-700"
                    >
                      {item.name}
                    </Link>
                  </div>
                </Td>
                <Td>{providerName(item.provider)}</Td>
                <Td>{item.category?.name ?? "—"}</Td>
                <Td className="text-right">{formatCurrency(item.pricePerDay)}</Td>
                <Td className="text-right">
                  {item.availableQuantity} / {item.quantity}
                </Td>
                <Td>
                  <Badge tone={item.isAvailable ? "success" : "neutral"}>
                    {item.isAvailable ? "Listed" : "Hidden"}
                  </Badge>
                </Td>
                <Td>{formatDate(item.createdAt)}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default AdminGear;
