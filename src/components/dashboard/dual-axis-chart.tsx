"use client"

import { useEffect, useState } from "react"
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Zap, Leaf, Coins, ExternalLink, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface MarketData {
    current: {
        smp: number
        rec: number
        carbon: number
    }
    history: { date: string, smp: number, rec: number, carbon: number }[]
    risk_metrics?: { id: string, name: string, value: string, trend: "increasing" | "decreasing" | "stable" }[]
}

export function DualAxisChart() {
    const [data, setData] = useState<MarketData | null>(null)
    const [activeTab, setActiveTab] = useState<"ALL" | "SMP" | "REC" | "CARBON">("ALL")
    const [commodities, setCommodities] = useState<any[]>([])

    useEffect(() => {
        fetch("/data/market-data.json")
            .then(res => res.json())
            .then(json => {
                setData(json)
                if (json.risk_metrics) setCommodities(json.risk_metrics.filter((m: any) => m.id.includes('price')))
            })
    }, [])

    if (!data) return <div className="h-[400px] bg-slate-800/50 animate-pulse rounded-xl" />

    const history = data.history
    const current = data.current
    const yesterday = history[history.length - 2]

    // Calculations for cards
    const smpChange = ((current.smp - yesterday.smp) / yesterday.smp) * 100
    const recChange = ((current.rec - yesterday.rec) / yesterday.rec) * 100
    const carbonChange = ((current.carbon - yesterday.carbon) / yesterday.carbon) * 100

    const metrics = [
        {
            id: "SMP",
            label: "SMP (실시간)",
            value: `${current.smp.toFixed(2)}`,
            unit: "원/kWh",
            change: smpChange,
            icon: Zap,
            color: "text-blue-500",
            yAxisId: "left",
            lineColor: "#3b82f6"
        },
        {
            id: "REC",
            label: "REC (현물 평균)",
            value: `${current.rec.toLocaleString()}`,
            unit: "원/REC",
            change: recChange,
            icon: Coins,
            color: "text-emerald-500",
            yAxisId: "right",
            lineColor: "#10b981"
        },
        {
            id: "CARBON",
            label: "탄소배출권 (KAU24)",
            value: `${current.carbon.toLocaleString()}`,
            unit: "원/t",
            change: carbonChange,
            icon: Leaf,
            color: "text-orange-500",
            yAxisId: "right",
            lineColor: "#f97316"
        }
    ]

    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-card bg-slate-900/90 border-slate-700/50 p-4 rounded-xl shadow-2xl backdrop-blur-md">
                    <p className="text-slate-400 text-xs font-black uppercase mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex justify-between items-center gap-4 text-sm font-bold my-1">
                            <span style={{ color: entry.color }}>{entry.name}:</span>
                            <span className="text-white font-mono">{entry.value.toLocaleString()} {entry.name === 'SMP' ? '원/kWh' : '원'}</span>
                        </div>
                    ))}
                </div>
            )
        }
        return null
    }

    return (
        <div className="w-full h-full flex flex-col glass-card rounded-2xl p-6 border-white/5 relative group hover:border-emerald-500/20 transition-all">
            {/* Header Area: Title & Tabs */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-xl font-black text-white tracking-tight uppercase">에너지 마켓 트렌드 (7일)</h3>
                    <p className="text-xs text-slate-500 font-bold mt-1">주요 에너지 지표 통합 분석 제공</p>
                </div>
                <div className="flex gap-1 bg-slate-900/50 p-1 rounded-lg border border-white/5">
                    {["ALL", "SMP", "REC", "CARBON"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={cn(
                                "px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-md transition-all",
                                activeTab === tab
                                    ? "bg-slate-800 text-white shadow-sm"
                                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Ticker Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {metrics.map((metric, i) => (
                    <div
                        key={i}
                        className={cn(
                            "rounded-xl p-4 flex flex-col justify-between transition-all cursor-pointer border",
                            activeTab === metric.id || activeTab === "ALL"
                                ? "bg-white/[0.03] border-white/10"
                                : "bg-transparent border-transparent opacity-50 hover:opacity-100 hover:bg-white/[0.02]"
                        )}
                        onClick={() => setActiveTab(metric.id as any)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <metric.icon className={cn("size-4", metric.color)} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{metric.id}</span>
                            </div>
                            <div className={cn("flex items-center gap-1 text-[10px] font-bold",
                                metric.change > 0 ? "text-red-400" : metric.change < 0 ? "text-blue-400" : "text-slate-400"
                            )}>
                                {metric.change > 0 ? <TrendingUp className="size-3" /> : metric.change < 0 ? <TrendingDown className="size-3" /> : <Minus className="size-3" />}
                                {Math.abs(metric.change).toFixed(2)}%
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-white font-mono tracking-tighter">{metric.value}</span>
                            <span className="text-[10px] text-slate-500 font-bold">{metric.unit}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart Area */}
            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="date"
                            stroke="rgba(255,255,255,0.3)"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => val.split('-').slice(1).join('/')}
                            dy={10}
                        />

                        {(activeTab === "ALL" || activeTab === "SMP") && (
                            <YAxis
                                yAxisId="left"
                                orientation="left"
                                stroke="#60a5fa"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => val.toFixed(0)}
                                domain={['auto', 'auto']}
                            />
                        )}

                        {(activeTab === "ALL" || activeTab === "REC" || activeTab === "CARBON") && (
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#34d399"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => (val / 1000).toFixed(0) + 'k'}
                                domain={['auto', 'auto']}
                            />
                        )}

                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />

                        {(activeTab === "ALL" || activeTab === "SMP") && (
                            <Line yAxisId="left" type="monotone" dataKey="smp" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }} name="SMP" animationDuration={1000} />
                        )}
                        {(activeTab === "ALL" || activeTab === "REC") && (
                            <Line yAxisId="right" type="monotone" dataKey="rec" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }} name="REC" animationDuration={1000} />
                        )}
                        {(activeTab === "ALL" || activeTab === "CARBON") && (
                            <Line yAxisId="right" type="monotone" dataKey="carbon" stroke="#f97316" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0, fill: '#f97316' }} name="Carbon" animationDuration={1000} />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Green Inflation Tracker (New Feature) */}
            {commodities.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="size-3 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Green Inflation Tracker</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {commodities.map((item, i) => (
                            <div key={i} className="flex items-center justify-between bg-white/[0.02] rounded-lg px-3 py-2 border border-white/5">
                                <span className="text-[10px] text-slate-400 font-bold">{item.name}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono font-black text-white">{item.value}</span>
                                    {item.trend === 'increasing' ? <TrendingUp className="size-3 text-red-500" /> :
                                        item.trend === 'decreasing' ? <TrendingDown className="size-3 text-blue-500" /> :
                                            <Minus className="size-3 text-slate-500" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
