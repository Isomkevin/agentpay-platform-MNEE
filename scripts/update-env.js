const fs = require("fs");
const path = require("path");

// Load deployed addresses
let addresses;
try {
  const addressesJson = fs.readFileSync("deployed-addresses.json", "utf8");
  addresses = JSON.parse(addressesJson);
  console.log("📄 Loaded addresses from deployed-addresses.json\n");
} catch (error) {
  console.error("❌ Error: deployed-addresses.json not found");
  console.error("   Run deployment script first: npm run deploy:sepolia");
  process.exit(1);
}

// Read existing .env file
const envPath = path.join(process.cwd(), ".env");
let envContent = "";

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, "utf8");
  console.log("📝 Found existing .env file\n");
} else {
  console.log("⚠️  .env file not found. Creating from template...\n");
  // Try to read from template
  const templatePath = path.join(process.cwd(), ".env.template");
  if (fs.existsSync(templatePath)) {
    envContent = fs.readFileSync(templatePath, "utf8");
  }
}

// Update contract addresses in .env content
const updates = {
  "NEXT_PUBLIC_AGENT_TREASURY_ADDRESS": addresses.AgentTreasury,
  "NEXT_PUBLIC_PAYMENT_RULES_ADDRESS": addresses.PaymentRules,
  "NEXT_PUBLIC_STREAMING_PAYMENTS_ADDRESS": addresses.StreamingPayments,
  "NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS": addresses.EscrowContract,
  "NEXT_PUBLIC_MNEE_CONTRACT": addresses.MNEE,
  "NEXT_PUBLIC_CHAIN_ID": addresses.network === "sepolia" ? "11155111" : addresses.network === "mainnet" ? "1" : "1337",
};

let updated = false;
let lines = envContent.split("\n");
const updatedLines = lines.map((line) => {
  for (const [key, value] of Object.entries(updates)) {
    if (line.startsWith(key + "=")) {
      const oldValue = line.split("=")[1]?.trim() || "";
      if (oldValue !== value) {
        updated = true;
        console.log(`✅ Updating ${key}: ${oldValue || "(empty)"} → ${value}`);
        return `${key}=${value}`;
      }
    }
  }
  return line;
});

if (updated) {
  fs.writeFileSync(envPath, updatedLines.join("\n"), "utf8");
  console.log(`\n✅ .env file updated successfully!`);
  console.log(`\n📋 Updated addresses:`);
  console.log(`   AgentTreasury: ${addresses.AgentTreasury}`);
  console.log(`   PaymentRules: ${addresses.PaymentRules}`);
  console.log(`   StreamingPayments: ${addresses.StreamingPayments}`);
  console.log(`   EscrowContract: ${addresses.EscrowContract}`);
  console.log(`   Chain ID: ${updates.NEXT_PUBLIC_CHAIN_ID}`);
  console.log(`\n🚀 Next steps:`);
  console.log(`   1. Restart your dev server: npm run dev`);
  console.log(`   2. Verify deployment: npm run verify:deployment`);
} else {
  console.log("✅ .env file already up to date!");
}
