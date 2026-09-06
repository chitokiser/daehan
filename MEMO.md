# 📝 대한김치 (DAEHAN KIMCHI) 프로젝트 메모

---

## 🎨 UI 테마 — 화이트 테마 (White Theme)

> **적용일**: 2026-09-05 | **파일**: `src/app/globals.css`

현재 적용된 테마는 **따뜻한 오프화이트 라이트 테마**입니다.

### CSS 변수 (`:root`)

| 변수 | 값 | 용도 |
|---|---|---|
| `--bg-color` | `#FAFAF8` | 전체 배경 (따뜻한 오프화이트) |
| `--bg-secondary` | `#F5F0EB` | 섹션 구분 배경 |
| `--surface-color` / `--bg-card` | `#FFFFFF` | 카드 · 패널 배경 |
| `--primary-color` | `#C8392B` | 단청 빨강 (포인트 컬러) |
| `--primary-hover` | `#A52D21` | 빨강 호버 |
| `--secondary-color` | `#D4870A` | 황금 고추 (보조 포인트) |
| `--text-main` | `#1A0D08` | 본문 텍스트 (거의 검정) |
| `--text-sub` | `#3D2010` | 서브 텍스트 |
| `--text-muted` | `#6B4C38` | 보조 텍스트 (WCAG AA 기준 충족) |
| `--border-color` / `--border-subtle` | `rgba(0,0,0,0.10)` | 테두리 |
| `--card-shadow` | `0 1px 8px rgba(0,0,0,0.07), 0 4px 20px rgba(0,0,0,0.05)` | 카드 그림자 |

### 적용 파일 목록

- `globals.css` — CSS 변수 정의
- `components/Header.module.css` — 헤더
- `app/page.module.css` — 메인 페이지
- `app/shop/page.module.css` — 쇼핑몰
- `app/about/page.module.css` — 소개 페이지
- `app/mypage/page.module.css` — 마이페이지
- `app/dna-test/page.module.css` — DNA 테스트
- `app/kmoa-guide/page.module.css` — K-MOA 가이드
- `app/shop/[id]/page.module.css` — 상품 상세

### 특이사항

- 코드 블록(`.codeBlock`)은 가독성을 위해 다크 배경(`#1E1E2E`) 유지
- 히어로 섹션은 `linear-gradient(160deg, #FFF8F0, #FFF5EE)` — 배경 오버레이 제거됨
- 이전 다크 테마 잔재(`rgba(255,255,255,0.x)` 배경, `#fff` 텍스트 하드코딩) 전부 제거됨

---

## 1. 회원 DB 및 결제 시스템 통합
- **K-MOA 일원화 완료**: 기존 ZENTARO 관련 잔재를 완전히 제거하고 K-MOA 회원 DB(Firebase Auth UID + Firestore 기반)로 100% 일원화했습니다.
- **주요 변경점**: KCA 포인트 -> K-MOA 포인트 / K-MOA 충전머니 사용. 모든 가맹점 공유 기능 확보.

## 2. 모바일 PWA 앱 설치 기능 (완료)
- 모바일(안드로이드/iOS) 브라우저 접속 시 '홈 화면에 추가(앱 설치)'가 가능하도록 설정 완료.
- **적용 사항**: `manifest.json`, 서비스 워커(`sw.js`), `layout.tsx` 내 PWA 초기화(`PWAInit.tsx`) 및 프리미엄 파비콘(`public/favicon.png`) 메타데이터 등록 완료.

## 3. 관리자 텔레그램 주문 알림 봇 연동 (세팅 대기 중)
고객이 쇼핑몰에서 K-MOA 머니나 일반 결제를 진행하면 즉시 관리자 텔레그램으로 푸시 알림이 발송되는 로직(`src/lib/notifier.ts`)을 추가했습니다.

**[⚠️ 관리자 필수 세팅 가이드]**
서버 환경 변수(`.env` 또는 Netlify 환경 변수)에 다음 두 가지 값을 반드시 등록해야 알림이 발송됩니다.
1. `TELEGRAM_BOT_TOKEN`: 텔레그램 내 `BotFather`를 통해 새 봇을 만들고 발급받은 HTTP API 토큰 값
2. `TELEGRAM_CHAT_ID`: 봇에게 말을 건 뒤, `IDBot` 등을 통해 알아낸 채팅방(또는 내 계정) 고유 ID 숫자

> **참고**: 위 두 가지 값이 없어도 서버 에러는 나지 않으며(안전 예외 처리 완료), 단지 알림이 전송되지 않을 뿐 쇼핑몰은 정상적으로 작동합니다.

## 4. 콘텐츠 작성 규칙
- **🚨 ⚠️ K-MOA 브랜드 AI 매거진(웹진) 등 프론트엔드 콘텐츠에 "K-MOA"를 절대 언급하지 말 것.**
- **🚨 ⚠️ 관리자 페이지 및 쇼핑몰 전체에서 "KCA", "HEX 토큰", "온체인" 등의 용어를 절대 언급하지 말 것.** (일반적인 '가맹점 결제 시스템', '충전머니' 등으로 대체)
