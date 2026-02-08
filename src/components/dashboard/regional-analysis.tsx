"use client"

import { useEffect, useState } from "react"
import { MapPin, Zap, AlertTriangle, CheckCircle2, Sun, CloudSun, PieChart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface GridStatus {
    region: string
    status: "available" | "warning" | "saturated"
    capacity: string
    wait_time: string
}

interface SolarRanking {
    region: string
    efficiency: string
    hours: string
    rank: number
}

interface EnergyShare {
    name: string
    value: number
}

export function RegionalAnalysis() {
    const [activeTab, setActiveTab] = useState<"GRID" | "SOLAR">("GRID")
    const [gridData, setGridData] = useState<GridStatus[]>([])
    const [solarData, setSolarData] = useState<SolarRanking[]>([])

    useEffect(() => {
        fetch("/data/market-data.json")
            .then(res => res.json())
            .then(data => {
                if (data.grid_status) setGridData(data.grid_status)
                if (data.solar_rankings) setSolarData(data.solar_rankings)
            })
    }, [])

    return (
        <div className="glass-card rounded-[2rem] p-6 flex flex-col h-full border-white/5 relative overflow-hidden group hover:border-emerald-500/20 transition-all">
            {/* Header Area */}
            <div className="flex flex-col gap-5 mb-6 relative z-10">
                {/* Title Section */}
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "size-10 rounded-xl flex items-center justify-center transition-colors shrink-0",
                        activeTab === 'GRID' ? "bg-purple-500/10 text-purple-500" : "bg-orange-500/10 text-orange-500"
                    )}>
                        {activeTab === 'GRID' ? <Zap className="size-5" /> : <Sun className="size-5" />}
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-lg font-black text-white whitespace-nowrap">
                            {activeTab === 'GRID' ? "전력망 접속 현황" : "태양광 발전 명당"}
                        </h3>
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider truncate">
                            {activeTab === 'GRID' ? "한전 선로 여유 용량" : "지역별 발전 효율 랭킹"}
                        </p>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="flex p-1 bg-slate-900/50 rounded-xl border border-white/5 w-full">
                    {[
                        { id: 'GRID', label: '전력망' },
                        { id: 'SOLAR', label: '발전효율' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "flex-1 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition-all whitespace-nowrap",
                                activeTab === tab.id
                                    ? "bg-slate-800 text-white shadow-sm border border-white/5"
                                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto custom-scrollbar pr-2 relative z-10">
                {activeTab === 'GRID' && (
                    <div className="space-y-3">
                        {gridData.map((grid, i) => (
                            <div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex justify-between items-center group hover:bg-white/[0.04] transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-slate-300 w-12">{grid.region}</span>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-500 uppercase font-black">여유용량</span>
                                        <span className="text-base font-mono font-bold text-white">{grid.capacity}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={cn(
                                        "text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-1.5",
                                        grid.status === 'available' ? "text-emerald-500 bg-emerald-500/10" :
                                            grid.status === 'warning' ? "text-yellow-500 bg-yellow-500/10" :
                                                "text-red-500 bg-red-500/10"
                                    )}>
                                        {grid.status === 'available' ? "즉시 접속" :
                                            grid.status === 'warning' ? "혼잡" :
                                                "접속 불가"}
                                    </div>
                                    <p className="text-xs text-slate-500 font-bold">{grid.wait_time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'SOLAR' && (
                    <div className="space-y-3">
                        {solarData.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                <div className={cn(
                                    "size-8 rounded-lg flex items-center justify-center text-xs font-black",
                                    i === 0 ? "bg-amber-500 text-black" : "bg-slate-800 text-slate-500 border border-white/10"
                                )}>
                                    {item.rank}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-white text-sm">{item.region}</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <Badge variant="outline" className="text-xs px-2 py-0.5 h-auto border-amber-500/30 text-amber-500 bg-amber-500/5">
                                            <Sun className="size-3.5 mr-1" /> {item.hours}
                                        </Badge>
                                        <span className="text-xs text-slate-500 font-bold">일조시간</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 uppercase font-black">발전 효율</p>
                                    <p className="text-xl font-mono font-black text-emerald-400">{item.efficiency}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    )
}
