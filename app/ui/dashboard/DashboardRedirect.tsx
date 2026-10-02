"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/ui/auth/AuthProvider";
import Spinner from "@/app/ui/Spinner";
import { ROLE_HOME } from "@/lib/constants";

/** /dashboard has no content of its own — send each role to its home. */
const DashboardRedirect = () => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) router.replace(ROLE_HOME[user.role]);
  }, [user, router]);

  return (
    <div className="flex items-center gap-2 py-10 text-slate-600">
      <Spinner className="size-5" /> Loading your dashboard…
    </div>
  );
};

export default DashboardRedirect;
