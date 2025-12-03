import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import GlobalHeader from "../../../../components/atoms/header/GlobalHeader";
import Header from '../../../../components/Header/Header';
import Profile from './Profile';
import FieldInter from "./FieldInter";
import FieldPro from "./FieldPro";
import Level from "./Level";
import ModifyButton from "./ModifyButton";
import { categories } from "../../../../components/Badges/CategoryData";
import { useAuth } from "../../../../contexts/AuthContext";


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
    const { accessToken, updateUserProfile } = useAuth();
    const navigate = useNavigate();

    // 모든 컴포넌트의 상태를 통합 관리
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    // Profile 관련 상태 추가 (name, email도 여기서 관리)
    const [initialName, setInitialName] = useState(null);
    const [initialEmail, setInitialEmail] = useState(null);
    const [selectedName, setSelectedName] = useState(null); 
    const [selectedEmail, setSelectedEmail] = useState(null);

    const [initialProfileImageUrl, setInitialProfileImageUrl] = useState(null);
    const [selectedProfileImageUrl, setSelectedProfileImageUrl] = useState(null); 
    
    // ✅ provider 상태 추가
    const [provider, setProvider] = useState(null); 

    // Level 상태
    const [initialLevel, setInitialLevel] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);

    // FieldInter 상태
    const [initialInterBadges, setInitialInterBadges] = useState([]);
    const [selectedInterBadges, setSelectedInterBadges] = useState([]);
    
    // FieldPro 상태
    const [initialProBadges, setInitialProBadges] = useState([]);
    const [selectedProBadges, setSelectedProBadges] = useState([]);


    // 모든 초기 데이터 로딩 (useCallback으로 분리)
    const loadAllData = useCallback(async () => {
        if (!accessToken) {
            console.warn("Access Token이 없어 사용자 정보를 불러올 수 없습니다.");
            setIsLoading(false); 
            return;
        }

        setIsLoading(true);

        // 1. GET API 호출
        try {
            const response = await fetch('/api/mypage/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            if (!response.ok) {
                const status = response.status;
                console.error(`API 응답 실패 상태 코드: ${status}`);
                throw new Error(`사용자 정보를 불러오는 데 실패했습니다. (상태: ${status})`);
            }

            // 2. 서버로부터 받은 실제 데이터 (성공 응답)
            const realData = await response.json();
            
            // 3. 데이터 사용
            const initialInterBadgesData = mapLabelsToBadges(realData.interestNames || []);
            const initialProBadgesData = mapLabelsToBadges(realData.expertiseNames || []);

            // Profile 데이터 설정
            setInitialName(realData.name);
            setSelectedName(realData.name); // ✅ 선택된 이름 초기화
            setInitialEmail(realData.email);
            setSelectedEmail(realData.email); // ✅ 선택된 이메일 초기화
            setInitialProfileImageUrl(realData.profileImageUrl);
            setSelectedProfileImageUrl(realData.profileImageUrl);

            // ✅ provider 상태 설정 (서버 응답에 realData.provider가 포함되어야 함)
            setProvider(realData.provider || 'LOCAL'); 

            // Level 설정
            setInitialLevel(realData.curationLevel === 'LEVEL_1' ? 'A' : 'B');
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
    }, [accessToken]); // accessToken이 변경될 때만 loadAllData 함수를 재생성

    // 초기 로딩 시 loadAllData 호출
    useEffect(() => {
        loadAllData();
    }, [loadAllData]);

    // 수정 여부 판단 
    // 이름/이메일 수정 여부 (소셜 사용자는 수정이 불가하므로 provider 확인 로직은 Profile 컴포넌트에서 처리)
    const isNameModified = selectedName !== initialName && selectedName !== null;
    const isEmailModified = selectedEmail !== initialEmail && selectedEmail !== null;
    
    // Level 수정 여부
    const isLevelModified = selectedLevel !== initialLevel && selectedLevel !== null;
    
    // FieldInter/Pro 수정 여부
    const isInterModified = !areBadgesEqual(selectedInterBadges, initialInterBadges);
    const isProModified = !areBadgesEqual(selectedProBadges, initialProBadges);
    
    // Profile Image 수정 여부
    const isProfileImageModified = selectedProfileImageUrl !== initialProfileImageUrl;

    // 최종 수정 여부
    const isModified = isNameModified || isEmailModified || isLevelModified || isInterModified || isProModified || isProfileImageModified;

    // 최종 저장 함수
    const handleSave = async () => { 
        if (!isModified || !accessToken) return;
        
        setIsSaving(true);

        const curationLevelValue = selectedLevel === 'A' ? 'LEVEL_1' : 'LEVEL_2'; // 👈 **[수정] 선언 누락 수정**

    // 🔑 뱃지 배열 변환: 뱃지 객체 배열을 레이블 문자열 배열로 변환
    const interestNamesArray = selectedInterBadges.map(b => b.label);     // 👈 **[수정] 선언 누락 수정**
    const expertiseNamesArray = selectedProBadges.map(b => b.label);

        // 1. API로 전송할 데이터 준비 (변경된 모든 필드 포함)
       const updatedData = {
            // ✅ 수정된 상태 (selectedName, selectedEmail) 전송
            name: selectedName, 
            email: selectedEmail, 
            curationLevel: curationLevelValue, 
            interestNames: interestNamesArray,
            expertiseNames: expertiseNamesArray,
            profileImageUrl: selectedProfileImageUrl,
            // 명세서에 있지만 현재 화면에 없는 필드는 제외: password, passwordCheck, birthDate
        };
        
        console.log("--- 최종 수정하기 클릭 ---");
        console.log("전송 데이터:", updatedData);
        
        // 2. API 호출 로직 (PUT /api/mypage/profile)
        try {
            const response = await fetch('/api/mypage/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}` 
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                // alert(`프로필이 성공적으로 수정되었습니다.`);
                
                // 3. 저장 성공 후 초기값 업데이트 (수정 상태를 리셋)
                setInitialName(selectedName); // ✅ 초기 이름 업데이트
                setInitialEmail(selectedEmail); // ✅ 초기 이메일 업데이트
                setInitialLevel(selectedLevel);
                setInitialInterBadges(selectedInterBadges);
                setInitialProBadges(selectedProBadges);
                setInitialProfileImageUrl(selectedProfileImageUrl);

                if (updateUserProfile) {
                    updateUserProfile({
                        name: selectedName, 
                        email: selectedEmail, 
                        profileImageUrl: selectedProfileImageUrl, 
                        // ✅ 수정된 모든 필드를 Context에 업데이트
                        curationLevel: curationLevelValue,
                        interestNames: interestNamesArray,
                        expertiseNames: expertiseNamesArray,
                    });
                }

                navigate('/mypage');
                
            } else {
                const errorText = await response.text();
                console.error("정보 수정 실패:", response.status, errorText);
                alert(`정보 수정에 실패했습니다. (상태 코드: ${response.status})`);
            }
        } catch (error) {
            console.error("정보 수정 API 호출 중 네트워크 오류:", error);
            alert("네트워크 오류가 발생했습니다.");
        } finally {
            setIsSaving(false); // ✅ 저장 종료
        }
    };

    if (isLoading) {
        return <div className="app-wrapper"><p>모든 정보 로딩 중...</p></div>;
    }

    return (
        <div className="app-wrapper">
            <GlobalHeader/>
            <Header title="정보 수정" />

            <main className="content">
                {/* Profile 컴포넌트에 provider prop 전달 */}
                <Profile 
                    name={selectedName} // ✅ 수정 중인 이름 전달
                    email={selectedEmail} // ✅ 수정 중인 이메일 전달
                    profileImageUrl={selectedProfileImageUrl} 
                    onImageUpdate={setSelectedProfileImageUrl} 
                    provider={provider} 
                    onNameChange={setSelectedName} // ✅ 이름 변경 핸들러 전달
                    onEmailChange={setSelectedEmail} // ✅ 이메일 변경 핸들러 전달
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