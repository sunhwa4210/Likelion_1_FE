// 검색바 두 번쨰 버전입니다.
// 최신순, 인기순 
import React, { useState } from 'react';
import FilterIcon from '../icons/FilterIcon';
import SortLatest from './SortLatest';
import SortPopular from './SortPopular';
import SearchIcon from './SearchIcon';
import styles from './SearchBar.module.css'

// 컴포넌트 최대 너비 설정 (값 전달 없을 시, 기본값을 347px로 정의)
function SearchBar2_2({ maxWidth = '347px',
  onFilterClick, // ⭐️ 필터 클릭 핸들러 추가
    onSearchChange, // ⭐️ 검색어 변경 핸들러 추가
    onSortChange, // ⭐️ 정렬 변경 핸들러 추가
    onBadgeFilterChange, // ⭐️ 기존 뱃지 필터 핸들러 유지 (ScrapCuration 고유 기능)
    searchTerm: externalSearchTerm, // ⭐️ props로 받음
    activeSort: externalActiveSort // ⭐️ props로 받음

 }) {
  //const [searchTerm, setSearchTerm] = useState(''); // 검색 입력창의 현재 텍스트를 저장하는 상태
  //const [activeSort, setActiveSort] = useState('latest'); // 현재 활성화된 정렬 기준
  const [isFocused, setIsFocused] = useState(false); // 검색 입력창이 활성화되었는지의 여부

  // 클릭된 버튼에 따라 activeSort 상태를 업데이트함 
  const handleSortClick = (key) => {
        console.log(`정렬 기준 변경: ${key}`);
        if (onSortChange) onSortChange(key); // ⭐️ 부모의 핸들러 호출
    };

  // 필터 버튼 클릭을 처리하는 함수
  const handleFilterClick = () => {
        console.log('필터 버튼 클릭');
        if (onFilterClick) onFilterClick(); // ⭐️ 부모의 핸들러 호출
    };

    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        if (onSearchChange) onSearchChange(value); // ⭐️ 부모의 핸들러 호출
    };

  // 검색 입력창을 클릭했을 때 (UI 변화)
  const handleFocus = () => {
    setIsFocused(true);
  };

  // 검색 입력창 포커스 벗어났을 떄 (UI 변화)
  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
      <div className={styles.searchFilterContainer}
        style={{ maxWidth: maxWidth }} // maxWidth Props로 받아오기 
      > 
      {/* 1. 검색 입력 영역 */}
        <div className={`${styles.searchInputWrapper} ${isFocused ? styles.focused : ''}`}>
          <SearchIcon color={isFocused ? '#39A2A5' : '#ACADAC'} />
          <input
            type="text"
            placeholder="검색어를 입력하거나, 필터로 원하는 조건을 선택하세요"
            value={externalSearchTerm} // ⭐️ props 값 사용
                    onChange={handleSearchInputChange} // ⭐️ 핸들러 연결
            className={styles.searchInput}

            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        {/* 2. 정렬 버튼 */}
        <div className={styles.sortFilterArea}>
          
          <div className={styles.sortOptions}>
            <SortLatest 
              isActive={externalActiveSort === 'latest'}
              onClick={() => handleSortClick('latest')}
              styles={styles} // 스타일 객체 전달
            />

            <SortPopular 
              isActive={externalActiveSort === 'popular'}
              onClick={() => handleSortClick('popular')}
              styles={styles} // 스타일 객체 전달
            />
            {/* SortComments 컴포넌트가 제거되었습니다. */}
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

export default SearchBar2_2;