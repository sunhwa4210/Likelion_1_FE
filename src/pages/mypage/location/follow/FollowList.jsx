import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FollowListItem from './FollowListItem';
import { useModal } from '../../../../components/Modal/ModalProvider';
import { presets } from '../../../../components/Modal/presets';
import { useAuth } from '../../../../contexts/AuthContext';
import apiClient from './apiClient';

// 탭 정의
const TABS = {
  FOLLOWERS: 'followers',
  FOLLOWING: 'following',
};

const FollowList = ({ styles }) => {
  const { open } = useModal();
  const navigate = useNavigate();
  // ✅ URL 파라미터에서 현재 보고 있는 대상 유저 ID 가져오기

  const { userId: targetUserId, listType } = useParams(); 
  const { user } = useAuth();

  const initialTab = listType === TABS.FOLLOWING ? TABS.FOLLOWING : TABS.FOLLOWERS;
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 목록 데이터를 API에서 가져오는 함수
  const loadLists = async (tab = activeTab) => {
    // 대상 ID가 없으면 호출하지 않음 (라우팅 설정에 따라 targetUserId는 항상 존재한다고 가정)
    if (!targetUserId) {
        setIsLoading(false);
        return; 
    }

    setIsLoading(true);
    try {
      const endpoint = tab === TABS.FOLLOWERS 
        ? `/users/${targetUserId}/followers` // GET /api/users/{targetId}/followers
        : `/users/${targetUserId}/followings`; // GET /api/users/{targetId}/followings
      
      const res = await apiClient.get(endpoint);
      const data = res.data.users || [];
      
      if (tab === TABS.FOLLOWERS) {
        setFollowersList(data);
      } else {
        setFollowingList(data);
      }

    } catch (error) {
      console.error(`Error fetching ${tab} list for user ${targetUserId}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 및 탭/대상 유저 ID 변경 시 목록 로드
  useEffect(() => {
    loadLists(activeTab);
  }, [activeTab, targetUserId]); // targetUserId를 의존성 배열에 추가

  // 탭 클릭 핸들러
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // 현재 활성화된 탭에 따라 목록 데이터를 선택
  const currentList = activeTab === TABS.FOLLOWERS ? followersList : followingList;

  // 모달을 사용하는 새로운 액션 핸들러 (팔로잉 취소 로직)
  const handleActionClick = async (userIdToUnfollow, userName) => {
    // 💡 팔로잉 탭에서만 '언팔로우' 액션 처리
    if (activeTab === TABS.FOLLOWING) {
      // 1. 팔로잉 취소 모달 열기
      const res = await open(presets.confirmUnfollow({ name: userName })); 

      // 2. 모달 결과 확인
      if (res === 'delete') {
        try {
          // ✅ API 연동: 언팔로우 API 호출 (DELETE /api/users/{targetUserId}/follow)
          const apiRes = await apiClient.delete(`/users/${userIdToUnfollow}/follow`);

          if (apiRes.status === 200) { 
             console.log(`[API SUCCESS] ${userIdToUnfollow}번 유저 언팔로우 성공`);
             
             // 3. API 성공 후, 목록에서 해당 유저 제거하여 UI 업데이트
             // API 응답 필드가 'userId'이므로, 필터링 시 user.userId 사용
             setFollowingList(prevList => prevList.filter(user => user.userId !== userIdToUnfollow)); 
          }
        } catch (error) {
          console.error(`[API FAIL] 언팔로우 API 호출 실패: ${error}`);
          // 실패 메시지 표시 등 추가 처리
        }
      }
    } 
    // 팔로워 탭에서의 액션 (예: 팔로우)이 있다면 여기에 구현
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
        {isLoading ? (
          <div className={styles.loadingMessage}>목록을 불러오는 중...</div>
        ) : currentList.length > 0 ? (
          <div className={styles.followList}>
            {currentList.map(user => (
              <FollowListItem 
                // 💡 API 응답의 유저 ID 필드가 'userId'일 경우에 맞춰 key와 user prop 사용
                key={user.userId} 
                user={user} 
                type={activeTab} // 탭 종류 전달
                // FollowListItem으로 user.userId와 user.name을 전달해야 함
                onActionClick={() => handleActionClick(user.userId, user.name)} 
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