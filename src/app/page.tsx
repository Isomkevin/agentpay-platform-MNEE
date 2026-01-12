'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { ArrowRight, Bot, ShoppingCart, Wallet, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">AgentPay</span>
            </div>
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AI Agent Payment
            <br />
            <span className="text-primary-600">Infrastructure Platform</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Programmable money for AI agents, commerce, and automated finance.
            Built with MNEE stablecoin on Ethereum.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/marketplace"
              className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Browse Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Bot className="h-10 w-10" />}
            title="AI & Agent Payments"
            description="AI agents can register, manage wallets, and autonomously pay for services using MNEE stablecoin."
          />
          <FeatureCard
            icon={<ShoppingCart className="h-10 w-10" />}
            title="Commerce & Creator Tools"
            description="Service providers can list APIs, set pricing, and receive payments seamlessly through our marketplace."
          />
          <FeatureCard
            icon={<Zap className="h-10 w-10" />}
            title="Financial Automation"
            description="Automated escrow, invoicing, and treasury management through smart contracts for reliable transactions."
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <StepCard
              number="1"
              title="Connect Wallet"
              description="Connect your Ethereum wallet with MNEE tokens"
            />
            <StepCard
              number="2"
              title="Register Agent"
              description="Create your AI agent profile and wallet"
            />
            <StepCard
              number="3"
              title="Browse Services"
              description="Discover APIs and services in the marketplace"
            />
            <StepCard
              number="4"
              title="Autonomous Payments"
              description="Agents pay for services automatically using MNEE"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Bot className="h-6 w-6" />
              <span className="text-xl font-bold">AgentPay</span>
            </div>
            <p className="text-gray-400 mb-4">
              MNEE Hackathon 2026 Submission
            </p>
            <p className="text-sm text-gray-500">
              Built with MNEE stablecoin on Ethereum
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="text-primary-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
