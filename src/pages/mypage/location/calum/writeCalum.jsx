import React, { useState, useEffect } from "react";
// SearchBar1 임포트 시, 필터 관련 props를 연결하지 않으면 필터 버튼은 작동하지 않거나 무시됩니다.
import SearchBar1_1 from '../../../../components/Bar/SearchBar1-1';
import Header from '../../../../components/Header/Header';
import GlobalHeader from "../../../../components/atoms/header/GlobalHeader";
import CalumItem from './CalumItem';
import { useAuth } from "../../../../contexts/AuthContext";
import apiClient from "../follow/apiClient";
import CurationFilter from '../../../../components/Filter/CurationFilter';
import styles from './writeCalum.module.css';

// --- [카테고리/타입 매핑 데이터] ---
// 🏆 [추가] '전체' 필터 라벨을 최상위 카테고리 이름으로 매핑
const LABEL_TO_BACKEND_CATEGORY = {
  "인문사회 전체": "인문사회",
  "자연과학 전체": "자연과학",
  "공학·기술 전체": "공학·기술",
  "경제·경영 전체": "경제·경영",
  "예술·문화 전체": "예술·문화",
  "스포츠·라이프스타일 전체": "스포츠·라이프스타일",
};

// Category Name -> Id 매핑 (기존과 동일)
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

// 카테고리 ID를 레이블로 변환하기 위한 맵 (기존과 동일)
const CATEGORY_ID_TO_LABEL_MAP = Object.entries(CATEGORY_NAME_TO_ID).reduce(
    (acc, [name, id]) => {
        acc[id] = name;
        return acc;
    },
    {}
);

// --- [API 데이터 매핑 함수] --- (기존과 동일)
const mapApiDataToComponentProps = (apiItem, user) => {
    const getBadges = (item) => {
        const categoryIds = [item.categoryId1, item.categoryId2, item.categoryId3];
        return categoryIds
            .filter(id => id !== null && id !== undefined)
            .map(id => CATEGORY_ID_TO_LABEL_MAP[id])
            .filter(label => label);
    };

    return {
        id: apiItem.columnId,
        badges: getBadges(apiItem), 
        title: apiItem.title,
        author: user ? (user.nickname || user.name || "작성자") : "나의 작성자 (나)", 
        imageUrl: "placeholder-image-url.jpg", 
        isPremium: apiItem.isBestColumn, 
        likesCount: apiItem.likeCount,
        commentsCount: apiItem.commentCount,
    };
};


