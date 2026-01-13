# Frequently Asked Questions

**Audience**: All users

## Purpose

Common questions and answers about Autonomey.

## General

### What is Autonomey?

Autonomey is a platform that enables AI agents to autonomously manage finances, execute payments, and operate as independent economic entities using MNEE programmable stablecoins.

### Why do AI agents need this?

AI agents can perform complex tasks but are financially paralyzed. Every payment requires human approval, preventing true autonomy. Autonomey enables agents to operate independently with programmable spending rules.

### What makes this different from other payment solutions?

Autonomey is built specifically for autonomous AI agents, not retrofitted for humans. It uses MNEE programmable stablecoins, which provide stable value + programmability + automation in one protocol.

## Technical

### What blockchain does Autonomey use?

Ethereum (mainnet and Sepolia testnet). All contracts are deployed on Ethereum.

### What is MNEE?

MNEE is a programmable stablecoin (USD-backed) that enables smart contract integration for conditional logic and automation. Contract address: `0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF`.

### Why MNEE instead of ETH or USDC?

- **vs. ETH**: Stable value for predictable economics (ETH is volatile)
- **vs. USDC**: Programmability enables autonomous execution (USDC lacks programmability)
- **vs. Web2**: True autonomy without human bank accounts

### How do agents receive payments?

Payments go directly to agent treasury addresses. The AgentTreasury contract tracks balances on-chain.

### How are spending limits enforced?

Spending limits are enforced at the smart contract level. The AgentTreasury contract checks daily limits before executing payments.

### Are contracts upgradeable?

No. Contracts are immutable for security. Future versions would require new deployments.

## Usage

### How do I register an agent?

Connect your wallet, navigate to the dashboard, and use the Agent Registration form. You'll need to provide a name, wallet address, and description.

### How do I deposit MNEE to an agent?

First, approve the AgentTreasury contract to spend your MNEE. Then use the Agent Balance component to deposit MNEE to the agent treasury.

### Can I cancel a payment?

Once a payment is executed on-chain, it cannot be cancelled. However, you can set spending limits to prevent unauthorized payments.

### How do conditional payments work?

Conditional payments only execute if specific conditions are met. Conditions are evaluated by the PaymentRules contract before payment execution.

### What happens if an agent runs out of funds?

Payments will fail if the agent balance is insufficient. The agent owner can deposit more MNEE to continue operations.

## Security

### Are my funds safe?

All funds are held in smart contracts on Ethereum. Smart contracts are transparent, verifiable, and immutable once deployed.

### Can agents spend unlimited amounts?

No. Agent owners set daily spending limits. The AgentTreasury contract enforces these limits.

### What if I lose access to my wallet?

If you lose access to your wallet, you cannot recover agent ownership. Always backup your wallet securely.

### Are contracts audited?

Contracts follow security best practices. For production use, consider professional security audits.

## Development

### How do I deploy contracts?

See the [Deployment Guide](../deployment/deployment-guide.md) for complete instructions.

### Can I contribute?

Yes! See the [Contribution Guide](../contributing/contribution-guide.md) for details.

### Where is the code?

The codebase is available on GitHub. See the repository link in the main README.

---

**Related Documentation**:
- [Glossary](glossary.md)
- [Quick Start](../deployment/quick-start.md)
- [System Overview](../architecture/system-overview.md)
