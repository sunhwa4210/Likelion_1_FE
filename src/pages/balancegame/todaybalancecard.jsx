import React from "react";
import styles from "./balancegame.module.css";

export default function TodayBalanceCard({
  badgeLabel,
  title,
  description,
  question,
  type = "OX",
  options = [],
  onSelectOx,
  onSelectOption,
}) {
  const renderActions = () => {
    if (type === "PREFERENCE") {
      return (
        <div className={styles.select}>
          {options.map((opt) => (
            <button
              key={opt.id}
              className={styles.choiceButton}
              type="button"
              onClick={() => onSelectOption?.(opt.id)}
            >
              {opt.label ?? opt.id}
            </button>
          ))}
        </div>
      );
    }

    // 기본 OX 타입
    return (
      <div className={styles.select}>
        <button
          className={styles.buttonO}
          type="button"
          onClick={() => onSelectOx?.("O")}
        >
          O
        </button>
        <button
          className={styles.buttonX}
          type="button"
          onClick={() => onSelectOx?.("X")}
        >
          X
        </button>
      </div>
    );
  };

  return (
    <div className={styles.quizStyle1}>
      <div className={styles.titleContainer}>
        <div className={styles.title}>{title}</div>
        <div className={styles.subTitle}>{description}</div>
      </div>

      <div className={styles.card}>
        <div className={styles.badgeLarge}>{badgeLabel}</div>

        <div className={styles.question}>{question}</div>

        {renderActions()}
      </div>
    </div>
  );
}
