import React from "react";
import styles from "./qnaCard.module.css";

export default function QnaCard({
  title,
  content,
  likeCount,
  answerCount,
  onClick,
}) {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.textBox}>
        <div className={styles.title}>{title}</div>
        <div className={styles.content}>{content}</div>
      </div>

      <div className={styles.footer}>
        <div className={styles.iconItem}>♡ {likeCount}</div>
        <div className={styles.iconItem}>💬 {answerCount}</div>
      </div>
    </div>
  );
}
