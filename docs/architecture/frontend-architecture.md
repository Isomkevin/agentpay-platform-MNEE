# Frontend Architecture

**Audience**: Frontend developers

## Purpose

Overview of the frontend application structure and architecture.

## Technology Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Wagmi v2** - Ethereum React hooks
- **RainbowKit** - Wallet connection UI
- **Viem** - TypeScript Ethereum library

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard page
│   ├── marketplace/       # Marketplace page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── providers.tsx      # Wallet providers
├── components/            # React components
│   ├── AgentBalance.tsx
│   ├── AgentRegistration.tsx
│   ├── EscrowForm.tsx
│   ├── EscrowList.tsx
│   ├── PaymentForm.tsx
│   ├── ServiceList.tsx
│   └── StreamingPayments.tsx
├── hooks/                 # Custom React hooks
│   └── useContracts.ts    # Contract interaction hooks
└── lib/                   # Utilities
    ├── abi.ts             # Contract ABIs
    ├── contracts.ts       # Contract configuration
    └── utils.ts           # Utility functions
```

## Key Components

### AgentRegistration

Registers new agents with the AgentTreasury contract.

**Key Features:**
- Form validation
- Wallet connection
- Transaction handling
- Success/error feedback

### AgentBalance

Displays agent balance and handles MNEE deposits.

**Key Features:**
- Balance queries
- Deposit functionality
- Approval handling
- Real-time updates

### PaymentForm

Executes direct and conditional payments.

**Key Features:**
- Payment type selection
- Recipient and amount input
- Rule creation
- Transaction execution

### EscrowForm

Creates and manages escrows.

**Key Features:**
- Escrow type selection
- Milestone configuration
- Escrow creation
- Approval handling

### StreamingPayments

Manages subscriptions and payment streams.

**Key Features:**
- Subscription creation
- Stream creation
- Payment processing
- Cancellation

## Contract Integration

### Wagmi Hooks

Uses Wagmi for contract interactions:

```typescript
import { useContractWrite, useContractRead } from 'wagmi'

// Read contract data
const { data: balance } = useContractRead({
  address: AGENT_TREASURY_ADDRESS,
  abi: AgentTreasuryABI,
  functionName: 'agentBalances',
  args: [agentId]
})

// Write to contract
const { write: registerAgent } = useContractWrite({
  address: AGENT_TREASURY_ADDRESS,
  abi: AgentTreasuryABI,
  functionName: 'registerAgent'
})
```

### Custom Hooks

`useContracts.ts` provides higher-level hooks:

- `useAgentBalance()` - Get agent balance
- `useRegisterAgent()` - Register agent
- `useDeposit()` - Deposit MNEE
- `useExecutePayment()` - Execute payment

## State Management

- **React Query** - Server state and caching
- **Wagmi** - Blockchain state
- **Local State** - Component-level state with useState

## Wallet Integration

### RainbowKit

Handles wallet connection UI:

- MetaMask
- WalletConnect
- Coinbase Wallet
- Other EIP-1193 wallets

### Network Configuration

Configured in `app/providers.tsx`:

- Sepolia Testnet (Chain ID: 11155111)
- Ethereum Mainnet (Chain ID: 1)
- Hardhat Local (Chain ID: 1337)

## Error Handling

- Transaction errors displayed to users
- Network errors handled gracefully
- Loading states for async operations
- Success/error feedback

## Performance

- Code splitting via Next.js
- Lazy loading for heavy components
- Optimistic UI updates
- Caching with React Query

## Security

- No sensitive data in client code
- Environment variables properly scoped
- Wallet connection secure
- Transaction signing via wallet

---

**Related Documentation**:
- [System Overview](system-overview.md)
- [Smart Contracts](smart-contracts.md)
- [Deployment Guide](../deployment/deployment-guide.md)
