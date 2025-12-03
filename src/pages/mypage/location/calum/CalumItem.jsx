import React from 'react';
import { useNavigate } from 'react-router-dom';
import CrownIcon from '../../../../components/icons/CrownIcon';
import GoodCountIcon from '../../../../components/icons/GoodCountIcon';
import CommentCountIcon from '../../../../components/icons/CommentCountIcon'
import { categories } from '../../../../components/Badges/CategoryData';
import CategoryXselector from '../../../../components/Badges/CategoryXselector';
import styles from './CalumItem.module.css';

console.log("🔥 CalumItem 파일 로딩됨");

const CalumItem = ({ data }) => {
  const navigate = useNavigate();

  try {
        // 1. 서버 응답 필드에 맞게 구조 분해 할당
        const { 
            columnId,
            authorId, 
            title,
            // 서버에 없으므로 기본값 null 처리
            imageUrl = null, 
            isBestColumn, // isPremium 대신 사용
            likeCount, // likesCount 대신 사용
            commentCount,
            // 서버에서 받은 카테고리 ID들
            categoryId1,
            categoryId2, 
            categoryId3,
        } = data;

        // 2. 클라이언트 내부에서 사용하는 이름으로 재정의
        const id = columnId;
        const isPremium = isBestColumn; 
        const likesCount = likeCount;
        const commentsCount = commentCount; 
        const author = `유저 ID: ${authorId}`; // 작성자 이름이 없으므로 임시 표시

        // 3. 🚨 카테고리 ID를 객체 배열로 변환하는 핵심 로직
        const rawCategoryIds = [categoryId1, categoryId2, categoryId3].filter(val => val !== null && val !== undefined);
        
        let multiCategories = [];


        console.log("🔥 rawCategoryIds:", rawCategoryIds);
console.log("🔥 matched categories (multiCategories):", multiCategories);
console.log("🔥 all categories:", categories);

// categories가 유효한 배열인지 먼저 확인 (치명적인 오류 방지)
if (Array.isArray(categories)) {
    multiCategories = categories.filter(item => {
        if (!item || !item.num) return false;   // ← 이 한 줄이 crash를 막음!!
        const itemNum = Number(item.num);
        if (isNaN(itemNum)) return false;
        return rawCategoryIds.includes(itemNum);
    });
}

        // 💡 디버깅 로그: 이 로그가 찍히면 데이터 변환은 성공한 것입니다.
        // 이 로그가 안 찍힌다면 'data'가 문제이거나 이전 단계에서 렌더링이 멈춘 것
        console.log("CalumItem Rendering Check:", { id, title, multiCategories }); 


        // 클릭 핸들러 함수 정의
        const handleCardClick = () => {
            navigate(`/column/${id}`);
        };

console.log("🔥 CalumItem 렌더링:", data);


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
                        removableMode={false} 
                        viewOnly={true}      
                    />
                </div>

                <div className={styles.subject}>
                    {isPremium && <CrownIcon />} 
                    <h2 className={styles.title}>{title}</h2>
                </div>

                <p className={styles.author}>{author}</p>
                
                {/* 하트/댓글 아이콘 영역 */}
                <div className={styles.interactionIcons}>
                    <GoodCountIcon count={likesCount || 0 }/>
                    <CommentCountIcon count={commentsCount || 0} />
                </div>
            </div>
            
            {/* 이미지 영역 */}
            <div className={styles.imageContainer}>
                {imageUrl && <img src={imageUrl} alt={title} />}
            </div>
        </div>
    );
    
  } catch (error) {
    // 💡 렌더링 오류 발생 시 이 로그를 확인하세요!
    console.error("❌ CalumItem 렌더링 중 오류 발생:", error, "받은 데이터:", data);
    return null; 
  }
};

export default CalumItem;