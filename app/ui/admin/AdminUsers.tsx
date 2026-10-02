"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import Badge from "@/app/ui/Badge";
import Button from "@/app/ui/Button";
import ConfirmDialog from "@/app/ui/ConfirmDialog";
import EmptyState from "@/app/ui/EmptyState";
import ErrorState from "@/app/ui/ErrorState";
import Input from "@/app/ui/Input";
import PageHeader from "@/app/ui/PageHeader";
import { UserStatusBadge } from "@/app/ui/StatusBadge";
import { Table, Td, Th } from "@/app/ui/Table";
import { useToast } from "@/app/ui/ToastProvider";
import ListSkeleton from "@/app/ui/dashboard/ListSkeleton";
import { adminApi } from "@/lib/api";
import { ROLE_LABEL } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { getErrorMessage } from "@/lib/http";
import { useAsync } from "@/hooks/useAsync";
import type { PublicUser } from "@/types";

const AdminUsers = () => {
  const toast = useToast();
  const { data: users, error, reload } = useAsync(adminApi.users);
  const [search, setSearch] = useState("");
  const [target, setTarget] = useState<PublicUser | null>(null);

  if (error) {
    return (
      <ErrorState
        title="We couldn't load users"
        message={error}
        action={
          <Button variant="outline" onClick={reload}>
            Try again
          </Button>
        }
      />
    );
  }
  if (!users) return <ListSkeleton />;

  const query = search.trim().toLowerCase();
  const visible = users.filter(
    (user) =>
      !query || user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query),
  );

  const nextStatus = target?.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";

  const handleConfirm = async () => {
    if (!target) return;
    try {
      await adminApi.setUserStatus(target.id, nextStatus);
      toast.success(
        nextStatus === "SUSPENDED" ? `${target.name} was suspended.` : `${target.name} was reactivated.`,
      );
      reload();
    } catch (statusError) {
      toast.error(getErrorMessage(statusError, "We couldn't update this user."));
    } finally {
      setTarget(null);
    }
  };

  return (
    <div>
      <PageHeader title="Users" description="Everyone registered on GearUp." />

      <div className="mb-4 max-w-sm">
        <Input
          label="Search users"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Name or email"
        />
      </div>

      {visible.length === 0 ? (
        <EmptyState icon={Users} title="No users found" description="Try a different search." />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Joined</Th>
              <Th className="text-right">
                <span className="sr-only">Actions</span>
              </Th>
            </tr>
          </thead>
          <tbody>
            {visible.map((user) => (
              <tr key={user.id}>
                <Td>
                  <p className="font-medium text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </Td>
                <Td>
                  <Badge tone={user.role === "ADMIN" ? "brand" : "neutral"}>{ROLE_LABEL[user.role]}</Badge>
                </Td>
                <Td>
                  <UserStatusBadge status={user.status} />
                </Td>
                <Td>{formatDate(user.createdAt)}</Td>
                <Td className="text-right">
                  {user.role === "ADMIN" ? (
                    <span className="text-xs text-slate-400">Protected</span>
                  ) : (
                    <Button
                      size="sm"
                      variant={user.status === "SUSPENDED" ? "outline" : "danger"}
                      onClick={() => setTarget(user)}
                    >
                      {user.status === "SUSPENDED" ? "Reactivate" : "Suspend"}
                    </Button>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <ConfirmDialog
        open={target !== null}
        onClose={() => setTarget(null)}
        onConfirm={handleConfirm}
        title={nextStatus === "SUSPENDED" ? `Suspend ${target?.name ?? "user"}?` : `Reactivate ${target?.name ?? "user"}?`}
        description={
          nextStatus === "SUSPENDED"
            ? "They will be blocked from signing in and using the platform until reactivated."
            : "They will be able to sign in and use the platform again."
        }
        confirmLabel={nextStatus === "SUSPENDED" ? "Suspend user" : "Reactivate"}
        destructive={nextStatus === "SUSPENDED"}
      />
    </div>
  );
};

export default AdminUsers;
