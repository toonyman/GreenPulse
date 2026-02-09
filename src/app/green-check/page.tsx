"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"
import { MapPin, TrendingUp, Zap, Network, DollarSign, Award, Sparkles, Info } from "lucide-react"
import {
    Tooltip as ShadcnTooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { SimpleRegionSelector } from "@/components/simple-region-selector"

interface LocationData {
    name: string
    province: string
    solar_score: number
    grid_score: number
    density_score: number
    subsidy_score: number
    total_score: number
    grade: string
    ai_summary: string
    last_updated: string
}

interface LocationMaster {
    [code: string]: LocationData
}

export default function GreenCheckPage() {
    const [locationData, setLocationData] = useState<LocationMaster>({})
    const [provinces, setProvinces] = useState<string[]>([])
    const [selectedProvince, setSelectedProvince] = useState<string>("")
    const [selectedRegion, setSelectedRegion] = useState<string>("")
    const [currentData, setCurrentData] = useState<LocationData | null>(null)
    const [installationCapacity, setInstallationCapacity] = useState<number>(10) // 기본 10kW

    // 데이터 로드
    useEffect(() => {
        fetch("/data/location-master.json")
            .then(res => res.json())
            .then((data: LocationMaster) => {
                setLocationData(data)

                // 시/도 목록 추출
                const provinceSet = new Set<string>()
                Object.values(data).forEach(item => {
                    provinceSet.add(item.province)
                })
                const sortedProvinces = Array.from(provinceSet).sort()
                setProvinces(sortedProvinces)

                // 기본값 설정 (제주특별자치도 제주시)
                const defaultCode = "50110"
                if (data[defaultCode]) {
                    setSelectedProvince(data[defaultCode].province)
                    setSelectedRegion(defaultCode)
                    setCurrentData(data[defaultCode])
                }
            })
            .catch(err => console.error("Failed to load location data:", err))
    }, [])

    // 선택된 시/도의 시/군/구 목록
    const regions = Object.entries(locationData)
        .filter(([_, data]) => data.province === selectedProvince)
        .map(([code, data]) => ({ code, name: data.name }))
        .sort((a, b) => a.name.localeCompare(b.name))

    // 시/도 변경 시
    const handleProvinceChange = (province: string) => {
        setSelectedProvince(province)
        setSelectedRegion("")
        setCurrentData(null)
    }

    // 시/군/구 변경 시
    const handleRegionChange = (code: string) => {
        setSelectedRegion(code)
        setCurrentData(locationData[code] || null)
    }

    // 레이더 차트 데이터
    const radarData = currentData ? [
        { subject: "일사량", value: currentData.solar_score, fullMark: 100 },
        { subject: "선로 용량", value: currentData.grid_score, fullMark: 100 },
        { subject: "설치 밀집도", value: currentData.density_score, fullMark: 100 },
        { subject: "보조금 수준", value: currentData.subsidy_score, fullMark: 100 },
    ] : []

    // 등급별 색상
    const getGradeColor = (grade: string) => {
        switch (grade) {
            case 'S': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
            case 'A': return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
            case 'B': return 'text-purple-400 bg-purple-500/10 border-purple-500/20'
            case 'C': return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20'
        }
    }

    const getGradeLabel = (grade: string) => {
        switch (grade) {
            case 'S': return '최우수'
            case 'A': return '우수'
            case 'B': return '양호'
            case 'C': return '보통'
            default: return '미흡'
        }
    }

    // 수익 계산 로직
    const calculateRevenue = () => {
        if (!currentData) return { monthly: 0, yearly: 0, tenYears: [] }

        // 일평균 발전시간 (solar_score 0~100 -> 3.0~4.0시간 매핑)
        const dailyGenHours = 3.0 + (currentData.solar_score / 100)
        // 발전량 (kWh/월) = 용량(kW) * 일평균발전시간 * 30일
        const monthlyGeneration = installationCapacity * dailyGenHours * 30
        // 예상 단가 (SMP + REC 합계 약 200원 가정)
        const unitPrice = 200
        const monthlyRevenue = Math.floor(monthlyGeneration * unitPrice)

        // 10개년 추이 (매년 0.7% 효율 저감 가정)
        const tenYearsData = []
        let currentYearlyRevenue = monthlyRevenue * 12
        for (let i = 1; i <= 10; i++) {
            tenYearsData.push({
                year: `${i}년차`,
                revenue: Math.floor(currentYearlyRevenue / 10000), // 만원 단위
            })
            currentYearlyRevenue *= 0.993 // 0.7% 저감
        }

        return {
            monthly: monthlyRevenue,
            yearly: monthlyRevenue * 12,
            tenYears: tenYearsData
        }
    }

    const revenueInfo = calculateRevenue()

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col gap-10 mb-20">
            {/* Page Title */}
            <div className="text-center space-y-3">
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white lowercase">
                    GREEN <span className="text-emerald-500 uppercase">CHECK</span>
                </h1>
                <p className="text-slate-400 max-w-xl mx-auto text-base font-medium">
                    전국 시군구별 친환경 투자 적합성을 한눈에 분석하세요.
                </p>
            </div>

            {/* 메인 레이아웃: 전체 너비 분석 결과 */}
            <div className="max-w-7xl mx-auto w-full">
                {currentData ? (
                    <Card className="glass-card rounded-2xl p-5 border-white/5">
                        <div className="space-y-4">
                            {/* 초간소화 헤더 */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                                    <h2 className="text-xl font-black text-white">{currentData.province} {currentData.name}</h2>
                                </div>

                                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
                                    <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                                        <SelectTrigger className="w-[120px] h-9 bg-transparent border-0 text-white font-bold text-sm focus:ring-0">
                                            <SelectValue placeholder="시/도" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {provinces.map(province => (
                                                <SelectItem key={province} value={province}>{province}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <div className="w-px h-3 bg-white/10" />
                                    <Select value={selectedRegion} onValueChange={handleRegionChange} disabled={!selectedProvince}>
                                        <SelectTrigger className="w-[120px] h-9 bg-transparent border-0 text-white font-bold text-sm focus:ring-0">
                                            <SelectValue placeholder="시/군/구" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {regions.map(({ code, name }) => (
                                                <SelectItem key={code} value={code}>{name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* 메인 콘텐츠: 비대칭 2단 구성 (상세 분석 강조 레이아웃) */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                {/* 좌측: 종합 요약 (4/12) - 위아래 수직 배치 */}
                                <div className="lg:col-span-4 flex flex-col gap-4">
                                    {/* 종합 점수 & 등급 */}
                                    <div className="p-6 bg-white/5 rounded-xl border border-white/10 text-center flex flex-col justify-center min-h-[160px]">
                                        <div className="flex items-center justify-center gap-1.5 mb-2.5">
                                            <Award className="size-4 text-emerald-500" />
                                            <span className="text-sm font-black uppercase text-slate-500 tracking-wider">Overall Performance</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-5 mb-2">
                                            <div className="text-7xl font-black text-white tracking-tighter">{currentData.total_score}</div>
                                            <div className={cn(
                                                "text-4xl font-black w-16 h-16 rounded-2xl flex items-center justify-center border-2",
                                                currentData.grade === 'S' && "bg-emerald-400/10 text-emerald-400 border-emerald-400/30",
                                                currentData.grade === 'A' && "bg-blue-400/10 text-blue-400 border-blue-400/30",
                                                currentData.grade === 'B' && "bg-purple-400/10 text-purple-400 border-purple-400/30",
                                                currentData.grade === 'C' && "bg-amber-400/10 text-amber-400 border-amber-400/30",
                                                currentData.grade === 'D' && "bg-red-400/10 text-red-400 border-red-400/30"
                                            )}>
                                                {currentData.grade}
                                            </div>
                                        </div>
                                        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                                            {getGradeLabel(currentData.grade)} 등급 리포트
                                        </div>
                                    </div>

                                    {/* AI 인사이트 */}
                                    <div className="p-6 bg-emerald-500/5 rounded-xl border border-emerald-500/10 flex-1">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Sparkles className="size-4 text-emerald-400" />
                                            <span className="text-sm font-black uppercase text-emerald-400 tracking-wider">AI Deep Insight</span>
                                        </div>
                                        <p className="text-base text-slate-300 leading-relaxed font-medium">
                                            {currentData.ai_summary}
                                        </p>
                                    </div>
                                </div>

                                {/* 우측: 상세 분석 그룹 (8/12) - Metrics + Radar 통합 및 강조 */}
                                <div className="lg:col-span-8 p-6 bg-white/5 rounded-xl border border-white/10">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="size-4 text-emerald-500" />
                                            <span className="text-sm font-black uppercase text-slate-500 tracking-wider">Detailed Analysis</span>
                                        </div>
                                        <div className="text-sm font-bold text-slate-500 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                                            지표 균형 및 항목별 상세 데이터
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                                        {/* Metrics List (5/12) */}
                                        <div className="md:col-span-5 space-y-2">
                                            <TooltipProvider>
                                                <ScoreItem
                                                    icon={<Zap className="size-3.5" />}
                                                    label="일사량 지수"
                                                    score={currentData.solar_score}
                                                    description="지역별 연간 평균 일사량과 발전 효율을 기반으로 산출된 태양광 발전 잠재력 점수입니다."
                                                />
                                                <ScoreItem
                                                    icon={<Network className="size-3.5" />}
                                                    label="계통망 수용가"
                                                    score={currentData.grid_score}
                                                    description="전력 계통망의 여유 용량과 신규 설비 연계 가능성을 나타내는 지표입니다."
                                                />
                                                <ScoreItem
                                                    icon={<MapPin className="size-3.5" />}
                                                    label="설비 밀집도"
                                                    score={currentData.density_score}
                                                    description="해당 지역 내 기존 재생에너지 설비의 분포와 부지 확보 용이성을 분석한 점수입니다."
                                                />
                                                <ScoreItem
                                                    icon={<DollarSign className="size-3.5" />}
                                                    label="지자체 보조금"
                                                    score={currentData.subsidy_score}
                                                    description="지자체별 조례 및 친환경 정책에 따른 인센티브와 보조금 지원 수준입니다."
                                                />
                                            </TooltipProvider>
                                        </div>

                                        {/* Radar Chart (7/12) */}
                                        <div className="md:col-span-7 h-[280px] w-full mt-4 md:mt-0">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RadarChart data={radarData} margin={{ top: 0, right: 40, bottom: 0, left: 40 }}>
                                                    <PolarGrid stroke="#ffffff15" />
                                                    <PolarAngleAxis
                                                        dataKey="subject"
                                                        tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }}
                                                    />
                                                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                                                    <Radar
                                                        name="점수"
                                                        dataKey="value"
                                                        stroke="#10b981"
                                                        fill="#10b981"
                                                        fillOpacity={0.2}
                                                        strokeWidth={3}
                                                    />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <Card className="glass-card rounded-2xl p-10 border-white/5 text-center flex items-center justify-center">
                        <div className="space-y-6">
                            <div className="text-5xl animate-bounce">🌱</div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-white">지역을 선택하세요</h3>
                                <p className="text-slate-400 font-medium text-sm">
                                    상단 메뉴에서 지역을 선택하여 분석 리포트를 확인하세요.
                                </p>
                            </div>
                            <div className="flex items-center justify-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10 w-fit mx-auto">
                                <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                                    <SelectTrigger className="w-[140px] h-10 bg-white/5 border-0 text-white font-bold text-sm focus:ring-0 rounded-lg">
                                        <SelectValue placeholder="시/도" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {provinces.map(province => (
                                            <SelectItem key={province} value={province}>{province}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={selectedRegion} onValueChange={handleRegionChange} disabled={!selectedProvince}>
                                    <SelectTrigger className="w-[140px] h-10 bg-white/5 border-0 text-white font-bold text-sm focus:ring-0 rounded-lg">
                                        <SelectValue placeholder="시/군/구" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {regions.map(({ code, name }) => (
                                            <SelectItem key={code} value={code}>{name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </Card>
                )}
            </div>

            {/* 수익 시뮬레이션 섹션 */}
            {currentData && (
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 좌측: 설정 및 요약 */}
                    <Card className="glass-card rounded-2xl p-8 border-white/5 space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <DollarSign className="size-5 text-emerald-500" />
                                <h2 className="text-xl font-black text-white uppercase tracking-tight">수익성 시뮬레이션</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <label className="text-sm font-bold text-slate-400">설치 용량 설정</label>
                                        <div className="text-2xl font-black text-emerald-400">{installationCapacity} <span className="text-sm text-slate-500">kW</span></div>
                                    </div>
                                    <input
                                        type="range"
                                        min="3"
                                        max="100"
                                        step="1"
                                        value={installationCapacity}
                                        onChange={(e) => setInstallationCapacity(Number(e.target.value))}
                                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                    <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                        <span>3kW (가정용)</span>
                                        <span>100kW (상업용)</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                                        <div className="text-xs font-bold text-slate-500 mb-1 uppercase">월 예상 수익</div>
                                        <div className="text-xl font-black text-white">
                                            {revenueInfo.monthly.toLocaleString()} <span className="text-xs font-medium text-slate-500">원</span>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-white/5 rounded-2xl border border-white/10 text-emerald-400">
                                        <div className="text-xs font-bold text-slate-500 mb-1 uppercase">연 예상 수익</div>
                                        <div className="text-xl font-black">
                                            {revenueInfo.yearly.toLocaleString()} <span className="text-xs font-medium text-slate-500">원</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-emerald-500/20 rounded-xl">
                                            <Zap className="size-5 text-emerald-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-white mb-1">발전소 기대 효과</div>
                                            <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                                {currentData.name}의 일사량({currentData.solar_score}점)을 고려할 때,
                                                연간 약 {(revenueInfo.yearly / 200).toLocaleString(undefined, { maximumFractionDigits: 0 })}kWh의 전력을 생산할 수 있습니다.
                                                이는 4인 가구 약 {Math.floor(revenueInfo.yearly / 200 / 4200)}세대가 1년간 사용할 수 있는 양입니다.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* 우측: 10개년 그래프 */}
                    <Card className="glass-card rounded-2xl p-8 border-white/5 flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="size-5 text-emerald-500" />
                                <h2 className="text-xl font-black text-white uppercase tracking-tight">10개년 매출 추이 예상</h2>
                            </div>
                            <div className="text-[10px] font-black bg-white/5 text-slate-500 px-2 py-1 rounded border border-white/10 tracking-widest uppercase">
                                단위: 만원
                            </div>
                        </div>

                        <div className="flex-1 min-h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueInfo.tenYears} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis
                                        dataKey="year"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#475569', fontSize: 11, fontWeight: 'bold' }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#475569', fontSize: 11, fontWeight: 'bold' }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#0f172a',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            padding: '12px'
                                        }}
                                        itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                                        labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}
                                        formatter={(value: number) => [`${value.toLocaleString()} 만원`, '예상 매출']}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#10b981"
                                        strokeWidth={4}
                                        dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#0f172a' }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                        animationDuration={1500}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="mt-4 text-[11px] text-slate-500 font-medium text-center">
                            * 본 시뮬레이션은 SMP 120원, REC 80원을 기준으로 하며, 실제 기상 조건 및 정책에 따라 달라질 수 있습니다.
                        </p>
                    </Card>
                </div>
            )}
        </div>
    )
}

// 점수 아이템 컴포넌트
function ScoreItem({ icon, label, score, description }: { icon: React.ReactNode; label: string; score: number; description: string }) {
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'bg-emerald-500'
        if (score >= 60) return 'bg-blue-500'
        if (score >= 40) return 'bg-amber-500'
        return 'bg-slate-500'
    }

    return (
        <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 last:pb-0">
            <div className="flex items-center gap-2 text-slate-400">
                <div className="p-1 bg-white/5 rounded-md">
                    {icon}
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold">{label}</span>
                    <ShadcnTooltip>
                        <TooltipTrigger asChild>
                            <button className="text-slate-600 hover:text-slate-400 transition-colors">
                                <Info className="size-3.5" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 border-white/10 text-white text-[13px] max-w-[220px] p-3 leading-relaxed">
                            {description}
                        </TooltipContent>
                    </ShadcnTooltip>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden hidden sm:block">
                    <div
                        className={cn("h-full rounded-full transition-all", getScoreColor(score))}
                        style={{ width: `${score}%` }}
                    />
                </div>
                <span className="text-sm font-black text-white w-5 text-right">{score}</span>
            </div>
        </div>
    )
}
