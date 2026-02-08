"use client"

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]

export function MarketTrendChart({ data }: { data: any[] }) {
    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>최근 7일 가격 추이</CardTitle>
                <CardDescription>SMP 및 REC 시세 변동 현황</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => val.split("-").slice(1).join("/")}
                            />
                            <YAxis
                                yAxisId="left"
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => `${val.toLocaleString()}원`}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => `${val.toLocaleString()}원`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
                                itemStyle={{ fontSize: "12px" }}
                            />
                            <Legend verticalAlign="top" height={36} />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="smp"
                                name="SMP (kWh)"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={{ r: 4, fill: "#10b981" }}
                                activeDot={{ r: 6 }}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="rec"
                                name="REC (1REC)"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ r: 4, fill: "#3b82f6" }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export function EnergyMixChart({ data }: { data: any[] }) {
    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>에너지원 발주 비중</CardTitle>
                <CardDescription>현재 국가 에너지원별 발전 비율</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
                                itemStyle={{ fontSize: "12px" }}
                            />
                            <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
