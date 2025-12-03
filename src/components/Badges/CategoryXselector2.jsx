// CategoryXselector2.jsx (최종 수정 버전)

import React from 'react'; // useState, useEffect 제거
import CategoryButton from './CategoryButton';
import { COLOR_THEMES } from './CategoryData';

// ⭐ selectedLabels prop을 직접 사용합니다.
const CategoryXselector2 = ({ 
    categoriesToDisplay, 
    removableMode, 
    viewOnly, 
    onCategoriesChange, 
    fontSize,
    selectedLabels: externalSelectedLabels = [] // ⬅️ 외부 상태에 전적으로 의존
}) => { 
    
    // 내부 상태(useState)와 동기화 useEffect 제거. 
    // 선택 상태는 부모가 제공하는 externalSelectedLabels에 전적으로 의존합니다.
    
    const handleCategoryClick = (clickedLabel) => {
        
        // viewOnly 모드일 때는 클릭 로직 실행을 막음
        if (viewOnly) {
            return; 
        }
        
        // 현재 선택 상태는 부모로부터 받은 externalSelectedLabels 입니다.
        const isSelected = externalSelectedLabels.includes(clickedLabel);
        
        let newSelectedLabels;
        if (isSelected) {
            // 제거: 클릭된 레이블을 제외
            newSelectedLabels = externalSelectedLabels.filter(
                (label) => label !== clickedLabel
            );
        } else {
            // 추가: 클릭된 레이블을 추가
            newSelectedLabels = [...externalSelectedLabels, clickedLabel];
        }

        console.log('1️⃣ CXS2 -> 클릭 후 전달:', newSelectedLabels); // ⬅️ 디버그 로그
        
        if (onCategoriesChange) {
            onCategoriesChange(newSelectedLabels); // ⬅️ 부모에게 변경된 배열 전달
        }
    };

    return (
        <div>
            <div className="field-badge-list" style={{display:'flex', gap:'6px'}}>
            {(categoriesToDisplay || []).map((item) => (
                <CategoryButton
                    key={item.label}
                    label={item.label}
                    // ⭐️ isSelected 판단 시 externalSelectedLabels를 직접 사용합니다.
                    isSelected={externalSelectedLabels.includes(item.label)} 
                    onClick={() => handleCategoryClick(item.label)}
                    activeTheme={COLOR_THEMES[item.colorKey]}
                    displayMode={removableMode ? "removable" : "default"}
                    fontSize={fontSize} 
                />
            ))}
            </div>
        </div>
    );
};

export default CategoryXselector2;