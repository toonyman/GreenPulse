
import { NextResponse } from 'next/server';

export async function GET() {
    const client_id = process.env.NAVER_CLIENT_ID;
    const client_secret = process.env.NAVER_CLIENT_SECRET;

    if (!client_id || !client_secret) {
        // If keys are missing, return fallback data or error
        // For now, let's return a specific error so the frontend can show a "set up keys" message
        return NextResponse.json(
            { error: 'Naver API keys are missing' },
            { status: 500 }
        );
    }

    const query = encodeURIComponent('RE100 재생에너지 태양광 정책'); // Search keywords
    const url = `https://openapi.naver.com/v1/search/news.json?query=${query}&display=10&start=1&sort=date`;

    try {
        const response = await fetch(url, {
            headers: {
                'X-Naver-Client-Id': client_id,
                'X-Naver-Client-Secret': client_secret,
            },
        });

        if (!response.ok) {
            throw new Error(`Naver API error: ${response.statusText}`);
        }

        const data = await response.json();

        // Transform data to match our frontend structure
        const newsItems = data.items.map((item: any) => ({
            title: item.title,
            link: item.link, // or item.originallink if preferred
            description: item.description,
            pubDate: item.pubDate
        }));

        return NextResponse.json(newsItems);

    } catch (error) {
        console.error('Failed to fetch news:', error);
        return NextResponse.json(
            { error: 'Failed to fetch news' },
            { status: 500 }
        );
    }
}
