'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useEscrow } from '@/hooks/useContracts';
import { Address, isAddress } from 'viem';
import { Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useWaitForTransactionReceipt } from 'wagmi';

export function EscrowForm() {
  const { address } = useAccount();
  const {
    createEscrow,
    createMilestoneEscrow,
    hash,
    isPending,
    error,
  } = useEscrow();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const [payee, setPayee] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [escrowType, setEscrowType] = useState<'single' | 'milestone'>('single');
  const [milestoneCount, setMilestoneCount] = useState('4');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!address) {
      setLocalError('Please connect your wallet');
      return;
    }

    if (!isAddress(payee)) {
      setLocalError('Invalid payee address');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setLocalError('Please enter a valid amount');
      return;
    }

    try {
      if (escrowType === 'milestone') {
        const milestones = parseInt(milestoneCount);
        if (milestones <= 0 || milestones > 100) {
          setLocalError('Milestone count must be between 1 and 100');
          return;
        }
        await createMilestoneEscrow(payee as Address, amount, BigInt(milestones), description || '');
      } else {
        await createEscrow(payee as Address, amount, description || '', false, BigInt(0));
      }
    } catch (err: any) {
      setLocalError(err.message || 'Failed to create escrow');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Escrow Type</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="single"
              checked={escrowType === 'single'}
              onChange={(e) => setEscrowType(e.target.value as 'single' | 'milestone')}
              className="text-primary-600"
            />
            <span>Single Payment</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="milestone"
              checked={escrowType === 'milestone'}
              onChange={(e) => setEscrowType(e.target.value as 'single' | 'milestone')}
              className="text-primary-600"
            />
            <span>Milestone Based</span>
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="payee" className="block text-sm font-medium text-gray-700 mb-1">
          Payee Address *
        </label>
        <input
          id="payee"
          type="text"
          value={payee}
          onChange={(e) => setPayee(e.target.value)}
          placeholder="0x..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
          disabled={isPending || isConfirming}
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Total Amount (MNEE) *
        </label>
        <input
          id="amount"
          type="number"
          step="0.000001"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          disabled={isPending || isConfirming}
        />
      </div>

      {escrowType === 'milestone' && (
        <div>
          <label htmlFor="milestones" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Milestones *
          </label>
          <input
            id="milestones"
            type="number"
            min="1"
            max="100"
            value={milestoneCount}
            onChange={(e) => setMilestoneCount(e.target.value)}
            placeholder="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={isPending || isConfirming}
          />
        </div>
      )}

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the escrow..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          disabled={isPending || isConfirming}
        />
      </div>

      {(error?.message || localError) && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error?.message || localError}</span>
        </div>
      )}

      {isConfirmed && (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle className="h-5 w-5" />
          <span>Escrow created successfully!</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || isConfirming || !address || !payee || !amount}
        className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {(isPending || isConfirming) && <Loader2 className="h-4 w-4 animate-spin" />}
        {isConfirming ? 'Confirming...' : isPending ? 'Creating Escrow...' : 'Create Escrow'}
        <Lock className="h-4 w-4" />
      </button>

      {hash && (
        <div className="text-xs text-gray-500">
          Transaction: <span className="font-mono">{hash.slice(0, 10)}...{hash.slice(-8)}</span>
        </div>
      )}
    </form>
  );
}
