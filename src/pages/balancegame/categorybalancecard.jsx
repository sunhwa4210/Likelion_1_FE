// src/pages/balancegame/CategoryBalanceCard.jsx
import { useState } from "react";
import Button from "../../components/atoms/btn_I/btn_I";
import styles from "./balancegame.module.css";

export default function CategoryBalanceCard({
  title,
  description,
  options,
  onSelectOption,
}) {
  const [selectedCategory, setSelectedCategory] = useState("인문사회");
  const [isOpen, setIsOpen] = useState(false);

  const categoryList = [
    "인문사회",
    "자연과학",
    "경제/경영",
    "스포츠/라이프스타일",
  ];

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsOpen(false);
  };

  return (
    <div className={styles.quizStyle2}>
      <div className={styles.titleContainer}>
        <div className={styles.title}>{title}</div>
        <div className={styles.subTitle}>{description}</div>
      </div>

      <div className={styles.card}>
        {/* 드롭다운 헤더 */}
        <div className={styles.dropdown}>
          <span>{selectedCategory}</span>

          <button
            type="button"
            className={styles.dropdownArrow}
            onClick={handleToggle}
          >
            {isOpen ? "▲" : "▼"}
          </button>
        </div>

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

        <p className={styles.categoryDescription}>
          둘 중에 더 관심 가는 선택지를 골라보세요
        </p>

        {/* 옵션 버튼들 */}
        <div className={styles.select}>
          {options.map((opt) => (
            <Button
              key={opt.id}
              appearance="default"
              onClick={() => onSelectOption?.(opt.id)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
