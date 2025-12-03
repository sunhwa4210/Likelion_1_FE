import React, { useState } from "react";
import styles from "../qna.module.css";
import Grid from "../icon/grid.svg";

const FILTER_OPTIONS = [
  { key: "latest", label: "최신순" },
  { key: "popular", label: "인기순" },
  { key: "mostCommented", label: "댓글많은순" },
];

export default function QnaFilter({ onChange }) {
  const [filter, setFilter] = useState("latest");

  const handleFilterClick = (key) => {
    setFilter(key);
    onChange?.(key);
  };

  return (
    <div className={styles.filterRow}>
      {/* 왼쪽 : 정렬 필터 3개 */}
      <div className={styles.filterWrapper}>
        {FILTER_OPTIONS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`${styles.filterBtn} ${
              filter === item.key ? styles.filterBtnActive : ""
            }`}
            onClick={() => handleFilterClick(item.key)}
          >
            <span className={styles.dot} />
            <span className={styles.text}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* 오른쪽 : 필터 아이콘 + 텍스트 */}
      <button type="button" className={styles.filterMoreBtn}>
        <img
          src={Grid}
          alt="필터 아이콘"
          className={styles.filterMoreIcon}
        />
        <span className={styles.filterMoreText}>필터</span>
      </button>
    </div>
  );
}
