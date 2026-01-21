/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "r2.devsradar.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
