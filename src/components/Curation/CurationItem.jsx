// 개별 큐레이션 컴포넌트입니다. 

import React from "react";
import InsightBadge from "../icons/InsightBadge";
import CrossNoteBadge from "../icons/CrossNoteBadge";
import BestCalumBadge from "../icons/BestCalumBadge";
import GoodCountIcon from "../icons/GoodCountIcon";
import BookmarkIcon from "../icons/BookmarkIcon";

import CategoryXselector from "../Badges/Category/CategoryXselector"
import { categories } from "../Badges/Category/CategoryData";

import './CurationItem.css';

const findCategoryItem = (label) => {
    // 공백을 제거해 정확히 일치하는 카테고리 찾기 
    const trimmedLabel = label ? label.trim() : '';
    // CategoryData.js의 categories 배열을 사용
    return categories.find(cat => cat.label.trim() === trimmedLabel);
};

// 개별 큐레이션 크기의 기본값 설정 
const DEFAULT_WIDTH = '347px';
const DEFAULT_HEIGHT = '265px';

const CurationItem = ({
    imageUrl, // 이미지 
    insightBadge, // 인사이트 뱃지 
    crossNoteBadge, // 크로스 노트 뱃지 
    bestCalumBadge, // 베스트칼럼 뱃지 (3개 중 하나의 변수를 true로 설정해 사용)
    fieldBadges, // 선택한 카테고리 -> 배열로 
    content, // 요약 
    likes, // 좋아요 수 
    isBookmarked, // 북마크 
    cardWidth = DEFAULT_WIDTH, // 크기 
    cardHeight = DEFAULT_HEIGHT // 크기 
}) => {

    // Props로 크기 가져오기 
    const cardStyle = { width: cardWidth, height: cardHeight, };

    // fieldBadges 배열을 순회하며 각 레이블에 해당하는 카테고리 객체를 찾음 
    const categoriesToDisplay = (fieldBadges || [])
        .map(label => findCategoryItem(label))
        .filter(item => item !== undefined); // 찾지 못한 항목 제외

    return (
    <div className="curation-card" style={cardStyle}>

      {/* -- 헤더 영역 --  */}
      <div className="curation-image-placeholder">
        {/* 1. 썸네일 */}
        <img src={imageUrl} alt="큐레이션 이미지" />

        {/* 2. 카테고리 뱃지 컴포넌트 사용 */}
        {/* 각 prop이 true일 때만 해당 뱃지를 렌더링 */}
        {insightBadge && (
          <div className="insight-badge"> 
            <InsightBadge type={insightBadge} />
          </div>
        )}
        {crossNoteBadge && (
          <div className="cross-note-badge"> 
            <CrossNoteBadge type={crossNoteBadge} />
          </div>
        )}
        {bestCalumBadge && (
          <div className="best-calum-badge"> 
            <BestCalumBadge type={bestCalumBadge} />
          </div>
        )}
      </div>

      {/* -- 바디 영역 -- */}
      <div className="curation-content">

        <div className="badge-group">
          {/* 3. 분야 뱃지 컴포넌트 사용 */}
          {categoriesToDisplay.length > 0 && (
            <CategoryXselector 
              categoriesToDisplay={categoriesToDisplay}
              removableMode={false} 
              viewOnly={true}      
            />
          )}

          {/* 4. 북마크 버튼 컴포넌트 사용 */}
          <BookmarkIcon isMarked={isBookmarked} />
        </div>

        {/* 5. 요약본 (DB 불러와야 함) */}
        <p className="content-text">{content}</p>

        {/* -- 푸터 영역 -- */}
        <div className="curation-footer">
          {/* 6. 좋아요 버튼 컴포넌트 사용 */}
          <GoodCountIcon count={likes} />
        </div>
      </div>
    </div>
  );
};

export default CurationItem;