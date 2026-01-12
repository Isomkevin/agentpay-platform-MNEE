'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useStreamingPayments } from '@/hooks/useContracts';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import { STREAMING_PAYMENTS_ABI } from '@/lib/abi';
import { formatMNEE, formatAddress } from '@/lib/utils';
import { Address } from 'viem';
import { useWaitForTransactionReceipt } from 'wagmi';
import { Repeat, TrendingUp, XCircle, Loader2, RefreshCw } from 'lucide-react';

export function StreamingPayments() {
  const { address } = useAccount();
  const {
    createSubscription,
    createStream,
    cancelSubscription,
    hash,
    isPending,
    error,
  } = useStreamingPayments();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('2592000'); // 30 days default
  const [streamType, setStreamType] = useState<'subscription' | 'stream'>('subscription');
  const [duration, setDuration] = useState('7776000'); // 90 days default
  const [localError, setLocalError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!address) {
      setLocalError('Please connect your wallet');
      return;
    }

    if (!recipient || !amount) {
      setLocalError('Please fill all fields');
      return;
    }

    try {
      if (streamType === 'subscription') {
        await createSubscription(address as Address, recipient as Address, amount, BigInt(period));
      } else {
        await createStream(address as Address, recipient as Address, amount, BigInt(duration));
      }
    } catch (err: any) {
      setLocalError(err.message || 'Failed to create stream/subscription');
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      setShowForm(false);
      setRecipient('');
      setAmount('');
      setLocalError('');
    }
  }, [isConfirmed]);

  if (!address) {
    return (
      <div className="text-center text-gray-500 py-8">
        <Repeat className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p>Connect wallet to manage streaming payments</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Streaming Payments</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          {showForm ? 'Cancel' : '+ Create'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="subscription"
                  checked={streamType === 'subscription'}
                  onChange={(e) => setStreamType(e.target.value as 'subscription' | 'stream')}
                  className="text-primary-600"
                />
                <span>Subscription</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="stream"
                  checked={streamType === 'stream'}
                  onChange={(e) => setStreamType(e.target.value as 'subscription' | 'stream')}
                  className="text-primary-600"
                />
                <span>Linear Stream</span>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Address *
            </label>
            <input
              id="recipient"
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
              disabled={isPending || isConfirming}
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              {streamType === 'subscription' ? 'Amount per Period (MNEE) *' : 'Total Amount (MNEE) *'}
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

          {streamType === 'subscription' && (
            <div>
              <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
                Period (seconds) *
              </label>
              <input
                id="period"
                type="number"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="2592000 (30 days)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isPending || isConfirming}
              />
              <p className="text-xs text-gray-500 mt-1">
                2592000 = 30 days, 604800 = 7 days, 86400 = 1 day
              </p>
            </div>
          )}

          {streamType === 'stream' && (
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration (seconds) *
              </label>
              <input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="7776000 (90 days)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isPending || isConfirming}
              />
            </div>
          )}

          {(error?.message || localError) && (
            <div className="text-red-600 text-sm">{error?.message || localError}</div>
          )}

          {isConfirmed && (
            <div className="text-green-600 text-sm">Streaming payment created successfully!</div>
          )}

          <button
            type="submit"
            disabled={isPending || isConfirming || !recipient || !amount}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {(isPending || isConfirming) && <Loader2 className="h-4 w-4 animate-spin" />}
            {isConfirming ? 'Confirming...' : isPending ? 'Creating...' : 'Create'}
            {streamType === 'subscription' ? <Repeat className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
          </button>
        </form>
      )}

      {hash && (
        <div className="text-xs text-gray-500">
          Transaction: <span className="font-mono">{hash.slice(0, 10)}...{hash.slice(-8)}</span>
        </div>
      )}

      <div className="text-sm text-gray-500 mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="font-medium mb-1">Note:</p>
        <p className="text-xs">
          Subscriptions: Recurring payments at fixed intervals
        </p>
        <p className="text-xs">
          Linear Streams: Continuous payments over time (call processPayment periodically)
        </p>
      </div>
    </div>
  );
}
