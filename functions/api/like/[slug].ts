export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, params, request } = context;
  const slug = params.slug as string;

  // 简单防刷：用 IP 检查（可选）
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  // 这里可以加 KV 存储最近点赞 IP，但简单起见直接加（接受可能被刷）

  await env.DB.prepare(`
    INSERT INTO post_likes (slug, likes) VALUES (?, 1)
    ON CONFLICT(slug) DO UPDATE SET likes = likes + 1
  `).bind(slug).run();

  return new Response('OK');
};