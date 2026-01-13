# System Overview

**Audience**: Engineers, architects, technical leads

## Purpose

This document provides a high-level overview of Autonomey's system architecture, components, and data flow.

## Architecture Layers

Autonomey consists of three primary layers:

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Web UI     │  │  Agent API   │  │  Dashboard   │      │
│  │  (Next.js)   │  │  (Future)    │  │  (Analytics) │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
┌─────────┼──────────────────┼──────────────────┼─────────────┐
│         │                  │                  │              │
│    ┌────▼──────────────────▼──────────────────▼─────┐       │
│    │         FRONTEND LAYER (Next.js)                │       │
│    │  ┌──────────────────────────────────────────┐  │       │
│    │  │  Contract Integration (Wagmi/Viem)        │  │       │
│    │  │  - Agent registration                     │  │       │
│    │  │  - Balance queries                       │  │       │
│    │  │  - Payment execution                     │  │       │
│    │  └──────────────────────────────────────────┘  │       │
│    └────┬───────────────────────────────────────┬───┘       │
│         │                                       │            │
┌─────────▼───────────────────────────────────────▼─────────────┐
│                    ON-CHAIN LAYER                           │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  AgentTreasury.sol                                  │   │
│  │  - Agent wallet management                          │   │
│  │  - Balance tracking                                 │   │
│  │  - Spending limits                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  PaymentRules.sol                                   │   │
│  │  - Conditional payment logic                        │   │
│  │  - Rule evaluation                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  EscrowContract.sol                                │   │
│  │  - Milestone escrow                                 │   │
│  │  - Automatic release                                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  StreamingPayments.sol                              │   │
│  │  - Recurring subscriptions                          │   │
│  │  - Payment streams                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  MNEE Contract (0x8ccedbAe...)                      │   │
│  │  - ERC20 stablecoin                                 │   │
│  │  - Transfer & approval                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### On-Chain Layer

#### AgentTreasury

**Purpose**: Manages agent identities, balances, and spending controls.

**Key Responsibilities**:
- Register agent identities with unique addresses
- Manage agent MNEE balances
- Enforce spending limits
- Authorize payment execution from other contracts
- Track agent transaction history

**Key Functions**:
- `registerAgent()` - Register new agent
- `deposit()` - Deposit MNEE to agent treasury
- `executePayment()` - Execute payment from agent balance
- `setSpendingLimit()` - Configure spending limits

#### PaymentRules

**Purpose**: Implements conditional payment logic.

**Key Responsibilities**:
- Encode payment rules and conditions
- Evaluate conditions before payment execution
- Enforce budget constraints
- Execute conditional payments

**Rule Types**:
- `Always` - Execute immediately
- `TimeBased` - Execute at specific time
- `Threshold` - Execute if value exceeds threshold
- `SuccessBased` - Execute only if condition met

#### EscrowContract

**Purpose**: Manages escrow for milestone-based and conditional payments.

**Key Responsibilities**:
- Hold funds in escrow
- Release funds based on conditions (time, milestones, external signals)
- Track escrow status and history

**Escrow Types**:
- Single payment escrow
- Milestone-based escrow

#### StreamingPayments

**Purpose**: Handles recurring and streaming payments.

**Key Responsibilities**:
- Implement payment streaming (continuous payments over time)
- Handle subscription payments (recurring monthly/weekly)
- Automatically deduct payments from agent balances
- Pause/resume streams

### Frontend Layer

#### Next.js Application

**Technology Stack**:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Wagmi v2 (Ethereum hooks)
- RainbowKit (Wallet connection)

**Key Pages**:
- Dashboard - Agent overview and management
- Marketplace - Service discovery (future)
- Agent Management - Registration and configuration

**Key Components**:
- `AgentRegistration` - Register new agents
- `AgentBalance` - View balances and deposit MNEE
- `PaymentForm` - Execute payments
- `EscrowForm` - Create and manage escrows
- `StreamingPayments` - Manage subscriptions

## Data Flow

### Agent Registration Flow

1. User connects wallet via RainbowKit
2. Frontend calls `AgentTreasury.registerAgent()`
3. Transaction sent to blockchain
4. Agent registered on-chain
5. Frontend updates UI with agent info

### Payment Execution Flow

1. User creates payment rule or executes direct payment
2. Frontend validates inputs (amount, recipient, limits)
3. Frontend calls appropriate contract function
4. Contract validates (balance, limits, authorization)
5. Contract executes MNEE transfer
6. Transaction confirmed on-chain
7. Frontend queries updated balance
8. UI updates with new transaction

### Escrow Flow

1. User creates escrow with amount and milestones
2. Frontend calls `EscrowContract.createEscrow()`
3. MNEE transferred to escrow contract
4. Escrow created on-chain
5. As milestones complete, user calls `releaseMilestone()`
6. Contract releases portion of funds
7. Frontend updates escrow status

## Security Model

### Authorization

- **Agent Owners**: Can configure agents, set limits, execute payments
- **Authorized Contracts**: PaymentRules and StreamingPayments can execute payments
- **Multi-signature**: Future enhancement for large transactions

### Spending Controls

- **Daily Limits**: Maximum spend per day per agent
- **Balance Checks**: Cannot spend more than available balance
- **Owner Override**: Agent owners can override limits (with time lock in future)

### On-Chain Verification

- All transactions on-chain and transparent
- Smart contracts enforce all rules
- No off-chain trust required

## Integration Points

### MNEE Contract

All financial operations use MNEE programmable stablecoins:
- Contract address: `0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF`
- Standard ERC20 interface
- Transfers and approvals

### Wallet Integration

- MetaMask
- WalletConnect
- Any EIP-1193 compatible wallet

### Blockchain Networks

- **Sepolia Testnet**: Development and testing (Chain ID: 11155111)
- **Ethereum Mainnet**: Production (Chain ID: 1)
- **Hardhat Local**: Local development (Chain ID: 1337)

## Scalability Considerations

### Current Architecture

- Direct contract interactions from frontend
- No backend required for MVP
- All state on-chain

### Future Enhancements

- Event indexing service for faster queries
- Backend API for complex operations
- Caching layer for balance queries
- Transaction batching for efficiency

## Technology Decisions

### Why Next.js?

- Server-side rendering for better UX
- Built-in routing and API routes
- Excellent TypeScript support
- Easy deployment (Vercel)

### Why Wagmi?

- Type-safe Ethereum interactions
- React hooks for contract calls
- Excellent wallet integration
- Active maintenance

### Why Direct Contract Calls?

- Simpler architecture for MVP
- No backend required
- Direct on-chain verification
- Lower operational complexity

---

**Related Documentation**:
- [Smart Contracts](smart-contracts.md)
- [Frontend Architecture](frontend-architecture.md)
- [MNEE Integration](mnee-integration.md)
- [Data Flow](data-flow.md)
