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
};

export default nextConfig;
