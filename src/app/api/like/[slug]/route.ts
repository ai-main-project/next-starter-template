import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';



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
    const result = await env.DB.prepare(
      'SELECT likes FROM post_likes WHERE slug = ?'
    )
      .bind(slug)
      .first<{ likes: number }>();

    return NextResponse.json({ likes: result?.likes || 0 });
  } catch (error) {
    console.error('Error fetching likes:', error);
    return NextResponse.json({ error: 'Failed to fetch likes' }, { status: 500 });
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
    // Increment like count
    await env.DB.prepare(
      `INSERT INTO post_likes (slug, likes) VALUES (?, 1)
       ON CONFLICT(slug) DO UPDATE SET likes = likes + 1`
    )
      .bind(slug)
      .run();

    const result = await env.DB.prepare(
      'SELECT likes FROM post_likes WHERE slug = ?'
    )
      .bind(slug)
      .first<{ likes: number }>();

    return NextResponse.json({ likes: result?.likes || 0 });
  } catch (error) {
    console.error('Error updating likes:', error);
    return NextResponse.json({ error: 'Failed to update likes' }, { status: 500 });
  }
}
