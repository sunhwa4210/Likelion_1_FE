import React from 'react';
import FollowList from './FollowList';
import Header from '../../../../components/Header/Header'
import GlobalHeader from '../../../../components/Header/GlobalHeader';
import followListStyles from './FollowList.module.css';

export default function Follow() {
  return (
    <div className="app-wrapper">
      <GlobalHeader />
      <Header title="팔로워/팔로잉"/>

      {/* 본문 */}
      <main className="content">
        <FollowList styles={followListStyles} />
      </main>

    </div>
  );
}