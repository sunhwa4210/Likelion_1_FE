import { useMemo, useState } from "react";
import styles from "./balancegame.module.css";
import Arrow from "./chevron-down.svg";

export default function CategoryBalanceCard({
  title,
  description,
  question,
  options,
  onSelectOption,
  categoryLabel,
  onCategoryChange,
  showCategorySelector = true,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const categoryList = useMemo(
    () => [
      "인문사회",
      "자연과학",
      "공학·기술",
      "경제·경영",
      "예술·문화",
      "스포츠·라이프스타일",
    ],
    []
  );

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleCategorySelect = (category) => {
    onCategoryChange?.(category);
    setIsOpen(false);
  };

  return (
    <div className={styles.quizStyle2}>
      <div className={styles.titleContainer}>
        <div className={styles.title}>{title}</div>
        <div className={styles.subTitle}>{description}</div>
      </div>

      <div className={styles.card}>

        {showCategorySelector && (
          <div className={styles.dropdownWrap}>
            {/* 드롭다운 헤더 */}
            <button
              type="button"
              className={styles.dropdown}
              onClick={handleToggle}
            >
              <span>{categoryLabel ?? "인문사회"}</span>
              <img
                src={Arrow}
                alt=""
                className={`${styles.dropdownArrowIcon} ${
                  isOpen ? styles.dropdownArrowOpen : ""
                }`}
              />
            </button>

            {/* 드롭다운 리스트 */}
            {isOpen && (
              <div className={styles.dropdownList}>
                {categoryList.map((category) => (
                  <div
                    key={category}
                    className={styles.dropdownItem}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <p className={styles.categoryDescription}>
          둘 중에 더 관심 가는 선택지를 골라보세요
        </p>

        {question && <div className={styles.question}>{question}</div>}

        <div className={styles.select}>
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={styles.choiceButton}
              onClick={() => onSelectOption?.(opt.id)}
            >
              {opt.label
                ? `${opt.label}. ${opt.text ?? ""}`
                : opt.text ?? opt.id}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
