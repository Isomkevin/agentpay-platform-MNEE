# Quick Start Guide

**Audience**: Developers getting started with Autonomey

## Purpose

Get Autonomey running locally in 5 minutes.

## Prerequisites

- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Ethereum RPC URL (Alchemy/Infura)
- MNEE tokens for testing (mainnet or testnet)

## Installation

### Step 1: Install Dependencies (1 min)

```bash
npm install --legacy-peer-deps
```

### Step 2: Compile Contracts (1 min)

```bash
npm run compile
```

### Step 3: Configure Environment (1 min)

```bash
# Generate environment template
npm run generate:env

# Copy template to .env
cp .env.template .env

# Edit .env and add:
# - Your Alchemy/Infura RPC URL
# - Your private key (for deployment)
# - Etherscan API key (optional)
```

### Step 4: Deploy Contracts (2 min)

**For Testnet (Sepolia):**
```bash
npm run deploy:sepolia
```

**After deployment:**
1. Copy addresses from `deployed-addresses.json`
2. Update `.env` file with deployed addresses:
   ```env
   NEXT_PUBLIC_AGENT_TREASURY_ADDRESS=<from deployed-addresses.json>
   NEXT_PUBLIC_PAYMENT_RULES_ADDRESS=<from deployed-addresses.json>
   NEXT_PUBLIC_STREAMING_PAYMENTS_ADDRESS=<from deployed-addresses.json>
   NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=<from deployed-addresses.json>
   NEXT_PUBLIC_CHAIN_ID=11155111
   ```

### Step 5: Start Frontend (30 sec)

```bash
npm run dev
```

Visit `http://localhost:3000`

## Quick Test

1. **Connect Wallet** (MetaMask on Sepolia testnet)
2. **Register Agent:**
   - Name: "TestAgent"
   - Wallet: Your wallet address
   - Description: "Test"
3. **Deposit MNEE:**
   - Approve MNEE spending first (via Etherscan or wallet)
   - Enter amount (e.g., "100")
   - Click deposit
4. **Make Payment:**
   - Enter recipient address
   - Enter amount
   - Click "Execute Payment"

## Next Steps

- **Full Deployment Guide**: See [Deployment Guide](deployment-guide.md)
- **Environment Setup**: See [Environment Setup](environment-setup.md)
- **Testing**: See [Testing Guide](../testing/testing-guide.md)

## Troubleshooting

**Can't compile contracts?**
- Ensure Hardhat is installed: `npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox`

**Deployment fails?**
- Check wallet has ETH for gas
- Verify RPC URL is correct
- Check private key is correct (no 0x prefix)

**Frontend shows errors?**
- Verify contract addresses in `.env`
- Restart dev server after updating `.env`
- Check browser console for errors

**Transactions fail?**
- Ensure wallet is on correct network
- Check wallet has ETH for gas
- Check MNEE approval for deposits/escrows

---

**Related Documentation**:
- [Deployment Guide](deployment-guide.md)
- [Environment Setup](environment-setup.md)
- [Testing Guide](../testing/testing-guide.md)
