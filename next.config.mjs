/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NETWORK: process.env.NEXT_PUBLIC_NETWORK,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET" },
        ]
      }
    ]
  }
};

export default nextConfig;
