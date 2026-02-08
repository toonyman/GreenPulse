"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, Minus, Zap, Leaf, Coins, Wind } from "lucide-react"
import { cn } from "@/lib/utils"

interface MarketData {
    current: {
        smp: number
        rec: number
        carbon: number
        reserve_ratio: number
    }
    shares: { name: string, value: number }[]
    history: { date: string, smp: number, rec: number, carbon: number }[]
}

export function DashboardTicker() {
    const [data, setData] = useState<MarketData | null>(null)

    useEffect(() => {
        fetch("/data/market-data.json")
            .then(res => res.json())
            .then(setData)
    }, [])

    if (!data) return <div className="h-20 w-full bg-white/5 animate-pulse rounded-xl" />

    const yesterday = data.history[data.history.length - 2]

    // Calculations
    const smpChange = ((data.current.smp - yesterday.smp) / yesterday.smp) * 100
    const recChange = ((data.current.rec - yesterday.rec) / yesterday.rec) * 100
    const carbonChange = ((data.current.carbon - yesterday.carbon) / yesterday.carbon) * 100

    // Renewable Share (Sum of Solar, Wind, Hydro, Biomass from shares if available, otherwise estimate)
    const renewableShare = data.shares
        ? data.shares.filter(s => ["태양광", "풍력", "수력", "바이오"].includes(s.name)).reduce((acc, curr) => acc + curr.value, 0)
        : 23 // Default if not found

    const metrics = [
        {
            label: "SMP (실시간)",
            value: `${data.current.smp.toFixed(2)}`,
            unit: "원/kWh",
            change: smpChange,
            icon: Zap,
            color: "text-blue-500"
        },
        {
            label: "REC (현물 평균)",
            value: `${data.current.rec.toLocaleString()}`,
            unit: "원/REC",
            change: recChange,
            icon: Coins,
            color: "text-emerald-500"
        },
        {
            label: "탄소배출권 (KAU24)",
            value: `${data.current.carbon.toLocaleString()}`,
            unit: "원/t",
            change: carbonChange,
            icon: Leaf,
            color: "text-orange-500"
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.map((metric, i) => (
                <div key={i} className="glass-card rounded-xl p-4 border-white/5 bg-slate-900/50 flex flex-col justify-between group hover:border-white/10 transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{metric.label}</span>
                        <metric.icon className={cn("size-4 opacity-50", metric.color)} />
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-white font-mono tracking-tighter">{metric.value}</span>
                        <span className="text-[10px] text-slate-500 font-bold">{metric.unit}</span>
                    </div>
                    <div className={cn("flex items-center gap-1 text-[10px] font-bold mt-1",
                        metric.change > 0 ? "text-red-400" : metric.change < 0 ? "text-blue-400" : "text-slate-400"
                    )}>
                        {metric.change > 0 ? <TrendingUp className="size-3" /> : metric.change < 0 ? <TrendingDown className="size-3" /> : <Minus className="size-3" />}
                        {Math.abs(metric.change).toFixed(2)}%
                    </div>
                </div>
            ))}
        </div>
    )
}
