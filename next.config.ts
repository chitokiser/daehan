import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups", // 구글 로그인 팝업 차단(COOP) 에러 방지
          },
        ],
      },
    ];
  },
};

export default nextConfig;
