"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Sun, Zap, Building2, MapPin, AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SolarRanking {
    rank: number
    region: string
    efficiency: string
    hours: string
}

interface GridStatus {
    region: string
    status: "saturated" | "warning" | "available"
    capacity: string
    wait_time: string
}

interface CorporateRE100 {
    company: string
    rate: string
    target: number
    purchase: string
}

export function MarketIntelligence() {
    const [solarData, setSolarData] = useState<SolarRanking[]>([])
    const [gridData, setGridData] = useState<GridStatus[]>([])
    const [re100Data, setRe100Data] = useState<CorporateRE100[]>([])

    useEffect(() => {
        fetch("/data/market-data.json")
            .then((res) => res.json())
            .then((data) => {
                if (data.solar_rankings) setSolarData(data.solar_rankings)
                if (data.grid_status) setGridData(data.grid_status)
                if (data.corporate_re100) setRe100Data(data.corporate_re100)
            })
    }, [])

    return (
        <section className="space-y-8">
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
                <MapPin className="size-8 text-emerald-500" />
                마켓 인텔리전스
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Solar Rankings */}
                <div className="glass-card rounded-[2rem] p-6 md:p-8 flex flex-col gap-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                            <Sun className="size-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white">태양광 발전 명당</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">기상청 데이터 기반 효율 TOP 5</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {solarData.map((item) => (
                            <div key={item.rank} className="flex items-center justify-between group p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                <div className="flex items-center gap-4">
                                    <span className={cn(
                                        "flex items-center justify-center size-6 rounded-full text-xs font-black",
                                        item.rank === 1 ? "bg-amber-500 text-black" : "bg-white/10 text-slate-400"
                                    )}>{item.rank}</span>
                                    <span className="font-bold text-white text-sm">{item.region}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-amber-500 font-black text-sm">{item.hours}</div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase">평균 일조</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grid Status */}
                <div className="glass-card rounded-[2rem] p-6 md:p-8 flex flex-col gap-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Zap className="size-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white">전력망 접속 현황</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">지역별 선로 여유 용량</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {gridData.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="font-bold text-white text-sm">{item.region}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-slate-400">{item.capacity}</span>
                                    <Badge variant="outline" className={cn(
                                        "px-2 py-0.5 text-[10px] font-black uppercase tracking-wider border",
                                        item.status === "available" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                            item.status === "warning" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                                "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                    )}>
                                        {item.status === "available" ? "접속가능" : item.status === "warning" ? "대기필요" : "포화상태"}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Corporate RE100 */}
                <div className="glass-card rounded-[2rem] p-6 md:p-8 flex flex-col gap-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <Building2 className="size-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white">기업 RE100 랭킹</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">재생에너지 구매 TOP 5</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {re100Data.map((item, i) => (
                            <div key={i} className="p-3">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="font-bold text-white text-sm">{item.company}</span>
                                    <span className="text-xs text-emerald-500 font-black">{item.rate} 달성</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                                        style={{ width: item.rate }}
                                    />
                                </div>
                                <div className="flex justify-between mt-2 text-[10px] uppercase font-bold text-slate-600">
                                    <span>Target {item.target}</span>
                                    <span>구매액 {item.purchase}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
