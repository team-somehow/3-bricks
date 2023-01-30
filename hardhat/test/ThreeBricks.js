const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("ThreeBricks", function () {
    async function deployTokenFixture() {
        // use ethers to get our contract
        const ThreeBricks = await ethers.getContractFactory("ThreeBricks1");
        // and deploy it
        const threeBricks = await ThreeBricks.deploy();
        await threeBricks.deployed();
        const [owner, buyer1, buyer2, buyer3, seller] =
            await ethers.getSigners();
        return {
            ThreeBricks,
            threeBricks,
            owner,
            buyer1,
            buyer2,
            buyer3,
            seller,
        };
    }

    // before(async function () {
    //     // use ethers to get our contract
    //     const ThreeBricks = await ethers.getContractFactory("ThreeBricks1");
    //     // and deploy it
    //     threeBricks = await ThreeBricks.deploy();
    //     await threeBricks.deployed();

    //     // get addresses of users
    //     const [_owner, _buyer1, _buyer2, _seller] = await ethers.getSigners();
    //     owner = _owner;
    //     buyer1 = _buyer1;
    //     buyer2 = _buyer2;
    //     seller = _seller;

    //     ipfsTitleDeedURI = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
    //     propertyId = "1234";
    //     propertyPrice = 10;
    //     downPayment = 1;
    // });

    it("Admin mints NFT for the seller's approved property", async function () {
        const {
            ThreeBricks,
            threeBricks,
            owner,
            buyer1,
            buyer2,
            buyer3,
            seller,
        } = await loadFixture(deployTokenFixture);
        // balanceOf is built in to ERC 721
        let balance = await threeBricks.balanceOf(seller.address);
        // since recipient has not purchased any NFT so
        expect(balance).to.equal(0);

        ipfsTitleDeedURI = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
        propertyId = "1234";
        const transaction = await threeBricks.mintNFT(
            seller.address,
            ipfsTitleDeedURI,
            propertyId
        );
        const newlyMintedToken = (await transaction.wait()).events[0].args
            .tokenId;
        tokenId = newlyMintedToken;

        // // recheck the balance
        balance = await threeBricks.balanceOf(seller.address);
        // since recipient has purchased an NFT now so
        expect(balance).to.equal(1);

        // check that that particular NFT is minted
        expect(await threeBricks.isContentOwned(ipfsTitleDeedURI)).to.equal(
            true
        );
    });

    it("Seller creates listing for their approved property", async function () {
        const {
            ThreeBricks,
            threeBricks,
            owner,
            buyer1,
            buyer2,
            buyer3,
            seller,
        } = await loadFixture(deployTokenFixture);

        ipfsTitleDeedURI = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
        propertyId = "1234";
        const transaction = await threeBricks.mintNFT(
            seller.address,
            ipfsTitleDeedURI,
            propertyId
        );
        const newlyMintedToken = (await transaction.wait()).events[0].args
            .tokenId;
        tokenId = newlyMintedToken;

        let propertyPrice = 0.01;
        let downPayment = 0.001;
        await threeBricks
            .connect(seller)
            .createPropertyListing(
                tokenId,
                ethers.utils.parseEther(propertyPrice.toString()),
                ethers.utils.parseEther(downPayment.toString())
            );
        let newPropertyPrice = await threeBricks.getPropertyPrice(tokenId);
        let newDownpayment = await threeBricks.getDownpayment(tokenId);
        expect(
            propertyPrice === newPropertyPrice / 10 ** 18,
            "Improper property price set"
        );
        expect(
            downPayment === newDownpayment / 10 ** 18,
            "Improper property price set"
        );
    });

    it("Buyer1 makes down payment to the smart contract", async () => {
        const {
            ThreeBricks,
            threeBricks,
            owner,
            buyer1,
            buyer2,
            buyer3,
            seller,
        } = await loadFixture(deployTokenFixture);
        ipfsTitleDeedURI = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
        propertyId = "1234";
        const transaction = await threeBricks.mintNFT(
            seller.address,
            ipfsTitleDeedURI,
            propertyId
        );
        const newlyMintedToken = (await transaction.wait()).events[0].args
            .tokenId;
        tokenId = newlyMintedToken;

        let propertyPrice = 30;
        let downPayment = 20;
        await threeBricks
            .connect(seller)
            .createPropertyListing(
                tokenId,
                ethers.utils.parseEther(propertyPrice.toString()),
                ethers.utils.parseEther(downPayment.toString())
            );

        const buyer1BalanceBefore = (await buyer1.getBalance()) / 10 ** 18;

        await threeBricks
            .connect(buyer1)
            .makeDownPayment(tokenId, buyer1.address, {
                value: ethers.utils.parseEther(downPayment.toString()),
            });
        expect((await buyer1.getBalance()) / 10 ** 18)
            .be.lessThan(buyer1BalanceBefore - downPayment)
            .greaterThan(buyer1BalanceBefore - downPayment - 1);
        const buyers = await threeBricks.tokenIdToBuyerAddress(tokenId, 0);
        expect(buyers === buyer1.address, "Not Stored buyer1");
    });

    it("Buyer2 makes down payment to the smart contract", async () => {
        const {
            ThreeBricks,
            threeBricks,
            owner,
            buyer1,
            buyer2,
            buyer3,
            seller,
        } = await loadFixture(deployTokenFixture);
        ipfsTitleDeedURI = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
        propertyId = "1234";
        const transaction = await threeBricks.mintNFT(
            seller.address,
            ipfsTitleDeedURI,
            propertyId
        );
        const newlyMintedToken = (await transaction.wait()).events[0].args
            .tokenId;
        tokenId = newlyMintedToken;

        let propertyPrice = 30;
        let downPayment = 20;
        await threeBricks
            .connect(seller)
            .createPropertyListing(
                tokenId,
                ethers.utils.parseEther(propertyPrice.toString()),
                ethers.utils.parseEther(downPayment.toString())
            );

        const buyer2BalanceBefore = (await buyer2.getBalance()) / 10 ** 18;

        await threeBricks
            .connect(buyer1)
            .makeDownPayment(tokenId, buyer1.address, {
                value: ethers.utils.parseEther(downPayment.toString()),
            });
        await threeBricks
            .connect(buyer2)
            .makeDownPayment(tokenId, buyer2.address, {
                value: ethers.utils.parseEther(downPayment.toString()),
            });
        expect((await buyer2.getBalance()) / 10 ** 18)
            .be.lessThan(buyer2BalanceBefore - downPayment)
            .greaterThan(buyer2BalanceBefore - downPayment - 1);
        const BuyerStore1 = await threeBricks.tokenIdToBuyerAddress(tokenId, 0);
        const BuyerStore2 = await threeBricks.tokenIdToBuyerAddress(tokenId, 1);
        expect(BuyerStore1 === buyer1.address, "Not Stored buyer1");
        expect(BuyerStore2 === buyer2.address, "Not Stored buyer2");
    });

    it("Buyer2 accepted by seller, Buyer1's down payment refunded, escrow process begins", async () => {
        const {
            ThreeBricks,
            threeBricks,
            owner,
            buyer1,
            buyer2,
            buyer3,
            seller,
        } = await loadFixture(deployTokenFixture);
        ipfsTitleDeedURI = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
        propertyId = "1234";
        const transaction = await threeBricks.mintNFT(
            seller.address,
            ipfsTitleDeedURI,
            propertyId
        );
        const newlyMintedToken = (await transaction.wait()).events[0].args
            .tokenId;
        tokenId = newlyMintedToken;

        let propertyPrice = 20;
        let downPayment = 10;
        await threeBricks
            .connect(seller)
            .createPropertyListing(
                tokenId,
                ethers.utils.parseEther(propertyPrice.toString()),
                ethers.utils.parseEther(downPayment.toString())
            );
        await threeBricks
            .connect(buyer1)
            .makeDownPayment(tokenId, buyer1.address, {
                value: ethers.utils.parseEther(downPayment.toString()),
            });
        await threeBricks
            .connect(buyer2)
            .makeDownPayment(tokenId, buyer2.address, {
                value: ethers.utils.parseEther(downPayment.toString()),
            });
        let buyer2BalanceBefore = await buyer2.getBalance();
        let buyer1BalanceBefore = await buyer1.getBalance();

        await threeBricks
            .connect(seller)
            .NFTOwnerStartEscrow(tokenId, buyer2.address);

        expect(
            (await threeBricks.balanceOf(seller.address)) === 0,
            "NFT not transferring"
        );
        let buyer1BalanceAfter = await buyer1.getBalance();
        let buyer2BalanceAfter = await buyer2.getBalance();
        expect(buyer1BalanceBefore == buyer1BalanceAfter);
        expect(buyer2BalanceBefore == buyer2BalanceAfter);

        console.log(
            (await threeBricks.getBalance()) / 10 ** 18,
            10000000000000000000 / 10 ** 18
        );
    });

    it("Buyer1 completes payment, NFT transferred from smart contract to buyer, escrow process completed", async () => {
        const {
            ThreeBricks,
            threeBricks,
            owner,
            buyer1,
            buyer2,
            buyer3,
            seller,
        } = await loadFixture(deployTokenFixture);
        ipfsTitleDeedURI = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
        propertyId = "1234";
        const transaction = await threeBricks.mintNFT(
            seller.address,
            ipfsTitleDeedURI,
            propertyId
        );
        const newlyMintedToken = (await transaction.wait()).events[0].args
            .tokenId;
        tokenId = newlyMintedToken;

        let propertyPrice = 20;
        let downPayment = 10;
        await threeBricks
            .connect(seller)
            .createPropertyListing(
                tokenId,
                ethers.utils.parseEther(propertyPrice.toString()),
                ethers.utils.parseEther(downPayment.toString())
            );
        await threeBricks
            .connect(buyer1)
            .makeDownPayment(tokenId, buyer1.address, {
                value: ethers.utils.parseEther(downPayment.toString()),
            });
        console.log("buyer1 downpayment", (await buyer1.getBalance()) / 10 ** 18);
        
        await threeBricks
            .connect(buyer2)
            .makeDownPayment(tokenId, buyer2.address, {
                value: ethers.utils.parseEther(downPayment.toString()),
            });
        
            
        await threeBricks
            .connect(seller)
            .NFTOwnerStartEscrow(tokenId, buyer2.address);
        console.log("buyer1 refunded", (await buyer1.getBalance()) / 10 ** 18);

        await threeBricks.connect(buyer2).completePaymentAndEsrow(tokenId, {
            value: ethers.utils.parseEther(
                (propertyPrice - downPayment).toString()
            ),
        });

        console.log("seller", (await seller.getBalance()) / 10 ** 18);
        console.log("buyer1", (await buyer1.getBalance()) / 10 ** 18);
        console.log("buyer2", (await buyer2.getBalance()) / 10 ** 18);
    });
});
