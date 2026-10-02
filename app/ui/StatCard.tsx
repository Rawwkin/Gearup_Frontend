import type { LucideIcon } from "lucide-react";
import Card from "@/app/ui/Card";

const StatCard = ({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
}) => {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="mt-1 truncate text-2xl font-bold text-slate-900">{value}</p>
          {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
