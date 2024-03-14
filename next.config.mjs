/** @type {import('next').NextConfig} */

const nextConfig = {
  //trueだと安全のため2回レンダリングされる
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;