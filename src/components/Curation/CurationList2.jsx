// 3개의 개별 큐레이션을 나열한 페이지입니다. (테스트용)
import React from "react";
import CurationItem2 from "./CurationItem2";
import {DUMMY_CURATION_DATA} from './DummyData';
import styles from './CurationItem2.module.css';

const CurationList2 = ( {curations, onItemClick, onBookmarkClick, onLikeChange} ) => {
  // 1. 실제 애플리케이션에서는 useState와 useEffect를 사용하여 API에서 데이터를 비동기적으로 가져옵니다.
  //const curations = DUMMY_CURATION_DATA; 

  return (
    <div className={styles.curationListContainer}>
     
      {/* 2. 데이터 배열을 map() 함수로 순회하며 CurationItem 컴포넌트를 렌더링합니다. */}
      {curations.map(item => (
        <CurationItem2
          // React가 목록의 항목을 효율적으로 관리하도록 고유한 key prop을 전달해야 합니다.
          key={item.id} 
          imageUrl={item.imageUrl}
          
          fieldBadges={item.fieldBadges}

          insightBadge={item.insightBadge}
          crossNoteBadge={item.crossNoteBadge}
          bestCalumBadge={item.bestCalumBadge}

          likes={item.likes}
          content={item.content}
          liked={item.isLiked}
          scraped={item.isBookmarked}

          onClick={() => onItemClick(item.id)}
          onBookmarkClick={() => onBookmarkClick(item.id)}
          onLikeChange={onLikeChange}
        />
      ))}
    </div>
  );
}; 

export default CurationList2;
