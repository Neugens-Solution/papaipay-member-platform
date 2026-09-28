/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  experimental: {
    serverActions: {
      // Listing image uploads go through Server Actions; default limit is 1MB.
      // Vercel caps function request bodies at 4.5MB.
      bodySizeLimit: "4.5mb",
    },
  },
};

export default nextConfig;
