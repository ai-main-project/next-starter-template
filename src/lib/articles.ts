import { getCloudflareContext } from '@opennextjs/cloudflare';

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getArticles(): Promise<Article[]> {
  try {
    const { env } = await getCloudflareContext();
    
    if (!env.DB) {
      console.error('Database not available');
      return [];
    }

    const { results } = await env.DB.prepare(
      'SELECT * FROM articles ORDER BY created_at DESC'
    ).run();

    return results.map((row: any) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      content: row.content,
      excerpt: row.excerpt,
      tags: row.tags ? row.tags.split(',') : [],
      coverImage: row.cover_image,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const { env } = await getCloudflareContext();
    
    if (!env.DB) {
      return null;
    }

    const article = await env.DB.prepare(
      'SELECT * FROM articles WHERE slug = ? OR id = ?'
    ).bind(slug, slug).first();

    if (!article) return null;

    const row = article as any;
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      content: row.content,
      excerpt: row.excerpt,
      tags: row.tags ? row.tags.split(',') : [],
      coverImage: row.cover_image,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Deprecated or unused in file-system mode, but kept for compatibility if needed
export async function getArticleById(id: string): Promise<Article | null> {
  return getArticleBySlug(id);
}

