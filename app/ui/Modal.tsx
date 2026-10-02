"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

/** Accessible modal built on the native <dialog> element (focus trap + Esc for free). */
const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl p-0 shadow-2xl backdrop:bg-slate-900/50"
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="-mr-2 -mt-2 cursor-pointer rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-5">{open ? children : null}</div>
      </div>
    </dialog>
  );
};

export default Modal;
