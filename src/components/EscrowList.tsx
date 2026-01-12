'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useEscrow } from '@/hooks/useContracts';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import { ESCROW_CONTRACT_ABI } from '@/lib/abi';
import { formatMNEE, formatAddress } from '@/lib/utils';
import { Address } from 'viem';
import { useWaitForTransactionReceipt } from 'wagmi';
import { Lock, CheckCircle, XCircle, Clock, Loader2, RefreshCw, Info } from 'lucide-react';
import Link from 'next/link';

// Simplified EscrowList - full implementation would fetch all escrows
// For MVP, we show a message and link to create escrows
export function EscrowList() {
  const { address, isConnected } = useAccount();
  const { releaseEscrow, releaseMilestone, cancelEscrow, hash, isPending, error } = useEscrow();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  if (!isConnected) {
    return (
      <div className="text-center text-gray-500 py-8">
        <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p>Connect wallet to view escrows</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Your Escrows</h3>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-medium text-blue-900 mb-1">Escrow Management</h4>
            <p className="text-sm text-blue-800 mb-3">
              Create milestone-based or single payment escrows. Funds are held securely until you release them.
            </p>
            <p className="text-sm text-blue-700">
              <strong>Use EscrowForm component</strong> to create new escrows. This list will display your active escrows.
            </p>
            <p className="text-xs text-blue-600 mt-2">
              Full escrow list fetching requires contract indexing. For MVP, create escrows and release them manually.
            </p>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600 space-y-2">
        <p className="font-medium">Escrow Features:</p>
        <ul className="list-disc list-inside space-y-1 text-xs text-gray-500 ml-2">
          <li>Single payment escrow - release all at once</li>
          <li>Milestone escrow - release in stages</li>
          <li>Cancel escrow to get refund</li>
          <li>All escrows use MNEE stablecoin</li>
        </ul>
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
          {error.message}
        </div>
      )}
    </div>
  );
}
