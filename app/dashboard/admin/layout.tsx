import type { ReactNode } from "react";
import RoleGuard from "@/app/ui/dashboard/RoleGuard";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return <RoleGuard role="ADMIN">{children}</RoleGuard>;
};

export default AdminLayout;
