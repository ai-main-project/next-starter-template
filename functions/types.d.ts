import { D1Database } from '@cloudflare/workers-types';

declare global {
  type Env = CloudflareEnv & {
    DB: D1Database;
  };
}
