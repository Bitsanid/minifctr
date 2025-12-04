'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import MarketplaceAbi from '~/contracts/Marketplace.json';
import Image from 'next/image';

interface Listing {
  id: number;
  title: string;
  description: string;
  image: string;
  price: string;
  nftAddress: string;
  tokenId: number;
}

export default function MarketplacePage() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [listings, setListings] = useState<Listing[]>([]);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [nftAddress, setNftAddress] = useState('');
  const [tokenId, setTokenId] = useState(0);
  const [price, setPrice] = useState('');

  const fetchListings = async () => {
    const response = await fetch('/api/db?action=getNftListings');
    const data = await response.json();
    setListings(data);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleBuy = async (listingId: number, price: string) => {
    if (address) {
      await writeContractAsync({
        address: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS as `0x${string}`,
        abi: MarketplaceAbi,
        functionName: 'buy',
        args: [listingId],
        value: parseEther(price),
      });
      await fetch('/api/db', {
        method: 'POST',
        body: JSON.stringify({ action: 'buyNftListing', listingId }),
      });
      await fetchListings();
    }
  };

  const handleList = async () => {
    if (address && nftAddress && tokenId && price) {
        await fetch('/api/db', {
            method: 'POST',
            body: JSON.stringify({ action: 'createNftListing', listing: { title, description, image, price, nftAddress, tokenId } }),
        });
      await writeContractAsync({
        address: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS as `0x${string}`,
        abi: MarketplaceAbi,
        functionName: 'list',
        args: [nftAddress, tokenId, parseEther(price)],
      });
      await fetchListings();
      setIsSellModalOpen(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Marketplace</h1>
        <button
          onClick={() => setIsSellModalOpen(true)}
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          Sell NFT
        </button>
      </div>

      {isSellModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-4 bg-gray-800 rounded">
            <h2 className="text-xl font-bold">Sell NFT</h2>
            <div className="mt-4 space-y-2">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 text-white bg-gray-700 rounded"
              />
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 text-white bg-gray-700 rounded"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full p-2 text-white bg-gray-700 rounded"
              />
              <input
                type="text"
                placeholder="NFT Address"
                value={nftAddress}
                onChange={(e) => setNftAddress(e.target.value)}
                className="w-full p-2 text-white bg-gray-700 rounded"
              />
              <input
                type="number"
                placeholder="Token ID"
                value={tokenId}
                onChange={(e) => setTokenId(Number(e.target.value))}
                className="w-full p-2 text-white bg-gray-700 rounded"
              />
              <input
                type="text"
                placeholder="Price (ETH)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 text-white bg-gray-700 rounded"
              />
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setIsSellModalOpen(false)}
                className="px-4 py-2 text-white bg-gray-500 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleList}
                className="px-4 py-2 text-white bg-green-500 rounded"
              >
                List NFT
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <div key={listing.id} className="p-4 border rounded">
            <Image src={listing.image} alt={listing.title} width={150} height={150} />
            <h2 className="mt-2 text-xl font-bold">{listing.title}</h2>
            <p>{listing.description}</p>
            <div className="flex items-center justify-between mt-4">
              <p className="font-bold">{listing.price} ETH</p>
              <button
                onClick={() => handleBuy(listing.id, listing.price)}
                className="px-4 py-2 text-white bg-green-500 rounded"
              >
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}