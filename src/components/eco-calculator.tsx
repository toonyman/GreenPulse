"use client"

import { useState } from "react"
import { useCalculator } from "@/hooks/use-calculator"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
    Search,
    MapPin,
    Zap,
    Leaf,
    TrendingUp,
    DollarSign,
    Calendar,
    Info,
    ArrowRight,
    Lightbulb
} from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts"
import { cn } from "@/lib/utils"

export function EcoCalculator() {
    const [address, setAddress] = useState("")
    const [area, setArea] = useState(33) // Default 10 pyeong (~33m2)
    const result = useCalculator(area)

    return (
        <div className="space-y-12 pb-20">
            {/* Hero Section */}
            <section className="relative pt-16 pb-20 overflow-hidden">
                <div className="container mx-auto px-4 text-center space-y-8 relative z-10">
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-4 py-1.5 rounded-full font-bold text-sm animate-fade-in">
                        🌱 노는 땅, 우리 집 옥상에서 매달 얼마가 나올까?
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[1.1]">
                        가장 똑똑한 <span className="text-emerald-600">에너지 재테크</span><br />
                        에코머니가 계산해 드립니다
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                        주소와 면적만 입력하면 공공 데이터를 기반으로<br className="hidden sm:block" />
                        실시간 태양광 발전 수익을 미리 확인하실 수 있습니다.
                    </p>

                    <div className="max-w-3xl mx-auto mt-12 p-2 bg-white rounded-2xl shadow-2xl shadow-emerald-500/10 border border-slate-100 flex flex-col md:flex-row gap-2">
                        <div className="flex-1 flex items-center px-4 gap-3 border-b md:border-b-0 md:border-r border-slate-100 py-2">
                            <MapPin className="text-emerald-500 size-5" />
                            <input
                                type="text"
                                placeholder="설치할 주소를 입력하세요 (예: 서울특별시 중구...)"
                                className="w-full bg-transparent border-none focus:ring-0 text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-medium py-2"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-56 flex items-center px-4 gap-3 py-2">
                            <Zap className="text-amber-500 size-5" />
                            <div className="flex-1 space-y-1">
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    <span>면적 (m²)</span>
                                    <span>{area}㎡</span>
                                </div>
                                <Slider
                                    value={[area]}
                                    onValueChange={(vals) => setArea(vals[0])}
                                    min={10}
                                    max={1000}
                                    step={1}
                                    className="py-2"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Background Accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full -z-0 pointer-events-none" />
            </section>

            {/* Ad Space Placeholder - Top */}
            <div className="container mx-auto px-4">
                <div className="w-full h-24 bg-slate-100 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                    Google AdSense Placeholder
                </div>
            </div>

            {/* Analysis Section */}
            <section className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                    <Card className="p-8 border-none bg-white shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden relative">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                                    <TrendingUp className="size-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900">예상 수익 리포트</h2>
                                    <p className="text-sm font-bold text-slate-400">실시간 연간 수익성 분석 결과</p>
                                </div>
                            </div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                            <Info className="size-5 text-slate-400" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs bg-slate-900 border-none p-4 rounded-xl text-white">
                                        <p className="text-xs leading-relaxed">
                                            공공데이터포털의 기상청 일사량 데이터와 전력거래소 평균 SMP를 기반으로 산출된 시뮬레이션 결과입니다.
                                            설치 조건에 따라 결과가 달라질 수 있습니다.
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                            <div className="p-6 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
                                <span className="text-xs font-bold text-slate-400 uppercase">월 예상 수익</span>
                                <div className="text-2xl font-black text-slate-900">
                                    {Math.floor(result.monthlyRevenue / 10000).toLocaleString()} <span className="text-sm font-medium text-slate-500">만원</span>
                                </div>
                                <p className="text-[10px] font-bold text-emerald-600">+{result.dailyGeneration.toFixed(1)} kWh / 일</p>
                            </div>
                            <div className="p-6 bg-emerald-600 rounded-2xl space-y-2 text-white shadow-lg shadow-emerald-600/20">
                                <span className="text-xs font-bold text-emerald-200 uppercase">연 예상 수익</span>
                                <div className="text-2xl font-black">
                                    {Math.floor(result.yearlyRevenue / 10000).toLocaleString()} <span className="text-sm font-medium text-emerald-200">만원</span>
                                </div>
                                <p className="text-[10px] font-bold text-emerald-200">SMP + REC 합계 기준</p>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
                                <span className="text-xs font-bold text-slate-400 uppercase">투자금 회수 기간</span>
                                <div className="text-2xl font-black text-slate-900">
                                    약 {result.paybackPeriod.toFixed(1)} <span className="text-sm font-medium text-slate-500">년</span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-400">초기 설치비 보조금 적용 전</p>
                            </div>
                        </div>

                        <div className="h-[300px] w-full mt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={result.tenYearData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="year"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis hide />
                                    <RechartsTooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                        cursor={{ stroke: '#10b981', strokeWidth: 2, strokeDasharray: '4 4' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#059669"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                        name="수익(만원)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-center text-xs font-bold text-slate-400 mt-6 mt-8 uppercase tracking-widest">10개년 누적 수익 변화 예상</p>
                    </Card>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    {/* Comparison Card */}
                    <Card className="p-8 border-none bg-white shadow-xl shadow-slate-200/50 rounded-3xl space-y-6">
                        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                            <Leaf className="size-5 text-emerald-600" />
                            탄소 절감 효과
                        </h3>
                        <div className="space-y-4">
                            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-xs font-bold text-emerald-600 uppercase">연간 탄소 절감량</span>
                                    <span className="text-xl font-black text-emerald-700">{Math.floor(result.carbonReduction).toLocaleString()}kg</span>
                                </div>
                                <div className="w-full h-2 bg-emerald-200/50 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }} />
                                </div>
                            </div>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                이는 소나무 <span className="text-emerald-600 font-black">약 {Math.floor(result.carbonReduction / 6.6)}그루</span>를
                                새로 심는 것과 동일한 효과를 냅니다.
                            </p>
                        </div>
                    </Card>

                    {/* Tips Card */}
                    <Card className="p-8 border-none bg-slate-900 text-white shadow-xl shadow-slate-900/20 rounded-3xl space-y-6">
                        <h3 className="text-lg font-black flex items-center gap-2">
                            <Lightbulb className="size-5 text-amber-400" />
                            오늘의 수익 팁
                        </h3>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-300 font-medium leading-relaxed">
                                {address.includes("서울")
                                    ? "현재 서울시 미니태양광 보조금이 선착순 접수 중입니다. 지금 신청하면 초기 비용을 30% 이상 절감할 수 있어요!"
                                    : "지자체 보조금을 확인해 보세요. 대부분의 지자체에서 설치비의 최대 50%까지 지원해 드립니다."}
                            </p>
                            <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-colors">
                                보조금 알아보기 <ArrowRight className="size-4" />
                            </button>
                        </div>
                    </Card>

                    {/* Ad Space Placeholder - Sidebar */}
                    <div className="w-full h-80 bg-slate-100 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs uppercase tracking-widest text-center px-4">
                        Side AdSpace <br /> Placeholder
                    </div>
                </div>
            </section>

            {/* Policy Section */}
            <section className="container mx-auto px-4">
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                            <DollarSign className="size-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900">지자체 보조금 요약</h2>
                            <p className="text-sm font-bold text-slate-400">현재 거주지에서 지원받을 수 있는 혜택 (전국 평균)</p>
                        </div>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-slate-100">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">지원 항목</th>
                                    <th className="px-6 py-4">지원 내용</th>
                                    <th className="px-6 py-4">대상 및 조건</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                                <tr>
                                    <td className="px-6 py-5 font-black text-slate-900">미니 태양광</td>
                                    <td className="px-6 py-5 text-emerald-600 font-bold">최대 50~80만원 지원</td>
                                    <td className="px-6 py-5">공동주택/베란다 설치 가구</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-5 font-black text-slate-900">주택 지원 사업</td>
                                    <td className="px-6 py-5 text-emerald-600 font-bold">평균 200만원 지원</td>
                                    <td className="px-6 py-5">단독주택 등 일반 주거용</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-5 font-black text-slate-900">융자 사업</td>
                                    <td className="px-6 py-5 text-emerald-600 font-bold">1.5~2% 저금리 융자</td>
                                    <td className="px-6 py-5">중소기업 및 상업용 발전</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Ad Space Placeholder - Bottom */}
            <div className="container mx-auto px-4">
                <div className="w-full h-32 bg-slate-100 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                    Bottom AdSpace Placeholder
                </div>
            </div>
        </div>
    )
}
