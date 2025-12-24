import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';



export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { env } = await getCloudflareContext({ async: true });

  if (!env.DB) {
    return NextResponse.json({ error: 'Database not available' }, { status: 500 });
  }

  try {
    // Increment view count
    await env.DB.prepare(
      `INSERT INTO post_views (slug, views) VALUES (?, 1)
       ON CONFLICT(slug) DO UPDATE SET views = views + 1`
    )
      .bind(slug)
      .run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating views:', error);
    return NextResponse.json({ error: 'Failed to update views' }, { status: 500 });
  }
}
