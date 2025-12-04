// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract StakingNFT is ReentrancyGuard {
    struct Stake {
        address owner;
        address nftAddress;
        uint256 tokenId;
        uint256 startTime;
    }

    mapping(uint256 => Stake) public stakes;
    mapping(address => uint256[]) public userStakes;
    mapping(uint256 => uint256) public stakeIdToIndex;
    uint256 public nextStakeId;

    event Staked(
        uint256 indexed stakeId,
        address indexed owner,
        address indexed nftAddress,
        uint256 tokenId
    );
    event Unstaked(
        uint256 indexed stakeId,
        address indexed owner,
        address indexed nftAddress,
        uint256 tokenId
    );

    function stake(address nftAddress, uint256 tokenId) public {
        IERC721(nftAddress).transferFrom(msg.sender, address(this), tokenId);
        stakes[nextStakeId] = Stake(
            msg.sender,
            nftAddress,
            tokenId,
            block.timestamp
        );
        userStakes[msg.sender].push(nextStakeId);
        stakeIdToIndex[nextStakeId] = userStakes[msg.sender].length - 1;
        emit Staked(nextStakeId, msg.sender, nftAddress, tokenId);
        nextStakeId++;
    }

    function unstake(uint256 stakeId) public {
        Stake storage s = stakes[stakeId];
        require(s.owner == msg.sender, "Not the owner");
        IERC721(s.nftAddress).transferFrom(address(this), msg.sender, s.tokenId);

        uint256 index = stakeIdToIndex[stakeId];
        uint256 lastStakeId = userStakes[msg.sender][userStakes[msg.sender].length - 1];

        userStakes[msg.sender][index] = lastStakeId;
        stakeIdToIndex[lastStakeId] = index;

        userStakes[msg.sender].pop();

        delete stakes[stakeId];
        delete stakeIdToIndex[stakeId];

        emit Unstaked(stakeId, msg.sender, s.nftAddress, s.tokenId);
    }

    function getPoints(uint256 stakeId) public view returns (uint256) {
        Stake storage s = stakes[stakeId];
        // 3 points per day
        return ((block.timestamp - s.startTime) * 3) / (1 days);
    }
}