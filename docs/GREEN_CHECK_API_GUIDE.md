# 그린 체크 API 연동 가이드

## 필요한 API 키

그린 체크 기능을 위해 다음 API 키가 필요합니다:

### 1. 기상청 API (KMA_API_KEY)
**목적**: 지역별 일사량 데이터 수집

**발급 방법**:
1. [공공데이터포털](https://www.data.go.kr/) 접속
2. 회원가입 및 로그인
3. "기상청_지상(종관, ASOS) 시간자료 조회서비스" 검색
4. 활용신청 클릭
5. 마이페이지 > 데이터활용 > Open API > 인증키 발급현황에서 키 확인

**API 문서**: https://www.data.go.kr/data/15059093/openapi.do

### 2. 한국전력 API (KEPCO_API_KEY)
**목적**: 분산전원연계정보 및 신재생에너지 설비 현황

**발급 방법**:
1. [전력데이터 개방 포털](https://bigdata.kepco.co.kr/) 접속
2. 회원가입 및 로그인
3. Open API 메뉴에서 인증키 발급 신청
4. 승인 후 마이페이지에서 키 확인

**필요한 API**:
- 분산전원연계정보 API
- 신재생에너지 발전원별 설치개수 및 용량 API

### 3. 한국에너지기술연구원 API (KIER_API_KEY) - 선택사항
**목적**: 더 정확한 태양광 자원 지도 데이터

**발급 방법**:
1. [공공데이터포털](https://www.data.go.kr/) 접속
2. "한국에너지기술연구원_실시간 일사량 데이터" 검색
3. 활용신청

## 환경 변수 설정

`.env.local` 파일에 다음 내용을 추가하세요:

```bash
# 기상청 API
KMA_API_KEY=your_kma_api_key_here

# 한국전력 API
KEPCO_API_KEY=your_kepco_api_key_here

# 한국에너지기술연구원 API (선택)
KIER_API_KEY=your_kier_api_key_here
```

## 데이터 수집 실행

```bash
# Python 스크립트 실행
python3 scripts/fetch_green_check.py
```

## API 없이 사용하기

API 키가 없어도 샘플 데이터로 기능을 테스트할 수 있습니다. 
스크립트는 API 호출 실패 시 자동으로 추정 알고리즘을 사용합니다.

## 데이터 업데이트 주기

- **일사량 데이터**: 매일 1회 업데이트 권장
- **선로 용량 데이터**: 주 1회 업데이트 권장
- **설비 밀집도**: 월 1회 업데이트 권장

## GitHub Actions 자동화 (선택)

`.github/workflows/update-green-check.yml` 파일을 생성하여 자동 업데이트 설정:

```yaml
name: Update Green Check Data

on:
  schedule:
    - cron: '0 1 * * *'  # 매일 오전 1시 실행
  workflow_dispatch:  # 수동 실행 가능

jobs:
  update-data:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      
      - name: Install dependencies
        run: |
          pip install requests
      
      - name: Run data collection script
        env:
          KMA_API_KEY: ${{ secrets.KMA_API_KEY }}
          KEPCO_API_KEY: ${{ secrets.KEPCO_API_KEY }}
          KIER_API_KEY: ${{ secrets.KIER_API_KEY }}
        run: |
          python3 scripts/fetch_green_check.py
      
      - name: Commit and push if changed
        run: |
          git config --global user.name 'GitHub Actions'
          git config --global user.email 'actions@github.com'
          git add public/data/location-master.json
          git diff --quiet && git diff --staged --quiet || (git commit -m "Update green check data" && git push)
```

## 문제 해결

### API 호출 실패
- API 키가 올바른지 확인
- 일일 호출 한도를 초과하지 않았는지 확인
- 네트워크 연결 상태 확인

### 데이터 품질 문제
- 로그 파일 확인: `logs/green_check_YYYYMMDD.log`
- API 응답 상태 코드 확인
- 공공데이터포털 공지사항 확인 (API 점검 여부)

## 참고 자료

- [공공데이터포털](https://www.data.go.kr/)
- [전력데이터 개방 포털](https://bigdata.kepco.co.kr/)
- [기상청 API 허브](https://apihub.kma.go.kr/)
- [한국에너지기술연구원](https://www.kier.re.kr/)
