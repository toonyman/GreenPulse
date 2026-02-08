"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts"
import { Zap, Battery, Sun, TrendingUp, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnergyData {
    current: {
        supply: number
        demand: number
        reserve_power: number
        reserve_ratio: number
        renewable_share: number
        updated_at: string
    }
    chart_data: Array<{
        time: string
        supply: number
        demand: number
        renewable: number
    }>
}

export function EnergyStatusBoard() {
    const [data, setData] = useState<EnergyData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/energy-status')
                const json = await res.json()
                setData(json)
            } catch (err) {
                console.error("Failed to fetch energy status:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
        const interval = setInterval(fetchData, 600000) // 10분마다 갱신
        return () => clearInterval(interval)
    }, [])

    if (loading || !data) {
        return <EnergyStatusSkeleton />
    }

    return (
        <div className="space-y-4">
            {/* 핵심 지표 카드 - More Readable */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatusCard
                    title="현재 전력 수요"
                    value={`${data.current.demand} GW`}
                    subValue={`공급능력: ${data.current.supply} GW`}
                    icon={Zap}
                    color="text-amber-400"
                    bg="bg-amber-400/5"
                />
                <StatusCard
                    title="예비율"
                    value={`${data.current.reserve_ratio}%`}
                    subValue={`예비전력: ${data.current.reserve_power} GW`}
                    icon={Battery}
                    color="text-emerald-400"
                    bg="bg-emerald-400/5"
                    status={data.current.reserve_ratio > 10 ? '정상' : '주의'}
                />
                <StatusCard
                    title="신재생 에너지 비중"
                    value={`${data.current.renewable_share}%`}
                    subValue="현재 발전량 기준"
                    icon={Sun}
                    color="text-sky-400"
                    bg="bg-sky-400/5"
                />
            </div>

            {/* 수급 곡선 차트 - Optimized for Readability */}
            <div className="glass-card rounded-2xl p-5 border-white/5 relative overflow-hidden bg-white/[0.01]">
                <div className="flex items-center justify-between mb-5 px-1">
                    <div className="flex items-center gap-3">
                        <div className="size-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                            <TrendingUp className="size-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-200 tracking-wider">ENERGY FLOW</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">실시간 전력 수급 추이 (24H)</p>
                        </div>
                    </div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                        Update: {new Date(data.current.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>

                <div className="h-[240px] w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.chart_data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorRenewable" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis
                                dataKey="time"
                                stroke="#64748b"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                interval={3}
                            />
                            <YAxis
                                stroke="#64748b"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => `${val}G`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '10px',
                                    fontSize: '12px'
                                }}
                            />
                            <Legend
                                iconType="circle"
                                iconSize={8}
                                wrapperStyle={{ paddingTop: '15px', fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}
                            />
                            <Area type="monotone" dataKey="supply" name="공급" stroke="#f59e0b" fillOpacity={1} fill="url(#colorSupply)" strokeWidth={2} />
                            <Area type="monotone" dataKey="demand" name="수요" stroke="#ef4444" fillOpacity={1} fill="url(#colorDemand)" strokeWidth={2} />
                            <Area type="monotone" dataKey="renewable" name="재생" stroke="#10b981" fillOpacity={1} fill="url(#colorRenewable)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

function StatusCard({ title, value, subValue, icon: Icon, color, bg, status }: any) {
    return (
        <div className="glass-card rounded-2xl p-5 border-white/5 relative overflow-hidden bg-white/[0.01] flex items-center justify-between group transition-all hover:bg-white/[0.03]">
            <div className="flex items-center gap-4">
                <div className={cn("size-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", bg, color)}>
                    <Icon className="size-5" />
                </div>
                <div>
                    <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{title}</h4>
                    <div className="text-xl font-black text-white font-mono tracking-tight leading-none">{value}</div>
                    <p className="text-xs text-slate-500 font-bold mt-1.5 leading-none">{subValue}</p>
                </div>
            </div>
            {status && (
                <span className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider h-fit",
                    status === '정상' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                )}>
                    {status}
                </span>
            )}
            <div className={cn("absolute -right-6 -bottom-6 size-24 blur-3xl opacity-[0.03] rounded-full", bg)} />
        </div>
    )
}

function EnergyStatusSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-[160px] glass-card rounded-[2rem] bg-white/5 border-white/5" />
                ))}
            </div>
            <div className="h-[400px] glass-card rounded-[2rem] bg-white/5 border-white/5" />
        </div>
    )
}
