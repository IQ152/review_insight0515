# AI 감성 분석 서비스 - 백엔드 API 구현 계획

UI 구현이 완료됨에 따라, 실제 감성 분석을 수행하고 결과를 저장할 **Node.js 백엔드 서버** 구현 계획을 수립합니다. 본 계획은 OpenAI API와 Supabase 데이터베이스 연동을 핵심으로 합니다.

## User Review Required

> [!IMPORTANT]
> **API 키 설정**: OpenAI API Key와 Supabase URL/Key가 필요합니다. 
> - 제가 직접 `.env` 파일을 생성할 때 실제 키를 넣지는 않고, `.env.example`을 만들어 어떤 값이 필요한지 안내해 드릴 예정입니다.
> - 나중에 해당 파일을 복사하여 실제 키를 입력해 주셔야 서비스가 정상 동작합니다.

> [!CAUTION]
> **보안 규칙**: 사용자 규칙 8번에 따라, 민감한 데이터(텍스트 원문 등)를 DB에 저장하기 전에 필요 시 마스킹 처리를 하거나, 환경 변수 보안을 최우선으로 관리하겠습니다.

## Proposed Changes

### 1. 프로젝트 초기 세팅

백엔드 실행 환경을 구축합니다.

#### [NEW] package.json
- 필요한 종속성 설치: `openai`, `@supabase/supabase-js`, `dotenv`, `express`, `cors`.
- 실행 스크립트 (`npm start`, `npm run dev`) 정의.

#### [NEW] .env.example
- 필요한 환경 변수 목록 가이드 (보안을 위해 실제 키는 포함하지 않음).

---

### 2. 서버 및 API 엔드포인트 구현 (`api/analyze.js` 또는 `server.js`)

프론트엔드에서 오는 요청을 처리할 메인 서버 로직을 작성합니다.

- **Express 서버 구축**: CORS 및 JSON 파싱 미들웨어 설정.
- **`POST /api/analyze` 엔드포인트**:
  - **입력값 검증**: 프론트엔드와 별개로 서버에서도 텍스트 유무와 길이(1,000자)를 엄격히 검증합니다.
  - **OpenAI 연동**: OpenAI SDK를 사용하여 사용자가 입력한 문장의 감성을 분석합니다. (System Prompt를 통해 JSON 형식 응답 유도)
  - **결과 정규화**: AI의 응답을 서비스 규격(`positive`, `negative`, `neutral` 및 한글 라벨)에 맞춰 변환합니다.

---

### 3. 데이터베이스 연동 (`lib/supabase.js`)

분석 결과를 Supabase PostgreSQL에 저장합니다.

- **Supabase 클라이언트 설정**: `lib/supabase.js` 파일에서 싱글톤 인스턴스 생성.
- **결과 저장 로직**:
  - 분석 성공 시 `sentiment_analyses` 테이블에 입력 텍스트, 감성 결과, 신뢰도, 분석 이유를 기록합니다.
  - 저장 실패가 전체 분석 응답을 막지 않도록 예외 처리를 철저히 합니다 (사용자에게는 결과 먼저 반환).

## Verification Plan

### Automated Tests
1. **서버 실행 테스트**: `npm start` 시 서버가 3000번 포트에서 정상적으로 대기하는지 확인합니다.
2. **API 기능 테스트**: `cURL` 또는 브라우저의 `fetch`를 통해 직접 `/api/analyze`에 요청을 보내고 OpenAI 분석 결과가 JSON으로 오는지 확인합니다.

### Manual Verification
1. 프론트엔드(UI)에서 실제 텍스트를 입력하고 '감성분석' 버튼을 눌렀을 때, Mock 데이터가 아닌 실제 AI의 분석 결과가 모달에 뜨는지 확인합니다.
2. 분석 결과가 Supabase 대시보드(Table Editor)에 데이터가 정상적으로 쌓이는지 확인합니다.
3. API 키가 누락되거나 잘못된 경우 적절한 에러 메시지가 모달에 표시되는지 확인합니다.
