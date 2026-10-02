import type { Metadata } from "next";
import CustomerOverview from "@/app/ui/orders/CustomerOverview";

export const metadata: Metadata = { title: "Overview" };

const CustomerDashboardPage = () => {
  return <CustomerOverview />;
};

export default CustomerDashboardPage;
