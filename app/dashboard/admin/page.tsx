import type { Metadata } from "next";
import AdminOverview from "@/app/ui/admin/AdminOverview";

export const metadata: Metadata = { title: "Admin overview" };

const AdminDashboardPage = () => {
  return <AdminOverview />;
};

export default AdminDashboardPage;
