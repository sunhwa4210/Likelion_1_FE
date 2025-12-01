import React, { useState } from "react";
import Header from "../../components/atoms/header/GlobalHeader";
import styles from "./qna.module.css";

import QnaSearchBar from "./components/QnaSearchBar";
import QnaFilter from "./components/qnafilter";
import QnaCard from "./components/qnaCard";
import QnaFabButton from "./components/qnaFabButton";

export default function Qna() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKey, setFilterKey] = useState("latest");

  const handleSearchSubmit = () => {
    // 나중에 API 연결 시 여기에 검색 로직 들어가면 됨
    // 예: fetch(`/api/qna?query=${searchTerm}&sort=${filterKey}`)
  };

  return (
    <div className="app-wrapper">
      <Header />

      <div className={styles.qnaContent}>
        <QnaSearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onSubmit={handleSearchSubmit}
        />

        <QnaFilter onChange={setFilterKey} />

        {/* QnA 카드 리스트 (지금은 하드코딩) */}
        <QnaCard />
        <QnaCard />
        <QnaCard />
        <QnaCard />
        <QnaCard />
        <QnaCard />

        <QnaFabButton />
      </div>
    </div>
  );
}
