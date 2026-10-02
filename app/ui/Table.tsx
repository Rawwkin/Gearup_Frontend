import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Responsive table: scrolls horizontally on small screens instead of breaking the layout. */
export const Table = ({ className, ...props }: HTMLAttributes<HTMLTableElement>) => (
  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
    <table className={cn("w-full min-w-[640px] text-left text-sm", className)} {...props} />
  </div>
);

export const Th = ({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    scope="col"
    className={cn(
      "border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600",
      className,
    )}
    {...props}
  />
);

export const Td = ({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn("border-b border-slate-100 px-4 py-3 align-middle text-slate-700", className)} {...props} />
);
