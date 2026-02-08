"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ChevronRight, Landmark, Info, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Policy {
    id: string | number
    title: string
    region: string
    category?: string
    status: string
}

export default function PolicyPage() {
    const [policies, setPolicies] = useState<Policy[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/data/policy-data.json")
            .then((res) => res.json())
            .then((data) => {
                // Ensure policies is an array from the data.policies key
                const policyList = Array.isArray(data) ? data : (data.policies || [])
                setPolicies(policyList)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    const filteredPolicies = policies.filter(p =>
        p.title.includes(searchTerm) || p.region.includes(searchTerm)
    )

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col gap-10">
            <div className="text-center space-y-3">
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white lowercase">
                    POLICIES & <span className="text-emerald-500 uppercase">보조금 정보</span>
                </h1>
                <p className="text-slate-400 max-w-xl mx-auto text-base font-medium">
                    지역별 에너지 지원 정책 및 최신 보조금 혜택을 확인하세요.
                </p>
            </div>

            <div className="max-w-6xl mx-auto w-full space-y-8">
                {/* Search Header */}
                <div className="flex flex-col md:flex-row gap-6 items-end justify-between glass-card rounded-[2rem] p-8 md:p-10 border-white/5">
                    <div className="w-full md:max-w-md space-y-4">
                        <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">정책 검색</label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                            <Input
                                placeholder="지역 또는 정책 명칭 입력..."
                                className="h-12 bg-white/5 border-white/10 rounded-2xl pl-12 text-white font-bold placeholder:text-slate-600 focus:ring-emerald-500/50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/10 whitespace-nowrap">
                        <Landmark className="size-3" /> 업데이트: 실시간 반영 중
                    </div>
                </div>

                {/* Policy List Layout */}
                <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-slate-500">지역</th>
                                    <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-slate-500">지원 정책 명칭</th>
                                    <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-slate-500">카테고리</th>
                                    <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-slate-500 text-center">상태</th>
                                    <th className="px-8 py-6"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    [1, 2, 3, 4, 5].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-8 py-10 h-20">
                                                <div className="h-4 bg-white/5 rounded-full w-3/4 mx-auto" />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    filteredPolicies.map((p) => (
                                        <tr key={p.id} className="group hover:bg-white/[0.03] transition-colors cursor-pointer" onClick={() => window.location.href = `/policy/${p.id}`}>
                                            <td className="px-8 py-8">
                                                <span className="text-xl font-black text-white tracking-tighter">{p.region}</span>
                                            </td>
                                            <td className="px-8 py-8">
                                                <div className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors leading-tight">
                                                    {p.title}
                                                </div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <Badge variant="outline" className="bg-white/5 border-white/10 text-slate-400 font-bold uppercase tracking-wider text-xs px-2 py-0.5 rounded-lg whitespace-nowrap">
                                                    {p.category || "지원금"}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-8">
                                                <div className="flex justify-center">
                                                    <Badge className={cn(
                                                        "font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest",
                                                        p.status === "접수중" ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-white/5 text-slate-600"
                                                    )}>
                                                        {p.status}
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8 text-right">
                                                <div className="inline-flex size-10 rounded-full bg-white/5 items-center justify-center text-slate-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                                                    <ChevronRight className="size-5" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Insight */}
                <div className="flex flex-col md:flex-row items-center justify-between p-8 glass-card rounded-[2rem] border-dashed border-white/10 opacity-70">
                    <div className="flex items-center gap-4">
                        <Info className="size-5 text-emerald-500" />
                        <p className="text-sm font-bold text-slate-500 tracking-tight">
                            각 지자체별 상세 공고문과 필요 서류를 확인하시려면 전문가 상담을 권장합니다.
                        </p>
                    </div>
                    <button className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors">
                        보조금 신청 가이드 보기 <ArrowRight className="size-3" />
                    </button>
                </div>
            </div>
        </div>
    )
}
