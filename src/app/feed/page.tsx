'use client';

import { useState, useEffect } from 'react';
import { useProfile } from '@farcaster/auth-kit';

interface Comment {
  id: number;
  author: string;
  content: string;
}

interface Post {
  id: number;
  author: string;
  content: string;
  reactions: Record<string, number>;
  comments: Comment[];
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [commentingPostId, setCommentingPostId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');
  const { profile } = useProfile();
  const username = profile?.username || 'You';

  const fetchPosts = async () => {
    const response = await fetch('/api/db?action=getPosts');
    const data = await response.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    await fetch('/api/db', {
      method: 'POST',
      body: JSON.stringify({ action: 'createPost', author: username, content: newPostContent }),
    });
    await fetchPosts();
    setNewPostContent('');
    setIsCreatePostModalOpen(false);
  };

  const handleAddReaction = async (postId: number, emoji: string) => {
    await fetch('/api/db', {
      method: 'POST',
      body: JSON.stringify({ action: 'addReaction', postId, emoji }),
    });
    await fetchPosts();
  };

  const handleAddComment = async (postId: number) => {
    await fetch('/api/db', {
      method: 'POST',
      body: JSON.stringify({ action: 'addComment', postId, author: username, content: newComment }),
    });
    await fetchPosts();
    setNewComment('');
    setCommentingPostId(null);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Social Feed</h1>
        <button
          onClick={() => setIsCreatePostModalOpen(true)}
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          Create Post
        </button>
      </div>

      {isCreatePostModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-4 bg-gray-800 rounded">
            <h2 className="text-xl font-bold">Create Post</h2>
            <div className="mt-4">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full p-2 text-white bg-gray-700 rounded"
                rows={4}
              />
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setIsCreatePostModalOpen(false)}
                className="px-4 py-2 text-white bg-gray-500 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                className="px-4 py-2 text-white bg-green-500 rounded"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="p-4 border rounded">
            <p className="font-bold">{post.author}</p>
            <p>{post.content}</p>
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex space-x-2">
                {Object.entries(post.reactions).map(([emoji, count]) => (
                  <button
                    key={emoji}
                    onClick={() => handleAddReaction(post.id, emoji)}
                    className="flex items-center space-x-1"
                  >
                    <span>{emoji}</span>
                    <span>{count}</span>
                  </button>
                ))}
                <button onClick={() => handleAddReaction(post.id, '👍')}>👍</button>
              </div>
              <button onClick={() => setCommentingPostId(post.id)}>Comment</button>
            </div>
            {commentingPostId === post.id && (
              <div className="mt-2">
                <div className="space-y-2">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-2">
                      <p className="font-bold">{comment.author}</p>
                      <p>{comment.content}</p>
                    </div>
                  ))}
                </div>
                <div className="flex mt-2 space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-2 text-white bg-gray-700 rounded"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="px-4 py-2 text-white bg-green-500 rounded"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}