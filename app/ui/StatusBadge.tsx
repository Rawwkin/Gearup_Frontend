import Badge from "@/app/ui/Badge";
import { ORDER_STATUS_META, PAYMENT_STATUS_META, USER_STATUS_META } from "@/lib/constants";
import type { PaymentStatus, RentalOrderStatus, UserStatus } from "@/types";

export const OrderStatusBadge = ({ status }: { status: RentalOrderStatus }) => {
  const meta = ORDER_STATUS_META[status];
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
};

export const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => {
  const meta = PAYMENT_STATUS_META[status];
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
};

export const UserStatusBadge = ({ status }: { status: UserStatus }) => {
  const meta = USER_STATUS_META[status];
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
};
