import React, { useState, useEffect } from "react";
// import Globalheader from '../../../../components/atoms/header/header';
import Header from '../../../../components/Header/Header';
import Profile from './Profile';
import FieldInter from "./FieldInter";
import FieldPro from "./FieldPro";
import Level from "./Level";
import ModifyButton from "./ModifyButton";
import { categories } from "../../../../components/Badges/CategoryData";
import { mockUserProfile } from "../../mock/testUser";


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
            // ✅ 로딩 지연 효과 (실제 환경에서는 제거)
            await new Promise(resolve => setTimeout(resolve, 500)); 
            
            // ✅ 더미 데이터 사용
            const mockData = mockUserProfile;

            const initialInterBadgesData = mapLabelsToBadges(mockData.interBadgeLabels);
            const initialProBadgesData = mapLabelsToBadges(mockData.proBadgeLabels);

            // ✅ Level 설정 (더미 데이터 사용)
            setInitialLevel(mockData.Level);
            setSelectedLevel(mockData.Level);
            
            // FieldInter
            setInitialInterBadges(initialInterBadgesData);
            setSelectedInterBadges(initialInterBadgesData);

            // FieldPro
            setInitialProBadges(initialProBadgesData);
            setSelectedProBadges(initialProBadgesData);

            setIsLoading(false);
        };
        loadAllData();
    }, []);

    // 수정 여부 판단 
    // Level 수정 여부
    const isLevelModified = selectedLevel !== initialLevel && selectedLevel !== null;
    
    // FieldInter 수정 여부 (배열 내용 비교)
    const isInterModified = !areBadgesEqual(selectedInterBadges, initialInterBadges);

    // FieldPro 수정 여부 (배열 내용 비교)
    const isProModified = !areBadgesEqual(selectedProBadges, initialProBadges);

    // 최종 수정 여부
    const isModified = isLevelModified || isInterModified || isProModified;

    // 최종 저장 함수
    const handleSave = () => {
        if (!isModified) return;
        
        console.log("--- 최종 수정하기 클릭 ---");
        console.log("새 레벨:", selectedLevel);
        console.log("새 관심분야:", selectedInterBadges.map(b => b.label));
        console.log("새 전문분야:", selectedProBadges.map(b => b.label));
        
        // ✅ API 호출 로직
        
        // 저장 성공 후 초기값 업데이트
        setInitialLevel(selectedLevel);
        setInitialInterBadges(selectedInterBadges);
        setInitialProBadges(selectedProBadges);
    };

    if (isLoading) {
         return <div className="app-wrapper"><p>모든 정보 로딩 중...</p></div>;
    }

  return (
    <div className="app-wrapper">
      {/* 헤더 컴포넌트 */}
      {/*<Globalheader/>*/}
      <Header title="정보 수정" />

      {/* 본문 */}
      <main className="content">
        {/* 여기에 페이지 콘텐츠 전부 */}
        <Profile />       

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