import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNpr(amount: number): string {
  return `NPR ${amount.toLocaleString('en-IN')}`;
}

export function formatNprShort(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-IN')}`;
}
