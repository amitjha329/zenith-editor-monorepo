/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['zenith-editor'],
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
