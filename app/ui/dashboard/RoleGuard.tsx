"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import EmptyState from "@/app/ui/EmptyState";
import { useAuth } from "@/app/ui/auth/AuthProvider";
import { buttonStyles } from "@/lib/button-styles";
import { ROLE_HOME, ROLE_LABEL } from "@/lib/constants";
import type { UserRole } from "@/types";

/** Shows children only to users with the given role (the backend enforces this too). */
const RoleGuard = ({ role, children }: { role: UserRole; children: ReactNode }) => {
  const { user } = useAuth();

  if (user && user.role !== role) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="You don't have access to this area"
        description={`This section is only for ${ROLE_LABEL[role].toLowerCase()} accounts.`}
        action={
          <Link href={ROLE_HOME[user.role]} className={buttonStyles()}>
            Go to my dashboard
          </Link>
        }
      />
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
