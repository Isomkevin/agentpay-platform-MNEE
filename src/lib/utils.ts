import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format MNEE amount (18 decimals)
export function formatMNEE(amount: bigint | string): string {
  const value = typeof amount === 'string' ? BigInt(amount) : amount;
  const divisor = BigInt(10 ** 18);
  const whole = value / divisor;
  const fraction = value % divisor;
  const fractionStr = fraction.toString().padStart(18, '0');
  const trimmed = fractionStr.replace(/0+$/, '');
  return trimmed ? `${whole}.${trimmed}` : whole.toString();
}

// Parse human-readable MNEE amount to wei
export function parseMNEE(amount: string): bigint {
  const parts = amount.split('.');
  const whole = BigInt(parts[0] || '0');
  const fraction = parts[1]?.padEnd(18, '0').slice(0, 18) || '0';
  return whole * BigInt(10 ** 18) + BigInt(fraction);
}

// Format address for display
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Format transaction hash
export function formatTxHash(txHash: string): string {
  if (!txHash) return '';
  return `${txHash.slice(0, 10)}...${txHash.slice(-8)}`;
}
