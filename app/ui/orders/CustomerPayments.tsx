"use client";

import Link from "next/link";
import { CreditCard } from "lucide-react";
import Button from "@/app/ui/Button";
import EmptyState from "@/app/ui/EmptyState";
import ErrorState from "@/app/ui/ErrorState";
import PageHeader from "@/app/ui/PageHeader";
import { PaymentStatusBadge } from "@/app/ui/StatusBadge";
import { Table, Td, Th } from "@/app/ui/Table";
import ListSkeleton from "@/app/ui/dashboard/ListSkeleton";
import { paymentsApi } from "@/lib/api";
import { formatCurrency, formatDate, shortId } from "@/lib/format";
import { useAsync } from "@/hooks/useAsync";

const CustomerPayments = () => {
  const { data: payments, error, reload } = useAsync(paymentsApi.list);

  if (error) {
    return (
      <ErrorState
        title="We couldn't load your payments"
        message={error}
        action={
          <Button variant="outline" onClick={reload}>
            Try again
          </Button>
        }
      />
    );
  }
  if (!payments) return <ListSkeleton />;

  return (
    <div>
      <PageHeader title="Payments" description="Your payment history across all rental orders." />
      {payments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No payments yet"
          description="Once a provider confirms an order you'll be able to pay for it here."
        />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Order</Th>
              <Th>Method</Th>
              <Th className="text-right">Amount</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <Td>{formatDate(payment.paidAt ?? payment.createdAt)}</Td>
                <Td>
                  <Link
                    href={`/dashboard/customer/orders/${payment.rentalOrderId}`}
                    className="font-medium text-brand-700 hover:underline"
                  >
                    #{shortId(payment.rentalOrderId)}
                  </Link>
                </Td>
                <Td className="capitalize">{payment.provider.toLowerCase()}</Td>
                <Td className="text-right font-semibold text-slate-900">
                  {formatCurrency(payment.amount)}
                </Td>
                <Td>
                  <PaymentStatusBadge status={payment.status} />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default CustomerPayments;
