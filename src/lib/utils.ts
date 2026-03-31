import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// === LICENSE EXPIRATION UTILS (NEW) ===
export interface LicenseData {
  key: string;
  planType: '7days' | '1month' | 'lifetime';
  activationDate: string;
  expirationDate: string | null;
  isActive: boolean;
}

export const calculateExpiration = (planType: '7days' | '1month' | 'lifetime'): string | null => {
  if (planType === 'lifetime') return null;
  
  const date = new Date();
  if (planType === '7days') {
    date.setDate(date.getDate() + 7);
  } else if (planType === '1month') {
    date.setMonth(date.getMonth() + 1);
  }
  return date.toISOString();
};

export const isLicenseExpired = (expirationDate: string | null): boolean => {
  if (!expirationDate) return false; // lifetime
  return new Date() > new Date(expirationDate);
};

export const getDaysUntilExpiry = (expirationDate: string | null): number | null => {
  if (!expirationDate) return null; // lifetime
  const now = new Date();
  const expiry = new Date(expirationDate);
  const diffTime = expiry.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
// === END LICENSE UTILS ===
