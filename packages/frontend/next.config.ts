import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${process.env.BACKEND_URL || 'http://localhost:3001'}/uploads/:path*`, // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
