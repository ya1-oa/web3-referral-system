import hre from "hardhat";

const EXISTING_TOKEN_ADDRESS = "0x1f864B2Eb9ad1c062d7419BD5e83A8A858aA81C8"; // Your deployed token address
const INITIAL_OWNER = "0xDC8fa247C247D0193a10D03149AfC2F89db3cd33"; // Your deployed token address
//const SUBCRIPTION_NFT_ADDRESS = "0xf46ba115b5906106609bBeA85053115669fDe644";
async function main() {
  // Skip token deployment, use existing token
  console.log("Using existing ReferralToken at:", EXISTING_TOKEN_ADDRESS);

   //Deploy SubscriptionNFT
  const SubscriptionNFT = await hre.ethers.getContractFactory("SubscriptionNFT");
  const subscriptionNFT = await SubscriptionNFT.deploy(INITIAL_OWNER);
  await subscriptionNFT.waitForDeployment();
  const subscriptionNFTAddress = await subscriptionNFT.getAddress();
  
  console.log("SubscriptionNFT deployed to:", subscriptionNFTAddress);
  await subscriptionNFT.setActiveBaseURI("https://gateway.pinata.cloud/ipfs/QmUzmVgF7yiU2cvEX8p2hsx1UVNsnjAKBZCuJhvyhHkWfH");
  await subscriptionNFT.setExpiredBaseURI("https://gateway.pinata.cloud/ipfs/QmUCGFHX4jdkiFpFMQoh8y6ugt9eY4uRsiLRx3i8A62efu");

  //console.log("Using existing SubscriptionNFT at:", SUBCRIPTION_NFT_ADDRESS);
  // Deploy only MultiLevelReferral
  const Referral = await hre.ethers.getContractFactory("Referral");
  const referral = await Referral.deploy(EXISTING_TOKEN_ADDRESS, subscriptionNFTAddress);
  await referral.waitForDeployment();
  const referralAddress = await referral.getAddress();
  console.log("Referral deployed to:", referralAddress);
  await subscriptionNFT.setReferralContract(referralAddress);
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