"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts"
import { MapPin, TrendingUp, Zap, Network, DollarSign, Award, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

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

            {/* 지역 선택 */}
            <div className="glass-card rounded-2xl p-6 border-white/5">
                <div className="flex items-center gap-3 mb-6">
                    <MapPin className="size-5 text-emerald-500" />
                    <h3 className="text-lg font-black text-white">지역 선택</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">시/도</label>
                        <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                            <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl text-white font-bold">
                                <SelectValue placeholder="시/도를 선택하세요" />
                            </SelectTrigger>
                            <SelectContent>
                                {provinces.map(province => (
                                    <SelectItem key={province} value={province}>{province}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">시/군/구</label>
                        <Select value={selectedRegion} onValueChange={handleRegionChange} disabled={!selectedProvince}>
                            <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl text-white font-bold">
                                <SelectValue placeholder="시/군/구를 선택하세요" />
                            </SelectTrigger>
                            <SelectContent>
                                {regions.map(({ code, name }) => (
                                    <SelectItem key={code} value={code}>{name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* 데이터 표시 */}
            {currentData ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* 좌측: 종합 등급 카드 */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* 종합 등급 */}
                        <Card className={cn(
                            "glass-card rounded-2xl p-8 border-2 relative overflow-hidden",
                            getGradeColor(currentData.grade)
                        )}>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <Award className="size-5" />
                                    <span className="text-xs font-black uppercase tracking-widest">종합 등급</span>
                                </div>
                                <div className="text-center space-y-2">
                                    <div className="text-8xl font-black tracking-tighter">{currentData.grade}</div>
                                    <div className="text-xl font-bold">{getGradeLabel(currentData.grade)}</div>
                                    <div className="text-3xl font-black">{currentData.total_score}점</div>
                                </div>
                            </div>
                            <div className="absolute -right-10 -bottom-10 size-40 bg-white/5 rounded-full blur-3xl" />
                        </Card>

                        {/* 세부 점수 */}
                        <Card className="glass-card rounded-2xl p-6 border-white/5 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="size-5 text-emerald-500" />
                                <span className="text-sm font-black uppercase tracking-widest text-white">세부 점수</span>
                            </div>

                            <div className="space-y-3">
                                <ScoreItem icon={<Zap className="size-4" />} label="일사량" score={currentData.solar_score} />
                                <ScoreItem icon={<Network className="size-4" />} label="선로 용량" score={currentData.grid_score} />
                                <ScoreItem icon={<MapPin className="size-4" />} label="설치 밀집도" score={currentData.density_score} />
                                <ScoreItem icon={<DollarSign className="size-4" />} label="보조금 수준" score={currentData.subsidy_score} />
                            </div>
                        </Card>
                    </div>

                    {/* 중앙: 레이더 차트 */}
                    <div className="lg:col-span-8">
                        <Card className="glass-card rounded-2xl p-8 border-white/5 h-full">
                            <div className="flex items-center gap-3 mb-8">
                                <Sparkles className="size-6 text-emerald-500" />
                                <div>
                                    <h3 className="text-2xl font-black text-white">투자 적합성 분석</h3>
                                    <p className="text-sm text-slate-500 font-bold">{currentData.province} {currentData.name}</p>
                                </div>
                            </div>

                            {/* 레이더 차트 */}
                            <div className="h-[400px] mb-8">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={radarData}>
                                        <PolarGrid stroke="#ffffff20" />
                                        <PolarAngleAxis
                                            dataKey="subject"
                                            tick={{ fill: '#94a3b8', fontSize: 14, fontWeight: 'bold' }}
                                        />
                                        <PolarRadiusAxis
                                            angle={90}
                                            domain={[0, 100]}
                                            tick={{ fill: '#64748b', fontSize: 12 }}
                                        />
                                        <Radar
                                            name="점수"
                                            dataKey="value"
                                            stroke="#10b981"
                                            fill="#10b981"
                                            fillOpacity={0.3}
                                            strokeWidth={2}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1e293b',
                                                border: '1px solid #334155',
                                                borderRadius: '0.5rem',
                                                color: '#fff'
                                            }}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* AI 요약 */}
                            <div className="glass-card rounded-xl p-6 bg-emerald-500/5 border border-emerald-500/20">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 mt-1">
                                        <Sparkles className="size-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-black uppercase tracking-widest text-emerald-400 mb-2">AI 분석 요약</h4>
                                        <p className="text-slate-300 leading-relaxed font-medium">{currentData.ai_summary}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            ) : (
                <Card className="glass-card rounded-2xl p-12 border-white/5 text-center">
                    <div className="space-y-4">
                        <div className="text-6xl">🌱</div>
                        <h3 className="text-2xl font-black text-white">지역을 선택해주세요</h3>
                        <p className="text-slate-500 font-medium">
                            시/도와 시/군/구를 선택하시면<br />
                            해당 지역의 친환경 투자 적합성 분석 결과를 확인하실 수 있습니다.
                        </p>
                    </div>
                </Card>
            )}
        </div>
    )
}

// 점수 아이템 컴포넌트
function ScoreItem({ icon, label, score }: { icon: React.ReactNode; label: string; score: number }) {
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'bg-emerald-500'
        if (score >= 60) return 'bg-blue-500'
        if (score >= 40) return 'bg-amber-500'
        return 'bg-slate-500'
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                    {icon}
                    <span className="text-sm font-bold">{label}</span>
                </div>
                <span className="text-lg font-black text-white">{score}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                    className={cn("h-full rounded-full transition-all", getScoreColor(score))}
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>
    )
}
