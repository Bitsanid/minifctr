'use client';

import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import StakingNftAbi from '~/contracts/StakingNFT.json';
import Image from 'next/image';

const nfts = [
  {
    id: 1,
    title: 'Blockchain Basics Badge',
    description: 'A badge for completing the "Introduction to Blockchain" course.',
    image: 'https://via.placeholder.com/150',
    nftAddress: process.env.NEXT_PUBLIC_BADGES_CONTRACT_ADDRESS as `0x${string}`,
    tokenId: 0,
  },
  {
    id: 2,
    title: 'Crypto Fundamentals Badge',
    description: 'A badge for completing the "Introduction to Cryptocurrency" course.',
    image: 'https://via.placeholder.com/150',
    nftAddress: process.env.NEXT_PUBLIC_BADGES_CONTRACT_ADDRESS as `0x${string}`,
    tokenId: 1,
  },
  {
    id: 3,
    title: 'DeFi Essentials Badge',
    description: 'A badge for completing the "Introduction to DeFi" course.',
    image: 'https://via.placeholder.com/150',
    nftAddress: process.env.NEXT_PUBLIC_BADGES_CONTRACT_ADDRESS as `0x${string}`,
    tokenId: 2,
  },
];

const stakedNfts = [
  {
    id: 4,
    title: 'Staked NFT 1',
    description: 'A staked NFT.',
    image: 'https://via.placeholder.com/150',
    stakeId: 0,
  },
];

export default function StakingPage() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  const handleStake = async (nftAddress: string, tokenId: number) => {
    if (address) {
      writeContract({
        address: process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS as `0x${string}`,
        abi: StakingNftAbi,
        functionName: 'stake',
        args: [nftAddress, tokenId],
      });
    }
  };

  const handleUnstake = async (stakeId: number) => {
    if (address) {
      writeContract({
        address: process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS as `0x${string}`,
        abi: StakingNftAbi,
        functionName: 'unstake',
        args: [stakeId],
      });
    }
  };

  const { data: points } = useReadContract({
    address: process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS as `0x${string}`,
    abi: StakingNftAbi,
    functionName: 'getPoints',
    args: [stakedNfts[0].stakeId],
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">NFT Staking</h1>
      <div className="mt-4">
        <h2 className="text-xl font-bold">Stakeable NFTs</h2>
        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
          {nfts.map((nft) => (
            <div key={nft.id} className="p-4 border rounded">
              <Image src={nft.image} alt={nft.title} width={150} height={150} />
              <h2 className="mt-2 text-xl font-bold">{nft.title}</h2>
              <p>{nft.description}</p>
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => handleStake(nft.nftAddress, nft.tokenId)}
                  className="px-4 py-2 text-white bg-green-500 rounded"
                >
                  Stake
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold">Staked NFTs</h2>
        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
          {stakedNfts.map((nft) => (
            <div key={nft.id} className="p-4 border rounded">
              <Image src={nft.image} alt={nft.title} width={150} height={150} />
              <h2 className="mt-2 text-xl font-bold">{nft.title}</h2>
              <p>{nft.description}</p>
              <div className="flex items-center justify-between mt-4">
                <p className="font-bold">{points?.toString()} points</p>
                <button
                  onClick={() => handleUnstake(nft.stakeId)}
                  className="px-4 py-2 text-white bg-red-500 rounded"
                >
                  Unstake
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}