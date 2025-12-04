import React from 'react';
import { useNavigate } from 'react-router-dom';
import CrownIcon from '../../../../components/icons/CrownIcon';
import GoodCountIcon from '../../../../components/icons/GoodCountIcon';
import CommentCountIcon from '../../../../components/icons/CommentCountIcon'
import { categories } from '../../../../components/Badges/CategoryData'; // 실제 임포트
import CategoryXselector from '../../../../components/Badges/CategoryXselector';
import styles from './CalumItem.module.css';

console.log("🔥 CalumItem 파일 로딩됨");

// ===============================================
// ✅ [더미 카테고리 데이터]
const DUMMY_CATEGORIES = [
    { num: 1, label: "인문사회", color: "blue" },
    { num: 2, label: "자연과학", color: "green" },
    { num: 3, label: "공학·기술", color: "orange" },
    { num: 7, label: "철학", color: "blue" },
    { num: 8, label: "역사", color: "blue" },
    { num: 10, label: "언어", color: "blue" },
    { num: 11, label: "심리", color: "blue" },
    { num: 17, label: "IT", color: "orange" },
    { num: 18, label: "AI", color: "orange" },
    { num: 21, label: "산업공학", color: "orange" },
    { num: 28, label: "UI/UX", color: "gray" },
    { num: 34, label: "생활", color: "purple" },
    // 필요에 따라 더 추가
];
// ===============================================

// categories가 유효한 배열인지 확인하고, 아니면 더미 데이터 사용
const CATEGORY_MAP_SOURCE = Array.isArray(categories) && categories.length > 0 ? categories : DUMMY_CATEGORIES;

const CalumItem = ({ data }) => {
    const navigate = useNavigate();

    try {
        // 1. 서버 응답 필드에 맞게 구조 분해 할당
        const { 
            id: columnId, // WriteCalum에서 이미 columnId를 id로 매핑했으므로 id로 받음
            author, // WriteCalum에서 이미 매핑됨
            title,
            imageUrl = null, 
            isPremium, // WriteCalum에서 이미 isBestColumn을 isPremium으로 매핑함
            likesCount, // WriteCalum에서 이미 likeCount를 likesCount로 매핑함
            commentsCount, // WriteCalum에서 이미 commentCount를 commentsCount로 매핑함
            // WriteCalum에서 전달받은 카테고리 ID들
            categoryId1,
            categoryId2, 
            categoryId3,
        } = data;


        // 2. 🚨 카테고리 ID를 객체 배열로 변환하는 핵심 로직
        const rawCategoryIds = [categoryId1, categoryId2, categoryId3].filter(val => val !== null && val !== undefined);
        
        let multiCategories = [];

        console.log("🔥 rawCategoryIds:", rawCategoryIds);

        // ===============================================
        // 💻 [구분 시작] 카테고리 매핑 로직 (더미/실제 데이터 공통 사용)
        // ===============================================
        multiCategories = CATEGORY_MAP_SOURCE.filter(item => {
            if (!item || item.num === undefined || item.num === null) return false; 
            const itemNum = Number(item.num);
            if (isNaN(itemNum)) return false;
            // CalumItem의 data로 넘어온 카테고리 ID와 CATEGORY_MAP_SOURCE의 num이 일치하는 항목을 필터링
            return rawCategoryIds.includes(itemNum);
        });
        // ===============================================
        // 💻 [구분 끝] 카테고리 매핑 로직
        // ===============================================

        console.log("🔥 matched categories (multiCategories):", multiCategories);
        console.log("🔥 CalumItem Rendering Check:", { columnId, title, multiCategories }); 


        // 클릭 핸들러 함수 정의
        const handleCardClick = () => {
            navigate(`/column/${columnId}`);
        };

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
        console.error("❌ CalumItem 렌더링 중 오류 발생:", error, "받은 데이터:", data);
        return null; 
    }
};

export default CalumItem;