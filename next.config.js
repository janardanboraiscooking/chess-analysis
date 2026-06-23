/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => [],
  webpack: (config, { isServer }) => {
    // Ignore importScripts paths in workers
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
