import { NextRequest, NextResponse } from 'next/server';
import { getArticles, createArticle } from '@/lib/articles';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tag = searchParams.get('tag');
  
  let articles = await getArticles();
  
  if (tag) {
    articles = articles.filter(article => article.tags.includes(tag));
  }
  
  return NextResponse.json(articles);
}

import { z } from 'zod';

const articleCreateSchema = z.object({
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  excerpt: z.string(),
  tags: z.array(z.string()),
  coverImage: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedBody = articleCreateSchema.parse(body);
    const article = await createArticle(validatedBody);
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
