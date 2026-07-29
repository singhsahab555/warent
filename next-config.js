/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },

  // Fail the production build on type errors — catch issues before deploy, not after
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },

  experimental: {
    // Keep Server Actions body size reasonable for form submissions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig