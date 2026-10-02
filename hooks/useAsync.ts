"use client";

import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "@/lib/http";

interface Settled<T> {
  fetcher: () => Promise<T>;
  version: number;
  data?: T;
  error?: string;
}

interface AsyncState<T> {
  data: T | undefined;
  error: string | null;
  loading: boolean;
  reload: () => void;
}

/**
 * Runs `fetcher` on mount and whenever its identity changes.
 * Pass a stable function (module-level or wrapped in `useCallback`).
 * `data` keeps the previous value while reloading so lists don't flash.
 */
export const useAsync = <T,>(fetcher: () => Promise<T>): AsyncState<T> => {
  const [version, setVersion] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | null>(null);

  useEffect(() => {
    let ignore = false;
    fetcher()
      .then((data) => {
        if (!ignore) setSettled({ fetcher, version, data });
      })
      .catch((error: unknown) => {
        if (!ignore) setSettled({ fetcher, version, error: getErrorMessage(error) });
      });
    return () => {
      ignore = true;
    };
  }, [fetcher, version]);

  const reload = useCallback(() => setVersion((current) => current + 1), []);

  const loading = !settled || settled.fetcher !== fetcher || settled.version !== version;

  return {
    // Never show data that belongs to a previous fetcher (e.g. a different :id).
    data: settled && settled.fetcher === fetcher ? settled.data : undefined,
    error: !loading ? (settled?.error ?? null) : null,
    loading,
    reload,
  };
};
