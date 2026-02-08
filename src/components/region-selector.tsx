"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Map as MapIcon } from "lucide-react"

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
    [key: string]: LocationData
}

interface RegionSelectorProps {
    locationData: LocationMaster
    selectedProvince: string
    selectedRegion: string
    onProvinceChange: (province: string) => void
    onRegionChange: (code: string) => void
    currentData: LocationData | null
}

// 등급별 색상
const getGradeColor = (grade: string) => {
    switch (grade) {
        case 'S': return '#10b981' // emerald-500
        case 'A': return '#3b82f6' // blue-500
        case 'B': return '#a855f7' // purple-500
        case 'C': return '#f59e0b' // amber-500
        case 'D': return '#ef4444' // red-500
        default: return '#64748b' // slate-500
    }
}

// 간소화된 한국 지도 SVG (시도별 경계)
const KoreaMapSVG = ({ locationData, onRegionClick, selectedRegion }: {
    locationData: LocationMaster
    onRegionClick: (code: string) => void
    selectedRegion?: string
}) => {
    const [hoveredCode, setHoveredCode] = useState<string | null>(null)

    // 지역 데이터를 시도별로 그룹화하고 평균 등급 계산
    const getProvinceData = () => {
        const grouped: { [key: string]: { codes: string[], avgGrade: string, regions: Array<{ code: string, name: string, grade: string }> } } = {}

        Object.entries(locationData).forEach(([code, data]) => {
            if (!grouped[data.province]) {
                grouped[data.province] = { codes: [], avgGrade: 'C', regions: [] }
            }
            grouped[data.province].codes.push(code)
            grouped[data.province].regions.push({ code, name: data.name, grade: data.grade })
        })

        // 각 시도의 평균 등급 계산
        Object.keys(grouped).forEach(province => {
            const scores = grouped[province].codes.map(code => locationData[code].total_score)
            const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
            grouped[province].avgGrade = avgScore >= 90 ? 'S' : avgScore >= 80 ? 'A' : avgScore >= 70 ? 'B' : avgScore >= 60 ? 'C' : 'D'
        })

        return grouped
    }

    const provinceData = getProvinceData()

    // 시도별 위치 (간단한 그리드 레이아웃)
    const provincePositions: { [key: string]: { x: number, y: number, width: number, height: number } } = {
        "서울특별시": { x: 180, y: 120, width: 40, height: 40 },
        "인천광역시": { x: 140, y: 130, width: 35, height: 35 },
        "경기도": { x: 160, y: 80, width: 80, height: 80 },
        "강원특별자치도": { x: 260, y: 60, width: 100, height: 100 },
        "강원도": { x: 260, y: 60, width: 100, height: 100 },
        "충청북도": { x: 220, y: 180, width: 60, height: 60 },
        "충청남도": { x: 140, y: 180, width: 70, height: 70 },
        "대전광역시": { x: 190, y: 200, width: 25, height: 25 },
        "세종특별자치시": { x: 180, y: 185, width: 20, height: 20 },
        "전북특별자치도": { x: 140, y: 260, width: 70, height: 60 },
        "전라북도": { x: 140, y: 260, width: 70, height: 60 },
        "전라남도": { x: 100, y: 320, width: 100, height: 80 },
        "광주광역시": { x: 130, y: 310, width: 30, height: 30 },
        "경상북도": { x: 280, y: 180, width: 90, height: 100 },
        "대구광역시": { x: 270, y: 250, width: 35, height: 35 },
        "경상남도": { x: 240, y: 300, width: 100, height: 70 },
        "부산광역시": { x: 330, y: 340, width: 35, height: 35 },
        "울산광역시": { x: 350, y: 300, width: 30, height: 30 },
        "제주특별자치도": { x: 80, y: 420, width: 60, height: 40 }
    }

    return (
        <div className="relative w-full h-full">
            <svg viewBox="0 0 450 500" className="w-full h-full">
                {/* 배경 */}
                <rect width="450" height="500" fill="transparent" />

                {/* 시도별 영역 */}
                {Object.entries(provincePositions).map(([province, pos]) => {
                    const data = provinceData[province]
                    if (!data) return null

                    const isHovered = data.regions.some(r => r.code === hoveredCode)
                    const isSelected = data.regions.some(r => r.code === selectedRegion)

                    return (
                        <g key={province}>
                            {/* 시도 배경 */}
                            <rect
                                x={pos.x}
                                y={pos.y}
                                width={pos.width}
                                height={pos.height}
                                fill={getGradeColor(data.avgGrade)}
                                fillOpacity={isSelected ? 0.5 : isHovered ? 0.4 : 0.25}
                                stroke={isSelected ? "#fff" : getGradeColor(data.avgGrade)}
                                strokeWidth={isSelected ? 3 : 1.5}
                                rx={4}
                                className="transition-all duration-200"
                            />

                            {/* 시군구별 작은 원들 */}
                            {data.regions.map((region, idx) => {
                                const cols = Math.ceil(Math.sqrt(data.regions.length))
                                const row = Math.floor(idx / cols)
                                const col = idx % cols
                                const spacing = Math.min(pos.width, pos.height) / (cols + 1)
                                const cx = pos.x + spacing * (col + 1)
                                const cy = pos.y + spacing * (row + 1)
                                const isRegionSelected = selectedRegion === region.code
                                const isRegionHovered = hoveredCode === region.code

                                return (
                                    <g key={region.code}>
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={isRegionSelected ? 6 : isRegionHovered ? 5 : 4}
                                            fill={getGradeColor(region.grade)}
                                            stroke={isRegionSelected ? "#fff" : "none"}
                                            strokeWidth={2}
                                            className="cursor-pointer transition-all duration-200"
                                            onMouseEnter={() => setHoveredCode(region.code)}
                                            onMouseLeave={() => setHoveredCode(null)}
                                            onClick={() => onRegionClick(region.code)}
                                        />

                                        {/* 툴팁 */}
                                        {isRegionHovered && (
                                            <g>
                                                <rect
                                                    x={cx - 45}
                                                    y={cy - 35}
                                                    width={90}
                                                    height={28}
                                                    rx={4}
                                                    fill="#1e293b"
                                                    stroke="#334155"
                                                    strokeWidth={1}
                                                />
                                                <text
                                                    x={cx}
                                                    y={cy - 22}
                                                    textAnchor="middle"
                                                    fill="#fff"
                                                    fontSize={9}
                                                    fontWeight="bold"
                                                >
                                                    {region.name}
                                                </text>
                                                <text
                                                    x={cx}
                                                    y={cy - 12}
                                                    textAnchor="middle"
                                                    fill={getGradeColor(region.grade)}
                                                    fontSize={11}
                                                    fontWeight="bold"
                                                >
                                                    {region.grade}등급
                                                </text>
                                            </g>
                                        )}
                                    </g>
                                )
                            })}

                            {/* 시도 이름 */}
                            <text
                                x={pos.x + pos.width / 2}
                                y={pos.y - 5}
                                textAnchor="middle"
                                fill="#94a3b8"
                                fontSize={10}
                                fontWeight="bold"
                                className="pointer-events-none"
                            >
                                {province.replace('특별시', '').replace('광역시', '').replace('특별자치시', '').replace('특별자치도', '').replace('도', '')}
                            </text>
                        </g>
                    )
                })}
            </svg>

            {/* 범례 */}
            <div className="absolute bottom-2 right-2 bg-slate-900/90 backdrop-blur-sm rounded-lg p-2 border border-white/10">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">등급</div>
                <div className="space-y-0.5">
                    {['S', 'A', 'B', 'C', 'D'].map(grade => (
                        <div key={grade} className="flex items-center gap-1.5">
                            <div
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: getGradeColor(grade) }}
                            />
                            <span className="text-[10px] text-slate-300 font-medium">{grade}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export function RegionSelector({
    locationData,
    selectedProvince,
    selectedRegion,
    onProvinceChange,
    onRegionChange,
    currentData
}: RegionSelectorProps) {
    // 시도 목록 추출
    const provinces = Array.from(new Set(Object.values(locationData).map(d => d.province))).sort()

    // 선택된 시도의 시군구 목록
    const regions = selectedProvince
        ? Object.entries(locationData)
            .filter(([_, data]) => data.province === selectedProvince)
            .map(([code, data]) => ({ code, name: data.name }))
            .sort((a, b) => a.name.localeCompare(b.name))
        : []

    return (
        <div className="glass-card rounded-2xl p-6 border-white/5">
            <Tabs defaultValue="dropdown" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="dropdown" className="flex items-center gap-2">
                        <MapPin className="size-4" />
                        <span>드롭다운</span>
                    </TabsTrigger>
                    <TabsTrigger value="map" className="flex items-center gap-2">
                        <MapIcon className="size-4" />
                        <span>지도</span>
                    </TabsTrigger>
                </TabsList>

                {/* 드롭다운 선택 */}
                <TabsContent value="dropdown" className="space-y-4 mt-0">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">시/도</label>
                        <Select value={selectedProvince} onValueChange={onProvinceChange}>
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
                        <Select value={selectedRegion} onValueChange={onRegionChange} disabled={!selectedProvince}>
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
                </TabsContent>

                {/* 지도 선택 */}
                <TabsContent value="map" className="mt-0">
                    <div className="h-[450px]">
                        <KoreaMapSVG
                            locationData={locationData}
                            onRegionClick={onRegionChange}
                            selectedRegion={selectedRegion}
                        />
                    </div>
                </TabsContent>
            </Tabs>

            {/* 선택된 지역 정보 표시 */}
            {currentData && (
                <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="text-center space-y-2">
                        <div className="text-xs font-black uppercase tracking-widest text-slate-500">선택된 지역</div>
                        <div className="text-lg font-black text-white">{currentData.province}</div>
                        <div className="text-2xl font-black text-emerald-400">{currentData.name}</div>
                    </div>
                </div>
            )}
        </div>
    )
}
