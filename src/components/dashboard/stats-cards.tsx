"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, TrendingUp, TrendingDown, Activity, Zap, Coins, Leaf } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface MarketData {
    current: {
        smp: number
        rec: number
        carbon: number
        reserve_ratio: number
        updated_at: string
    }
}

export function StatsCards() {
    const [data, setData] = useState<MarketData | null>(null)

    useEffect(() => {
        fetch("/data/market-data.json")
            .then((res) => res.json())
            .then((data) => setData(data))
    }, [])

    if (!data) return <div className="grid gap-4 md:grid-cols-3 animate-pulse">
        {[1, 2, 3].map((i) => (
            <Card key={i} className="h-32 bg-muted/50" />
        ))}
    </div>

    const stats = [
        {
            title: "REC 평균가",
            value: `${data.current.rec.toLocaleString()}원`,
            description: "전일 대비 +1.2%",
            icon: Coins,
            color: "text-emerald-500",
            tooltip: "신재생에너지 설비를 이용하여 전기를 생산했다는 증명서입니다. 발전사업자는 이를 판매하여 추가 수익을 얻을 수 있습니다."
        },
        {
            title: "SMP 가격",
            value: `${data.current.smp.toLocaleString()}원/kWh`,
            description: "전일 대비 -0.5%",
            icon: Zap,
            color: "text-blue-500",
            tooltip: "계통한계가격으로, 한국전력이 발전소로부터 전기를 사오는 가격입니다. 태양광 발전 수익의 기초가 됩니다."
        },
        {
            title: "탄소배출권(KAU24)",
            value: `${data.current.carbon.toLocaleString()}원`,
            description: "전일 대비 +0.8%",
            icon: Leaf,
            color: "text-orange-500",
            tooltip: "기업이 온실가스를 배출할 수 있는 권리입니다. 남거나 부족한 배출권을 시장에서 거래하며, 친환경 투자 가치의 지표가 됩니다."
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
                <Card key={stat.title} className="glass-card relative overflow-hidden group hover:border-emerald-500/30 transition-all hover:translate-y-[-2px]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center gap-1">
                            <CardTitle className="text-base font-bold text-slate-400 group-hover:text-white transition-colors">{stat.title}</CardTitle>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className="text-slate-500 hover:text-emerald-400 transition-colors">
                                        <HelpCircle className="h-3 w-3" />
                                        <span className="sr-only">정보 보기</span>
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 text-base p-4 bg-slate-900/90 backdrop-blur-xl border border-white/10 text-slate-200">
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-emerald-500 underline decoration-emerald-500/20 underline-offset-4">{stat.title}란?</h4>
                                        <p className="leading-relaxed opacity-90">{stat.tooltip}</p>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className={cn("p-2 rounded-xl bg-opacity-10", stat.color.replace('text-', 'bg-').split(' ')[0] + "/10")}>
                            <stat.icon className={cn("h-4 w-4", stat.color)} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold tracking-tighter text-white mb-1 font-mono">{stat.value}</div>
                        <div className="flex items-center gap-2">
                            <div className={cn("text-sm font-bold px-1.5 py-0.5 rounded flex items-center gap-1",
                                stat.description.includes('+') ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10")}>
                                {stat.description.includes('+') ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                                {stat.description.replace('전일 대비 ', '')}
                            </div>
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">전일 대비 변동</span>
                        </div>
                    </CardContent>

                    {/* Decorative background element */}
                    <div className={cn("absolute -right-4 -bottom-4 size-24 blur-3xl opacity-10 rounded-full", stat.color.replace('text-', 'bg-').split(' ')[0])} />
                </Card>
            ))}
        </div>
    )
}
