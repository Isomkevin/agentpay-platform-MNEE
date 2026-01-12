# AgentPay - AI Agent Payment Infrastructure Platform

🏆 **MNEE Hackathon Submission** - Programmable Money for Agents, Commerce, and Automated Finance

## Overview

AgentPay is a comprehensive platform that enables AI agents to autonomously transact, pay for services, and manage finances using MNEE stablecoin. The platform combines three core functionalities:

1. **AI & Agent Payments** - AI agents can register, manage wallets, and autonomously pay for services
2. **Commerce & Creator Tools** - Service providers can list APIs/services, set pricing, and receive payments
3. **Financial Automation** - Automated escrow, invoicing, and treasury management through smart contracts

## Features

### 🤖 AI Agent Management
- Agent registration with unique wallet addresses
- Autonomous transaction capabilities
- Payment history and balance tracking
- Service discovery and purchase

### 💼 Service Marketplace
- Service providers can list APIs, data services, and tools
- Dynamic pricing in MNEE stablecoin
- Automated payment processing
- Service rating and reviews

### 🔐 Financial Automation
- Smart contract-based escrow system
- Automated invoicing and settlements
- Treasury management for agents
- Transparent transaction history on-chain

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Blockchain**: Ethereum, Solidity, Hardhat
- **Web3**: Ethers.js, Wagmi, RainbowKit
- **Smart Contracts**: Custom escrow and payment contracts
- **MNEE Integration**: Contract address `0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF`

## Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- MetaMask or compatible Web3 wallet
- MNEE tokens for testing (on Ethereum network)

### Installation

```bash
# Install dependencies
npm install

# Compile smart contracts
npm run compile

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Environment Setup

Create a `.env.local` file:

```env
NEXT_PUBLIC_MNEE_CONTRACT=0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF
NEXT_PUBLIC_CHAIN_ID=1
NEXT_PUBLIC_RPC_URL=your_ethereum_rpc_url
```

## Project Structure

```
agentpay-platform/
├── contracts/          # Solidity smart contracts
├── frontend/           # Next.js application
├── public/             # Static assets
├── scripts/            # Deployment scripts
└── README.md
```

## Smart Contracts

- **AgentRegistry.sol** - Manages agent registration and wallets
- **ServiceMarketplace.sol** - Service listing and payment processing
- **EscrowContract.sol** - Automated escrow and settlement

## Demo Video

[Link to demo video - 5 minutes showcasing all features]

## Live Demo

[Link to deployed application]

## License

MIT License - Open Source

## Team

Built for MNEE Hackathon 2026
