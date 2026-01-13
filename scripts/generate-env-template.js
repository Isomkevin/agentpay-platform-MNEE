const fs = require("fs");

// Load deployed addresses if available
let addresses = {};
try {
  const addressesJson = fs.readFileSync("deployed-addresses.json", "utf8");
  addresses = JSON.parse(addressesJson);
  console.log("📄 Loaded addresses from deployed-addresses.json");
} catch (error) {
  console.log("⚠️  deployed-addresses.json not found - using placeholders");
}

// Determine chain ID based on network
const chainIdMap = {
  sepolia: "11155111",
  mainnet: "1",
  hardhat: "1337",
  localhost: "1337",
};
const network = addresses.network || "sepolia";
const chainId = chainIdMap[network] || "1";

const envTemplate = `# Autonomey Environment Configuration
# Generated: ${new Date().toISOString()}
# Network: ${network}

# ============================================
# BLOCKCHAIN CONFIGURATION
# ============================================

# MNEE Contract (Mainnet - same on all networks)
MNEE_CONTRACT=0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF

# Network Configuration
CHAIN_ID=${chainId}
RPC_URL=https://eth-${network === "mainnet" ? "mainnet" : network}.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY

# ============================================
# CONTRACT ADDRESSES (Update after deployment)
# ============================================

NEXT_PUBLIC_AGENT_TREASURY_ADDRESS=${addresses.AgentTreasury || ""}
NEXT_PUBLIC_PAYMENT_RULES_ADDRESS=${addresses.PaymentRules || ""}
NEXT_PUBLIC_STREAMING_PAYMENTS_ADDRESS=${addresses.StreamingPayments || ""}
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=${addresses.EscrowContract || ""}
NEXT_PUBLIC_MNEE_CONTRACT=0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF
NEXT_PUBLIC_CHAIN_ID=${chainId}

# ============================================
# WALLET CONFIGURATION
# ============================================

# WalletConnect Project ID (optional - get from https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# ============================================
# DEPLOYMENT CONFIGURATION (Backend only)
# ============================================

# Private key for deployment (NEVER commit this!)
PRIVATE_KEY=your_private_key_without_0x_prefix

# Etherscan API Key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key

# ============================================
# NOTES
# ============================================
# 1. Copy this file to .env: cp .env.template .env
# 2. Fill in YOUR_ALCHEMY_KEY with your Alchemy/Infura API key
# 3. Update contract addresses after deployment
# 4. Set PRIVATE_KEY only for deployment (not needed for frontend)
# 5. Never commit .env file (it's in .gitignore)
`;

fs.writeFileSync(".env.template", envTemplate);
console.log("✅ Generated .env.template");
console.log("\nNext steps:");
console.log("1. Copy .env.template to .env: cp .env.template .env");
console.log("2. Fill in your API keys and configuration");
if (addresses.AgentTreasury) {
  console.log("3. Addresses already populated from deployment!");
} else {
  console.log("3. Deploy contracts and update addresses");
}
console.log("4. Start frontend: npm run dev");
