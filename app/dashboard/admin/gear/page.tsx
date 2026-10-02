import type { Metadata } from "next";
import AdminGear from "@/app/ui/admin/AdminGear";

export const metadata: Metadata = { title: "All gear" };

const AdminGearPage = () => {
  return <AdminGear />;
};

export default AdminGearPage;
