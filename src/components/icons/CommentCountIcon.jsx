// 댓글 + 숫자 컴포넌트 페이지 (최종 로직) 
// 컴포넌트 사용하실 때 해당 파일을 렌더링해주시면 됩니다. 
import React from 'react';
import CommentIcon from './CommentIcon'; 

// 기본 크기 정의 
const defaultIconSize = 12;

const CommentCountIcon = ({ 
    commentCount = 0, 
    size = defaultIconSize,
    activeTextColor = '#39A2A5',
    defaultTextColor = '#797A79',
    fontSize = '12px', 
    ...restProps            
}) => {
    const hasComments = commentCount > 0;
    
    // 댓글 개수에 따라 아이콘 색상 결정
    const iconColor = hasComments ? activeTextColor : defaultTextColor;
    const textColor = hasComments ? activeTextColor : defaultTextColor;

    return (
        <div 
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            {...restProps}
        >
            <CommentIcon color={iconColor} size={size} /> 
            
            {/* 댓글 개수 표시 */}
            <span style={{ 
                color: textColor,
                fontSize: fontSize,
                fontWeight: '500'
            }}>
                {commentCount}
            </span>
        </div>
    );
};

CommentCountIcon.displayName = 'CommentCountIcon'; // 컴포넌트 이름 

export default CommentCountIcon;