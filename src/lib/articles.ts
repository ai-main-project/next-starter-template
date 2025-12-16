import postsData from '@/data/posts.json';

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

// Cast the imported data to Article[] to ensure type safety
// We use 'as unknown as Article[]' because JSON import types can be inferred loosely
const articles: Article[] = postsData as unknown as Article[];

export async function getArticles(): Promise<Article[]> {
  return articles;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const article = articles.find((post) => post.slug === slug);
  return article || null;
}

// Deprecated or unused in file-system mode, but kept for compatibility if needed
export async function getArticleById(id: string): Promise<Article | null> {
  return getArticleBySlug(id);
}

