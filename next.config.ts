import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    eslint: {
        // Disables ESLint during the build process
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
