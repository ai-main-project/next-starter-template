import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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

const postsDirectory = path.join(process.cwd(), 'posts');

export async function getArticles(): Promise<Article[]> {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allArticlesData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        id: slug,
        slug,
        content,
        title: data.title || 'Untitled',
        excerpt: data.excerpt || '',
        tags: data.tags || [],
        coverImage: data.coverImage,
        createdAt: data.date || new Date().toISOString(),
        updatedAt: data.date || new Date().toISOString(),
      } as Article;
    });

  // Sort posts by date
  return allArticlesData.sort((a, b) => {
    if (a.createdAt < b.createdAt) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      id: slug,
      slug,
      content,
      title: data.title || 'Untitled',
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      coverImage: data.coverImage,
      createdAt: data.date || new Date().toISOString(),
      updatedAt: data.date || new Date().toISOString(),
    } as Article;
  } catch (error) {
    return null;
  }
}

// Deprecated or unused in file-system mode, but kept for compatibility if needed
export async function getArticleById(id: string): Promise<Article | null> {
  return getArticleBySlug(id);
}

