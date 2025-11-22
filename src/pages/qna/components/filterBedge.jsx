// src/pages/qna/components/filterBedge.jsx
import React, { useState } from "react";
import styles from "../qnaWrite.module.css";

export default function FilterBadge({ label }) {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive((prev) => !prev);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${styles.bedge} ${active ? styles.bedgeActive : ""}`}
    >
      {label}
    </button>
  );
}
