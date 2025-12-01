import React from "react";
import ScrapCuration from "./ScrapCuration";

export default function Scrap() {
  return (
    <div className="app-wrapper">
      {/* 헤더 컴포넌트 */}

      {/* 본문 */}
      <main className="content">
        <ScrapCuration />
      </main>

      {/* 푸터가 필요한 화면에서만 렌더 */}
    </div>
  );
}
