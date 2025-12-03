// src/pages/qna/components/filterBedge.jsx
import React from "react";
import styles from "../qnaWrite.module.css";

export default function FilterBedge({ label, active, onToggle }) {
  const handleClick = () => {
    // onToggle이 함수인 경우에만 호출해서 TypeError 방지
    if (typeof onToggle === "function") {
      onToggle(label);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${styles.badge} ${active ? styles.badgeActive : ""}`}
    >
      {label}
    </button>
  );
}
