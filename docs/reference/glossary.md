# Glossary

**Audience**: All users

## Purpose

Terminology and definitions used throughout Autonomey documentation.

## Terms

### Agent

An AI system registered in Autonomey with its own treasury and spending rules. Agents can autonomously manage finances and execute payments.

### Agent Owner

The user who registers and configures an agent. Agent owners set spending limits, create payment rules, and can override agent actions.

### Agent Treasury

The on-chain balance of MNEE tokens associated with an agent. Managed by the AgentTreasury smart contract.

### Conditional Payment

A payment that executes only if specific conditions are met (e.g., task success, quality threshold).

### Escrow

Funds held in a smart contract until specific conditions are met (e.g., milestone completion, time-based release).

### Milestone Escrow

An escrow that releases funds incrementally as milestones are completed.

### MNEE

Programmable stablecoin used for all financial operations in Autonomey. Contract address: `0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF`.

### Payment Rule

A programmable rule that defines when and how payments should execute. Rules can be conditional, time-based, or threshold-based.

### Programmable Stablecoin

A stablecoin (like MNEE) that supports smart contract integration for conditional logic and automation, beyond simple transfers.

### Spending Limit

A daily maximum amount an agent can spend. Enforced at the smart contract level.

### Streaming Payment

A continuous payment stream where funds are released over time at a constant rate.

### Subscription

A recurring payment that executes automatically at regular intervals (e.g., monthly API access).

### Treasury

See Agent Treasury.

---

**Related Documentation**:
- [FAQ](faq.md)
- [System Overview](../architecture/system-overview.md)
