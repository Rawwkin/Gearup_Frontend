import type { ReactNode } from "react";
import RoleGuard from "@/app/ui/dashboard/RoleGuard";

const CustomerLayout = ({ children }: { children: ReactNode }) => {
  return <RoleGuard role="CUSTOMER">{children}</RoleGuard>;
};

export default CustomerLayout;
