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

    const MultiSig = await ethers.getContractFactory("MultiSigWallet");
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

  it("Owners should be able to submit transaction", async () => {
    let amount = "0.5";
    amount = ethers.utils.parseEther(amount);

    let tx = await multisig.connect(signers[0]).submitTransaction(signers[4].address,amount,0);

    await tx.wait();

    let pendingTx = await multisig.getTransaction(0);

    expect(await pendingTx.value).to.equal(amount);

  });

  it("Owners should be able to confirm transaction", async () => {

    let owner1 = await multisig.connect(signers[0]).confirmTransaction(0);

    await owner1.wait();

    let owner2 = await multisig.connect(signers[1]).confirmTransaction(0);

    await owner2.wait();

    let pendingTx = await multisig.getTransaction(0);

    expect(await pendingTx.numConfirmations).to.equal(2);

    // console.log("pending tx", pendingTx);

  });

  it("Owners should be able to execute transaction", async () => {


    let bal_t0 = await ethers.provider.getBalance(signers[4].address);
    bal_t0 = ethers.utils.formatUnits(
      ethers.BigNumber.from(bal_t0),
      "ether"
    );


    let tx = await multisig.connect(signers[0]).executeTransaction(0);
    await tx.wait();

    let bal_t1 = await ethers.provider.getBalance(signers[4].address);
    bal_t1 = ethers.utils.formatUnits(
      ethers.BigNumber.from(bal_t1),
      "ether"
    );

    let debitAmount = bal_t1 - bal_t0;

    amount = Number(ethers.utils.formatUnits(
      ethers.BigNumber.from(amount),
      "ether"
    ));

    // console.log(debitAmount);

    expect(await debitAmount).to.equal(amount);

  });

  it("Owners should be able to confirm transaction", async () => {

    let owner1 = await multisig.connect(signers[0]).confirmTransaction(0);

    await owner1.wait();

    let owner2 = await multisig.connect(signers[1]).confirmTransaction(0);

    await owner2.wait();

    let pendingTx = await multisig.getTransaction(0);

    expect(await pendingTx.numConfirmations).to.equal(2);

    // console.log("pending tx", pendingTx);

  });
});
