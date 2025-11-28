import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ⚡️ useNavigate 훅 임포트
import FollowListItem from './FollowListItem';
import { mockFollowers, mockFollowing } from './dummyUser';
import { useModal } from '../../../../components/Modal/ModalProvider';
import { presets } from '../../../../components/Modal/presets';

const TABS = {
  FOLLOWERS: 'followers',
  FOLLOWING: 'following',
};

const FollowList = () => {
  const { open } = useModal();
  const navigate = useNavigate();

  // 현재 활성화된 탭 상태 관리
  const [activeTab, setActiveTab] = useState(TABS.FOLLOWERS);
  
  // ✅ API 연동 전이므로 더미 데이터를 사용
  const [followersList, setFollowersList] = useState(mockFollowers);
  const [followingList, setFollowingList] = useState(mockFollowing);

  // 탭 클릭 핸들러
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // 현재 활성화된 탭에 따라 목록 데이터를 선택
  const currentList = activeTab === TABS.FOLLOWERS ? followersList : followingList;

  // 모달을 사용하는 새로운 액션 핸들러
  const handleActionClick = async (userId, userName) => {
    if (activeTab === TABS.FOLLOWING) {
      //  모달 열기
      const res = await open(presets.confirmUnfollow());

      //2모달 결과 확인
      if (res === 'delete') {
        // 팔로잉 취소 (언팔로우) 로직: 해당 유저를 목록에서 제거
        console.log(`[ACTION] ${userId}번 유저 (${userName}) 팔로잉 취소 (언팔로우) 처리됨`);
        
        // 더미 데이터 업데이트
        setFollowingList(prevList => prevList.filter(user => user.id !== userId));

        // ✅ 이동 경로 추가 필요!!! 
        const targetPath = './'; // 예시 경로
        
        console.log(`[ROUTE] 페이지 ${targetPath}로 이동합니다.`);
        navigate(targetPath); // 페이지 이동 실행
        
        // ✅ API 연동 시: 여기에 언팔로우 API 호출 로직 들어갈 듯 


        
      } else {
        console.log(`[ACTION] ${userId}번 유저 팔로잉 취소(모달)가 취소됨. 결과: ${res}`);
      }
    } 
    // 팔로워 탭에서의 액션 (예: 팔로우)이 있다면 여기에 추가 구현
  };

  return (
    <div className={styles.followPageContainer}>
      
      {/* 탭 네비게이션 시작 */}
      <div className={styles.tabNavigation}>
        {/* '팔로워' 탭 */}
        <div 
          className={`${styles.tabItem} ${activeTab === TABS.FOLLOWERS ? styles.active : ''}`}
          onClick={() => handleTabClick(TABS.FOLLOWERS)}
        >
          팔로워
        </div>
        {/* '팔로잉' 탭 */}
        <div 
          className={`${styles.tabItem} ${activeTab === TABS.FOLLOWING ? styles.active : ''}`}
          onClick={() => handleTabClick(TABS.FOLLOWING)}
        >
          팔로잉
        </div>
        
        {/* 하단 구분선 */}

        <div className={styles.tabUnderlineContainer}>
          <div className={`
            ${styles.tabUnderline} 
            ${activeTab === TABS.FOLLOWERS ? styles.followersActive : styles.followingActive}`
          }></div>
        </div>
      </div>

      <main className={styles.followListSection}>
        {currentList.length > 0 ? (
          <div className={styles.followList}>
            {currentList.map(user => (
              <FollowListItem 
                key={user.id} 
                user={user} 
                type={activeTab} // 탭 종류 전달
                onActionClick={handleActionClick}
                styles={styles} 
              />
            ))}
          </div>
        ) : (
          <div className={styles.noDataMessage}>
            {activeTab === TABS.FOLLOWERS ? '현재 팔로워가 없습니다.' : '현재 팔로우하는 사람이 없습니다.'}
          </div>
        )}
      </main>
    </div>
  );
};

export default FollowList;