// src/pages/qna/components/SubjectBadges.jsx
import React from "react";
import FilterBedge from "./filterBedge";
import styles from "../qnaWrite.module.css";

export default function SubjectBadges() {
  return (
    <div className={styles.filterGroupWrapper}>
      {/* 인문사회 */}
      <div className={styles.filterRow}>
        <div className={styles.title}>인문사회</div>
        <div className={styles.filterGroup}>
          <FilterBedge label="철학" />
          <FilterBedge label="역사" />
          <FilterBedge label="사회학" />
          <FilterBedge label="언어" />
          <FilterBedge label="심리" />
        </div>
      </div>

      {/* 자연과학 */}
      <div className={styles.filterRow}>
        <div className={styles.title}>자연과학</div>
        <div className={styles.filterGroup}>
          <FilterBedge label="수학" />
          <FilterBedge label="물리" />
          <FilterBedge label="화학" />
          <FilterBedge label="생물" />
          <FilterBedge label="의료" />
        </div>
      </div>

      {/* 공학·기술 */}
      <div className={styles.filterRow}>
        <div className={styles.title}>공학·기술</div>
        <div className={styles.filterGroup}>
          <FilterBedge label="IT" />
          <FilterBedge label="AI" />
          <FilterBedge label="전자" />
          <FilterBedge label="기계" />
          <FilterBedge label="산업공학" />
        </div>
      </div>

      {/* 경제·경영 */}
      <div className={styles.filterRow}>
        <div className={styles.title}>경제·경영</div>
        <div className={styles.filterGroup}>
          <FilterBedge label="경제" />
          <FilterBedge label="마케팅" />
          <FilterBedge label="비즈니스" />
        </div>
      </div>

      {/* 예술·문화 */}
      <div className={styles.filterRow}>
        <div className={styles.title}>예술·문화</div>
        <div className={styles.filterGroup}>
          <FilterBedge label="미술" />
          <FilterBedge label="음악" />
          <FilterBedge label="문화" />
          <FilterBedge label="UI/UX" />
          <FilterBedge label="건축" />
          <FilterBedge label="영화" />
        </div>
      </div>

      {/* 스포츠·라이프스타일 */}
      <div className={styles.filterRow}>
        <div className={styles.title}>스포츠·라이프스타일</div>
        <div className={styles.filterGroup}>
          <FilterBedge label="건강" />
          <FilterBedge label="스포츠" />
          <FilterBedge label="여행" />
          <FilterBedge label="생활" />
          <FilterBedge label="환경" />
        </div>
      </div>
    </div>
  );
}
