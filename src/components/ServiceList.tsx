'use client';

import { useAccount } from 'wagmi';
import { ShoppingCart, Info } from 'lucide-react';

export function ServiceList() {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="text-center text-gray-500 py-8">
        <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p>Connect wallet to view services</p>
      </div>
    );
  }

  // Simplified service list - full marketplace would require ServiceMarketplace contract
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Services</h3>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-medium text-blue-900 mb-1">Service Marketplace</h4>
            <p className="text-sm text-blue-800">
              The full service marketplace is planned for future releases. For this MVP, you can use
              the payment forms to send MNEE to any address.
            </p>
            <p className="text-sm text-blue-700 mt-2">
              Future features: Browse services, rate providers, automated settlements
            </p>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600 space-y-2">
        <p>To make payments:</p>
        <ul className="list-disc list-inside space-y-1 text-xs text-gray-500 ml-2">
          <li>Use the Payment Form for direct payments</li>
          <li>Create conditional payment rules</li>
          <li>Set up streaming payments for subscriptions</li>
          <li>Use escrow for milestone-based payments</li>
        </ul>
      </div>
    </div>
  );
}
