type ClassValue = string | false | null | undefined;

/** Join class names, skipping falsy values. */
export const cn = (...parts: ClassValue[]): string => parts.filter(Boolean).join(" ");
