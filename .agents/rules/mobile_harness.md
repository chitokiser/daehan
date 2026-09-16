# Mobile Optimization & Layout Safety Harness (대한김치 웹 모바일 최적화 규격)

이 규칙은 대한김치 웹사이트의 UI/UX가 모든 모바일 기기(320px ~ 768px 뷰포트)에서 깨짐, 가로 스크롤, 어색한 단어 끊김, 폰트 과대화 현상 없이 완벽하게 작동하도록 보장하는 **필수 가이드라인 하네스(Harness)**입니다.

---

## 1. 텍스트 줄바꿈 및 어색한 단어 끊김 방지 (Text Wrapping)

- **원칙**: 한국어/베트남어/영문 혼용 텍스트가 모바일 뷰포트에서 단어 중간에 쪼개지거나 짤리지 않아야 합니다.
- **필수 속성**:
  ```css
  word-break: keep-all;
  word-wrap: break-word;
  overflow-wrap: break-word;
  ```
- **적용 대상**: 모든 제목(`h1`~`h4`), 본문(`p`), 카드의 설명글, 배지, 버튼, 테이블 셀(`th`, `td`).

---

## 2. 모바일 폰트 크기 표준 규격 (Typography Scaling)

모바일 화면에서 텍스트가 거대하게 비대해지는 것을 방지하기 위해 다음 상한선 범위를 준수합니다.

| 요소 | 데스크톱 수치 | 모바일(<=768px) 수치 |
|---|---|---|
| **Hero 대제목 (H1)** | 2.0rem ~ 2.2rem | **1.35rem ~ 1.5rem** (line-height: 1.35~1.4) |
| **섹션 제목 (H2)** | 1.6rem ~ 1.75rem | **1.2rem ~ 1.35rem** (line-height: 1.35) |
| **소제목 / 카드 제목 (H3, H4)**| 1.05rem ~ 1.25rem | **0.95rem ~ 1.05rem** |
| **본문 / 설명글 (P)** | 0.95rem ~ 1.0rem | **0.85rem ~ 0.88rem** (line-height: 1.6) |
| **배지 / 캐션 / 캡션 (Span)** | 0.78rem ~ 0.85rem | **0.72rem ~ 0.78rem** |

---

## 3. 고정 줄바꿈(`<br />`) 제어 (Desktop-Only Line Breaks)

- **원칙**: JSX 내의 `<br />` 태그는 모바일 뷰포트에서 글자가 1~2글자 단위로 어색하게 꺾이는 주범입니다.
- **규칙**: 헤딩이나 설명문 내부의 줄바꿈은 반드시 `desktopBr` 클래스를 부여합니다.
  ```tsx
  <h1 className={styles.title}>
      정성 어린 정통 손맛과 위생 관리<br className={styles.desktopBr} />
      하노이 중심의 발효과학
  </h1>
  ```
- **CSS 하네스**:
  ```css
  @media (max-width: 768px) {
      .desktopBr, .desktop-br {
          display: none !important;
      }
  }
  ```

---

## 4. 그리드 & 카드 가로 이탈 방지 (CSS Grid Safeguard)

- **원칙**: CSS Grid 또는 Flex 사용 시 자식 요소의 긴 텍스트로 인해 가로 스크롤(Horizontal Overflow)이 발생하는 현상을 방지해야 합니다.
- **규칙**:
  1. 모든 Grid 컨테이너 및 카드 요소에 `width: 100%; max-width: 100%; box-sizing: border-box; overflow: hidden;` 설정.
  2. Grid 아이템에는 반드시 `min-width: 0;` 속성을 부여하여 텍스트 넘침에 의한 Grid 컬럼 확장 방지.
  3. 모바일(`<=768px` 또는 `<=600px`)에서는 다중 그리드를 **1열(`grid-template-columns: 1fr;`)**로 변환.

---

## 5. 테이블 반응형 세로 스택 변환 (Table Mobile Stack)

- **원칙**: 2열 이상의 데이터 테이블(`overviewTable` 등)은 모바일(600px 이하)에서 셀이 압축되어 글자가 찌그러집니다.
- **규칙**: 600px 이하 뷰포트에서는 테이블 요소를 블록 스택 구조로 변환합니다:
  ```css
  @media (max-width: 600px) {
      .overviewTable, .overviewTable tbody, .overviewTable tr, .overviewTable th, .overviewTable td {
          display: block;
          width: 100%;
      }
      .overviewTable th {
          background: none;
          padding: 4px 0 2px 0;
          font-size: 0.78rem;
          color: #777;
      }
      .overviewTable td {
          padding: 2px 0 6px 0;
          font-size: 0.85rem;
          word-break: keep-all;
          overflow-wrap: break-word;
      }
  }
  ```

---

## 6. 절대 단위(`px`) 고정 너비 사용 금지

- `width: 500px;`와 같은 고정 너비 사용을 절대 금지합니다.
- 대신 `width: 100%; max-width: 500px; box-sizing: border-box;` 방식을 사용합니다.
