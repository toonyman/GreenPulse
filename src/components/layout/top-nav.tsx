"use client"

import Link from "next/link"
import { Leaf, ArrowRight, Menu } from "lucide-react"

export function TopNav() {
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

                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="hidden sm:inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-6 text-[13px] font-black text-white hover:bg-slate-800 transition-all active:scale-95 uppercase tracking-wider"
                    >
                        수익 계산하기 <ArrowRight className="ml-2 size-3.5 text-emerald-400" />
                    </Link>
                    <button className="md:hidden text-slate-900 p-2">
                        <Menu className="size-6" />
                    </button>
                </div>
            </div>
        </header>
    )
}
