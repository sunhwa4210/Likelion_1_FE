import React, { useState, useEffect } from "react";
import Globalheader from "../../../../components/atoms/Header/header";
import Header from '../../../../components/Header/Header';
import Profile from './Profile';
import FieldInter from "./FieldInter";
import FieldPro from "./FieldPro";
import Level from "./Level";
import ModifyButton from "./ModifyButton";
import { categories } from "../../../../components/Badges/CategoryData";


// 뱃지 라벨 배열을 뱃지 객체 배열 (label, colorKey 포함)로 변환하는 헬퍼 함수
const mapLabelsToBadges = (labels) => {
    return labels.map(label => {
        // CategoryData에서 일치하는 뱃지 객체를 찾음 
        const categoryMatch = categories.find(item => item.label === label);
        
        // 일치하는 colorKey를 반환하고, 찾지 못하면 'default' 폴백을 사용 
        const colorKey = categoryMatch 
            ? categoryMatch.colorKey 
            : 'default'; 

        return { label, colorKey };
    });
};


// 배열 비교 함수 (두 배열의 내용이 동일한지 확인)
const areBadgesEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    const labels1 = arr1.map(item => item.label).sort();
    const labels2 = arr2.map(item => item.label).sort();
    return labels1.every((label, index) => label === labels2[index]);
};


