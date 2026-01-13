# Deployment Guide

**Audience**: Developers deploying Autonomey

## Purpose

Complete guide for deploying Autonomey smart contracts and frontend to testnet or mainnet.

## Prerequisites

- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Ethereum RPC URL (Alchemy/Infura)
- Testnet ETH (for Sepolia) or Mainnet ETH (for production)
- Etherscan API key (for contract verification)

## Pre-Deployment Checklist

- [ ] All smart contracts compiled without errors
- [ ] Frontend code complete and functional
- [ ] Environment variables configured
- [ ] Deployment scripts ready
- [ ] Wallet has sufficient ETH for gas fees

## Step 1: Compile Contracts

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

## Step 2: Configure Environment

See [Environment Setup](environment-setup.md) for detailed configuration.

**Required Variables:**
```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
PRIVATE_KEY=your_private_key_without_0x_prefix
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## Step 3: Deploy to Testnet (Sepolia)

### Prerequisites

1. **Get Sepolia ETH** for gas fees:
   - Use a Sepolia faucet: https://sepoliafaucet.com/
   - Or use Alchemy/Infura faucet

2. **Get Sepolia MNEE tokens** (if needed):
   - Check if testnet MNEE is available
   - Or use mock tokens for testing

### Deploy Contracts

```bash
# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia
# OR
npm run deploy:sepolia
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
✅ Contract addresses saved to deployed-addresses.json
```

### Update Environment Variables

After deployment, update your `.env` file with addresses from `deployed-addresses.json`:

```env
NEXT_PUBLIC_AGENT_TREASURY_ADDRESS=0x... # from deployed-addresses.json
NEXT_PUBLIC_PAYMENT_RULES_ADDRESS=0x... # from deployed-addresses.json
NEXT_PUBLIC_STREAMING_PAYMENTS_ADDRESS=0x... # from deployed-addresses.json
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=0x... # from deployed-addresses.json
NEXT_PUBLIC_CHAIN_ID=11155111 # Sepolia
```

## Step 4: Verify Contracts on Etherscan

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

Or use the verification script:

```bash
npm run verify:deployment
```

## Step 5: Verify Deployment

```bash
npm run verify:deployment
```

**Verify:**
- [ ] All contracts connected successfully
- [ ] PaymentRules authorized in AgentTreasury
- [ ] StreamingPayments authorized in AgentTreasury
- [ ] All addresses correct

## Step 6: Start Frontend

```bash
npm run dev
```

Visit `http://localhost:3000`

**Verify:**
- [ ] Frontend loads without errors
- [ ] Wallet connects successfully
- [ ] All contract addresses loaded from environment
- [ ] All components render correctly

## Local Development (Hardhat Network)

For local testing:

1. **Start Hardhat Node**
   ```bash
   npx hardhat node
   ```

2. **Deploy to Local Network**
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. **Add Hardhat Network to MetaMask**
   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 1337
   - Currency Symbol: ETH

4. **Import Test Account**
   - Use one of the accounts from Hardhat node output
   - Private keys are displayed when you start the node

## Production Deployment (Mainnet)

When ready for mainnet:

### Security Audit

- [ ] Review all contracts
- [ ] Test thoroughly on testnet
- [ ] Consider professional audit for production

### Update Environment

```env
CHAIN_ID=1
RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_CHAIN_ID=1
```

### Deploy Contracts

```bash
npx hardhat run scripts/deploy.js --network mainnet
```

### Update Frontend

- Update environment variables
- Deploy frontend (Vercel/Netlify)
- Update DNS if using custom domain

### Verify Contracts

- Verify all contracts on Etherscan
- Add contract addresses to documentation

## Contract Addresses

After deployment, contract addresses are saved to `deployed-addresses.json`:

```json
{
  "AgentTreasury": "0x...",
  "PaymentRules": "0x...",
  "StreamingPayments": "0x...",
  "EscrowContract": "0x...",
  "MNEE": "0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF",
  "network": "sepolia",
  "deployer": "0x..."
}
```

## Troubleshooting

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

## Deployment Verification Checklist

- [ ] All contracts deployed successfully
- [ ] All contracts verified on Etherscan
- [ ] All contract addresses in environment variables
- [ ] PaymentRules and StreamingPayments authorized in AgentTreasury
- [ ] Frontend loads without errors
- [ ] Wallet connects successfully
- [ ] All components render correctly
- [ ] No console errors

## Next Steps

After successful deployment:

1. Test all flows (see [Testing Guide](../testing/testing-guide.md))
2. Prepare demo (see [Demo Script](../testing/demo-script.md))
3. Monitor contract interactions
4. Set up monitoring/alerts for production

---

**Related Documentation**:
- [Quick Start](quick-start.md)
- [Environment Setup](environment-setup.md)
- [Testing Guide](../testing/testing-guide.md)
- [Production Checklist](production-checklist.md)
