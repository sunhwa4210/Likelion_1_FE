// src/pages/column/components/Card.jsx
import React from "react";
import styles from "../column.module.css";

import Heart from "../../qna/icon/heart.svg";
import Message from "../../qna/icon/message-square.svg";

export default function Card() {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.titleTop}>
        <div className={styles.textTitle}>
          <div className={styles.bedgeGroup}>
            <div className={styles.cBedge}>분야</div>
            <div className={styles.cBedge}>분야</div>
            <div className={styles.cBedge}>분야</div>
          </div>

          <div className={styles.cardTitle}>현대 사회와 소외</div>
          <div className={styles.cardSubTitle}>김슈니</div>
        </div>

        <div className={styles.img}></div>
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
