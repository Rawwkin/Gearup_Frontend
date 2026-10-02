import type { ApiEnvelope } from "@/types";

export const UNAUTHORIZED_EVENT = "gearup:unauthorized";

type QueryValue = string | number | boolean | null | undefined;

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, QueryValue>;
  /** Internal: whether a failed auth request may be retried after a token refresh. */
  retry?: boolean;
}

export class ApiError extends Error {
  status: number;
  isAuthError: boolean;

  constructor(message: string, status: number, isAuthError = false) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.isAuthError = isAuthError;
  }
}

const isServer = typeof window === "undefined";

// Browser  -> same-origin "/api", forwarded to the backend by the Next.js rewrite.
// Server   -> talk to the backend directly.
const getBaseUrl = (): string => {
  if (!isServer) return "/api";
  const backend = (process.env.BACKEND_URL ?? "http://localhost:5000").replace(/\/+$/, "");
  return `${backend}/api`;
};

const buildUrl = (path: string, query?: RequestOptions["query"]): string => {
  const params = new URLSearchParams();
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      }
    }
  }
  const qs = params.toString();
  return `${getBaseUrl()}${path}${qs ? `?${qs}` : ""}`;
};

/**
 * The backend throws plain `Error`s for auth problems, which its error handler
 * turns into HTTP 500 — so we can't rely on a 401 status alone.
 */
const looksLikeAuthFailure = (status: number, message: string): boolean =>
  status === 401 ||
  /jwt|token|unauthori[sz]ed|not logged in|invalid signature/i.test(message);

let refreshInFlight: Promise<boolean> | null = null;

const refreshSession = (): Promise<boolean> => {
  if (!refreshInFlight) {
    refreshInFlight = fetch(`${getBaseUrl()}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
};

export const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { method = "GET", body, query, retry = true } = options;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    throw new ApiError("Unable to reach the server. Check your connection and try again.", 0);
  }

  const payload = (await response.json().catch(() => null)) as
    | (Partial<ApiEnvelope<T>> & { message?: string })
    | null;

  if (response.ok && payload && payload.success !== false) {
    return payload.data as T;
  }

  const message =
    payload?.message || response.statusText || "Something went wrong. Please try again.";
  const isAuthError = looksLikeAuthFailure(response.status, message);

  if (isAuthError && !isServer) {
    const canRefresh = retry && !path.startsWith("/auth/");
    if (canRefresh && (await refreshSession())) {
      return request<T>(path, { ...options, retry: false });
    }
    if (!path.startsWith("/auth/")) {
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
  }

  throw new ApiError(message, response.status, isAuthError);
};

export const getErrorMessage = (error: unknown, fallback = "Something went wrong."): string => {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};
