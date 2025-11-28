import React, {useState, useEffect } from 'react';
import CategoryButton from '../../../../components/Badges/CategoryButton';
import { COLOR_THEMES } from '../../../../components/Badges/CategoryData';

const FieldPro = ({ selectedBadges, onBadgeChange}) => {
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
            // 이미 선택된 상태라면, 해당 뱃지를 제거(선택 취소)
            newSelectedCategories = selectedCategories.filter(
                (label) => label !== clickedLabel
            );
        } else {
            // 선택되지 않은 상태라면, 추가 (제거 모드에서는 사용되지 않음)
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
                | 전문 분야
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
                        gap: '7px', /* 뱃지들 사이의 간격 */
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
                        // colorKey에 해당하는 테마 사용, 없으면 default 사용
                        activeTheme={COLOR_THEMES[item.colorKey] || COLOR_THEMES.default}
                        // displayMode="removable"로 고정하여 X 버튼이 나오도록 함
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

export default FieldPro;