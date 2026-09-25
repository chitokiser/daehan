<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

현재 개발된 웹앱의 모바일 화면(반응형)에서 다음과 같은 심각한 UI 결함들이 발생하고 있습니다. 이를 전면 수정해주세요.

1. 모바일 텍스트 줄바꿈 및 레이아웃 오류 수정
- 모바일 화면(작은 뷰포트)에서 문맥에 맞지 않게 단어가 끊기거나 어색하게 줄바꿈되는 현상을 해결해주세요.
- CSS 속성(word-break, word-wrap, overflow-wrap 등)을 검토하여 자연스러운 텍스트 흐름을 적용해주세요.

2. 버튼 텍스트 세로 깨짐 현상 수정
- 버튼 내부의 텍스트가 좁은 너비 때문에 세로로 글자가 떨어져 나오는 현상을 수정해주세요.
- 버튼의 최소 너비(min-width), 패딩, 그리고 white-space: nowrap 또는 flex 레이아웃 정렬을 점검하여 한 줄로 깔끔하게 표시되도록 변경해주세요.

3. 누락된 랭킹 카드 복구 및 반응형 그리드 적용
- 데스크톱에서는 정상적으로 보이던 랭킹 카드가 모바일 화면에서 display: none 처리되거나 화면 밖으로 넘쳐서 누락되는 문제가 있습니다.
- 모바일 화면에서도 랭킹 카드가 누락되지 않고 세로 스크롤 또는 적절한 그리드/플렉스 구조(예: 1열 배치)로 정상 노출되도록 레이아웃 코드를 수정해주세요.

요청사항:
- 전체 CSS/Tailwind 클래스 및 컴포넌트 구조를 모바일 퍼스트(Mobile-First) 관점에서 재검토하고, 수정된 전체 코드를 제공해주세요.