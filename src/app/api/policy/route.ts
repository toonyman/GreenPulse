
import { NextResponse } from 'next/server';

export async function GET() {
    const serviceKey = process.env.MSS_API_KEY;

    // 기업마당 오픈API: https://www.bizinfo.go.kr/uss/rss/bizinfoApi.do
    // 필수 파라미터: crtfcKey (인증키), dataType (json, xml), searchCnt (한 번에 가져올 개수)
    // 선택 파라미터: searchTy (S:제목, I:내용, A:제목+내용), keyword (검색어)

    // '에너지' 관련 사업 검색
    // 참고: 기업마당 API는 'searchCnt'가 page size입니다.
    //       기본적으로 최신 공고순으로 줍니다.
    const apiUrl = `https://www.bizinfo.go.kr/uss/rss/bizinfoApi.do?crtfcKey=${serviceKey}&dataType=json&searchCnt=10&searchTy=A&keyword=${encodeURIComponent('에너지')}`;

    try {
        console.log(`Fetching Policy API: ${apiUrl}`);
        const res = await fetch(apiUrl);

        if (!res.ok) {
            throw new Error(`Failed to fetch API: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        const items = data.jsonArray; // 기업마당은 'jsonArray'라는 필드에 리스트를 줌

        if (!items || items.length === 0) {
            console.warn("No policy items found from API. Falling back to dummy data.");
            // Return fallback dummy data directly if API returns nothing
            return NextResponse.json({
                policies: [
                    {
                        id: "fallback-1",
                        region: "전국",
                        title: "2025년 신재생에너지 보급지원사업 (추가공고)",
                        amount: "예산 소진 시까지",
                        status: "접수중",
                        description: "주택 및 건물지원사업 추가 모집 공고입니다.",
                        link: "https://www.knrec.or.kr"
                    },
                    {
                        id: "fallback-2",
                        region: "서울",
                        title: "서울시 베란다형 태양광 미니발전소 보급",
                        amount: "최대 40만원",
                        status: "접수중",
                        description: "서울시 소재 아파트 및 주택 베란다 태양광 설치 지원",
                        link: "https://solarmap.seoul.go.kr"
                    }
                ]
            });
        }

        // 데이터 매핑 (API 필드명 -> 우리 앱 필드명)
        // pblancId: 공고 ID
        // pblancNm: 공고명 (Title)
        // reqstAreaNm: 신청가능지역 (Region) - "서울,경기,..." 형태일 수 있음
        // suptAmt: 지원금액 정보가 없음 (대부분 텍스트 설명에 포함됨) -> "상세확인"
        // reqstBeginEndDe: 접수기간 (20240101~20241231) -> Status 판단용
        // pblancUrl: 상세 페이지 URL (Link) -> 이게 제일 중요!
        // bsnsSumryCn: 사업개요 (Description) - HTML 태그 포함

        const policies = items.map((item: any) => ({
            id: item.pblancId,
            region: formatRegion(item.reqstAreaNm),
            title: item.pblancNm,
            amount: "지원상세", // 금액 필드가 따로 없어서 '지원상세'로 통일
            status: getStatusFromPeriod(item.reqstBeginEndDe),
            description: stripHtml(item.bsnsSumryCn || item.pblancAle).substring(0, 80) + "...",
            link: item.pblancUrl // 바로가기 링크!
        }));

        return NextResponse.json({ policies });

    } catch (error) {
        console.error("Policy API Error:", error);
        // 에러 발생 시, 로컬 JSON 데이터(백업용)를 읽어서 반환하거나 에러 응답
        // 여기서는 일단 에러 메시지 반환
        return NextResponse.json(
            { error: "Failed to fetch policy data", details: String(error) },
            { status: 500 }
        );
    }
}

// ------------------------------------------------------------------
// Helper Functions
// ------------------------------------------------------------------

function formatRegion(regionText: string) {
    if (!regionText) return '전국';
    // "서울, 경기, 인천" 처럼 길게 올 경우 앞부분만 잘라서 보여줌
    const regions = regionText.split(',');
    if (regions.length > 2) return `${regions[0]} 외 ${regions.length - 1}`;
    return regionText;
}

function getStatusFromPeriod(period: string) {
    // 예: "20240201~20240228"
    if (!period || !period.includes('~')) return '접수중';

    const [, endStr] = period.split('~');
    const endDate = parseDate(endStr);
    const today = new Date();

    // 마감일이 지났으면 '마감'
    if (endDate < today) return '마감';

    // 마감일이 7일 이내면 '마감임박'
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) return '마감임박';

    return '접수중';
}

function parseDate(dateStr: string) {
    // YYYYMMDD -> Date 객체
    // 공백 제거
    const s = dateStr.trim();
    const y = parseInt(s.substring(0, 4));
    const m = parseInt(s.substring(4, 6)) - 1; // 월은 0부터 시작
    const d = parseInt(s.substring(6, 8));
    return new Date(y, m, d);
}

function stripHtml(html: string) {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '');
}
