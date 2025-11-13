// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ModalProvider } from './components/Modal/ModalProvider';
import CurationPage from './pages/curation/curation';
import BalanceGamePage from './pages/balancegame/balancegame';
import ColumnPage from './pages/column/column';
import LoginPage from './pages/login/login';
import MyPage from './pages/mypage/mypage';
import NotificationPage from './pages/notification/notification';
import QnaPage from './pages/qna/qna';
import SignupPage from './pages/signup/signup';
import SomePage from './pages/SomePage';

export default function App() {
  return (
    <ModalProvider>      {/* 전역 모달 컨텍스트 (그 자체는 어디 있어도 됨) */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CurationPage />} />
          <Route path="/curation" element={<CurationPage />} />
          <Route path="/balance-game" element={<BalanceGamePage />} />
          <Route path="/column" element={<ColumnPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/notification" element={<NotificationPage />} />
          <Route path="/qna" element={<QnaPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/modal-test" element={<SomePage />} />
        </Routes>
      </BrowserRouter>
    </ModalProvider>
  );
}
