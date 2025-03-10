/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300, // Delay rebuild after first change
      };
    }
    return config;
  },
  reactStrictMode: true,
  output: 'standalone',
};

export default nextConfig;
