/**
 * AI 감성 분석 서비스 - 프론트엔드 로직
 * 작성자: Antigravity AI
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- DOM 요소 선택 ---
  const textarea = document.querySelector("#sentimentText");
  const analyzeButton = document.querySelector("#analyzeButton");
  const currentCharCount = document.querySelector("#currentCharCount");
  const errorMessage = document.querySelector("#errorMessage");

  // 모달 관련 요소
  const modalBackdrop = document.querySelector("#resultModalBackdrop");
  const modalCloseButton = document.querySelector("#modalCloseButton");
  const modalConfirmButton = document.querySelector("#modalConfirmButton");
  const resultLabel = document.querySelector("#resultLabel");
  const resultConfidence = document.querySelector("#resultConfidence");
  const resultReason = document.querySelector("#resultReason");

  // 감성별 색상 매핑 (디자인 시스템 기준)
  const sentimentColors = {
    positive: "#00754A", // 긍정
    negative: "#c82014", // 부정
    neutral: "rgba(0,0,0,0.58)" // 중립
  };

  // --- 기능 구현 ---

  /**
   * 텍스트 입력 시 글자 수 업데이트
   */
  textarea.addEventListener("input", () => {
    const length = textarea.value.length;
    currentCharCount.textContent = length.toLocaleString();

    // 1,000자 초과 시 붉은색 표시 (시각적 피드백)
    if (length > 1000) {
      currentCharCount.style.color = "var(--color-error)";
    } else {
      currentCharCount.style.color = "var(--color-muted)";
    }

    // 에러 메시지 초기화
    if (length > 0) {
      errorMessage.textContent = "";
    }
  });

  /**
   * 감성 분석 API 호출 함수
   * @param {string} text 분석할 텍스트
   */
  async function analyzeSentiment(text) {
    // --- UI 동작 테스트를 위한 임시 Mock 로직 (백엔드 구현 전) ---
    const IS_MOCK = false; // 실제 API 호출을 하려면 false로 변경하세요.

    if (IS_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            sentiment: "positive",
            sentimentLabel: "긍정",
            confidence: 92,
            reason: "문장에 '최고예요', '좋아서'와 같은 긍정적인 표현이 포함되어 있습니다.\n전반적인 어조가 매우 호의적이며 만족감이 느껴집니다."
          });
        }, 1000); // 1초 로딩 효과
      });
    }
    // ---------------------------------------------------------

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "감성 분석 중 문제가 발생했습니다.");
      }

      return result.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  /**
   * 로딩 상태 설정
   * @param {boolean} isLoading 로딩 중 여부
   */
  function setLoading(isLoading) {
    if (isLoading) {
      analyzeButton.disabled = true;
      analyzeButton.textContent = "분석 중...";
      errorMessage.textContent = "";
    } else {
      analyzeButton.disabled = false;
      analyzeButton.textContent = "감성분석";
    }
  }

  /**
   * 결과 모달 표시
   * @param {object} data 분석 결과 데이터
   */
  function showResult(data) {
    // 1. 라벨 및 색상 설정
    resultLabel.textContent = data.sentimentLabel;
    resultLabel.style.color = sentimentColors[data.sentiment] || sentimentColors.neutral;

    // 2. 신뢰도 설정
    resultConfidence.textContent = `신뢰도 ${data.confidence}%`;

    // 3. 분석 이유 설정 (줄바꿈 처리)
    resultReason.innerHTML = data.reason.replace(/\n/g, "<br>");

    // 4. 모달 활성화
    modalBackdrop.classList.add("active");
  }

  /**
   * 모달 닫기
   */
  function closeModal() {
    modalBackdrop.classList.remove("active");
  }

  /**
   * 감성분석 버튼 클릭 이벤트
   */
  analyzeButton.addEventListener("click", async () => {
    const text = textarea.value.trim();

    // 1. 입력값 검증 (Validation)
    if (!text) {
      errorMessage.textContent = "분석할 텍스트를 입력해주세요.";
      textarea.focus();
      return;
    }

    if (text.length > 1000) {
      errorMessage.textContent = "텍스트는 최대 1,000자까지 입력할 수 있습니다.";
      return;
    }

    // 2. 로딩 시작
    setLoading(true);

    try {
      // 3. API 호출
      const data = await analyzeSentiment(text);

      // 4. 결과 표시
      showResult(data);
    } catch (error) {
      // 5. 에러 처리
      if (error.message === "Failed to fetch") {
        errorMessage.textContent = "서버와 연결할 수 없습니다. 백엔드 서버를 확인해주세요.";
      } else {
        errorMessage.textContent = error.message;
      }
    } finally {
      // 6. 로딩 종료
      setLoading(false);
    }
  });

  // --- 모달 닫기 이벤트 ---

  // 1. X 버튼 클릭
  modalCloseButton.addEventListener("click", closeModal);

  // 2. 확인 버튼 클릭
  modalConfirmButton.addEventListener("click", closeModal);

  // 3. 모달 외부 영역 클릭
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  // 4. ESC 키 입력
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalBackdrop.classList.contains("active")) {
      closeModal();
    }
  });
});
