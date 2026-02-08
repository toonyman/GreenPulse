import { NextResponse } from 'next/server'

// 공공데이터포털 API 엔드포인트 (예시: 실시간 전력수급현황)
const PUBLIC_API_URL = 'http://apis.data.go.kr/B552115/pwr_stat_info_pwr_use_state/get_pwr_stat_info_pwr_use_state'
const API_KEY = process.env.DATA_GO_KR_API_KEY

export async function GET() {
    try {
        // 실제 API 키가 없을 경우를 대비한 가상 데이터 (개발 단계)
        if (!API_KEY) {
            return NextResponse.json(getMockData())
        }

        // 실제 API 호출 로직 (API 키가 있을 때 활성화)
        /*
        const response = await fetch(`${PUBLIC_API_URL}?serviceKey=${API_KEY}&_type=json`, {
            next: { revalidate: 3600 } // 1시간마다 캐시 갱신
        })
        const data = await response.json()
        return NextResponse.json(data)
        */

        return NextResponse.json(getMockData())
    } catch (error) {
        console.error('API Fetch Error:', error)
        return NextResponse.json({ error: 'Failed to fetch energy status' }, { status: 500 })
    }
}

function getMockData() {
    return {
        current: {
            supply: 82.4, // GW
            demand: 72.1, // GW
            reserve_power: 10.3, // GW
            reserve_ratio: 14.2, // %
            renewable_share: 18.5, // %
            updated_at: new Date().toISOString()
        },
        chart_data: Array.from({ length: 24 }, (_, i) => ({
            time: `${i}:00`,
            supply: 75 + Math.random() * 10,
            demand: 65 + Math.random() * 10,
            renewable: 10 + Math.random() * 5
        }))
    }
}
