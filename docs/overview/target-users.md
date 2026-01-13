# Target Users

**Audience**: Product managers, engineers, stakeholders

## Purpose

This document defines who uses Autonomey and their use cases.

## Primary Users

### Agent Owners

**Who They Are**: Developers, businesses, or individuals who create and manage AI agents.

**Their Needs**:
- Set spending rules once, agents operate autonomously
- Transparent financial reporting
- No manual payment approval overhead
- Agents can scale revenue independently

**How Autonomey Helps**:
- Configure spending limits and rules
- Monitor agent financial activity
- Agents execute payments autonomously within rules
- Real-time balance and transaction tracking

### Agent Service Providers

**Who They Are**: Developers, businesses, or other agents providing services to AI agents.

**Their Needs**:
- Get paid automatically when services are used
- No invoice chasing or payment delays
- Automated settlement via smart contracts
- Access to agent customer base

**How Autonomey Helps**:
- Automatic payment on service delivery
- Escrow for milestone-based work
- Subscription payments for recurring services
- Transparent, on-chain payment records

### AI Agents (Autonomous Systems)

**Who They Are**: The AI agents themselves that need to manage finances autonomously.

**Their Needs**:
- Receive revenue autonomously
- Pay for services without human approval
- Execute conditional payments
- Manage budgets and spending limits

**How Autonomey Helps**:
- Dedicated treasury for each agent
- Programmable payment rules
- Conditional payment execution
- Budget enforcement

## Use Cases

### Use Case 1: Autonomous API Subscriptions

**Scenario**: An AI agent needs monthly API access for data processing.

**Solution**: Agent owner creates a subscription payment rule. Agent automatically pays 50 MNEE/month for API access without manual approval.

**Value**: Agent operates autonomously, owner doesn't need to approve recurring payments.

### Use Case 2: Conditional Service Payments

**Scenario**: An AI agent needs data service but only wants to pay if data quality is good.

**Solution**: Agent owner creates conditional payment rule. Payment executes only if quality threshold is met.

**Value**: Agent only pays for successful services, reducing waste.

### Use Case 3: Milestone-Based Development

**Scenario**: An AI agent needs developer work done in milestones.

**Solution**: Agent owner creates milestone escrow. Funds release automatically as milestones are completed.

**Value**: Secure payment for work, automatic release on completion.

### Use Case 4: Revenue Collection

**Scenario**: An AI agent completes tasks and receives payments.

**Solution**: Payments go directly to agent treasury. Agent balance updates automatically.

**Value**: Agent receives revenue autonomously, no manual collection needed.

## Secondary Users

### Platform Administrators

**Who They Are**: Team members managing the Autonomey platform.

**Their Needs**:
- Monitor platform health
- Manage contract upgrades
- Handle support issues

### Auditors and Reviewers

**Who They Are**: Security auditors, compliance officers, external reviewers.

**Their Needs**:
- Understand system architecture
- Verify security practices
- Review transaction flows

**How Autonomey Helps**:
- All transactions on-chain and transparent
- Smart contracts are verifiable
- Complete audit trail

## User Journey

### New Agent Owner

1. **Discovery**: Learns about Autonomey
2. **Setup**: Connects wallet, deploys/connects to contracts
3. **Registration**: Registers first agent
4. **Funding**: Deposits MNEE to agent treasury
5. **Configuration**: Sets spending rules and limits
6. **Operation**: Agent operates autonomously
7. **Monitoring**: Views dashboard and transaction history

### Service Provider

1. **Discovery**: Learns agents can pay autonomously
2. **Integration**: Integrates with Autonomey payment system
3. **Service Delivery**: Provides services to agents
4. **Payment**: Receives automatic payments
5. **Tracking**: Monitors payment history

## User Requirements

### Functional Requirements

- Register agents with unique identities
- Deposit and manage MNEE balances
- Create and execute payment rules
- Create and manage escrows
- Set up recurring payments
- View transaction history
- Monitor balances and spending

### Non-Functional Requirements

- **Security**: All transactions on-chain, verifiable
- **Transparency**: All activity visible and auditable
- **Autonomy**: No human approval for authorized transactions
- **Reliability**: Smart contract execution guarantees
- **Usability**: Clear UI for configuration and monitoring

---

**Related Documentation**:
- [Product Vision](product-vision.md)
- [System Overview](../architecture/system-overview.md)
- [Quick Start](../deployment/quick-start.md)
