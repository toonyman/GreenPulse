import json
import os
import requests
from datetime import datetime, timedelta
import random

def fetch_market_data():
    today = datetime.now()
    dates = [(today - timedelta(days=i)).strftime('%Y-%m-%d') for i in range(7)]
    dates.reverse()

    history = [
        {
            "date": date,
            "smp": 140 + random.uniform(-10, 10),
            "rec": 70000 + random.randint(-5000, 5000),
            "carbon": 12000 + random.randint(-1000, 1000)
        } for date in dates
    ]

    data = {
        "current": {
            "smp": round(history[-1]["smp"], 1),
            "rec": history[-1]["rec"],
            "carbon": history[-1]["carbon"],
            "reserve_ratio": round(15.2 + random.uniform(-1.0, 1.0), 1),
            "updated_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        },
        "history": history,
        "shares": [
            {"name": "태양광", "value": 15},
            {"name": "풍력", "value": 8},
            {"name": "원자력", "value": 30},
            {"name": "화력", "value": 40},
            {"name": "기타", "value": 7}
        ]
    }
    
    with open('public/data/market-data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def fetch_news_data():
    client_id = os.environ.get("NAVER_CLIENT_ID")
    client_secret = os.environ.get("NAVER_CLIENT_SECRET")
    
    if client_id and client_secret:
        try:
            url = "https://openapi.naver.com/v1/search/news.json"
            headers = {
                "X-Naver-Client-Id": client_id,
                "X-Naver-Client-Secret": client_secret
            }
            params = {
                "query": "재생에너지 투자 RE100",
                "display": 10,
                "sort": "sim"
            }
            response = requests.get(url, headers=headers, params=params)
            if response.status_code == 200:
                news_items = response.json().get("items", [])
                # Filter or process news items if needed
                with open('public/data/news-data.json', 'w', encoding='utf-8') as f:
                    json.dump(news_items, f, ensure_ascii=False, indent=2)
                print("Successfully fetched real news from Naver API.")
                return
        except Exception as e:
            print(f"Error fetching news from API: {e}")

    # Fallback to realistic mock data if API fails or no credentials
    print("Using placeholder news data.")
    news = [
        {
            "title": "한화솔루션, 미국 최대 태양광 통합 생산 단지 '솔라 허브' 가동 임박",
            "link": "https://www.hankyung.com/article/2024011500001",
            "pubDate": datetime.now().strftime("%a, %d %b %Y %H:%M:%S +0900"),
            "description": "북미 시장 공략을 위한 한화솔루션의 대규모 투자가 결실을 맺고 있습니다. 현지 생산을 통한 보조금 혜택이 기대됩니다."
        },
        {
            "title": "정부, 2024년 신재생에너지 보급지원사업 공고... 1500억 규모",
            "link": "https://www.etnews.com/2024011600002",
            "pubDate": (datetime.now() - timedelta(hours=5)).strftime("%a, %d %b %Y %H:%M:%S +0900"),
            "description": "산업통상자원부는 주택, 건물용 태양광 및 지열 등 신재생에너지 설비 설치를 지원하는 보조금 사업을 시작한다고 밝혔습니다."
        },
        {
            "title": "국내 주요 대기업 RE100 가입 가속... 재생에너지 조달이 관건",
            "link": "https://www.sedaily.com/NewsView/2D43Z00003",
            "pubDate": (datetime.now() - timedelta(hours=15)).strftime("%a, %d %b %Y %H:%M:%S +0900"),
            "description": "글로벌 공급망의 탄소 중립 요구가 거세짐에 따라 국내 기업들의 재생에너지(RE100) 전환 시도가 이어지고 있습니다."
        }
    ]
    
    with open('public/data/news-data.json', 'w', encoding='utf-8') as f:
        json.dump(news, f, ensure_ascii=False, indent=2)

def fetch_policy_data():
    policies = [
        {"id": "gyeonggi", "region": "경기도", "title": "2026 베란다 태양광 보조금 지원", "amount": "최대 500,000", "status": "접수중", "description": "가정용 미니 태양광 설치비 지원"},
        {"id": "seoul", "region": "서울시", "title": "2026 주택형 태양광 보조금", "amount": "900,000", "status": "마감임박", "description": "옥상 및 마당 태양광 설치비 정액 지원"},
        {"id": "chungnam", "region": "충남", "title": "RE100 선도마을 지원사업", "amount": "1,500,000", "status": "상시접수", "description": "마을 단위 신재생에너지 융복합 지원"},
        {"id": "jeju", "region": "제주도", "title": "CFI2030 신재생에너지 주택 지원", "amount": "2,000,000", "status": "접수중", "description": "도내 탄소 없는 섬 조성을 위한 지원"},
        {"id": "gangwon", "region": "강원도", "title": "영농형 태양광 시범 사업", "amount": "1,300,000", "status": "접수예정", "description": "농지 위 태양광 설치 및 영농 병행"},
        {"id": "jeonnam", "region": "전남", "title": "신재생에너지 융복합 지원사업", "amount": "1,800,000", "status": "접수중", "description": "에너지 자립 마을 조성을 위한 설치비 지원"}
    ]
    
    with open('public/data/policy-data.json', 'w', encoding='utf-8') as f:
        json.dump({"policies": policies}, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    if not os.path.exists('public/data'):
        os.makedirs('public/data')
        
    fetch_market_data()
    fetch_news_data()
    fetch_policy_data()
    print("Data fetch completed.")
