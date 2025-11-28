import React from 'react';
import styles from './ModifyButton.module.css'; 

const ModifyButton = ({ isActive, onSave }) => {
    
    const handleClick = () => {
        if (isActive) {
            onSave(); // 활성화된 경우에만 저장 함수 실행
        }
    };
    
    const buttonClass = `${styles.modifyButton} ${isActive ? styles.isActive : ''}`;
    
    return (
        <button 
            className={buttonClass} 
            onClick={handleClick}
            disabled={!isActive} // 비활성화 상태일 때 클릭 막기
        >
            수정하기
        </button>
    );
};

export default ModifyButton;