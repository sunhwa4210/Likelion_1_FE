// 댓글 아이콘 컴포넌트 
import React from 'react';

const CommentIcon = ({ 
    size = 12, 
    color = undefined, 
    ...restProps 
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size} 
      height={size} 
      viewBox="0 0 10 10"
      fill="none"
      {...restProps} 
    >
      <path 
        d="M9.5 6.5C9.5 6.76522 9.39464 7.01957 9.20711 7.20711C9.01957 7.39464 8.76522 7.5 8.5 7.5H2.5L0.5 9.5V1.5C0.5 1.23478 0.605357 0.98043 0.792893 0.792893C0.98043 0.605357 1.23478 0.5 1.5 0.5H8.5C8.76522 0.5 9.01957 0.605357 9.20711 0.792893C9.39464 0.98043 9.5 1.23478 9.5 1.5V6.5Z" 
        stroke={color} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

CommentIcon.displayName = 'CommentIcon'; // 컴포넌트 이름 

export default CommentIcon;