import Link from "next/link";
import { CalendarDays, ChevronRight } from "lucide-react";
import { OrderStatusBadge } from "@/app/ui/StatusBadge";
import { providerName } from "@/lib/gear";
import { formatCurrency, formatDate, formatDateRange, pluralize, shortId } from "@/lib/format";
import type { RentalOrder } from "@/types";

const OrderCard = ({ order, href }: { order: RentalOrder; href: string }) => {
  const items = order.items ?? [];
  const firstName = items[0]?.gearItem?.name ?? "Rental order";
  const extra = items.length - 1;

  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-5"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold tracking-wide text-slate-500">#{shortId(order.id)}</p>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="mt-1 truncate font-semibold text-slate-900 group-hover:text-brand-700">
          {firstName}
          {extra > 0 && <span className="font-normal text-slate-500"> + {pluralize(extra, "more item")}</span>}
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="size-4" aria-hidden="true" />
            {formatDateRange(order.startDate, order.endDate)}
          </span>
          <span>from {providerName(order.provider)}</span>
        </p>
      </div>
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="text-left sm:text-right">
          <p className="text-lg font-bold text-slate-900">{formatCurrency(order.totalAmount)}</p>
          <p className="text-xs text-slate-500">Placed {formatDate(order.createdAt)}</p>
        </div>
        <ChevronRight className="size-5 text-slate-400" aria-hidden="true" />
      </div>
    </Link>
  );
};

export default OrderCard;
