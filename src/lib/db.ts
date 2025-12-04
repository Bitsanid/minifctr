import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

interface Post {
  id: number;
  author: string;
  content: string;
  reactions: Record<string, number>;
  comments: Comment[];
}

interface Comment {
  id: number;
  author: string;
  content: string;
}

interface UserProfile {
  username: string;
  bio: string;
  twitter: string;
  github: string;
  discord: string;
  telegram: string;
}

interface NftListing {
  id: number;
  title: string;
  description: string;
  image: string;
  price: string;
  nftAddress: string;
  tokenId: number;
}

interface DbData {
  posts: Post[];
  userProfiles: Record<string, UserProfile>;
  nftListings: NftListing[];
}

const defaultData: DbData = {
  posts: [
    {
      id: 1,
      author: 'dwr.eth',
      content: 'Just finished the "Introduction to Blockchain" course! #web3 #blockchain',
      reactions: { '👍': 12, '❤️': 5, '🚀': 3 },
      comments: [{ id: 1, author: 'v.eth', content: 'Nice!' }],
    },
    {
      id: 2,
      author: 'greg.eth',
      content: 'Just minted my first NFT badge! #nft #crypto',
      reactions: { '👍': 8, '❤️': 2, '🔥': 1 },
      comments: [],
    },
  ],
  userProfiles: {},
  nftListings: [
    {
        id: 1,
        title: 'Blockchain Basics Badge',
        description: 'A badge for completing the "Introduction to Blockchain" course.',
        image: 'https://via.placeholder.com/150',
        price: '0.01',
        nftAddress: '0xYOUR_BADGES_CONTRACT_ADDRESS',
        tokenId: 0,
    },
    {
        id: 2,
        title: 'Crypto Fundamentals Badge',
        description: 'A badge for completing the "Introduction to Cryptocurrency" course.',
        image: 'https://via.placeholder.com/150',
        price: '0.01',
        nftAddress: '0xYOUR_BADGES_CONTRACT_ADDRESS',
        tokenId: 1,
    },
  ],
};

const adapter = new JSONFile<DbData>('db.json');
const db = new Low(adapter, defaultData);
await db.read();

export const getPosts = () => db.data.posts;

export const createPost = async (author: string, content: string) => {
  const newPost: Post = {
    id: db.data.posts.length + 1,
    author,
    content,
    reactions: {},
    comments: [],
  };
  db.data.posts.unshift(newPost);
  await db.write();
  return newPost;
};

export const addReaction = async (postId: number, emoji: string) => {
  const post = db.data.posts.find((p) => p.id === postId);
  if (post) {
    post.reactions[emoji] = (post.reactions[emoji] || 0) + 1;
    await db.write();
  }
};

export const addComment = async (postId: number, author: string, content: string) => {
  const post = db.data.posts.find((p) => p.id === postId);
  if (post) {
    const newComment: Comment = {
      id: post.comments.length + 1,
      author,
      content,
    };
    post.comments.push(newComment);
    await db.write();
  }
};

export const getUserProfile = (username: string) => {
  return db.data.userProfiles[username];
};

export const updateUserProfile = async (username: string, profile: Partial<UserProfile>) => {
  const existingProfile = db.data.userProfiles[username] || {
    username,
    bio: '',
    twitter: '',
    github: '',
    discord: '',
    telegram: '',
  };
  const updatedProfile = { ...existingProfile, ...profile };
  db.data.userProfiles[username] = updatedProfile;
  await db.write();
  return updatedProfile;
};

export const getNftListings = () => db.data.nftListings;

export const createNftListing = async (listing: Omit<NftListing, 'id'>) => {
  const newListing: NftListing = {
    id: db.data.nftListings.length + 1,
    ...listing,
  };
  db.data.nftListings.push(newListing);
  await db.write();
  return newListing;
};

export const buyNftListing = async (listingId: number) => {
    db.data.nftListings = db.data.nftListings.filter((listing) => listing.id !== listingId);
    await db.write();
};
