import React from 'react';
import { Routes, Route } from 'react-router-dom'; // ✅ Router 제거
import { ModalProvider } from './components/Modal/ModalProvider';

// Curation 관련 페이지
import CurationPage from './pages/curation/curation';
import PersonalCuration from './pages/curation/PersonalCuration';
import AllCuration from './pages/curation/AllCuration';
import CurationDetail from './pages/curation/CurationDetail';

// QnA 관련
import QnaPage from './pages/qna/qna';
import QnaWrite from './pages/qna/qnaWrite';
import QnaDetail from './pages/qna/qnaDetail';

// 컬럼 관련
import ColumnPage from './pages/column/column';
import ColumnWrite from './pages/column/columnWrite';
import ColumnRead from './pages/column/columnRead';

// 유저/알림 관련
import Login from './pages/login/login';
import Signup from './pages/signup/signup';
import MyPage from './pages/mypage/mypage';
import NotificationPage from './pages/notification/notification';

// 기타 페이지들
import BalanceGamePage from './pages/balancegame/balancegame';
import SomePage from './pages/SomePage';
import ApiTestPage from './pages/apiTest/ApiTestPage';
import SocialRedirect from './pages/social/socialRedirect';

export default function App() {
  return (
    <ModalProvider>
      {/* ✅ 여기서 더 이상 Router를 쓰지 않습니다 */}
      <Routes>
        {/* 메인 / 큐레이션 영역 */}
        <Route path="/" element={<CurationPage />} />
        <Route path="/curation" element={<AllCuration />} />
        <Route path="/curation/personal" element={<PersonalCuration />} />
        <Route path="/curation/:id" element={<CurationDetail />} />

        {/* 밸런스 게임 */}
        <Route path="/balance-game" element={<BalanceGamePage />} />

        {/* 컬럼 */}
        <Route path="/column" element={<ColumnPage />} />
        <Route path="/columnwrite" element={<ColumnWrite />} />
        <Route path="/columnread" element={<ColumnRead />} />

        {/* QnA */}
        <Route path="/qna" element={<QnaPage />} />
        <Route path="/qnawrite" element={<QnaWrite />} />
        <Route path="/qnadetail" element={<QnaDetail />} />

        {/* 유저 / 마이페이지 / 알림 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/notification" element={<NotificationPage />} />

        {/* 기타 */}
        <Route path="/modal-test" element={<SomePage />} />
        <Route path="/api-test" element={<ApiTestPage />} />
        <Route path="/social" element={<SocialRedirect />} />
      </Routes>
    </ModalProvider>
  );
}
