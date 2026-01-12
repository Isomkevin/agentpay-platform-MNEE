'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useAgentTreasury, usePaymentRules } from '@/hooks/useContracts';
import { formatAddress } from '@/lib/utils';
import { Address, isAddress, encodeAbiParameters, parseAbiParameters } from 'viem';
import { ArrowUpRight, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useWaitForTransactionReceipt } from 'wagmi';

export function PaymentForm() {
  const { address } = useAccount();
  const { executePayment, hash: paymentHash, isPending: isPaying, error: paymentError } = useAgentTreasury();
  const { createRule, hash: ruleHash, isPending: isCreatingRule, error: ruleError } = usePaymentRules();
  const { isLoading: isConfirmingPayment } = useWaitForTransactionReceipt({ hash: paymentHash });
  const { isLoading: isConfirmingRule, isSuccess: isRuleConfirmed } = useWaitForTransactionReceipt({ hash: ruleHash });

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState<'direct' | 'conditional'>('direct');
  const [ruleType, setRuleType] = useState<0 | 1 | 2 | 3>(0); // 0=Always
  const [localError, setLocalError] = useState('');

  const handleDirectPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!address) {
      setLocalError('Please connect your wallet');
      return;
    }

    if (!isAddress(recipient)) {
      setLocalError('Invalid recipient address');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setLocalError('Please enter a valid amount');
      return;
    }

    try {
      await executePayment(address as Address, recipient as Address, amount);
    } catch (err: any) {
      setLocalError(err.message || 'Payment failed');
    }
  };

  const handleConditionalPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!address) {
      setLocalError('Please connect your wallet');
      return;
    }

    if (!isAddress(recipient)) {
      setLocalError('Invalid recipient address');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setLocalError('Please enter a valid amount');
      return;
    }

    try {
      // Encode condition data based on rule type
      let conditionData: `0x${string}` = '0x';
      if (ruleType === 0) {
        // Always - empty condition data
        conditionData = '0x';
      } else if (ruleType === 3) {
        // SuccessBased - encode true
        conditionData = encodeAbiParameters([{ type: 'bool' }], [true]);
      } else {
        conditionData = '0x';
      }

      await createRule(address as Address, recipient as Address, amount, ruleType, conditionData);
    } catch (err: any) {
      setLocalError(err.message || 'Failed to create payment rule');
    }
  };

  const handleSubmit = paymentType === 'direct' ? handleDirectPayment : handleConditionalPayment;
  const isPending = paymentType === 'direct' ? isPaying : isCreatingRule;
  const isConfirming = paymentType === 'direct' ? isConfirmingPayment : isConfirmingRule;
  const hash = paymentType === 'direct' ? paymentHash : ruleHash;
  const error = paymentType === 'direct' ? paymentError : ruleError;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="direct"
              checked={paymentType === 'direct'}
              onChange={(e) => setPaymentType(e.target.value as 'direct' | 'conditional')}
              className="text-primary-600"
            />
            <span>Direct Payment</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="conditional"
              checked={paymentType === 'conditional'}
              onChange={(e) => setPaymentType(e.target.value as 'direct' | 'conditional')}
              className="text-primary-600"
            />
            <span>Conditional Payment</span>
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
          Amount (MNEE) *
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

      {paymentType === 'conditional' && (
        <div>
          <label htmlFor="rule-type" className="block text-sm font-medium text-gray-700 mb-1">
            Condition Type
          </label>
          <select
            id="rule-type"
            value={ruleType}
            onChange={(e) => setRuleType(parseInt(e.target.value) as 0 | 1 | 2 | 3)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={isPending || isConfirming}
          >
            <option value={0}>Always Execute</option>
            <option value={3}>Success Based (pay only if success)</option>
          </select>
        </div>
      )}

      {(error?.message || localError) && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error?.message || localError}</span>
        </div>
      )}

      {isRuleConfirmed && paymentType === 'conditional' && (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle className="h-5 w-5" />
          <span>Payment rule created successfully!</span>
        </div>
      )}

      {isConfirmingPayment && paymentType === 'direct' && (
        <div className="text-green-600 text-sm">Payment confirmed!</div>
      )}

      <button
        type="submit"
        disabled={isPending || isConfirming || !address || !recipient || !amount}
        className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {(isPending || isConfirming) && <Loader2 className="h-4 w-4 animate-spin" />}
        {isConfirming
          ? 'Confirming...'
          : isPending
          ? paymentType === 'direct'
            ? 'Executing Payment...'
            : 'Creating Rule...'
          : paymentType === 'direct'
          ? 'Execute Payment'
          : 'Create Payment Rule'}
        <ArrowUpRight className="h-4 w-4" />
      </button>

      {hash && (
        <div className="text-xs text-gray-500">
          Transaction: <span className="font-mono">{hash.slice(0, 10)}...{hash.slice(-8)}</span>
        </div>
      )}
    </form>
  );
}
