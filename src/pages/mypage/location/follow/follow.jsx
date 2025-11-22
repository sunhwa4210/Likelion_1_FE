import React from 'react';
import FollowList from './FollowList';
import Header from '../../../../components/Header/Header'
// import Globalheader from '../../../../components/atoms/header/header'

export default function Follow() {
  return (
    <div className="app-wrapper">
      {/*<Globalheader />*/}
      <Header title="팔로워/팔로잉"/>

      {/* 본문 */}
      <main className="content">
        <FollowList />
      </main>

    </div>
  );
}