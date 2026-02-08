# Vercel 환경 변수 설정 가이드

## 🚀 Vercel 배포 및 환경 변수 설정

### 1단계: Vercel 프로젝트 설정

#### 방법 1: Vercel Dashboard (웹)

1. **Vercel 대시보드 접속**
   - [https://vercel.com](https://vercel.com) 접속
   - GitHub 계정으로 로그인

2. **프로젝트 선택**
   - 좌측 메뉴에서 프로젝트 선택
   - 또는 새 프로젝트 import

3. **Settings 메뉴 이동**
   - 상단 탭에서 **Settings** 클릭
   - 좌측 메뉴에서 **Environment Variables** 클릭

### 2단계: 환경 변수 추가

다음 환경 변수들을 하나씩 추가하세요:

#### 필수 환경 변수

| 변수 이름 | 값 | 설명 |
|----------|-----|------|
| `NAVER_CLIENT_ID` | `1EZR8DNwfmZbr8yrEnY2` | 네이버 뉴스 API 클라이언트 ID |
| `NAVER_CLIENT_SECRET` | `hYiv3TLI4P` | 네이버 뉴스 API 시크릿 |
| `KMA_API_KEY` | `4b026f636e9dfa515ed23a2cfe56d42b09e1073d189deb2baddc732b2bf57f79` | 기상청 API 키 |
| `KEPCO_API_KEY` | `93LC778xL92UX61R86xQ1PJa33JXro42M3h6s86q` | 한국전력 API 키 |

#### 환경 변수 추가 방법

각 환경 변수마다:

1. **Name** 필드에 변수 이름 입력 (예: `KMA_API_KEY`)
2. **Value** 필드에 값 입력 (예: `4b026f636e9dfa515ed23a2cfe56d42b09e1073d189deb2baddc732b2bf57f79`)
3. **Environment** 선택:
   - ✅ **Production** (필수)
   - ✅ **Preview** (권장)
   - ✅ **Development** (선택)
4. **Add** 버튼 클릭

### 3단계: 재배포

환경 변수를 추가한 후 **반드시 재배포**해야 합니다:

#### 방법 1: Vercel Dashboard
1. **Deployments** 탭으로 이동
2. 최신 배포 옆의 **⋯** (점 3개) 클릭
3. **Redeploy** 선택
4. **Redeploy** 버튼 클릭

#### 방법 2: Git Push (자동 배포)
```bash
# 이미 푸시했으므로 자동으로 배포됩니다
# Vercel이 자동으로 감지하여 배포 시작
```

### 4단계: 배포 확인

1. **Deployments** 탭에서 배포 상태 확인
2. 배포 완료 후 **Visit** 버튼 클릭
3. `/green-check` 페이지 접속하여 기능 확인

---

## 📋 환경 변수 설정 체크리스트

- [ ] Vercel 프로젝트 Settings > Environment Variables 접속
- [ ] `NAVER_CLIENT_ID` 추가
- [ ] `NAVER_CLIENT_SECRET` 추가
- [ ] `KMA_API_KEY` 추가
- [ ] `KEPCO_API_KEY` 추가
- [ ] Production 환경 선택 확인
- [ ] 재배포 실행
- [ ] 배포 완료 확인
- [ ] 웹사이트에서 그린 체크 기능 테스트

---

## 🎯 빠른 설정 (CLI 방법)

Vercel CLI를 사용하면 더 빠르게 설정할 수 있습니다:

### 1. Vercel CLI 설치
```bash
npm i -g vercel
```

### 2. 로그인
```bash
vercel login
```

### 3. 환경 변수 추가
```bash
# Production 환경
vercel env add NAVER_CLIENT_ID production
# 값 입력: 1EZR8DNwfmZbr8yrEnY2

vercel env add NAVER_CLIENT_SECRET production
# 값 입력: hYiv3TLI4P

vercel env add KMA_API_KEY production
# 값 입력: 4b026f636e9dfa515ed23a2cfe56d42b09e1073d189deb2baddc732b2bf57f79

vercel env add KEPCO_API_KEY production
# 값 입력: 93LC778xL92UX61R86xQ1PJa33JXro42M3h6s86q
```

### 4. 재배포
```bash
vercel --prod
```

---

## 🔒 보안 주의사항

### ✅ 해야 할 것
- ✅ 환경 변수는 Vercel Dashboard에서만 관리
- ✅ `.env.local` 파일은 `.gitignore`에 포함 (이미 설정됨)
- ✅ API 키는 절대 코드에 하드코딩하지 않기

### ❌ 하지 말아야 할 것
- ❌ `.env.local` 파일을 Git에 커밋하지 않기
- ❌ API 키를 공개 저장소에 노출하지 않기
- ❌ 클라이언트 사이드 코드에서 API 키 사용하지 않기

---

## 🐛 문제 해결

### 환경 변수가 적용되지 않는 경우

1. **재배포 확인**
   - 환경 변수 추가 후 반드시 재배포 필요
   - Deployments 탭에서 최신 배포 확인

2. **환경 선택 확인**
   - Production 환경이 선택되었는지 확인
   - Preview/Development도 필요시 추가

3. **변수 이름 확인**
   - 대소문자 정확히 일치해야 함
   - 오타 확인

4. **빌드 로그 확인**
   - Deployments > 배포 클릭 > Building 로그 확인
   - 환경 변수 로딩 오류 확인

### API 호출이 실패하는 경우

현재 API 호출이 실패해도 **Fallback 알고리즘**이 작동하므로 그린 체크 기능은 정상 작동합니다.

**확인 사항**:
- 기상청 API: 승인 대기 중일 수 있음 (1-2일 소요)
- 한국전력 API: 엔드포인트 확인 필요
- 자세한 내용은 `docs/API_STATUS.md` 참조

---

## 📊 환경 변수 확인 방법

배포 후 환경 변수가 제대로 로드되는지 확인:

### 서버 사이드에서 확인
```typescript
// app/api/test-env/route.ts (테스트용)
export async function GET() {
  return Response.json({
    hasNaverClientId: !!process.env.NAVER_CLIENT_ID,
    hasNaverClientSecret: !!process.env.NAVER_CLIENT_SECRET,
    hasKmaApiKey: !!process.env.KMA_API_KEY,
    hasKepcoApiKey: !!process.env.KEPCO_API_KEY,
  });
}
```

접속: `https://your-domain.vercel.app/api/test-env`

---

## 🎉 완료!

환경 변수 설정이 완료되면:

1. ✅ 그린 체크 기능 정상 작동
2. ✅ 뉴스 피드 정상 작동
3. ✅ API 연동 준비 완료
4. ✅ 프로덕션 배포 완료

**다음 단계**: 
- 웹사이트 접속: `https://your-domain.vercel.app/green-check`
- 기능 테스트 및 확인
- 필요시 API 승인 대기 및 엔드포인트 업데이트

---

## 📞 도움이 필요하신가요?

- **Vercel 문서**: [https://vercel.com/docs/environment-variables](https://vercel.com/docs/environment-variables)
- **API 연동 가이드**: `docs/GREEN_CHECK_API_GUIDE.md`
- **API 상태**: `docs/API_STATUS.md`
