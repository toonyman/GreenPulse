"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Leaf, ArrowRight, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
    { title: "대시보드", url: "/" },
    { title: "그린 체크", url: "/green-check" },
    { title: "수익 계산기", url: "/calc" },
    { title: "시장 뉴스", url: "/news" },
]

export function TopNav() {
    const pathname = usePathname()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/60 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-emerald-500 text-black group-hover:bg-emerald-400 transition-colors">
                        <Leaf className="size-5" />
                    </div>
                    <div className="flex flex-col gap-0 leading-none">
                        <span className="font-black text-xl tracking-tighter text-white group-hover:text-emerald-400 transition-colors">Green Pulse</span>
                        <span className="text-xs text-emerald-500/80 font-black uppercase tracking-[0.2em] hidden sm:block">Eco Energy Intel</span>
                    </div>
                </Link>

                <nav className="hidden md:flex items-center gap-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.url}
                            href={item.url}
                            className={cn(
                                "relative px-4 py-2 text-base font-bold transition-all hover:text-emerald-400 tracking-tight",
                                pathname === item.url ? "text-emerald-400" : "text-white/50"
                            )}
                        >
                            {item.title}
                            {pathname === item.url && (
                                <span className="absolute inset-x-4 -bottom-[21px] h-0.5 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <Link
                        href="/calc"
                        className="hidden sm:inline-flex h-9 items-center justify-center rounded-full bg-emerald-500 px-5 text-sm font-black text-black hover:bg-emerald-400 transition-all active:scale-95 uppercase tracking-wider"
                    >
                        수익 분석 시작 <ArrowRight className="ml-2 size-3" />
                    </Link>
                    <button className="md:hidden text-white p-2">
                        <Menu className="size-6" />
                    </button>
                </div>
            </div>
        </header>
    )
}
