"use client";

import { useState } from "react";
import Link from "next/link";
import { Boxes, Pencil, Trash2 } from "lucide-react";
import Badge from "@/app/ui/Badge";
import Button from "@/app/ui/Button";
import ConfirmDialog from "@/app/ui/ConfirmDialog";
import EmptyState from "@/app/ui/EmptyState";
import ErrorState from "@/app/ui/ErrorState";
import PageHeader from "@/app/ui/PageHeader";
import SafeImage from "@/app/ui/SafeImage";
import { Table, Td, Th } from "@/app/ui/Table";
import { useToast } from "@/app/ui/ToastProvider";
import ListSkeleton from "@/app/ui/dashboard/ListSkeleton";
import { providerApi } from "@/lib/api";
import { buttonStyles } from "@/lib/button-styles";
import { formatCurrency } from "@/lib/format";
import { getErrorMessage } from "@/lib/http";
import { useAsync } from "@/hooks/useAsync";
import type { GearItem } from "@/types";

const InventoryList = () => {
  const toast = useToast();
  const { data: items, error, reload } = useAsync(providerApi.myGear);
  const [toDelete, setToDelete] = useState<GearItem | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  if (error) {
    return (
      <ErrorState
        title="We couldn't load your inventory"
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

  const toggleAvailability = async (item: GearItem) => {
    setTogglingId(item.id);
    try {
      await providerApi.updateGear(item.id, { isAvailable: !item.isAvailable });
      toast.success(item.isAvailable ? "Listing hidden from renters." : "Listing is live again.");
      reload();
    } catch (toggleError) {
      toast.error(getErrorMessage(toggleError, "We couldn't update this listing."));
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await providerApi.removeGear(toDelete.id);
      toast.success(`"${toDelete.name}" was removed.`);
      reload();
    } catch (deleteError) {
      toast.error(getErrorMessage(deleteError, "We couldn't remove this listing."));
    } finally {
      setToDelete(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Your gear listings. Hide a listing instead of deleting it to keep your order history."
        actions={
          <Link href="/dashboard/provider/inventory/new" className={buttonStyles()}>
            Add gear
          </Link>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="You haven't listed any gear yet"
          description="Add your first item and start receiving rental requests."
          action={
            <Link href="/dashboard/provider/inventory/new" className={buttonStyles()}>
              Add your first gear
            </Link>
          }
        />
      ) : (
        <Table className="min-w-[760px]">
          <thead>
            <tr>
              <Th>Gear</Th>
              <Th>Category</Th>
              <Th className="text-right">Price / day</Th>
              <Th className="text-right">Stock</Th>
              <Th>Status</Th>
              <Th className="text-right">
                <span className="sr-only">Actions</span>
              </Th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      <SafeImage src={item.images[0]} alt="" sizes="48px" />
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/gear/${item.id}`}
                        className="block max-w-56 truncate font-medium text-slate-900 hover:text-brand-700"
                      >
                        {item.name}
                      </Link>
                      {item.brand && <p className="text-xs text-slate-500">{item.brand}</p>}
                    </div>
                  </div>
                </Td>
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
                <Td>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      loading={togglingId === item.id}
                      onClick={() => toggleAvailability(item)}
                    >
                      {item.isAvailable ? "Hide" : "Show"}
                    </Button>
                    <Link
                      href={`/dashboard/provider/inventory/${item.id}/edit`}
                      aria-label={`Edit ${item.name}`}
                      className={buttonStyles({ variant: "ghost", size: "sm" })}
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label={`Delete ${item.name}`}
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => setToDelete(item)}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        title="Delete this listing?"
        description="This permanently removes the listing, its reviews, and its lines from any existing orders. To just stop new rentals, hide it instead."
        confirmLabel="Delete listing"
        destructive
      />
    </div>
  );
};

export default InventoryList;
