// 3개의 개별 큐레이션을 나열한 페이지입니다. (테스트용)
import React from "react";
import CurationItem from "./CurationItem";
import styles from './CurationItem.module.css'
import {DUMMY_CURATION_DATA} from './DummyData';

const CurationList = ( {curations, onClick, onBookmarkClick} ) => {
  // 1. 실제 애플리케이션에서는 useState와 useEffect를 사용하여 API에서 데이터를 비동기적으로 가져옵니다.
  //const curations = DUMMY_CURATION_DATA; 

  return (
    <div className="curationListContainer">
     
      {/* 2. 데이터 배열을 map() 함수로 순회하며 CurationItem 컴포넌트를 렌더링합니다. */}
      {curations.map(item => (
        <CurationItem
          // React가 목록의 항목을 효율적으로 관리하도록 고유한 key prop을 전달해야 합니다.
          key={item.id} 
          imageUrl={item.imageUrl}
          
          fieldBadges={item.fieldBadges}

          insightBadge={item.insightBadge}
          crossNoteBadge={item.crossNoteBadge}
          bestCalumBadge={item.bestCalumBadge}

          content={item.content}
          likes={item.likes}
          isBookmarked={item.isBookmarked}

          onClick={() => onClick(item.id)}
          onBookmarkClick={() => onBookmarkClick(item.id)}
        />
      ))}
    </div>
  );
}; 

export default CurationList;
