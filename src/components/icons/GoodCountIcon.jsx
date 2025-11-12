// 좋아요 + 숫자 컴포넌트 (최종 로직) 
// 컴포넌트 사용하실 때 해당 파일을 렌더링해주시면 됩니다. 

import React, { useState } from 'react';
import GoodIcon from './GoodIcon';

const defaultTextSize = '12px';

const GoodCountIcon = ({ 
    initialLikes = 0,
    iconSize = 12,
    activeColor = '#D93D3E', 
    defaultColor = '#797A79',
    textSize = defaultTextSize, // 텍스트 크기 제어
    ...restProps 
}) => {
    const [isClicked, setClicked] = useState(false);
    const [likeCount, setLikeCount] = useState(initialLikes);
    
    const textColor = isClicked ? activeColor : defaultColor;

    const handleClick = () => {
        const nextIsClicked = !isClicked;
        setClicked(nextIsClicked);

        // 좋아요 로직
        if (nextIsClicked) {
            setLikeCount(prevCount => prevCount + 1);
        } else {
            setLikeCount(prevCount => prevCount - 1);
        }
        // 이 로직에서 서버 API 호출 등을 추가할 생각 
    };

    return (
        <div 
            style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
            }}
            onClick={handleClick} 
            {...restProps} 
        >
            <GoodIcon
                size={iconSize}
                defaultColor={defaultColor}
                activeColor={activeColor}
                isLiked={isClicked}
            />

            {/* 좋아요 횟수 표시 */}
            <span style={{ 
                fontSize: textSize, 
                fontWeight: '500', 
                color: textColor 
            }}>
                {likeCount}
            </span>
        </div>
    );
};

GoodCountIcon.displayName = 'GoodCountIcon';

export default GoodCountIcon;