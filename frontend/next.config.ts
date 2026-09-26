import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
  // pg는 Next.js 기본 외부 패키지 목록에 포함되어 있어 typeorm만 지정
  serverExternalPackages: ['typeorm']
};

export default nextConfig;
