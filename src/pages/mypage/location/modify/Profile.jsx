import React, { useState, useEffect, useRef} from 'react';
import { fetchUserProfile, uploadProfileImage } from '../../api/testApi';
import styles from './Profile.module.css';
import DefalutProfileImg from '../../component/DefalutProfileImg';
 
const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // 파일 입력(input type="file")에 접근하기 위한 ref 생성
    const fileInputRef = useRef(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await fetchUserProfile();
                setProfile(data);
            } catch (error) {
                console.error("프로필 정보를 불러오는 데 실패했습니다. ")
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, []);

    // "프로필 사진 수정하기" 버튼 클릭 시 숨겨진 파일 입력 필드를 여는 함수
    const handleEditButtonClick = () => {
        fileInputRef.current.click(); 
    };

    // ✅ 파일이 선택되었을 때 호출될 함수 (API 호출 로직 추가)
    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];

        // 선택된 파일이 없거나 유효하지 않으면 종료
        if (!selectedFile) {
            return;
        }

        setLoading(true); // 업로드 시작 시 로딩 상태 설정

        try {
            // ✅ 파일 업로드 API 호출
            // 이 함수는 백엔드로 파일을 전송하고, 성공 시 업데이트된 프로필 정보나
            // 새로운 이미지 URL을 반환한다고 가정
            const response = await uploadProfileImage(selectedFile); 
            
            // API 응답에서 새 이미지 URL을 추출하여 프로필 상태 업데이트
            const newImageUrl = response.profileImageUrl; 
            
            setProfile(prevProfile => ({
                ...prevProfile,
                profileImageUrl: newImageUrl, // 새 이미지 URL로 업데이트
            }));
            
            alert("프로필 사진이 성공적으로 수정되었습니다.");

        } catch (error) {
            console.error("프로필 사진 업로드에 실패했습니다.", error);
            alert("프로필 사진 업로드에 실패했습니다.");
        } finally {
            setLoading(false); // 로딩 상태 해제
            // 파일 선택 후 동일 파일을 다시 선택할 수 있도록 input 값을 초기화
            event.target.value = null; 
        }
    };


    if (loading) {
        return <p>로딩 중 .. </p>;
    }

    if(!profile) {
        return <p>포로필 정보를 찾을 수 없습니다.</p>;
    }

    return (
    <div className={styles.userProfileContainer}>
        
        {/* 프로필 사진 및 파일 입력 */}
        <div className={styles.profileImageSection}> 
            <div className={styles.profileIconPlaceholder}>
                {profile.profileImageUrl ? (
                    <img src={profile.profileImageUrl} alt="Profile" className={styles.profileImage}/>
                ) : (
                    <DefalutProfileImg/>
                )}
            </div>

            {/* 숨겨진 파일 입력 필드: 실제 파일 선택 창을 띄우는 역할 */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" // 이미지 파일만 선택 가능하도록 제한
                style={{ display: 'none' }} // 화면에 보이지 않도록 숨김
            />
        </div>
        
        <div className={styles.statsContainer}>

            {/* 이름 */}
            <h2 className={styles.userName}>{profile.name || "이름 정보 없음"}</h2>

            {/* 이메일 */}
            <p className={styles.userEmail}>{profile.email || "이메일 정보 없음"}</p>

            {/* 프로필 사진 수정하기 버튼 */}
            <button 
                className={styles.editProfileImageButton} 
                onClick={handleEditButtonClick} // 버튼 클릭 시 파일 입력 필드 트리거
            > 
                프로필 사진 수정하기
            </button>

        </div>
    </div>
  );
};

export default UserProfile;