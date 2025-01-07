const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("ReferralDeployment", (m) => {
  const token = m.contract("ReferralToken");
  console.log("Deploying ReferralToken...");
  
  const referral = m.contract("MultiLevelReferral", [token]);
  console.log("Deploying MultiLevelReferral...");
  return { token, referral };
});