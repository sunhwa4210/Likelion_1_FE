import React from 'react';
import styles from './FollowList.module.css'; 
import DefalutProfileImg from '../../profile/DefalutProfileImg';

const FollowListItem = ({ user, type, onActionClick }) => {

  const renderActionButton = () => {
    if (type === 'following') {
      return (
        <button 
            className="action-button cancel" 
            onClick={() => onActionClick(user.id, user.name)}
        >
          취소
        </button>
      );
    } 
    
    if (type === 'followers' && user.isFollowingBack === false) {
    }

    return null; // 기본적으로 버튼 없음 (팔로워 목록의 경우)
  };

  return (
    <div className={styles.followListItem}>

      <div className={styles.profileIcon}>
        <DefalutProfileImg />
      </div> 
      
      <div className={styles.userInfo}>
        <div className={styles.userName}>{user.name}</div>
        <div className={styles.userEmail}>{user.email}</div>
      </div>

      <div className={styles.actionArea}>
        {renderActionButton()}
      </div>
    </div>
  );
};

export default FollowListItem;