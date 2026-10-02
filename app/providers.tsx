"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/app/ui/auth/AuthProvider";
import { ToastProvider } from "@/app/ui/ToastProvider";

const Providers = ({ children, hasSession }: { children: ReactNode; hasSession: boolean }) => {
  return (
    <ToastProvider>
      <AuthProvider hasSession={hasSession}>{children}</AuthProvider>
    </ToastProvider>
  );
};

export default Providers;
