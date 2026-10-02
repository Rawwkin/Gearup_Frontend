import { cn } from "@/lib/cn";

export const fieldStyles = (hasError?: boolean, className?: string): string =>
  cn(
    "block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm",
    "placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100",
    hasError
      ? "border-red-500 focus-visible:outline-red-500"
      : "border-slate-300 hover:border-slate-400",
    className,
  );
