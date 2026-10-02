import type { Metadata } from "next";
import InventoryList from "@/app/ui/provider/InventoryList";

export const metadata: Metadata = { title: "Inventory" };

const InventoryPage = () => {
  return <InventoryList />;
};

export default InventoryPage;
