"use client"

import { useEffect, useState } from "react"
import { Building2, Trophy, Coins } from "lucide-react"
import { cn } from "@/lib/utils"

interface CorporateRE100 {
    company: string
    rate: string
    target: number
    purchase: string
}

export function RE100Card() {
    const [data, setData] = useState<CorporateRE100[]>([])

    useEffect(() => {
        fetch("/data/market-data.json")
            .then((res) => res.json())
            .then((json) => {
                if (json.corporate_re100) setData(json.corporate_re100)
            })
    }, [])

    return (
        <div className="glass-card rounded-[2rem] p-6 flex flex-col gap-6 h-full border-white/5 relative group hover:border-emerald-500/20 transition-all">
            <div className="flex items-center gap-3 mb-2">
                <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Building2 className="size-5" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-white">RE100 랭킹</h3>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">재생에너지 구매 TOP 5</p>
                </div>
            </div>

            <div className="space-y-3 flex-1 overflow-auto custom-scrollbar pr-2">
                {data.map((item, i) => (
                    <div key={i} className="p-4 bg-white/[0.02] rounded-xl border border-white/5 hover:border-emerald-500/20 transition-colors group/item">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "size-7 flex items-center justify-center rounded-md text-xs font-black",
                                    i === 0 ? "bg-amber-500 text-black" :
                                        i === 1 ? "bg-slate-300 text-slate-800" :
                                            i === 2 ? "bg-orange-700 text-orange-200" :
                                                "bg-slate-800 text-slate-500"
                                )}>
                                    {i + 1}
                                </div>
                                <span className="font-bold text-white text-sm">{item.company}</span>
                            </div>
                            <span className="text-sm text-emerald-400 font-black tracking-wide">{item.rate}</span>
                        </div>

                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-3">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                                style={{ width: item.rate }}
                            />
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-white/5">
                            <div className="flex items-center gap-1.5 text-slate-500">
                                <Trophy className="size-3.5" />
                                <span className="text-xs uppercase font-bold">Target {item.target}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Coins className="size-3.5 text-emerald-500" />
                                <span className="text-sm font-mono font-black text-white">{item.purchase}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
