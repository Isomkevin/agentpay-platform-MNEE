const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🔍 Verifying Autonomey deployment...\n");

  // Load deployed addresses
  let addresses;
  try {
    const addressesJson = fs.readFileSync("deployed-addresses.json", "utf8");
    addresses = JSON.parse(addressesJson);
    console.log("📄 Loaded addresses from deployed-addresses.json\n");
  } catch (error) {
    console.error("❌ Error: deployed-addresses.json not found");
    console.error("   Run deployment script first: npx hardhat run scripts/deploy.js --network <network>");
    process.exit(1);
  }

  const network = hre.network.name;
  console.log(`Network: ${network}\n`);

  // Get contract factories
  const AgentTreasury = await hre.ethers.getContractFactory("AgentTreasury");
  const PaymentRules = await hre.ethers.getContractFactory("PaymentRules");
  const StreamingPayments = await hre.ethers.getContractFactory("StreamingPayments");
  const EscrowContract = await hre.ethers.getContractFactory("EscrowContract");

  // Attach to deployed contracts
  const treasury = AgentTreasury.attach(addresses.AgentTreasury);
  const paymentRules = PaymentRules.attach(addresses.PaymentRules);
  const streamingPayments = StreamingPayments.attach(addresses.StreamingPayments);
  const escrowContract = EscrowContract.attach(addresses.EscrowContract);

  console.log("Verifying contract connections...\n");

  // Verify AgentTreasury
  try {
    const agentCount = await treasury.getAgentCount();
    console.log(`✅ AgentTreasury: Connected`);
    console.log(`   Address: ${addresses.AgentTreasury}`);
    console.log(`   Agent Count: ${agentCount.toString()}\n`);
  } catch (error) {
    console.log(`❌ AgentTreasury: Connection failed`);
    console.log(`   Error: ${error.message}\n`);
  }

  // Verify PaymentRules
  try {
    const treasuryAddress = await paymentRules.treasury();
    const ruleCount = await paymentRules.ruleCount();
    console.log(`✅ PaymentRules: Connected`);
    console.log(`   Address: ${addresses.PaymentRules}`);
    console.log(`   Treasury: ${treasuryAddress}`);
    console.log(`   Rule Count: ${ruleCount.toString()}\n`);
    
    // Verify authorization
    const isAuthorized = await treasury.authorizedContracts(addresses.PaymentRules);
    console.log(`   Authorized in Treasury: ${isAuthorized ? 'Yes ✅' : 'No ❌'}\n`);
  } catch (error) {
    console.log(`❌ PaymentRules: Connection failed`);
    console.log(`   Error: ${error.message}\n`);
  }

  // Verify StreamingPayments
  try {
    const treasuryAddress = await streamingPayments.treasury();
    const subscriptionCount = await streamingPayments.subscriptionCount();
    console.log(`✅ StreamingPayments: Connected`);
    console.log(`   Address: ${addresses.StreamingPayments}`);
    console.log(`   Treasury: ${treasuryAddress}`);
    console.log(`   Subscription Count: ${subscriptionCount.toString()}\n`);
    
    // Verify authorization
    const isAuthorized = await treasury.authorizedContracts(addresses.StreamingPayments);
    console.log(`   Authorized in Treasury: ${isAuthorized ? 'Yes ✅' : 'No ❌'}\n`);
  } catch (error) {
    console.log(`❌ StreamingPayments: Connection failed`);
    console.log(`   Error: ${error.message}\n`);
  }

  // Verify EscrowContract
  try {
    const escrowCount = await escrowContract.escrowCount();
    const contractBalance = await escrowContract.getContractBalance();
    console.log(`✅ EscrowContract: Connected`);
    console.log(`   Address: ${addresses.EscrowContract}`);
    console.log(`   Escrow Count: ${escrowCount.toString()}`);
    console.log(`   Contract Balance: ${hre.ethers.formatEther(contractBalance)} MNEE\n`);
  } catch (error) {
    console.log(`❌ EscrowContract: Connection failed`);
    console.log(`   Error: ${error.message}\n`);
  }

  // Verify MNEE contract
  const MNEE_ABI = [
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)"
  ];
  try {
    const mnee = new hre.ethers.Contract(addresses.MNEE, MNEE_ABI, hre.ethers.provider);
    const deployer = (await hre.ethers.getSigners())[0];
    const balance = await mnee.balanceOf(deployer.address);
    const decimals = await mnee.decimals();
    console.log(`✅ MNEE Contract: Connected`);
    console.log(`   Address: ${addresses.MNEE}`);
    console.log(`   Deployer Balance: ${hre.ethers.formatUnits(balance, decimals)} MNEE\n`);
  } catch (error) {
    console.log(`⚠️  MNEE Contract: Could not verify`);
    console.log(`   Error: ${error.message}\n`);
  }

  console.log("📋 Deployment Summary:");
  console.log("=====================");
  console.log(`Network: ${addresses.network || network}`);
  console.log(`Deployer: ${addresses.deployer}`);
  console.log(`\nContract Addresses:`);
  console.log(`  AgentTreasury: ${addresses.AgentTreasury}`);
  console.log(`  PaymentRules: ${addresses.PaymentRules}`);
  console.log(`  StreamingPayments: ${addresses.StreamingPayments}`);
  console.log(`  EscrowContract: ${addresses.EscrowContract}`);
  console.log(`  MNEE: ${addresses.MNEE}`);

  console.log(`\n✅ Verification complete!\n`);
  console.log("Next steps:");
  console.log("1. Update .env file with these addresses");
  console.log("2. Set NEXT_PUBLIC_CHAIN_ID to match network");
  console.log("3. Start frontend: npm run dev");
  console.log("4. Test all flows");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
