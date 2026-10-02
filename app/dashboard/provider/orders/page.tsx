import type { Metadata } from "next";
import IncomingOrders from "@/app/ui/provider/IncomingOrders";

export const metadata: Metadata = { title: "Incoming orders" };

const ProviderOrdersPage = () => {
  return <IncomingOrders />;
};

export default ProviderOrdersPage;
