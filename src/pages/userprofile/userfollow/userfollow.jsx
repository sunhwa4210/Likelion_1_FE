// ==== 타사용자 팔로워/팔로우 목록 페이지 ====
// 상위 컴포넌트에서 렌더링 중 

import React from 'react';
import UserFollowList from './UserFollowList';
import Header from '../../../components/Header/Header';
import GlobalHeader from '../../../components/atoms/header/GlobalHeader';
import { useAuth } from '../../../contexts/AuthContext'; // 🚨 useAuth 추가

export default function UserFollow() {
  // useAuth를 사용하지 않더라도, AuthContext가 필요한 경우를 대비해 import만 유지합니다.
  // const { authLoading } = useAuth(); 

  return (
    <div className="app-wrapper">
      <GlobalHeader />
      <Header title="팔로워/팔로잉"/>

      {/* 본문 */}
      <main className="content">
        {/* UserFollowList에서 useParams를 사용하여 userId와 type을 가져옴 */}
        <UserFollowList />
      </main>

    </div>
  );
}