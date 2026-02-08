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
    const [activeTab, setActiveTab] = useState<"GRID" | "SOLAR" | "MIX">("GRID")
    const [gridData, setGridData] = useState<GridStatus[]>([])
    const [solarData, setSolarData] = useState<SolarRanking[]>([])
    const [mixData, setMixData] = useState<EnergyShare[]>([])

    useEffect(() => {
        fetch("/data/market-data.json")
            .then(res => res.json())
            .then(data => {
                if (data.grid_status) setGridData(data.grid_status)
                if (data.solar_rankings) setSolarData(data.solar_rankings)
                if (data.shares) setMixData(data.shares)
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
                        activeTab === 'GRID' ? "bg-purple-500/10 text-purple-500" :
                            activeTab === 'SOLAR' ? "bg-orange-500/10 text-orange-500" :
                                "bg-blue-500/10 text-blue-500"
                    )}>
                        {activeTab === 'GRID' ? <Zap className="size-5" /> :
                            activeTab === 'SOLAR' ? <Sun className="size-5" /> :
                                <PieChart className="size-5" />}
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-lg font-black text-white whitespace-nowrap">
                            {activeTab === 'GRID' ? "전력망 접속 현황" :
                                activeTab === 'SOLAR' ? "태양광 발전 명당" :
                                    "에너지 발전 비중"}
                        </h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider truncate">
                            {activeTab === 'GRID' ? "한전 선로 여유 용량" :
                                activeTab === 'SOLAR' ? "지역별 발전 효율 랭킹" :
                                    "실시간 에너지원별 믹스"}
                        </p>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="flex p-1 bg-slate-900/50 rounded-xl border border-white/5 w-full">
                    {[
                        { id: 'GRID', label: '전력망' },
                        { id: 'SOLAR', label: '발전효율' },
                        { id: 'MIX', label: '에너지믹스' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all whitespace-nowrap",
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
                                        <span className="text-[10px] text-slate-500 uppercase font-black">여유용량</span>
                                        <span className="text-sm font-mono font-bold text-white">{grid.capacity}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={cn(
                                        "text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1",
                                        grid.status === 'available' ? "text-emerald-500 bg-emerald-500/10" :
                                            grid.status === 'warning' ? "text-yellow-500 bg-yellow-500/10" :
                                                "text-red-500 bg-red-500/10"
                                    )}>
                                        {grid.status === 'available' ? "즉시 접속" :
                                            grid.status === 'warning' ? "혼잡" :
                                                "접속 불가"}
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-bold">{grid.wait_time}</p>
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
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="text-[10px] px-1 py-0 h-auto border-amber-500/30 text-amber-500 bg-amber-500/5">
                                            <Sun className="size-3 mr-1" /> {item.hours}
                                        </Badge>
                                        <span className="text-[10px] text-slate-500 font-bold">일조시간</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-500 uppercase font-black">발전 효율</p>
                                    <p className="text-lg font-mono font-black text-emerald-400">{item.efficiency}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'MIX' && (
                    <div className="flex flex-col gap-4">
                        <div className="relative size-40 mx-auto mt-4">
                            <div className="absolute inset-0 rounded-full border-[12px] border-slate-800"
                                style={{
                                    background: `conic-gradient(
                                         #10b981 0% 15%, 
                                         #3b82f6 15% 23%, 
                                         #f59e0b 23% 53%, 
                                         #64748b 53% 100%
                                     )`
                                }}>
                            </div>
                            <div className="absolute inset-[12px] bg-[#0A0A0A] rounded-full flex flex-col items-center justify-center">
                                <span className="text-xs text-emerald-500 font-bold uppercase tracking-wider">Renewable</span>
                                <span className="text-3xl font-black text-white font-mono">23%</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {mixData.map((item, i) => (
                                <div key={i} className="flex justify-between items-center text-xs p-2 rounded-lg bg-white/5">
                                    <span className="text-slate-400 font-bold">{item.name}</span>
                                    <span className="text-white font-mono font-black">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
