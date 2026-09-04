import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '://cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
