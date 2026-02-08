"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ShieldCheck, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface RiskMetric {
    id: string
    name: string
    value: string
    status: "caution" | "safe"
    trend: "increasing" | "decreasing" | "stable"
    description: string
}

export function RiskIndicators() {
    const [metrics, setMetrics] = useState<RiskMetric[]>([])

    useEffect(() => {
        fetch("/data/market-data.json")
            .then((res) => res.json())
            .then((data) => {
                if (data.risk_metrics) {
                    setMetrics(data.risk_metrics)
                }
            })
    }, [])

    if (metrics.length === 0) return null

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="size-6 text-orange-500" />
                <h3 className="text-2xl font-black text-white">투자 위험 지표</h3>
            </div>

            <div className="space-y-4">
                {metrics.map((metric) => (
                    <div key={metric.id} className="glass-card rounded-2xl p-6 border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:bg-white/[0.02] transition-colors">
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                                <h4 className="text-lg font-bold text-white">{metric.name}</h4>
                                <Badge
                                    className={cn(
                                        "font-black px-3 py-1 rounded-full uppercase tracking-widest text-xs",
                                        metric.status === "caution"
                                            ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                                            : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    )}
                                    variant="outline"
                                >
                                    {metric.status === "caution" ? (
                                        <span className="flex items-center gap-1"><AlertTriangle className="size-3" /> 주의</span>
                                    ) : (
                                        <span className="flex items-center gap-1"><ShieldCheck className="size-3" /> 안전</span>
                                    )}
                                </Badge>
                            </div>
                            <p className="text-sm text-slate-400 font-medium">{metric.description}</p>
                        </div>

                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                            <div className="text-right">
                                <div className="text-2xl font-black text-white font-mono tracking-tighter">{metric.value}</div>
                                <div className="flex items-center justify-end gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                                    {metric.trend === "increasing" && <TrendingUp className="size-3 text-red-400" />}
                                    {metric.trend === "decreasing" && <TrendingDown className="size-3 text-blue-400" />}
                                    {metric.trend === "stable" && <Minus className="size-3 text-slate-400" />}
                                    <span>추세</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
