import type { Metadata } from "next";
import CustomerOrders from "@/app/ui/orders/CustomerOrders";

export const metadata: Metadata = { title: "My orders" };

const CustomerOrdersPage = () => {
  return <CustomerOrders />;
};

export default CustomerOrdersPage;
