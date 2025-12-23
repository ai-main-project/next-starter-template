import { z } from 'zod';

const envSchema = z.object({
  // R2 Storage
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET_NAME: z.string().min(1),
  PUBLIC_URL_BASE: z.string().url(),

  // Security
  NEXT_PUBLIC_ADMIN_API_KEY: z.string().min(16),

  // Database (Cloudflare D1 binding is handled via getCloudflareContext, 
  // but we can track the binding name)
  DB_BINDING: z.string().default('DB'),
});

const getEnv = () => {
  const env = {
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID || 'f1c43c6342e59758f2b37b268b02b514',
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID || '318d41de2442e2c51ae3ebeed0a47451',
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY || 'b858d579b5840e0aeebdd6ae8547cb542ed845ffe8438844386bcfb95374ebca',
    R2_BUCKET_NAME: process.env.R2_BUCKET_NAME || 'vist-blog-assets',
    PUBLIC_URL_BASE: process.env.NEXT_PUBLIC_ASSETS_BASE_URL || 'https://assets.vistwang.com',
    NEXT_PUBLIC_ADMIN_API_KEY: process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'placeholder-very-long-secret-key-change-me',
    DB_BINDING: process.env.DB_BINDING,
  };

  if (process.env.NODE_ENV === 'production') {
    return envSchema.parse(env);
  }

  return env as z.infer<typeof envSchema>;
};

export const env = getEnv();
