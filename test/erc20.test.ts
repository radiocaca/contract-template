import { ethers } from "hardhat";
import { expect } from "chai";
import { TestToken } from "typechain-types";

describe("Token", () => {
  let tokenContract: TestToken;
  
  beforeEach(async () => {
    const factory = await ethers.getContractFactory("TestToken");
    tokenContract = await factory.deploy("TestToken", "TST");
    
    expect(await tokenContract.totalSupply()).to.eq(0);
  });
  describe("Mint", async () => {
    it("Should mint some tokens", async () => {
      const [deployer] = await ethers.getSigners();
      const toMint = ethers.utils.parseEther("1");
      
      await tokenContract.mint(deployer.address, toMint);
      expect(await tokenContract.totalSupply()).to.eq(toMint);
    });
  });
  
  describe("Transfer", async () => {
    it("Should transfer tokens between users", async () => {
      const [sender, receiver] = await ethers.getSigners();
      const toMint = ethers.utils.parseEther("1");
      
      await tokenContract.mint(sender.address, toMint);
      expect(await tokenContract.balanceOf(sender.address)).to.eq(toMint);
      
      const toSend = ethers.utils.parseEther("0.4");
      await tokenContract.connect(sender).transfer(receiver.address, toSend);
      
      expect(await tokenContract.balanceOf(receiver.address)).to.eq(toSend);
    });
    
    it("Should fail to transfer with low balance", async () => {
      const [sender, receiver] = await ethers.getSigners();
      const toMint = ethers.utils.parseEther("1");
      
      await tokenContract.mint(sender.address, toMint);
      expect(await tokenContract.balanceOf(sender.address)).to.eq(toMint);
      
      const toSend = ethers.utils.parseEther("1.1");
      
      // Notice await is on the expect
      await expect(tokenContract.connect(sender).transfer(receiver.address, toSend)).to.be.revertedWith(
        "transfer amount exceeds balance",
      );
    });
  });
});
