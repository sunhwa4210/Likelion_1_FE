import React from "react";
import styles from "./GenderSelector.module.css";

export default function GenderSelector({ value, onChange }) {
  const handleSelect = (newGender) => {
    if (!onChange) return;
    onChange(newGender);
  };

  return (
    <div className={styles.genderWrapper}>
      <p className={styles.genderTitle}>성별</p>

      <div className={styles.genderOptions}>
        <button
          type="button"
          className={`${styles.genderItem} ${value === "MALE" ? styles.active : ""}`}
          onClick={() => handleSelect("MALE")}
        >
          <span className={styles.genderCheckbox} />
          <span className={styles.genderLabel}>남성</span>
        </button>

        <button
          type="button"
          className={`${styles.genderItem} ${value === "FEMALE" ? styles.active : ""}`}
          onClick={() => handleSelect("FEMALE")}
        >
          <span className={styles.genderCheckbox} />
          <span className={styles.genderLabel}>여성</span>
        </button>
      </div>
    </div>
  );
}
