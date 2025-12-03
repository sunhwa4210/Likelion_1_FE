import React, { useState } from "react";
import styles from "../qna.module.css";
import SearchIcon from "../icon/search.svg";

export default function QnaSearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "검색어를 입력하거나, 필터로 원하는 조건을 선택하세요",
}) {
  // 부모에서 value를 안 넘기면 내부에서 상태 관리
  const [internalValue, setInternalValue] = useState("");

  const inputValue = value !== undefined ? value : internalValue;

  const handleChange = (e) => {
    const next = e.target.value;
    if (onChange) {
      onChange(next);
    } else {
      setInternalValue(next);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSubmit?.();
    }
  };

  return (
    <div className={styles.searchBar}>
      <img
        src={SearchIcon}
        alt="검색"
        className={styles.searchIcon}
      />
      <input
        className={styles.searchInput}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
    </div>
  );
}
