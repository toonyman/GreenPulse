"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Megaphone, MapPin } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Policy {
    id: string
    region: string
    title: string
    amount: string
    status: string
    description: string
}

export function PolicyUpdates() {
    const [policies, setPolicies] = useState<Policy[]>([])

    useEffect(() => {
        fetch("/data/policy-data.json")
            .then(res => res.json())
            .then(data => setPolicies(data.policies.slice(0, 5)))
    }, [])

    return (
        <div className="glass-card rounded-2xl p-6 border-white/5 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                    <Megaphone className="size-5" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-white">신규 보조금 알림</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">오늘 업데이트된 정책</p>
                </div>
            </div>

            <div className="space-y-4 flex-1 overflow-auto custom-scrollbar pr-2">
                {policies.map((policy, i) => (
                    <Link
                        key={i}
                        href={`/policy/${policy.id}`}
                        className="block group p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline" className={cn(
                                "text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider border mb-1",
                                policy.region === '서울시' ? "text-blue-400 border-blue-400/20 bg-blue-400/5" :
                                    policy.region === '경기도' ? "text-purple-400 border-purple-400/20 bg-purple-400/5" :
                                        "text-emerald-400 border-emerald-400/20 bg-emerald-400/5"
                            )}>
                                <MapPin className="size-2.5 mr-1" />
                                {policy.region}
                            </Badge>
                            <span className={cn(
                                "text-[10px] font-bold",
                                policy.status === '접수중' ? "text-emerald-500" : "text-amber-500"
                            )}>{policy.status}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-200 group-hover:text-emerald-400 transition-colors mb-1 line-clamp-1">
                            {policy.title}
                        </h4>
                        <div className="flex justify-between items-end">
                            <p className="text-xs text-slate-500 line-clamp-1 w-2/3">{policy.description}</p>
                            <span className="text-xs font-black text-white">{policy.amount}원</span>
                        </div>
                    </Link>
                ))}
            </div>

            <Link href="/policy" className="mt-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white py-3 border-t border-white/5 transition-colors">
                정책 전체보기 <ArrowRight className="size-3" />
            </Link>
        </div>
    )
}
