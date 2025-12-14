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
    const viewsResult = await env.DB.prepare(
      'SELECT views FROM post_views WHERE slug = ?'
    )
      .bind(slug)
      .first<{ views: number }>();

    const likesResult = await env.DB.prepare(
      'SELECT likes FROM post_likes WHERE slug = ?'
    )
      .bind(slug)
      .first<{ likes: number }>();

    return NextResponse.json({
      views: viewsResult?.views || 0,
      likes: likesResult?.likes || 0,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
