'use client';

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESSES, MNEE_CONTRACT } from '@/lib/contracts';
import {
  AGENT_TREASURY_ABI,
  PAYMENT_RULES_ABI,
  STREAMING_PAYMENTS_ABI,
  ESCROW_CONTRACT_ABI,
  MNEE_ABI,
} from '@/lib/abi';
import { parseMNEE } from '@/lib/utils';
import { Address, encodeAbiParameters, parseAbiParameters as parseAbi } from 'viem';

// AgentTreasury hooks
export function useAgentTreasury() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const registerAgent = async (wallet: Address, name: string, description: string) => {
    if (!CONTRACT_ADDRESSES.AgentTreasury) throw new Error('AgentTreasury address not set');
    return writeContract({
      address: CONTRACT_ADDRESSES.AgentTreasury as Address,
      abi: AGENT_TREASURY_ABI,
      functionName: 'registerAgent',
      args: [wallet, name, description],
    });
  };

  const depositToAgent = async (agentId: Address, amount: string) => {
    if (!CONTRACT_ADDRESSES.AgentTreasury) throw new Error('AgentTreasury address not set');
    const amountWei = parseMNEE(amount);
    
    // Note: Approval must be done separately before calling deposit
    // For MVP, we'll assume approval is done manually or via separate UI
    return writeContract({
      address: CONTRACT_ADDRESSES.AgentTreasury as Address,
      abi: AGENT_TREASURY_ABI,
      functionName: 'depositToAgent',
      args: [agentId, amountWei],
    });
  };

  const executePayment = async (agentId: Address, recipient: Address, amount: string) => {
    if (!CONTRACT_ADDRESSES.AgentTreasury) throw new Error('AgentTreasury address not set');
    const amountWei = parseMNEE(amount);
    return writeContract({
      address: CONTRACT_ADDRESSES.AgentTreasury as Address,
      abi: AGENT_TREASURY_ABI,
      functionName: 'executePayment',
      args: [agentId, recipient, amountWei],
    });
  };

  const setSpendingLimit = async (agentId: Address, limit: string) => {
    if (!CONTRACT_ADDRESSES.AgentTreasury) throw new Error('AgentTreasury address not set');
    const limitWei = parseMNEE(limit);
    return writeContract({
      address: CONTRACT_ADDRESSES.AgentTreasury as Address,
      abi: AGENT_TREASURY_ABI,
      functionName: 'setSpendingLimit',
      args: [agentId, limitWei],
    });
  };

  return {
    registerAgent,
    depositToAgent,
    executePayment,
    setSpendingLimit,
    hash,
    isPending,
    error,
  };
}

export function useAgent(agentId: Address | undefined) {
  const { data: agent, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.AgentTreasury as Address,
    abi: AGENT_TREASURY_ABI,
    functionName: 'getAgent',
    args: agentId ? [agentId] : undefined,
    query: { enabled: !!agentId && !!CONTRACT_ADDRESSES.AgentTreasury },
  });

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.AgentTreasury as Address,
    abi: AGENT_TREASURY_ABI,
    functionName: 'getBalance',
    args: agentId ? [agentId] : undefined,
    query: { enabled: !!agentId && !!CONTRACT_ADDRESSES.AgentTreasury },
  });

  return { agent, balance, refetch, refetchBalance };
}

export function useIsAgent(address: Address | undefined) {
  const { data: isAgent } = useReadContract({
    address: CONTRACT_ADDRESSES.AgentTreasury as Address,
    abi: AGENT_TREASURY_ABI,
    functionName: 'isAgent',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!CONTRACT_ADDRESSES.AgentTreasury },
  });

  return { isAgent: isAgent || false };
}

// PaymentRules hooks
export function usePaymentRules() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const createRule = async (
    agentId: Address,
    recipient: Address,
    amount: string,
    ruleType: 0 | 1 | 2 | 3, // 0=Always, 1=TimeBased, 2=Threshold, 3=SuccessBased
    conditionData: `0x${string}`
  ) => {
    if (!CONTRACT_ADDRESSES.PaymentRules) throw new Error('PaymentRules address not set');
    const amountWei = parseMNEE(amount);
    return writeContract({
      address: CONTRACT_ADDRESSES.PaymentRules as Address,
      abi: PAYMENT_RULES_ABI,
      functionName: 'createRule',
      args: [agentId, recipient, amountWei, ruleType, conditionData],
    });
  };

  const executeRule = async (ruleId: bigint, proof: `0x${string}`) => {
    if (!CONTRACT_ADDRESSES.PaymentRules) throw new Error('PaymentRules address not set');
    return writeContract({
      address: CONTRACT_ADDRESSES.PaymentRules as Address,
      abi: PAYMENT_RULES_ABI,
      functionName: 'executeRule',
      args: [ruleId, proof],
    });
  };

  return {
    createRule,
    executeRule,
    hash,
    isPending,
    error,
  };
}

