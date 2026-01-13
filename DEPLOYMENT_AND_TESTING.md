# Autonomey - Deployment and Testing Guide

## 🚀 Pre-Deployment Checklist

Before deploying, ensure you have:

- [x] All smart contracts compiled without errors
- [x] Frontend code complete and functional
- [x] Environment variables template ready
- [x] Deployment scripts ready
- [x] Testing guide prepared

## 📦 Step 1: Compile Contracts

```bash
# Install dependencies (if not already done)
npm install --legacy-peer-deps

# Compile smart contracts
npx hardhat compile
```

**Expected Output:**
- Contracts compiled successfully
- ABIs generated in `artifacts/contracts/`
- No compilation errors

**If compilation fails:**
- Check Solidity version compatibility
- Verify all imports are correct
- Ensure Hardhat is properly configured

## 🌐 Step 2: Deploy to Testnet (Sepolia)

### Prerequisites

1. **Get Sepolia ETH** for gas fees:
   - Use a Sepolia faucet: https://sepoliafaucet.com/
   - Or use Alchemy/Infura faucet

2. **Get Sepolia MNEE tokens** (if needed):
   - Check if testnet MNEE is available
   - Or deploy with mock tokens for testing

3. **Configure Environment Variables**

Create a `.env` file in the root directory:

```env
# Network Configuration
RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY

# Deployment
PRIVATE_KEY=your_private_key_without_0x_prefix
ETHERSCAN_API_KEY=your_etherscan_api_key

# Frontend (will be updated after deployment)
NEXT_PUBLIC_AGENT_TREASURY_ADDRESS=
NEXT_PUBLIC_PAYMENT_RULES_ADDRESS=
NEXT_PUBLIC_STREAMING_PAYMENTS_ADDRESS=
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=
NEXT_PUBLIC_MNEE_CONTRACT=0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

**Security Note:** Never commit `.env` file. It's already in `.gitignore`.

### Deploy Contracts

```bash
# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia
```

**Expected Output:**
```
🚀 Deploying Autonomey contracts...

Deploying contracts with account: 0x...
Account balance: ...

1. Deploying AgentTreasury...
   ✅ AgentTreasury deployed to: 0x...

2. Deploying PaymentRules...
   ✅ PaymentRules deployed to: 0x...

3. Deploying StreamingPayments...
   ✅ StreamingPayments deployed to: 0x...

4. Deploying EscrowContract...
   ✅ EscrowContract deployed to: 0x...

5. Authorizing contracts in AgentTreasury...
   ✅ PaymentRules authorized
   ✅ StreamingPayments authorized

🎉 Deployment complete!
...
✅ Contract addresses saved to deployed-addresses.json
```

### Update Environment Variables

After deployment, update your `.env` file with the addresses from `deployed-addresses.json`:

```env
NEXT_PUBLIC_AGENT_TREASURY_ADDRESS=0x... # from deployed-addresses.json
NEXT_PUBLIC_PAYMENT_RULES_ADDRESS=0x... # from deployed-addresses.json
NEXT_PUBLIC_STREAMING_PAYMENTS_ADDRESS=0x... # from deployed-addresses.json
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=0x... # from deployed-addresses.json
NEXT_PUBLIC_CHAIN_ID=11155111 # Sepolia
```

### Verify Contracts on Etherscan (Optional but Recommended)

```bash
# Verify AgentTreasury (no constructor args)
npx hardhat verify --network sepolia <TREASURY_ADDRESS>

# Verify PaymentRules (needs treasury address)
npx hardhat verify --network sepolia <PAYMENT_RULES_ADDRESS> <TREASURY_ADDRESS>

# Verify StreamingPayments (needs treasury address)
npx hardhat verify --network sepolia <STREAMING_PAYMENTS_ADDRESS> <TREASURY_ADDRESS>

