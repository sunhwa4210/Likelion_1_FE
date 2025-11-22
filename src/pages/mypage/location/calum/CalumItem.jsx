import React from 'react';
import { useNavigate } from 'react-router-dom';
import CrownIcon from '../../../../components/icons/CrownIcon';
import GoodCountIcon from '../../../../components/icons/GoodCountIcon';
import CommentCountIcon from '../../../../components/icons/CommentCountIcon'
import { categories } from '../../../../components/Badges/CategoryData';
import CategoryXselector from '../../../../components/Badges/CategoryXselector';
import styles from './CalumItem.mocule.css';

const CalumItem = ({ data }) => {
  const navigate = useNavigate();

  // data 객체에서 필요한 정보들을 구조 분해 할당
  const { 
    id,
    badges, 
    title, 
    author, 
    imageUrl, 
    isPremium, 
    likesCount, 
    commentsCount 
  } = data;

  // 클릭 핸들러 함수 정의
  const handleCardClick = () => {
    // 이동할 경로를 정의합 (예: /column/1, /column/2 등)
    // 경로: /column/:id
    navigate(`/column/${id}`);
  };

  const multiCategories = categories.filter(item => 
    badges.includes(item.label)
);

  return (
    <div 
        className={styles.contentCard}
        onClick={handleCardClick}
    >
      <div className={styles.textContent}>
        {/* 뱃지 영역 */}
        <div className={styles.badgesContainer}>
          <CategoryXselector 
                categoriesToDisplay={multiCategories} 
                // X 버튼 없이
                removableMode={false} 
                // 뷰어 모드(클릭 비활성화, 활성화 색상 고정)로 사용
                viewOnly={true}      
            />
        </div>

        <div className={styles.subject}>
            {isPremium && <CrownIcon />} 
            {/* 제목 */}
            <h2 className={styles.title}>{title}</h2>
        </div>

        {/* 작성자 */}
        <p className={styles.author}>{author}</p>
        
        {/* 하트/댓글 아이콘 영역 */}
        <div className={styles.interactionIcons}>
            {/* 하트 아이콘 컴포넌트와 개수 표시 */}
            <GoodCountIcon count={likesCount} />
            {/* 댓글 아이콘 컴포넌트와 개수 표시 */}
            <CommentCountIcon count={commentsCount} />
        </div>
      </div>
      
      {/* 이미지 영역 */}
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={title} />
      </div>
    </div>
  );
};

export default CalumItem;