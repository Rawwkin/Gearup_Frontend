import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

type AlertVariant = "info" | "success" | "warning" | "error";

const styles: Record<AlertVariant, string> = {
  info: "border-sky-200 bg-sky-50 text-sky-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  error: "border-red-200 bg-red-50 text-red-900",
};

const icons: Record<AlertVariant, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  error: AlertCircle,
};

const Alert = ({
  variant = "info",
  title,
  className,
  children,
}: {
  variant?: AlertVariant;
  title?: string;
  className?: string;
  children?: ReactNode;
}) => {
  const Icon = icons[variant];
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn("flex gap-3 rounded-lg border p-4 text-sm", styles[variant], className)}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={title ? "mt-1" : undefined}>{children}</div>}
      </div>
    </div>
  );
};

export default Alert;
