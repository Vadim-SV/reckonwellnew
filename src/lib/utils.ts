import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names, resolving Tailwind conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a whole-pound amount in British style, e.g. £1,250. */
export function formatGBP(amount: number, options: { pence?: boolean } = {}) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: options.pence ? 2 : 0,
    maximumFractionDigits: options.pence ? 2 : 0,
  }).format(amount);
}
