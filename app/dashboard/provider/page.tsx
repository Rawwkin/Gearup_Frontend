import type { Metadata } from "next";
import ProviderOverview from "@/app/ui/provider/ProviderOverview";

export const metadata: Metadata = { title: "Overview" };

const ProviderDashboardPage = () => {
  return <ProviderOverview />;
};

export default ProviderDashboardPage;
