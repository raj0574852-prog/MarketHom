import { NextResponse } from 'next/server';
import { GuestPostListing, INITIAL_GUEST_POSTS } from '@/lib/guestPostStore';

const globalForGuestPosts = globalThis as unknown as {
  guestPosts: GuestPostListing[] | undefined;
};

if (globalForGuestPosts.guestPosts === undefined) {
  globalForGuestPosts.guestPosts = INITIAL_GUEST_POSTS;
}

export async function GET() {
  return NextResponse.json({
    success: true,
    listings: globalForGuestPosts.guestPosts || INITIAL_GUEST_POSTS
  });
}

export async function POST(request: Request) {
  try {
    const body: GuestPostListing = await request.json();
    if (!body.domainName || !body.title) {
      return NextResponse.json({ success: false, error: 'Domain name and title are required' }, { status: 400 });
    }

    let current = globalForGuestPosts.guestPosts || INITIAL_GUEST_POSTS;
    const existingIndex = current.findIndex(p => p.id === body.id);

    if (existingIndex >= 0) {
      current[existingIndex] = { ...current[existingIndex], ...body };
    } else {
      const newListing = { ...body, id: body.id || 'gp-' + Date.now() };
      current = [newListing, ...current];
    }

    globalForGuestPosts.guestPosts = current;

    return NextResponse.json({
      success: true,
      listings: current
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save guest post listing' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    }

    if (globalForGuestPosts.guestPosts) {
      globalForGuestPosts.guestPosts = globalForGuestPosts.guestPosts.filter(p => p.id !== id);
    }

    return NextResponse.json({
      success: true,
      listings: globalForGuestPosts.guestPosts || []
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete listing' }, { status: 500 });
  }
}
