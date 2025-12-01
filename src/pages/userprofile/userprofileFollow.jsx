// ===== 타 사용자 프로필 페이지 =====
// 1. 타 사용자 프로필 정보 불러오기 
// 2. 팔로우 버튼 로직 
// 3. 타 사용자 칼럼 정보 불러오기 

import React, {useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from '../../components/Header/Header';
import Globalheader from "../../components/atoms/Header/header";
import UserProfile from '../mypage/UserProfile';
import CalumItem from "../mypage/location/calum/CalumItem";
import styles from './userprofileFollow.module.css';
import { useAuth } from '../../contexts/AuthContext';

const BASE_URL = "https://cross-note.com"; // API 기본 URL 설정 

// === API 연결 시 수정 부분 === 
export default function UserprofileFollow () {
    const { accessToken, logout, authLoading } = useAuth(); 
    const navigate = useNavigate();

    // 1. 상태 정의
    const [profileData, setProfileData] = useState(null); 
    const [columns, setColumns] = useState([]); 
    const [isFollowing, setIsFollowing] = useState(false); 
    const [isLoading, setIsLoading] = useState(true);

    // 팔로워/팔로잉 카운트를 별도로 관리하여 프로필 데이터에 통합함 
    const [followersCount, setFollowersCount] = useState(0); 
    const [followingsCount, setFollowingsCount] = useState(0);
    const [error, setError] = useState(null); // 에러 상태 추가

    const { userId } = useParams(); // URL 경로에서 :userId 값을 가져옴
    const targetUserId = Number(userId) > 0 ? Number(userId) : null;

    // 3. accessToken이 변경될 때마다 헤더를 구성
    const authHeaders = {
        'Authorization': `Bearer ${accessToken}`
    };

    // 2. 데이터 가져오기 (useEffect)
    useEffect(() => {
        console.log("🔥 useEffect 실행됨", { authLoading, targetUserId });
  console.log("🔥 targetUserId:", targetUserId);
  console.log("🔥 authLoading:", authLoading);
  

  if (authLoading || !targetUserId) return;

        // 1차 가드: 인증 상태 확인 중이거나, 유효한 ID가 없을 때 대기
        if (authLoading || !targetUserId) {
            if (!targetUserId && !authLoading) {
                // targetUserId가 null/0일 경우 로딩을 해제하고 에러 메시지 설정
                setIsLoading(false);
                setError("유효하지 않은 사용자 ID입니다.");
            }
            return;
        }

        const fetchUserData = async () => {
            if (!accessToken) { 
                setIsLoading(false);
                // 로그인 페이지로 리디렉션하거나 오류 메시지를 표시할 수 있습니다.
                console.error("인증 토큰이 없어 데이터를 불러올 수 없습니다.");
                return;
            }

            setIsLoading(true);
            setError(null); // 새로운 요청 시작 시 에러 초기화

            try {
                // 1. 프로필 + 칼럼 데이터 호출: /api/users/{targetUserId}/profile
                // 2. 팔로우 상태/카운트 호출: /api/users/{targetUserId}/follow-status
                const [profileRes, followStatusRes] = await Promise.all([
                    axios.get(`${BASE_URL}/api/users/${targetUserId}/profile`, { headers: authHeaders }),
                    axios.get(`${BASE_URL}/api/users/${targetUserId}/follow-status`, { headers: authHeaders })
                ]);
                
                const apiData = profileRes.data;
                console.log("칼럼 데이터 items 길이:", apiData.items ? apiData.items.length : 0); // 👈 길이 확인


                const followStatusData = followStatusRes.data;

                // 💡 디버깅을 위해 응답 데이터 구조 확인 (필드 이름 일치 여부 확인)
                console.log("✅ 프로필 API 응답 데이터:", apiData);
                console.log("✅ 팔로우 상태 API 응답 데이터:", followStatusData);

                // 🚨 핵심 수정: 응답 데이터의 유효성 검사 및 안전한 접근
                if (!apiData || !apiData.name || !followStatusData) {
                    throw new Error("서버 응답 데이터가 불완전합니다. 필드 이름을 확인하세요.");
                }
            

                // 응답 데이터 필드 매핑 및 통합
                const mappedProfile = {
                    id: apiData.userId,
                    name: apiData.name,
                    email: apiData.email,
                    profileImageUrl: apiData.profileImageUrl || null, 
                    followers: followStatusData.followerCount || 0, 
                    following: followStatusData.followingCount || 0, 
                };

                setProfileData(mappedProfile);
                setFollowersCount(followStatusData.followerCount);
                setFollowingsCount(followStatusData.followingCount);
                setIsFollowing(followStatusData.following || false); // 초기 팔로우 상태 설정
                setColumns(apiData.items || []); // 칼럼 목록 설정
                
            } catch (err) {
                console.error("데이터를 불러오는 중 오류 발생:", err);
                const serverMsg = err.response?.data?.message || "프로필 정보를 불러올 수 없습니다.";
                setError(serverMsg); // 사용자에게 보여줄 에러 메시지 설정
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [targetUserId, accessToken, authLoading]);

    
    // 3. 팔로우/언팔로우 버튼 클릭 이벤트 핸들러 (API 호출 포함)
    const handleFollowClick = async () => {
        const newIsFollowing = !isFollowing;
        
        // UI를 먼저 변경하여 사용자 경험 개선
        setIsFollowing(newIsFollowing); 
        
        // 팔로워 수 로컬 업데이트 (Userprofile 컴포넌트에도 반영하기 위해 profileData 업데이트)
        const newFollowersCount = followersCount + (newIsFollowing ? 1 : -1);
        setFollowersCount(newFollowersCount);
        setProfileData(prev => prev ? ({
            ...prev,
            followers: newFollowersCount
        }) : null);

        try {
            if (newIsFollowing) {
                // 3. 팔로우 API 호출: POST /api/users/{targetUserId}/follow
                await axios.post(
                    `${BASE_URL}/api/users/${targetUserId}/follow`, 
                    {},
                    { headers: authHeaders }
                );
            } else {
                // 4. 언팔로우 API 호출: DELETE /api/users/{targetUserId}/follow
                await axios.delete(
                    `${BASE_URL}/api/users/${targetUserId}/follow`, 
                    { headers: authHeaders }
                );
            }
            
            console.log(`${profileData?.name} 님을 ${newIsFollowing ? '팔로우' : '언팔로우'}했습니다. (API 성공)`);
            
        } catch (error) {
            console.error("팔로우/언팔로우 처리 중 오류 발생:", error);
            
            // Rollback (롤백): 오류 발생 시 상태를 원래대로 복원
            setIsFollowing(!newIsFollowing); 
            setFollowersCount(followersCount); // 원래 값으로 복원
            setProfileData(prev => prev ? ({
                ...prev,
                followers: followersCount
            }) : null);
            
            const errorMessage = error.response?.data?.message || "팔로우/언팔로우 실패";
            alert(errorMessage);
        }
    };

    // 4. 팔로워/팔로잉 목록 페이지 이동 핸들러
    const handleListClick = (type) => { // 'followers' 또는 'followings'
        if (targetUserId) {
            // 예: /user/123/followers 또는 /user/123/followings 경로로 이동
            navigate(`/user/${targetUserId}/${type}`);
        } else {
            alert("사용자 ID를 찾을 수 없습니다.");
        }
    };

    // 로딩 및 오류 처리
    if (isLoading || authLoading) { // 👈 수정: authLoading이 true면 무조건 로딩 중으로 표시
        return (
            <div className="app-wrapper"><Globalheader/><Header title="프로필"/><main className="content"><p>프로필 정보를 불러오는 중입니다...</p></main></div>
        );
    }

    // 5. 오류 및 데이터 없음 처리
    if (error) {
        return (
             <div className="app-wrapper"><Globalheader/><Header title="프로필"/><main className="content"><p>오류 발생: {error}</p></main></div>
        );
    }
    
    if (!profileData) {
        return (
            <div className="app-wrapper"><Globalheader/><Header title="프로필"/><main className="content"><p>프로필 정보를 찾을 수 없습니다.</p></main></div>
        );
    }

    const { name, profileImageUrl } = profileData; // 프로필 이미지 URL도 가져옴

    // 카멜 케이스 적용을 위해 추가  
    const followButtonClasses = `${styles.followButton} ${
        isFollowing ? styles.following : styles.follow
    }`;

    console.log("🔥 최상위 렌더 실행됨");
console.log("🔥 columns 값:", columns);



  return (
    <div className="app-wrapper">
      {/* 헤더 컴포넌트 */}
      <Globalheader/>
      <Header title="프로필"/>

      {/* 본문 */}
      <main className="content">
        {/* 여기에 페이지 콘텐츠 전부 */}
        <UserProfile 
            data={profileData}
            onFollowListClick={handleListClick}

        />

        <div className={styles.followContainer}> 
            <button 
                onClick={handleFollowClick}
                className={followButtonClasses}
            >
                {isFollowing ? '현재 팔로우 중' : '팔로우'}
            </button>
        </div>

        <h3 className={styles.columnTitle}>
            {name} 님이 작성한 칼럼
        </h3>
        
        <div className={styles.contentListContainer}>
          {columns.map((item) => (
            <CalumItem key={item.columnId} data={item} /> 
          ))}
        </div>
        
      </main>

    </div>
  );
}
