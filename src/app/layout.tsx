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
  title: "에코머니 (EcoMoney) - 국내 맞춤형 친환경 에너지 수익성 분석기",
  description: "주소와 면적만 입력하면 공공 데이터를 기반으로 태양광 발전 수익을 실시간으로 계산해 드립니다. 가장 똑똑한 에너지 재테크의 시작, 에코머니.",
  keywords: ["태양광 수익 계산기", "에너지 재테크", "친환경 에너지", "태양광 발전 수익", "에코머니"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900 min-h-screen selection:bg-emerald-500/20 selection:text-emerald-900`}
      >
        <div className="relative flex min-h-screen flex-col">
          <TopNav />
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-slate-200 py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">E</div>
                  <span className="font-black text-xl tracking-tight text-slate-900">EcoMoney</span>
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  © 2026 에코머니 (EcoMoney). 데이터는 공공 포털 및 기상청 API를 기반으로 시뮬레이션됩니다.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
