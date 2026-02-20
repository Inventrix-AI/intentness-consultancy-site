/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  images: {
    formats: ["image/webp"],
    deviceSizes: [640, 768, 1024, 1280, 1536]
  }
};

export default nextConfig;
