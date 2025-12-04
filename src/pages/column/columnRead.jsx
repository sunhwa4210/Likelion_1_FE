// src/pages/column/columnRead.jsx
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../index.css";
import GlobalHeader from "../../components/Header/GlobalHeader";
import Header from "../../components/Header/Header";
import { useAuth } from "../../contexts/AuthContext";

// 카테고리 ID -> 이름 매핑
const CATEGORY_ID_TO_NAME = {
  11: "심리",
  25: "예술·문화",
  // 필요하면 추가
};

// yyyy.MM.dd HH:mm 포맷
const formatDateTime = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
};

// "1분 전 / N분 전 / N시간 전 / 1일 전 / N일 전"
const formatTimeAgo = (isoString) => {
  if (!isoString) return "";
  const now = new Date();
  const then = new Date(isoString);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin <= 0) return "1분 전";
  if (diffMin < 60) return `${diffMin}분 전`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "1일 전";
  return `${diffDays}일 전`;
};

export default function ColumnRead() {
  const location = useLocation();
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  // 목록에서 전달받은 columnId
  const columnId = location.state?.columnId || location.state?.column?.columnId;

  const [column, setColumn] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 댓글 작성
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 댓글 수정 상태
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const commentInputRef = useRef(null);

  // 상세 조회
  useEffect(() => {
    const fetchColumn = async () => {
      if (!columnId) {
        setError("칼럼 정보가 없습니다.");
        setLoading(false);
        return;
      }
      if (!accessToken) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const res = await axios.get(
          `https://cross-note.com/column/${columnId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log("[칼럼 상세조회 응답]", res.data);

        const { columnDetailResponseDto, columnCommentGetDtos } = res.data;

        setColumn(columnDetailResponseDto);
        setComments(columnCommentGetDtos || []);
      } catch (err) {
        console.error("[칼럼 상세 조회 실패]", err);
        setError("칼럼 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchColumn();
  }, [columnId, accessToken]);

  // 좋아요 토글
  const handleToggleLike = async () => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!column) return;

    try {
      await axios.patch(
        `https://cross-note.com/column/${columnId}/like`,
        null,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setColumn((prev) => {
        if (!prev) return prev;
        const wasLiked = prev.isLiked ?? false;
        const count = prev.likeCount ?? 0;
        return {
          ...prev,
          isLiked: !wasLiked,
          likeCount: wasLiked ? count - 1 : count + 1,
        };
      });
    } catch (err) {
      console.error("[좋아요 실패]", err);
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  // 스크랩 토글
  const handleToggleScrap = async () => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!column) return;

    try {
      await axios.patch(
        `https://cross-note.com/column/${columnId}/scrap`,
        null,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setColumn((prev) => {
        if (!prev) return prev;
        const wasScrapped = prev.isScrapped ?? false;
        const count = prev.scrapCount ?? 0;
        return {
          ...prev,
          isScrapped: !wasScrapped,
          scrapCount: wasScrapped ? count - 1 : count + 1,
        };
      });
    } catch (err) {
      console.error("[스크랩 실패]", err);
      alert("스크랩 처리에 실패했습니다.");
    }
  };

  // 게시글(칼럼) 삭제
  const handleDeleteColumn = async () => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!columnId) {
      alert("칼럼 정보가 없습니다.");
      return;
    }

    const ok = window.confirm("이 칼럼을 삭제하시겠습니까?");
    if (!ok) return;

    try {
      await axios.delete(`https://cross-note.com/column/${columnId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      alert("칼럼이 삭제되었습니다.");
      navigate("/column"); // 목록 페이지로 이동
    } catch (err) {
      console.error("[칼럼 삭제 실패]", err);
      alert("칼럼 삭제에 실패했습니다.");
    }
  };

  // 댓글 작성
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      setSubmitting(true);

      const body = {
        columnId: columnId,
        comment: newComment.trim(), // 백엔드 스펙
      };

      const res = await axios.post(
        "https://cross-note.com/column/comment",
        body,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      console.log("[댓글 생성 응답]", res.data);

      const created = res.data; // 생성된 댓글 객체라고 가정

      setComments((prev) => [...prev, created]);
      setColumn((prev) =>
        prev
          ? { ...prev, commentCount: (prev.commentCount ?? 0) + 1 }
          : prev
      );
      setNewComment("");
    } catch (err) {
      console.error("[댓글 생성 실패]", err);
      alert("댓글 작성에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  // 댓글 수정 시작
  const handleStartEdit = (comment) => {
    setEditingCommentId(comment.commentId);
    setEditingContent(comment.content ?? comment.comment ?? "");
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  // 댓글 수정 저장
  const handleSaveEdit = async () => {
    if (!editingContent.trim()) {
      alert("수정할 내용을 입력해주세요.");
      return;
    }
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const body = {
        commentId: editingCommentId,
        content: editingContent.trim(), // 백엔드 스펙
      };

      await axios.patch("https://cross-note.com/column/comment", body, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setComments((prev) =>
        prev.map((c) =>
          c.commentId === editingCommentId
            ? {
                ...c,
                content: editingContent.trim(),
                updatedAt: new Date().toISOString(), // 백엔드에서 내려주면 그 값 쓰기
              }
            : c
        )
      );

      setEditingCommentId(null);
      setEditingContent("");
    } catch (err) {
      console.error("[댓글 수정 실패]", err);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    const ok = window.confirm("댓글을 삭제하시겠습니까?");
    if (!ok) return;

    try {
      await axios.delete(
        `https://cross-note.com/column/comment/${commentId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setComments((prev) => prev.filter((c) => c.commentId !== commentId));
      setColumn((prev) =>
        prev
          ? {
              ...prev,
              commentCount: Math.max((prev.commentCount ?? 1) - 1, 0),
            }
          : prev
      );
    } catch (err) {
      console.error("[댓글 삭제 실패]", err);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  // 댓글 입력창으로 스크롤
  const scrollToCommentInput = () => {
    commentInputRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 로딩 / 에러
  if (loading) {
    return (
      <div className="app-wrapper">
        <GlobalHeader />
        <Header title="칼럼 읽기" />
        <div style={{ padding: 16 }}>불러오는 중...</div>
      </div>
    );
  }

  if (error || !column) {
    return (
      <div className="app-wrapper">
        <GlobalHeader />
        <Header title="칼럼 읽기" />
        <div style={{ padding: 16 }}>
          {error || "칼럼 정보를 찾을 수 없습니다."}
          <button
            style={{
              marginLeft: 8,
              padding: "6px 10px",
              fontSize: 13,
              cursor: "pointer",
            }}
            onClick={() => navigate("/column")}
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <GlobalHeader />
      <Header title="칼럼 읽기" />

      <div
        style={{
          background: "#f5f6fa",
          minHeight: "100vh",
          padding: "16px 16px 32px",
        }}
      >
        {/* 칼럼 카드 */}
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            background: "#ffffff",
            borderRadius: 16,
            padding: 20,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          {/* 카테고리 */}
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            {[column.categoryId1, column.categoryId2, column.categoryId3]
              .filter(Boolean)
              .map((catId, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    border: "1px solid #e1e4ea",
                    fontSize: 11,
                    background: "#f6f8ff",
                  }}
                >
                  {CATEGORY_ID_TO_NAME[catId] ?? `카테고리 ${catId}`}
                </span>
              ))}
          </div>

          {/* 제목 */}
          <h1
            style={{
              fontSize: 20,
              fontWeight: 600,
              marginBottom: 6,
              lineHeight: 1.4,
            }}
          >
            {column.title}
          </h1>

          {/* 작성일 + 삭제 버튼 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "#9aa0b2",
              }}
            >
              {formatDateTime(column.createdAt)} 작성
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => navigate("/column")}
                style={{
                  border: "1px solid #e1e4ea",
                  background: "#fff",
                  borderRadius: 999,
                  padding: "4px 10px",
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                목록
              </button>
              <button
                type="button"
                onClick={handleDeleteColumn}
                style={{
                  border: "none",
                  background: "#ff4b5c",
                  color: "#fff",
                  borderRadius: 999,
                  padding: "4px 10px",
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                글 삭제
              </button>
            </div>
          </div>

          {/* 본문 */}
          <div
            style={{
              whiteSpace: "pre-line",
              fontSize: 14,
              lineHeight: 1.7,
              color: "#333",
              marginBottom: 16,
            }}
          >
            {column.content}
          </div>

          {/* 대표 이미지 */}
          {column.imageUrl && (
            <div
              style={{
                width: "100%",
                borderRadius: 12,
                overflow: "hidden",
                margin: "8px 0 16px",
              }}
            >
              <img
                src={column.imageUrl}
                alt="대표 이미지"
                style={{
                  width: "100%",
                  maxHeight: 260,
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          )}

          {/* 좋아요 / 스크랩 / 댓글 요약 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 12,
                fontSize: 13,
                color: "#7a7f8c",
                alignItems: "center",
              }}
            >
              <button
                onClick={handleToggleLike}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  cursor: "pointer",
                  fontSize: 13,
                  color: column.isLiked ? "#ff4b5c" : "#7a7f8c",
                }}
              >
                ♡ {column.likeCount ?? 0}
              </button>

              <button
                onClick={handleToggleScrap}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  cursor: "pointer",
                  fontSize: 13,
                  color: column.isScrapped ? "#00897b" : "#7a7f8c",
                }}
              >
                스크랩 {column.scrapCount ?? 0}
              </button>

              <span>댓글 {column.commentCount ?? comments.length}</span>
            </div>

            <button
              onClick={scrollToCommentInput}
              style={{
                border: "none",
                background: "transparent",
                padding: 0,
                cursor: "pointer",
                fontSize: 13,
                color: "#4a6fff",
              }}
            >
              댓글 쓰기
            </button>
          </div>
        </div>

        {/* 댓글 카드 */}
        <div
          style={{
            maxWidth: 720,
            margin: "16px auto 0",
            background: "#ffffff",
            borderRadius: 16,
            padding: 20,
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          }}
        >
          {/* 헤더 */}
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
                fontWeight: 500,
              }}
            >
              댓글 {comments.length}개
            </div>
          </div>

          {/* 입력창 */}
          <form onSubmit={handleSubmitComment} ref={commentInputRef}>
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <input
                type="text"
                placeholder="댓글을 입력해주세요"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{
                  flex: 1,
                  borderRadius: 999,
                  border: "1px solid #e1e4ea",
                  padding: "8px 12px",
                  fontSize: 13,
                }}
              />
              <button
                type="submit"
                disabled={submitting}
                style={{
                  borderRadius: 999,
                  border: "none",
                  padding: "0 16px",
                  fontSize: 13,
                  background: "#4a6fff",
                  color: "#fff",
                  cursor: "pointer",
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                댓글
              </button>
            </div>
          </form>

          {/* 목록 */}
          {comments.length === 0 ? (
            <div
              style={{
                fontSize: 13,
                color: "#a0a4b3",
                paddingTop: 8,
              }}
            >
              아직 작성된 댓글이 없습니다.
            </div>
          ) : (
            comments.map((c) => {
              const isEditing = c.commentId === editingCommentId;

              const userId =
                c.userId ?? c.memberId ?? c.authorId ?? null;
              const nickname =
                c.nickname || c.authorNickname || c.authorName || null;

              const timeAgo = formatTimeAgo(c.createdAt);
              const updated =
                c.updatedAt && c.updatedAt !== c.createdAt;

              return (
                <div
                  key={c.commentId}
                  style={{
                    padding: "12px 0",
                    borderBottom: "1px solid #f1f2f6",
                  }}
                >
                  {/* 상단: 이름 + 액션 */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    {/* 사용자 id / 닉네임 영역 클릭 시 프로필 이동 */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!userId) return;
                        navigate(`/profile/${userId}`);
                      }}
                      style={{
                        border: "none",
                        background: "transparent",
                        padding: 0,
                        cursor: userId ? "pointer" : "default",
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      {nickname || (userId ? `User ${userId}` : "사용자")}
                    </button>

                    {/* 모든 댓글에 수정/삭제 노출 */}
                    {!isEditing && (
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          fontSize: 11,
                          color: "#9aa0b2",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleStartEdit(c)}
                          style={{
                            border: "none",
                            background: "transparent",
                            padding: 0,
                            cursor: "pointer",
                            fontSize: 11,
                            color: "#9aa0b2",
                          }}
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteComment(c.commentId)
                          }
                          style={{
                            border: "none",
                            background: "transparent",
                            padding: 0,
                            cursor: "pointer",
                            fontSize: 11,
                            color: "#ff4b5c",
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 내용 / 수정폼 */}
                  {!isEditing ? (
                    <div
                      style={{
                        fontSize: 13,
                        color: "#555",
                        marginBottom: 4,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {c.content ?? c.comment}
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        marginBottom: 4,
                      }}
                    >
                      <input
                        type="text"
                        value={editingContent}
                        onChange={(e) =>
                          setEditingContent(e.target.value)
                        }
                        style={{
                          flex: 1,
                          borderRadius: 8,
                          border: "1px solid #e1e4ea",
                          padding: "6px 8px",
                          fontSize: 13,
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        style={{
                          borderRadius: 8,
                          border: "none",
                          padding: "0 10px",
                          fontSize: 12,
                          background: "#4a6fff",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        저장
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        style={{
                          borderRadius: 8,
                          border: "none",
                          padding: "0 10px",
                          fontSize: 12,
                          background: "#f1f2f6",
                          color: "#555",
                          cursor: "pointer",
                        }}
                      >
                        취소
                      </button>
                    </div>
                  )}

                  {/* 시간 표시 */}
                  <div
                    style={{
                      fontSize: 11,
                      color: "#a0a4b3",
                    }}
                  >
                    {timeAgo}
                    {updated && (
                      <>
                        {" "}
                        {formatDateTime(c.updatedAt)} 수정됨
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
