import { useState } from "react";
import "../qna.css";
import QnaSearchBar from "./QnaSearchBar.jsx";
export default function QnaTabs() {
  const [tab, setTab] = useState("today");      // 탭 상태
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태

  // 검색 실행했을 때 (지금은 콘솔만 찍어보자)
  const handleSearchSubmit = () => {
    console.log("검색 실행:", searchTerm);
    // 나중에 여기서 API 호출하면 됨
  };

  return (
    <div className="qna-tabs-wrapper">
      {/* 탭 버튼 */}
      <div className="qna-tabs">
        <button
          className={`tab-btn ${tab === "today" ? "active" : ""}`}
          onClick={() => setTab("today")}
        >
          오늘의 QnA
        </button>

        <button
          className={`tab-btn ${tab === "best" ? "active" : ""}`}
          onClick={() => setTab("best")}
        >
          베스트 QnA
        </button>
      </div>

      {/* 탭에 따라 내용 바뀌기 */}
      <div className="qna-content">
        {tab === "today" && (
          <div>
            {/* 검색창 */}
            <QnaSearchBar
              value={searchTerm}
              onChange={setSearchTerm}         
              onSubmit={handleSearchSubmit}     
            />
            <qnafilter/>
          </div>
        )}

        {tab === "best" && (
          <div>
            <h2>베스트 QnA 리스트</h2>
            {/* <BestQnaList /> */}
          </div>
        )}
      </div>
    </div>
  );
}
