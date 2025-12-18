DROP TABLE IF EXISTS post_views;
CREATE TABLE post_views (
  slug TEXT PRIMARY KEY,
  views INTEGER DEFAULT 0
);

DROP TABLE IF EXISTS post_likes;
CREATE TABLE post_likes (
  slug TEXT PRIMARY KEY,
  likes INTEGER DEFAULT 0
);

DROP TABLE IF EXISTS comments;
CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS articles;
CREATE TABLE articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  tags TEXT, -- JSON string or comma separated
  cover_image TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
