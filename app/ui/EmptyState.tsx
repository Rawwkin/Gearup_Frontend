import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { PackageSearch } from "lucide-react";

const EmptyState = ({
  icon: Icon = PackageSearch,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Icon className="size-6" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      {description && <p className="mt-1 max-w-md text-sm text-slate-600">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
