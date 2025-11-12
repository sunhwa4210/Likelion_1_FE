import React, { useState } from 'react';
import CategoryButton from './CategoryButton';
import { COLOR_THEMES } from './CategoryData';

// !!! viewOnly Prop 추가: 뷰어 모드(활성화 고정, 클릭 비활성화) 여부를 결정합니다.
const CategoryXselector = ({ categoriesToDisplay, removableMode, viewOnly, onCategoriesChange }) => { 
    
    // 초기 상태 설정: viewOnly 모드가 아닐 때 (선택 모드일 때)만 빈 배열로 시작
    const [selectedCategories, setSelectedCategories] = useState(() => {
        if (viewOnly) {
            // viewOnly 모드일 경우: props로 받은 카테고리를 초기 활성화 상태로 설정
            return (categoriesToDisplay || []).map(item => item.label);
        }
        // 선택 모드일 경우: 빈 배열로 시작하여 클릭으로 선택 가능하도록 
        return []; 
    });
    
    // useEffect: viewOnly 모드일 때만 외부 prop 변경에 반응하여 상태를 업데이트
    useEffect(() => {
        if (viewOnly) {
            const updatedCategories = (categoriesToDisplay || []).map(item => item.label);
            setSelectedCategories(updatedCategories);
        }
        // viewOnly가 false일 때는 내부 상태(클릭 상태)를 유지
    }, [categoriesToDisplay, viewOnly]);


    const handleCategoryClick = (clickedLabel) => {
        
        // viewOnly 모드일 때는 클릭 로직 실행을 막음
        if (viewOnly) {
            return; // 뷰어 모드에서는 클릭 이벤트 무시 (색상 고정)
        }
        
        // 나머지 클릭 로직 (선택/제거)은 viewOnly가 false일 때만 실행됨 
        const isSelected = selectedCategories.includes(clickedLabel);
        
        let newSelectedCategories;
        if (isSelected) {
            newSelectedCategories = selectedCategories.filter(
                (label) => label !== clickedLabel
            );
        } else {
            newSelectedCategories = [...selectedCategories, clickedLabel];
        }

        setSelectedCategories(newSelectedCategories);

        if (onCategoriesChange) {
            onCategoriesChange(newSelectedCategories);
        }
    };

    return (
        <div>
            <div className="field-badge-list">
            {(categoriesToDisplay || []).map((item) => (
                <CategoryButton
                    key={item.label}
                    label={item.label}
                    isSelected={selectedCategories.includes(item.label)} 
                    onClick={() => handleCategoryClick(item.label)}
                    activeTheme={COLOR_THEMES[item.colorKey]}
                    // !상위 컴포넌트에서 받은 removableMode 값이 추가됨 
                    // removableMode는 X 버튼 유무만 결정
                    displayMode={removableMode ? "removable" : "default"} 
                />
            ))}
            </div>
        </div>
    );
};

export default CategoryXselector;