import { cn } from "@/lib/cn";

const Skeleton = ({ className }: { className?: string }) => {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-md bg-slate-200", className)} />;
};

export default Skeleton;
