// src/pages/qna/QnaDetail.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header/Header";
import { useAuth } from "../../contexts/AuthContext";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "https://cross-note.com";

// yyyy.MM.dd HH:mm 포맷
const formatDateTime = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
};

export default function QnaDetail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { qnaId } = useParams();
  const { accessToken, refreshAccessToken } = useAuth();

  const [question, setQuestion] = useState(() => state?.question || null);
  const [loading, setLoading] = useState(!state?.question);
  const [error, setError] = useState(null);
  const [answerContent, setAnswerContent] = useState("");
  const [saving, setSaving] = useState(false);

  const answerInputRef = useRef(null);

  const authHeader = useMemo(
    () => ({
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    }),
    [accessToken]
  );

  const fetchDetail = async (tokenToUse = accessToken) => {
    if (!tokenToUse) {
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    const url = `${API_BASE}/question/${qnaId}`;

    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${tokenToUse}` },
      });
      setQuestion(res.data);
    } catch (err) {
      if (err.response?.status === 401 && typeof refreshAccessToken === "function") {
        const newToken = await refreshAccessToken();
        if (newToken) {
          return fetchDetail(newToken);
        }
      }
      console.error("질문 상세 조회 실패:", err);
      setError("질문 상세를 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!state?.question) {
      fetchDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qnaId, accessToken]);

  const handleLikeQuestion = async () => {
    if (!accessToken || !question) return;
    const url = `${API_BASE}/question/${qnaId}/like`;
    try {
      const res = await axios.patch(
        url,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setQuestion((prev) =>
        prev
          ? {
              ...prev,
              likeCount: res.data?.likeCount ?? (prev.likeCount ?? 0) + 1,
            }
          : prev
      );
    } catch (err) {
      if (err.response?.status === 401 && typeof refreshAccessToken === "function") {
        const newToken = await refreshAccessToken();
        if (newToken) return handleLikeQuestion();
      }
      console.error("질문 좋아요 실패:", err);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!accessToken || !question) return;
    const ok = window.confirm("이 질문을 삭제하시겠습니까?");
    if (!ok) return;

    const url = `${API_BASE}/question/${qnaId}`;
    try {
      await axios.delete(url, { headers: { Authorization: `Bearer ${accessToken}` } });
      navigate("/qna");
    } catch (err) {
      if (err.response?.status === 401 && typeof refreshAccessToken === "function") {
        const newToken = await refreshAccessToken();
        if (newToken) return handleDeleteQuestion();
      }
      console.error("질문 삭제 실패:", err);
      setError("질문을 삭제하지 못했습니다.");
    }
  };

  const handleCreateAnswer = async () => {
    if (!accessToken || !question || !answerContent.trim()) return;
    setSaving(true);
    const url = `${API_BASE}/answer`;
    const payload = { questionId: Number(qnaId), content: answerContent.trim() };
    try {
      await axios.post(url, payload, { headers: authHeader });
      setAnswerContent("");
      await fetchDetail();
    } catch (err) {
      if (err.response?.status === 401 && typeof refreshAccessToken === "function") {
        const newToken = await refreshAccessToken();
        if (newToken) return handleCreateAnswer();
      }
      console.error("답변 생성 실패:", err);
      setError("답변을 추가하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const scrollToAnswerInput = () => {
    answerInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  if (loading) {
    return (
      <div className="app-wrapper">
        <Header title="QnA" onBack={() => navigate(-1)} />
        <div style={{ padding: 16 }}>질문을 불러오는 중입니다...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-wrapper">
        <Header title="QnA" onBack={() => navigate(-1)} />
        <div style={{ padding: 16 }}>오류: {error}</div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="app-wrapper">
        <Header title="QnA" onBack={() => navigate(-1)} />
        <div style={{ padding: 16 }}>질문 데이터를 찾을 수 없습니다.</div>
      </div>
    );
  }

  // 카테고리/닉네임/작성일 추론
  const categories =
    question.categoryNames || question.categories || question.categoryList || [];
  const nickname =
    question.nickname ||
    question.writerNickname ||
    question.authorNickname ||
    "익명";
  const createdAtText = question.createdAt || question.createdDate || question.createdTime;

  const answerCount = question.answerCount ?? question.answers?.length ?? 0;

  return (
    <div className="app-wrapper">
      <Header title="QnA" onBack={() => navigate(-1)} />
      <div
        style={{
          background: "#f5f6fa",
          minHeight: "100vh",
          padding: "16px 16px 32px",
        }}
      >
        {/* 질문 카드 */}
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            background: "#ffffff",
            borderRadius: 24,
            padding: 20,
            boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
          }}
        >
          {/* 카테고리 태그 */}
          {Array.isArray(categories) && categories.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
              {categories.map((cat, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    border: "1px solid #d7e2ff",
                    fontSize: 11,
                    color: "#4a6fff",
                    background: "#f6f8ff",
                  }}
                >
                  {cat}
                </span>
              ))}
            </div>
          )}

          {/* 제목 */}
          <h1
            style={{
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 8,
              lineHeight: 1.5,
              color: "#111",
            }}
          >
            {question.title}
          </h1>

          {/* 작성자 / 작성일 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              color: "#9aa0b2",
              marginBottom: 16,
            }}
          >
            <span>{nickname}</span>
            <span
              style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: "#c4c8d4",
                display: "inline-block",
              }}
            />
            <span>{formatDateTime(createdAtText)}</span>
            <span>작성됨</span>
          </div>

          {/* 본문 */}
          <div
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: "#333",
              whiteSpace: "pre-line",
              marginBottom: 16,
            }}
          >
            {question.content}
          </div>

          {/* 하단 좋아요 / 수정 / 삭제 영역 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <button
              type="button"
              onClick={handleLikeQuestion}
              style={{
                border: "none",
                background: "transparent",
                padding: 0,
                fontSize: 13,
                color: "#7a7f8c",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              ♡ <span>{question.likeCount ?? 0}</span>
            </button>

            <div
              style={{
                display: "flex",
                gap: 12,
                fontSize: 13,
                color: "#7a7f8c",
              }}
            >
              {/* 수정 버튼은 나중에 연동할 때 onClick 추가 */}
              <button
                type="button"
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                수정
              </button>
              <button
                type="button"
                onClick={handleDeleteQuestion}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>

        {/* 답변(댓글) 카드 */}
        <div
          style={{
            maxWidth: 720,
            margin: "16px auto 0",
            background: "#ffffff",
            borderRadius: 24,
            padding: 20,
            boxShadow: "0 8px 20px rgba(0,0,0,0.03)",
          }}
        >
          {/* 헤더: 댓글 N개 + 우측 댓글 버튼 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              댓글 {answerCount}개
            </div>

            <button
              type="button"
              onClick={scrollToAnswerInput}
              style={{
                border: "none",
                background: "transparent",
                padding: 0,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 13,
                color: "#1aa3a3",
              }}
            >
              <span>💬</span>
              <span>댓글</span>
            </button>
          </div>

          {/* 아직 답변 없을 때 안내 텍스트 */}
          {answerCount === 0 && (
            <div
              style={{
                fontSize: 12,
                color: "#c2c6d2",
                textAlign: "center",
                padding: "12px 0 16px",
              }}
            >
              아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
            </div>
          )}

          {/* 답변 입력 영역 */}
          <div
            ref={answerInputRef}
            style={{
              marginTop: 8,
            }}
          >
            <textarea
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              rows={4}
              placeholder="댓글을 입력해 주세요"
              style={{
                width: "100%",
                borderRadius: 12,
                border: "1px solid #dde2f0",
                padding: "10px 12px",
                fontSize: 13,
                resize: "none",
                outline: "none",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 8,
              }}
            >
              <button
                type="button"
                onClick={handleCreateAnswer}
                disabled={saving || !answerContent.trim()}
                style={{
                  border: "none",
                  borderRadius: 999,
                  padding: "8px 18px",
                  fontSize: 13,
                  background: saving || !answerContent.trim() ? "#cfd5e6" : "#4a6fff",
                  color: "#fff",
                  cursor:
                    saving || !answerContent.trim() ? "default" : "pointer",
                }}
              >
                {saving ? "등록 중..." : "등록"}
              </button>
            </div>
          </div>

          {/* 나중에 실제 답변 목록 렌더링할 때 여기서 map 돌리면 됨 */}
        </div>
      </div>
    </div>
  );
}
