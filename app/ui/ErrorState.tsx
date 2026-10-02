import type { ReactNode } from "react";
import { CloudOff } from "lucide-react";

const ErrorState = ({
  title = "We couldn't load this",
  message,
  action,
}: {
  title?: string;
  message?: string;
  action?: ReactNode;
}) => {
  return (
    <div
      role="alert"
      className="flex flex-col items-center rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center"
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-red-100 text-red-600">
        <CloudOff className="size-6" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-red-900">{title}</h3>
      {message && <p className="mt-1 max-w-md text-sm text-red-800">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default ErrorState;
