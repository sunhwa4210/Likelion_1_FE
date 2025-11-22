import React from "react";
import Header from '../../components/Header/Header';
// import Globalheader from '../../components/atoms/header/header'
import UserProfile from '../mypage/UserProfile';
import { DummyCalums } from "../mypage/location/calum/dummyCalum";
import CalumItem from "../mypage/location/calum/CalumItem";
import styles from './userprofileFollow.module.css';

// 더미 데이터 
const userData = {
    userName: "김슈니", 
    isFollowing: false, 
};

// === API 연결 시 수정 부분 === 
export default function UserprofileFollow () {
    const questions = DummyCalums; // 현재는 더미 데이터 사용

    const { userName } = userData;

    // 팔로우 버튼 상태 및 클릭 이벤트 핸들러
    const [isFollowing, setIsFollowing] = React.useState(userData.isFollowing);

    const handleFollowClick = () => {
        // 실제 API 연결 시, 팔로우/언팔로우 API 호출 로직 필요 
        setIsFollowing(!isFollowing);
        console.log(`${userName} 님을 ${isFollowing ? '언팔로우' : '팔로우'}했습니다.`);
    };

    // 카멜 케이스 적용을 위해 추가  
    const followButtonClasses = `${styles.followButton} ${
        isFollowing ? styles.following : styles.follow
    }`;


  return (
    <div className="app-wrapper">
      {/* 헤더 컴포넌트 */}
      {/*<Globalheader/>*}
      <Header title="프로필"/>

      {/* 본문 */}
      <main className="content">
        {/* 여기에 페이지 콘텐츠 전부 */}
        <UserProfile/>

        <div className={styles.followContainer}> 
            <button 
                onClick={handleFollowClick}
                className={followButtonClasses}
            >
                {isFollowing ? '현재 팔로우 중' : '팔로우'}
            </button>
        </div>

        <h3 className={styles.columnTitle}>
            {userName} 님이 작성한 칼럼
        </h3>
        
        <div className={styles.contentListContainer}>
          {DummyCalums.map((item) => (
          <CalumItem key={item.id} data={item} /> 
        ))}
        </div>
        
      </main>

    </div>
  );
}
