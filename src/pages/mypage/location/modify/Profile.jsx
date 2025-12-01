// Profile.jsx

import React, { useState, useRef } from 'react';
import styles from './Profile.module.css';
import DefalutProfileImg from '../../component/DefalutProfileImg';
 
// ✅ Props으로 name과 email도 받도록 수정하고, 불필요한 useEffect를 제거합니다.
const UserProfile = ({ profileImageUrl, onImageUpdate, name, email }) => {
    
    // 파일 업로드/취소 시에만 사용되는 로딩 상태
    const [loading, setLoading] = useState(false); 
    
    // 파일 입력(input type="file")에 접근하기 위한 ref 생성
    const fileInputRef = useRef(null);

    // "프로필 사진 수정하기" 버튼 클릭 시 숨겨진 파일 입력 필드를 여는 함수
    const handleEditButtonClick = () => {
        fileInputRef.current.click(); 
    };

    // 파일이 선택되었을 때 호출될 함수 (API 호출 로직)
    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];

        if (!selectedFile) return;

        setLoading(true);

        try {
            // 1. FormData 객체 생성
            const formData = new FormData();
            // TODO: 백엔드에서 요구하는 파일 필드명으로 'file'을 변경해야 할 수 있습니다.
            formData.append('file', selectedFile); 

            // 2. 파일 업로드 API 호출 (URL만 반환하는 엔드포인트)
            // TODO: 실제 파일 업로드 API 엔드포인트로 변경하세요.
            const uploadResponse = await fetch('/api/upload/image', { 
                method: 'POST',
                // TODO: 인증 토큰이 필요한 경우 추가
                // headers: { 'Authorization': `Bearer ${yourAuthToken}` },
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error('파일 업로드에 실패했습니다.');
            }

            const result = await uploadResponse.json();
            
            // TODO: API 응답 구조에 맞게 필드명 확인
            const newImageUrl = result.profileImageUrl; 
            
            // 3. 상위 컴포넌트(InformModify)의 상태를 업데이트
            onImageUpdate(newImageUrl); 
            
            alert("사진이 임시로 변경되었습니다. 하단 '수정하기' 버튼을 눌러야 최종 저장됩니다.");

        } catch (error) {
            console.error("프로필 사진 업로드에 실패했습니다.", error);
            alert("프로필 사진 업로드에 실패했습니다.");
        } finally {
            setLoading(false);
            event.target.value = null; 
        }
    };


    if (loading) {
        return <p>로딩 중 .. </p>;
    }
    
    // name, email 정보가 null이더라도 렌더링은 진행 (Props으로 받기 때문)

    return (
    <div className={styles.userProfileContainer}>
        
        {/* 프로필 사진 및 파일 입력 */}
        <div className={styles.profileImageSection}> 
            <div className={styles.profileIconPlaceholder}>
                {profileImageUrl ? (
                    <img src={profileImageUrl} alt="Profile" className={styles.profileImage}/>
                ) : (
                    <DefalutProfileImg/>
                )}
            </div>

            {/* 숨겨진 파일 입력 필드 */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*"
                style={{ display: 'none' }}
            />
        </div>
        
        <div className={styles.statsContainer}>

            {/* 이름 (Props 사용) */}
            <h2 className={styles.userName}>{name || "이름 정보 없음"}</h2>

            {/* 이메일 (Props 사용) */}
            <p className={styles.userEmail}>{email || "이메일 정보 없음"}</p>

            {/* 프로필 사진 수정하기 버튼 */}
            <button 
                className={styles.editProfileImageButton} 
                onClick={handleEditButtonClick}
            > 
                프로필 사진 수정하기
            </button>

        </div>
    </div>
  );
};

export default UserProfile;