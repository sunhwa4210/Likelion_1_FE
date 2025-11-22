import React from "react";
import UserProfile from "./UserProfile";
import ReportRadar from "./ReportRadar";
import MenuReport from "./MenuReport";
import Header from "../../components/atoms/Header/header";

export default function Mypage() {
  return (
    <div className="app-wrapper">
      {/* 헤더 컴포넌트 */}
      {/*<Globalheader/>*}

      {/* 본문 */}
      <main className="content">
        {/* 여기에 페이지 콘텐츠 전부 */}
        <UserProfile />
        <ReportRadar />
        <MenuReport />
      </main>

      {/* 푸터가 필요한 화면에서만 렌더 */}
    </div>
  );
}
