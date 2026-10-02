import type { Metadata } from "next";
import AdminCategories from "@/app/ui/admin/AdminCategories";

export const metadata: Metadata = { title: "Categories" };

const AdminCategoriesPage = () => {
  return <AdminCategories />;
};

export default AdminCategoriesPage;
