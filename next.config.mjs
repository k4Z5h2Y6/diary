/** @type {import('next').NextConfig} */

const nextConfig = {
  //trueだと安全のため2回レンダリングされる
  reactStrictMode: false,
  // next/imageでbrob形式を読み込む
  // images: {
  //   unoptimized: true,
  // },
};

export default nextConfig;