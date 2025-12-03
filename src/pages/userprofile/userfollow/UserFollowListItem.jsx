import React from 'react';
import styles from './UserFollowList.module.css'; 
import DefalutProfileImg from '../../mypage/component/DefalutProfileImg';

const UserFollowListItem = ({ user, type, onActionClick }) => {

    // 타 사용자 목록 페이지에서는 팔로우/언팔로우 버튼이 불필요하므로 제거
    const renderActionButton = () => {
        return null; 
    };

    return (
        <div className={styles.followListItem}>
        {/* 🚨 수정: user.profileImageUrl이 있다면 사용하도록 수정 */}
            <div className={styles.profileIcon}>
                {user.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt={`${user.name} 프로필`} className={styles.profileImage} />
                ) : (
                    <DefalutProfileImg />
                )}
            </div> 
            
            <div className={styles.userInfo}>
                <div className={styles.userName}>{user.name}</div>
                <div className={styles.userEmail}>{user.email || '이메일 정보 없음'}</div>
            </div>

            <div className={styles.actionArea}>
                {renderActionButton()}
            </div>
        </div>
    );
};

export default UserFollowListItem;