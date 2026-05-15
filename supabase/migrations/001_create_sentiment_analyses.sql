-- 001_create_sentiment_analyses.sql
-- 사용자의 감성 분석 요청과 결과를 저장하기 위한 테이블 생성 쿼리입니다.

CREATE TABLE IF NOT EXISTS sentiment_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- 기본키 (UUID 자동 생성)
  input_text TEXT NOT NULL,                      -- 사용자가 입력한 분석 대상 원문
  sentiment TEXT NOT NULL CHECK (sentiment IN ('positive', 'negative', 'neutral')), -- 감성 분류 코드
  sentiment_label TEXT NOT NULL CHECK (sentiment_label IN ('긍정', '부정', '중립')), -- 화면 표시용 한글 라벨
  confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),         -- 분석 신뢰도 (0~100)
  reason TEXT NOT NULL,                          -- 분석 이유 (AI가 생성한 설명)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()  -- 생성 일시
);

-- 성능 최적화를 위한 인덱스 생성
-- 생성일 기준 내림차순 정렬 조회를 위한 인덱스
CREATE INDEX IF NOT EXISTS sentiment_analyses_created_at_idx ON sentiment_analyses (created_at DESC);

-- 특정 감성별 필터링을 위한 인덱스
CREATE INDEX IF NOT EXISTS sentiment_analyses_sentiment_idx ON sentiment_analyses (sentiment);

-- 설명: 이 쿼리는 Supabase SQL Editor에 복사하여 실행하시면 됩니다.
