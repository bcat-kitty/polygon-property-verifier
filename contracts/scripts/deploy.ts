import { ethers, network } from "hardhat";
import * as fs from "node:fs";
import * as path from "node:path";

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);

  console.log("Deploying PropertyVerifier");
  console.log("Network:  ", network.name);
  console.log("Deployer: ", deployer.address);
  console.log("Balance:  ", ethers.formatEther(balance), "POL");

  if (balance === 0n) {
    throw new Error(
      "Deployer wallet has 0 POL. Fund it from a Polygon Amoy faucet before deploying."
    );
  }

  const factory = await ethers.getContractFactory("PropertyVerifier");
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  const txHash = contract.deploymentTransaction()?.hash;

  console.log("PropertyVerifier deployed at:", address);
  console.log("Tx hash:", txHash);
  console.log("Polygonscan:", `https://amoy.polygonscan.com/address/${address}`);

  const outputPath = path.join(__dirname, "..", "deployed.json");
  const record = {
    network: network.name,
    chainId: 80002,
    address,
    deployer: deployer.address,
    txHash,
    deployedAt: new Date().toISOString(),
  };
  fs.writeFileSync(outputPath, JSON.stringify(record, null, 2));
  console.log("Wrote", outputPath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
