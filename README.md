# Autonomey (formerly AutoPay) - AI Agent Autonomous Treasury Platform

🏆 **MNEE Hackathon Submission** - Programmable Money for Agents, Commerce, and Automated Finance

---

## 🚀 Overview

**Autonomey** (Autonomous Money) is the first platform that enables AI agents to autonomously manage finances, execute payments, and operate as independent economic entities using MNEE programmable stablecoins.

### One-Sentence Value Proposition

Autonomey gives AI agents their own "bank account" - enabling them to autonomously receive revenue, pay for services, execute conditional payments, and manage finances using MNEE programmable stablecoins.

### Why This Matters

AI agents can perform complex tasks but are financially paralyzed. Every payment requires human approval, preventing true autonomy. Autonomey solves this by leveraging MNEE's programmable money capabilities to enable autonomous agent economies.

**This product cannot exist without MNEE programmable stablecoins.**

---

## 🎯 The Problem

- **AI agents cannot autonomously manage money** - Every transaction requires human approval
- **Web2 payments** require human bank accounts and manual approval
- **Traditional crypto** (ETH, USDC) lacks programmability for conditional/automated flows
- **Agent economies** cannot scale without financial autonomy

## ✨ The Solution

Autonomey enables AI agents to:

- ✅ **Receive revenue autonomously** - Payments go directly to agent treasuries
- ✅ **Execute payments based on rules** - No human approval required
- ✅ **Conditional payments** - Pay only if conditions are met
- ✅ **Payment streaming** - Recurring subscriptions and continuous payments
- ✅ **Escrow management** - Milestone-based payments with programmatic release
- ✅ **Budget enforcement** - Autonomous spending within limits

---

## 💸 MNEE Integration

Autonomey uses **MNEE programmable stablecoins** for all agent financial operations:

- **Contract Address**: `0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF`
- **Capabilities Demonstrated**:
  1. Automated payouts
  2. Conditional payments
  3. Streaming/recurring payments
  4. Escrow with programmatic release
  5. Agent-initiated transactions
  6. Treasury automation

**Why MNEE (Not ETH/USDC/Web2):**
- **vs. ETH**: Stable value for predictable economics (ETH is volatile)
- **vs. USDC**: Programmability enables autonomous execution (USDC lacks programmability)
- **vs. Web2**: True autonomy without human bank accounts (Web2 requires human identity)

---

## 🏗️ Architecture

```
Application Layer (Next.js Frontend)
    ↓
Backend Layer (Node.js API)
    ↓
On-Chain Layer (Smart Contracts)
    ├── AgentTreasury.sol
    ├── PaymentRules.sol
    ├── EscrowManager.sol
    └── StreamingPayments.sol
    ↓
MNEE Contract (0x8ccedbAe...)
```

For complete architecture details, see [PRODUCT_BLUEPRINT.md](./PRODUCT_BLUEPRINT.md).

---

## 🎬 Demo

**5-Minute Demo Flow:**

1. **Problem** (30s) - Why agents need financial autonomy
2. **Setup** (1m) - Create agent, deposit MNEE, set rules
3. **Autonomous Actions** (2.5m):
   - Recurring payment (API subscription)
   - Conditional payment (pay only if success)
   - Escrow payment (milestone-based)
   - Revenue receipt
4. **Results** (1m) - Dashboard showing all transactions
5. **Why This Wins** (30s) - Only possible with MNEE

**Live Demo**: [Link to deployed application]  
**Demo Video**: [Link to video]

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or compatible Web3 wallet
- Ethereum RPC URL (Alchemy/Infura)
- MNEE tokens for testing

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/autonomey
cd autonomey

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Compile contracts
cd contracts
npm install
npx hardhat compile

# Deploy contracts (testnet)
npx hardhat run scripts/deploy.ts --network sepolia

# Start backend
cd ../backend
npm install
npm run dev

# Start frontend (new terminal)
cd ../frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Environment Variables

```env
# Blockchain
MNEE_CONTRACT=0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF
CHAIN_ID=1
RPC_URL=your_ethereum_rpc_url
ETHERSCAN_API_KEY=your_etherscan_key

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/autonomey

# API
PORT=3001
JWT_SECRET=your_jwt_secret
```

---

## 📁 Project Structure

```
autonomey/
├── contracts/              # Smart contracts
│   ├── AgentTreasury.sol
│   ├── PaymentRules.sol
│   ├── EscrowManager.sol
│   └── StreamingPayments.sol
├── backend/               # Backend API
│   ├── src/
│   │   ├── services/
│   │   ├── api/
│   │   └── models/
│   └── prisma/
├── frontend/              # Next.js application
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── hooks/
├── scripts/               # Deployment scripts
├── PRODUCT_BLUEPRINT.md  # Complete product blueprint
└── README.md
```

---

## 🛠️ Tech Stack

- **Smart Contracts**: Solidity, Hardhat, OpenZeppelin
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Wagmi, RainbowKit
- **Backend**: Node.js, Express, PostgreSQL, Prisma
- **Blockchain**: Ethereum, MNEE Stablecoin
- **Wallet**: MetaMask, WalletConnect

---

## 📄 Documentation

- **[PRODUCT_BLUEPRINT.md](./PRODUCT_BLUEPRINT.md)** - Complete product blueprint including:
  - Problem & Insight
  - Solution & Value
  - Architecture Details
  - MNEE Integration
  - AI & Automation Logic
  - Demo Flow
  - Implementation Plan
  - Devpost Submission Content
  - Why This Wins

---

## 🏆 Why This Wins

### Innovation
- First platform for AI agent financial autonomy
- Novel use case for programmable stablecoins
- Solves real problem in emerging agent economy

### Technical Excellence
- Production-quality smart contracts
- Comprehensive MNEE integration
- Real on-chain transactions
- Full-stack implementation

### Market Relevance
- Addresses $100B+ agent economy
- Clear path to product-market fit
- Infrastructure-level solution
- Scalable to millions of agents

### MNEE Utilization
- Demonstrates 6+ MNEE capabilities
- Shows why MNEE is essential
- Real programmable money behavior
- Comprehensive integration

---

## 📋 Features

### Core Features

- ✅ Agent Treasury Management
- ✅ Autonomous Payment Execution
- ✅ Conditional Payments
- ✅ Payment Streaming & Subscriptions
- ✅ Escrow Management
- ✅ Spending Controls & Budgets
- ✅ Dashboard & Analytics

See [PRODUCT_BLUEPRINT.md](./PRODUCT_BLUEPRINT.md) for complete feature list.

---

## 🔮 Future Roadmap

- **Phase 1**: Enhanced automation, multi-sig, advanced analytics
- **Phase 2**: Agent marketplace, reputation system
- **Phase 3**: DeFi integration, yield optimization
- **Phase 4**: Enterprise features, white-label solutions

---

## 📝 License

MIT License - Open Source

---

## 👥 Team

Built for **MNEE Hackathon 2026**

---

## 🔗 Links

- **Live Demo**: [Link]
- **Demo Video**: [Link]
- **Devpost Submission**: [Link]
- **GitHub**: [Link]

---

**Built with ❤️ using MNEE Programmable Stablecoins**

For complete product documentation, see [PRODUCT_BLUEPRINT.md](./PRODUCT_BLUEPRINT.md).
