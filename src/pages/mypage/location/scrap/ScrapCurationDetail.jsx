import React, { useState, useEffect } from "react";
import styles from './ScrapCurationDetail.module.css';
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
// 아이콘 컴포넌트 임포트
import InsightBadge from "../../../../components/icons/InsightBadge"; 
import CrossNoteBadge from "../../../../components/icons/CrossNoteBadge";
import BestCalumBadge from "../../../../components/icons/BestCalumBadge";
import GoodCountIcon from "../../../../components/icons/GoodCountIcon";
import BackIcon from "../../component/backicon";
import Scrapis from "../../component/scrapis";
import CategoryXselector from "../../../../components/Badges/CategoryXselector";
import { categories } from "../../../../components/Badges/CategoryData"; 

const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

export default function ScrapCurationDetail() {

    const { id } = useParams(); 
    const navigate = useNavigate();

    const { accessToken } = useAuth();
    const [curation, setCuration] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    const getAuthHeaders = () => ({
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    });

    // API 호출: 큐레이션 상세 데이터 가져오기 (GET /curation/{curationId})
    const fetchCurationDetail = async () => {
        if (!accessToken) {
            console.warn("Access Token이 없어 큐레이션 상세 정보를 로드할 수 없습니다.");
            setCuration(null);
            return;
        }
        
        try {
            // 🏆 API_BASE를 사용하여 URL 구성
            const response = await fetch(`${API_BASE}/curation/${id}`, { 
                method: 'GET',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`상세 정보 로드 실패: ${response.status}`);
            }
            
            const data = await response.json();

            // 응답 데이터 변환
            const detailContentArray = data.description 
                ? [data.description] 
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

    useEffect(() => {
        fetchCurationDetail();
    }, [id, accessToken]);  // 의존성 배열에 fetchCurationDetail이 들어가면 안되지만, 함수 자체가 바깥에 정의되어 있으므로 일단 이대로 유지. (useCallback으로 감싸는 것이 더 좋음)

    // 스크랩 상태 토글 핸들러 (API 명세가 필요함)
    const handleScrapToggle = async () => {
        if (!accessToken) {
            console.warn("Access Token이 없어 스크랩을 할 수 없습니다.");
            alert("로그인이 필요합니다."); 
            return;
        }

        const newScrappedState = !isBookmarked;
        const method = newScrappedState ? 'POST' : 'DELETE'; 
        // 🏆 API_BASE를 사용하여 URL 구성
        const url = `${API_BASE}/curation/${id}/scrap`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`스크랩 상태 변경 실패: ${response.status}`);
            }
            
            // API 성공 시에만 상태 변경
            setIsBookmarked(newScrappedState);
            console.log(`스크랩 상태 변경 성공: ${newScrappedState ? '스크랩됨' : '스크랩 취소됨'}`);
            // 💡 스크랩 상태 변경 후, 좋아요 수 등을 최신화하려면 상세 정보를 다시 로드합니다.
            // fetchCurationDetail(); 
            
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
                
                {/* 썸네일 및 뱃지 */}
                <div className={styles.curationThumbnail}>
                    <img src={curation.imageUrl} alt="큐레이션 썸네일" />
                    {curation.insightBadge && (<div className={styles.insightBadge}><InsightBadge type={curation.insightBadge} /></div>)}
                    {curation.crossNoteBadge && (<div className={styles.crossNoteBadge}><CrossNoteBadge type={curation.crossNoteBadge} /></div>)}
                    {curation.bestCalumBadge && (<div className={styles.bestCalumBadge}><BestCalumBadge type={curation.bestCalumBadge} /></div>)}
                </div>

                {/* 카테고리 뱃지 */}
                <div className={styles.flexInfoRow}>
                    <div className={styles.badgeGroup}>
                        {multiCategories.length > 0 && (
                            <CategoryXselector categoriesToDisplay={multiCategories} removableMode={false} viewOnly={true} />
                        )}
                    </div>
                </div>

                {/* 제목 */}
                <h1 className={styles.detailTitle}>
                    {curation.content}
                </h1>
                
                {/* 본문 */}
                <div className={styles.detailBody}>
                    {renderDetailContent()}
                </div>

                {/* 좋아요 수 */}
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