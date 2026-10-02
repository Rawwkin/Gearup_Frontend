import type { Metadata } from "next";
import AdminUsers from "@/app/ui/admin/AdminUsers";

export const metadata: Metadata = { title: "Users" };

const AdminUsersPage = () => {
  return <AdminUsers />;
};

export default AdminUsersPage;
