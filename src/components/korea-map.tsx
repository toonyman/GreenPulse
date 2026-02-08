"use client"

import { useState } from "react"
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
    last_updated: string
}

interface LocationMaster {
    [key: string]: LocationData
}

interface KoreaMapProps {
    locationData: LocationMaster
    onRegionClick: (code: string) => void
    selectedRegion?: string
}

// 시도별 좌표 (간단한 위치 표시용)
const PROVINCE_POSITIONS: { [key: string]: { x: number; y: number; regions: string[] } } = {
    "서울특별시": { x: 250, y: 180, regions: [] },
    "부산광역시": { x: 380, y: 420, regions: [] },
    "대구광역시": { x: 320, y: 350, regions: [] },
    "인천광역시": { x: 180, y: 180, regions: [] },
    "광주광역시": { x: 180, y: 380, regions: [] },
    "대전광역시": { x: 240, y: 280, regions: [] },
    "울산광역시": { x: 400, y: 380, regions: [] },
    "세종특별자치시": { x: 240, y: 260, regions: [] },
    "경기도": { x: 220, y: 140, regions: [] },
    "강원특별자치도": { x: 350, y: 140, regions: [] },
    "충청북도": { x: 280, y: 240, regions: [] },
    "충청남도": { x: 200, y: 260, regions: [] },
    "전북특별자치도": { x: 200, y: 320, regions: [] },
    "전라남도": { x: 180, y: 400, regions: [] },
    "경상북도": { x: 350, y: 280, regions: [] },
    "경상남도": { x: 320, y: 400, regions: [] },
    "제주특별자치도": { x: 140, y: 520, regions: [] }
}

export function KoreaMap({ locationData, onRegionClick, selectedRegion }: KoreaMapProps) {
    const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)

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

    // 지역 데이터를 시도별로 그룹화
    const groupedData: { [key: string]: Array<{ code: string; data: LocationData }> } = {}
    Object.entries(locationData).forEach(([code, data]) => {
        if (!groupedData[data.province]) {
            groupedData[data.province] = []
        }
        groupedData[data.province].push({ code, data })
    })

    return (
        <div className="relative w-full h-full">
            <svg
                viewBox="0 0 500 600"
                className="w-full h-full"
                style={{ maxHeight: '600px' }}
            >
                {/* 배경 */}
                <rect width="500" height="600" fill="transparent" />

                {/* 시도별 원형 표시 */}
                {Object.entries(groupedData).map(([province, regions]) => {
                    const position = PROVINCE_POSITIONS[province]
                    if (!position) return null

                    // 해당 시도의 평균 등급 계산
                    const avgScore = regions.reduce((sum, r) => sum + r.data.total_score, 0) / regions.length
                    const avgGrade = avgScore >= 90 ? 'S' : avgScore >= 80 ? 'A' : avgScore >= 70 ? 'B' : avgScore >= 60 ? 'C' : 'D'

                    return (
                        <g key={province}>
                            {/* 시도 원 */}
                            <circle
                                cx={position.x}
                                cy={position.y}
                                r={Math.max(30, regions.length * 3)}
                                fill={getGradeColor(avgGrade)}
                                fillOpacity={0.3}
                                stroke={getGradeColor(avgGrade)}
                                strokeWidth={2}
                                className="transition-all duration-300"
                            />

                            {/* 시군구별 작은 원들 */}
                            {regions.map((region, idx) => {
                                const angle = (idx / regions.length) * Math.PI * 2
                                const radius = 40
                                const x = position.x + Math.cos(angle) * radius
                                const y = position.y + Math.sin(angle) * radius
                                const isSelected = selectedRegion === region.code
                                const isHovered = hoveredRegion === region.code

                                return (
                                    <g key={region.code}>
                                        <circle
                                            cx={x}
                                            cy={y}
                                            r={isSelected ? 10 : isHovered ? 8 : 6}
                                            fill={getGradeColor(region.data.grade)}
                                            stroke={isSelected ? "#fff" : "none"}
                                            strokeWidth={isSelected ? 2 : 0}
                                            className="cursor-pointer transition-all duration-200"
                                            onMouseEnter={() => setHoveredRegion(region.code)}
                                            onMouseLeave={() => setHoveredRegion(null)}
                                            onClick={() => onRegionClick(region.code)}
                                        />

                                        {/* 툴팁 */}
                                        {isHovered && (
                                            <g>
                                                <rect
                                                    x={x - 50}
                                                    y={y - 40}
                                                    width={100}
                                                    height={30}
                                                    rx={4}
                                                    fill="#1e293b"
                                                    stroke="#334155"
                                                    strokeWidth={1}
                                                />
                                                <text
                                                    x={x}
                                                    y={y - 30}
                                                    textAnchor="middle"
                                                    fill="#fff"
                                                    fontSize={10}
                                                    fontWeight="bold"
                                                >
                                                    {region.data.name}
                                                </text>
                                                <text
                                                    x={x}
                                                    y={y - 18}
                                                    textAnchor="middle"
                                                    fill={getGradeColor(region.data.grade)}
                                                    fontSize={12}
                                                    fontWeight="bold"
                                                >
                                                    {region.data.grade}등급 ({region.data.total_score}점)
                                                </text>
                                            </g>
                                        )}
                                    </g>
                                )
                            })}

                            {/* 시도 이름 */}
                            <text
                                x={position.x}
                                y={position.y + 5}
                                textAnchor="middle"
                                fill="#fff"
                                fontSize={12}
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
            <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">등급</div>
                <div className="space-y-1">
                    {['S', 'A', 'B', 'C', 'D'].map(grade => (
                        <div key={grade} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: getGradeColor(grade) }}
                            />
                            <span className="text-xs text-slate-300 font-medium">{grade}등급</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
