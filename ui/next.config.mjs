/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Ensure that all assets are correctly handled in production
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
