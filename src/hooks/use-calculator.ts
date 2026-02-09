import { useState, useMemo } from 'react';

export interface CalculationResult {
    dailyGeneration: number;
    monthlyRevenue: number;
    yearlyRevenue: number;
    carbonReduction: number; // kg
    paybackPeriod: number; // years
    tenYearData: { year: string; revenue: number }[];
}

export function useCalculator(area: number) {
    // Constants based on the instruction
    const EFFICIENCY = 0.15;
    const DAILY_SOLAR_HOURS = 3.6;
    const SMP_REC_TOTAL = 200; // Average assumption
    const INITIAL_INVESTMENT_PER_KW = 1500000; // 1.5M KRW per kW
    const KW_PER_M2 = 0.15; // Assumption: 0.15kW per 1m2 (approx)

    const result: CalculationResult = useMemo(() => {
        // 1. 발전량 계산: 면적(m2) * 효율(15%) * 일조시간(3.6h)
        // Daily Generation (kWh) = Area * Efficiency * Hours
        const dailyGeneration = area * EFFICIENCY * DAILY_SOLAR_HOURS;

        // 2. 수익 계산: 일발전량 * 30일 * (SMP + REC)
        const monthlyRevenue = dailyGeneration * 30 * SMP_REC_TOTAL;
        const yearlyRevenue = monthlyRevenue * 12;

        // 3. 탄소 절감량 (0.47kg per kWh assumption)
        const carbonReduction = yearlyRevenue / SMP_REC_TOTAL * 0.47;

        // 4. 원금 회수 기간
        const systemCapacity = area * KW_PER_M2;
        const totalInvestment = systemCapacity * INITIAL_INVESTMENT_PER_KW;
        const paybackPeriod = yearlyRevenue > 0 ? totalInvestment / yearlyRevenue : 0;

        // 5. 10개년 데이터
        const tenYearData = Array.from({ length: 10 }, (_, i) => ({
            year: `${i + 1}년`,
            revenue: Math.floor((yearlyRevenue * Math.pow(0.993, i)) / 10000), // 0.7% degradation, 万 unit
        }));

        return {
            dailyGeneration,
            monthlyRevenue,
            yearlyRevenue,
            carbonReduction,
            paybackPeriod,
            tenYearData,
        };
    }, [area]);

    return result;
}
