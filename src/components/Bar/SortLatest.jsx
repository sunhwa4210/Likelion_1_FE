/* 검색바-최신순 아이콘 컴포넌트 */
import React from 'react';
import DotIcon from './DotIcon';

function SortLatest({ isActive, onClick }) {
    // SearchBar1.js에 정의된 .sort-option-item 및 .active 클래스를 활용
    const className = `sort-option-item ${isActive ? 'active' : ''}`;

    const dotColor = isActive ? '#39A2A5' : '#ACADAC';

    return (
        <div className={className} onClick={onClick}>
            <DotIcon color={dotColor} />
            최신순
        </div>
    );
}

export default SortLatest;