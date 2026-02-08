"use client"

import { EnergyMixChart } from "@/components/dashboard/energy-mix-chart"

import { DualAxisChart } from "@/components/dashboard/dual-axis-chart"
import { RegionalAnalysis } from "@/components/dashboard/regional-analysis"
import { RE100Card } from "@/components/dashboard/re100-card"
import { NewsFeed } from "@/components/dashboard/news-feed"
import { ArrowRight, Newspaper } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col gap-10 mb-20">

      {/* Page Title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white lowercase">
          EXECUTIVE <span className="text-emerald-500 uppercase">DASHBOARD</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-base font-medium">
          실시간 에너지 시장 동향과 투자 핵심 지표를 한눈에 확인하세요.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Section B & C: Main Charts & Risk Metrics */}
        {/* Top Section: Main Market & Intelligence */}
        {/* Top Section: Main Market & Intelligence (3-Column Layout) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* Left Column: Grid Status & Energy Mix (3/12) */}
          <div className="lg:col-span-3 h-full min-h-[600px]">
            <RegionalAnalysis />
          </div>

          {/* Center Column: Main Market Chart (6/12) */}
          <div className="lg:col-span-6 min-h-[600px]">
            <DualAxisChart />
          </div>

          {/* Right Column: Corporate RE100 (3/12) */}
          <div className="lg:col-span-3 h-full min-h-[400px]">
            <RE100Card />
          </div>

        </section>

        {/* Section E: News (Bottom Section) */}
        <section className="min-h-[600px]">
          <div className="glass-card rounded-2xl p-6 border-white/5 flex flex-col min-h-[600px]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                  <Newspaper className="size-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">주요 에너지 뉴스</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">글로벌 마켓 최신 동향</p>
                </div>
              </div>
              <Link href="/news" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white flex items-center gap-2 transition-colors">
                뉴스 더보기 <ArrowRight className="size-3" />
              </Link>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar pr-4">
              <NewsFeed />
            </div>
          </div>
        </section>

      </div>

    </div>
  )
}
