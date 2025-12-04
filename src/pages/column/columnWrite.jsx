// src/pages/column/columnWrite.jsx
import React, { useState, useRef } from "react";
import axios from "axios";
import "../../index.css";
import GlobalHeader from "../../components/Header/GlobalHeader";
import Header from "../../components/Header/Header";
import styles from "./columnWrite.module.css";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// 칼럼 작성 API URL
const COLUMN_CREATE_URL = "https://cross-note.com/column";

// 카테고리 이름 -> ID 매핑
const CATEGORY_NAME_TO_ID = {
  인문사회: 1,
  자연과학: 2,
  "공학·기술": 3,
  "경제·경영": 4,
  "예술·문화": 5,
  "스포츠·라이프스타일": 6,
  철학: 7,
  역사: 8,
  사회학: 9,
  언어: 10,
  심리: 11,
  수학: 12,
  물리: 13,
  화학: 14,
  생물: 15,
  의료: 16,
  IT: 17,
  AI: 18,
  전자: 19,
  기계: 20,
  산업공학: 21,
  경제: 22,
  비즈니스: 23,
  마케팅: 24,
  미술: 25,
  음악: 26,
  문학: 27,
  "UI/UX": 28,
  건축: 29,
  영화: 30,
  건강: 31,
  스포츠: 32,
  여행: 33,
  생활: 34,
  환경: 35,
};

const CATEGORY_GROUPS = [
  {
    group: "인문사회",
    colorKey: "humanities",
    items: ["철학", "역사", "사회학", "언어", "심리"],
  },
  {
    group: "자연과학",
    colorKey: "science",
    items: ["수학", "물리", "화학", "생물", "의료"],
  },
  {
    group: "공학·기술",
    colorKey: "tech",
    items: ["IT", "AI", "전자", "기계", "산업공학"],
  },
  {
    group: "경제·경영",
    colorKey: "economy",
    items: ["경제", "마케팅", "비즈니스"],
  },
  {
    group: "예술·문화",
    colorKey: "art",
    items: ["미술", "음악", "문학", "UI/UX", "건축", "영화"],
  },
  {
    group: "스포츠·라이프스타일",
    colorKey: "life",
    items: ["건강", "스포츠", "여행", "생활", "환경"],
  },
];

export default function ColumnWrite() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [showCategorySection, setShowCategorySection] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 대표 이미지 관련
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleTagClick = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleCategorySection = () => {
    setShowCategorySection((prev) => !prev);
  };

  const getTagClassName = (tag, colorKey) => {
    const base = styles.tag;
    if (!selectedTags.includes(tag)) return base;

    return {
      humanities: `${base} ${styles.tagHumanities}`,
      science: `${base} ${styles.tagScience}`,
      tech: `${base} ${styles.tagTech}`,
      economy: `${base} ${styles.tagEconomy}`,
      art: `${base} ${styles.tagArt}`,
      life: `${base} ${styles.tagLife}`,
    }[colorKey];
  };

  const handleThumbnailClick = () => fileInputRef.current?.click();

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setThumbnailFile(file);

    // 화면용 미리보기 URL
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
  if (!accessToken) {
    alert("로그인이 필요합니다.");
    return;
  }
  if (!title.trim() || !content.trim()) {
    alert("제목과 내용을 입력해 주세요.");
    return;
  }

  // 선택된 태그 -> 카테고리 ID 배열
  const categoryIds = selectedTags
    .map((tag) => CATEGORY_NAME_TO_ID[tag])
    .filter((id) => typeof id === "number")
    .slice(0, 3);

  // 서버 스펙에 맞는 JSON 바디 만들기
  const payload = {
    title: title.trim(),
    content: content.trim(),
    category1: categoryIds[0] ?? null,
    category2: categoryIds[1] ?? null,
    category3: categoryIds[2] ?? null,
    imageUrl: thumbnailPreview ?? null 

  };

  try {
    setIsSubmitting(true);

    const res = await axios.post(COLUMN_CREATE_URL, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Content-Type은 안 써도 Axios가 application/json으로 자동 설정
      },
    });

    console.log("[칼럼 작성 응답]", res.data);
    alert("칼럼이 성공적으로 등록되었습니다.");
    navigate("/column");
  } catch (error) {
    console.error("[칼럼 작성 에러]", error);
    if (error.response) {
      console.error("status:", error.response.status);
      console.error("body:", error.response.data);
    }
    alert("칼럼 등록 중 오류가 발생했습니다.");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="app-wrapper">
      <GlobalHeader />
      <Header title={"칼럼 쓰기"} />

      <div className={styles.writeContainer}>
        {/* 관심 분야 선택 바 */}
        <button
          type="button"
          className={styles.categoryBar}
          onClick={toggleCategorySection}
        >
          칼럼을 작성할 분야를 선택해주세요
        </button>

        {selectedTags.length > 0 && (
          <div className={styles.selectedTagPreview}>
            {selectedTags.map((tag) => (
              <span key={tag} className={styles.selectedTagChip}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {showCategorySection && (
          <div className={styles.categorySection}>
            {CATEGORY_GROUPS.map(({ group, items, colorKey }) => (
              <div key={group} className={styles.categoryGroup}>
                <div className={styles.categoryGroupTitle}>{group}</div>
                <div className={styles.tagRow}>
                  {items.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={getTagClassName(tag, colorKey)}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="button"
              className={styles.categoryConfirmButton}
              onClick={() => setShowCategorySection(false)}
            >
              선택 완료
            </button>
          </div>
        )}

        {/* 제목 */}
        <div className={styles.inputBlock}>
          <div className={styles.inputHeader}>
            <span className={styles.label}>제목을 입력해 주세요</span>
            <span className={styles.counter}>{title.length}/100</span>
          </div>
          <input
            className={styles.titleInput}
            placeholder="제목을 입력해 주세요"
            maxLength={100}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* 내용 */}
        <div className={styles.inputBlock}>
          <div className={styles.inputHeader}>
            <span className={styles.label}>내용을 입력하세요</span>
          </div>
          <textarea
            className={styles.contentInput}
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* 대표 이미지 */}
        <div className={styles.inputBlock}>
          <div className={styles.inputHeader}>
            <span className={styles.label}>대표 이미지 추가</span>
          </div>

          <div
            className={styles.thumbnailUploadArea}
            onClick={handleThumbnailClick}
          >
            <span className={styles.thumbnailText}>
              대표로 보여줄 이미지를 추가해 주세요
            </span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className={styles.fileInput}
            onChange={handleThumbnailChange}
          />

          {thumbnailPreview && (
            <div className={styles.thumbnailPreviewWrapper}>
              <img
                src={thumbnailPreview}
                alt="대표 이미지 미리보기"
                className={styles.thumbnailPreview}
              />
            </div>
          )}
        </div>

        {/* 발행 버튼 */}
        <div className={styles.footer}>
          <button
            type="button"
            className={`${styles.submitButton} ${
              !title.trim() || !content.trim() ? styles.submitDisabled : ""
            }`}
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || !content.trim()}
          >
            {isSubmitting ? "발행 중..." : "발행하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
