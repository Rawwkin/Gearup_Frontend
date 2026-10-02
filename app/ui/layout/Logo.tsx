import Link from "next/link";
import { Backpack } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/cn";

const Logo = ({ className, light = false }: { className?: string; light?: boolean }) => {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 text-xl font-extrabold tracking-tight",
        light ? "text-white" : "text-slate-900",
        className,
      )}
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-brand-700 text-white">
        <Backpack className="size-5" aria-hidden="true" />
      </span>
      {APP_NAME}
    </Link>
  );
};

export default Logo;
