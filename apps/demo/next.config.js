/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['zenith-editor'],
  images: {
    // Use remotePatterns instead of deprecated domains
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https', 
        hostname: 'localhost',
      },
    ],
  },
};

module.exports = nextConfig;
