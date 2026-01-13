# Autonomey Deployment Guide

## Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- MetaMask or compatible Web3 wallet
- Ethereum RPC URL (Alchemy/Infura)
- MNEE tokens for testing (mainnet or testnet)
- WalletConnect Project ID (optional, for wallet connection)

### Installation

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd MNEE_Hackathon
   npm install --legacy-peer-deps
   ```

2. **Set Up Environment Variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Blockchain Configuration
   MNEE_CONTRACT=0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF
   CHAIN_ID=1
   RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
   SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
   
   # WalletConnect (optional)
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   
   # Deployment (for deploying contracts)
   PRIVATE_KEY=your_private_key
   ETHERSCAN_API_KEY=your_etherscan_key
   ```

3. **Compile Smart Contracts**
   ```bash
   npx hardhat compile
   ```

4. **Deploy Contracts (Testnet)**
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```
   
   This will:
   - Deploy AgentTreasury
   - Deploy PaymentRules
   - Deploy StreamingPayments
   - Deploy EscrowContract
   - Authorize PaymentRules and StreamingPayments
   - Save addresses to `deployed-addresses.json`

5. **Update Environment with Deployed Addresses**
   
   After deployment, update `.env` with the deployed addresses:
   ```env
   NEXT_PUBLIC_AGENT_TREASURY_ADDRESS=<from deployed-addresses.json>
   NEXT_PUBLIC_PAYMENT_RULES_ADDRESS=<from deployed-addresses.json>
   NEXT_PUBLIC_STREAMING_PAYMENTS_ADDRESS=<from deployed-addresses.json>
   NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=<from deployed-addresses.json>
   NEXT_PUBLIC_CHAIN_ID=11155111  # Sepolia testnet
   ```

6. **Generate Contract ABIs**
   
   After compilation, copy ABIs from `artifacts/contracts/` to `src/lib/contracts/` or create a script to generate TypeScript types.

7. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Visit `http://localhost:3000`

### Local Development (Hardhat Network)

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

### Contract Addresses

After deployment, contract addresses will be saved to `deployed-addresses.json`:

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

### Testing Contracts

Run Hardhat tests:
```bash
npx hardhat test
```

### Verifying Contracts on Etherscan

After deployment to testnet/mainnet:
```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

Example:
```bash
# PaymentRules needs treasury address as constructor arg
npx hardhat verify --network sepolia 0x... 0x<TREASURY_ADDRESS>
```

## Frontend Implementation Status

⚠️ **Note**: The frontend currently has basic structure but needs contract integration components. See `IMPLEMENTATION_STATUS.md` for details.

To complete the frontend:

1. **Generate Contract ABIs**
   ```bash
   npx hardhat compile
   # Copy ABIs from artifacts/contracts/*.sol/*.json
   ```

2. **Create Contract Integration**
   - Create `src/lib/contracts.ts` with ABIs and addresses
   - Create hooks in `src/hooks/useContracts.ts`
   - Implement components in `src/components/`

3. **Implement Core Components**
   - `AgentRegistration.tsx` - Register agents
   - `AgentBalance.tsx` - Display balances
   - `PaymentForm.tsx` - Execute payments
   - `EscrowForm.tsx` - Create/manage escrow

See `IMPLEMENTATION_STATUS.md` for detailed implementation checklist.

## Demo Flow

The demo should follow this flow:

1. **Setup** (1 min)
   - Connect wallet
   - Register agent "Alpha"
   - Deposit 500 MNEE

2. **Autonomous Actions** (2.5 min)
   - Create subscription (50 MNEE/month)
   - Create conditional payment rule (75 MNEE, pay if success)
   - Create milestone escrow (200 MNEE, 4 milestones)
   - Execute payments

3. **Results** (1 min)
   - Show transaction history
   - Show updated balances
   - Show all transactions on Etherscan

See `PRODUCT_BLUEPRINT.md` for complete demo script.

## Troubleshooting

### Dependencies Installation Issues

If you encounter dependency conflicts:
```bash
npm install --legacy-peer-deps
```

### Contract Compilation Errors

Ensure Hardhat is installed locally:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat compile
```

### Wallet Connection Issues

- Ensure WalletConnect project ID is set (optional)
- Check network configuration in `src/app/providers.tsx`
- Verify chain ID matches your deployment network

### Transaction Failures

- Ensure wallet has enough ETH for gas
- Ensure wallet has MNEE tokens (for mainnet/testnet)
- Check contract addresses in environment variables
- Verify contracts are authorized in AgentTreasury

## Support

For issues or questions, refer to:

- `PRODUCT_BLUEPRINT.md` - Complete product documentation
- `IMPLEMENTATION_STATUS.md` - Implementation status and next steps
- `README.md` - Project overview
