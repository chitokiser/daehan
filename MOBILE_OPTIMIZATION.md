# 모바일 최적화 Harness Coding 작업지시서

## 0. 작업 목적

현재 프로젝트의 기존 기능과 데이터 구조를 유지하면서 전체 웹앱을 **Mobile-First 방식으로 최적화**한다.

대상 AI Coding Agent:

* Claude Code
* Gemini CLI
* Antigravity
* 기타 AI Coding Agent

최우선 목표:

1. 모바일 UX 개선
2. 모바일 화면 깨짐 제거
3. 터치 인터페이스 개선
4. 페이지 로딩 속도 개선
5. 이미지/폰트/JavaScript 최적화
6. PC 화면 기능 유지
7. 기존 API/DB/인증/결제 기능 유지
8. 작업 후 자동 검증
9. 문제가 발견되면 AI가 스스로 수정 후 재검증
10. 검증 완료 후 Git Commit

---

# 1. 절대 규칙

AI Agent는 코딩을 시작하기 전에 반드시 프로젝트 전체 구조를 먼저 분석한다.

### 반드시 먼저 확인

* package.json
* README
* src/
* public/
* HTML
* CSS
* JavaScript
* React/Vue 등의 Component
* Firebase 설정
* API
* DB 관련 코드
* Authentication
* Payment
* 환경변수
* Netlify 설정
* 현재 Git 상태

### 금지사항

다음 항목은 모바일 최적화 작업 중 임의로 변경하지 않는다.

* Firebase 프로젝트 설정
* Firebase DB 구조
* Authentication 구조
* API Endpoint
* Payment Logic
* 회원 데이터 구조
* 주문 데이터 구조
* 관리자 기능
* 환경변수 이름
* 기존 핵심 비즈니스 로직
* 기존 URL 구조
* 기존 SEO 구조

기능 변경이 반드시 필요하다고 판단되는 경우 먼저 이유를 보고하고 승인을 기다린다.

---

# 2. 작업 시작 전 Git 안전장치

작업 시작 전에 현재 Git 상태를 확인한다.

```bash
git status
git branch
git log -5 --oneline
```

현재 변경사항이 있으면 기존 변경사항을 절대 삭제하지 않는다.

가능하면 모바일 최적화 작업용 브랜치를 생성한다.

```bash
git checkout -b mobile-optimization
```

브랜치 생성이 이미 되어 있다면 기존 브랜치를 사용한다.

---

# 3. 프로젝트 전체 분석

코딩 전에 다음 질문에 답을 내부적으로 정리한다.

### 구조 분석

* 어떤 프레임워크인가?
* 진입 페이지는 무엇인가?
* 공통 Header는 무엇인가?
* 공통 Footer는 무엇인가?
* 공통 Navigation은 무엇인가?
* 모바일 Navigation은 별도로 존재하는가?
* CSS 구조는 어떻게 되어 있는가?
* 전역 CSS가 존재하는가?
* 페이지별 CSS가 존재하는가?
* JavaScript 의존성은 무엇인가?
* 이미지가 어디에 존재하는가?
* 폰트는 어떻게 로딩되는가?

### 기능 분석

각 페이지별로 다음을 확인한다.

```text
PAGE
├── UI
├── API
├── Database
├── Authentication
├── User Interaction
├── Form
├── Button
├── Image
└── Responsive Layout
```

---

# 4. 모바일 기준 해상도

다음 화면을 반드시 기준으로 테스트한다.

```text
360 × 800
375 × 812
390 × 844
393 × 852
412 × 915
430 × 932
```

최소 기준:

```text
360px
390px
430px
```

모바일에서 다음 문제가 없어야 한다.

* 가로 스크롤
* 화면 밖으로 튀어나가는 요소
* 버튼 잘림
* 텍스트 잘림
* 이미지 overflow
* Fixed element 겹침
* Bottom Navigation 겹침
* Modal 화면 밖 표시
* Input 확대 문제
* 키보드에 의한 UI 깨짐

---

# 5. Mobile-First CSS 원칙

기존 Desktop-first CSS를 단순히 축소하지 않는다.

모바일을 기본값으로 만들고 Desktop을 확장한다.

예:

```css
.container {
    width: 100%;
    padding: 16px;
}

@media (min-width: 768px) {
    .container {
        max-width: 1200px;
        margin: 0 auto;
    }
}
```

