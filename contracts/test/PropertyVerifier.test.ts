import { expect } from "chai";
import { ethers } from "hardhat";

describe("PropertyVerifier", () => {
  it("emits PropertyVerified with the correct args", async () => {
    const [signer] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("PropertyVerifier");
    const contract = await factory.deploy();
    await contract.waitForDeployment();

    const hash = ethers.sha256(ethers.toUtf8Bytes("123 Main St, Springfield"));

    await expect(contract.verifyProperty(hash))
      .to.emit(contract, "PropertyVerified")
      .withArgs(hash, signer.address, anyUint());
  });

  it("reverts on zero hash", async () => {
    const factory = await ethers.getContractFactory("PropertyVerifier");
    const contract = await factory.deploy();
    await contract.waitForDeployment();

    await expect(
      contract.verifyProperty(ethers.ZeroHash)
    ).to.be.revertedWith("PropertyVerifier: zero hash");
  });
});

function anyUint() {
  return (value: bigint) => typeof value === "bigint" && value > 0n;
}
