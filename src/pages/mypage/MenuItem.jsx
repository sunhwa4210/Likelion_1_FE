import React from 'react';
import ArrowIcon from './component/arrowIcon';

const MenuItem = ({ label, onClick, styles }) => {
    // styles prop이 없을 경우의 폴백 처리 (보안)
    const localStyles = styles || {};

    return (
        <div className={localStyles.menuItem} onClick={onClick}>
            <div className={localStyles.menuItemContent}>
                <p className={localStyles.menuItemLabel}>{label}</p>
                <ArrowIcon className={localStyles.menuArrowIcon} />
            </div>
        </div>
    );
};

export default MenuItem;