import React, { useState, useEffect } from "react";
import styles from './ScrapCurationDetail.module.css';
import { useParams, useNavigate } from "react-router-dom";

import InsightBadge from "../../../../components/icons/InsightBadge"; 
import CrossNoteBadge from "../../../../components/icons/CrossNoteBadge";
import BestCalumBadge from "../../../../components/icons/BestCalumBadge";
import GoodCountIcon from "../../../../components/icons/GoodCountIcon";
import BackIcon from "../../component/backicon";
import Scrapis from "../../component/scrapis";
import CategoryXselector from "../../../../components/Badges/CategoryXselector";
import { categories } from "../../../../components/Badges/CategoryData"; 

export default function ScrapCurationDetail() {

    const { id } = useParams(); 
    const navigate = useNavigate();

    const [curation, setCuration] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    // API 호출: 큐레이션 상세 데이터 가져오기 (GET /curation/{curationId})
    useEffect(() => {
        const fetchCurationDetail = async () => {
            try {
                const response = await fetch(`/curation/${id}`, {
                    method: 'GET',
                    headers: { /* 인증 정보 */ },
                });

                if (!response.ok) {
                    throw new Error(`상세 정보 로드 실패: ${response.status}`);
                }
                
                const data = await response.json();

                // 응답 데이터 변환
                const detailContentArray = data.description 
                    ? [data.description] // API description을 본문 배열로 사용
                    : ['본문 내용이 없습니다.']; 

                const fieldNames = [data.categoryName, data.crossCategoryName].filter(name => name && name.trim() !== '');

                const transformedCuration = {
                    id: data.curationId,
                    imageUrl: data.imageUrl,
                    insightBadge: data.curationType === 'INSIGHT',
                    crossNoteBadge: data.curationType === 'CROSSNOTE',
                    bestCalumBadge: data.curationType === 'BEST_COLUMN',
                    fieldBadges: fieldNames,
                    content: data.title,
                    detailContent: detailContentArray,
                };

                // 상태 업데이트
                setCuration(transformedCuration);
                setIsBookmarked(data.scrapped); // API 응답의 'scrapped' 필드로 초기화
                setLikesCount(data.likeCount);
                
            } catch (error) {
                console.error(`큐레이션 상세 정보 (ID: ${id}) 로드 실패:`, error);
                setCuration(null); 
            }
        };

        fetchCurationDetail();
    }, [id]); 

    // 스크랩 상태 토글 핸들러 (API 명세가 필요함)
    const handleScrapToggle = async () => {
        const newScrappedState = !isBookmarked;
        const method = newScrappedState ? 'POST' : 'DELETE'; 

        try {
            // 💡 스크랩/스크랩 취소 API 명세로 대체 필요
            // const response = await fetch(`/api/curations/${id}/scrap`, { method: method, ... });
            // if (!response.ok) throw new Error('스크랩 상태 변경 실패');
            
            // API 성공 시에만 상태 변경
            setIsBookmarked(newScrappedState);
            // 좋아요/스크랩 카운트 등 추가 업데이트 로직 필요
        } catch (error) {
            console.error("스크랩 상태 변경 API 호출 실패:", error);
        }
    };


    if (!curation) {
        return (
            <div className={styles.detailPageWrapper}>
                <div className="header" onClick={() => navigate(-1)} style={{ padding: '15px', borderBottom: '1px solid #ccc' }}>
                    뒤로가기
                </div>
                <div className="content p-4 text-center">
                    <p>{curation === undefined ? '로딩 중...' : '요청하신 큐레이션 정보를 찾을 수 없습니다.'}</p>
                </div>
            </div>
        );
    }
    
    // 데이터 필터링 로직 (기존과 동일)
    const fieldBadges = curation.fieldBadges || []; 
    const multiCategories = categories.filter(item => fieldBadges.includes(item.label));

    // 큐레이션 본문을 단락별로 렌더링
    const renderDetailContent = () => {
        return curation.detailContent.map((paragraph, index) => (
            <p key={index} className={`${styles.detailParagraph} mb-4 leading-relaxed`}>
                {paragraph}
            </p>
        ));
    };


    return (
        <div className={styles.detailPageWrapper}>

            <main className={styles.content}> 
                
                {/* ... (중략: 썸네일, 뱃지, 제목, 본문 렌더링) ... */}
                <div className={styles.curationThumbnail}>
                    <img src={curation.imageUrl} alt="큐레이션 썸네일" />
                    {curation.insightBadge && (<div className={styles.insightBadge}><InsightBadge type={curation.insightBadge} /></div>)}
                    {curation.crossNoteBadge && (<div className={styles.crossNoteBadge}><CrossNoteBadge type={curation.crossNoteBadge} /></div>)}
                    {curation.bestCalumBadge && (<div className={styles.bestCalumBadge}><BestCalumBadge type={curation.bestCalumBadge} /></div>)}
                </div>

                <div className={styles.flexInfoRow}>
                    <div className={styles.badgeGroup}>
                        {multiCategories.length > 0 && (
                            <CategoryXselector categoriesToDisplay={multiCategories} removableMode={false} viewOnly={true} />
                        )}
                    </div>
                </div>

                <h1 className={styles.detailTitle}>
                    {curation.content}
                </h1>
                
                <div className={styles.detailBody}>
                    {renderDetailContent()}
                </div>

                <div className={styles.actionGroup}>
                    <GoodCountIcon count={likesCount} />
                </div>
            </main>

            {/* 고정 푸터 영역 */}
            <footer className={styles.fixedFooter}>
                <BackIcon count={likesCount} />
                <Scrapis isScrapped={isBookmarked} onToggle={handleScrapToggle} />
            </footer>
        </div>
    );
}