// src/pages/balancegame/TodayBalanceCard.jsx
import React from "react";
import styles from "./balancegame.module.css";

export default function TodayBalanceCard({
  badgeLabel,
  title,
  description,
  question,
  onSelect,
}) {
  return (
    <div className={styles.quizStyle1}>
      <div className={styles.titleContainer}>
        <div className={styles.title}>{title}</div>
        <div className={styles.subTitle}>{description}</div>
      </div>

      <div className={styles.card}>
        <div className={styles.badgeLarge}>{badgeLabel}</div>

        <div className={styles.question}>{question}</div>

        <div className={styles.select}>
          <button
            className={styles.buttonO}
            type="button"
            onClick={() => onSelect("O")}
          >
            O
          </button>
          <button
            className={styles.buttonX}
            type="button"
            onClick={() => onSelect("X")}
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
}
