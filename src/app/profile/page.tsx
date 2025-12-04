'use client';

import { useProfile } from '@farcaster/auth-kit';
import { useAccount, useBalance } from 'wagmi';
import { useState, useEffect } from 'react';
import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import Image from 'next/image';

interface Nft {
    id: {
        tokenId: string;
    };
    media: {
        gateway: string;
    }[];
    title: string;
}

const web3 = createAlchemyWeb3(`https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`);

export default function ProfilePage() {
  const { profile } = useProfile();
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });

  const [bio, setBio]          = useState('');
  const [twitter, setTwitter]    = useState('');
  const [github, setGithub]      = useState('');
  const [discord, setDiscord]    = useState('');
  const [telegram, setTelegram]  = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [nfts, setNfts]          = useState<Nft[]>([]);
  const [loading, setLoading]    = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
        if (profile?.username) {
            setLoading(true);
            const response = await fetch('/api/db', {
                method: 'POST',
                body: JSON.stringify({ action: 'getUserProfile', username: profile.username }),
            });
            const userProfile = await response.json();
            if (userProfile) {
                setBio(userProfile.bio);
                setTwitter(userProfile.twitter);
                setGithub(userProfile.github);
                setDiscord(userProfile.discord);
                setTelegram(userProfile.telegram);
            } else {
                setBio(profile.bio || '');
            }
            setLoading(false);
        }
    };
    fetchProfile();
  }, [profile]);

  useEffect(() => {
    const fetchNfts = async () => {
      if (address) {
        const nfts = await web3.alchemy.getNfts({
          owner: address,
        });
        setNfts(nfts.ownedNfts as Nft[]);
      }
    };
    fetchNfts();
  }, [address]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const { displayName, username } = profile || {};

  const handleSave = async () => {
    if (username) {
        await fetch('/api/db', {
            method: 'POST',
            body: JSON.stringify({ action: 'updateUserProfile', username, profile: { bio, twitter, github, discord, telegram } }),
        });
    }
    setIsEditing(false);
  };

  return (
    <div className="p-4">
      <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <div>
          <h1 className="text-2xl font-bold">{displayName}</h1>
          <p className="text-gray-500">@{username}</p>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold">Bio</h2>
        {isEditing ? (
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-gray-800 text-white p-2 rounded"
          />
        ) : (
          <p>{bio}</p>
        )}
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold">Socials</h2>
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Twitter"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              className="w-full bg-gray-800 text-white p-2 rounded"
            />
            <input
              type="text"
              placeholder="Github"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="w-full bg-gray-800 text-white p-2 rounded"
            />
            <input
              type="text"
              placeholder="Discord"
              value={discord}
              onChange={(e) => setDiscord(e.target.value)}
              className="w-full bg-gray-800 text-white p-2 rounded"
            />
            <input
              type="text"
              placeholder="Telegram"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              className="w-full bg-gray-800 text-white p-2 rounded"
            />
          </div>
        ) : (
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
            <p>Twitter: {twitter}</p>
            <p>Github: {github}</p>
            <p>Discord: {discord}</p>
            <p>Telegram: {telegram}</p>
          </div>
        )}
      </div>
      <div className="mt-4">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        )}
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold">Wallet</h2>
        <p>Address: {address}</p>
        <p>Balance: {balance?.formatted} {balance?.symbol}</p>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold">NFTs</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {nfts.map((nft) => (
            <div key={nft.id.tokenId} className="border p-2 rounded">
              <Image src={nft.media[0].gateway} alt={nft.title} width={150} height={150} />
              <p>{nft.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}