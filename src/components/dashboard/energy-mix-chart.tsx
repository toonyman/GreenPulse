"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Zap } from "lucide-react"

interface ShareData {
    name: string
    value: number
}

const COLOR_MAP: Record<string, string> = {
    "태양광": "#10b981", // Emerald
    "풍력": "#06b6d4",   // Cyan
    "수력": "#3b82f6",   // Blue
    "바이오": "#84cc16", // Lime
    "원자력": "#f59e0b", // Amber
    "화력": "#64748b",   // Slate
    "석탄": "#475569",   // Slate Dark
    "LNG": "#94a3b8",    // Slate Light
    "기타": "#cbd5e1"    // Slate Lighter
}

export function EnergyMixChart() {
    const [data, setData] = useState<ShareData[]>([])
    const [renewableShare, setRenewableShare] = useState(0)

    useEffect(() => {
        fetch("/data/market-data.json")
            .then((res) => res.json())
            .then((json) => {
                const translatedShares = json.shares.map((share: ShareData) => {
                    const translations: Record<string, string> = {
                        "Solar": "태양광",
                        "Wind": "풍력",
                        "Hydro": "수력",
                        "Biomass": "바이오",
                        "Nuclear": "원자력",
                        "Coal": "석탄",
                        "LNG": "LNG"
                    }
                    return { ...share, name: translations[share.name] || share.name }
                })
                setData(translatedShares)

                // Calculate Renewable Share
                const totalRenewable = translatedShares
                    .filter((s: ShareData) => ["태양광", "풍력", "수력", "바이오"].includes(s.name))
                    .reduce((acc: number, curr: ShareData) => acc + curr.value, 0)
                setRenewableShare(totalRenewable)
            })
    }, [])

    if (data.length === 0) return <div className="h-full w-full bg-white/5 animate-pulse rounded-2xl" />

    return (
        <div className="glass-card rounded-2xl p-6 border-white/5 h-full flex flex-col relative">
            <div className="flex items-center gap-3 mb-2 relative z-10">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                    <Zap className="size-5" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-white">에너지원별 발전 비중</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">실시간 발전 믹스</p>
                </div>
            </div>

            <div className="flex-1 min-h-[250px] relative">
                {/* Central Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">재생에너지</span>
                    <span className="text-4xl font-black text-white font-mono tracking-tighter drop-shadow-lg">{renewableShare}%</span>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLOR_MAP[entry.name] || "#94a3b8"} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(15, 23, 42, 0.95)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "12px",
                                fontSize: "12px",
                                fontWeight: "bold",
                                color: "#fff"
                            }}
                            itemStyle={{ color: "#fff" }}
                            formatter={(value: any) => [`${value}%`, '비중']}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value) => <span className="text-xs font-bold text-slate-400 ml-1 mr-3">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
