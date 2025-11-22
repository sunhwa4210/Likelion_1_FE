import React from "react";
import NotifyList from './NotifyList';
import Header from "../../components/atoms/Header/header";

export default function Notification() {
  return (
    <div className="app-wrapper">
      {/* 헤더 컴포넌트 */}   
      <Header title="알림"/>    

      {/* 본문 */}
      <main className="content">
        {/* 여기에 페이지 콘텐츠 전부 */}
        <NotifyList />
      </main>

      {/* 푸터가 필요한 화면에서만 렌더 */}
    </div>
  );
}
