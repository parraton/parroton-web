/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/ton-client/:path*',
        destination: `${process.env.NEXT_PUBLIC_TON_CLIENT_URL}/:path*`,
      },
    ]
  },
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
