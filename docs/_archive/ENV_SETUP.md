# Environment Setup Guide

## 🔧 Quick Fix for Deployment Error

If you see this error:
```
HardhatError: HH117: Empty string `` for network or forking URL
```

This means your `.env` file is missing the `SEPOLIA_RPC_URL` configuration.

## 📝 Steps to Fix

### Step 1: Check Your .env File

Make sure you have a `.env` file in the root directory. If not, copy from template:

```bash
cp .env.template .env
```

### Step 2: Get a Sepolia RPC URL

You need an RPC URL to connect to Sepolia testnet. Options:

#### Option A: Alchemy (Recommended)
1. Go to https://www.alchemy.com/
2. Sign up or log in
3. Create a new app
4. Select "Ethereum" and "Sepolia" network
5. Copy the HTTPS URL (looks like: `https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`)

#### Option B: Infura
1. Go to https://infura.io/
2. Sign up or log in
3. Create a new project
4. Select "Ethereum" and "Sepolia" endpoint
5. Copy the HTTPS URL (looks like: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`)

#### Option C: Public RPC (Not Recommended for Production)
You can use public RPCs, but they may be rate-limited:
```
SEPOLIA_RPC_URL=https://rpc.sepolia.org
```

### Step 3: Update Your .env File

Open `.env` and add/update these lines:

```env
# Network Configuration
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY

# Or if using Infura:
# SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# Deployment (Required for deployment)
PRIVATE_KEY=your_private_key_without_0x_prefix

# Optional but recommended
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Step 4: Get Your Private Key

For deployment, you need a private key from a wallet that has Sepolia ETH:

1. **Important Security Note**: Never share your private key or commit it to git
2. Use MetaMask or another wallet
3. Export private key (MetaMask: Account Details > Show Private Key)
4. Remove the `0x` prefix when adding to `.env`

### Step 5: Get Sepolia ETH

You need Sepolia ETH for gas fees:

1. Use a Sepolia faucet:
   - https://sepoliafaucet.com/
   - https://www.alchemy.com/faucets/ethereum-sepolia
   - https://infura.io/faucet/sepolia
2. Send Sepolia ETH to your deployment wallet address

### Step 6: Verify Configuration

Your `.env` file should look like this:

```env
# Network Configuration
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ACTUAL_API_KEY
RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_MAINNET_KEY

# Deployment
PRIVATE_KEY=your_private_key_without_0x_prefix
ETHERSCAN_API_KEY=your_etherscan_api_key_optional

# Frontend (update after deployment)
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_MNEE_CONTRACT=0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_optional

# Contract addresses (will be filled after deployment)
NEXT_PUBLIC_AGENT_TREASURY_ADDRESS=
NEXT_PUBLIC_PAYMENT_RULES_ADDRESS=
NEXT_PUBLIC_STREAMING_PAYMENTS_ADDRESS=
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=
```

### Step 7: Test Configuration

Try deploying again:

```bash
npm run deploy:sepolia
```

## ⚠️ Security Notes

1. **Never commit `.env` file** - It's in `.gitignore`
2. **Keep private keys secure** - Never share or expose them
3. **Use separate wallets** - Consider using a separate wallet for testing
4. **Rotate keys regularly** - Especially if exposed

## ✅ Complete Checklist

- [ ] `.env` file exists
- [ ] `SEPOLIA_RPC_URL` is set with valid URL
- [ ] `PRIVATE_KEY` is set (without `0x` prefix)
- [ ] Wallet has Sepolia ETH
- [ ] `ETHERSCAN_API_KEY` is set (optional but recommended)
- [ ] All values are correctly formatted (no extra spaces, quotes, etc.)

## 🐛 Common Issues

### Issue: Still getting "Empty string" error
- **Solution**: Check that `SEPOLIA_RPC_URL` has no quotes, no extra spaces, and is on a single line

### Issue: "Insufficient funds" error
- **Solution**: Get Sepolia ETH from a faucet (see Step 5)

### Issue: "Invalid API key" error
- **Solution**: Verify your RPC URL is correct and the API key is valid

### Issue: Deployment succeeds but contracts don't work
- **Solution**: Make sure you update `.env` with deployed addresses and restart dev server

## 📚 Additional Resources

- **Alchemy Setup**: https://docs.alchemy.com/docs/alchemy-quickstart-guide
- **Infura Setup**: https://docs.infura.io/getting-started
- **Sepolia Faucets**: https://ethereum.org/en/developers/docs/networks/#sepolia
- **Hardhat Network Config**: https://hardhat.org/hardhat-runner/docs/config#networks-configuration

---

Once your `.env` is configured correctly, you can proceed with deployment! 🚀
