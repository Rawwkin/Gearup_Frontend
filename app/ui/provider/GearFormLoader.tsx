"use client";

import { useCallback } from "react";
import Link from "next/link";
import Button from "@/app/ui/Button";
import EmptyState from "@/app/ui/EmptyState";
import ErrorState from "@/app/ui/ErrorState";
import ListSkeleton from "@/app/ui/dashboard/ListSkeleton";
import GearForm from "@/app/ui/provider/GearForm";
import { categoriesApi, providerApi } from "@/lib/api";
import { buttonStyles } from "@/lib/button-styles";
import { useAsync } from "@/hooks/useAsync";

/** Loads what the form needs (categories, and the gear when editing) and renders it. */
const GearFormLoader = ({ gearId }: { gearId?: string }) => {
  const fetchData = useCallback(async () => {
    const [categories, myGear] = await Promise.all([
      categoriesApi.list(),
      gearId ? providerApi.myGear() : Promise.resolve(null),
    ]);
    return { categories, gear: myGear?.find((item) => item.id === gearId) ?? null };
  }, [gearId]);

  const { data, error, reload } = useAsync(fetchData);

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
  if (!data) return <ListSkeleton rows={3} />;

  if (gearId && !data.gear) {
    return (
      <EmptyState
        title="Listing not found"
        description="It may have been deleted, or it doesn't belong to your account."
        action={
          <Link href="/dashboard/provider/inventory" className={buttonStyles()}>
            Back to inventory
          </Link>
        }
      />
    );
  }

  return <GearForm categories={data.categories} gear={data.gear ?? undefined} />;
};

export default GearFormLoader;
