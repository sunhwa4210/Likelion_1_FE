/* 검색바-나의 답글 아이콘 컴포넌트 */
import React from 'react';
import DotIcon from './DotIcon';

function SortnA({ isActive, onClick }) {
    const className = `sort-option-item ${isActive ? 'active' : ''}`;

    const dotColor = isActive ? '#39A2A5' : '#ACADAC';

    return (
        <div className={className} onClick={onClick}>
            <DotIcon color={dotColor} />
            나의 답글 
        </div>
    );
}

export default SortnA;