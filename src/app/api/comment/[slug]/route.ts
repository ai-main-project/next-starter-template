import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { env } = await getCloudflareContext();

  if (!env.DB) {
    return NextResponse.json({ error: 'Database not available' }, { status: 500 });
  }

  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM comments WHERE slug = ? ORDER BY created_at DESC'
    )
      .bind(slug)
      .all();

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { env } = await getCloudflareContext();

  if (!env.DB) {
    return NextResponse.json({ error: 'Database not available' }, { status: 500 });
  }

  try {
    const { content } = await request.json() as { content: string };

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    await env.DB.prepare(
      'INSERT INTO comments (id, slug, content, created_at) VALUES (?, ?, ?, ?)'
    )
      .bind(id, slug, content, createdAt)
      .run();

    return NextResponse.json({ id, slug, content, created_at: createdAt });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}
