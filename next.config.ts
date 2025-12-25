import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'assets.vistwang.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'pub-f1c43c6342e59758f2b37b268b02b514.r2.dev',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '*.jamendo.com',
                pathname: '/**',
            },
            {
               protocol: 'https',
               hostname: '*.mzstatic.com', /* Apple Music / iTunes sometimes used as fallback placeholder elsewhere, just in case */
               pathname: '/**', 
            }
        ],
    },
};

export default withNextIntl(nextConfig);

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
