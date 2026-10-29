import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // يوجد package-lock.json في مجلد أعلى؛ نثبّت جذر المشروع هنا
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
