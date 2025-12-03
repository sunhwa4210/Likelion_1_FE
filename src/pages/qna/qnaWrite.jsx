// src/pages/qna/qnaWrite.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import GlobalHeader from "../../components/Header/GlobalHeader";
import Header from "../../components/Header/Header";

import styles from "./qnaWrite.module.css";
import FilterBedgeGroup from "./components/filterBedgeGroup";
import { useAuth } from "../../contexts/AuthContext";

// 질문 생성 API URL
const QNA_CREATE_URL = "https://cross-note.com/question";

export default function QnaWrite() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 백엔드로 보낼 카테고리 ID들
  const [category1, setCategory1] = useState(null);
  const [category2, setCategory2] = useState(null);
  const [category3, setCategory3] = useState(null);

  // 상단에 보여줄 선택된 카테고리 이름들
  const [selectedCategoryNames, setSelectedCategoryNames] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false); // 디자인 상 있으니 상태만 잡아 둠

  // 제목 입력 (20자 제한)
  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (value.length > 20) return;
    setTitle(value);
  };

  // 내용 입력
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  /**
   * FilterBedgeGroup 에서 내려주는 형식:
   * onChange({
   *   ids: [12, 31, 9],           // 숫자 ID들
   *   names: ["수학", "건강", "사회학"]  // 이름들
   * })
   */
  const handleCategoryChange = ({ ids, names }) => {
    setCategory1(ids[0] ?? null);
    setCategory2(ids[1] ?? null);
    setCategory3(ids[2] ?? null);
    setSelectedCategoryNames(names);
  };

  // 질문 작성 POST
  const handleSubmit = async () => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    if (!category1) {
      alert("최소 1개 이상의 카테고리를 선택해주세요.");
      return;
    }

    const body = {
      title: title.trim(),
      content: content.trim(),
      category1,
      category2: category2 || null,
      category3: category3 || null,
      // isAnonymous 필드가 백엔드에 있으면 여기에 추가
      // isAnonymous,
    };

    try {
      setLoading(true);

      const res = await axios.post(QNA_CREATE_URL, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("[질문 생성 응답]", res.data);
      alert("질문이 등록되었습니다.");
      // 필요하면 상세 페이지로 이동하도록 변경
      // navigate(`/qna/${res.data.questionId}`);
      navigate("/qna");
    } catch (err) {
      console.error("[질문 생성 실패]", err);
      alert("질문 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <GlobalHeader/>
      <Header title={"질문 작성하기"} />

      {/* 상단: 선택된 카테고리 뱃지 */}
      <div className={styles.selectedCategoryBar}>
        {selectedCategoryNames.map((name, idx) => (
          <span key={idx} className={styles.selectedCategoryChip}>
            {name}
          </span>
        ))}
      </div>

      {/* 카테고리 그룹 */}
      <FilterBedgeGroup onChange={handleCategoryChange} />

      {/* 제목 입력 */}
      <div className={styles.writeTitle}>
        <div>
          <input
            type="text"
            className={styles.qnaTitle}
            placeholder="질문 제목을 입력해 주세요"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div className={styles.count}>
          <div>{title.length}</div>
          <div>/</div>
          <div>20</div>
        </div>
      </div>

      {/* 내용 입력 */}
      <div className={styles.writeContent}>
        <textarea
          className={styles.content}
          placeholder="질문 내용을 입력해 주세요"
          value={content}
          onChange={handleContentChange}
        />
      </div>

      {/* 하단: 익명 체크 + 작성 버튼 */}
      <div className={styles.bottomArea}>
        <label className={styles.anonRow}>
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          <span>익명으로 작성하기</span>
        </label>

        <button
          type="button"
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "작성 중..." : "작성하기"}
        </button>
      </div>
    </div>
  );
}
