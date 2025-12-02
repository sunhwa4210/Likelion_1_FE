import React, { useState, useRef, useEffect } from 'react';
import styles from './Profile.module.css';
import DefalutProfileImg from '../../component/DefalutProfileImg';
import { useAuth } from '../../../../contexts/AuthContext';
 
// ✅ Props으로 name과 email도 받도록 수정하고, 불필요한 useEffect를 제거합니다.
const Profile = ({ profileImageUrl, onImageUpdate, name, email, onProfileUpdate }) => {
    
    const { accessToken } = useAuth();

    // 파일 업로드/취소 시에만 사용되는 로딩 상태
    const [loading, setLoading] = useState(false); 
    // ✅ 이름과 이메일 상태 (입력 필드 관리)
    const [userName, setUserName] = useState(name);
    const [userEmail, setUserEmail] = useState(email);

    useEffect(() => {
        setUserName(name);
        setUserEmail(email);
    }, [name, email]);

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

        if (!accessToken) { // ✅ 토큰 확인
            alert("로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.");
            return;
        }

        setLoading(true);

        try {
            // 1. FormData 객체 생성
            const formData = new FormData();
            formData.append('file', selectedFile); 

            // 2. 파일 업로드 API 호출 (URL만 반환하는 엔드포인트)
            // TODO: 실제 파일 업로드 API 엔드포인트로 변경하세요.
            const uploadResponse = await fetch('/api/upload/image', { 
                method: 'POST',
                // TODO: 인증 토큰이 필요한 경우 추가
                headers: { 'Authorization': `Bearer ${accessToken}` },
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error('파일 업로드에 실패했습니다.');
            }

            const result = await uploadResponse.json();
            
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
/*
    const handleUpdateProfile = async () => {
        if (!accessToken) { // ✅ 토큰 확인
            alert("로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.");
            return;
        }
        
        setLoading(true);
        try {
            const body = {};
            
            // 이름이나 이메일이 변경되었을 경우에만 body에 추가
            if (userName !== name) {
                body.name = userName;
            }
            if (userEmail !== email) {
                body.email = userEmail;
            }
            
            // 변경사항이 없으면 API 호출 생략
            if (Object.keys(body).length === 0) {
                alert("변경된 정보가 없습니다.");
                setLoading(false);
                return;
            }

            // API 호출 (PUT /api/mypage/profile)
            const updateResponse = await fetch('/api/mypage/profile', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}` // ✅ 인증 토큰 헤더 추가
                },
                body: JSON.stringify(body),
            });

            if (!updateResponse.ok) {
                const errorData = await updateResponse.json();
                throw new Error(errorData.message || '프로필 정보 수정에 실패했습니다.');
            }

            alert("프로필 정보(이름/이메일)가 성공적으로 수정되었습니다.");
            
            // 상위 컴포넌트의 데이터 리프레시 (InformModify의 GET 요청 재실행 또는 상태 직접 업데이트)
            if (onProfileUpdate) {
                onProfileUpdate({ name: userName, email: userEmail });
            }

        } catch (error) {
            console.error("정보 수정 실패:", error);
            alert(`정보 수정에 실패했습니다: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
*/
    if (loading) {
        return <p>로딩 중 .. </p>;
    }
    
    // name, email 정보가 null이더라도 렌더링은 진행 (Props으로 받기 때문)

    return (
        // ✅ 전체 컨테이너를 가로 배치 (flex-direction: row)
    <div className={styles.userProfileContainer}>
        
        {/* 1. 프로필 사진 영역 */}
            <div className={styles.profileIconPlaceholder}>
                {profileImageUrl ? (
                    <img src={profileImageUrl} alt="Profile" className={styles.profileImage}/>
                ) : (
                    <DefalutProfileImg/>
                )}
            </div>

            {/* 숨겨진 파일 입력 필드 (위치 변경 없음) */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*"
                style={{ display: 'none' }}
            />
        
        {/* 2. 사용자 정보 및 버튼 영역 */}
        {/* ✅ statsContainer 클래스를 사용자 정보 텍스트와 버튼을 포함하도록 사용 */}
        <div className={styles.statsContainer}>

            <input 
                    type="text"
                    className={styles.userNameInput} 
                    value={userName || ''} 
                    onChange={(e) => setUserName(e.target.value)} 
                />
                
                {/* ✅ 이메일 입력 필드 */}
                <input 
                    type="email"
                    className={styles.userEmailInput}
                    value={userEmail || ''}
                    onChange={(e) => setUserEmail(e.target.value)}
                />

                {/* 프로필 사진 수정 버튼 */}
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