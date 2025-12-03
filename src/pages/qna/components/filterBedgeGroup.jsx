// src/pages/qna/components/SubjectBadges.jsx
import React, { useEffect, useState } from "react";
import FilterBedge from "./filterBedge";
import styles from "../qnaWrite.module.css";

// 카테고리 이름 → 백엔드 ID 매핑
const CATEGORY_NAME_TO_ID = {
  "인문사회": 1,
  "자연과학": 2,
  "공학·기술": 3,
  "경제·경영": 4,
  "예술·문화": 5,
  "스포츠·라이프스타일": 6,
  "철학": 7,
  "역사": 8,
  "사회학": 9,
  "언어": 10,
  "심리": 11,
  "수학": 12,
  "물리": 13,
  "화학": 14,
  "생물": 15,
  "의료": 16,
  "IT": 17,
  "AI": 18,
  "전자": 19,
  "기계": 20,
  "산업공학": 21,
  "경제": 22,
  "마케팅": 23,
  "비즈니스": 24,
  "미술": 25,
  "음악": 26,
  "문학": 27,
  "UI/UX": 28,
  "건축": 29,
  "영화": 30,
  "건강": 31,
  "스포츠": 32,
  "여행": 33,
  "생활": 34,
  "환경": 35,
};

export default function FilterBedgeGroup({ onChange }) {
  const [selectedNames, setSelectedNames] = useState([]);

  // 선택 상태가 바뀔 때마다 부모(QnaWrite)로 ID/이름 전달
  useEffect(() => {
    if (typeof onChange === "function") {
      const ids = selectedNames
        .map((name) => CATEGORY_NAME_TO_ID[name])
        .filter(Boolean)
        .slice(0, 3); // 최대 3개까지 전달

      onChange({
        ids,
        names: selectedNames.slice(0, 3),
      });
    }
  }, [selectedNames, onChange]);

  const toggleName = (name) => {
    setSelectedNames((prev) =>
      prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name].slice(0, 3) // 최대 3개 선택
    );
  };

  const renderGroup = (title, items) => (
    <div className={styles.filterRow} key={title}>
      <div className={styles.groupTitle}>{title}</div>
      <div className={styles.filterGroup}>
        {items.map((label) => (
          <FilterBedge
            key={label}
            label={label}
            active={selectedNames.includes(label)}
            onToggle={toggleName}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.filterGroupWrapper}>
      {renderGroup("인문사회", ["철학", "역사", "사회학", "언어", "심리"])}
      {renderGroup("자연과학", ["수학", "물리", "화학", "생물", "의료"])}
      {renderGroup("공학·기술", ["IT", "AI", "전자", "기계", "산업공학"])}
      {renderGroup("경제·경영", ["경제", "마케팅", "비즈니스"])}
      {renderGroup("예술·문화", ["미술", "음악", "문학", "UI/UX", "건축", "영화"])}
      {renderGroup("스포츠·라이프스타일", [
        "건강",
        "스포츠",
        "여행",
        "생활",
        "환경",
      ])}
    </div>
  );
}
