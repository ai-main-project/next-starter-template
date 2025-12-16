const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(process.cwd(), 'posts');
const outputDirectory = path.join(process.cwd(), 'src', 'data');
const outputFile = path.join(outputDirectory, 'posts.json');

function generatePosts() {
  // Ensure output directory exists
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
  }

  // Check if posts directory exists
  if (!fs.existsSync(postsDirectory)) {
    console.warn('Posts directory not found, generating empty posts.json');
    fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
    return;
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
      };
    });

  // Sort posts by date
  const sortedArticles = allArticlesData.sort((a, b) => {
    if (a.createdAt < b.createdAt) {
      return 1;
    } else {
      return -1;
    }
  });

  fs.writeFileSync(outputFile, JSON.stringify(sortedArticles, null, 2));
  console.log(`Successfully generated ${outputFile} with ${sortedArticles.length} posts.`);
}

generatePosts();
