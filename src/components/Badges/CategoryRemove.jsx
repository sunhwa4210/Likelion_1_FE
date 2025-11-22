import React, {useState, useEffect }from 'react';
import { COLOR_THEMES } from './CategoryData'; 
import CategoryButton from './CategoryButton';

const CategoryRemove = ({ selectedBadges, onBadgeChange }) => {

    const [selectedCategories, setSelectedCategories] = useState(() => {
        return (selectedBadges || []).map(item => item.label);
    });
    
    // 외부 prop 변경 (InformModify에서 상태 변경) 시 내부 상태 갱신
    useEffect(() => {
        const updatedCategories = (selectedBadges || []).map(item => item.label);
        setSelectedCategories(updatedCategories);
    }, [selectedBadges]);


    const handleCategoryClick = (clickedLabel) => {
        
        const isSelected = selectedCategories.includes(clickedLabel);
        
        let newSelectedCategories;
        
        if (isSelected) {
            // 클릭된 뱃지가 현재 선택 상태라면, 제거(선택 취소)
            newSelectedCategories = selectedCategories.filter(
                (label) => label !== clickedLabel
            );
        } else {
            // 클릭된 뱃지가 선택되지 않은 상태라면, 추가 (제거 모드에서는 보통 사용되지 않음)
            newSelectedCategories = [...selectedCategories, clickedLabel];
        }

        setSelectedCategories(newSelectedCategories);
        
        // 남은 라벨 배열을 사용하여, 기존 selectedBadges 객체 배열에서 필터링
        const newBadges = selectedBadges.filter(badge => 
            newSelectedCategories.includes(badge.label)
        );

        // 상위 컴포넌트 (InformModify) 상태 업데이트
        onBadgeChange(newBadges);
    };

    return (
        <div className="field-badge-list">
        {(selectedBadges || []).map((item) => (
            <CategoryButton
                key={item.label}
                label={item.label}
                // 활성화 여부를 내부 상태로 판단
                isSelected={selectedCategories.includes(item.label)} 
                onClick={() => handleCategoryClick(item.label)}
                // colorKey에 해당하는 테마 사용, 없으면 default 사용
                activeTheme={COLOR_THEMES[item.colorKey] || COLOR_THEMES.default}
                // displayMode="removable"로 고정하여 X 버튼이 나오도록 함
                displayMode={"removable"} 
            />
        ))}
        </div>
    );
};

export default CategoryRemove;