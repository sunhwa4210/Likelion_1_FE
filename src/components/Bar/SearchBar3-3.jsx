// 검색바 세 번째 버전입니다. 
// 나의 질문글, 나의답글
import React, { useState } from 'react';
import FilterIcon from '../icons/FilterIcon';
import SortQn from './SortQn';
import SortnA from './SortnA';
import SearchIcon from './SearchIcon';
import styles from './SearchBar.module.css'

// 컴포넌트 최대 너비 설정 (값 전달 없을 시, 기본값을 347px로 정의)
function SearchBar3_3({ 
    maxWidth = '347px', 
    onFilterClick, 
    onSearchChange, 
    onSortChange, 
    searchTerm: initialSearchTerm = '', // 기본값 설정
    activeSort: initialActiveSort = 'Qn' // 기본값 설정
}) {
    // ⭐️ 내부 상태로 searchTerm과 activeSort를 관리
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [activeSort, setActiveSort] = useState(initialActiveSort); 
    const [isFocused, setIsFocused] = useState(false);

    // 클릭된 버튼에 따라 activeSort 상태를 업데이트함 
    const handleSortClick = (key) => {
        console.log(`정렬 기준 변경: ${key}`);
        setActiveSort(key); // ⭐️ 내부 상태 업데이트
        if (onSortChange) onSortChange(key); // 부모의 핸들러는 그대로 호출
    };

    // 필터 버튼 클릭을 처리하는 함수
    const handleFilterClick = () => {
        console.log('필터 버튼 클릭');
        if (onFilterClick) onFilterClick(); 
    };

    // 검색 입력창을 클릭했을 때 (UI 변화)
    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value); // ⭐️ 내부 상태 업데이트
        if (onSearchChange) onSearchChange(value); 
    };

    // 검색 입력창 포커스 벗어났을 떄 (UI 변화)
    const handleBlur = () => {
        setIsFocused(false);
    };

    return (      
        <div className={styles.searchFilterContainer}
            style={{ maxWidth: maxWidth }} 
        >
            {/* 1. 검색 입력 영역 */}
            <div className={`${styles.searchInputWrapper} ${isFocused ? styles.focused : ''}`}>
                <SearchIcon color={isFocused ? '#39A2A5' : '#ACADAC'} />
                <input
                    type="text"
                    placeholder="검색어를 입력하거나, 필터로 원하는 조건을 선택하세요"
                    value={searchTerm} // ⭐️ 내부 상태 값 사용
                    onChange={handleSearchInputChange} 
                    className={styles.searchInput}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
            </div>

            {/* 2. 정렬 버튼 */}
            <div className={styles.sortFilterArea}>
                
                <div className={styles.sortOptions}>
                    <SortQn
                        isActive={activeSort === 'Qn'} // ⭐️ 내부 상태 값 사용
                        onClick={() => handleSortClick('Qn')}
                        styles={styles} 
                    />

                    <SortnA
                        isActive={activeSort === 'nA'} // ⭐️ 내부 상태 값 사용
                        onClick={() => handleSortClick('nA')}
                        styles={styles} 
                    />
                </div>

                {/* 3. 필터 버튼 */}
                <button
                    onClick={handleFilterClick}
                    className={styles.filterButton}
                >
                <FilterIcon /> 
                </button>

            </div>
        </div>
    );
}

export default SearchBar3_3;