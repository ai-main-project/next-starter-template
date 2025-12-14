export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, params } = context;
  const slug = (params.slug as string) || 'home'; // 可选 slug，默认首页

  // 获取阅读量
  const viewsRes = await env.DB.prepare('SELECT views FROM post_views WHERE slug = ?')
    .bind(slug)
    .first();
  const views = viewsRes ? viewsRes.views : 0;

  // 如果没有记录，插入 0
  if (!viewsRes) {
    await env.DB.prepare('INSERT INTO post_views (slug, views) VALUES (?, 0)')
      .bind(slug)
      .run();
  }

  // 获取点赞
  const likesRes = await env.DB.prepare('SELECT likes FROM post_likes WHERE slug = ?')
    .bind(slug)
    .first();
  const likes = likesRes ? likesRes.likes : 0;

  if (!likesRes) {
    await env.DB.prepare('INSERT INTO post_likes (slug, likes) VALUES (?, 0)')
      .bind(slug)
      .run();
  }

  // 获取评论
  const comments = await env.DB.prepare('SELECT content, created_at FROM comments WHERE slug = ? ORDER BY created_at DESC')
    .bind(slug)
    .all();

  return Response.json({
    views,
    likes,
    comments: comments.results || [],
  });
};