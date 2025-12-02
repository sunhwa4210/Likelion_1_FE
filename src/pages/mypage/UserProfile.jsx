import React, { useState, useEffect } from 'react';
import styles from './UserProfile.module.css';
import DefalutProfileImg from './component/DefalutProfileImg';

const UserProfile = ({data: profile, onFollowListClick}) => {

    const handleListClick = onFollowListClick || (() => console.log('onFollowListClick prop이 전달되지 않았습니다.'));

    if(!profile) {
        return <p>포로필 정보를 찾을 수 없습니다.</p>;
    }
 
    return (
    <div className={styles.userProfileContainer}>
        
        {/* 프로필 사진 */}
        <div className={styles.profileIconPlaceholder}>
            {profile.profileImageUrl ? (
                <img src={profile.profileImageUrl} alt="Profile" className={styles.profileImage}/>
            ) : (
                <DefalutProfileImg/>
            )}
        </div>
    
        <div className={styles.statsContainer}>

            {/* 이름 */}
            <h2 className={styles.userName}>{profile.name}</h2>

            {/* 이메일 */}
            <p className={styles.userEmail}>{profile.email}</p>

            <div className={styles.item}>
                {/* 팔로워 */}
                <div className={styles.statItem}
                    onClick={() => handleListClick('followers')}
                >
                    <span className={styles.statLabel}>팔로워</span>
                    <span className={styles.statValue}>{profile.followers}</span>
                </div>

                {/* 팔로잉 */}
                <div className={styles.statItem}
                    onClick={() => handleListClick('followings')}
                >
                    <span className={styles.statLabel}>팔로잉</span>
                    <span className={styles.statValue}>{profile.following}</span>
                </div>

            </div>

        </div>
    </div>
  );
};

export default UserProfile;