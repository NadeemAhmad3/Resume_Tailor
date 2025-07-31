/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add this 'images' block.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;