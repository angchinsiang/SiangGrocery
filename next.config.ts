import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "47xwtq7mot.ufs.sh",
        pathname: "/f/**",
      },
    ],
  },
};

export default nextConfig;
