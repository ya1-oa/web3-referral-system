import hre from "hardhat";

const EXISTING_TOKEN_ADDRESS = "0x1f864B2Eb9ad1c062d7419BD5e83A8A858aA81C8"; // Your deployed token address

async function main() {
  // Skip token deployment, use existing token
  console.log("Using existing ReferralToken at:", EXISTING_TOKEN_ADDRESS);

  // Deploy only MultiLevelReferral
  const Referral = await hre.ethers.getContractFactory("MultiLevelReferralV2");
  const referral = await Referral.deploy(EXISTING_TOKEN_ADDRESS);
  await referral.waitForDeployment();
  const referralAddress = await referral.getAddress();
  console.log("MultiLevelReferralV2 deployed to:", referralAddress);

  // Log verification info
  console.log("\nVerify with:");
  console.log(`npx hardhat verify --network polygon_amoy ${referralAddress} ${EXISTING_TOKEN_ADDRESS}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });