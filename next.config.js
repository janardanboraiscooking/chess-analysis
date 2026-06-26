/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staticPageGenerationTimeout: 300,
  },
  headers: async () => [],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};
module.exports = nextConfig;
