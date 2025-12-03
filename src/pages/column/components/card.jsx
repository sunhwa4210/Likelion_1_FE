// src/pages/column/components/Card.jsx
import React from "react";
import styles from "../column.module.css";

import Heart from "../../qna/icon/heart.svg";
import Message from "../../qna/icon/message-square.svg";

export default function Card({
  title,
  likeCount,
  commentCount,
  categories = [],
  isBest,
  imageUrl,
  onClick,
}) {
  return (
    <div
      className={styles.cardContainer}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.();
        }
      }}
    >
      <div className={styles.titleTop}>
        <div className={styles.textTitle}>
          <div className={styles.bedgeGroup}>
            {categories.slice(0, 3).map((cat, idx) => (
              <div key={idx} className={styles.cBedge}>
                {cat}
              </div>
            ))}
            {isBest && (
              <div className={styles.bestBedge}>
                베스트
              </div>
            )}
          </div>

          <div className={styles.cardTitle}>{title}</div>
          {/* 작성자 이름이 아직 없으니 일단 숨기거나 하드코딩 가능 */}
          {/* <div className={styles.cardSubTitle}>작성자</div> */}
        </div>

        <div className={styles.img}>
          {imageUrl && (
            <img
              src={imageUrl}
              alt={title}
              className={styles.cardThumbnail}
            />
          )}
        </div>
      </div>

      <div className={styles.subWrapper}>
        <div className={styles.sub}>
          <img src={Heart} alt="좋아요" />
          <span className={styles.num}>{likeCount}</span>
        </div>

        <div className={styles.sub}>
          <img src={Message} alt="댓글" />
          <span className={styles.num}>{commentCount}</span>
        </div>
      </div>
    </div>
  );
}
