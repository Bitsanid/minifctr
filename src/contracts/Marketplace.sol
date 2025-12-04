// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    struct Listing {
        address seller;
        address nftAddress;
        uint256 tokenId;
        uint256 price;
        bool active;
    }

    mapping(uint256 => Listing) public listings;
    uint256 public nextListingId;

    event Listed(
        uint256 indexed listingId,
        address indexed seller,
        address indexed nftAddress,
        uint256 tokenId,
        uint256 price
    );
    event Sold(
        uint256 indexed listingId,
        address indexed buyer,
        address indexed seller,
        address indexed nftAddress,
        uint256 tokenId,
        uint256 price
    );
    event Canceled(uint256 indexed listingId);

    function list(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    ) public {
        require(price > 0, "Price must be greater than 0");
        IERC721(nftAddress).transferFrom(msg.sender, address(this), tokenId);
        listings[nextListingId] = Listing(
            msg.sender,
            nftAddress,
            tokenId,
            price,
            true
        );
        emit Listed(
            nextListingId,
            msg.sender,
            nftAddress,
            tokenId,
            price
        );
        nextListingId++;
    }

    function buy(uint256 listingId) public payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(msg.value == listing.price, "Incorrect price");
        listing.active = false;
        IERC721(listing.nftAddress).transferFrom(
            address(this),
            msg.sender,
            listing.tokenId
        );
        (bool success, ) = payable(listing.seller).call{value: msg.value}("");
        require(success, "Transfer failed.");
        emit Sold(
            listingId,
            msg.sender,
            listing.seller,
            listing.nftAddress,
            listing.tokenId,
            listing.price
        );
    }

    function cancel(uint256 listingId) public {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(msg.sender == listing.seller, "Not the seller");
        listing.active = false;
        IERC721(listing.nftAddress).transferFrom(
            address(this),
            msg.sender,
            listing.tokenId
        );
        emit Canceled(listingId);
    }
}