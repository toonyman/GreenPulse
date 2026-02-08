"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Calendar, ExternalLink, Newspaper, TrendingUp, Sparkles, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface NewsItem {
    title: string
    link: string
    description: string
    pubDate: string
}

export default function NewsPage() {
    const [news, setNews] = useState<NewsItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/data/news-data.json")
            .then((res) => res.json())
            .then((data) => {
                setNews(data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    const stripHtml = (html: string) => {
        return html.replace(/<[^>]*>?/gm, "").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
    }

    const featuredNews = news[0]
    const otherNews = news.slice(1, 10)

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col gap-10">
            {/* Header Section */}
            <div className="text-center space-y-3">
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white lowercase">
                    GLOBAL <span className="text-emerald-500 uppercase">에너지 뉴스</span>
                </h1>
                <p className="text-slate-400 max-w-xl mx-auto text-base font-medium">
                    전 세계 신재생에너지 시장의 흐름과 핵심 인사이트를 실시간으로 제공합니다.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
                {/* News Area */}
                <div className="lg:col-span-8 flex flex-col gap-12">
                    {loading ? (
                        <div className="space-y-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-48 glass-card rounded-[2rem] animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* Featured News */}
                            {featuredNews && (
                                <div className="glass-card rounded-[2.5rem] p-8 md:p-12 group hover:border-emerald-500/30 transition-all hover:translate-y-[-2px] relative overflow-hidden">
                                    <div className="relative z-10 flex flex-col gap-8">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <Badge className="bg-emerald-500 text-black font-black px-4 py-1 rounded-full uppercase tracking-widest text-xs">
                                                    주요 소식
                                                </Badge>
                                                <span className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                                    <Calendar className="size-3 text-blue-500" />
                                                    {new Date(featuredNews.pubDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <a href={featuredNews.link} target="_blank" rel="noopener noreferrer" className="size-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-all">
                                                <ExternalLink className="size-6" />
                                            </a>
                                        </div>

                                        <div className="space-y-6">
                                            <a
                                                href={featuredNews.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-3xl md:text-5xl font-black text-white tracking-tight leading-[1.1] block group-hover:text-emerald-400 transition-colors"
                                                dangerouslySetInnerHTML={{ __html: featuredNews.title }}
                                            />
                                            <p className="text-slate-300 text-xl leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                                                {stripHtml(featuredNews.description)}
                                            </p>
                                        </div>

                                        <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
                                                프리미엄 기분 분석 <Sparkles className="size-4 text-emerald-500" />
                                            </div>
                                            <a href={featuredNews.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors">
                                                전체 읽기 <ArrowRight className="size-4" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="absolute -right-20 -top-20 size-80 bg-emerald-500/5 rounded-full blur-[120px] -z-0" />
                                </div>
                            )}

                            {/* Remaining News Grid */}
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {otherNews.map((item, index) => (
                                    <div key={index} className="glass-card rounded-[2rem] p-6 flex flex-col justify-between group hover:border-emerald-500/20 transition-all hover:bg-white/[0.02]">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Badge variant="outline" className="bg-emerald-500/5 border-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider text-xs">
                                                    에너지
                                                </Badge>
                                                <span className="text-xs font-black uppercase tracking-widest text-slate-600">
                                                    {new Date(item.pubDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                dangerouslySetInnerHTML={{ __html: item.title }}
                                            />
                                        </div>
                                        <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                                                자세히 보기 <ArrowRight className="inline size-2.5 ml-1" />
                                            </a>
                                            <ExternalLink className="size-3 text-slate-700 opacity-50 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Sidebar Widgets */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="glass-card rounded-[2rem] p-8 space-y-6 lg:sticky lg:top-24">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-black text-white tracking-tighter uppercase">Market Insights</h3>
                            <TrendingUp className="size-5 text-emerald-500" />
                        </div>
                        <div className="space-y-4">
                            {[
                                { title: "REC 시장 동향", value: "안정적 상승 (+1.2%)", color: "text-emerald-500" },
                                { title: "글로벌 탄소 지수", value: "강세 지속", color: "text-blue-500" },
                                { title: "정책 업데이트", value: "경기도 신규 지원금", color: "text-amber-500" }
                            ].map((insight, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 group hover:bg-white/10 transition-colors cursor-pointer">
                                    <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{insight.title}</div>
                                    <div className={cn("text-lg font-bold", insight.color)}>{insight.value}</div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl relative overflow-hidden">
                            <p className="text-sm text-slate-300 leading-relaxed relative z-10 font-medium tracking-tight">
                                "신재생에너지 자산 시장이 성숙기에 접어들고 있습니다. 이제 전략적 자산 배분이 그 어느 때보다 중요합니다."
                            </p>
                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                <Sparkles className="size-8 text-emerald-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ad Space */}
            <div className="w-full h-32 glass-card rounded-3xl border border-dashed border-white/10 flex items-center justify-center text-slate-600 text-xs font-black uppercase tracking-[0.3em]">
                전략적 파트너 인텔리전스 공간
            </div>
        </div>
    )
}
