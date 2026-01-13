require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

// Helper to clean RPC URL (remove inline comments and whitespace)
function cleanRpcUrl(url) {
  if (!url) return "";
  return url.trim().split('#')[0].trim();
}

// Build networks configuration
const networks = {
  hardhat: {
    chainId: 1337,
  },
};

// Configure mainnet only if RPC_URL is provided
const mainnetUrl = cleanRpcUrl(process.env.RPC_URL);
if (mainnetUrl) {
  networks.mainnet = {
    url: mainnetUrl,
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
  };
}

// Configure sepolia - clean URL and add network if URL exists
const sepoliaUrl = cleanRpcUrl(process.env.SEPOLIA_RPC_URL);
if (sepoliaUrl) {
  networks.sepolia = {
    url: sepoliaUrl,
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
  };
} else {
  console.warn(
    "\n⚠️  Warning: SEPOLIA_RPC_URL is not set or is empty.\n" +
    "   Sepolia network will not be available for deployment.\n" +
    "   To fix: Set SEPOLIA_RPC_URL in your .env file.\n" +
    "   See ENV_SETUP.md for instructions.\n"
  );
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks,
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
