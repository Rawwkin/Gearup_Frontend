import type { ReactNode } from "react";
import RoleGuard from "@/app/ui/dashboard/RoleGuard";

const ProviderLayout = ({ children }: { children: ReactNode }) => {
  return <RoleGuard role="PROVIDER">{children}</RoleGuard>;
};

export default ProviderLayout;
