import React from "react";
import Header from "../../components/atoms/Header/header";
import styles from "./balancegame.module.css";

import { useModal } from "../../components/Modal/ModalProvider";
import {
  BALANCE_RESULT_MODAL_CONFIG,
  RESULT_TYPES,
} from "./resultModalConfig";

import TodayBalanceCard from "./todaybalancecard";
import CategoryBalanceCard from "./categorybalancecard";

export default function Balancegame() {
  const { open } = useModal();
  const CORRECT_ANSWER = "O";

  const handleTodayAnswerSelect = async (answer) => {
    const type =
      answer === CORRECT_ANSWER
        ? RESULT_TYPES.CORRECT
        : RESULT_TYPES.WRONG;

    const config = BALANCE_RESULT_MODAL_CONFIG[type];
    const result = await open(config);

    if (type === RESULT_TYPES.CORRECT && result === "confirm") {
    }
  };

  const handleCategoryOptionSelect = (optionId) => {};

  return (
    <div className="app-wrapper">
          <Header />
      <div className={styles.contentWrapper}>
    

        {/* 오늘의 밸런스 게임 */}
        <TodayBalanceCard
          badgeLabel="사회학"
          title="오늘의 밸런스 게임"
          description="오늘의 밸런스 게임을 통해, 더 넓은 인사이트를 만나보세요"
          question="영어의 모든 불규칙 동사는 역사적으로 규칙 동사였다가 변화한 것이다."
          onSelect={handleTodayAnswerSelect}
        />

        {/* 분야별 밸런스 게임 */}
        <CategoryBalanceCard
          title="분야별 밸런스 게임"
          description="원하는 분야의 퀴즈를 골라보세요"
          categoryLabel="인문사회"
          options={[
            {
              id: "gene",
              label: "근시 유전자는 왜 사라지지 않았을까?",
            },
            {
              id: "life",
              label: "무기징역과 사형수의 교도소 생활은 뭐가 다를까?",
            },
          ]}
          onSelectOption={handleCategoryOptionSelect}
        />
      </div>
    </div>
  );
}
