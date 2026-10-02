import { useId, type SelectHTMLAttributes } from "react";
import { fieldStyles } from "@/lib/field-styles";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  hint?: string;
};

const Select = ({
  label,
  error,
  hint,
  className,
  id,
  required,
  children,
  ...props
}: SelectProps) => {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;

  return (
    <div>
      <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && (
          <span className="ml-0.5 text-red-600" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <select
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={fieldStyles(Boolean(error), className)}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <p id={`${fieldId}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${fieldId}-hint`} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
};

export default Select;
