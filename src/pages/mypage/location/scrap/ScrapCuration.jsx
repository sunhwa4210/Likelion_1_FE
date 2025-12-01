import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // 라우팅
import CurationList from "../../../../components/Curation/CurationList";
import CurationFilter from "../../../../components/Filter/CurationFilter";

import Header from "../../../../components/Header/Header";
import Globalheader from "../../../../components/atoms/Header/header";
import SearchBar2 from "../../../../components/Bar/SearchBar2";
import {useModal} from "../../../../components/Modal/ModalProvider";
import { presets } from "../../../../components/Modal/presets";


export default function ScrapCuration () {
    const { open } = useModal();
    const navigate = useNavigate();
    
    const [scrappedCurations, setScrappedCurations] = useState([]);
    // 기존 필터링 상태: null = 전체, 'INSIGHT', 'BEST_COLUMN', 'CROSSNOTE'
    const [currentBadgeFilter, setCurrentBadgeFilter] = useState(null); 
    
    // 🏆 1. 새로 추가된 필터 관련 상태
    const [isFilterOpen, setIsFilterOpen] = useState(false); // 상세 필터 모달/패널 토글 상태
    const [activeFilters, setActiveFilters] = useState({}); // CurationFilter에서 선택된 실제 필터 값

    // 🏆 2. 필터 토글 핸들러: SearchBar2의 필터 아이콘 클릭 시 호출됨
    const handleFilterToggle = useCallback(() => {
        setIsFilterOpen(prev => !prev);
    }, []);

    // 🏆 3. CurationFilter에서 필터 값이 변경/적용되었을 때 호출될 함수
    const handleFilterChange = useCallback((newFilters) => {
        setActiveFilters(newFilters);
        // 필터가 적용되면 UI를 닫습니다.
        setIsFilterOpen(false); 
        console.log("새로 적용된 필터:", newFilters);
    }, []);

    // 뱃지 필터 변경 핸들러 (기존 로직)
    const handleBadgeFilterChange = (badgeType) => {
        setCurrentBadgeFilter(badgeType);
    };

    // 필터링된 스크랩 목록을 가져오는 함수 (API 쿼리 로직 업데이트)
    const fetchScrapList = useCallback(async () => {
        // setIsLoading(true);
        try {
            // URLSearchParams를 사용하여 모든 필터를 동적으로 구성
            let queryParams = new URLSearchParams();

            // 1. 뱃지 필터 추가
            if (currentBadgeFilter) {
                queryParams.append('badge', currentBadgeFilter);
            }

            // 2. 🏆 activeFilters 쿼리 파라미터 구성 (새로 추가된 로직)
            // activeFilters 객체를 순회하며 쿼리 파라미터에 추가합니다.
            Object.keys(activeFilters).forEach(filterKey => {
                const values = activeFilters[filterKey];
                if (Array.isArray(values) && values.length > 0) {
                    // 서버가 쉼표로 구분된 리스트를 예상한다고 가정하고 값을 추가합니다.
                    // (예: fields=경제,기술)
                    queryParams.append(filterKey, values.join(','));
                }
            });
            
            // 최종 API URL 구성
            const queryString = queryParams.toString();
            const querySuffix = queryString ? `?${queryString}` : '';
            const apiUrl = `/api/mypage/scrapped-curations${querySuffix}`;

            // API 호출
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    // 인증 토큰 필요
                    // 'Authorization': 'Bearer YOUR_AUTH_TOKEN', 
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`스크랩 목록 로드 실패: ${response.status}`);
            }
            
            const rawData = await response.json();
            
            // 응답 데이터 변환 (CurationList 컴포넌트 구조에 맞추기)
            const transformedData = rawData.map(item => ({
                id: item.curationId, 
                imageUrl: item.imageUrl,
                insightBadge: item.curationType === 'INSIGHT',
                crossNoteBadge: item.curationType === 'CROSSNOTE',
                bestCalumBadge: item.curationType === 'BEST_COLUMN',
                fieldBadges: item.field ? [item.field] : [], 
                content: item.title, 
                likes: 0, // 임시 값
                isBookmarked: true, 
            }));

            setScrappedCurations(transformedData);
        } catch (error) {
            console.error("스크랩 목록 로드 실패:", error);
        } finally {
            // setIsLoading(false);
        }
    }, [currentBadgeFilter, activeFilters]); // 4. 의존성 배열에 activeFilters 추가

    
    // fetchScrapList의 의존성이 변경될 때마다 데이터를 다시 불러옵니다.
    useEffect(() => {
        fetchScrapList();
    }, [fetchScrapList]); 


    // 상세 페이지 이동 핸들러
    const handleItemClick = (curationId) => {
        navigate(`./ScrapCurationDetail/${curationId}`); 
    };

    // 북마크 클릭 (스크랩 취소) 핸들러
    const handleBookmarkClick = async (curationId) => {
        const res = await open(presets.scrapDelete());

        if (res === 'delete') {
            try {
                // 스크랩 취소 API 호출
                const response = await fetch(`/api/curations/${curationId}/scrap`, { 
                    method: 'DELETE',
                    headers: { /* 인증 정보 */ },
                });
                
                if (!response.ok) {
                    throw new Error('스크랩 삭제 실패'); 
                }
                
                // API 호출 성공 시 로컬 상태 업데이트
                setScrappedCurations(prev =>
                    prev.filter(curation => curation.id !== curationId)
                );
            } catch (error) {
                console.error("스크랩 삭제 API 호출 실패:", error);
            }
        }
    };


    return (
        <div className="app-wrapper">
            <Globalheader />
            <Header title="내가 스크랩한 큐레이션"/>

            <main className="content">
                
                {/* 5. SearchBar2에 필터 토글 핸들러 연결 */}
                <SearchBar2 
                    onFilterClick={handleFilterToggle} // 필터 아이콘 클릭 시 토글
                    onBadgeFilterChange={handleBadgeFilterChange} // 뱃지 필터 변경 시 호출
                />
                
                {/* 6. CurationFilter를 isFilterOpen 상태에 따라 조건부 렌더링 */}
                {isFilterOpen && (
                    <CurationFilter 
                        value={activeFilters} // 현재 필터 값
                        onChange={handleFilterChange} // 필터 적용 핸들러
                        onClose={handleFilterToggle} // (선택 사항) 필터 내부 닫기 버튼 연결
                    />
                )}

                {/* 큐레이션 목록 */}
                <CurationList
                    curations={scrappedCurations}
                    onItemClick={handleItemClick}
                    onBookmarkClick={handleBookmarkClick}
                />
            </main>
        </div>
    );
}