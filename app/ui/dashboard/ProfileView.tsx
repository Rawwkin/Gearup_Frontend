"use client";

import Link from "next/link";
import Badge from "@/app/ui/Badge";
import Card from "@/app/ui/Card";
import PageHeader from "@/app/ui/PageHeader";
import SafeImage from "@/app/ui/SafeImage";
import { UserStatusBadge } from "@/app/ui/StatusBadge";
import { useAuth } from "@/app/ui/auth/AuthProvider";
import { buttonStyles } from "@/lib/button-styles";
import { ROLE_LABEL } from "@/lib/constants";
import { formatDate, initials } from "@/lib/format";

const Row = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <div className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-center sm:justify-between">
    <dt className="text-sm text-slate-600">{label}</dt>
    <dd className="text-sm font-medium text-slate-900">{value || "—"}</dd>
  </div>
);

const ProfileView = () => {
  const { user } = useAuth();
  if (!user) return null;

  const phone = user.phoneNumber ?? user.profile?.phone;

  return (
    <div>
      <PageHeader title="Your account" description="The details attached to your GearUp account." />

      <Card className="p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-brand-700">
            {user.profileImage ? (
              <SafeImage src={user.profileImage} alt={user.name} sizes="64px" />
            ) : (
              <span className="flex size-full items-center justify-center text-xl font-bold text-white">
                {initials(user.name)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold text-slate-900">{user.name}</h2>
            <p className="truncate text-sm text-slate-600">{user.email}</p>
            <div className="mt-2 flex gap-2">
              <Badge tone="brand">{ROLE_LABEL[user.role]}</Badge>
              <UserStatusBadge status={user.status} />
            </div>
          </div>
        </div>

        <dl className="mt-5 divide-y divide-slate-100 border-t border-slate-100">
          <Row label="Member since" value={formatDate(user.createdAt)} />
          <Row label="Phone" value={phone} />
          {user.role === "CUSTOMER" && <Row label="Address" value={user.profile?.address} />}
        </dl>
      </Card>

      {user.role === "PROVIDER" && (
        <Card className="mt-6 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Business profile</h2>
            <Link
              href="/dashboard/provider/business"
              className={buttonStyles({ variant: "outline", size: "sm" })}
            >
              Edit
            </Link>
          </div>
          <dl className="mt-2 divide-y divide-slate-100">
            <Row label="Business name" value={user.providerProfile?.businessName} />
            <Row label="Verified" value={user.providerProfile?.verified ? "Yes" : "Not yet"} />
            <Row label="About" value={user.providerProfile?.description} />
          </dl>
        </Card>
      )}
    </div>
  );
};

export default ProfileView;
