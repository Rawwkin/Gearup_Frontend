"use client";

import { useState } from "react";
import Button from "@/app/ui/Button";
import Modal from "@/app/ui/Modal";

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  destructive = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description?: string;
  confirmLabel?: string;
  destructive?: boolean;
}) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={title} description={description}>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Keep it
        </Button>
        <Button variant={destructive ? "danger" : "primary"} onClick={handleConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
