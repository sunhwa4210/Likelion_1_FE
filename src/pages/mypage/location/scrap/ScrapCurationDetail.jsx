import React, { useState, useEffect } from "react";
import { DUMMY_SCRAP_DATA } from "./dummyScrap";
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

    const { id } = useParams(); // URL 경로에서 ID 추출 (예: /curation/1 에서 1을 가져옴)
    const navigate = useNavigate();

    // 해당 ID의 큐레이션 데이터 찾기
    const curation = DUMMY_SCRAP_DATA.find(item => item.id === Number(id));

    // 오류 테스트: 데이터가 없을 경우 조기에 반환 
    if (!curation) {
        // 데이터가 없으면 오류 메시지를 보여주거나, 뒤로 이동
        return (
            <div className={styles.detailPageWrapper}>
                <div className="header" onClick={() => navigate(-1)} style={{ padding: '15px', borderBottom: '1px solid #ccc' }}>
                    뒤로가기
                </div>
                <div className="content p-4 text-center">
                    <p>요청하신 큐레이션 정보를 찾을 수 없습니다.</p>
                </div>
            </div>
        );
    }

    const isBookmarked = curation?.isBookmarked || false; // 데이터 상태를 직접 참조
    const likesCount = curation?.likes || 0; // 데이터 카운트를 직접 참조


    // 데이터 필터링 로직 
    const fieldBadges = curation.fieldBadges || []; // fieldBadges 배열 가져오기 (없으면 빈 배열)
    
    // fieldBadges 배열에 포함된 label을 가진 카테고리 객체만 필터링
    const multiCategories = categories.filter(item => 
        fieldBadges.includes(item.label)
    );
    
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
                
                {/* 헤더 영역  */}
                <div className={styles.curationThumbnail}>
                    <img src={curation.imageUrl} alt="큐레이션 썸네일" />

                    {curation.insightBadge && (
                        <div className={styles.insightBadge}> 
                            <InsightBadge type={curation.insightBadge} />
                        </div>
                    )}
                    {curation.crossNoteBadge && (
                        <div className={styles.crossNoteBadge}> 
                            <CrossNoteBadge type={curation.crossNoteBadge} />
                        </div>
                    )}
                    {curation.bestCalumBadge && (
                        <div className={styles.bestCalumBadge}> 
                            <BestCalumBadge type={curation.bestCalumBadge} />
                        </div>
                    )}
                </div>

                <div className={styles.flexInfoRow}>
                    <div className={styles.badgeGroup}>
                        {multiCategories.length > 0 && (
                            <CategoryXselector 
                                categoriesToDisplay={multiCategories} 
                                removableMode={false} 
                                viewOnly={true}      
                            />
                        )}
                    </div>
                </div>

                {/* 제목 및 뱃지 영역 */}
                <h1 className={styles.detailTitle}>
                    {curation.content}
                </h1>
                
                {/* 본문 영역 */}
                <div className={styles.detailBody}>
                    {renderDetailContent()}
                </div>

                {/* 좋아요 및 북마크 */}
                <div className={styles.actionGroup}>
                    <GoodCountIcon count={likesCount} />
                </div>
            </main>

            {/* 고정 푸터 영역 */}
            <footer className={styles.fixedFooter}>
                <BackIcon count={likesCount} />
                <Scrapis isScrapped={isBookmarked} />
            </footer>
        </div>
    );
}