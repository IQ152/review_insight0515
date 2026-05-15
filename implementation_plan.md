# AI 감성 분석 서비스 - UI 구현 계획

본 계획은 `day3/docs` 폴더 내의 문서들(`01_DESIGN_SYSTEM.md`, `02_UI_IMPLEMENTATION.md`, `03_FRONTEND_FEATURES.md`, `09_AGENT_TASK_ORDER.md` 등)을 분석하고 사용자의 피드백을 반영하여 수립된 프론트엔드 UI 구현 계획입니다.

## User Review Required

> [!IMPORTANT]
> **디자인 변경 사항**: 기존 스타벅스 스타일에서 **에어비앤비(Airbnb) 스타일**로 변경되었습니다.
> - 배경: 순백색 (#ffffff)
> - 포인트 컬러: Rausch (#ff385c)
> - 모서리: 버튼 8px, 카드 14px

> [!NOTE]
> 사용자 규칙에 따라 모든 주석과 설명은 한국어로 상세히 작성되며, 코드 제공 시 생략 없이 전체 코드를 제공하여 복사&붙여넣기가 쉽도록 작업할 예정입니다.

## Proposed Changes

### 프로젝트 기본 구조 설정

UI 구현을 위한 프론트엔드 디렉토리와 빈 파일들을 먼저 생성합니다.

#### [NEW] public/index.html
- 전체 웹 페이지의 HTML 뼈대. 타이틀은 "AI 감성 분석 서비스"로 설정합니다.

#### [NEW] public/css/style.css
- 수정된 디자인 시스템(에어비앤비 스타일)에 명시된 토큰과 스타일을 적용합니다.

#### [NEW] public/js/app.js
- 사용자 인터랙션 및 백엔드 API와의 통신 로직.

---

### Step 1. 디자인 시스템 및 CSS 구현 (`style.css`)

문서 `01_DESIGN_SYSTEM.md`(수정본)를 기준으로 에어비앤비 풍의 깔끔한 디자인을 구현합니다.

- **색상 토큰 (`:root`)**: 순백색 배경(`--color-canvas: #ffffff`), 잉크색 텍스트(`--color-ink: #222222`), Rausch 포인트 컬러(`#ff385c`) 정의.
- **타이포그래피 및 간격**: "Airbnb Cereal VF" 등 폰트 스택 및 정의된 간격 변수 설정.
- **컴포넌트 스타일**: 
  - 버튼: 8px 모서리, Rausch 배경, 48px 높이.
  - 카드: 14px 모서리, 기본 평면 상태에서 호버 시에만 단일 그림자(`--shadow-float`) 적용.
  - 모달: 화면 중앙 정렬, 반투명 배경 및 14px 라운드 카드 스타일 적용.

---

### Step 2. HTML 화면 구조 작성 (`index.html`)

문서 `02_UI_IMPLEMENTATION.md`에 따라 반응형 웹 페이지 구조를 마크업합니다.

- **Header**: 로고("AI 감성 분석 서비스") 및 메뉴 네비게이션.
- **Hero Section**: 순백색 배경에 강조된 메인 타이틀 및 설명.
- **Input Card**: 에어비앤비 카드 스타일을 적용한 텍스트 입력 영역.
- **Analyze Button**: Rausch 컬러가 적용된 "감성분석" 버튼.
- **Info Cards**: 긍정, 부정, 중립 설명을 담은 3개의 카드 (14px 라운드 적용).
- **Result Modal**: 분석 결과 표시 및 확인/닫기 버튼.

---

### Step 3. JavaScript 기능 구현 (`app.js`)

문서 `03_FRONTEND_FEATURES.md`의 명세를 따릅니다.

- **입력값 검증**: 빈 값 체크 및 1,000자 제한 에러 메시지.
- **로딩 상태**: "분석 중..." 텍스트 및 버튼 비활성화.
- **API 호출 및 모달 제어**: 결과 데이터를 모달에 바인딩하고 표시.

## Verification Plan

### Manual Verification
1. `public/index.html`을 열어 순백색 배경과 Rausch 컬러 버튼이 잘 적용되었는지 확인합니다.
2. 카드에 마우스를 올렸을 때 그림자가 생기며 떠오르는 효과를 확인합니다.
3. 타이틀이 "AI 감성 분석 서비스"로 정확히 표시되는지 확인합니다.
4. 모바일 레이아웃(카드 세로 정렬 등)을 확인합니다.
