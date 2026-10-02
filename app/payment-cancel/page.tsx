import type { Metadata } from "next";
import Link from "next/link";
import { CircleX } from "lucide-react";
import Card from "@/app/ui/Card";
import Container from "@/app/ui/Container";
import { buttonStyles } from "@/lib/button-styles";

export const metadata: Metadata = { title: "Payment cancelled", robots: { index: false } };

const PaymentCancelPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { orderId } = await searchParams;
  const id = Array.isArray(orderId) ? orderId[0] : orderId;
  const orderHref = id ? `/dashboard/customer/orders/${id}` : "/dashboard/customer/orders";

  return (
    <Container className="py-16">
      <Card className="mx-auto max-w-lg p-8 text-center">
        <CircleX className="mx-auto size-14 text-slate-400" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Payment cancelled</h1>
        <p className="mt-2 text-sm text-slate-600">
          No money was taken. Your order is still confirmed — you can complete the payment whenever
          you&apos;re ready.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href={orderHref} className={buttonStyles()}>
            Back to my order
          </Link>
          <Link href="/gear" className={buttonStyles({ variant: "outline" })}>
            Keep browsing
          </Link>
        </div>
      </Card>
    </Container>
  );
};

export default PaymentCancelPage;
