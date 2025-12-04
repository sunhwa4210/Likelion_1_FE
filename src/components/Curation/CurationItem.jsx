// 개별 큐레이션 컴포넌트입니다. 

import React from "react";
import InsightBadge from "../icons/InsightBadge";
import CrossNoteBadge from "../icons/CrossNoteBadge";
import BestCalumBadge from "../icons/BestCalumBadge";
import CurationLikeButton from "./CuraionLikeButton";
import CurationScrapButton from "./CurationScrapButton";
import CategoryXselector from "../Badges/CategoryXselector"
import { categories } from "../Badges/CategoryData";
import altImg from "./assets/altImg.svg";

import styles from './CurationItem.module.css';

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
    id, //각 큐레이션 id
    imageUrl, // 이미지 
    insightBadge, // 인사이트 뱃지 
    crossNoteBadge, // 크로스 노트 뱃지 
    bestColumBadge, // 베스트칼럼 뱃지 (3개 중 하나의 변수를 true로 설정해 사용)
    fieldBadges, // 선택한 카테고리 -> 배열로 
    content,           // { title, description, sourceUrl }
    likeCount, // 좋아요 수 
    liked, //좋아요 여부
    scraped, // 북마크 
    cardWidth = DEFAULT_WIDTH, // 크기 
    cardHeight = DEFAULT_HEIGHT, // 크기
    onClick,
}) => {

    // Props로 크기 가져오기 
    const cardStyle = { width: cardWidth, height: cardHeight, };

    // fieldBadges 배열을 순회하며 각 레이블에 해당하는 카테고리 객체를 찾음 
    const categoriesToDisplay = (fieldBadges || [])
        .map(label => findCategoryItem(label))
        .filter(item => item !== undefined); // 찾지 못한 항목 제외
    
    const title = content?.title??"";


    return (
    <div   
      className={styles.curationCard} 
      style={cardStyle}
      onClick={onClick} // 전체를 클릭할 때 호출
    >

      {/* -- 헤더 영역 --  */}
      <div className={styles.curationImagePlaceholder}>
        {/* 1. 썸네일 */}
        <img 
        src={imageUrl && imageUrl.trim() !== "" ? imageUrl : altImg}
        alt="큐레이션 이미지" 
      />

        {/* 2. 카테고리 뱃지 컴포넌트 사용 */}
        {/* 각 prop이 true일 때만 해당 뱃지를 렌더링 */}
        {insightBadge && (
          <div className={styles.insightBadge}> 
            <InsightBadge type={insightBadge} />
          </div>
        )}
        {crossNoteBadge && (
          <div className={styles.crossNoteBadge}> 
            <CrossNoteBadge type={crossNoteBadge} />
          </div>
        )}
        {bestColumBadge && (
          <div className={styles.bestColumBadge}> 
            <BestCalumBadge type={bestColumBadge} />
          </div>
        )}
      </div>

      {/* -- 바디 영역 -- */}
      <div className={styles.curationContent}>

        <div className={styles.badgeGroup}>
          {/* 3. 분야 뱃지 컴포넌트 사용 */}
          {categoriesToDisplay.length > 0 && (
            // CategoryXselector가 styles.fieldBadgeList를 사용한다면 props로 전달 필요
            <CategoryXselector 
              categoriesToDisplay={categoriesToDisplay}
              removableMode={false} 
              viewOnly={true}      
            />
          )}

          {/* 4. 북마크 버튼 컴포넌트 사용 */}
          <div className={styles.bookmarkIconContainer} >
             <CurationScrapButton
              curationId={id}
              initialScrapped={scraped}
            />
          </div>
        </div>

        {/* 5. 요약본 (DB 불러와야 함) */}
        <p className={styles.contentText}>{title}</p>

        {/* -- 푸터 영역 -- */}
        <div className={styles.curationFooter}>
          {/* 6. 좋아요 버튼 컴포넌트 사용 */}
          <CurationLikeButton
          curationId={id}
          initialLikeCount={likeCount}
          initialLiked={liked}
        />
        </div>
      </div>
    </div>
  );
};

export default CurationItem;