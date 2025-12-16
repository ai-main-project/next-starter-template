import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone' as const,
    experimental: {
        outputFileTracingIncludes: {
            '/blog': ['./posts/**/*'],
            '/zh/blog': ['./posts/**/*'],
            '/en/blog': ['./posts/**/*'],
        },
    } as any,
};

export default withNextIntl(nextConfig);

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
