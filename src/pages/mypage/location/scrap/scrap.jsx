import React from "react";
import ScrapCurationDetail from "./ScrapCurationDetail";

export default function Scrap() {
  return (
    <div className="app-wrapper">
      {/* 헤더 컴포넌트 */}

      {/* 본문 */}
      <main className="content">
        <ScrapCurationDetail />
      </main>

      {/* 푸터가 필요한 화면에서만 렌더 */}
    </div>
  );
}
