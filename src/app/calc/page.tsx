"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Calculator, Leaf, ArrowRight, Zap, Info, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CalcPage() {
    const [region, setRegion] = useState("전국")
    const [capacity, setCapacity] = useState(100)
    const [investment, setInvestment] = useState(150000000)
    const [recPrice, setRecPrice] = useState(0)
    const [smpPrice, setSmpPrice] = useState(0)

    useEffect(() => {
        fetch("/data/market-data.json")
            .then((res) => res.json())
            .then((data) => {
                if (data.current) {
                    setRecPrice(data.current.rec)
                    setSmpPrice(data.current.smp)
                }
            })
    }, [])

    const annualRevenue = capacity * 3.6 * 365 * (smpPrice + recPrice * 1.2)
    const roi = (annualRevenue / investment) * 100
    const paybackPeriod = investment / annualRevenue
    const treeCount = (capacity * 3.6 * 365 * 0.44) / 6.6

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col gap-10">
            <div className="text-center space-y-3">
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white lowercase">
                    INVESTMENT <span className="text-emerald-500 uppercase">분석기</span>
                </h1>
                <p className="text-slate-400 max-w-xl mx-auto text-base font-medium">
                    실시간 마켓 데이터를 기반으로 예상 투자 수익률을 분석합니다.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-12 max-w-7xl mx-auto w-full">
                {/* Parameters Panel */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="glass-card rounded-[2.5rem] p-8 md:p-10 border-white/5">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="size-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                <Calculator className="size-5" />
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">분석 설정</h2>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <Label className="text-sm font-black uppercase tracking-widest text-slate-500">설치 지역</Label>
                                <Select value={region} onValueChange={setRegion}>
                                    <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-2xl text-white font-bold focus:ring-emerald-500/50">
                                        <SelectValue placeholder="지역 선택" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-white/10 text-white rounded-2xl">
                                        <SelectItem value="전국">전국 (평균)</SelectItem>
                                        <SelectItem value="경기">경기도</SelectItem>
                                        <SelectItem value="강원">강원도</SelectItem>
                                        <SelectItem value="충북">충청북도</SelectItem>
                                        <SelectItem value="충남">충청남도</SelectItem>
                                        <SelectItem value="전북">전라북도</SelectItem>
                                        <SelectItem value="전남">전라남도</SelectItem>
                                        <SelectItem value="경북">경상북도</SelectItem>
                                        <SelectItem value="경남">경상남도</SelectItem>
                                        <SelectItem value="제주">제주도</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm font-black uppercase tracking-widest text-slate-500">설치 용량 (kW)</Label>
                                    <span className="text-xl font-black text-emerald-400 font-mono">{capacity} <span className="text-xs uppercase font-bold text-slate-600 ml-1">kW</span></span>
                                </div>
                                <Slider
                                    value={[capacity]}
                                    onValueChange={(v) => setCapacity(v[0])}
                                    max={500}
                                    step={10}
                                    className="py-4"
                                />
                                <div className="grid grid-cols-3 gap-2">
                                    {[50, 100, 300].map(v => (
                                        <button key={v} onClick={() => setCapacity(v)} className="py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-white hover:bg-emerald-500 hover:text-black transition-all">
                                            {v}kW
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <Label className="text-sm font-black uppercase tracking-widest text-slate-500">초기 투자 비용 (₩)</Label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        value={investment}
                                        onChange={(e) => setInvestment(Number(e.target.value))}
                                        className="h-12 bg-white/5 border-white/10 rounded-2xl pl-10 text-white font-black text-lg"
                                    />
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₩</span>
                                </div>
                                <p className="text-xs text-slate-500 font-bold text-right">* 시스템 설치비 및 연동 비용 포함</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Panel */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="glass-card rounded-[2.5rem] p-8 md:p-12 border-emerald-500/10 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <TrendingUp className="size-32 text-emerald-500" />
                        </div>

                        <div className="relative z-10 flex flex-col gap-10">
                            <div>
                                <Badge className="bg-emerald-500 text-black font-black px-4 py-1 rounded-full uppercase tracking-widest text-xs mb-4">프로젝션 결과</Badge>
                                <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mb-2">총 예상 수익률</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-7xl md:text-8xl font-black text-emerald-400 tracking-tighter font-mono">
                                        {roi.toFixed(1)}
                                    </span>
                                    <span className="text-3xl font-black text-emerald-500">%</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-10 border-t border-white/5">
                                <div className="space-y-2">
                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">연간 예상 수익</p>
                                    <p className="text-3xl font-black text-white font-mono tracking-tighter">
                                        <span className="text-sm mr-1">₩</span>{(annualRevenue / 10000).toLocaleString()} <span className="text-sm text-slate-500 uppercase font-black tracking-normal ml-1">만원</span>
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">원금 회수 기간</p>
                                    <p className="text-3xl font-black text-emerald-500 font-mono tracking-tighter">
                                        {paybackPeriod.toFixed(1)} <span className="text-sm text-slate-500 uppercase font-black tracking-normal ml-1">년</span>
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-500 to-blue-500 rounded-[2rem] p-8 mt-4 flex flex-col md:flex-row items-center justify-between gap-8 group hover:scale-[1.01] transition-transform">
                                <div className="flex items-center gap-6">
                                    <div className="size-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-2xl">
                                        <Leaf className="size-8" />
                                    </div>
                                    <div>
                                        <p className="text-black/60 text-xs font-black uppercase tracking-widest mb-1">환경적 가치 창출</p>
                                        <h4 className="text-white text-2xl font-black leading-none">탄소 절감 효과</h4>
                                    </div>
                                </div>
                                <div className="text-center md:text-right">
                                    <p className="text-white/80 text-xs font-black uppercase tracking-widest mb-1">연간 식재 효과</p>
                                    <p className="text-white text-5xl font-black tracking-tighter font-mono leading-none">
                                        {Math.round(treeCount).toLocaleString()} <span className="text-xl uppercase tracking-normal">그루</span>
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                                    <Zap className="size-5 text-blue-400" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">현재 SMP</p>
                                        <p className="text-sm font-black text-white font-mono">184.2 <span className="text-xs ml-1 opacity-50">₩/kWh</span></p>
                                    </div>
                                </div>
                                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                                    <Sparkles className="size-5 text-emerald-400" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">현재 REC</p>
                                        <p className="text-sm font-black text-white font-mono">72.8 <span className="text-xs ml-1 opacity-50">₩/kWh</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto w-full p-8 glass-card rounded-3xl border border-dashed border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
                <div className="flex items-center gap-4">
                    <Info className="size-5 text-slate-500" />
                    <p className="text-sm font-bold text-slate-500 tracking-tight leading-relaxed">
                        본 분석 결과는 실시간 시장 환경 및 정책에 따라 변동될 수 있습니다.<br />
                        정확한 견적은 현장 실사를 통해 결정됩니다.
                    </p>
                </div>
                <button className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors whitespace-nowrap">
                    전문가 상담 신청 <ArrowRight className="size-3" />
                </button>
            </div>
        </div>
    )
}
