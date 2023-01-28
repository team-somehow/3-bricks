const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMinter", function () {
  let nftMinter;
  let owner;
  let buyer1;
  let buyer2;
  let seller;
  let tokenId;
  let ipfsTitleDeedURI;
  let encryptedPropertyId;

  before(async function () {
    // use ethers to get our contract
    const NFTMinter = await ethers.getContractFactory("NFTMinter");
    // and deploy it
    nftMinter = await NFTMinter.deploy();
    await nftMinter.deployed();

    // get addresses of users
    const [_owner, _buyer1, _buyer2, _seller] = await ethers.getSigners();
    owner = _owner;
    buyer1 = _buyer1;
    buyer2 = _buyer2;
    seller = _seller;

    ipfsTitleDeedURI = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
    encryptedPropertyId = "1234";
    propertyPrice = 100;
    downPayment = 10;
  });

  it("Admin mints NFT for the seller's approved property", async function () {
    // balanceOf is built in to ERC 721
    let balance = await nftMinter.balanceOf(seller.address);
    // since recipient has not purchased any NFT so
    expect(balance).to.equal(0);

    const transaction = await nftMinter.mintNFT(
      seller.address,
      ipfsTitleDeedURI,
      "property_id_0"
    );
    const newlyMintedToken = (await transaction.wait()).events[0].args.tokenId;

    tokenId = newlyMintedToken;

    // recheck the balance
    balance = await nftMinter.balanceOf(seller.address);
    // since recipient has purchased an NFT now so
    expect(balance).to.equal(1);

    // check that that particular NFT is minted
    expect(await nftMinter.isContentOwned(ipfsTitleDeedURI)).to.equal(true);
  });

  it("Seller creates listing for their approved property", async function () {
    await nftMinter
      .connect(seller)
      .createPropertyListing(tokenId, propertyPrice, downPayment);
  });

  it("Buyer1 makes down payment to the smart contract", async () => {
    await nftMinter.connect(buyer1).makeDownPayment(tokenId, buyer1.address, {
      value: ethers.utils.parseEther(downPayment.toString()),
    });
  });

  it("Buyer2 makes down payment to the smart contract", async () => {
    await nftMinter.connect(buyer2).makeDownPayment(tokenId, buyer2.address, {
      value: ethers.utils.parseEther(downPayment.toString()),
    });
  });

  it("Buyer2 accepted by seller, Buyer1's down payment refunded, escrow process begins", async () => {
    await nftMinter
      .connect(seller)
      .NFTOwnerStartEscrow(tokenId, buyer2.address);
  });
});
