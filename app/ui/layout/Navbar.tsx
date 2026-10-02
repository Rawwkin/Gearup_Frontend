"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, Menu, ShoppingBag, X } from "lucide-react";
import Logo from "@/app/ui/layout/Logo";
import Container from "@/app/ui/Container";
import { useAuth } from "@/app/ui/auth/AuthProvider";
import { useToast } from "@/app/ui/ToastProvider";
import { buttonStyles } from "@/lib/button-styles";
import { cartCount, useCart } from "@/lib/cart-store";
import { ROLE_HOME, ROLE_LABEL } from "@/lib/constants";
import { initials } from "@/lib/format";
import { cn } from "@/lib/cn";

const navLinkStyles = (active: boolean) =>
  cn(
    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    active ? "bg-brand-50 text-brand-800" : "text-slate-700 hover:bg-slate-100",
  );

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const { user, status, logout } = useAuth();
  const cart = useCart();
  const itemCount = cartCount(cart);

  // Menus are "open for a specific path", so they close automatically on navigation.
  const [mobileMenuPath, setMobileMenuPath] = useState<string | null>(null);
  const [userMenuPath, setUserMenuPath] = useState<string | null>(null);
  const mobileOpen = mobileMenuPath === pathname;
  const userMenuOpen = userMenuPath === pathname;
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userMenuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuPath(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setUserMenuPath(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [userMenuOpen]);

  const handleLogout = async () => {
    setUserMenuPath(null);
    setMobileMenuPath(null);
    await logout();
    toast.success("You have been signed out.");
    router.push("/");
    router.refresh();
  };

  const canShop = !user || user.role === "CUSTOMER";
  const dashboardHref = user ? ROLE_HOME[user.role] : "/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Logo />
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            <Link href="/gear" className={navLinkStyles(pathname.startsWith("/gear"))}>
              Browse gear
            </Link>
            {user && (
              <Link
                href={dashboardHref}
                className={navLinkStyles(pathname.startsWith("/dashboard"))}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {canShop && (
            <Link
              href="/cart"
              className="relative rounded-lg p-2 text-slate-700 hover:bg-slate-100"
              aria-label={itemCount > 0 ? `Cart, ${itemCount} items` : "Cart"}
            >
              <ShoppingBag className="size-5" aria-hidden="true" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-brand-700 px-1 text-[11px] font-bold leading-5 text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          )}

          {status === "loading" && <div className="hidden h-9 w-24 animate-pulse rounded-lg bg-slate-200 md:block" />}

          {status === "unauthenticated" && (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/login" className={buttonStyles({ variant: "ghost" })}>
                Sign in
              </Link>
              <Link href="/register" className={buttonStyles({ variant: "primary" })}>
                Get started
              </Link>
            </div>
          )}

          {status === "authenticated" && user && (
            <div className="relative hidden md:block" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuPath(userMenuOpen ? null : pathname)}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                className="flex cursor-pointer items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-slate-100"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white">
                  {initials(user.name)}
                </span>
                <span className="max-w-32 truncate text-sm font-medium text-slate-800">{user.name}</span>
                <ChevronDown className="size-4 text-slate-500" aria-hidden="true" />
              </button>
              {userMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-60 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg"
                >
                  <div className="border-b border-slate-100 px-3 py-2">
                    <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                    <p className="mt-1 text-xs font-medium text-brand-700">{ROLE_LABEL[user.role]}</p>
                  </div>
                  <Link
                    role="menuitem"
                    href={dashboardHref}
                    className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    <LayoutDashboard className="size-4" aria-hidden="true" />
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    <LogOut className="size-4" aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuPath(mobileOpen ? null : pathname)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="cursor-pointer rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          >
            {mobileOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </Container>

      {mobileOpen && (
        <div id="mobile-menu" className="border-t border-slate-200 bg-white md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            <Link href="/gear" className={navLinkStyles(pathname.startsWith("/gear"))}>
              Browse gear
            </Link>
            {user && (
              <Link href={dashboardHref} className={navLinkStyles(pathname.startsWith("/dashboard"))}>
                Dashboard
              </Link>
            )}
            {status === "unauthenticated" && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link href="/login" className={buttonStyles({ variant: "outline" })}>
                  Sign in
                </Link>
                <Link href="/register" className={buttonStyles({ variant: "primary" })}>
                  Get started
                </Link>
              </div>
            )}
            {status === "authenticated" && user && (
              <div className="mt-2 border-t border-slate-100 pt-3">
                <p className="truncate px-3 text-sm font-semibold text-slate-900">{user.name}</p>
                <p className="truncate px-3 text-xs text-slate-500">{user.email}</p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  Sign out
                </button>
              </div>
            )}
          </Container>
        </div>
      )}
    </header>
  );
};

export default Navbar;
