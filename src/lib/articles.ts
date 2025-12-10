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

// In-memory storage for Cloudflare compatibility
let articles: Article[] = [
  {
    id: '1',
    title: 'Welcome to Next.js on Cloudflare',
    slug: 'welcome-nextjs-cloudflare',
    content: '# Welcome\n\nThis is a demo article running on Cloudflare Pages.',
    excerpt: 'A sample article to demonstrate the blog functionality.',
    tags: ['Next.js', 'Cloudflare', 'Demo'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export async function getArticles(): Promise<Article[]> {
  return articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return articles.find((article) => article.slug === slug) || null;
}

export async function getArticleById(id: string): Promise<Article | null> {
  return articles.find((article) => article.id === id) || null;
}

export async function createArticle(article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<Article> {
  // Check for duplicate slug
  if (articles.some(a => a.slug === article.slug)) {
    throw new Error('Slug already exists');
  }

  const newArticle: Article = {
    ...article,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  articles.push(newArticle);
  return newArticle;
}

export async function updateArticle(slug: string, updates: Partial<Omit<Article, 'id' | 'createdAt'>>): Promise<Article | null> {
  const index = articles.findIndex((a) => a.slug === slug);
  
  if (index === -1) return null;

  const updatedArticle = {
    ...articles[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  } as Article;

  articles[index] = updatedArticle;
  return updatedArticle;
}
