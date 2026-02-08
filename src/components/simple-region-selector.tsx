"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin } from "lucide-react"

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

interface SimpleRegionSelectorProps {
    locationData: LocationMaster
    selectedProvince: string
    selectedRegion: string
    onProvinceChange: (province: string) => void
    onRegionChange: (code: string) => void
    currentData: LocationData | null
}

export function SimpleRegionSelector({
    locationData,
    selectedProvince,
    selectedRegion,
    onProvinceChange,
    onRegionChange,
    currentData
}: SimpleRegionSelectorProps) {
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
        <div className="glass-card rounded-2xl p-5 border-white/5">
            <div className="flex items-center gap-2 mb-4">
                <MapPin className="size-4 text-emerald-500" />
                <h3 className="text-base font-black text-white">지역 선택</h3>
            </div>

            <div className="space-y-3">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">시/도</label>
                    <Select value={selectedProvince} onValueChange={onProvinceChange}>
                        <SelectTrigger className="h-10 bg-white/5 border-white/10 rounded-lg text-white font-bold text-sm">
                            <SelectValue placeholder="시/도 선택" />
                        </SelectTrigger>
                        <SelectContent>
                            {provinces.map(province => (
                                <SelectItem key={province} value={province}>{province}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">시/군/구</label>
                    <Select value={selectedRegion} onValueChange={onRegionChange} disabled={!selectedProvince}>
                        <SelectTrigger className="h-10 bg-white/5 border-white/10 rounded-lg text-white font-bold text-sm">
                            <SelectValue placeholder="시/군/구 선택" />
                        </SelectTrigger>
                        <SelectContent>
                            {regions.map(({ code, name }) => (
                                <SelectItem key={code} value={code}>{name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* 선택된 지역 정보 표시 */}
            {currentData && (
                <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-center space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">선택된 지역</div>
                        <div className="text-sm font-black text-white">{currentData.province}</div>
                        <div className="text-lg font-black text-emerald-400">{currentData.name}</div>
                    </div>
                </div>
            )}
        </div>
    )
}
