/**
 * Supabase 클라이언트 설정
 * 환경 변수(.env)에서 URL과 API Key를 읽어와 데이터베이스 연동 인스턴스를 생성합니다.
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// 환경 변수 로드
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 필수 환경 변수 확인
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('에러: SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY가 .env 파일에 설정되지 않았습니다.');
}

// Supabase 클라이언트 인스턴스 생성 및 내보내기
// 백엔드에서 보안 권한(Service Role)으로 작업하므로 데이터 저장 시 RLS를 우회할 수 있습니다.
const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;
