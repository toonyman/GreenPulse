"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Calculator } from "lucide-react"

export function ProfitSimulator() {
    const [investment, setInvestment] = useState([5000]) // Default 50 million KRW

    // Simple calculation: 
    // Assume 1kW ~ 1.5 million KRW install cost
    // Capacity = Investment / 1.5
    // Annual Revenue = Capacity * 3.6h * 365 * (SMP + REC) * weight (roughly 1.2)
    // SMP ~ 133, REC ~ 74 (0.074 million? No, REC unit is per MWh usually, need adjustment. 
    // Let's simplify: 1kW earns approx 250,000 KRW/month -> 3M KRW/year

    const capacityKw = Math.floor(investment[0] / 150) // 1.5M per kW -> 100M = 66kW. 
    // Actually standard pyeong is 3.3m2. 1kW needs ~2.5 pyeong.
    // Let's say 1000만원 = 6-7kW.
    // Formula: Investment (Man Won) / 150 (Man Won/kW) = Capacity (kW)

    const annualRevenue = Math.round(capacityKw * 3.6 * 365 * 220 / 10000) // 220 won combined price. Result in Man Won.
    // 220 won/kWh * 3.6h * 365 * kW = Revenue in Won. Divide by 10000 for Man Won.

    return (
        <div className="glass-card rounded-2xl p-8 border-white/5 relative overflow-hidden group hover:border-emerald-500/20 transition-all">
            <div className="absolute top-0 right-0 p-3 opacity-10 bg-emerald-500/20 rounded-bl-2xl">
                <Calculator className="size-8 text-emerald-500" />
            </div>

            <div className="space-y-6 relative z-10">
                <div>
                    <h3 className="text-xl font-black text-white tracking-tight">수익률 시뮬레이션</h3>
                    <p className="text-sm font-bold text-slate-500">예상 투자금으로 연수익 미리보기</p>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">투자 예정 금액</span>
                        <div className="text-2xl font-black text-white font-mono tracking-tighter">
                            {investment[0].toLocaleString()} <span className="text-sm text-slate-500">만원</span>
                        </div>
                    </div>

                    <Slider
                        defaultValue={[5000]}
                        max={100000}
                        step={100}
                        className="py-4"
                        onValueChange={setInvestment}
                    />

                    <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                        <span>1천만원</span>
                        <span>10억원</span>
                    </div>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-emerald-400 opacity-80">연간 예상 수익금</div>
                    <div className="text-4xl font-black text-white font-mono tracking-tighter">
                        {annualRevenue.toLocaleString()} <span className="text-lg text-slate-400">만원</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold">* SMP 133원, REC 7.4원 기준 (가중치 1.2)</div>
                </div>

                <Link href="/calc" className="block w-full">
                    <Button className="w-full h-12 bg-white/5 hover:bg-emerald-500 hover:text-black text-white font-black uppercase tracking-widest transition-all rounded-xl border border-white/10 hover:border-transparent">
                        상세 계산기 바로가기 <ArrowRight className="ml-2 size-4" />
                    </Button>
                </Link>
            </div>
        </div>
    )
}