### 기본 원칙

```text
Mobile
↓
Tablet
↓
Desktop
```

순서로 설계한다.

---

# 6. 화면 폭 규칙

고정 width 사용을 최소화한다.

잘못된 방식:

```css
width: 500px;
```

권장:

```css
width: 100%;
max-width: 500px;
```

또한 다음을 적극 활용한다.

```css
width: 100%;
max-width
min-width
clamp()
flex
grid
```

---

# 7. 가로 스크롤 방지

전체 페이지에서 의도하지 않은 horizontal overflow를 제거한다.

확인 항목:

```javascript
document.documentElement.scrollWidth
document.documentElement.clientWidth
```

다음 조건을 만족해야 한다.

```text
scrollWidth <= clientWidth
```

단, 실제로 가로 스크롤이 필요한 UI는 예외로 한다.

예:

* 상품 가로 Carousel
* 카드 Slider
* 이미지 Gallery

---

# 8. 모바일 Header

Header는 모바일 화면에서 최대한 단순하게 만든다.

권장 구조:

```text
┌──────────────────────────┐
│ ☰   LOGO        🛒 👤   │
└──────────────────────────┘
```

주의:

* Header 높이를 과도하게 만들지 않는다.
* Logo가 화면을 밀어내지 않도록 한다.
* 아이콘 터치 영역을 확보한다.
* 메뉴가 화면 밖으로 튀어나오지 않도록 한다.

---

# 9. 모바일 Navigation

모바일에서는 Bottom Navigation을 적극 검토한다.

예:

```text
┌────────────────────────────┐
│                            │
│         CONTENT            │
│                            │
│                            │
├────────────────────────────┤
│ 홈 │ 상품 │ 주문 │ MY │ 더보기 │
└────────────────────────────┘
```

터치 영역은 최소 약 44×44px 이상을 목표로 한다.

---

# 10. 버튼 UX

모바일 버튼은 손가락으로 쉽게 누를 수 있어야 한다.

권장:

```css
button {
    min-height: 44px;
    min-width: 44px;
}
```

텍스트 버튼은 상황에 따라 충분한 padding을 준다.

버튼 사이 간격이 너무 좁지 않도록 한다.

---

# 11. Input 최적화

모바일 Input은 다음을 확인한다.

```text
- font-size
- padding
- height
- border
- focus
- keyboard
- autocomplete
- input type
```

iOS Safari에서 입력창을 눌렀을 때 불필요하게 확대되지 않도록 일반적인 본문 입력 UI는 충분한 글자 크기를 사용한다.

---

# 12. 이미지 최적화

모든 큰 이미지를 조사한다.

확인:

```text
PNG
JPG
JPEG
WebP
AVIF
SVG
```

가능한 경우:

```text
PNG/JPG
↓
WebP 또는 AVIF
```

사용자가 처음 화면에서 보지 않는 이미지는 lazy loading을 적용한다.

예:

```html
<img
  src="..."
  loading="lazy"
  decoding="async"
  alt="..."
>
```

단, 첫 화면의 핵심 이미지에는 무조건 lazy loading을 적용하지 않는다.

---

# 13. 이미지 크기

원본 이미지가 모바일에서 불필요하게 큰 경우 최적화한다.

예:

```text
2000px 이미지
↓
모바일 400~800px 수준으로 제공
```

가능하면 responsive image를 사용한다.

```html
<img
  src="image.webp"
  srcset="
    image-400.webp 400w,
    image-800.webp 800w,
    image-1200.webp 1200w
  "
  sizes="100vw"
  alt=""
>
```

---

# 14. 폰트 최적화

불필요한 폰트는 제거한다.

확인:

* 폰트 종류
* 폰트 weight
* 외부 폰트 요청
* 중복 폰트
* 사용하지 않는 font weight

필요한 weight만 로딩한다.

---

# 15. JavaScript 최적화

모바일 초기 로딩을 방해하는 JavaScript를 조사한다.

확인:

```text
- 불필요한 라이브러리
- 중복 이벤트
- 무거운 초기화
- 반복적인 DOM 탐색
- 불필요한 API 요청
- 큰 JS bundle
```

가능하면:

```text
초기 실행
↓
필수 기능만
↓
나머지는 필요할 때 실행
```

구조로 변경한다.

---

# 16. API 요청 최적화

