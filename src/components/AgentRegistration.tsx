'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useAgentTreasury, useIsAgent } from '@/hooks/useContracts';
import { formatAddress } from '@/lib/utils';
import { Address, isAddress } from 'viem';
import { Bot, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useWaitForTransactionReceipt } from 'wagmi';

export function AgentRegistration() {
  const { address } = useAccount();
  const { isAgent } = useIsAgent(address);
  const { registerAgent, hash, isPending, error } = useAgentTreasury();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [agentWallet, setAgentWallet] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!address) {
      setLocalError('Please connect your wallet');
      return;
    }

    if (!name.trim()) {
      setLocalError('Agent name is required');
      return;
    }

    if (!agentWallet.trim()) {
      setLocalError('Agent wallet address is required');
      return;
    }

    if (!isAddress(agentWallet)) {
      setLocalError('Invalid wallet address');
      return;
    }

    try {
      await registerAgent(agentWallet as Address, name.trim(), description.trim() || '');
    } catch (err: any) {
      setLocalError(err.message || 'Registration failed');
    }
  };

  if (isAgent) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle className="h-5 w-5" />
        <span>Agent registered: {formatAddress(address!)}</span>
      </div>
    );
  }

  const displayError = error?.message || localError;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="agent-name" className="block text-sm font-medium text-gray-700 mb-1">
          Agent Name *
        </label>
        <input
          id="agent-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Alpha"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          disabled={isPending || isConfirming}
        />
      </div>

      <div>
        <label htmlFor="agent-wallet" className="block text-sm font-medium text-gray-700 mb-1">
          Agent Wallet Address *
        </label>
        <input
          id="agent-wallet"
          type="text"
          value={agentWallet}
          onChange={(e) => setAgentWallet(e.target.value)}
          placeholder="0x..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
          disabled={isPending || isConfirming}
        />
        <p className="mt-1 text-xs text-gray-500">
          Your address ({formatAddress(address || '')}) will be the agent owner
        </p>
      </div>

      <div>
        <label htmlFor="agent-description" className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          id="agent-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your agent..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          disabled={isPending || isConfirming}
        />
      </div>

      {displayError && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{displayError}</span>
        </div>
      )}

      {isConfirmed && (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle className="h-5 w-5" />
          <span>Agent registered successfully!</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || isConfirming || !address}
        className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {(isPending || isConfirming) && <Loader2 className="h-4 w-4 animate-spin" />}
        {isConfirming ? 'Confirming...' : isPending ? 'Registering...' : 'Register Agent'}
      </button>

      {hash && (
        <div className="text-xs text-gray-500">
          Transaction: <span className="font-mono">{hash.slice(0, 10)}...{hash.slice(-8)}</span>
        </div>
      )}
    </form>
  );
}
