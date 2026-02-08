"use client"

import { useEffect, useState } from "react"
import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface RiskMetric {
    id: string
    name: string
    value: string
    unit: string
    trend: "increasing" | "decreasing" | "stable"
    status: "safe" | "warning" | "caution"
}

export function GreenInflationTracker() {
    const [commodities, setCommodities] = useState<RiskMetric[]>([])

    useEffect(() => {
        fetch("/data/market-data.json")
            .then(res => res.json())
            .then(json => {
                if (json.risk_metrics) {
                    setCommodities(json.risk_metrics)
                }
            })
    }, [])

    if (commodities.length === 0) return null

    return (
        <div className="glass-card rounded-[2rem] p-6 border-white/5 relative overflow-hidden group hover:border-emerald-500/20 transition-all flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Activity className="size-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white italic">GREEN INFLATION</h3>
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">원자재 가격 지수 추적</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar pr-2 space-y-3">
                {commodities.map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/[0.03] rounded-2xl p-4 border border-white/5 hover:border-emerald-500/30 transition-all hover:bg-white/[0.05] group/item">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <div className={cn(
                                    "size-1.5 rounded-full",
                                    item.status === 'safe' ? "bg-emerald-500" :
                                        item.status === 'warning' ? "bg-red-500" : "bg-amber-500"
                                )} />
                                <span className="text-[11px] text-slate-400 font-black uppercase tracking-widest">{item.name}</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-black text-white font-mono">{item.value}</span>
                                <span className="text-[10px] text-slate-500 font-bold uppercase">{item.unit}</span>
                            </div>
                        </div>
                        <div className={cn(
                            "size-10 rounded-xl flex items-center justify-center transition-colors",
                            item.trend === 'increasing' ? "bg-red-500/10 text-red-500" :
                                item.trend === 'decreasing' ? "bg-blue-500/10 text-blue-500" :
                                    "bg-slate-500/10 text-slate-500"
                        )}>
                            {item.trend === 'increasing' ? <TrendingUp className="size-5" /> :
                                item.trend === 'decreasing' ? <TrendingDown className="size-5" /> :
                                    <Minus className="size-5" />}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    신재생에너지 인프라 구축의 핵심 원자재 시황을 추적합니다.
                </p>
            </div>
        </div>
    )
}
