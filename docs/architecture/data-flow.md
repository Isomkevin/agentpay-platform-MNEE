# Data Flow

**Audience**: Engineers understanding system data flow

## Purpose

How data moves through the Autonomey system.

## Agent Registration Flow

```
User → Frontend → Wallet → Blockchain
  ↓
1. User fills registration form
2. Frontend calls AgentTreasury.registerAgent()
3. Wallet prompts for signature
4. Transaction sent to blockchain
5. Agent registered on-chain
6. Frontend queries updated state
7. UI updates with agent info
```

## Deposit Flow

```
User → Frontend → Wallet → Blockchain
  ↓
1. User enters deposit amount
2. Frontend checks MNEE approval
3. If not approved, user approves via wallet
4. Frontend calls AgentTreasury.depositToAgent()
5. Wallet prompts for signature
6. Transaction sent to blockchain
7. MNEE transferred to contract
8. Agent balance updated on-chain
9. Frontend queries updated balance
10. UI updates with new balance
```

## Payment Execution Flow

```
User → Frontend → Wallet → Blockchain
  ↓
1. User creates payment (direct or rule)
2. Frontend validates inputs (amount, recipient, limits)
3. Frontend calls appropriate contract function
   - Direct: AgentTreasury.executePayment()
   - Rule: PaymentRules.createRule() then executeRule()
4. Contract validates:
   - Balance sufficient
   - Limits not exceeded
   - Authorization valid
5. Contract executes MNEE transfer
6. Transaction confirmed on-chain
7. Frontend queries updated balance
8. UI updates with new transaction
```

## Escrow Flow

```
User → Frontend → Wallet → Blockchain
  ↓
1. User creates escrow with amount and milestones
2. Frontend checks MNEE approval for EscrowContract
3. If not approved, user approves via wallet
4. Frontend calls EscrowContract.createEscrow() or createMilestoneEscrow()
5. Wallet prompts for signature
6. Transaction sent to blockchain
7. MNEE transferred to escrow contract
8. Escrow created on-chain
9. As milestones complete:
   - User calls releaseMilestone()
   - Contract releases portion of funds
   - Frontend updates escrow status
10. UI updates with escrow information
```

## Subscription Flow

```
User → Frontend → Wallet → Blockchain
  ↓
1. User creates subscription with amount and period
2. Frontend calls StreamingPayments.createSubscription()
3. Wallet prompts for signature
4. Transaction sent to blockchain
5. Subscription created on-chain
6. Periodically (or on-demand):
   - Frontend or backend calls processPayment()
   - Contract checks agent balance
   - Contract executes MNEE transfer
   - Subscription payment processed
7. Frontend queries updated balance
8. UI updates with subscription status
```

## Balance Query Flow

```
Frontend → Blockchain
  ↓
1. Frontend calls AgentTreasury.agentBalances(agentId)
2. Contract returns on-chain balance
3. Frontend displays balance
4. Updates on transaction confirmation
```

## Event Listening (Future)

```
Blockchain → Event Listener → Frontend
  ↓
1. Event listener monitors blockchain events
2. Events indexed for fast queries
3. Frontend queries indexed events
4. UI updates in real-time
```

## State Synchronization

### On-Chain State

- Agent registrations
- Balances
- Payment rules
- Escrows
- Subscriptions

### Frontend State

- Cached balances (via React Query)
- Transaction status
- UI state

### Synchronization

- Queries on component mount
- Updates on transaction confirmation
- Polling for real-time updates (future)
- Event-based updates (future)

---

**Related Documentation**:
- [System Overview](system-overview.md)
- [Frontend Architecture](frontend-architecture.md)
- [Smart Contracts](smart-contracts.md)
