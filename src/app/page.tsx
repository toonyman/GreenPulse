"use client"

import { DualAxisChart } from "@/components/dashboard/dual-axis-chart"
import { RegionalAnalysis } from "@/components/dashboard/regional-analysis"
import { EnergyMixCard } from "@/components/dashboard/energy-mix-card"
import { GreenCheckSummaryCard } from "@/components/dashboard/green-check-summary-card"
import { GreenInflationTracker } from "@/components/dashboard/green-inflation-tracker"
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
        {/* Tier 1: Core Performance & Regional Status (8:4 Layout) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-8 min-h-[550px]">
            <DualAxisChart />
          </div>
          <div className="lg:col-span-4 h-full min-h-[550px]">
            <RegionalAnalysis />
          </div>
        </section>

        {/* Tier 2: Deep Analysis & Insights (4:4:4 Layout) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-4 h-full">
            <EnergyMixCard />
          </div>
          <div className="lg:col-span-4 h-full">
            <GreenCheckSummaryCard />
          </div>
          <div className="lg:col-span-4 h-full">
            <GreenInflationTracker />
          </div>
        </section>

        {/* Tier 3: Market Intelligence (3:9 Layout) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Lower Importance Widgets (3/12) */}
          <div className="lg:col-span-3 h-full">
            <RE100Card />
          </div>

          {/* News Area (9/12) */}
          <div className="lg:col-span-9 h-full">
            <div className="glass-card rounded-[2rem] p-8 border-white/5 flex flex-col h-full min-h-[500px]">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400">
                    <Newspaper className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">주요 에너지 뉴스</h3>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">글로벌 마켓 인사이트</p>
                  </div>
                </div>
                <Link href="/news" className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white flex items-center gap-2 transition-all">
                  뉴스 더보기 <ArrowRight className="size-4" />
                </Link>
              </div>

              <div className="flex-1 overflow-auto custom-scrollbar pr-4 text-sm font-medium">
                <NewsFeed />
              </div>
            </div>
          </div>
        </section>

      </div>

    </div>
  )
}
