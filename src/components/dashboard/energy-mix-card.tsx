"use client"

import { useEffect, useState } from "react"
import { PieChart as ReChartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Activity, PieChart } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnergyShare {
    name: string
    value: number
}

const COLORS = {
    '태양광': '#10b981', // Emerald
    '풍력': '#06b6d4',   // Cyan
    '원자력': '#3b82f6', // Blue
    'LNG': '#f59e0b',   // Amber
    '화력': '#64748b'    // Slate
}

export function EnergyMixCard() {
    const [mixData, setMixData] = useState<EnergyShare[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch("/data/market-data.json")
            .then(res => res.json())
            .then(data => {
                if (data.shares) setMixData(data.shares)
            })
            .catch(err => console.error("Failed to load energy mix data:", err))
            .finally(() => setIsLoading(false))
    }, [])

    if (isLoading) return (
        <div className="glass-card rounded-[2rem] p-6 border-white/5 h-full animate-pulse bg-white/5 flex flex-col items-center justify-center">
            <div className="size-10 rounded-full bg-white/10 mb-4" />
            <div className="h-4 w-32 bg-white/10 rounded mb-2" />
            <div className="h-3 w-48 bg-white/10 rounded" />
        </div>
    )

    return (
        <div className="glass-card rounded-[2rem] p-6 flex flex-col h-full border-white/5 relative overflow-hidden group hover:border-emerald-500/20 transition-all">
            <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <PieChart className="size-5" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-white">에너지 발전 비중</h3>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">실시간 에너지원별 믹스</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                <div className="relative h-[250px] w-full">
                    {/* Central Label (Positioned absolutely over the chart) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                        <span className="text-[13px] text-emerald-500 font-black uppercase tracking-[0.2em] mb-1">Renewable</span>
                        <span className="text-4xl font-black text-white font-mono tracking-tighter">23%</span>
                    </div>

                    <ResponsiveContainer width="100%" height="100%">
                        <ReChartsPie>
                            <Pie
                                data={mixData}
                                cx="50%"
                                cy="50%"
                                innerRadius={75}
                                outerRadius={95}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                                animationDuration={1000}
                                animationBegin={0}
                            >
                                {mixData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[entry.name as keyof typeof COLORS] || '#475569'}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "12px",
                                    fontSize: "13px",
                                    fontWeight: "bold"
                                }}
                                itemStyle={{ color: "#fff" }}
                                formatter={(value: any) => [`${value}%`, '비중']}
                            />
                        </ReChartsPie>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                    {mixData.map((item, i) => (
                        <div key={i} className="flex justify-between items-center bg-white/[0.03] rounded-xl px-4 py-3 border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-2">
                                <div className={cn(
                                    "size-2 rounded-full",
                                    item.name === '신재생' ? "bg-emerald-500" :
                                        item.name === '원자력' ? "bg-blue-500" :
                                            item.name === 'LNG' ? "bg-amber-500" : "bg-slate-500"
                                )} />
                                <span className="text-sm text-slate-400 font-bold">{item.name}</span>
                            </div>
                            <span className="text-base font-mono font-black text-white">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-slate-500">
                <Activity className="size-4" />
                <span className="text-xs font-bold">실시간 전력 수급량 기준 데이터</span>
            </div>
        </div>
    )
}