export default function InformModify() {
    // 모든 컴포넌트의 상태를 통합 관리
    const [isLoading, setIsLoading] = useState(true);
    
    // ✅ 1. Profile 관련 상태 추가 (name, email도 여기서 관리)
    const [initialName, setInitialName] = useState(null);
    const [initialEmail, setInitialEmail] = useState(null);
    const [initialProfileImageUrl, setInitialProfileImageUrl] = useState(null);
    const [selectedProfileImageUrl, setSelectedProfileImageUrl] = useState(null); 

    // Level 상태
    const [initialLevel, setInitialLevel] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);

    // FieldInter 상태
    const [initialInterBadges, setInitialInterBadges] = useState([]);
    const [selectedInterBadges, setSelectedInterBadges] = useState([]);
    
    // FieldPro 상태
    const [initialProBadges, setInitialProBadges] = useState([]);
    const [selectedProBadges, setSelectedProBadges] = useState([]);

    // 모든 초기 데이터 로딩 
    useEffect(() => {
        const loadAllData = async () => {
            setIsLoading(true);

            // 1. ✅ GET API 호출
            try {
                const response = await fetch('/api/mypage/profile', { // 💡 실제 GET 엔드포인트로 변경
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': `Bearer ${yourAuthToken}` // 인증 토큰 필요
                    },
                });

                if (!response.ok) {
                    throw new Error("사용자 정보를 불러오는 데 실패했습니다.");
                }

                const realData = await response.json(); // ✅ 서버로부터 받은 실제 데이터
                
                // 2. Mock Data 대신 실제 데이터 사용
                const initialInterBadgesData = mapLabelsToBadges(realData.interestNames); // 필드명 확인
                const initialProBadgesData = mapLabelsToBadges(realData.expertiseNames); // 필드명 확인

                // Profile 데이터 설정
                setInitialName(realData.name);
                setInitialEmail(realData.email);
                setInitialProfileImageUrl(realData.profileImageUrl);
                setSelectedProfileImageUrl(realData.profileImageUrl);

                // Level 설정
                setInitialLevel(realData.curationLevel === 'LEVEL_1' ? 'A' : 'B'); // 💡 서버 값 -> 컴포넌트 값으로 매핑
                setSelectedLevel(realData.curationLevel === 'LEVEL_1' ? 'A' : 'B');
                
                // FieldInter/FieldPro 설정
                setInitialInterBadges(initialInterBadgesData);
                setSelectedInterBadges(initialInterBadgesData);
                setInitialProBadges(initialProBadgesData);
                setSelectedProBadges(initialProBadgesData);

            } catch (error) {
                console.error("초기 정보 로딩 오류:", error);
                alert("초기 사용자 정보를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setIsLoading(false);
            }
        };
        loadAllData();
    }, []);

    // 수정 여부 판단 
    // Level 수정 여부
    const isLevelModified = selectedLevel !== initialLevel && selectedLevel !== null;
    
    // FieldInter 수정 여부
    const isInterModified = !areBadgesEqual(selectedInterBadges, initialInterBadges);

    // FieldPro 수정 여부
    const isProModified = !areBadgesEqual(selectedProBadges, initialProBadges);
    
    // ✅ Profile Image 수정 여부
    const isProfileImageModified = selectedProfileImageUrl !== initialProfileImageUrl;

    // 최종 수정 여부
    const isModified = isLevelModified || isInterModified || isProModified || isProfileImageModified;

    // 최종 저장 함수
    const handleSave = async () => { // ✅ async 키워드 추가
        if (!isModified) return;
        
        // 1. API로 전송할 데이터 준비 (변경된 모든 필드 포함)
        const updatedData = {
            // Level: 백엔드 명세에 맞게 매핑
            curationLevel: selectedLevel === 'A' ? 'LEVEL_1' : 'LEVEL_2', 
            
            // Badges
            interestNames: selectedInterBadges.map(b => b.label),
            expertiseNames: selectedProBadges.map(b => b.label),
            
            // ✅ Profile Image URL 포함
            profileImageUrl: selectedProfileImageUrl,
            
            // ✅ 이름과 이메일은 변경 가능성이 없다고 가정하고 제외하거나 (Profile.jsx에 수정 input이 없으므로)
            // 명세에 따라 다른 필드도 함께 포함하여 보낼 수 있습니다. (현재 예시에서는 제외)
        };
        
        console.log("--- 최종 수정하기 클릭 ---");
        console.log("전송 데이터:", updatedData);
        
        // 2. ✅ API 호출 로직 (PUT /api/mypage/profile)
        try {
            const response = await fetch('/api/mypage/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${yourAuthToken}` 
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                alert(`프로필이 성공적으로 수정되었습니다.`);
                
                // 3. 저장 성공 후 초기값 업데이트 (수정 상태를 리셋)
                setInitialLevel(selectedLevel);
                setInitialInterBadges(selectedInterBadges);
                setInitialProBadges(selectedProBadges);
                setInitialProfileImageUrl(selectedProfileImageUrl); // ✅ 이미지 URL 초기값 업데이트

            } else {
                const errorText = await response.text();
                console.error("정보 수정 실패:", response.status, errorText);
                alert(`정보 수정에 실패했습니다. (상태 코드: ${response.status})`);
            }
        } catch (error) {
            console.error("정보 수정 API 호출 중 네트워크 오류:", error);
            alert("네트워크 오류가 발생했습니다.");
        }
    };

    if (isLoading) {
        return <div className="app-wrapper"><p>모든 정보 로딩 중...</p></div>;
    }

    return (
        <div className="app-wrapper">
            <Globalheader/>
            <Header title="정보 수정" />

            <main className="content">
                {/* 2. ✅ Profile 컴포넌트에 Props 전달 */}
                <Profile 
                    name={initialName} // 이름과 이메일은 변경할 수 없다고 가정하고 초기값을 전달
                    email={initialEmail}
                    profileImageUrl={selectedProfileImageUrl} // 현재 선택된 URL 전달
                    onImageUpdate={setSelectedProfileImageUrl} // 업데이트 함수 전달
                /> 

                {/* FieldInter - 상태 전달 */}
                <FieldInter 
                    selectedBadges={selectedInterBadges} 
                    onBadgeChange={setSelectedInterBadges}
                />
                        
                {/* FieldPro - 상태 전달 */}
                <FieldPro 
                    selectedBadges={selectedProBadges} 
                    onBadgeChange={setSelectedProBadges}
                />

                {/* Level 컴포넌트에 상태와 함수를 props로 전달 */}
                <Level 
                    selectedLevel={selectedLevel} 
                    handleLevelChange={setSelectedLevel}
                />
            </main>

            {/* 푸터가 필요한 화면에서만 렌더 */}
            <footer className="fixed-footer">
                <ModifyButton 
                    isActive={isModified} 
                    onSave={handleSave}
                />
            </footer>
        </div>
    );
}