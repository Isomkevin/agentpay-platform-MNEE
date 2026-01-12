const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying Autonomey contracts...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString(), "\n");

  // Deploy AgentTreasury
  console.log("1. Deploying AgentTreasury...");
  const AgentTreasury = await hre.ethers.getContractFactory("AgentTreasury");
  const treasury = await AgentTreasury.deploy();
  await treasury.waitForDeployment();
  const treasuryAddress = await treasury.getAddress();
  console.log("   ✅ AgentTreasury deployed to:", treasuryAddress, "\n");

  // Deploy PaymentRules
  console.log("2. Deploying PaymentRules...");
  const PaymentRules = await hre.ethers.getContractFactory("PaymentRules");
  const paymentRules = await PaymentRules.deploy(treasuryAddress);
  await paymentRules.waitForDeployment();
  const paymentRulesAddress = await paymentRules.getAddress();
  console.log("   ✅ PaymentRules deployed to:", paymentRulesAddress, "\n");

  // Deploy StreamingPayments
  console.log("3. Deploying StreamingPayments...");
  const StreamingPayments = await hre.ethers.getContractFactory("StreamingPayments");
  const streamingPayments = await StreamingPayments.deploy(treasuryAddress);
  await streamingPayments.waitForDeployment();
  const streamingPaymentsAddress = await streamingPayments.getAddress();
  console.log("   ✅ StreamingPayments deployed to:", streamingPaymentsAddress, "\n");

  // Deploy EscrowContract
  console.log("4. Deploying EscrowContract...");
  const EscrowContract = await hre.ethers.getContractFactory("EscrowContract");
  const escrowContract = await EscrowContract.deploy();
  await escrowContract.waitForDeployment();
  const escrowAddress = await escrowContract.getAddress();
  console.log("   ✅ EscrowContract deployed to:", escrowAddress, "\n");

  // Authorize PaymentRules and StreamingPayments in AgentTreasury
  console.log("5. Authorizing contracts in AgentTreasury...");
  const authTx1 = await treasury.authorizeContract(paymentRulesAddress, true);
  await authTx1.wait();
  console.log("   ✅ PaymentRules authorized");

  const authTx2 = await treasury.authorizeContract(streamingPaymentsAddress, true);
  await authTx2.wait();
  console.log("   ✅ StreamingPayments authorized\n");

  console.log("🎉 Deployment complete!\n");
  console.log("Contract addresses:");
  console.log("===================");
  console.log("AgentTreasury:", treasuryAddress);
  console.log("PaymentRules:", paymentRulesAddress);
  console.log("StreamingPayments:", streamingPaymentsAddress);
  console.log("EscrowContract:", escrowAddress);
  console.log("\nMNEE Contract:", "0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF");
  console.log("\nSave these addresses for your frontend configuration!\n");

  // Save addresses to a file (optional)
  const addresses = {
    AgentTreasury: treasuryAddress,
    PaymentRules: paymentRulesAddress,
    StreamingPayments: streamingPaymentsAddress,
    EscrowContract: escrowAddress,
    MNEE: "0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF",
    network: hre.network.name,
    deployer: deployer.address
  };

  const fs = require("fs");
  const addressesJson = JSON.stringify(addresses, null, 2);
  fs.writeFileSync("deployed-addresses.json", addressesJson);
  console.log("✅ Contract addresses saved to deployed-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
