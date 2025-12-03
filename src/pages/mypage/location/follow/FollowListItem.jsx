import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FollowList.module.css'; 
import DefalutProfileImg from '../../component/DefalutProfileImg';

const FollowListItem = ({ user, type, onActionClick }) => {

  const navigate = useNavigate();

  const handleItemClick = () => {
        // [TODO] 프로필 페이지 경로 설정 (임시 경로: /profile/{userId})
        // 사용자 ID를 기반으로 해당 사용자의 프로필 페이지로 이동합니다.
        // 나중에 정확한 경로를 알려주시면 이 부분을 수정할 수 있습니다.
        navigate(`/users/${user.userId}`);
    };

  const renderActionButton = () => {
        if (type === 'following') {
            return (
                <button
                    className={`${styles.actionButton} ${styles.cancelButton}`}
                    // 버튼 클릭 이벤트는 프로필 이동을 막기 위해 이벤트 버블링을 막아야 합니다.
                    onClick={(e) => {
                        e.stopPropagation(); // 5. 부모 항목 클릭 이벤트(handleItemClick) 방지
                        onActionClick(user.userId, user.name);
                    }}
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
    <div className={styles.followListItem} onClick={handleItemClick}>

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