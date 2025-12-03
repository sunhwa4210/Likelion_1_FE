import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CurationList2 from "../../../../components/Curation/CurationList2";
import CurationFilter from "../../../../components/Filter/CurationFilter";
import Header from "../../../../components/Header/Header";
import GlobalHeader from "../../../../components/Header/GlobalHeader";
import SearchBar2_2 from "../../../../components/Bar/SearchBar2-2";
import { useModal } from "../../../../components/Modal/ModalProvider";
import { presets } from "../../../../components/Modal/presets";
import { useAuth } from "../../../../contexts/AuthContext";
import styles from "./ScrapCurationDetail.module.css"; 

// 🚨 API 필터링을 위한 매핑 데이터 
const LABEL_TO_BACKEND_CATEGORY = {
  "인문사회 전체": "인문사회", "자연과학 전체": "자연과학", "공학·기술 전체": "공학·기술", 
  "경제·경영 전체": "경제·경영", "예술·문화 전체": "예술·문화", "스포츠·라이프스타일 전체": "스포츠·라이프스타일",
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

    // 핸들러 함수들 (useCallback 유지)
    const handleSearchChange = useCallback((value) => { setInputSearchTerm(value); }, []);
    const handleSortChange = useCallback((key) => { setSortBy(key); }, []);
    const handleFilterToggle = useCallback(() => { setIsFilterOpen(prev => !prev); }, []);
    const handleCloseFilter = useCallback(() => { setIsFilterOpen(false); }, []);
    const handleFilterChange = useCallback((newFilters) => { setActiveFilters(newFilters); }, []);
    const handleBadgeFilterChange = useCallback((badgeType) => { setCurrentBadgeFilter(badgeType.toUpperCase()); }, []);

    // 검색어 지연 useEffect 유지
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (inputSearchTerm !== searchTerm) {
                setSearchTerm(inputSearchTerm);
            }
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [inputSearchTerm, searchTerm]);

    
    // 💡 [핵심 해결]: API 요청 파라미터를 useMemo를 사용하여 문자열로 직렬화합니다.
    const apiParamsString = useMemo(() => {
        let params = {};
        
        // 1. 정렬 파라미터
        let sortParam = "";
        if (sortBy === "latest") sortParam = "scrapedAt,desc";
        else if (sortBy === "popular") sortParam = "likeCount,desc";
        if (sortParam) { params.sort = sortParam; }
        
        // 2. 검색어 및 뱃지
        if (searchTerm) { params.query = searchTerm; }
        if (currentBadgeFilter) { params.badge = currentBadgeFilter; }

        // 3. 상세 필터 (Category ID 및 Curation Type)
        const { humanities, science, tech, economy, art, sport, types } = activeFilters;
        const selectedCategoryNames = [ ...humanities, ...science, ...tech, ...economy, ...art, ...sport, ];
        const backendCategoryNames = selectedCategoryNames.map((label) => LABEL_TO_BACKEND_CATEGORY[label] || label);
        
        if (backendCategoryNames.length > 0) {
            const categoryIds = backendCategoryNames.map((name) => CATEGORY_NAME_TO_ID[name]).filter(Boolean);
            if (categoryIds.length > 0) { params.categoryId = categoryIds.join(","); }
        }
        if (types && types.length > 0) {
            const mappedTypes = types.map((label) => TYPE_LABEL_TO_VALUE[label]).filter(Boolean);
            if (mappedTypes.length > 0) { params.curationType = mappedTypes.join(","); }
        }

        // 최종 파라미터 객체를 URLSearchParams를 이용해 안정적인 문자열로 변환
        return new URLSearchParams(params).toString();
        
    }, [sortBy, searchTerm, currentBadgeFilter, activeFilters]); // activeFilters 객체가 변경될 때만 재계산

    
    useEffect(() => {
    // 토큰 없으면 요청하지 않습니다.
    if (!accessToken) {
        console.log("인증 토큰이 없어 스크랩 목록을 가져오지 않습니다.");
        return;
    }

    let isMounted = true; 
    
    // URL 파라미터가 비어 있지 않다면 '?'를 붙이고, 비어 있다면 빈 문자열을 사용
    const querySuffix = apiParamsString ? `?${apiParamsString}` : '';
    const apiUrl = `${SCRAP_API_ENDPOINT}${querySuffix}`; 

    const fetchCurations = async (retry = false) => {
        try {
            const token = retry ? await refreshAccessToken() : accessToken;
            if (!token) return;

            const response = await fetch(apiUrl, { 
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            });
            
            if (!response.ok) {
                if (response.status === 401 && !retry) {
                    return fetchCurations(true); // 재시도
                }
                throw new Error(`스크랩 목록 로드 실패: ${response.status}`);
            }
            
            const rawData = await response.json();
            
            if (isMounted) {
                // 데이터 변환 로직 
                const transformedData = rawData.map(item => ({ 
                    id: item.curationId, 
                    imageUrl: item.imageUrl,
                    insightBadge: item.curationType === 'INSIGHT',
                    crossNoteBadge: item.curationType === 'CROSSNOTE',
                    bestCalumBadge: item.curationType === 'BEST_COLUMN',
                    fieldBadges: item.crossCategoryName 
                        ? [item.categoryName, item.crossCategoryName] 
                        : [item.categoryName],
                    content: { title: item.title, description: item.description, sourceUrl: item.sourceUrl },
                    likes: item.likeCount ?? 0,
                    isLiked: item.isLikedByUser ?? false,
                    isBookmarked: true,
                }));
                setScrappedCurations(transformedData);
            }

        } catch (error) {
            if (isMounted) {
                console.error("스크랩 목록 로드 실패:", error);
            }
            // 토큰 갱신 후에도 실패했거나 네트워크 오류 발생 시 로그아웃 처리
            if (error.message.includes('스크랩 목록 로드 실패') && !retry) {
                await logout();
            }
        } 
    };

    fetchCurations();

    return () => {
        isMounted = false;
    };
    
    }, [accessToken, apiParamsString, logout, refreshAccessToken]);


    // 상세 페이지 이동 핸들러
    const handleItemClick = (curationId) => {
        navigate(`/curation/${curationId}`);
    };

    // 북마크 클릭 (스크랩 취소) 핸들러
    const handleBookmarkClick = async (curationId) => {
        const res = await open(presets.scrapDelete());

        if (res === 'delete') {
            try {
                // 스크랩 삭제 API 호출
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
                
                // 목록에서 수동으로 제거하여 UI 업데이트
                setScrappedCurations(prev =>
                    prev.filter(curation => curation.id !== curationId)
                );
            } catch (error) {
                console.error("스크랩 삭제 API 호출 실패:", error);
            }
        }
    };

    const handleLikeChange = useCallback((curationId, newLikeCount, newLiked) => {
        // CurationLikeButton에서 좋아요 토글 후 호출됩니다.
        setScrappedCurations(prev =>
            prev.map(curation =>
                curation.id === curationId
                    ? { 
                        ...curation, 
                        likes: newLikeCount, 
                        isLiked: newLiked 
                    }
                    : curation
            )
        );
    }, []);


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

                <CurationList2
                    curations={scrappedCurations}
                    onItemClick={handleItemClick}
                    onBookmarkClick={handleBookmarkClick}
                onLikeChange={handleLikeChange}
            />

        </div>
    );
}
