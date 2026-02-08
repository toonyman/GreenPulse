import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/layout/top-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "그린펄스 (Green Pulse) - 친환경 에너지 투자 정보 대시보드",
  description: "한국 친환경 에너지(태양광, 풍력, REC, 탄소배출권) 투자 정보와 실시간 시장 데이터를 제공합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#020617] text-slate-100 min-h-screen selection:bg-emerald-500/30 selection:text-emerald-200`}
      >
        <div className="relative flex min-h-screen flex-col">
          <TopNav />
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-white/5 py-8 md:py-12 bg-black/20">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm text-slate-500">
                © 2026 그린펄스 (Green Pulse). All rights reserved. 데이터는 공공 API를 통해 제공됩니다.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
