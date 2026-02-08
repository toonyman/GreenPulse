"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { Zap, Share2, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export function EcoCalculator() {
    const [bill, setBill] = useState<number[]>([50000]) // 원
    const [usage, setUsage] = useState<number>(0) // kWh
    const [carbon, setCarbon] = useState<number>(0) // kg
    const [trees, setTrees] = useState<number>(0) // 소나무 그루 수

    useEffect(() => {
        let currentBill = bill[0]
        let calculatedUsage = 0

        if (currentBill <= 24000) {
            calculatedUsage = currentBill / 120
        } else if (currentBill <= 66800) {
            calculatedUsage = 200 + (currentBill - 24000) / 214
        } else {
            calculatedUsage = 400 + (currentBill - 66800) / 307
        }

        setUsage(Math.round(calculatedUsage))
        const calculatedCo2 = calculatedUsage * 0.4781
        setCarbon(calculatedCo2)
        setTrees(Math.round((calculatedCo2 / 6.6) * 10) / 10)
    }, [bill])

    return (
        <Card className="glass-card bg-white/[0.01] border-white/5 p-6 rounded-3xl h-full flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-5">
                    <div className="size-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Zap className="size-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-white italic">ECO-CALCULATOR</h3>
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Carbon Footprint Analysis</p>
                    </div>
                </div>

                {/* Input Section */}
                <div className="space-y-5 mb-8 pt-2">
                    <div className="flex justify-between items-end">
                        <span className="text-[12px] font-black text-slate-500 uppercase tracking-widest">Monthly Bill</span>
                        <div className="text-2xl font-mono font-black text-emerald-400">
                            ₩{bill[0].toLocaleString()}
                        </div>
                    </div>
                    <Slider
                        value={bill}
                        onValueChange={setBill}
                        max={300000}
                        step={5000}
                        className="py-2"
                    />
                    <p className="text-[12px] text-slate-600 font-bold leading-relaxed">
                        전기세 기준으로 한 달 탄소 배출량을 추정 계산합니다.
                    </p>
                </div>

                {/* Result Cards - Compact Grid */}
                <div className="grid grid-cols-2 gap-4 mt-auto">
                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-tighter">Usage (Est.)</span>
                        <div className="flex items-baseline gap-1 mt-1.5">
                            <span className="text-xl font-black text-white font-mono">{usage}</span>
                            <span className="text-xs font-bold text-slate-500 font-mono">kWh</span>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-tighter">CO2 (Est.)</span>
                        <div className="flex items-baseline gap-1 mt-1.5">
                            <span className="text-xl font-black text-emerald-500 font-mono">{carbon.toFixed(1)}</span>
                            <span className="text-xs font-bold text-slate-500 font-mono">kg</span>
                        </div>
                    </div>
                </div>

                <div className="mt-5 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                    <div className="size-11 flex-none rounded-full bg-emerald-500/20 flex items-center justify-center text-2xl">
                        🌲
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest leading-none">Offset Required</p>
                        <div className="flex items-baseline gap-1 mt-1.5">
                            <span className="text-[11px] text-white font-bold italic">Approx.</span>
                            <span className="text-base font-black text-white truncate leading-tight">
                                <span className="text-emerald-400 font-mono">{trees}</span> Pine Trees
                            </span>
                        </div>
                    </div>
                    <button className="flex-none size-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors">
                        <Share2 className="size-4.5" />
                    </button>
                </div>

                <div className="mt-5 text-[11px] text-center font-bold text-slate-700 hover:text-emerald-500 transition-colors cursor-pointer uppercase tracking-widest">
                    ENERGY SAVING ITEMS →
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-0 right-0 size-32 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 size-32 bg-sky-500/5 blur-[80px] rounded-full pointer-events-none" />
        </Card>
    )
}
