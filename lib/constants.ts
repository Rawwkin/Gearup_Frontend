import type { PaymentStatus, RentalOrderStatus, UserRole, UserStatus } from "@/types";

export type Tone = "neutral" | "info" | "success" | "warning" | "danger" | "brand";

export const APP_NAME = "GearUp";

export const ROLE_HOME: Record<UserRole, string> = {
  CUSTOMER: "/dashboard/customer",
  PROVIDER: "/dashboard/provider",
  ADMIN: "/dashboard/admin",
};

export const ROLE_LABEL: Record<UserRole, string> = {
  CUSTOMER: "Customer",
  PROVIDER: "Provider",
  ADMIN: "Admin",
};

export const ORDER_STATUS_META: Record<
  RentalOrderStatus,
  { label: string; tone: Tone; hint: string }
> = {
  PLACED: {
    label: "Awaiting confirmation",
    tone: "warning",
    hint: "The provider has been notified and will confirm your request.",
  },
  CONFIRMED: {
    label: "Confirmed · payment due",
    tone: "info",
    hint: "The provider accepted your request. Complete the payment to secure your gear.",
  },
  PAID: {
    label: "Paid",
    tone: "brand",
    hint: "Payment received. Pick up your gear from the provider.",
  },
  PICKED_UP: {
    label: "Picked up",
    tone: "brand",
    hint: "Enjoy your rental and return it on time.",
  },
  RETURNED: {
    label: "Returned",
    tone: "success",
    hint: "All done. You can now review the gear you rented.",
  },
  CANCELLED: {
    label: "Cancelled",
    tone: "danger",
    hint: "This order was cancelled and the stock was released.",
  },
};

/** The happy-path order lifecycle, used for the progress tracker. */
export const ORDER_FLOW: RentalOrderStatus[] = [
  "PLACED",
  "CONFIRMED",
  "PAID",
  "PICKED_UP",
  "RETURNED",
];

export const PAYMENT_STATUS_META: Record<PaymentStatus, { label: string; tone: Tone }> = {
  PENDING: { label: "Pending", tone: "warning" },
  COMPLETED: { label: "Completed", tone: "success" },
  FAILED: { label: "Failed", tone: "danger" },
};

export const USER_STATUS_META: Record<UserStatus, { label: string; tone: Tone }> = {
  ACTIVE: { label: "Active", tone: "success" },
  SUSPENDED: { label: "Suspended", tone: "danger" },
};

/** Provider actions per order status — mirrors ALLOWED_TRANSITIONS in the backend. */
export const PROVIDER_ACTIONS: Record<
  RentalOrderStatus,
  { status: RentalOrderStatus; label: string; variant: "primary" | "outline" | "danger" }[]
> = {
  PLACED: [
    { status: "CONFIRMED", label: "Confirm order", variant: "primary" },
    { status: "CANCELLED", label: "Decline", variant: "danger" },
  ],
  CONFIRMED: [{ status: "CANCELLED", label: "Cancel order", variant: "danger" }],
  PAID: [{ status: "PICKED_UP", label: "Mark as picked up", variant: "primary" }],
  PICKED_UP: [{ status: "RETURNED", label: "Mark as returned", variant: "primary" }],
  RETURNED: [],
  CANCELLED: [],
};

/** Orders that still hold stock / need attention. */
export const ACTIVE_ORDER_STATUSES: RentalOrderStatus[] = [
  "PLACED",
  "CONFIRMED",
  "PAID",
  "PICKED_UP",
];
