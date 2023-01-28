// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract NFTMinter is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter public _tokenIdCounter;

    constructor() ERC721("NFTMinter", "NFTM") {}

    // to keep track of already minted URIs
    mapping(string => uint8) titleDeedURIs; // indicates if title deed exists
    mapping(string => string[]) titleDeedURIsToPropertyUIDs; // stores the property ids of those title deeds


    function mintNFT(address recipient, string memory ipfsTitleDeedURI, string memory propertyId) public onlyOwner returns (uint256) {
        require(!isContentOwned(ipfsTitleDeedURI), "NFT already minted");

        // create new item ID, counter given by openzeppelin
        uint256 newItemId = getCurrentTokenIdCounter();

        // increment token by 1
        _tokenIdCounter.increment();

        // update mapping of existing URIs
        titleDeedURIs[ipfsTitleDeedURI] = 1;

        // store the property ID 
        titleDeedURIsToPropertyUIDs[ipfsTitleDeedURI] = [propertyId];

        // call built in mint method with recipient's wallet address
        _mint(recipient, newItemId);
        // set tokenURI on that ID
        _setTokenURI(newItemId, ipfsTitleDeedURI);

        _approve(msg.sender, newItemId);

        return newItemId;
    }

    // The following functions are overrides required by Solidity.
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // these are custom helper functions
    function isContentOwned(string memory uri) public view returns(bool) {
        // returns true if URI already exists in the mapping
        return titleDeedURIs[uri] == 1;
    }

    function getCurrentTokenIdCounter() public view returns (uint256) {
        uint256 prevItemId = _tokenIdCounter.current();
        return  prevItemId;
    }
}