# Verify EscrowContract (no constructor args)
npx hardhat verify --network sepolia <ESCROW_ADDRESS>
```

## 🧪 Step 3: End-to-End Testing

### Test Environment Setup

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

### Test Flow 1: Agent Registration

**Objective:** Register an agent and verify on-chain

**Steps:**
1. Navigate to Dashboard
2. Connect wallet
3. Fill in Agent Registration form:
   - Agent Name: "Alpha"
   - Agent Wallet: Your wallet address (or different address)
   - Description: "Test AI agent"
4. Click "Register Agent"
5. Approve transaction in wallet
6. Wait for confirmation

**Verification:**
- ✅ Transaction hash visible
- ✅ Success message shown
- ✅ Agent status shows as registered
- ✅ Verify on Etherscan (check AgentTreasury contract, view `agents` mapping)

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
- ✅ Balance updates (may need refresh)
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
- ✅ Verify on Etherscan (check PaymentExecuted event)

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

## 🔍 Step 4: Verification Checklist

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

### Demo Readiness

- [ ] All demo flows work
- [ ] Transaction hashes displayed
- [ ] Error messages clear and helpful
- [ ] Loading states work
- [ ] Success states work
- [ ] Demo script prepared

## 🐛 Troubleshooting

### Contract Deployment Issues

**Error: Insufficient funds**
- Ensure wallet has enough ETH for gas fees
- Check gas price and adjust if needed

**Error: Contract already deployed**
- Use new addresses or verify deployment succeeded
- Check `deployed-addresses.json`

**Error: Authorization failed**
- Verify deployment order (Treasury first, then others)
- Check authorization transactions succeeded

### Frontend Issues

**Error: Contract address not set**
- Verify `.env` file has all required addresses
- Restart dev server after updating `.env`
- Check environment variable names match exactly

**Error: Wrong network**
- Ensure wallet is on correct network (Sepolia: 11155111)
- Update `NEXT_PUBLIC_CHAIN_ID` if needed

**Error: Transaction failed**
- Check wallet has enough ETH for gas
- Check wallet has MNEE tokens (for deposits/payments)
- Check approvals are set correctly
- Check contract addresses are correct

**Error: Component not rendering**
- Check browser console for errors
- Verify all imports are correct
- Verify contract ABIs are correct

### Testing Issues

**Transaction not appearing**
- Check transaction hash on Etherscan
- Wait for confirmation (can take 15-30 seconds)
- Verify network connection

**Balance not updating**
- Refresh component (use refresh button if available)
- Wait a few seconds for blockchain sync
- Check transaction was successful on Etherscan

**Approval issues**
- Ensure MNEE is approved before deposit/escrow
- Use Etherscan to check current allowance
- Approve more than needed to avoid repeated approvals

## 📋 Demo Script

### Quick Demo (5 minutes)

**Setup (30 seconds)**
1. "Welcome to Autonomey - the autonomous treasury platform for AI agents"
2. Connect wallet (Sepolia testnet)
3. Show home page and features

**Agent Setup (1 minute)**
1. "Let me create an agent called 'Alpha'"
2. Register agent with name "Alpha"
3. "Now I'll deposit 500 MNEE to Alpha's treasury"
4. Approve and deposit 500 MNEE
5. Show balance update

**Autonomous Actions (2.5 minutes)**
1. **Subscription:** "Alpha needs monthly API access - let's create a subscription"
   - Create 50 MNEE/month subscription
   - Show transaction

2. **Conditional Payment:** "Alpha needs data service - we'll pay only if quality is good"
   - Create conditional payment rule (75 MNEE, success-based)
   - Show transaction

3. **Milestone Escrow:** "Alpha needs developer work - we'll pay in milestones"
   - Create milestone escrow (200 MNEE, 4 milestones)
   - Show transaction
   - Release first milestone
   - Show transaction

4. **Direct Payment:** "Alpha needs to pay for service now"
   - Execute direct payment (25 MNEE)
   - Show transaction

**Results (1 minute)**
1. Show updated balance
2. Show all transaction hashes
3. Open Etherscan for one transaction
4. "All transactions are on-chain and transparent"
5. "This is only possible with MNEE programmable stablecoins"

**Why This Wins (30 seconds)**
1. "MNEE enables autonomous agent economies"
2. "Traditional payments require human approval"
3. "This unlocks the future of agent commerce"

### Extended Demo (10 minutes)

Include:
- More detailed explanation of each feature
- Show multiple agents
- Show payment history
- Show escrow management in detail
- Show streaming payments in action
- Q&A time

## 🎯 Production Deployment (Mainnet)

When ready for mainnet:

1. **Security Audit**
   - Review all contracts
   - Test thoroughly on testnet
   - Consider professional audit for production

2. **Update Environment**
   ```env
   CHAIN_ID=1
   RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
   NEXT_PUBLIC_CHAIN_ID=1
   ```

3. **Deploy Contracts**
   ```bash
   npx hardhat run scripts/deploy.js --network mainnet
   ```

4. **Update Frontend**
   - Update environment variables
   - Deploy frontend (Vercel/Netlify)
   - Update DNS if using custom domain

5. **Verify Contracts**
   - Verify all contracts on Etherscan
   - Add contract addresses to documentation

## 📝 Notes

- Always test on testnet first
- Keep private keys secure (never commit)
- Document all deployed addresses
- Keep deployment receipts/transaction hashes
- Monitor contract interactions
- Set up monitoring/alerts for production

## ✅ Success Criteria

The deployment is successful when:

1. ✅ All contracts deployed and verified
2. ✅ All frontend components work
3. ✅ All test flows pass
4. ✅ Transactions execute successfully
5. ✅ Balances update correctly
6. ✅ All transactions visible on Etherscan
7. ✅ Demo flows work smoothly
8. ✅ No critical errors
9. ✅ UI is polished and professional
10. ✅ Ready for hackathon presentation

---

**Status:** Ready for deployment and testing! 🚀
