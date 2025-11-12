/* 검색바-댓글많은순 아이콘 컴포넌트 */
import React from 'react';
import DotIcon from './DotIcon';

function SortComments({ isActive, onClick }) {
    const className = `sort-option-item ${isActive ? 'active' : ''}`;

    const dotColor = isActive ? '#39A2A5' : '#ACADAC';

    return (
        <div className={className} onClick={onClick}>
            <DotIcon color={dotColor} />
            댓글 많은 순 
        </div>
    );
}

export default SortComments;
