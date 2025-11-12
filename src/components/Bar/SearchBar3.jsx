// 검색바 세 번째 버전입니다. 

import React, { useState } from 'react';
import FilterIcon from '../icons/FilterIcon';
import SortQn from './SortQn';
import SortnA from './SortnA';
import SearchIcon from './SearchIcon';
import './SearchBar.css';

// 컴포넌트 최대 너비 설정 (값 전달 없을 시, 기본값을 347px로 정의)
function SearchBar3({ maxWidth = '347px' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSort, setActiveSort] = useState('latest'); 
  const [isFocused, setIsFocused] = useState(false);

  // 클릭된 버튼에 따라 activeSort 상태를 업데이트함 
  const handleSortClick = (key) => {
    setActiveSort(key);
    console.log(`정렬 기준 변경: ${key}`);
  };

  // 필터 버튼 클릭을 처리하는 함수
  const handleFilterClick = () => {
    console.log('필터 버튼 클릭');
    // !!!!! 추후 필터 모달을 띄우는 로직이 추가되어야 함 !!!!!!
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
      <div className="search-filter-container"
        style={{ maxWidth: maxWidth }} // maxWidth Props로 받아오기 
      >
        {/* 1. 검색 입력 영역 */}
        <div className={`search-input-wrapper ${isFocused ? 'focused' : ''}`}>
          <SearchIcon color={isFocused ? '#39A2A5' : '#ACADAC'} />
          <input
            type="text"
            placeholder="검색어를 입력하거나, 필터로 원하는 조건을 선택하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"

            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        {/* 2. 정렬 버튼 */}
        <div className="sort-filter-area">
          
          <div className="sort-options">
            <SortQn
              isActive={activeSort === 'Qn'}
              onClick={() => handleSortClick('Qn')}
            />

            <SortnA
              isActive={activeSort === 'nA'}
              onClick={() => handleSortClick('nA')}
            />
          </div>

          {/* 3. 필터 버튼 */}
          <button
            onClick={handleFilterClick}
            className="filter-button"
          >
          <FilterIcon /> 
          </button>

        </div>
      </div>
  );
}

export default SearchBar3;