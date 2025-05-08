
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges tailwind classes with clsx
 * @param inputs ClassValue[]
 * @returns string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
