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
  themeColor: "#FAFAF8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "대한김치 (DAEHAN KIMCHI) | 대한민국 정통 프리미엄 발효김치",
  description: "대한민국 정통 비법과 안심 식자재로 담근 대한김치 공식 쇼핑몰. 하노이 현지 직접 생산, 신선 직배송.",
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
      <head>
        <link rel="icon" href="/images/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/images/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/favicon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var isExt = function(msg, src, stack) {
                  var s = (msg || '') + ' ' + (src || '') + ' ' + (stack || '');
                  return s.indexOf('chrome-extension:') !== -1 ||
                         s.indexOf('moz-extension:') !== -1 ||
                         s.indexOf('inpage.js') !== -1 ||
                         s.indexOf('extensionPageScript') !== -1 ||
                         s.indexOf('registerSolana') !== -1 ||
                         s.indexOf('se is not a function') !== -1 ||
                         s.indexOf('egjidjbogllichdcondbcbdnbeappgdph') !== -1 ||
                         s.indexOf('fldfpgipfncgndfolcbkdeeknbbbnhcc') !== -1;
                };
                var origOnError = window.onerror;
                window.onerror = function(msg, src, line, col, err) {
                  if (isExt(msg, src, err && err.stack)) return true;
                  if (origOnError) return origOnError.apply(this, arguments);
                };
                window.addEventListener('error', function(e) {
                  if (isExt(e.message, e.filename, e.error && e.error.stack)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                  }
                }, true);
                window.addEventListener('unhandledrejection', function(e) {
                  var r = e.reason;
                  if (isExt(r && r.message, '', r && r.stack)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                  }
                }, true);
              })();
            `
          }}
        />
      </head>
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
