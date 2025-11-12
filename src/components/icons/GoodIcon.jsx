// 좋아요 아이콘 컴포넌트 
import React from 'react';

// 좋아요 아이콘만 
const defaultProps = {
    size: 12,
    defaultColor: '#797A79', 
    activeColor: '#D93D3E',
    isLiked: false,        
};

const GoodIcon = ({ 
    size = defaultProps.size,
    defaultColor = defaultProps.defaultColor,
    activeColor = defaultProps.activeColor,
    isLiked = defaultProps.isLiked,
    ...restProps 
}) => {
    // isLiked 상태에 따른 stroke와 fill 색상 결정
    const finalStrokeColor = isLiked ? 'none' : defaultColor;
    const finalFillColor = isLiked ? activeColor : 'none';

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size} 
            viewBox="0 0 12 11"
            fill="none"
            {...restProps} 
        >
            <path 
                d="M10.1456 1.30591C9.89027 1.05042 9.58705 0.847736 9.25332 0.709455C8.91959 0.571174 8.56189 0.5 8.20065 0.5C7.8394 0.5 7.4817 0.571174 7.14797 0.709455C6.81424 0.847736 6.51102 1.05042 6.25565 1.30591L5.72565 1.83591L5.19565 1.30591C4.6798 0.790067 3.98016 0.500267 3.25065 0.500267C2.52113 0.500267 1.82149 0.790067 1.30565 1.30591C0.789799 1.82176 0.5 2.5214 0.5 3.25091C0.5 3.98043 0.789799 4.68007 1.30565 5.19591L1.83565 5.72591L5.72565 9.61591L9.61565 5.72591L10.1456 5.19591C10.4011 4.94054 10.6038 4.63732 10.7421 4.30359C10.8804 3.96986 10.9516 3.61216 10.9516 3.25091C10.9516 2.88967 10.8804 2.53196 10.7421 2.19824C10.6038 1.86451 10.4011 1.56129 10.1456 1.30591Z"
                stroke={finalStrokeColor}
                strokeLinecap="round" 
                strokeLinejoin="round"
                fill={finalFillColor}
            />
        </svg>
    );
};

GoodIcon.displayName = 'GoodIcon';

export default GoodIcon;