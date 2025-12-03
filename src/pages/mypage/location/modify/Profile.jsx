import React, { useState, useRef, useEffect } from 'react';
import styles from './Profile.module.css';
import DefalutProfileImg from '../../component/DefalutProfileImg';
import { useAuth } from '../../../../contexts/AuthContext';
 
// ✅ Prop으로 name, email, 그리고 변경 핸들러를 받도록 수정
const Profile = ({ 
    profileImageUrl, 
    onImageUpdate, 
    name, 
    email,
    provider, // InformModify에서 추가된 provider prop 추가
    onNameChange, // 이름 변경 핸들러 추가
    onEmailChange // 이메일 변경 핸들러 추가
}) => {
    
    const { accessToken } = useAuth();
    // ✅ InformModify에서 상태를 관리하므로, Profile 내부의 이름/이메일 상태는 제거하거나 props와 동기화만 합니다.
    // 여기서는 props을 직접 사용하고, input onChange 시 상위 상태를 업데이트합니다.

    // 파일 업로드/취소 시에만 사용되는 로딩 상태
    const [loading, setLoading] = useState(false); 
    
    // 파일 입력(input type="file")에 접근하기 위한 ref 생성
    const fileInputRef = useRef(null);

    // "프로필 사진 수정하기" 버튼 클릭 시 숨겨진 파일 입력 필드를 여는 함수
    const handleEditButtonClick = () => {
        fileInputRef.current.click(); 
    };
    
    // 소셜 로그인 사용자는 이름/이메일 수정 불가 (Provider가 'LOCAL'이 아닐 경우)
    const isSocialUser = provider && provider !== 'LOCAL';

    // 파일이 선택되었을 때 호출될 함수 (API 호출 로직)
    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];

        if (!selectedFile) return;

        if (!accessToken) { 
            alert("로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.");
            return;
        }

        setLoading(true);

        try {
            // 1. FormData 객체 생성
            const formData = new FormData();
            formData.append('file', selectedFile); 

            // 2. 파일 업로드 API 호출 (Content-Type 수동 설정 없이 Authorization만 추가)
            const uploadResponse = await fetch('/api/upload/image', { 
                method: 'POST',
                headers: { 'Authorization': `Bearer ${accessToken}` },
                body: formData,
            });

            if (!uploadResponse.ok) {
                const errorText = await uploadResponse.text();
                console.error('파일 업로드 API 실패 응답:', uploadResponse.status, errorText);
                throw new Error('파일 업로드에 실패했습니다.');
            }

            const result = await uploadResponse.json();
            
            // 서버 응답에서 새로운 URL을 추출
            const newImageUrl = result.profileImageUrl; 
            
            // 3. 상위 컴포넌트(InformModify)의 상태를 업데이트 (이미지 변경 감지용)
            onImageUpdate(newImageUrl); 
            
            alert("사진이 임시로 변경되었습니다. 하단 '수정하기' 버튼을 눌러야 최종 저장됩니다.");

        } catch (error) {
            console.error("프로필 사진 업로드에 실패했습니다.", error);
            alert(`프로필 사진 업로드에 실패했습니다: ${error.message}`);
        } finally {
            setLoading(false);
            event.target.value = null; 
        }
    };

    if (loading) {
        return <p>로딩 중 .. </p>;
    }
    
    return (
        <div className={styles.userProfileContainer}>
        
        {/* 1. 프로필 사진 영역 */}
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
        
        {/* 2. 사용자 정보 및 버튼 영역 */}
        <div className={styles.statsContainer}>
    {/* 2-1. 이름 입력 필드 */}
                <input 
                    type="text"
                    className={styles.userNameInput} 
                    value={name || ''} 
                    onChange={(e) => onNameChange(e.target.value)}
                    disabled={isSocialUser}
                    title={isSocialUser ? "소셜 로그인은 이름 수정 불가" : ""}
                />
                
                {/* 2-2. 이메일 입력 필드 */}
                <input 
                    type="email"
                    className={styles.userEmailInput}
                    value={email || ''}
                    onChange={(e) => onEmailChange(e.target.value)}
                    disabled={isSocialUser}
                    title={isSocialUser ? "소셜 로그인은 이메일 수정 불가" : ""}
                />

                {/* 2-3. 프로필 사진 수정 버튼 (이제 이메일 아래에 위치함) */}
                <div className={styles.editProfileImageButtonContainer}>
                    <button 
                        className={styles.editProfileImageButton} 
                        onClick={handleEditButtonClick}
                    >
                        프로필 사진 수정하기
                    </button>
    </div>
</div>
        </div>
    );
};

export default Profile;