import { Check } from "lucide-react";
import { ORDER_FLOW, ORDER_STATUS_META } from "@/lib/constants";
import { cn } from "@/lib/cn";
import type { RentalOrderStatus } from "@/types";

const OrderProgress = ({ status }: { status: RentalOrderStatus }) => {
  if (status === "CANCELLED") {
    return (
      <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
        This order was cancelled.
      </p>
    );
  }

  const currentIndex = ORDER_FLOW.indexOf(status);

  return (
    <ol className="grid grid-cols-5 gap-2" aria-label="Order progress">
      {ORDER_FLOW.map((step, index) => {
        const done = index < currentIndex;
        const current = index === currentIndex;
        return (
          <li key={step} className="flex flex-col items-center text-center" aria-current={current ? "step" : undefined}>
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-xs font-bold",
                done && "bg-emerald-600 text-white",
                current && "bg-brand-700 text-white ring-4 ring-brand-100",
                !done && !current && "bg-slate-200 text-slate-500",
              )}
            >
              {done ? <Check className="size-4" aria-hidden="true" /> : index + 1}
            </span>
            <span
              className={cn(
                "mt-2 text-[11px] leading-tight sm:text-xs",
                current ? "font-semibold text-slate-900" : "text-slate-500",
              )}
            >
              {ORDER_STATUS_META[step].label.split(" · ")[0]}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

export default OrderProgress;
