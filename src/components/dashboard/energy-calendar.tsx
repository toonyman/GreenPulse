"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CalendarDays, Bell, ExternalLink, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnergyEvent {
    id: number
    date: Date
    title: string
    category: 'subsidy' | 'earning' | 'policy'
    status: 'ongoing' | 'closing' | 'upcoming'
    description: string
    link?: string
    target?: string
}

const mockEvents: EnergyEvent[] = [
    {
        id: 1,
        date: new Date(2026, 1, 15), // 2026-02-15
        title: "신재생에너지 금융지원사업 1차 접수",
        category: 'subsidy',
        status: 'ongoing',
        description: "태양광, 풍력 등 신재생에너지 발전설비 설치 자금 지원. 최대 90% 융자 지원.",
        link: "https://www.knrec.or.kr",
        target: "신재생에너지 발전사업자"
    },
    {
        id: 2,
        date: new Date(2026, 1, 20),
        title: "한전 2025년 4분기 경영 실적 발표",
        category: 'earning',
        status: 'upcoming',
        description: "전력 시장 대금 결제 및 유동성 파악을 위한 주요 실적 공시.",
        target: "투자자 및 유관기관"
    },
    {
        id: 3,
        date: new Date(2026, 1, 10),
        title: "탄소중립포인트제 확대 시행",
        category: 'policy',
        status: 'ongoing',
        description: "생활 실천형 탄소 지불제도 보너스 포인트 지급 범위 확대.",
        link: "https://www.cpoint.or.kr",
        target: "일반 국민"
    },
    {
        id: 4,
        date: new Date(2026, 1, 5),
        title: "농촌 태양광 보조금 2차 마감",
        category: 'subsidy',
        status: 'closing',
        description: "농어촌 지역 태양광 보조금 신청 최종 마감 시한.",
        link: "https://www.energy.or.kr",
        target: "농어민 임차인"
    }
]

export function EnergyCalendar() {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [selectedEvent, setSelectedEvent] = useState<EnergyEvent | null>(null)

    const selectedDateEvents = mockEvents.filter(e =>
        e.date.toDateString() === date?.toDateString()
    )

    const statusMap = {
        ongoing: { label: '진행 중', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
        closing: { label: '마감 임박', color: 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse' },
        upcoming: { label: '예정', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' }
    }

    const categoryMap = {
        subsidy: '보조금/지원',
        earning: '기업 공시',
        policy: '정책/규제'
    }

    return (
        <div className="glass-card rounded-[2rem] p-6 border-white/5 flex flex-col h-full group hover:border-blue-500/20 transition-all overflow-hidden relative">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <CalendarDays className="size-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white italic">ENERGY CALENDAR</h3>
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">주요 정책 및 산업 일정</p>
                    </div>
                </div>
                <div className="size-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:text-white cursor-pointer transition-colors">
                    <Bell className="size-4" />
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-8">
                {/* Calendar Side */}
                <div className="flex-none flex justify-start">
                    <div className="w-[320px] glass-card bg-white/[0.01] border-white/5 p-4 rounded-2xl">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="p-0"
                            modifiers={{
                                hasEvent: mockEvents.map(e => e.date)
                            }}
                            modifiersClassNames={{
                                hasEvent: "after:content-[''] after:block after:size-1 after:bg-blue-500 after:rounded-full after:mx-auto after:mt-0.5"
                            }}
                        />
                        <div className="mt-4 pt-4 border-t border-white/5 px-1">
                            <div className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                                <div className="size-1.5 bg-blue-500 rounded-full" />
                                <span>주요 일정이 있는 날짜</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Events Side */}
                <div className="flex-1 flex flex-col gap-4 min-h-[380px] bg-white/[0.01] rounded-2xl p-2 border border-white/5">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                        <div className="flex flex-col">
                            <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none">
                                {selectedDateEvents.length > 0 ? 'Selected Day' : 'Upcoming'}
                            </h4>
                            <span className="text-lg font-black text-white italic mt-1.5 font-mono leading-none">
                                {date ? date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase() : 'NO DATE'}
                            </span>
                        </div>
                        <Badge className="bg-blue-500 text-white font-black text-[11px] px-3 py-1 rounded-full">
                            {selectedDateEvents.length > 0 ? `${selectedDateEvents.length} APPOINTMENTS` : 'LATEST LIST'}
                        </Badge>
                    </div>

                    <div className="flex-1 overflow-auto custom-scrollbar px-1 pb-1 space-y-3">
                        {(selectedDateEvents.length > 0 ? selectedDateEvents : mockEvents.sort((a, b) => a.date.getTime() - b.date.getTime())).map(event => (
                            <Dialog key={event.id}>
                                <DialogTrigger asChild>
                                    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl hover:bg-white/[0.05] hover:border-blue-500/30 transition-all cursor-pointer group/item relative overflow-hidden flex items-center gap-5">
                                        <div className="flex-none flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 min-w-[60px] border border-white/5">
                                            <span className="text-[10px] font-black text-slate-500 uppercase font-mono leading-none">{event.date.toLocaleDateString('en-US', { month: 'short' })}</span>
                                            <span className="text-xl font-black text-white font-mono leading-none mt-1.5">{event.date.getDate()}</span>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <Badge variant="outline" className={cn("text-[10px] font-black h-4.5 px-2 tracking-tighter", statusMap[event.status].color)}>
                                                    {statusMap[event.status].label}
                                                </Badge>
                                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none">{categoryMap[event.category]}</span>
                                            </div>
                                            <h5 className="text-[15px] font-black text-white group-hover/item:text-blue-400 transition-colors line-clamp-1 leading-tight tracking-tight">{event.title}</h5>
                                            <p className="text-[12px] text-slate-500 font-bold truncate italic leading-none mt-1">{event.target}</p>
                                        </div>

                                        <div className="flex-none text-slate-700 group-hover/item:text-blue-500 transition-colors">
                                            <ExternalLink className="size-4.5" />
                                        </div>

                                        <div className="absolute left-0 top-0 h-full w-[3px] bg-blue-500 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="bg-slate-900 border-white/10 text-white rounded-[2rem] max-w-md">
                                    <DialogHeader>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge className={statusMap[event.status].color}>
                                                {statusMap[event.status].label}
                                            </Badge>
                                            <span className="text-xs font-bold text-slate-500">{categoryMap[event.category]}</span>
                                        </div>
                                        <DialogTitle className="text-2xl font-black italic">{event.title}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-6 mt-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-[0.2em]">
                                                <Info className="size-3" />
                                                Description
                                            </div>
                                            <p className="text-slate-300 text-sm leading-relaxed font-medium">
                                                {event.description}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                                <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Target</span>
                                                <span className="text-sm font-bold text-white">{event.target}</span>
                                            </div>
                                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                                <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Date</span>
                                                <span className="text-sm font-bold text-white font-mono">{event.date.toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        {event.link && (
                                            <a
                                                href={event.link}
                                                target="_blank"
                                                className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-blue-500/20"
                                            >
                                                상세 내용 및 신청하기 <ExternalLink className="size-4" />
                                            </a>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ))}
                    </div>
                </div>
            </div>

            {/* Background Accent */}
            <div className="absolute -right-12 -top-12 size-48 blur-3xl opacity-5 bg-blue-500 rounded-full" />
        </div>
    )
}
