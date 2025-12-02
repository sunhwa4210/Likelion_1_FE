import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CurationList from "../../../../components/Curation/CurationList";
import CurationFilter from "../../../../components/Filter/CurationFilter";

import Header from "../../../../components/Header/Header";
import GlobalHeader from "../../../../components/atoms/header/GlobalHeader";
import SearchBar2_2 from "../../../../components/Bar/SearchBar2-2";
import {useModal} from "../../../../components/Modal/ModalProvider";
import { presets } from "../../../../components/Modal/presets";
import { useAuth } from "../../../../contexts/AuthContext";
import styles from "./ScrapCurationDetail.module.css"; 

// 🚨 API 필터링을 위한 매핑 데이터 (AllCuration.js와 일관성을 위해 추가)
const LABEL_TO_BACKEND_CATEGORY = {
  "인문사회 전체": "인문사회",
  "자연과학 전체": "자연과학",
  "공학·기술 전체": "공학·기술",
  "경제·경영 전체": "경제·경영",
  "예술·문화 전체": "예술·문화",
  "스포츠·라이프스타일 전체": "스포츠·라이프스타일",
};

const CATEGORY_NAME_TO_ID = {
  // 최상위
  "인문사회": 1, "자연과학": 2, "공학·기술": 3, "경제·경영": 4, "예술·문화": 5, "스포츠·라이프스타일": 6,
  // 하위
  "철학": 7, "역사": 8, "사회학": 9, "언어": 10, "심리": 11,
  "수학": 12, "물리": 13, "화학": 14, "생물": 15, "의료": 16,
  "IT": 17, "AI": 18, "전자": 19, "기계": 20, "산업공학": 21,
  "경제": 22, "비즈니스": 23, "마케팅": 24,
  "미술": 25, "음악": 26, "문학": 27, "UI/UX": 28, "건축": 29, "영화": 30,
  "건강": 31, "스포츠": 32, "여행": 33, "생활": 34, "환경": 35,
};

const TYPE_LABEL_TO_VALUE = {
  "베스트칼럼": "BEST_COLUMN", "BEST_COLUMN": "BEST_COLUMN",
  "인사이트": "INSIGHT", "INSIGHT": "INSIGHT",
  "크로스노트": "CROSSNOTE", "CROSSNOTE": "CROSSNOTE",
};

// API 기본 주소를 설정합니다.
const API_BASE = process.env.REACT_APP_API_BASE_URL || "";
// 🏆 경로 수정: /curation/scraps -> /api/mypage/scrapped-curations
const SCRAP_API_ENDPOINT = `${API_BASE}/api/mypage/scrapped-curations`; 

const INITIAL_FILTER_VALUES = {
    types: [], humanities: [], science: [], tech: [], economy: [], art: [], sport: [],
};

