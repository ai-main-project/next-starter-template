import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';



export async function POST(request: NextRequest) {
  try {
    const { env } = await getCloudflareContext();
    
    if (!env.DB) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const body = await request.json();
    const { title, slug, content, excerpt, tags } = body as any;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const tagsString = Array.isArray(tags) ? tags.join(',') : tags;

    await env.DB.prepare(
      `INSERT INTO articles (id, slug, title, content, excerpt, tags, cover_image, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(id, slug, title, content, excerpt || '', tagsString || '', (body as any).cover_image || null, now, now)
      .run();

    return NextResponse.json({ 
      success: true, 
      id: id, // Return UUID for redirection
      message: 'Article created successfully' 
    });

  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article', details: String(error) }, 
      { status: 500 }
    );
  }
}
