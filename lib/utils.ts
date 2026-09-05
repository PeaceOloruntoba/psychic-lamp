import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateOrderNumber(): string {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = (now.getMonth() + 1).toString().padStart(2, "0");
  const d = now.getDate().toString().padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `VZR-${y}${m}${d}-${rand}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONTACTED: "Contacted",
  INVOICED: "Invoiced",
  FULFILLED: "Fulfilled",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  CONTACTED: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  INVOICED: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  FULFILLED: "bg-solar-500/15 text-solar-400 border-solar-500/30",
  CANCELLED: "bg-red-500/15 text-red-400 border-red-500/30",
};
