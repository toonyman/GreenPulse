"use client"

import { useEffect, useState } from "react"
import { Award, Sparkles, MapPin, Zap, ArrowUpRight, Network, Mountain, DollarSign } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface GreenCheckSummary {
    code: string
    name: string
    province: string
    total_score: number
    grade: string
    ai_summary: string
    solar_score: number
    grid_score: number
    density_score: number
    subsidy_score: number
}

export function GreenCheckSummaryCard() {
    const [allData, setAllData] = useState<Record<string, any>>({})
    const [selectedCode, setSelectedCode] = useState<string>("50110")
    const [data, setData] = useState<GreenCheckSummary | null>(null)

    useEffect(() => {
        fetch("/data/location-master.json")
            .then(res => res.json())
            .then((json: Record<string, any>) => {
                setAllData(json)
                const representative = json[selectedCode] || Object.values(json)[0]
                if (representative) {
                    setData({
                        code: selectedCode,
                        name: representative.name,
                        province: representative.province,
                        total_score: representative.total_score,
                        grade: representative.grade,
                        ai_summary: representative.ai_summary,
                        solar_score: representative.solar_score,
                        grid_score: representative.grid_score,
                        density_score: representative.density_score,
                        subsidy_score: representative.subsidy_score
                    })
                }
            })
            .catch(err => console.error("Failed to load green check summary:", err))
    }, [selectedCode])

    const handleRegionChange = (code: string) => {
        setSelectedCode(code)
    }

    const regionsList = Object.entries(allData).map(([code, item]: [string, any]) => ({
        code: code,
        label: `${item.province} ${item.name}`
    })).sort((a, b) => a.label.localeCompare(b.label))

    if (!data) return (
        <div className="glass-card rounded-[2rem] p-6 border-white/5 h-full animate-pulse bg-white/5 flex flex-col items-center justify-center">
            <div className="size-10 rounded-full bg-white/10 mb-4" />
            <div className="h-4 w-32 bg-white/10 rounded mb-2" />
            <div className="h-3 w-48 bg-white/10 rounded" />
        </div>
    )

    return (
        <div className="glass-card rounded-[2rem] p-6 border-white/5 relative overflow-hidden group hover:border-emerald-500/20 transition-all flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Award className="size-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white">그린체크 요약</h3>
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">지역별 투자 적합도 분석</p>
                    </div>
                </div>
                <Link href="/green-check" className="size-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-all group/btn">
                    <ArrowUpRight className="size-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Link>
            </div>

            <div className="flex-1 flex flex-col gap-5">
                {/* Score & Grade Section */}
                <div className="flex items-center gap-6 p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 text-white font-black text-xl">
                        <MapPin className="size-5 text-emerald-500" />
                        {data.name}
                    </div>
                    <div className="h-10 w-px bg-white/10 mx-auto" />
                    <div className="flex items-center gap-4">
                        <div className="text-4xl font-black text-white font-mono">{data.total_score}</div>
                        <div className={cn(
                            "size-12 rounded-xl flex items-center justify-center text-xl font-black border-2",
                            data.grade === 'S' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" :
                                data.grade === 'A' ? "bg-blue-500/10 text-blue-500 border-blue-500/30" :
                                    data.grade === 'B' ? "bg-purple-500/10 text-purple-500 border-purple-500/30" :
                                        "bg-amber-500/10 text-amber-500 border-amber-500/30"
                        )}>
                            {data.grade}
                        </div>
                    </div>
                </div>

                {/* AI Insight Section */}
                <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                        <Sparkles className="size-4 text-emerald-400" />
                        <span className="text-[11px] font-black uppercase text-emerald-400 tracking-[0.2em]">AI Deep Insight</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium line-clamp-2">
                        {data.ai_summary}
                    </p>
                </div>

                {/* 4 Metrics Section - Single Column Layout */}
                <div className="flex flex-col gap-y-3.5">
                    {[
                        { label: '일사량', score: data.solar_score, icon: Zap, color: 'from-amber-500 to-amber-300' },
                        { label: '계통용량', score: data.grid_score, icon: Network, color: 'from-blue-500 to-blue-300' },
                        { label: '밀집도', score: data.density_score, icon: Mountain, color: 'from-emerald-500 to-emerald-300' },
                        { label: '보조금', score: data.subsidy_score, icon: DollarSign, color: 'from-purple-500 to-purple-300' },
                    ].map((m, i) => (
                        <div key={i} className="space-y-1.5 flex flex-col">
                            <div className="flex justify-between items-end">
                                <div className="flex items-center gap-1.5">
                                    <m.icon className="size-3.5 text-slate-500" />
                                    <span className="text-[12px] font-bold text-slate-400">{m.label}</span>
                                </div>
                                <span className="text-xs font-black text-white font-mono">{m.score}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-1000", m.color)}
                                    style={{ width: `${m.score}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Region Selector Component */}
                <div className="mt-auto pt-4 border-t border-white/5">
                    <Select value={selectedCode} onValueChange={handleRegionChange}>
                        <SelectTrigger className="w-full bg-white/5 border-white/10 text-xs font-bold h-10 rounded-xl focus:ring-emerald-500/20">
                            <SelectValue placeholder="지역 선택" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10 text-white max-h-[300px]">
                            {regionsList.map((region) => (
                                <SelectItem key={region.code} value={region.code} className="text-xs font-medium focus:bg-emerald-500 focus:text-black">
                                    {region.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}
