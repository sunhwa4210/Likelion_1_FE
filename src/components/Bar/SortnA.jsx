/* 검색바-나의 답글 아이콘 컴포넌트 */
import React from 'react';
import DotIcon from './DotIcon';

function SortnA({ isActive, onClick, styles }) {
    const className = isActive ? styles.sortOptionItemActive : styles.sortOptionItem;
    const dotColor = isActive ? '#39A2A5' : '#ACADAC';

    return (
        // ⭐️ <div>를 <button>으로 변경하고 type="button"을 추가합니다.
        <button 
            type="button" 
            className={className} 
            onClick={onClick}
        >
            <DotIcon color={dotColor} />
            나의 답글 
        </button>
    );
}

export default SortnA;