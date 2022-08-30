const { expect, assert } = require("chai");
const { parseUnits } = require("ethers/lib/utils");
const { ethers, network } = require("hardhat");

describe("Multi Sig Wallet Tests", () => {
  let signers;

  let multisig;
  let owners;

  let amount = "0.5";
  amount = ethers.utils.parseEther(amount);

  before(async () => {});

  it("Should deploy multi sig contract: ", async () => {
    signers = await ethers.getSigners();
    owners = [signers[0].address, signers[1].address];

    const MultiSig = await ethers.getContractFactory("erc20MultiSigWallet");
    multisig = await MultiSig.deploy(owners, 2);
    await multisig.deployed();
    console.log("MultiSig:", multisig.address);
  });

  it("Should receive payment", async () => {

    let amount = "1";
    amount = ethers.utils.parseEther(amount);

    let tx = await signers[2].sendTransaction({
      to: multisig.address,
      value: amount,
    });

    await tx.wait();

    let walletBal = await ethers.provider.getBalance(multisig.address);

    expect(walletBal).to.equal(amount);
  });
});
