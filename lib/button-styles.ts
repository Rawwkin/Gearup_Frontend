import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors " +
  "disabled:pointer-events-none disabled:opacity-60 cursor-pointer whitespace-nowrap";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-700 text-white hover:bg-brand-800 shadow-sm",
  secondary: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
  outline: "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50",
  ghost: "text-slate-700 hover:bg-slate-100",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  fullWidth?: boolean;
}

/** Class names for buttons — also usable on <Link> so links can look like buttons. */
export const buttonStyles = ({
  variant = "primary",
  size = "md",
  className,
  fullWidth,
}: ButtonStyleOptions = {}): string =>
  cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);
