import { getCloudflareContext } from '@opennextjs/cloudflare';

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  coverImage?: string;
  views?: number;
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
      `SELECT a.*, COALESCE(v.views, 0) as views 
       FROM articles a 
       LEFT JOIN post_views v ON a.slug = v.slug 
       ORDER BY a.created_at DESC`
    ).run();

    return results.map((row: any) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      content: row.content,
      excerpt: row.excerpt,
      tags: row.tags ? row.tags.split(',') : [],
      coverImage: row.cover_image,
      views: row.views,
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
      `SELECT a.*, COALESCE(v.views, 0) as views 
       FROM articles a 
       LEFT JOIN post_views v ON a.slug = v.slug 
       WHERE a.slug = ? OR a.id = ?`
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
      views: row.views,
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

