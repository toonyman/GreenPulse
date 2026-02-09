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
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-emerald-600 text-white group-hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20">
                        <Leaf className="size-5" />
                    </div>
                    <div className="flex flex-col gap-0 leading-none">
                        <span className="font-black text-xl tracking-tighter text-slate-900 group-hover:text-emerald-600 transition-colors">EcoMoney</span>
                        <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest hidden sm:block">Sustainable Insight</span>
                    </div>
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.url}
                            href={item.url}
                            className={cn(
                                "relative px-4 py-2 text-sm font-bold transition-all hover:text-emerald-600 tracking-tight",
                                pathname === item.url ? "text-emerald-600" : "text-slate-500"
                            )}
                        >
                            {pathname === item.url && (
                                <span className="absolute inset-0 bg-emerald-50 rounded-lg -z-10" />
                            )}
                            {item.title}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <Link
                        href="/calc"
                        className="hidden sm:inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-6 text-[13px] font-black text-white hover:bg-slate-800 transition-all active:scale-95 uppercase tracking-wider"
                    >
                        분석 시작 <ArrowRight className="ml-2 size-3.5 text-emerald-400" />
                    </Link>
                    <button className="md:hidden text-slate-900 p-2">
                        <Menu className="size-6" />
                    </button>
                </div>
            </div>
        </header>
    )
}
