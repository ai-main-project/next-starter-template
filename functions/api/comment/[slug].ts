export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, params, request } = context;
  const slug = params.slug as string;
  const { content } = await request.json<{ content: string }>();

  if (!content || content.trim().length === 0 || content.length > 500) {
    return new Response('Invalid comment', { status: 400 });
  }

  // 简单防 spam：长度限制 + 可加 CAPTCHA 后期

  await env.DB.prepare('INSERT INTO comments (slug, content) VALUES (?, ?)')
    .bind(slug, content.trim())
    .run();

  return new Response('OK');
};