export function usePaymentRule(ruleId: bigint | undefined) {
  const { data: rule } = useReadContract({
    address: CONTRACT_ADDRESSES.PaymentRules as Address,
    abi: PAYMENT_RULES_ABI,
    functionName: 'getRule',
    args: ruleId !== undefined ? [ruleId] : undefined,
    query: { enabled: ruleId !== undefined && !!CONTRACT_ADDRESSES.PaymentRules },
  });

  return { rule };
}

// StreamingPayments hooks
export function useStreamingPayments() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const createSubscription = async (
    agentId: Address,
    recipient: Address,
    amount: string,
    period: bigint // in seconds
  ) => {
    if (!CONTRACT_ADDRESSES.StreamingPayments) throw new Error('StreamingPayments address not set');
    const amountWei = parseMNEE(amount);
    return writeContract({
      address: CONTRACT_ADDRESSES.StreamingPayments as Address,
      abi: STREAMING_PAYMENTS_ABI,
      functionName: 'createSubscription',
      args: [agentId, recipient, amountWei, period],
    });
  };

  const createStream = async (
    agentId: Address,
    recipient: Address,
    totalAmount: string,
    duration: bigint // in seconds
  ) => {
    if (!CONTRACT_ADDRESSES.StreamingPayments) throw new Error('StreamingPayments address not set');
    const amountWei = parseMNEE(totalAmount);
    return writeContract({
      address: CONTRACT_ADDRESSES.StreamingPayments as Address,
      abi: STREAMING_PAYMENTS_ABI,
      functionName: 'createStream',
      args: [agentId, recipient, amountWei, duration],
    });
  };

  const cancelSubscription = async (subscriptionId: bigint) => {
    if (!CONTRACT_ADDRESSES.StreamingPayments) throw new Error('StreamingPayments address not set');
    return writeContract({
      address: CONTRACT_ADDRESSES.StreamingPayments as Address,
      abi: STREAMING_PAYMENTS_ABI,
      functionName: 'cancelSubscription',
      args: [subscriptionId],
    });
  };

  return {
    createSubscription,
    createStream,
    cancelSubscription,
    hash,
    isPending,
    error,
  };
}

// Escrow hooks
export function useEscrow() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const createEscrow = async (
    payee: Address,
    amount: string,
    description: string,
    autoRelease: boolean,
    releaseTime: bigint
  ) => {
    if (!CONTRACT_ADDRESSES.EscrowContract) throw new Error('EscrowContract address not set');
    const amountWei = parseMNEE(amount);

    // First approve
    await writeContract({
      address: MNEE_CONTRACT as Address,
      abi: MNEE_ABI,
      functionName: 'approve',
      args: [CONTRACT_ADDRESSES.EscrowContract as Address, amountWei],
    });

    // Then create escrow
    return writeContract({
      address: CONTRACT_ADDRESSES.EscrowContract as Address,
      abi: ESCROW_CONTRACT_ABI,
      functionName: 'createEscrow',
      args: [payee, amountWei, description, autoRelease, releaseTime],
    });
  };

  const createMilestoneEscrow = async (
    payee: Address,
    totalAmount: string,
    milestoneCount: bigint,
    description: string
  ) => {
    if (!CONTRACT_ADDRESSES.EscrowContract) throw new Error('EscrowContract address not set');
    const amountWei = parseMNEE(totalAmount);

    // First approve
    await writeContract({
      address: MNEE_CONTRACT as Address,
      abi: MNEE_ABI,
      functionName: 'approve',
      args: [CONTRACT_ADDRESSES.EscrowContract as Address, amountWei],
    });

    // Then create milestone escrow
    return writeContract({
      address: CONTRACT_ADDRESSES.EscrowContract as Address,
      abi: ESCROW_CONTRACT_ABI,
      functionName: 'createMilestoneEscrow',
      args: [payee, amountWei, milestoneCount, description],
    });
  };

  const releaseEscrow = async (escrowId: bigint) => {
    if (!CONTRACT_ADDRESSES.EscrowContract) throw new Error('EscrowContract address not set');
    return writeContract({
      address: CONTRACT_ADDRESSES.EscrowContract as Address,
      abi: ESCROW_CONTRACT_ABI,
      functionName: 'releaseEscrow',
      args: [escrowId],
    });
  };

  const releaseMilestone = async (escrowId: bigint) => {
    if (!CONTRACT_ADDRESSES.EscrowContract) throw new Error('EscrowContract address not set');
    return writeContract({
      address: CONTRACT_ADDRESSES.EscrowContract as Address,
      abi: ESCROW_CONTRACT_ABI,
      functionName: 'releaseMilestone',
      args: [escrowId],
    });
  };

  const cancelEscrow = async (escrowId: bigint) => {
    if (!CONTRACT_ADDRESSES.EscrowContract) throw new Error('EscrowContract address not set');
    return writeContract({
      address: CONTRACT_ADDRESSES.EscrowContract as Address,
      abi: ESCROW_CONTRACT_ABI,
      functionName: 'cancelEscrow',
      args: [escrowId],
    });
  };

  return {
    createEscrow,
    createMilestoneEscrow,
    releaseEscrow,
    releaseMilestone,
    cancelEscrow,
    hash,
    isPending,
    error,
  };
}
