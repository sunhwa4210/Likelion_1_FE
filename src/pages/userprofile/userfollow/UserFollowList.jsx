// ==== 타사용자 팔로워/팔로우 목록 페이지 ====
// 1. 타 사용자 팔로우/팔로워 목록을 보여줌 
// 2. 팔로잉 취소나 팔로우 버튼은 없음. 오직 view만 

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // 🚨 useParams 추가
import UserFollowListItem from './UserFollowListItem';
import { useModal } from "../../../components/Modal/ModalProvider";
import { useAuth } from '../../../contexts/AuthContext'; // 🚨 useAuth import (인증 토큰 사용)
import styles from './UserFollowList.module.css';

const TABS = {
    FOLLOWERS: 'followers',
    FOLLOWING: 'followings', // 🚨 URL 경로와 일치하도록 'following' -> 'followings'로 수정
};

// TODO: 실제 JWT 토큰 또는 토큰을 가져오는 로직으로 대체 필요 
const BASE_URL = "https://cross-note.com";


const UserFollowList = () => {
    // 🚨 useAuth에서 accessToken을 가져와 사용
    const { accessToken, authLoading } = useAuth();
    // 🚨 useParams를 사용하여 userId와 type을 URL에서 가져옴
    const { userId, type } = useParams(); 
    
    // URL에서 가져온 userId를 숫자로 변환
    const targetUserId = Number(userId);

    const { open } = useModal();
    const navigate = useNavigate();

    // 1. 상태 관리
    // 🚨 초기 activeTab을 URL의 type (followers/followings)으로 설정
    // 만약 URL type이 유효하지 않으면 기본값 TABS.FOLLOWERS 사용
    const initialTab = (type === TABS.FOLLOWERS || type === TABS.FOLLOWING) ? type : TABS.FOLLOWERS;
    const [activeTab, setActiveTab] = useState(initialTab);
    
    const [followersList, setFollowersList] = useState([]);
    const [followingList, setFollowingList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 공통 API 요청 헤더
    const authHeaders = { 'Authorization': `Bearer ${accessToken}` };


    // 2. 데이터 가져오기 (useEffect)
    useEffect(() => {
        // 🚨 유효성 검사: 타겟 ID가 없거나, 인증 상태 로딩 중이거나, 토큰이 없을 때 중지
        if (authLoading || !targetUserId || !accessToken) {
             if (!authLoading && !targetUserId) setError("유효하지 않은 사용자 ID입니다.");
             if (!authLoading && !accessToken) setError("로그인이 필요합니다.");
             setIsLoading(false);
             return;
        }

        const fetchFollowList = async () => {
            setIsLoading(true);
            setError(null);

            // 4번: 팔로잉 목록 API: /api/users/{targetId}/followings
            const followingUrl = `${BASE_URL}/api/users/${targetUserId}/followings`;
            // 5번: 팔로워 목록 API: /api/users/{targetId}/followers
            const followersUrl = `${BASE_URL}/api/users/${targetUserId}/followers`;

            try {
                const [followingRes, followersRes] = await Promise.all([
                    axios.get(followingUrl, { headers: authHeaders }),
                    axios.get(followersUrl, { headers: authHeaders }),
                ]);

                // 4번 API 응답: users 배열을 팔로잉 목록으로 설정
                setFollowingList(followingRes.data.users || []); 
                // 5번 API 응답: users 배열을 팔로워 목록으로 설정
                setFollowersList(followersRes.data.users || []); 

            } catch (err) {
                console.error("팔로우/팔로워 목록을 불러오는 중 오류 발생:", err);
                // 🚨 에러 처리 시 서버 메시지를 포함하는 것이 좋습니다.
                const serverMsg = err.response?.data?.message || "목록을 불러오는 데 실패했습니다.";
                setError(serverMsg);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFollowList();
    }, [targetUserId, accessToken, authLoading]); // 🚨 의존성 배열 수정

    // 탭 클릭 핸들러
    const handleTabClick = (tab) => {
        setActiveTab(tab);
        // 🚨 탭 변경 시 URL 경로도 함께 변경하여 뒤로가기/새로고침 시 상태 유지
        // 타겟 유저 프로필 페이지와 같은 구조를 사용합니다.
        navigate(`/user/${targetUserId}/${tab}`, { replace: true });
    };

    // ... (기존 handleActionClick)
    const handleActionClick = () => {
        console.log("타 사용자 목록 페이지에서는 목록 내 액션 버튼이 비활성화됩니다.");
    }
    
    // ... (기존 currentList, isLoading, error 처리)
    const currentList = activeTab === TABS.FOLLOWERS ? followersList : followingList;

    if (isLoading) {
        return <div className={styles.loadingMessage}>목록을 불러오는 중...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    return (
        <div className={styles.followPageContainer}>
            
            {/* 탭 네비게이션 시작 */}
            <div className={styles.tabNavigation}>
                {/* '팔로워' 탭 */}
                <div 
                    className={`${styles.tabItem} ${activeTab === TABS.FOLLOWERS ? styles.active : ''}`}
                    onClick={() => handleTabClick(TABS.FOLLOWERS)}
                >
                    팔로워 ({followersList.length})
                </div>
                {/* '팔로잉' 탭 */}
                <div 
                    className={`${styles.tabItem} ${activeTab === TABS.FOLLOWING ? styles.active : ''}`}
                    onClick={() => handleTabClick(TABS.FOLLOWING)}
                >
                    팔로잉 ({followingList.length})
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
                            <UserFollowListItem 
                                key={user.userId} 
                                user={user} 
                                type={activeTab} 
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

export default UserFollowList;