// 드롭다운 컴포넌트 페이지입니다. 

import React, { useState, useRef, useEffect } from 'react';
import './DropdownMenu.css';

// SVG 아이콘 컴포넌트 
const ChevronDown = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
    <path d="M1 1L7 7L13 1" 
          stroke="#191919" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
    />
  </svg>
);

// 드롭다운 메뉴에 표시될 카테고리 목록 
const categories = [
  '인문사회',
  '자연과학',
  '공학·기술',
  '경제·경영',
  '예술·문화',
  '스포츠·라이프스타일',
];

// 메인 드롭다운 컴포넌트
const DropdownMenu = ({ width, fontSize, listWidth }) => { 
  // 현재 선택된 카테고리 상태 (초기값은 categories 배열의 첫 번째 항목)
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  // 드롭다운 메뉴의 열림/닫힘 상태
  const [isOpen, setIsOpen] = useState(false);

  // 드롭다운 wrapper DOM 요소를 참조하기 위한 Ref (외부 클릭 감지에 사용)
  const dropdownRef = useRef(null);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // 컴포넌트 마운트 시 document 전체에 'mousedown' 이벤트 리스너 추가
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 드롭다운 열림/닫힘 상태 토글 핸들러
  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  // 목록 항목 선택 핸들러
  const handleSelect = (category) => {
    setSelectedCategory(category);
    setIsOpen(false); 
  };

  // 렌더링
  return (
    <div className="app-container">
      {/* 드롭다운 */}
      <div 
        ref={dropdownRef} // 외부 클릭 감지를 위해 Ref 연결
        className="dropdown-wrapper"
        style={{ width: width }} 
      >
        {/* 드롭다운 메뉴 버튼 (보여지는 부분) */}
        <button
          type="button"
          className="dropdown-button"
          onClick={handleToggle} // 클릭 시 토글 실행
          aria-expanded={isOpen} // 현재 드롭다운이 열려있는지 여부
          aria-haspopup="listbox" 
          style={fontSize ? { fontSize: fontSize } : {}} // 폰트 크기 제어 
        >
          <span className="selected-category-text">{selectedCategory}</span>
          <ChevronDown 
            className="dropdown-icon" 
            aria-hidden="true"
          />
        </button>

        {/* 드롭다운 메뉴의 서브메뉴 리스트 보여주기 (isOpen 상태가 true일 때만 렌더링) */}
        {isOpen && (
          <ul
            className="dropdown-list"
            role="listbox"
            style={listWidth ? { width: listWidth } : {}}
          >
            {categories.map((category) => (
              <li
                key={category}
                // 현재 선택된 항목에 'selected' 클래스 추가
                // '스포츠·라이프스타일' 항목에 'small-text' 클래스 추가 -> 줄바꿈 처리 대비
                className={`
                  dropdown-item 
                  ${selectedCategory === category ? 'selected' : ''} 
                  ${category.includes('라이프스타일') ? 'small-text' : ''}
                `}
                onClick={() => handleSelect(category)}
                role="option"
                aria-selected={selectedCategory === category}
              >
                {category === '스포츠·라이프스타일' ? (
                    <>
                      스포츠<br />·라이프스타일 {/* 내용이 길 경우 <br>로 줄바꿈 처리 */}
                    </>
                  ) : (
                    category
                  )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DropdownMenu;