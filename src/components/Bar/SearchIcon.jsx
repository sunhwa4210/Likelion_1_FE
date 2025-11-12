/* 검색 아이콘 컴포넌트 */
import React from 'react';

// width/height/stroke 등의 스타일은 부모 컴포넌트(SearchBar1.js)의 CSS에서 조정합니다.
const SearchIcon = ({ color = '#ACADAC', size = 20, ...restProps }) => (
    // SearchIcon.js의 SVG에서 돋보기 Path만 추출
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 26 26" // 돋보기 아이콘에 맞게 viewBox 조정
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        {...restProps}
    >
        {/* 돋보기 원 */}
        <path d="M18.25 22.25C21.5637 22.25 24.25 19.5637 24.25 16.25C24.25 12.9363 21.5637 10.25 18.25 10.25C14.9363 10.25 12.25 12.9363 12.25 16.25C12.25 19.5637 14.9363 22.25 18.25 22.25Z" 
            stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {/* 손잡이 */}
        <path d="M25.7498 23.7498L22.4873 20.4873" 
            stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default SearchIcon;