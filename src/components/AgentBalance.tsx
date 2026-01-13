'use client';

import { useAccount } from 'wagmi';
import { useAgent, useAgentTreasury } from '@/hooks/useContracts';
import { formatMNEE, formatAddress } from '@/lib/utils';
import { useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { MNEE_CONTRACT } from '@/lib/contracts';
import { MNEE_ABI } from '@/lib/abi';
import { Address } from 'viem';
import { useState, useEffect } from 'react';
import { Wallet, Plus, ArrowUpRight, Loader2, RefreshCw, Bot } from 'lucide-react';
import { parseMNEE } from '@/lib/utils';

export function AgentBalance() {
  const { address } = useAccount();
  const { agent, balance, refetch, refetchBalance } = useAgent(address as Address | undefined);
  const { depositToAgent, hash: depositHash, isPending: isDepositing, error: depositError } = useAgentTreasury();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: depositHash,
  });

  // Get wallet MNEE balance
  const { data: walletBalance, refetch: refetchWalletBalance } = useReadContract({
    address: MNEE_CONTRACT as Address,
    abi: MNEE_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const [depositAmount, setDepositAmount] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (isConfirmed) {
      refetchBalance();
      refetchWalletBalance();
      setDepositAmount('');
      setLocalError('');
    }
  }, [isConfirmed, refetchBalance, refetchWalletBalance]);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!address) {
      setLocalError('Please connect your wallet');
      return;
    }

    if (!agent) {
      setLocalError('Please register your agent first');
      return;
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setLocalError('Please enter a valid amount');
      return;
    }

    try {
      // Note: User must approve MNEE spending first
      // The depositToAgent function expects MNEE to already be approved
      await depositToAgent(address as Address, depositAmount);
    } catch (err: any) {
      setLocalError(err.message || 'Deposit failed. Make sure MNEE is approved.');
    }
  };

  if (!agent) {
    return (
      <div className="text-center text-gray-500 py-8">
        <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p>Register an agent to view balance</p>
      </div>
    );
  }

  const displayBalance = balance ? formatMNEE(balance) : '0';
  const displayWalletBalance = walletBalance ? formatMNEE(walletBalance) : '0';

  return (
    <div className="space-y-6">
      {/* Balance Display */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-medium text-gray-600">Treasury Balance</span>
          </div>
          <button
            onClick={() => {
              refetchBalance();
              refetchWalletBalance();
            }}
            className="text-primary-600 hover:text-primary-700"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <div className="text-3xl font-bold text-gray-900">{displayBalance} MNEE</div>
        <div className="mt-2 text-sm text-gray-600">
          Wallet Balance: {displayWalletBalance} MNEE
        </div>
        {agent.dailySpendLimit > 0n && (
          <div className="mt-2 text-sm text-gray-600">
            Daily Limit: {formatMNEE(agent.dailySpendLimit)} MNEE
          </div>
        )}
      </div>

      {/* Deposit Form */}
      <form onSubmit={handleDeposit} className="space-y-4">
        <div>
          <label htmlFor="deposit-amount" className="block text-sm font-medium text-gray-700 mb-1">
            Deposit MNEE
          </label>
          <div className="flex gap-2">
            <input
              id="deposit-amount"
              type="number"
              step="0.000001"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={isDepositing || isConfirming}
            />
            <button
              type="submit"
              disabled={isDepositing || isConfirming || !depositAmount}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {(isDepositing || isConfirming) && <Loader2 className="h-4 w-4 animate-spin" />}
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {(depositError?.message || localError) && (
          <div className="text-red-600 text-sm">{depositError?.message || localError}</div>
        )}

        {isConfirmed && (
          <div className="text-green-600 text-sm">Deposit successful!</div>
        )}

        {depositHash && (
          <div className="text-xs text-gray-500">
            Transaction: <span className="font-mono">{depositHash.slice(0, 10)}...{depositHash.slice(-8)}</span>
          </div>
        )}
      </form>

      {/* Agent Info */}
      <div className="border-t pt-4">
        <div className="text-sm text-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="h-4 w-4" />
            <span className="font-medium">{agent.name || 'Unnamed Agent'}</span>
          </div>
          {agent.description && (
            <p className="text-gray-500">{agent.description}</p>
          )}
          <div className="mt-2 text-xs">
            Agent ID: <span className="font-mono">{formatAddress(address!)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
