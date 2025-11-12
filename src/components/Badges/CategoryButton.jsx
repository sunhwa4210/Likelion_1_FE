// 개별 버튼 UI
// 버튼 클릭했을 때의 변화를 작성한 페이지입니다. 
import React from "react";

const CategoryButton = ({ label, isSelected, onClick, activeTheme, displayMode }) => {
    
    // 기본 버튼 색깔 (선택되지 않았을 경우) 
    const defaultBg = 'var(--gray-0, #f7f7f7)'; // 배경색 
    const defaultText = '#191919'; // 텍스트

    // 활성화된 테마 속성 추출
    const activeBG = activeTheme?.backgroundColor;
    const activeBorder = activeTheme?.borderColor;
     // 폰트 크기 정의 
    const defaultFontSize = '8px';
    const selectedFontSize = '6px';

    // 패딩 크기 정의 
    const defaultPadding = '6px 12px'; 
    const selectedPadding = '6px 8px';

    // 아이콘 동적 색상 
    const svgStrokeColor = isSelected ? activeBorder : defaultText;
 
    const style = {
        // isSelected 값에 따라 색깔 변화 
        backgroundColor: isSelected ? activeBG : defaultBg,
        color: isSelected ? activeBorder : defaultText,
        border: isSelected 
                ? `${activeTheme?.borderThick || '1px solid'} ${activeBorder}`
                : `0`, // 비활성화 시 테두리 없음

        fontWeight: isSelected ? '600' : '500',
        padding: isSelected ? selectedPadding : defaultPadding,
        fontSize: isSelected ? selectedFontSize : defaultFontSize,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '3px',
        borderRadius: '24px',
    };

    // X 아이콘을 svg 코드로 바꿨습니다. (원래는 텍스트로 x 표시)
    const svgIcon = (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="5" height="5" viewBox="0 0 5 5" fill="none">
            <path d="M0.5 0.5L4.5 4.5" stroke={svgStrokeColor} stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4.5 0.5L0.5 4.5" stroke={svgStrokeColor} stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );

    return (
        <button style={style} onClick={onClick}>
            {/* displayMode가 'X'이고 isSelected가 true일 때만 'X' 표시 */}
            {isSelected && displayMode === 'removable' && (
                <div className="X" style={{ margin: '0', padding: '0', display: 'flex' }}>
                    {svgIcon}
                </div>
            )}
            {label}
        </button>
    );
};

export default CategoryButton;