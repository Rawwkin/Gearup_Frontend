import type { Metadata } from "next";
import type { ReactNode } from "react";
import DashboardShell from "@/app/ui/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | GearUp" },
  robots: { index: false, follow: false },
};

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return <DashboardShell>{children}</DashboardShell>;
};

export default DashboardLayout;
