import { NextResponse } from 'next/server';
import { getPosts, createPost, addReaction, addComment, getUserProfile, updateUserProfile, getNftListings, createNftListing, buyNftListing } from '~/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  switch (action) {
    case 'getPosts':
      return NextResponse.json(getPosts());
    case 'getNftListings':
      return NextResponse.json(getNftListings());
    default:
      return NextResponse.json({ error: 'Invalid action' });
  }
}

export async function POST(request: Request) {
  const { action, ...data } = await request.json();

  switch (action) {
    case 'createPost':
      const { author, content } = data;
      return NextResponse.json(await createPost(author, content));
    case 'addReaction':
      const { postId, emoji } = data;
      await addReaction(postId, emoji);
      return NextResponse.json({ success: true });
    case 'addComment':
      const { postId: commentPostId, author: commentAuthor, content: commentContent } = data;
      await addComment(commentPostId, commentAuthor, commentContent);
      return NextResponse.json({ success: true });
    case 'getUserProfile':
        const { username } = data;
        return NextResponse.json(getUserProfile(username));
    case 'updateUserProfile':
        const { username: updateUserUsername, profile } = data;
        return NextResponse.json(await updateUserProfile(updateUserUsername, profile));
    case 'createNftListing':
        const { listing } = data;
        return NextResponse.json(await createNftListing(listing));
    case 'buyNftListing':
        const { listingId } = data;
        await buyNftListing(listingId);
        return NextResponse.json({ success: true });
    default:
      return NextResponse.json({ error: 'Invalid action' });
  }
}