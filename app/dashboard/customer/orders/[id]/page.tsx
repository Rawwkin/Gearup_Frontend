import type { Metadata } from "next";
import CustomerOrderDetail from "@/app/ui/orders/CustomerOrderDetail";

export const metadata: Metadata = { title: "Order details" };

const CustomerOrderPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <CustomerOrderDetail orderId={id} />;
};

export default CustomerOrderPage;