export default function ScrapCuration () {
    const { open } = useModal();
    const navigate = useNavigate();
    const { accessToken, logout, refreshAccessToken } = useAuth(); 
    
    const [inputSearchTerm, setInputSearchTerm] = useState(""); 
    const [searchTerm, setSearchTerm] = useState(""); 
    const [sortBy, setSortBy] = useState("latest"); 

    const [scrappedCurations, setScrappedCurations] = useState([]);
    const [currentBadgeFilter, setCurrentBadgeFilter] = useState(null); 
    
    const [isFilterOpen, setIsFilterOpen] = useState(false); 
    const [activeFilters, setActiveFilters] = useState(INITIAL_FILTER_VALUES);

    const handleSearchChange = useCallback((value) => {
        setInputSearchTerm(value);
    }, []);

    const handleSortChange = useCallback((key) => {
        setSortBy(key);
    }, []);

    const handleFilterToggle = useCallback(() => {
        setIsFilterOpen(prev => !prev);
    }, []);

    const handleCloseFilter = useCallback(() => {
        setIsFilterOpen(false);
    }, []);

    const handleFilterChange = useCallback((newFilters) => {
        setActiveFilters(newFilters);
    }, []);

    const handleBadgeFilterChange = (badgeType) => {
        // 백엔드 요청을 위해 뱃지 유형을 대문자 문자열로 설정합니다.
        setCurrentBadgeFilter(badgeType.toUpperCase());
    };

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (inputSearchTerm !== searchTerm) {
                setSearchTerm(inputSearchTerm);
            }
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [inputSearchTerm, searchTerm]);


    const fetchScrapList = useCallback(async () => {
        if (!accessToken) {
            console.log("인증 토큰이 없어 스크랩 목록을 가져오지 않습니다.");
            return;
        }

        let params = {}; 
        
        try {
            // 1. 정렬 파라미터 구성
            let sortParam = "";
            if (sortBy === "latest") sortParam = "scrapedAt,desc"; 
            else if (sortBy === "popular") sortParam = "likeCount,desc"; 
            
            if (sortParam) {
                params.sort = sortParam;
            }

            // 2. 검색어 파라미터 구성
            if (searchTerm) {
                params.query = searchTerm;
            }

            // 3. 뱃지 필터 파라미터 구성
            if (currentBadgeFilter) {
                params.badge = currentBadgeFilter;
            }
            
            // 4. 상세 필터 (Category ID 및 Curation Type) 파라미터 구성
            const { humanities, science, tech, economy, art, sport, types } = activeFilters;
            
            const selectedCategoryNames = [
                ...humanities, ...science, ...tech, ...economy, ...art, ...sport,
            ];

            const backendCategoryNames = selectedCategoryNames.map((label) => {
                return LABEL_TO_BACKEND_CATEGORY[label] || label; 
            });

            if (backendCategoryNames.length > 0) {
                const categoryIds = backendCategoryNames
                    .map((name) => CATEGORY_NAME_TO_ID[name])
                    .filter(Boolean);

                if (categoryIds.length > 0) {
                    params.categoryId = categoryIds.join(","); 
                }
            }

            // 큐레이션 유형(types) 매핑
            if (types && types.length > 0) {
                const mappedTypes = types
                    .map((label) => TYPE_LABEL_TO_VALUE[label])
                    .filter(Boolean);

                if (mappedTypes.length > 0) {
                    // API 명세에 curationType 필터가 따로 없으므로, categoryId로 통합하거나, 
                    // 백엔드 명세에 따라 params.curationType으로 전달합니다. (유형을 badge로 처리하는 것으로 가정)
                    // 현재 로직에서는 badge 파라미터가 이미 큐레이션 유형을 처리하므로, 여기서는 제외합니다.
                }
            }

            // 최종 API URL 구성
            const queryString = new URLSearchParams(params).toString();
            const querySuffix = queryString ? `?${queryString}` : '';
            // 🏆 수정된 엔드포인트 사용
            const apiUrl = `${SCRAP_API_ENDPOINT}${querySuffix}`; 

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`, 
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    try {
                        await refreshAccessToken(); 
                    } catch (e) {
                        console.error("토큰 재발급 실패:", e);
                    }
                    logout(); 
                    return;
                }
                throw new Error(`스크랩 목록 로드 실패: ${response.status}`);
            }
            
            const rawData = await response.json();
            // 🏆 응답이 배열 형태이므로 'content' 필드 없이 rawData 자체를 사용합니다.
            const content = rawData; 

            // 응답 데이터 변환
            const transformedData = content.map(item => ({
                id: item.curationId, 
                imageUrl: item.imageUrl,
                insightBadge: item.curationType === 'INSIGHT',
                crossNoteBadge: item.curationType === 'CROSSNOTE',
                bestCalumBadge: item.curationType === 'BEST_COLUMN',
                // 🏆 응답 예시에서 'field'를 사용하므로 해당 필드를 사용합니다.
                fieldBadges: item.field ? [item.field] : [], 
                content: item.title, 
                likes: item.likeCount ?? 0, 
                isBookmarked: true, 
            }));

            setScrappedCurations(transformedData);
        } catch (error) {
            console.error("스크랩 목록 로드 실패:", error);
        } 
    }, [currentBadgeFilter, activeFilters, accessToken, logout, searchTerm, sortBy, refreshAccessToken]); 

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
                // 스크랩 삭제 API는 기존 경로 유지한다고 가정합니다.
                const response = await fetch(`${API_BASE}/curation/${curationId}/scrap`, { 
                    method: 'DELETE',
                    headers: { 
                        'Authorization': `Bearer ${accessToken}`, 
                    },
                });
                
                if (!response.ok) {
                    if (response.status === 401) {
                        logout();
                        return;
                    }
                    throw new Error('스크랩 삭제 실패'); 
                }
                
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
            <GlobalHeader />
            <Header title="내가 스크랩한 큐레이션"/>
            <SearchBar2_2
                onFilterClick={handleFilterToggle} 
                onBadgeFilterChange={handleBadgeFilterChange} 
                onSearchChange={handleSearchChange} 
                onSortChange={handleSortChange} 
                searchTerm={inputSearchTerm} 
                activeSort={sortBy} 
             />

            <main className="content">
                
                {isFilterOpen && (
                    <div
                        className={styles["curation-filter-backdrop"]} 
                        onClick={handleCloseFilter} 
                    />
                )}

                <CurationFilter 
                    isOpen={isFilterOpen} 
                    value={activeFilters} 
                    onChange={handleFilterChange} 
                    onClose={handleCloseFilter}
                />

                <CurationList
                    curations={scrappedCurations}
                    onItemClick={handleItemClick}
                    onBookmarkClick={handleBookmarkClick}
                />

            </main>
        </div>
    );
}