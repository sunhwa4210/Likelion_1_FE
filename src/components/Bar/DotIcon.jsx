// 도트(.) 아이콘 

import React from 'react';

// color prop을 받아 색깔을 변경 가능 
const DotIcon = ({ color = '#ACADAC', size = 4 }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 4 4" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginRight: '5px' }} // 텍스트와의 간격 조정
    >
        <circle cx="2" cy="2" r="2" fill={color} />
    </svg>
);

export default DotIcon;