/** Only allow same-site relative redirects (prevents open-redirect via ?next=). */
export const safeNextPath = (value: string | string[] | undefined | null): string | null => {
  const path = Array.isArray(value) ? value[0] : value;
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) return null;
  return path;
};