페이지 최초 진입 시 불필요한 API 호출을 줄인다.

예:

```text
페이지 진입
↓
필수 데이터 요청
↓
화면 표시
↓
부가 데이터 요청
```

사용자가 실제로 필요하지 않은 데이터를 초기 화면에서 모두 가져오지 않는다.

단, 기존 기능을 변경하거나 API 구조를 변경하지 않는다.

---

# 17. Firebase 최적화

Firebase를 사용하는 경우 다음을 조사한다.

```text
- 불필요한 listener
- 중복 listener
- 전체 collection 조회
- 필요 이상의 데이터 조회
- 실시간 업데이트 범위
```

특히 다음과 같은 코드를 주의한다.

```javascript
onSnapshot(전체데이터)
```

필요한 데이터 범위만 조회하도록 개선한다.

단,

**Firebase DB 구조 자체를 임의 변경하지 않는다.**

---

# 18. Loading UX

모바일 네트워크가 느린 상황을 고려한다.

다음 상황에 Loading UI를 제공한다.

```text
API 요청
상품 조회
주문 조회
로그인
결제
이미지 로딩
```

가능하면 Skeleton UI를 사용한다.

---

# 19. Error UX

모바일에서 에러가 발생했을 때 사용자가 원인을 알 수 있어야 한다.

나쁜 예:

```text
Error
```

좋은 예:

```text
상품을 불러오지 못했습니다.

잠시 후 다시 시도해주세요.

[ 다시 시도 ]
```

---

# 20. Modal / Popup

모바일 Modal은 화면을 초과하지 않아야 한다.

권장:

```css
.modal {
    width: min(92vw, 500px);
    max-height: 90vh;
    overflow-y: auto;
}
```

화면 밖으로 튀어나오는 Modal을 제거한다.

---

# 21. Fixed / Sticky 요소

다음 요소가 서로 겹치는지 반드시 확인한다.

```text
Header
Bottom Navigation
Floating Button
Cookie Banner
Chat Button
Modal
Toast
```

특히 모바일에서 Bottom Navigation과 Floating Button이 겹치지 않도록 한다.

---

# 22. 모바일 성능 목표

가능하면 Lighthouse Mobile 기준으로 확인한다.

중점적으로 확인:

```text
Performance
Accessibility
Best Practices
SEO
```

Core Web Vitals:

```text
LCP
CLS
INP
```

목표:

```text
LCP     빠르게
CLS     레이아웃 이동 최소화
INP     사용자 입력 반응 개선
```

특정 점수를 억지로 만들기 위해 기능을 제거하지 않는다.

---

# 23. Accessibility

모바일 접근성을 개선한다.

확인:

```text
- alt
- label
- button
- input
- aria
- contrast
- focus
```

아이콘만 있는 버튼에는 의미를 알 수 있는 label을 제공한다.

예:

```html
<button aria-label="장바구니">
```

---

# 24. SEO

모바일 최적화 과정에서 기존 SEO를 손상시키지 않는다.

확인:

```text
title
description
canonical
Open Graph
heading structure
alt
robots
sitemap
```

기존 URL을 임의 변경하지 않는다.

---

# 25. 페이지별 작업 방식

전체 프로젝트를 한 번에 수정하지 않는다.

다음 순서로 작업한다.

```text
1. 공통 Layout
2. Header
3. Navigation
4. Home
5. 목록 페이지
6. 상세 페이지
7. 장바구니
8. 주문
9. My Page
10. 기타 페이지
```

각 단계마다:

```text
분석
↓
수정
↓
검증
↓
수정
↓
재검증
↓
완료
```

한다.

---

# 26. Regression Test

모바일 수정 후 PC 화면도 반드시 확인한다.

최소:

```text
Mobile
360px
390px
430px

Tablet
768px

Desktop
1280px
1440px
```

기존 PC 기능이 깨졌다면 모바일 최적화 작업을 완료하지 않은 것으로 판단한다.

---

# 27. Console Error 검사

최종적으로 다음 오류를 확인한다.

```text
JavaScript Error
Network Error
404
CORS
Firebase Error
Unhandled Promise
React/Vue Error
```

새로운 오류가 발견되면 수정한다.

---

# 28. Build Test

프로젝트에 맞는 build 명령을 먼저 확인하고 실행한다.

예:

```bash
npm run build
```

