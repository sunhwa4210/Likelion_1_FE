
import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import { ModalProvider } from './components/Modal/ModalProvider';

// Curation 관련 페이지
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
import ApiTestPage from './pages/apiTest/ApiTestPage';
import SocialRedirect from './pages/social/socialRedirect';

// 마이페이지 - 정보 수정 / 스크랩한 큐레이션 / 내가 작성한 칼럼 / 내가 작성한 QnA
import InformModify from './pages/mypage/location/modify/informModify';
import Scrap from './pages/mypage/location/scrap/scrap';
import WriteCalum from './pages/mypage/location/calum/writeCalum';
import WriteQnA from './pages/mypage/location/qna/writeQnA';

// 타 사용자 프로필 페이지 
import UserprofileFollow from './pages/userprofile/userprofileFollow';
import UserFollow from './pages/userprofile/userfollow/userfollow';


export default function App() {
  return (
    <ModalProvider>
<<<<<<< HEAD
      <div className='app'>
=======

      {/* 레이아웃 기준이 될 최상단 래퍼 */}
      <div className="app">
>>>>>>> main
        <Routes>
          {/* 메인 / 큐레이션 영역 */}
          <Route path="/curation" element={<AllCuration />} />
          <Route path="/curation/personal" element={<PersonalCuration />} />
          <Route path="/curation/:curationId" element={<CurationDetail />} />

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


          {/* 정보 수정 / 스크랩한 큐레이션 / 내가 작성한 칼럼 / 내가 작성한 QnA */}
          <Route path="/mypage/location/modify" element={<InformModify />} />
          <Route path="/mypage/location/scrap" element={<Scrap />} />
          <Route path="/mypage/location/calum" element={<WriteCalum />} />
          <Route path="/mypage/location/qna" element={<WriteQnA />} />

          {/* 타사용자 프로필 */}
          <Route path="/users/:userId" element={<UserprofileFollow />} /> 
          <Route path="/user/:userId/:type" element={<UserFollow />} />  

          {/* 기타 */}
          <Route path="/api-test" element={<ApiTestPage />} />
          <Route path="/login/oauth2/code/google" element={<SocialRedirect/>}/> 
          <Route path="/auth/kakao/callback" element={<SocialRedirect />} />
        </Routes>
<<<<<<< HEAD
        </div>
=======
      </div>

>>>>>>> main
    </ModalProvider>
  );
}
