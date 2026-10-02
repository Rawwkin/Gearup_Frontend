import type { Metadata } from "next";
import CustomerPayments from "@/app/ui/orders/CustomerPayments";

export const metadata: Metadata = { title: "Payments" };

const CustomerPaymentsPage = () => {
  return <CustomerPayments />;
};

export default CustomerPaymentsPage;
