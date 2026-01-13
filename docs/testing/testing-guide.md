# Testing Guide

**Audience**: Developers testing Autonomey

## Purpose

Complete guide for testing all Autonomey features and flows.

## Test Environment Setup

1. **Start Frontend Development Server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`

2. **Connect Wallet**
   - Use MetaMask or your preferred wallet
   - Switch to Sepolia testnet (Chain ID: 11155111)
   - Ensure you have Sepolia ETH for gas fees
   - Ensure you have MNEE tokens (or use mock for testing)

## Test Flows

### Test Flow 1: Agent Registration

**Objective:** Register an agent and verify on-chain

**Steps:**
1. Navigate to Dashboard
2. Connect wallet
3. Fill in Agent Registration form:
   - Agent Name: "Alpha"
   - Agent Wallet: Your wallet address
   - Description: "Test AI agent"
4. Click "Register Agent"
5. Approve transaction in wallet
6. Wait for confirmation

**Verification:**
- ✅ Transaction hash visible
- ✅ Success message shown
- ✅ Agent status shows as registered
- ✅ Verify on Etherscan

**Expected Result:**
- Agent registered successfully
- Transaction confirmed on-chain
- Agent balance shows 0 MNEE

### Test Flow 2: Deposit MNEE

**Objective:** Deposit MNEE to agent treasury

**Prerequisites:**
- Agent must be registered
- Wallet must have MNEE tokens
- MNEE must be approved for AgentTreasury contract

**Steps:**
1. In Agent Balance component, enter deposit amount (e.g., "500")
2. **First, approve MNEE spending:**
   - Use Etherscan or wallet to approve AgentTreasury contract
   - Contract address: From `NEXT_PUBLIC_AGENT_TREASURY_ADDRESS`
   - Amount: At least the deposit amount
3. Click deposit button
4. Approve transaction in wallet
5. Wait for confirmation

**Verification:**
- ✅ Transaction hash visible
- ✅ Success message shown
- ✅ Balance updates
- ✅ Verify on Etherscan

**Expected Result:**
- Deposit successful
- Agent balance increases by deposited amount
- Wallet MNEE balance decreases

### Test Flow 3: Direct Payment

**Objective:** Execute a direct payment from agent treasury

**Prerequisites:**
- Agent registered
- Agent has MNEE balance
- Recipient address (use a test address)

**Steps:**
1. Navigate to Payment Form
2. Select "Direct Payment"
3. Enter:
   - Recipient: Valid Ethereum address
   - Amount: "10" (or any amount less than balance)
4. Click "Execute Payment"
5. Approve transaction in wallet
6. Wait for confirmation

**Verification:**
- ✅ Transaction hash visible
- ✅ Success message shown
- ✅ Agent balance decreases
- ✅ Verify on Etherscan

**Expected Result:**
- Payment executed successfully
- Recipient receives MNEE
- Agent balance decreases

### Test Flow 4: Conditional Payment Rule

**Objective:** Create and execute a conditional payment rule

**Steps:**
1. Navigate to Payment Form
2. Select "Conditional Payment"
3. Enter:
   - Recipient: Valid Ethereum address
   - Amount: "75"
   - Condition Type: "Always Execute" or "Success Based"
4. Click "Create Payment Rule"
5. Approve transaction in wallet
6. Wait for confirmation

**Verification:**
- ✅ Transaction hash visible
- ✅ Success message shown
- ✅ Rule created (note rule ID)
- ✅ Verify on Etherscan

**Execute Rule (if applicable):**
- Rule can be executed via PaymentRules contract
- Use `executeRule` function with rule ID

**Expected Result:**
- Payment rule created successfully
- Rule can be executed when conditions are met

### Test Flow 5: Milestone Escrow

**Objective:** Create and release milestone escrow

**Steps:**
1. Navigate to Escrow Form
2. Select "Milestone Based"
3. Enter:
   - Payee: Valid Ethereum address
   - Total Amount: "200"
   - Number of Milestones: "4"
   - Description: "Test milestone escrow"
4. **First, approve MNEE spending for EscrowContract**
5. Click "Create Escrow"
6. Approve transaction in wallet
7. Wait for confirmation

**Release Milestones:**
1. Use EscrowList component (or contract directly)
2. Click "Release Milestone" for each milestone
3. Approve transactions

**Verification:**
- ✅ Escrow created successfully
- ✅ Each milestone release works
- ✅ Payee receives payments incrementally
- ✅ Verify on Etherscan

**Expected Result:**
- Escrow created with 200 MNEE
- Each milestone releases 50 MNEE (200/4)
- All milestones can be released
- Escrow completes when all milestones released

### Test Flow 6: Streaming Payment (Subscription)

**Objective:** Create a subscription

**Steps:**
1. Navigate to Streaming Payments component
2. Click "+ Create"
3. Select "Subscription"
4. Enter:
   - Recipient: Valid Ethereum address
   - Amount per Period: "50"
   - Period: "2592000" (30 days in seconds)
5. Click "Create"
6. Approve transaction in wallet
7. Wait for confirmation

**Verification:**
- ✅ Subscription created successfully
- ✅ Subscription ID returned
- ✅ Verify on Etherscan

**Expected Result:**
- Subscription created
- Can be processed via `processPayment` function
- Subscription can be cancelled

### Test Flow 7: Complete Demo Flow

**Full 5-Minute Demo Flow:**

1. **Setup (1 min)**
   - Connect wallet ✅
   - Register agent "Alpha" ✅
   - Deposit 500 MNEE ✅

2. **Autonomous Actions (2.5 min)**
   - Create subscription: 50 MNEE/month ✅
   - Create conditional payment rule: 75 MNEE, pay if success ✅
   - Create milestone escrow: 200 MNEE, 4 milestones ✅
   - Execute direct payment: 25 MNEE ✅

3. **Results (1 min)**
   - Show transaction history (via Etherscan links)
   - Show updated balances
   - Show all transactions on Etherscan

**Verification Checklist:**
- [ ] All transactions successful
- [ ] All transactions visible on Etherscan
- [ ] Balances update correctly
- [ ] No errors in console
- [ ] UI reflects on-chain state

## Verification Checklist

### Contract Verification

- [ ] All contracts deployed successfully
- [ ] All contracts verified on Etherscan
- [ ] All contract addresses in environment variables
- [ ] PaymentRules and StreamingPayments authorized in AgentTreasury

### Frontend Verification

- [ ] Frontend loads without errors
- [ ] Wallet connects successfully
- [ ] All contract addresses loaded from environment
- [ ] All components render correctly
- [ ] No console errors

### Functionality Verification

- [ ] Agent registration works
- [ ] Deposit works (with approval)
- [ ] Direct payments work
- [ ] Conditional payment rules work
- [ ] Escrow creation works
- [ ] Milestone release works
- [ ] Subscription creation works
- [ ] All transactions visible on Etherscan

## Troubleshooting

### Transaction Not Appearing

- Check transaction hash on Etherscan
- Wait for confirmation (can take 15-30 seconds)
- Verify network connection

### Balance Not Updating

- Refresh component (use refresh button if available)
- Wait a few seconds for blockchain sync
- Check transaction was successful on Etherscan

### Approval Issues

- Ensure MNEE is approved before deposit/escrow
- Use Etherscan to check current allowance
- Approve more than needed to avoid repeated approvals

---

**Related Documentation**:
- [Deployment Guide](../deployment/deployment-guide.md)
- [Demo Script](demo-script.md)
