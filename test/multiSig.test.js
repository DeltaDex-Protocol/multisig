const { expect } = require("chai");
const { parseUnits } = require("ethers/lib/utils");
const { ethers, network } = require("hardhat");

describe("Multi Sig Wallet Tests", () => {
  before(async () => {});

  it("Should deploy multi sig contract: ", async () => {
    signers = await ethers.getSigners();

    const owners = [signers[0].address, signers[1].address];

    const MultiSig = await ethers.getContractFactory("MultiSigWallet");
    const multisig = await MultiSig.deploy(owners, 2);
    await multisig.deployed();
    console.log("stats library:", multisig.address);
  });

  it("test 1", async () => {});
});
