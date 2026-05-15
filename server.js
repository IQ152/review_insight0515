/**
 * AI 감성 분석 서비스 - 메인 서버
 * Node.js, Express, OpenAI API, Supabase 연동
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const supabase = require('./lib/supabase');

// 환경 변수 설정
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors()); // 교차 출처 리소스 공유 허용
app.use(express.json()); // JSON 형식의 요청 본문 파싱
app.use(express.static('public')); // public 폴더의 정적 파일 제공

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 감성 분석 API 엔드포인트
 * POST /api/analyze
 */
app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;

  // 1. 입력값 검증 (Server-side Validation)
  if (!text || text.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: '분석할 텍스트를 입력해주세요.'
    });
  }

  if (text.length > 1000) {
    return res.status(400).json({
      success: false,
      message: '텍스트는 최대 1,000자까지 입력할 수 있습니다.'
    });
  }

  try {
    // 2. OpenAI API 호출 (감성 분석)
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `당신은 한국어 텍스트의 감성을 분석하는 AI입니다.
입력 문장을 positive, negative, neutral 중 하나로 분류하세요.
반드시 아래 JSON 형식으로만 응답하세요.
confidence는 0부터 100 사이의 정수입니다.
reason은 한국어 2~3문장으로 작성하세요.

응답 형식:
{
  "sentiment": "positive | negative | neutral",
  "confidence": 0-100,
  "reason": "분석 이유"
}`
        },
        {
          role: "user",
          content: `다음 텍스트의 감성을 분석하세요.\n\n텍스트: ${text}`
        }
      ],
      response_format: { type: "json_object" }
    });

    // AI 응답 파싱
    const aiResponse = JSON.parse(completion.choices[0].message.content);
    
    // 화면 표시용 한글 라벨 변환
    const sentimentLabelMap = {
      positive: "긍정",
      negative: "부정",
      neutral: "중립"
    };
    const sentimentLabel = sentimentLabelMap[aiResponse.sentiment] || "알 수 없음";

    const finalData = {
      ...aiResponse,
      sentimentLabel
    };

    // 3. Supabase 데이터베이스 저장 (비동기 처리)
    // 사용자에게 결과를 빠르게 보여주기 위해 저장은 백그라운드에서 진행하되 에러 로그만 남깁니다.
    supabase.from('sentiment_analyses').insert([
      {
        input_text: text,
        sentiment: aiResponse.sentiment,
        sentiment_label: sentimentLabel,
        confidence: aiResponse.confidence,
        reason: aiResponse.reason
      }
    ]).then(({ error }) => {
      if (error) console.error('Supabase 저장 에러:', error.message);
      else console.log('데이터 저장 성공');
    });

    // 4. 성공 응답 반환
    return res.status(200).json({
      success: true,
      data: finalData
    });

  } catch (error) {
    console.error('API 에러:', error);
    return res.status(500).json({
      success: false,
      message: '감성 분석 중 서버 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
    });
  }
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`서버가 실행되었습니다: http://localhost:${PORT}`);
});
