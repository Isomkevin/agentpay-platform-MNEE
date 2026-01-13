# Smart Contracts Architecture

**Audience**: Smart contract developers, auditors, engineers

## Purpose

This document describes the on-chain smart contract architecture, contract interactions, and security model.

## Contract Overview

Autonomey consists of four core smart contracts:

1. **AgentTreasury** - Agent registration and balance management
2. **PaymentRules** - Conditional payment execution
3. **EscrowContract** - Escrow and milestone payments
4. **StreamingPayments** - Recurring and streaming payments

All contracts interact with the MNEE contract at `0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF`.

## AgentTreasury

**File**: `contracts/AgentTreasury.sol`

### Purpose

Central contract managing agent identities, balances, and spending controls.

### Key Data Structures

```solidity
struct Agent {
    address wallet;
    string name;
    string description;
    bool isActive;
    uint256 createdAt;
    uint256 dailySpendLimit;
    uint256 dailySpent;
    uint256 lastReset;
    address owner;
}
```

### Key Functions

- `registerAgent(address wallet, string name, string description)` - Register new agent
- `depositToAgent(address agentId, uint256 amount)` - Deposit MNEE to agent treasury
- `executePayment(address agentId, address recipient, uint256 amount)` - Execute payment
- `setSpendingLimit(address agentId, uint256 limit)` - Set daily spending limit
- `authorizeContract(address contractAddress, bool authorized)` - Authorize contracts

### Authorization Model

- **Agent Owners**: Can configure their agents and execute payments
- **Authorized Contracts**: PaymentRules and StreamingPayments can execute payments
- **Modifiers**: `onlyAgentOwner`, `onlyActiveAgent`, `onlyAuthorized`

### Security Features

- Daily spending limits with automatic reset
- Balance checks before payments
- Authorization checks for all operations
- Owner override capability

## PaymentRules

**File**: `contracts/PaymentRules.sol`

### Purpose

Implements conditional payment logic with programmable rules.

### Key Data Structures

```solidity
enum RuleType {
    Always,           // Always execute
    TimeBased,        // Execute at specific time
    Threshold,        // Execute if value > threshold
    SuccessBased      // Execute only if condition met
}

struct PaymentRule {
    uint256 id;
    address agentId;
    address recipient;
    uint256 amount;
    RuleType ruleType;
    bool isActive;
    uint256 createdAt;
    uint256 executedAt;
    bytes conditionData;
}
```

### Key Functions

- `createRule(address agentId, address recipient, uint256 amount, RuleType ruleType, bytes conditionData)` - Create payment rule
- `executeRule(uint256 ruleId, bytes conditionProof)` - Execute rule if conditions met
- `deactivateRule(uint256 ruleId)` - Deactivate rule

### Integration

- Requires AgentTreasury address in constructor
- Must be authorized in AgentTreasury to execute payments
- Calls `AgentTreasury.executePayment()` after condition evaluation

## EscrowContract

**File**: `contracts/EscrowContract.sol`

### Purpose

Manages escrow for milestone-based and conditional payments.

### Key Data Structures

```solidity
enum EscrowStatus { Pending, Completed, Cancelled, Disputed }
enum EscrowType { Single, Milestone }

struct Escrow {
    uint256 id;
    address payer;
    address payee;
    uint256 totalAmount;
    uint256 releasedAmount;
    string description;
    EscrowStatus status;
    EscrowType escrowType;
    uint256 createdAt;
    uint256 completedAt;
    bool autoRelease;
    uint256 releaseTime;
    uint256 milestoneCount;
    uint256 amountPerMilestone;
    uint256 completedMilestones;
}
```

### Key Functions

- `createEscrow(address payee, uint256 amount, string description, bool autoRelease, uint256 releaseTime)` - Single escrow
- `createMilestoneEscrow(address payee, uint256 amount, uint256 milestoneCount, string description)` - Milestone escrow
- `releaseEscrow(uint256 escrowId)` - Release single escrow
- `releaseMilestone(uint256 escrowId)` - Release milestone
- `cancelEscrow(uint256 escrowId)` - Cancel escrow

### Security

- Only payer can cancel
- Only payer can release (future: add payee release option)
- Funds held in contract until release

## StreamingPayments

**File**: `contracts/StreamingPayments.sol`

### Purpose

Handles recurring subscriptions and linear payment streams.

### Key Data Structures

```solidity
struct Subscription {
    uint256 id;
    address agentId;
    address recipient;
    uint256 amount;
    uint256 period; // Period in seconds
    uint256 lastPayment;
    uint256 nextPayment;
    bool isActive;
}

struct Stream {
    uint256 id;
    address agentId;
    address recipient;
    uint256 totalAmount;
    uint256 duration; // Duration in seconds
    uint256 startTime;
    uint256 lastWithdrawal;
    bool isActive;
}
```

### Key Functions

- `createSubscription(address agentId, address recipient, uint256 amount, uint256 period)` - Create subscription
- `createStream(address agentId, address recipient, uint256 totalAmount, uint256 duration)` - Create stream
- `processPayment(uint256 subscriptionId)` - Process subscription payment
- `withdrawFromStream(uint256 streamId, uint256 amount)` - Withdraw from stream
- `cancelSubscription(uint256 subscriptionId)` - Cancel subscription

### Integration

- Requires AgentTreasury address in constructor
- Must be authorized in AgentTreasury to execute payments
- Calls `AgentTreasury.executePayment()` for payments

## Contract Interactions

### Deployment Order

1. Deploy AgentTreasury
2. Deploy PaymentRules (with Treasury address)
3. Deploy StreamingPayments (with Treasury address)
4. Deploy EscrowContract (independent)
5. Authorize PaymentRules and StreamingPayments in AgentTreasury

### Authorization Flow

```
User → AgentTreasury.authorizeContract(PaymentRules, true)
     → PaymentRules can now call AgentTreasury.executePayment()
```

### Payment Execution Flow

```
PaymentRules.executeRule()
  → Evaluates condition
  → Calls AgentTreasury.executePayment()
     → Checks balance and limits
     → Transfers MNEE via IMNEE contract
     → Emits events
```

## Security Considerations

### Access Control

- Owner-only functions use `onlyAgentOwner` modifier
- Contract authorization required for automated payments
- Active agent check prevents operations on inactive agents

### Spending Limits

- Daily limits reset automatically
- Balance checks prevent over-spending
- Limits enforced at contract level

### Reentrancy Protection

- No external calls before state updates
- Standard checks-effects-interactions pattern
- Future: Consider OpenZeppelin ReentrancyGuard

### Input Validation

- Address zero checks
- Amount > 0 checks
- Balance sufficiency checks
- Limit enforcement

## Events

All contracts emit events for:
- Agent registration
- Deposits and payments
- Rule creation and execution
- Escrow creation and release
- Subscription creation and processing

Events enable off-chain indexing and monitoring.

## Upgradeability

**Current**: Contracts are not upgradeable (immutable for security)

**Future Considerations**:
- Proxy pattern for upgradeability
- Timelock for critical changes
- Multi-sig for admin functions

## Gas Optimization

- Packed structs where possible
- Events instead of storage for historical data
- Batch operations where applicable
- Minimal external calls

---

**Related Documentation**:
- [System Overview](system-overview.md)
- [MNEE Integration](mnee-integration.md)
- [Deployment Guide](../deployment/deployment-guide.md)