export default function WriteCalum () {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterValues,setFilterValues] = useState({
        types: [], humanities: [], science: [], tech: [], economy: [], art: [], sport: [],
    });

    const { API_BASE, user } = useAuth();
    
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("latest"); // 'latest' | 'popular' | 'comments'

    const [calums, setCalums] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [currentPage, setCurrentPage] = useState(0); 
    const [pageSize] = useState(10); 
    const [totalPageCount, setTotalPageCount] = useState(1);
    
    // --- [SearchBar 핸들러 함수] ---
    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setCurrentPage(0); 
    }

    const handleSortChange = (value) => {
        setSortBy(value);
        setCurrentPage(0); 
    }

    const handleFilterToggle = () => {
        setIsFilterOpen((prev)=>!prev);
    }
    
    // 🏆 [수정] 필터 변경 시 페이지 리셋
    const handleFilterChange=(nextValues)=>{
        setFilterValues(nextValues);
        setCurrentPage(0); // 필터 변경 시 1페이지로 리셋
        console.log("WriteCalum 필터 값 변경:", nextValues);
    };
    
    // ✅ API 데이터 fetch 로직
    useEffect(() => {
        const fetchCalums = async () => {
            setIsLoading(true);
            setError(null);
            
            if (!API_BASE) {
                console.warn("API Base URL이 설정되지 않아 칼럼을 불러올 수 없습니다.");
                setIsLoading(false);
                return;
            }

            // 1. 정렬 파라미터 매핑
            let sortParam = "";
            if (sortBy === "latest") sortParam = "createdAt,desc";
            else if (sortBy === "popular") sortParam = "likeCount,desc";
            else if (sortBy === "comments") sortParam = "commentCount,desc"; 

            // 2. 쿼리 파라미터 기본 구성
            const params = {
                page: currentPage,
                size: pageSize,
                ...(searchTerm && { query: searchTerm }), 
                ...(sortParam && { sort: sortParam }), 
            };

            // 🏆 3. 카테고리 필터 파라미터 구성 (추가된 로직)
            const { humanities, science, tech, economy, art, sport } = filterValues;
            
            const selectedCategoryNames = [
                ...humanities, ...science, ...tech, ...economy, ...art, ...sport,
            ];

            // '전체' 라벨을 백엔드 카테고리 이름으로 변환
            const backendCategoryNames = selectedCategoryNames.map((label) => {
                return LABEL_TO_BACKEND_CATEGORY[label] || label; 
            });

            if (backendCategoryNames.length > 0) {
                const categoryIds = backendCategoryNames
                    .map((name) => CATEGORY_NAME_TO_ID[name])
                    .filter(Boolean); // 유효한 ID만 필터링

                if (categoryIds.length > 0) {
                    // 쿼리 파라미터에 categoryId 추가
                    params.categoryId = categoryIds.join(","); 
                }
            }

            const queryString = new URLSearchParams(params).toString();
            const API_PATH = `/mypage/my-columns?${queryString}`;

            console.log("➡️ [API 요청] 칼럼 목록 로드 시작");
            console.log("   Base URL:", API_BASE);
            console.log("   Endpoint:", API_PATH);
            console.log("   쿼리 파라미터:", params);
            console.log("   정렬 기준:", sortBy);
            
            try {
                const response = await apiClient.get(API_PATH); 
                const responseData = response.data;
                const apiCalums = responseData.content || [];

                console.log("✅ [API 성공] 응답 데이터 (일부):", responseData);
                console.log("   총 페이지 수:", responseData.totalPages || 1);

                setTotalPageCount(responseData.totalPages || 1); 
                const mappedCalums = apiCalums.map(item => mapApiDataToComponentProps(item, user));
                setCalums(mappedCalums);

            } catch (err) {
                const status = err.response?.status;
                let errorMessage = "데이터 로드 실패";
                
                if (status === 401) {
                    errorMessage = "인증 만료 또는 토큰 오류로 칼럼을 불러올 수 없습니다. 재로그인이 필요합니다.";
                } else if (status) {
                    errorMessage = `HTTP 오류 (${status}): ${err.message}`;
                } else {
                    errorMessage = `네트워크 오류: ${err.message}`;
                }

                console.error("Failed to fetch my columns:", err);
                setError(errorMessage); 
                setCalums([]);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchCalums();
        // 🏆 [수정] 의존성 배열에 filterValues 추가하여 필터 변경 시 API 재호출
    }, [currentPage, pageSize, API_BASE, user, searchTerm, sortBy, filterValues]); 


    // 페이지 변경 핸들러 함수 (기존과 동일)
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPageCount) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="app-wrapper">
        <GlobalHeader/>
        <Header title="내가 작성한 칼럼"/>
        <SearchBar1_1 
                    onFilterClick={handleFilterToggle} 
                    onSearchChange={handleSearchChange}
                    onSortChange={handleSortChange}
                    searchTerm={searchTerm} 
                    activeSort={sortBy}
                />

        <main className="content">
            {isFilterOpen && (
                    <div
                        className={styles["curation-filter-backdrop"]}
                        onClick={() => setIsFilterOpen(false)}
                    />
                )}

                <CurationFilter
                    isOpen={isFilterOpen}        
                    value={filterValues}        
                    onChange={handleFilterChange} 
                />

            {/* 로딩/에러 상태 처리 */}
            {isLoading && <p>칼럼 목록을 불러오는 중입니다...</p>}
            
            {error && (
                <p className="error-message">데이터 로드 실패: {error}</p>
            )}

            {!isLoading && !error && (
                <>
                    {/* 칼럼 목록 */}
                    <div className="content-list-container">
                        {calums.length > 0 ? (
                            calums.map((item) => (
                                <CalumItem key={item.id} data={item} />
                            ))
                        ) : (
                            <p>작성한 칼럼이 없습니다.</p>
                        )}
                    </div>
                    
                    {/* 페이지네이션 UI */}
                    {totalPageCount > 1 && (
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            {Array.from({ length: totalPageCount }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(index)}
                                    style={{ 
                                        margin: '0 5px', 
                                        padding: '8px 12px',
                                        cursor: 'pointer',
                                        fontWeight: index === currentPage ? 'bold' : 'normal',
                                        backgroundColor: index === currentPage ? '#eee' : 'white',
                                        border: '1px solid #ccc',
                                    }}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
            
        </main>
        </div>
    );
}