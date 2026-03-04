import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.nevaobjects.id",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
