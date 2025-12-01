import React from "react";
import Header from "../../components/atoms/header/GlobalHeader";
import SubHeader from "../../components/Header/Header";

import styles from "./qnaWrite.module.css";
import FilterBedgeGroup from "./components/filterBedgeGroup";

export default function QnaWrite() {
  return (
    <div className="app-wrapper">
      <Header />
      <SubHeader title={"질문 작성하기"} />

      <div className={styles.selectSection}></div>

      <div className={styles.filterGroupWrapper}>
        <FilterBedgeGroup />
      </div>

      <div className={styles.writeTitle}>
        <div>
          <input
            type="text"
            className={styles.qnaTitle}
            placeholder="제목을 입력해 주세요"
          />
        </div>
        <div className={styles.count}>
          <div>0</div>
          <div>/</div>
          <div>20</div>
        </div>
      </div>

      <div className={styles.writeContent}>
        {/* 내용은 input보다는 textarea가 더 자연스럽긴 해서 이렇게 추천 */}
        <textarea
          className={styles.content}
          placeholder="내용을 입력하세요"
        />
      </div>
    </div>
  );
}
