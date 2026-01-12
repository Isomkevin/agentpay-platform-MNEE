/**
 * Contract addresses and configuration
 * These should be set via environment variables after deployment
 */

export const MNEE_CONTRACT = '0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF' as const;

export const CONTRACT_ADDRESSES = {
  AgentTreasury: process.env.NEXT_PUBLIC_AGENT_TREASURY_ADDRESS || '',
  PaymentRules: process.env.NEXT_PUBLIC_PAYMENT_RULES_ADDRESS || '',
  StreamingPayments: process.env.NEXT_PUBLIC_STREAMING_PAYMENTS_ADDRESS || '',
  EscrowContract: process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS || '',
  MNEE: MNEE_CONTRACT,
} as const;

export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '1', 10);

// Helper to format amounts (MNEE has 18 decimals)
export const formatMNEE = (amount: bigint | string): string => {
  const value = typeof amount === 'string' ? BigInt(amount) : amount;
  const divisor = BigInt(10 ** 18);
  const whole = value / divisor;
  const fraction = value % divisor;
  return `${whole}.${fraction.toString().padStart(18, '0').replace(/0+$/, '')}`;
};

// Helper to parse amounts (convert human-readable to wei)
export const parseMNEE = (amount: string): bigint => {
  const parts = amount.split('.');
  const whole = BigInt(parts[0] || '0');
  const fraction = parts[1]?.padEnd(18, '0').slice(0, 18) || '0';
  return whole * BigInt(10 ** 18) + BigInt(fraction);
};
