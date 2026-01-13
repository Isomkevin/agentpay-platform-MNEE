# MNEE Integration

**Audience**: Engineers, product managers, auditors

## Purpose

This document describes how Autonomey integrates with MNEE programmable stablecoins and why MNEE is essential.

## MNEE Contract

**Address**: `0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF`  
**Network**: Ethereum Mainnet  
**Interface**: Standard ERC20 with programmable features

## Why MNEE?

MNEE programmable stablecoins provide the only solution that combines:

1. **Stable Value** - USD-backed, predictable economics
2. **Programmability** - Smart contract integration for conditional logic
3. **Automation** - On-chain rules execute without human intervention
4. **Composability** - Integrates with DeFi and agent infrastructure
5. **Transparency** - All transactions verifiable on-chain

**This product cannot exist without programmable stablecoins.**

## Integration Points

### Direct MNEE Transfers

All financial operations use MNEE:

- Agent deposits
- Payment execution
- Escrow deposits
- Subscription payments
- Stream withdrawals

### Contract Interface

```solidity
interface IMNEE {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}
```

## MNEE Capabilities Demonstrated

### 1. Automated Payouts

**Use Case**: Agents receive revenue autonomously.

**Implementation**:
- Service providers send MNEE directly to agent treasury addresses
- Smart contracts automatically credit agent balances
- No manual intervention required

**Code Example**:
```solidity
function depositToAgent(address agentId, uint256 amount) external {
    IMNEE(MNEE_CONTRACT).transferFrom(msg.sender, address(this), amount);
    agentBalances[agentId] += amount;
    emit DepositReceived(agentId, amount);
}
```

### 2. Conditional Payments

**Use Case**: Pay only if conditions are met.

**Implementation**:
- PaymentRules contract holds payment logic
- Conditions evaluated before payment execution
- Payment only executes if condition returns true

**Example Conditions**:
- External API success check
- Task completion verification
- Quality metrics threshold
- Time-based conditions

**Code Example**:
```solidity
function executeConditionalPayment(uint256 ruleId, bytes calldata conditionProof) external {
    PaymentRule memory rule = rules[ruleId];
    require(evaluateCondition(rule.condition, conditionProof), "Condition not met");
    IMNEE(MNEE_CONTRACT).transfer(rule.recipient, rule.amount);
    emit ConditionalPaymentExecuted(ruleId, rule.recipient, rule.amount);
}
```

### 3. Streaming/Recurring Payments

**Use Case**: Monthly subscriptions and continuous payments.

**Implementation**:
- StreamingPayments contract manages recurring payments
- Automatically deducts MNEE from agent balance on schedule
- Supports linear streaming and subscriptions

**Code Example**:
```solidity
function createSubscription(address agentId, address recipient, uint256 monthlyAmount) external {
    require(agentBalances[agentId] >= monthlyAmount, "Insufficient balance");
    agentBalances[agentId] -= monthlyAmount;
    IMNEE(MNEE_CONTRACT).transfer(recipient, monthlyAmount);
    // Schedule next payment
}
```

### 4. Escrow with Programmatic Release

**Use Case**: Milestone-based payments with automatic release.

**Implementation**:
- EscrowContract holds MNEE in escrow
- Funds released automatically when conditions met
- Supports time-based, milestone-based, and conditional release

**Code Example**:
```solidity
function releaseMilestone(uint256 escrowId) external {
    Escrow storage escrow = escrows[escrowId];
    escrow.releasedAmount += escrow.amountPerMilestone;
    IMNEE(MNEE_CONTRACT).transfer(escrow.recipient, escrow.amountPerMilestone);
}
```

### 5. Agent-Initiated Transactions

**Use Case**: Agents autonomously decide to purchase services.

**Implementation**:
- Agent backend evaluates need for service
- PaymentRules contract validates against agent rules
- Executes MNEE transfer if authorized

### 6. Treasury Automation

**Use Case**: Automatic profit allocation across categories.

**Implementation**:
- Rules automatically split incoming revenue
- Allocate percentages to operating expenses, savings, reinvestment
- Execute multiple MNEE transfers based on allocation rules

## Comparison to Alternatives

### vs. ETH

**MNEE Advantages**:
- Stable value for predictable economics
- Same gas costs but preserves value
- Budgeting possible in stable USD value

**ETH Limitations**:
- Volatility makes budgeting impossible
- Value loss to volatility
- Unpredictable economics

### vs. USDC

**MNEE Advantages**:
- Programmability enables conditional logic
- Automation via smart contracts
- Designed for automated systems

**USDC Limitations**:
- Just ERC20 transfers, no programmability
- Requires off-chain coordination
- No built-in automation

### vs. Web2 Payments (Stripe, PayPal)

**MNEE Advantages**:
- True autonomy (no human bank accounts)
- Smart contract programmability
- Composability with DeFi
- Transparent on-chain transactions
- Lower fees for micro-transactions
- Global accessibility

**Web2 Limitations**:
- Requires human identity
- Limited programmatic APIs
- Centralized approval bottlenecks
- High fees for small transactions
- Geographic restrictions

## Technical Implementation

### Approval Flow

Before deposits or escrows, users must approve contracts:

1. User approves AgentTreasury to spend MNEE
2. User approves EscrowContract to spend MNEE
3. Contracts can then transfer MNEE on behalf of users

### Balance Tracking

Agent balances tracked in AgentTreasury contract:
- On-chain balance via `agentBalances` mapping
- Real-time queries via `balanceOf()` calls
- Event-based updates for frontend

### Transaction Verification

All MNEE transactions:
- Recorded on Ethereum blockchain
- Verifiable on Etherscan
- Transparent and auditable
- Immutable once confirmed

## Network Considerations

### Mainnet

- MNEE contract on Ethereum mainnet
- Real value transactions
- Production use

### Testnet

- For development and testing
- Testnet MNEE tokens required
- Same contract interface

## Security Considerations

### Approval Management

- Users must approve contracts before use
- Approvals can be revoked
- Frontend should guide users through approval flow

### Balance Verification

- Always verify balances before operations
- Check allowances before transfers
- Handle insufficient balance errors gracefully

### Contract Verification

- All contracts verified on Etherscan
- Source code publicly available
- Transparent and auditable

---

**Related Documentation**:
- [System Overview](system-overview.md)
- [Smart Contracts](smart-contracts.md)
- [Problem Statement](../overview/problem-statement.md)
