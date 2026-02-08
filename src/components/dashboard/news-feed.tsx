"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Calendar } from "lucide-react"

interface NewsItem {
    title: string
    link: string
    description: string
    pubDate: string
}

export function NewsFeed() {
    const [news, setNews] = useState<NewsItem[]>([])

    useEffect(() => {
        // Try to fetch from API first
        fetch("/api/news")
            .then(async (res) => {
                if (!res.ok) throw new Error("API call failed")
                const data = await res.json()
                // Naver API returns HTML entities in title/desc, so stripping is handled in render
                setNews(data)
            })
            .catch(() => {
                // Fallback to local dummy data if API fails or keys missing
                console.log("Fetching fallback news data...")
                fetch("/data/news-data.json")
                    .then((res) => res.json())
                    .then((data) => setNews(data))
            })
    }, [])

    const stripHtml = (html: string) => {
        return html.replace(/<[^>]*>?/gm, "").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
    }

    if (news.length === 0) return (
        <Card>
            <CardHeader>
                <CardTitle>최신 시장 뉴스</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-muted/50 rounded-lg animate-pulse" />
                ))}
            </CardContent>
        </Card>
    )

    return (
        <div className="space-y-6">
            {news.slice(0, 6).map((item, index) => (
                <div key={index} className="group relative border-b border-white/5 pb-6 last:border-0 last:pb-0">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-4">
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-lg font-bold text-white transition-colors hover:text-emerald-400 leading-snug"
                                dangerouslySetInnerHTML={{ __html: item.title }}
                            />
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="shrink-0 size-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-all">
                                <ExternalLink className="size-4" />
                            </a>
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                            {stripHtml(item.description)}
                        </p>
                        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                            <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded">
                                <Calendar className="size-3 text-emerald-500" />
                                {new Date(item.pubDate).toLocaleDateString()}
                            </span>
                            <span className="text-emerald-500/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                Article Insights Available
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
