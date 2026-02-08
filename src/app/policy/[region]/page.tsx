import { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Landmark, Info, Calendar, FileCheck, Sparkles, Share2 } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { promises as fs } from "fs"
import path from "path"

async function getPolicy(id: string) {
    try {
        const filePath = path.join(process.cwd(), "public", "data", "policy-data.json")
        const fileContent = await fs.readFile(filePath, "utf-8")
        const data = JSON.parse(fileContent)
        // Access data directly if array, or data.policies if object
        const policies = Array.isArray(data) ? data : (data.policies || [])
        return policies.find((p: any) => p.id === id)
    } catch (error) {
        console.error("Error reading policy data:", error)
        return null
    }
}

interface PolicyPageProps {
    params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: PolicyPageProps): Promise<Metadata> {
    const { region: regionId } = await params
    const policy = await getPolicy(regionId)

    if (!policy) {
        return {
            title: "정책 정보를 찾을 수 없습니다 - Green Pulse",
        }
    }

    return {
        title: `${policy.title} - Green Pulse`,
        description: `${policy.region} 에너지 보조금 및 지원 정책 상세 분석.`,
    }
}

export default async function PolicyDetailPage({ params }: PolicyPageProps) {
    const { region: regionId } = await params
    const policy = await getPolicy(regionId)

    if (!policy) notFound()

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
            <div className="flex items-center justify-between mb-12">
                <Button variant="ghost" asChild className="group text-slate-400 hover:text-white transition-colors">
                    <Link href="/policy" className="flex items-center gap-2">
                        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        목록으로 돌아가기
                    </Link>
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 text-white">
                        <Share2 className="size-4" />
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-12">
                {/* Header Information */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest">
                            {policy.region}
                        </div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest`}>
                            {policy.status === "접수중" ? "접수중" : "대기중"}
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight max-w-4xl">
                        {policy.title}
                    </h1>
                    <div className="flex items-end gap-4">
                        <div className="space-y-1">
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">지원 규모</span>
                            <div className="text-3xl font-black text-emerald-500 tracking-tighter">{policy.amount}</div>
                        </div>
                    </div>
                </div>

                {/* Grid Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="glass-card rounded-3xl p-6 border-white/5 group hover:border-emerald-500/20 transition-all">
                        <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                            <Landmark className="size-5" />
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">담당 기관</h4>
                        <p className="text-white font-bold">{policy.region} 에너지과</p>
                    </div>
                    <div className="glass-card rounded-3xl p-6 border-white/5 group hover:border-blue-500/20 transition-all">
                        <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-black transition-all">
                            <Calendar className="size-5" />
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">신청 기간</h4>
                        <p className="text-white font-bold">예산 소진 시 마감 (선착순)</p>
                    </div>
                    <div className="glass-card rounded-3xl p-6 border-white/5 group hover:border-amber-500/20 transition-all">
                        <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-black transition-all">
                            <FileCheck className="size-5" />
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">지원 대상</h4>
                        <p className="text-white font-bold">{policy.region} 소재 주택/사업자</p>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="grid lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-12">
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Info className="size-6 text-emerald-500" />
                                <h2 className="text-2xl font-black text-white">정책 개요</h2>
                            </div>
                            <div className="space-y-4">
                                <p className="text-xl leading-relaxed text-slate-300 font-medium">
                                    {policy.description}
                                </p>
                                <p className="text-slate-400 leading-relaxed opacity-80 underline decoration-white/5 underline-offset-8">
                                    '2026 에너지 전환 정책'의 일환으로 시행되는 본 사업은 {policy.region}민의 에너지 자립도를 높이고 초기 설치 비용 부담을 완화하여 탄소 중립을 실현하는 것을 목표로 합니다.
                                </p>
                            </div>
                        </section>

                        <section className="glass-card rounded-[2rem] p-8 md:p-10 space-y-8 relative overflow-hidden group">
                            <div className="flex items-center gap-3">
                                <Sparkles className="size-6 text-emerald-500" />
                                <h2 className="text-2xl font-black text-white">지원 상세 내용</h2>
                            </div>
                            <ul className="space-y-6">
                                {[
                                    { label: "지원 품목", value: policy.title.includes('태양광') ? '태양광 모듈, 인버터, 구조물 설치비' : '신재생에너지 설비 전반' },
                                    { label: "지원 한도", value: policy.amount + " (가구/호 당)" },
                                    { label: "사후 관리", value: "무상 A/S 5년 및 정기 점검" },
                                    { label: "추가 혜택", value: "녹색 금융 상품 금리 우대" }
                                ].map((spec, i) => (
                                    <li key={i} className="flex flex-col gap-1 border-l-2 border-emerald-500/20 pl-6 hover:border-emerald-500 transition-colors">
                                        <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{spec.label}</span>
                                        <span className="text-lg font-bold text-white">{spec.value}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="absolute -right-10 -bottom-10 size-40 bg-emerald-500/5 rounded-full blur-3xl" />
                        </section>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        <div className="glass-card rounded-[2rem] p-8 space-y-8 border-emerald-500/10">
                            <h3 className="text-xl font-black text-white">신청 절차</h3>
                            <div className="space-y-6">
                                {[
                                    { step: "01", title: "현장 실사", desc: "참여 기업을 통한 설치 가능 여부 확인" },
                                    { step: "02", title: "서류 접수", desc: "신청서 및 본인 확인 서류 제출" },
                                    { step: "03", title: "심사 대기", desc: "지자체 심사 및 선정 통보" },
                                    { step: "04", title: "설치 및 정산", desc: "공사 진행 후 보조금 최종 정산" }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <span className="text-lg font-black text-emerald-500 opacity-50">{item.step}</span>
                                        <div className="space-y-1">
                                            <h4 className="text-base font-bold text-white uppercase tracking-wider">{item.title}</h4>
                                            <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button asChild className="w-full h-14 rounded-2xl bg-emerald-500 text-black font-black uppercase tracking-widest hover:bg-emerald-400 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                <a href={policy.link || "#"} target="_blank" rel="noopener noreferrer">
                                    지원 신청하기
                                </a>
                            </Button>
                        </div>

                        <div className="glass-card rounded-[2rem] p-6 text-center border-white/5">
                            <p className="text-sm text-slate-500 leading-relaxed">
                                예산 소진 시 조기 마감될 수 있으니, 빠른 신청을 권장드립니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
