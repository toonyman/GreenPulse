"use client"

import { EnergyStatusBoard } from "@/components/dashboard/energy-status-board"
import { DualAxisChart } from "@/components/dashboard/dual-axis-chart"
import { RegionalAnalysis } from "@/components/dashboard/regional-analysis"
import { EnergyMixCard } from "@/components/dashboard/energy-mix-card"
import { RE100Card } from "@/components/dashboard/re100-card"
import { NewsFeed } from "@/components/dashboard/news-feed"
import { GreenInflationTracker } from "@/components/dashboard/green-inflation-tracker"
import { GreenCheckSummaryCard } from "@/components/dashboard/green-check-summary-card"
import { EnergyCalendar } from "@/components/dashboard/energy-calendar"
import { EcoCalculator } from "@/components/dashboard/eco-calculator"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col gap-10 mb-20">
      {/* Unified Page Title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white lowercase">
          EXECUTIVE <span className="text-emerald-500 uppercase">DASHBOARD</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-base font-medium">
          실시간 에너지 시장 동향과 투자 핵심 지표를 한눈에 확인하세요.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Tier 1: Real-time Energy Status (12:0 Layout) */}
        <section>
          <EnergyStatusBoard />
        </section>

        {/* Tier 2: Interactive Utilities & Core Performance (8:4 Split) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-8 flex flex-col gap-8">
            <section>
              <EnergyCalendar />
            </section>
            <section className="min-h-[450px]">
              <DualAxisChart />
            </section>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-8">
            <section>
              <EcoCalculator />
            </section>
            <section className="flex-1">
              <RegionalAnalysis />
            </section>
          </div>
        </div>

        {/* Tier 3: Deep Analysis & Insights (4:4:4 Layout) */}
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

        {/* Tier 4: Market Intelligence (3:9 Layout) - Compact Footer Info */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-3 h-full">
            <RE100Card />
          </div>
          <div className="lg:col-span-9 h-full">
            <NewsFeed />
          </div>
        </section>
      </div>
    </div>
  )
}
