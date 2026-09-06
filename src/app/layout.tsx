import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExtensionErrorShield from "@/components/ExtensionErrorShield";
import GoogleAuthProvider from "@/components/GoogleAuthProvider";
import { UserWalletProvider } from "@/context/UserWalletContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-kr",
  preload: false,
});

export const viewport: Viewport = {
  themeColor: "#0b0c10",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "대한김치 (DAEHAN KIMCHI) | 대한민국 정통 프리미엄 발효김치",
  description: "대한민국 30년 전통 비법과 안심 식자재로 담근 대한김치 공식 쇼핑몰. 하노이 현지 직접 생산, 신선 직배송.",
  manifest: "/manifest.json",
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
};

import PWAInit from "@/components/PWAInit";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} ${notoSansKr.variable}`}>
        <ExtensionErrorShield />
        <PWAInit />
        <GoogleAuthProvider>
          <UserWalletProvider>
            <Header />
            <main style={{ minHeight: "100vh" }}>{children}</main>
            <Footer />
          </UserWalletProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  );
}
