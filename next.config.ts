import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    eslint: {
        // Disables ESLint during the build process
        ignoreDuringBuilds: false,
    },
};

export default nextConfig;
