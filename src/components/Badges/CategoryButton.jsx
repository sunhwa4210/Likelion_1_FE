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
    const activeBorderThick = activeTheme?.borderThick || '1px solid'; // 테두리 두께 추출 

    // 폰트 크기 정의 (고정)
    const fixedFontSize = '10px'; 

    // 조건부 패딩 정의 (클릭 전/후의 버튼 크기를 동일하게 하는 핵심 로직)
    const iconSpace = 5; // X 아이콘이 차지하는 공간
    const basePadding = 10; // 기본 좌우 패딩 값
    
    // 1. X 버튼이 없을 때: 텍스트를 중앙에 오게 하기 위한 기본 패딩 
    const paddingUnselected = `6px ${basePadding}px`; // Top/Bottom 6px, Left/Right 10px
    
    // 2. X 버튼이 있을 때: 총 너비 20px를 유지하며 좌우 패딩 비율만 조정함 
    // 좌측 패딩을 IconSpace(5px) 만큼 늘리고, 우측 패딩을 IconSpace(5px) 만큼 줄임
    const paddingLeftSelected = basePadding + iconSpace; // 15px
    const paddingRightSelected = basePadding - iconSpace; // 5px
    
    // Top, Right, Bottom, Left 순서
    const paddingSelected = `6px ${paddingRightSelected}px 6px ${paddingLeftSelected}px`; // 6px 5px 6px 15px

    // 아이콘 동적 색상 변화 
    const svgStrokeColor = isSelected ? activeBorder : defaultText;
 
    const style = {
        // 배경색: removable 모드에서 활성화 시 투명하게 설정
        backgroundColor: isSelected 
            ? (displayMode === 'removable' ? 'transparent' : activeBG) 
            : defaultBg,

        color: isSelected ? activeBorder : defaultText,

        // 테두리: 크기 고정을 위해 비활성화 시 투명한 테두리 유지
        border: isSelected 
                ? `${activeBorderThick} ${activeBorder}`
                : `${activeBorderThick} transparent`, // 비활성화 시 두께는 유지, 색상만 투명

        fontWeight: isSelected ? '600' : '500',

        padding: isSelected && displayMode === 'removable'
            ? paddingSelected // X 버튼이 나올 때 (비대칭)
            : paddingUnselected, // X 버튼이 안 나오거나 비활성화일 때 (대칭)
            
        fontSize: fixedFontSize,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative', 
        borderRadius: '24px',
    };

    // X 아이콘
    const svgIcon = (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="5" height="5" viewBox="0 0 5 5" fill="none">
            <path d="M0.5 0.5L4.5 4.5" stroke={svgStrokeColor} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.5 0.5L0.5 4.5" stroke={svgStrokeColor} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );

    return (
        <button style={style} onClick={onClick}>
        {/* displayMode가 'removable'일 때 아이콘 렌더링 */}
        {displayMode === 'removable' && (
            <div 
                className="X" 
                style={{ 
                    position: 'absolute',
                        left: '7px', 
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: isSelected ? 'flex' : 'none', 
                        margin: '0', 
                        padding: '0',
                }}
            >
                {svgIcon}
            </div>
        )}
            {label}
        </button>
    );
};

export default CategoryButton;