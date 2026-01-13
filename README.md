# Autonomey

## Autonomous Treasury Management for AI Agents

Autonomey enables AI agents to autonomously manage finances, execute payments, and operate as independent economic entities using MNEE programmable stablecoins.

## Overview

Autonomey solves a critical problem: AI agents can perform complex tasks but are financially paralyzed. Every payment requires human approval, preventing true autonomy. Autonomey gives AI agents their own "bank account" using MNEE programmable stablecoins, enabling autonomous financial operations.

### Key Features

- **Agent Treasury Management** - Each agent has a dedicated MNEE wallet

- **Autonomous Payment Execution** - Payments execute based on rules, no human approval needed

- **Conditional Payments** - Pay only if conditions are met

- **Payment Streaming** - Recurring subscriptions and continuous payments

- **Escrow Management** - Milestone-based payments with programmatic release

- **Budget Enforcement** - Autonomous spending within limits

## Why MNEE?

This product cannot exist without MNEE programmable stablecoins. MNEE provides:

- **Stable value** (USD-backed) for predictable agent economics
- **Programmability** - smart contract integration for conditional logic
- **Automation** - on-chain rules execute without human intervention

**MNEE Contract**: `0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF`

## Architecture

```text
Application Layer (Next.js Frontend)
    ↓
On-Chain Layer (Smart Contracts)
    ├── AgentTreasury.sol
    ├── PaymentRules.sol
    ├── EscrowContract.sol
    └── StreamingPayments.sol
    ↓
MNEE Contract (0x8ccedbAe...)
```

For complete architecture details, see [System Overview](docs/architecture/system-overview.md).

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or compatible Web3 wallet
- Ethereum RPC URL (Alchemy/Infura)
- MNEE tokens for testing

### Installation

```bash
# Clone repository
git clone <repository-url>
cd MNEE_Hackathon

# Install dependencies
npm install --legacy-peer-deps

# Compile contracts
npm run compile

# Generate environment template
npm run generate:env

# Copy and configure environment
cp .env.template .env
# Edit .env with your API keys and configuration

# Deploy contracts (testnet)
npm run deploy:sepolia

# Update .env with deployed addresses from deployed-addresses.json

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

**For detailed instructions, see [Quick Start Guide](docs/deployment/quick-start.md).**

## Documentation

Complete documentation is available in the [`docs/`](docs/) directory:

- **[Documentation Index](docs/README.md)** - Start here for all documentation
- **[Product Overview](docs/overview/product-vision.md)** - What Autonomey is and why it exists
- **[Architecture](docs/architecture/system-overview.md)** - System design and components
- **[Deployment Guide](docs/deployment/deployment-guide.md)** - Complete deployment instructions
- **[Testing Guide](docs/testing/testing-guide.md)** - How to test the platform
- **[Reference](docs/reference/glossary.md)** - Glossary and FAQ

## Tech Stack

- **Smart Contracts**: Solidity ^0.8.20, Hardhat, OpenZeppelin
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Wagmi, RainbowKit
- **Blockchain**: Ethereum, MNEE Stablecoin
- **Wallet**: MetaMask, WalletConnect

## Project Structure

```text
autonomey/
├── contracts/              # Smart contracts
│   ├── AgentTreasury.sol
│   ├── PaymentRules.sol
│   ├── EscrowContract.sol
│   └── StreamingPayments.sol
├── scripts/               # Deployment scripts
│   ├── deploy.js
│   └── verify-deployment.js
├── src/                   # Next.js application
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   ├── hooks/            # React hooks
│   └── lib/              # Utilities and config
├── docs/                  # Documentation
└── README.md
```

## Security

All transactions are on-chain, transparent, and verifiable. Smart contracts enforce spending limits and authorization rules. For production use, consider professional security audits.

## Contributing

Contributions are welcome! See [Contribution Guide](docs/contributing/contribution-guide.md) for details.

## License

MIT License - Open Source

## Links

- **Documentation**: [docs/README.md](docs/README.md)
- **MNEE Contract**: [Etherscan](https://etherscan.io/address/0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF)

## Built With

Built with ❤️ using MNEE Programmable Stablecoins.

For complete product documentation, see [Documentation Index](docs/README.md).
