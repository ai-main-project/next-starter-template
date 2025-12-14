export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, params } = context;
  const slug = params.slug as string;

  // UPSERT 增加阅读量（SQLite 支持）
  await env.DB.prepare(`
    INSERT INTO post_views (slug, views) VALUES (?, 1)
    ON CONFLICT(slug) DO UPDATE SET views = views + 1
  `).bind(slug).run();

  return new Response('OK');
};