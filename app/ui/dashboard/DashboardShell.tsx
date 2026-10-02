"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Boxes,
  ClipboardList,
  CreditCard,
  Home,
  LayoutGrid,
  Store,
  Tags,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import Container from "@/app/ui/Container";
import Skeleton from "@/app/ui/Skeleton";
import { useAuth } from "@/app/ui/auth/AuthProvider";
import { ROLE_HOME, ROLE_LABEL } from "@/lib/constants";
import { cn } from "@/lib/cn";
import type { UserRole } from "@/types";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Match only the exact path (used for "Overview" links). */
  exact?: boolean;
}

const NAV: Record<UserRole, NavItem[]> = {
  CUSTOMER: [
    { href: "/dashboard/customer", label: "Overview", icon: Home, exact: true },
    { href: "/dashboard/customer/orders", label: "My orders", icon: ClipboardList },
    { href: "/dashboard/customer/payments", label: "Payments", icon: CreditCard },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ],
  PROVIDER: [
    { href: "/dashboard/provider", label: "Overview", icon: Home, exact: true },
    { href: "/dashboard/provider/inventory", label: "Inventory", icon: Boxes },
    { href: "/dashboard/provider/orders", label: "Incoming orders", icon: ClipboardList },
    { href: "/dashboard/provider/business", label: "Business profile", icon: Store },
    { href: "/dashboard/profile", label: "Account", icon: User },
  ],
  ADMIN: [
    { href: "/dashboard/admin", label: "Overview", icon: Home, exact: true },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/gear", label: "All gear", icon: LayoutGrid },
    { href: "/dashboard/admin/orders", label: "All orders", icon: ClipboardList },
    { href: "/dashboard/admin/categories", label: "Categories", icon: Tags },
    { href: "/dashboard/profile", label: "Account", icon: User },
  ],
};

const DashboardShell = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, status } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [status, pathname, router]);

  if (status !== "authenticated" || !user) {
    return (
      <Container className="py-10">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <Skeleton className="h-12 lg:h-64" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </Container>
    );
  }

  const items = NAV[user.role];
  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Container className="py-8 sm:py-10">
      <div className="grid gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Link
            href={ROLE_HOME[user.role]}
            className="mb-3 hidden text-xs font-semibold uppercase tracking-wider text-slate-500 lg:block"
          >
            {ROLE_LABEL[user.role]} dashboard
          </Link>
          <nav
            aria-label="Dashboard"
            className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {items.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand-700 text-white"
                      : "text-slate-700 hover:bg-slate-200/60",
                  )}
                >
                  <item.icon className="size-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  );
};

export default DashboardShell;
