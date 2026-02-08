"use client"

import { useEffect, useState } from "react"
import { BatteryCharging, HardHat, Link as LinkIcon, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface GridStatus {
    region: string
    status: "available" | "warning" | "saturated"
    capacity: string
    wait_time: string
}

interface Commodity {
    id: string
    name: string
    value: string
    status: "safe" | "caution"
    trend: "increasing" | "decreasing" | "stable"
}

export function RiskAndMaterials() {
    const [gridData, setGridData] = useState<GridStatus[]>([])
    const [commodities, setCommodities] = useState<Commodity[]>([])

    useEffect(() => {
        fetch("/data/market-data.json")
            .then(res => res.json())
            .then(data => {
                if (data.grid_status) setGridData(data.grid_status.slice(0, 5)) // Show top 5 grid statuses
            })
    }, [])

    return (
        <div className="h-full">
            {/* Grid Status Card */}
            <div className="glass-card rounded-2xl p-6 border-white/5 flex flex-col gap-4 h-full">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                        <LinkIcon className="size-5" />
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-white">전력망 접속 현황</h4>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">주요 지역별 선로 용량</p>
                    </div>
                </div>
                <div className="space-y-3 flex-1 overflow-auto custom-scrollbar pr-2">
                    {gridData.map((grid, i) => (
                        <div key={i} className="flex justify-between items-center text-sm group hover:bg-white/5 p-2 rounded-lg transition-colors">
                            <span className="font-bold text-slate-300 w-16">{grid.region}</span>
                            <div className="flex gap-2 items-center">
                                <span className={cn(
                                    "text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border",
                                    grid.status === 'available' ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5" :
                                        grid.status === 'warning' ? "text-yellow-500 border-yellow-500/20 bg-yellow-500/5" :
                                            "text-red-500 border-red-500/20 bg-red-500/5"
                                )}>
                                    {grid.status === 'available' ? '여유' : grid.status === 'warning' ? '혼잡' : '포화'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
