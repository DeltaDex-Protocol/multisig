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

  it("Should deploy ERC20 token: ", async () => {
    signers = await ethers.getSigners();

    const ERC20 = await ethers.getContractFactory("DAI");
    erc20 = await ERC20.deploy();
    await erc20.deployed();
    console.log("erc20:", erc20.address);
  });

  it("Should deposit erc20", async () => {
    let amount = "100";
    amount = ethers.utils.parseEther(amount);

    let tx = await erc20.connect(signers[0]).approve(multisig.address, amount);

    await tx.wait();

    let tx1 = await multisig
      .connect(signers[0])
      .depositERC20(erc20.address, amount);

    let tokenBal = await erc20.balanceOf(multisig.address);

    expect(tokenBal).to.equal(amount);

    console.log("tokenbal", tokenBal);

    let internalBal = await multisig.ERC20_Balances(erc20.address);
    console.log("internalbal", internalBal);
  });

  it("Should receive payment in ether", async () => {
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
