const { expect, assert } = require("chai");
const { parseUnits } = require("ethers/lib/utils");
const { ethers, network } = require("hardhat");

describe("Deploy ERC20", () => {
  let signers;

  let multisig;
  let owners;

  let amount = "0.5";
  amount = ethers.utils.parseEther(amount);

  before(async () => {});

  it("Should deploy ERC20 token: ", async () => {
    signers = await ethers.getSigners();

    const ERC20 = await ethers.getContractFactory("DAI");
    erc20 = await ERC20.deploy();
    await erc20.deployed();
    console.log("erc20:", erc20.address);
  });

  it("Should send", async () => {
    let amount = "100";
    amount = ethers.utils.parseEther(amount);

    let tx = await erc20
      .connect(signers[0])
      .transfer(signers[1].address, amount);

    await tx.wait();

    let tokenBal = await erc20.balanceOf(signers[1].address);

    expect(tokenBal).to.equal(amount);

    console.log(tokenBal);
  });
});
