/**
 * AI 감성 분석 서비스 - API 서버리스 함수
 * 위치: api/index.js
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const supabase = require('../lib/supabase');

// 환경 변수 설정
dotenv.config();

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

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

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ success: false, message: '분석할 텍스트를 입력해주세요.' });
  }

  try {
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

    const aiResponse = JSON.parse(completion.choices[0].message.content);
    
    const sentimentLabelMap = {
      positive: "긍정",
      negative: "부정",
      neutral: "중립"
    };
    const sentimentLabel = sentimentLabelMap[aiResponse.sentiment] || "알 수 없음";

    const finalData = { ...aiResponse, sentimentLabel };

    // Supabase 저장 (비동기)
    supabase.from('sentiment_analyses').insert([
      {
        input_text: text,
        sentiment: aiResponse.sentiment,
        sentiment_label: sentimentLabel,
        confidence: aiResponse.confidence,
        reason: aiResponse.reason
      }
    ]).then(({ error }) => {
      if (error) console.error('DB 저장 에러:', error.message);
    });

    return res.status(200).json({ success: true, data: finalData });

  } catch (error) {
    console.error('API 에러:', error);
    return res.status(500).json({ success: false, message: '서버 에러가 발생했습니다.' });
  }
});

// Vercel 서버리스 환경을 위한 익스포트
module.exports = app;
