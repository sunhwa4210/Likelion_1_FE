// 북마크 아이콘 컴포넌트
import React, { useState } from "react";

// 기본값 정의
const defaultProps = {
    size: 20,
    defaultColor: '#191919', 
    activeColor: '#FFBF00', 
    strokeWidth: 2,          
};

const BookmarkIcon = ({ 
    size = defaultProps.size,
    defaultColor = defaultProps.defaultColor,
    activeColor = defaultProps.activeColor,
    strokeWidth = defaultProps.strokeWidth,
    initialState = false, // 외부에서 isClicked의 초기 상태를 제어할 수 있도록 추가  
    ...restProps 
}) => {
    const [isClicked, setClicked] = useState(initialState);

    const finalStrokeColor = isClicked ? 'none' : defaultColor;
    const finalFillColor = isClicked ? activeColor : 'none';

    const handleClick = () => {
        setClicked(prev => !prev);
    };

    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={size} 
            height={size} 
            viewBox="0 0 20 20" 
            fill="none"
            onClick={handleClick} 
            {...restProps} 
        >
            <path 
                d="M15.8337 17.5L10.0003 13.3333L4.16699 17.5V4.16667C4.16699 3.72464 4.34259 3.30072 4.65515 2.98816C4.96771 2.67559 5.39163 2.5 5.83366 2.5H14.167C14.609 2.5 15.0329 2.67559 15.3455 2.98816C15.6581 3.30072 15.8337 3.72464 15.8337 4.16667V17.5Z" 
                stroke={finalStrokeColor}
                strokeWidth={strokeWidth} 
                strokeLinecap="round" 
                strokeLinejoin="round"
                fill={finalFillColor}
            />
        </svg>
    );
};

BookmarkIcon.displayName = 'BookmarkIcon'; // 컴포넌트 이름 

export default BookmarkIcon;