"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authApi, usersApi } from "@/lib/api";
import { UNAUTHORIZED_EVENT } from "@/lib/http";
import type { AuthUser, LoginPayload, RegisterPayload } from "@/types";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  /** Re-fetch the current user (e.g. after editing the profile). */
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({
  children,
  hasSession,
}: {
  children: ReactNode;
  /** Whether the server saw an auth cookie — lets us skip a pointless /me call for guests. */
  hasSession: boolean;
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>(hasSession ? "loading" : "unauthenticated");

  useEffect(() => {
    if (!hasSession) return;
    let ignore = false;

    const load = async () => {
      try {
        const { result } = await usersApi.me();
        if (ignore) return;
        setUser(result);
        setStatus("authenticated");
      } catch {
        if (ignore) return;
        setUser(null);
        setStatus("unauthenticated");
      }
    };

    void load();
    return () => {
      ignore = true;
    };
  }, [hasSession]);

  // The HTTP client fires this when a request failed and the token could not be refreshed.
  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null);
      setStatus("unauthenticated");
    };
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    await authApi.login(payload);
    const { result } = await usersApi.me();
    setUser(result);
    setStatus("authenticated");
    return result;
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    await usersApi.register(payload);
  }, []);

  const logout = useCallback(async () => {
    // The backend has no logout endpoint and its cookies are httpOnly,
    // so this app clears them through its own route handler.
    try {
      await fetch("/session/logout", { method: "POST", credentials: "include" });
    } finally {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const { result } = await usersApi.me();
    setUser(result);
    setStatus("authenticated");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, register, logout, refreshUser }),
    [user, status, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
};
