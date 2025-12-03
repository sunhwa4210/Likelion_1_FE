import React, {useState, useEffect } from 'react';
import CategoryButton from '../../../../components/Badges/CategoryButton';
import { COLOR_THEMES } from '../../../../components/Badges/CategoryData';

const FieldInter = ({ selectedBadges, onBadgeChange}) => {
    const [selectedCategories, setSelectedCategories] = useState(() => {
        return (selectedBadges || []).map(item => item.label);
    });
    
    // 외부 prop 변경 (InformModify에서 상태 변경) 시 내부 상태 갱신
    useEffect(() => {
        const updatedCategories = (selectedBadges || []).map(item => item.label);
        // 객체 배열 비교가 아닌 라벨 배열 비교를 통해 불필요한 갱신 방지
        const currentCategories = selectedCategories.map(label => label).sort();
        if (updatedCategories.sort().join(',') !== currentCategories.join(',')) {
             setSelectedCategories(updatedCategories);
        }
    }, [selectedBadges]);


    const handleCategoryClick = (clickedLabel) => {
        
        const isSelected = selectedCategories.includes(clickedLabel);
    
        if (isSelected) {
            // 1. 내부 라벨 상태에서 클릭된 라벨을 제외합니다.
            const newSelectedCategories = selectedCategories.filter(
                (label) => label !== clickedLabel
            );
            
            // 내부 상태 업데이트
            setSelectedCategories(newSelectedCategories);
            
            // 2. 상위 컴포넌트의 객체 배열(selectedBadges)을 필터링하여, 
            //    새로운 라벨 배열(newSelectedCategories)에 포함된 객체만 남깁니다.
            const newBadges = selectedBadges.filter(badge => 
                newSelectedCategories.includes(badge.label)
            );

            // 3. 상위 컴포넌트 상태 업데이트
            onBadgeChange(newBadges);
        } else {
            // 이 컴포넌트에서는 추가 플로우가 없으므로 별도 처리하지 않습니다.
            // console.warn("삭제 모드에서 선택되지 않은 뱃지 클릭됨:", clickedLabel);
        }
    }

    return (
        <div style={{ 
            padding: '20px 14px',
            marginLeft: '-10px',
        }}>
            <h2 style={{ 
                fontSize: '14px', 
                fontWeight: '500', 
                marginBottom: '15px',
                color: 'var(--gray-50, #474747)',
            }}>
                | 관심 분야
            </h2>

            <div
                className="field-badge-list"
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    
                    padding: '8px 10px',
                    border: '1px solid var(--gray-20, #C6C8C6)',
                    borderRadius: '6px',
                    backgroundColor: '#FFF'

                }}
            >
                <div 
                    className="field-badge-list"
                    style={{
                        display: 'flex', /* 자식 요소(뱃지 버튼)들을 수평으로 나열 */
                        flexWrap: 'wrap', /* 뱃지가 많아지면 줄 바꿈 허용 */
                        gap: '7px', /* 뱃지들 사이의 간격  */
                        width: '100%'

                    }}
                >
                {(selectedBadges || []).map((item) => (
                    <CategoryButton
                        key={item.label}
                        label={item.label}
                        // 활성화 여부를 내부 상태(제거 로직의 결과)로 판단
                        isSelected={selectedCategories.includes(item.label)} 
                        onClick={() => handleCategoryClick(item.label)}
                        activeTheme={COLOR_THEMES[item.colorKey] || COLOR_THEMES.default}
                        displayMode={"removable"}
                    />
                ))}
                </div>

                {/* 4. 선택된 뱃지가 없을 때 메시지 */}
                {selectedBadges.length === 0 && (
                    <p style={{ 
                        padding: '12.5px', 
                        margin: '0',
                        display: 'flex',
                        borderRadius: '6px',
                        backgroundColor: '#FFF'
                    }}>
                    </p>
                )}
            </div>
        </div>
    );
};

export default FieldInter;