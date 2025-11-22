// 검색바 첫 번째 버전입니다. 

import React, { useState } from 'react';
import FilterIcon from '../icons/FilterIcon';
import SortLatest from './SortLatest';
import SortPopular from './SortPopular';
import SortComments from './SortComments';
import SearchIcon from './SearchIcon';
import styles from './SearchBar.module.css';

// 컴포넌트 최대 너비 설정 (값 전달 없을 시, 기본값을 347px로 정의)
function SearchBar1({ maxWidth = '347px', onFilterClick, onSearchChange, onSortChange }) {
  const [searchTerm, setSearchTerm] = useState(''); // 검색 입력창의 현재 텍스트를 저장하는 상태
  const [activeSort, setActiveSort] = useState('latest'); // 현재 활성화된 정렬 기준
  const [isFocused, setIsFocused] = useState(false); // 검색 입력창이 활성화되었는지의 여부

  // 클릭된 버튼에 따라 activeSort 상태를 업데이트함 
  const handleSortClick = (key) => {
    setActiveSort(key);
    console.log(`정렬 기준 변경: ${key}`);
    if (onSortChange) onSortChange(key);

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

  // 검색 입력창 포커스 벗어났을 떄 (UI 변화)
  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearchChange) onSearchChange(value);
  };


  return (
      <div className={styles.searchFilterContainer}
        style={{ maxWidth: maxWidth }} // maxWidth Props로 받아오기 
      > 
        {/* 1. 검색 입력 영역 */}
        <div className={`${styles.searchInputWrapper} ${isFocused ? styles.focused : ''}`}>
          {/* SearchIcon은 props로 color를 받고, 스타일링은 SearchBar.module.css에서 적용됨 */}
          <SearchIcon color={isFocused ? '#39A2A5' : '#ACADAC'} />
          <input
            type="text"
            placeholder="검색어를 입력하거나, 필터로 원하는 조건을 선택하세요"
            value={searchTerm}
            className={styles.searchInput} 
            onChange={handleSearchInputChange}

            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        {/* 2. 정렬 버튼 */}
        <div className={styles.sortFilterArea}>
          
          <div className={styles.sortOptions}>
            {/* SortLatest 컴포넌트 내부에서 styles.sortOptionItem과 styles.active를 사용하도록 가정하고 props 전달 */}
            <SortLatest 
              isActive={activeSort === 'latest'}
              onClick={() => handleSortClick('latest')}
              styles={styles} // 스타일 객체 전달 (SortLatest 내부에서 사용)
            />

            <SortPopular 
              isActive={activeSort === 'popular'}
              onClick={() => handleSortClick('popular')}
              styles={styles} // 스타일 객체 전달
            />

            <SortComments 
              isActive={activeSort === 'comments'}
              onClick={() => handleSortClick('comments')}
              styles={styles} // 스타일 객체 전달
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

export default SearchBar1;