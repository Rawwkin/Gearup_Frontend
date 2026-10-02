import type { Metadata } from "next";
import AdminOrders from "@/app/ui/admin/AdminOrders";

export const metadata: Metadata = { title: "All orders" };

const AdminOrdersPage = () => {
  return <AdminOrders />;
};

export default AdminOrdersPage;
