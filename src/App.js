// src/App.js 또는 src/App.jsx

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
import QnaWrite from './pages/qna/qnaWrite';
import QnaDetail from './pages/qna/qnaDetail';
import ColumnWrite from './pages/column/columnWrite';
import ColumnRead from './pages/column/columnRead';
import ApiTestPage from './pages/apiTest/ApiTestPage';

export default function App() {
  return (
    <ModalProvider>

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
          <Route path="/qnawrite" element={<QnaWrite />} />
          <Route path="/qnadetail" element={<QnaDetail />} />
          <Route path="/columnwrite" element={<ColumnWrite />} />
          <Route path="/columnread" element={<ColumnRead />} />


          <Route path="/api-test" element={<ApiTestPage />} />
        </Routes>
      </BrowserRouter>
    </ModalProvider>
  );
}
