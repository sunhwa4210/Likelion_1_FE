import React from "react";
import styles from "../qna.module.css";
import Heart from "../icon/heart.svg";
import Message from "../icon/message-square.svg";

export default function QnaCard() {
  return (
    <div className={styles.qnaPreview}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>제목을 입력하세요</div>
        <div className={styles.subTitle}>내용이 미리 보여지는 부분</div>
      </div>

      <div className={styles.subWrapper}>
        <div className={styles.sub}>
          <img src={Heart} alt="좋아요" />
          <span className={styles.num}>100</span>
        </div>
        <div className={styles.sub}>
          <img src={Message} alt="댓글" />
          <span className={styles.num}>100</span>
        </div>
      </div>
    </div>
  );
}
