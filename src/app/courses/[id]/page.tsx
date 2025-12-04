'use client';

import { useParams } from 'next/navigation';
import { useAccount, useWriteContract } from 'wagmi';
import BadgesAbi from '~/contracts/Badges.json';

const courses = [
  {
    id: 1,
    title: 'Introduction to Blockchain',
    description: 'Learn the fundamentals of blockchain technology.',
    modules: [
      { id: 1, title: 'What is Blockchain?' },
      { id: 2, title: 'How Blockchain Works' },
      { id: 3, title: 'Types of Blockchains' },
    ],
  },
  {
    id: 2,
    title: 'Introduction to Cryptocurrency',
    description: 'Learn the basics of cryptocurrency.',
    modules: [
      { id: 1, title: 'What is Cryptocurrency?' },
      { id: 2, title: 'How to Buy Cryptocurrency' },
      { id: 3, title: 'How to Store Cryptocurrency' },
    ],
  },
  {
    id: 3,
    title: 'Introduction to DeFi',
    description: 'Learn the fundamentals of decentralized finance.',
    modules: [
      { id: 1, title: 'What is DeFi?' },
      { id: 2, title: 'How to Use DeFi' },
      { id: 3, title: 'The Future of DeFi' },
    ],
  },
];

export default function CoursePage() {
  const { id } = useParams();
  const course = courses.find((course) => course.id === Number(id));
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  const handleMint = async () => {
    if (address) {
      writeContract({
        address: process.env.NEXT_PUBLIC_BADGES_CONTRACT_ADDRESS as `0x${string}`,
        abi: BadgesAbi,
        functionName: 'mint',
        args: [address],
      });
    }
  };

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <p>{course.description}</p>
      <div className="mt-4">
        <h2 className="text-xl font-bold">Modules</h2>
        <ul className="list-disc list-inside">
          {course.modules.map((module) => (
            <li key={module.id}>{module.title}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <button
          onClick={handleMint}
          className="px-4 py-2 text-white bg-green-500 rounded"
        >
          Mint NFT Badge
        </button>
      </div>
    </div>
  );
}