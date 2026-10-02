"use client";

import { useSyncExternalStore } from "react";
import { todayISO } from "@/lib/format";

const subscribe = () => () => {};

/** Today's date (YYYY-MM-DD). Empty string during SSR so hydration always matches. */
export const useToday = (): string =>
  useSyncExternalStore(subscribe, todayISO, () => "");
