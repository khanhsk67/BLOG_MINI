/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add this section to proxy requests to your backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // CHANGE THIS URL to match your actual backend URL and port
        destination: 'http://localhost:3000/api/:path*', 
      },
    ]
  },
}

export default nextConfig