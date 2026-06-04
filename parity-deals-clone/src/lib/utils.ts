import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createUrl(
  href: string,
  oldParams: Record<string, string>,
  newParams: Record<string, string | undefined>
) {
  const params = new URLSearchParams(oldParams);

  Object.keys(newParams).forEach((key) => {
    const value = newParams[key];
    if (value == null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });

  return `${href}?${params.toString()}`;
}
