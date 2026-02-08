"use client"

import { useEffect, useState } from "react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts"

interface HistoryData {
    date: string
    smp: number
    rec: number
    carbon: number
}

interface ShareData {
    name: string
    value: number
}

interface MarketData {
    history: HistoryData[]
    shares: ShareData[]
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#6366f1", "#ef4444", "#8b5cf6"]

export function PriceTrendChart() {
    const [data, setData] = useState<HistoryData[] | null>(null)

    useEffect(() => {
        fetch("/data/market-data.json")
            .then((res) => res.json())
            .then((json) => setData(json.history))
    }, [])

    if (!data) return <div className="h-[300px] w-full bg-white/5 animate-pulse rounded-2xl" />

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                        dataKey="date"
                        stroke="rgba(255,255,255,0.4)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => value.split("-").slice(1).join("/")}
                    />
                    <YAxis
                        stroke="rgba(255,255,255,0.4)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => value.toLocaleString()}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.9)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "12px",
                            fontSize: "14px"
                        }}
                    />
                    <Line type="monotone" dataKey="smp" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: "#3b82f6", stroke: "#fff" }} name="SMP" />
                    <Line type="monotone" dataKey="rec" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: "#10b981", stroke: "#fff" }} name="REC" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export function EnergyMixChart() {
    const [data, setData] = useState<ShareData[] | null>(null)

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
            })
    }, [])

    if (!data) return <div className="h-[300px] w-full bg-white/5 animate-pulse rounded-2xl" />

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={8}
                        dataKey="value"
                        nameKey="name"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.9)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "12px",
                            fontSize: "12px"
                        }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value) => <span className="text-xs font-bold tracking-wider text-slate-400">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export function MarketCharts() {
    return (
        <div className="grid gap-8">
            <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 ml-1">가격 추이 (최근 7일)</h4>
                <PriceTrendChart />
            </div>
            <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">에너지원별 발전 비중</h4>
                <EnergyMixChart />
            </div>
        </div>
    )
}
