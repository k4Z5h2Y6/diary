/** @type {import('next').NextConfig} */

const nextConfig = {
  //trueだと安全のため2回レンダリングされる
  reactStrictMode: false,
  swcMinify: false,
};

export default nextConfig;