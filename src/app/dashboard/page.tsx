'use client';

import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { Bot, Wallet, ShoppingCart, FileText, ArrowLeft, Send, Lock, Repeat } from 'lucide-react';
import { AgentRegistration } from '@/components/AgentRegistration';
import { AgentBalance } from '@/components/AgentBalance';
import { PaymentForm } from '@/components/PaymentForm';
import { ServiceList } from '@/components/ServiceList';
import { EscrowList } from '@/components/EscrowList';
import { EscrowForm } from '@/components/EscrowForm';
import { StreamingPayments } from '@/components/StreamingPayments';

export default function Dashboard() {
  const { isConnected, address } = useAccount();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Connect Your Wallet
            </h1>
            <p className="text-gray-600 mb-8">
              Please connect your Ethereum wallet to access the dashboard
            </p>
            <ConnectButton />
            <div className="mt-8">
              <Link
                href="/"
                className="text-primary-600 hover:text-primary-700 inline-flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Autonomey</span>
            </Link>
            <div className="flex items-center gap-4">
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            icon={<Bot className="h-6 w-6" />}
            title="Agent Management"
            description="Register and manage your AI agents"
          />
          <DashboardCard
            icon={<Wallet className="h-6 w-6" />}
            title="Balance & Payments"
            description="View balances and transaction history"
          />
          <DashboardCard
            icon={<ShoppingCart className="h-6 w-6" />}
            title="Service Marketplace"
            description="Browse and purchase services"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Agent Registration
            </h2>
            <AgentRegistration />
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Agent Balance
            </h2>
            <AgentBalance />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Send className="h-5 w-5 text-primary-600" />
              Execute Payment
            </h2>
            <PaymentForm />
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary-600" />
              Create Escrow
            </h2>
            <EscrowForm />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Streaming Payments
            </h2>
            <StreamingPayments />
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Escrow Transactions
            </h2>
            <EscrowList />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Services
          </h2>
          <ServiceList />
        </div>
      </div>
    </div>
  );
}

function DashboardCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="text-primary-600 mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