또는 프로젝트에 정의된 실제 build command를 사용한다.

Build 실패 상태에서는 작업 완료로 처리하지 않는다.

---

# 29. Git 검증

작업 완료 전에:

```bash
git status
git diff
```

를 확인한다.

AI가 의도하지 않은 파일을 변경했는지 확인한다.

특히:

```text
.env
Firebase config
API
Database
package.json
```

등의 변경을 주의한다.

---

# 30. Git Commit

모든 테스트가 통과한 경우에만 Commit한다.

예:

```bash
git add .
git commit -m "optimize mobile responsive UI and performance"
```

Commit 전 변경 내용을 다시 확인한다.

---

# 31. AI Agent 자체 검증 루프

다음 Harness Loop를 반드시 따른다.

```text
┌─────────────────────┐
│ Analyze              │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Implement            │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Build                │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Test                 │
└──────────┬──────────┘
           ↓
       오류 있음?
        /      \
      YES       NO
       ↓         ↓
    Fix       Continue
       ↓         ↓
    Retest   Mobile Test
                 ↓
             PC Test
                 ↓
              Git
```

---

# 32. 작업 완료 조건

다음 조건을 모두 만족해야 한다.

```text
[ ] 360px 정상
[ ] 390px 정상
[ ] 430px 정상
[ ] 768px 정상
[ ] 1280px 정상
[ ] 가로 스크롤 없음
[ ] 버튼 터치 영역 개선
[ ] Input 정상
[ ] Modal 정상
[ ] Header 정상
[ ] Navigation 정상
[ ] 이미지 overflow 없음
[ ] Console Error 없음
[ ] Build 성공
[ ] 기존 API 정상
[ ] Firebase 정상
[ ] 로그인 정상
[ ] 주문 정상
[ ] 결제 정상
[ ] PC 기능 정상
[ ] Git diff 검토 완료
```

---

# 33. 최종 보고서

작업 완료 후 반드시 다음 형식으로 보고한다.

```text
[MOBILE OPTIMIZATION REPORT]

1. 작업 완료 페이지
- Home
- Product
- Cart
- Order
- My Page

2. 개선 내용
- Responsive Layout
- Touch UX
- Image Optimization
- Loading UX
- JavaScript Optimization

3. 수정 파일
- 파일명
- 변경 내용

4. 테스트
- 360px PASS
- 390px PASS
- 430px PASS
- 768px PASS
- 1280px PASS

5. Build
- PASS

6. Console Error
- PASS

7. 기존 기능
- Firebase PASS
- Login PASS
- Order PASS
- Payment PASS

8. Git
- Commit 완료

9. 남은 문제
- 없음
```

---

# 34. 가장 중요한 AI 행동 규칙

AI Agent는 다음 행동을 하지 않는다.

```text
❌ 전체 프로젝트를 한 번에 대규모 리팩토링
❌ 필요 없는 라이브러리 추가
❌ Firebase 구조 변경
❌ API 변경
❌ DB 구조 변경
❌ 결제 로직 변경
❌ 기존 기능 삭제
❌ PC UI를 모바일 때문에 삭제
❌ 단순히 모든 요소를 작게 만드는 방식의 모바일 최적화
❌ 테스트 없이 "완료" 선언
```

대신:

```text
분석
→ 최소 변경
→ 검증
→ 문제 발견
→ 수정
→ 재검증
→ 완료
```

의 원칙을 따른다.

---

# 35. 최종 지시

지금부터 모바일 최적화 작업을 시작한다.

단,

**코딩부터 시작하지 말고 먼저 프로젝트 전체 구조를 분석하라.**

분석이 끝나면:

1. 현재 모바일 문제 목록
2. 문제의 원인
3. 수정 대상 파일
4. 예상 작업 순서
5. 기능 변경 위험성

을 먼저 정리한다.

그 후 가장 영향 범위가 작은 작업부터 하나씩 수정한다.

각 작업 후 반드시 Build/Test를 수행한다.

문제가 발생하면 스스로 원인을 찾아 수정하고 다시 테스트한다.

모든 테스트를 통과한 경우에만 다음 작업으로 이동한다.

최종적으로 모바일과 PC 양쪽에서 기존 기능이 정상적으로 작동하는 것을 확인한 후 Git Commit을 수행한다.

**절대로 테스트되지 않은 코드를 완료된 것으로 보고하지 않는다.**
