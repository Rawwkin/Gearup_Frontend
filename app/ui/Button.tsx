import type { ButtonHTMLAttributes } from "react";
import { buttonStyles, type ButtonSize, type ButtonVariant } from "@/lib/button-styles";
import Spinner from "@/app/ui/Spinner";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
};

const Button = ({
  variant,
  size,
  loading = false,
  fullWidth,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, fullWidth, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
};

export default Button;
