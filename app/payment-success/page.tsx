import type { Metadata } from "next";
import Container from "@/app/ui/Container";
import PaymentSuccess from "@/app/ui/orders/PaymentSuccess";

export const metadata: Metadata = { title: "Payment status", robots: { index: false } };

const PaymentSuccessPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { orderId } = await searchParams;
  const id = Array.isArray(orderId) ? orderId[0] : orderId;

  return (
    <Container className="py-16">
      <PaymentSuccess orderId={id ?? null} />
    </Container>
  );
};

export default PaymentSuccessPage;
