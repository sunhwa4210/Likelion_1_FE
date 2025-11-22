import React, { useState, useEffect } from 'react';
import styles from './Level.module.css'; 
import CheckIcon from '../../component/checkIcon';

const Level = ({ selectedLevel, handleLevelChange }) => {

    return (
        <div className={styles.curationContainer}>
            <h2 className={styles.curationTitle}
                style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    marginBottom: '15px',
                    color: 'var(--gray-50, #474747)',
            }}> | 큐레이션 수준</h2>
            
            <div className={styles.optionsWrapper}>
                    {/* 옵션 A: 일반/기초 */}
                    <div 
                        className={styles.optionBox} 
                        onClick={() => handleLevelChange('A')}
                    >
                    <div 
                        className={`${styles.customCheckbox} ${selectedLevel === 'A' ? styles.isSelected : ''}`}
                    >
                        {selectedLevel === 'A'}
                    </div>
                    <span className={styles.optionText}>A : 일반/기초</span>
                </div>

                {/* 옵션 B: 전문/심화 */}
                <div 
                    className={styles.optionBox} 
                    onClick={() => handleLevelChange('B')}
                >
                    <div 
                        className={`${styles.customCheckbox} ${selectedLevel === 'B' ? styles.isSelected : ''}`}
                    >
                        {selectedLevel === 'B'}
                    </div>
                    <span className={styles.optionText}>B : 전문/심화</span>
                </div>
            </div>

            <div className={styles.descriptionSection}>
                <div className={styles.detailItem}>
                    <CheckIcon />
                    <div>
                        내가 선택한 관심/전문 분야에 대해<br/>
                        알기 쉬운 내용으로 구성된 큐레이션을 받을 수 있어요
                    </div>
                </div>
                
                <div className={styles.detailItem}>
                    <CheckIcon />
                    <div>
                        <div className={styles.recommendationTitle}>이런 분께 추천해요!</div>
                        선택한 관심/전문 분야에 대해 아직 입문자인 경우
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default Level;