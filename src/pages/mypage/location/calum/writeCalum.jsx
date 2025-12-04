import React, { useState, useEffect } from "react";
// SearchBar1 임포트 시, 필터 관련 props를 연결하지 않으면 필터 버튼은 작동하지 않거나 무시됩니다.
import SearchBar1_1 from '../../../../components/Bar/SearchBar1-1';
import Header from '../../../../components/Header/Header';
import GlobalHeader from "../../../../components/Header/GlobalHeader";
import CalumItem from './CalumItem';
import { useAuth } from "../../../../contexts/AuthContext";
import apiClient from "../follow/apiClient";
import CurationFilter from '../../../../components/Filter/CurationFilter';
import styles from './writeCalum.module.css';
import { categories } from '../../../../components/Badges/CategoryData';

// ===============================================
// ✅ [핵심 변경: 더미 데이터 플래그]
// TRUE로 설정하면 API를 호출하지 않고 더미 데이터로 테스트
const USE_DUMMY_DATA = false;
// ===============================================

// --- [카테고리/타입 매핑 데이터] ---
const LABEL_TO_BACKEND_CATEGORY = {
  "인문사회 전체": "인문사회",
  "자연과학 전체": "자연과학",
  "공학·기술 전체": "공학·기술",
  "경제·경영 전체": "경제·경영",
  "예술·문화 전체": "예술·문화",
  "스포츠·라이프스타일 전체": "스포츠·라이프스타일",
};

const CATEGORY_NAME_TO_ID = categories.reduce((acc, item) => {
    // num이 있고, label이 있는 항목만 처리
    if (item.num && item.label) {
        // num은 문자열이므로 숫자로 변환하여 저장
        acc[item.label] = Number(item.num);
    }
    return acc;
}, {});

// --- [더미 데이터 정의] ---
const DUMMY_CALUMS = [
    // 101: AI(18) -> AI(18), 철학(7) -> 철학(7). 변경 없음.
    { columnId: 101, title: "인공지능의 윤리적 딜레마", isBestColumn: true, likeCount: 45, commentCount: 12, categoryId1: 18, categoryId2: 7, categoryId3: null, authorId: 1 }, 
    // 102: IT(17) -> IT(17), 산업공학(21) -> 산업공학(21). 변경 없음.
    { columnId: 102, title: "React Hooks 깊이 이해하기 (인기)", isBestColumn: false, likeCount: 80, commentCount: 5, categoryId1: 17, categoryId2: 21, categoryId3: null, authorId: 1 },
    // 103: 역사(8) -> 역사(8), 언어(10) -> 언어(10). 변경 없음.
    { columnId: 103, title: "고대 로마의 흥망성쇠", isBestColumn: false, likeCount: 15, commentCount: 3, categoryId1: 8, categoryId2: 10, categoryId3: null, authorId: 1 }, 
    // 104: 심리(11) -> 심리(11), UI/UX(28) -> UI/UX(28). 변경 없음.
    { columnId: 104, title: "심리학으로 알아보는 사용자 경험", isBestColumn: true, likeCount: 78, commentCount: 20, categoryId1: 11, categoryId2: 28, categoryId3: null, authorId: 1 }, 
    // 105: 인문사회(1) -> 인문사회(1), 생활(34) -> 생활(34). 변경 없음.
    { columnId: 105, title: "글쓰기 능력을 향상시키는 5가지 습관", isBestColumn: false, likeCount: 5, commentCount: 1, categoryId1: 1, categoryId2: 34, categoryId3: null, authorId: 1 }, 
    // 106: 전자(19) -> 전자(19). 변경 없음.
    { columnId: 106, title: "전자기학 기본 원리 (인기)", isBestColumn: false, likeCount: 90, commentCount: 10, categoryId1: 19, categoryId2: null, categoryId3: null, authorId: 1 }, 
    // 107: IT(17) -> IT(17), AI(18) -> AI(18). 변경 없음.
    { columnId: 107, title: "데이터 분석과 IT", isBestColumn: false, likeCount: 22, commentCount: 7, categoryId1: 17, categoryId2: 18, categoryId3: null, authorId: 1 }, 
    // 108: 심리(11) -> 심리(11), 마케팅(24) -> 마케팅(24)로 가정 (24는 CATEGORY_NAME_TO_ID에 없었지만 DUMMY_CALUMS의 기존 규칙을 따름)
    { columnId: 108, title: "마케팅 심리학 (최신)", isBestColumn: true, likeCount: 10, commentCount: 5, categoryId1: 11, categoryId2: 24, categoryId3: null, authorId: 1 }, 
    // 109: 기계(20) -> 기계(20), 산업공학(21) -> 산업공학(21). 변경 없음.
    { columnId: 109, title: "기계 공학의 미래", isBestColumn: false, likeCount: 33, commentCount: 8, categoryId1: 20, categoryId2: 21, categoryId3: null, authorId: 1 }, 
    // 110: 철학(7) -> 철학(7), 역사(8) -> 역사(8). 변경 없음.
    { columnId: 110, title: "인문학 고전 읽기", isBestColumn: false, likeCount: 18, commentCount: 2, categoryId1: 7, categoryId2: 8, categoryId3: null, authorId: 1 }, 
    // 111: IT(17) -> IT(17). 변경 없음.
    { columnId: 111, title: "테스트용 최신 칼럼", isBestColumn: false, likeCount: 1, commentCount: 0, categoryId1: 17, categoryId2: null, categoryId3: null, authorId: 1 },
];

// --- [API 데이터 매핑 함수] ---
const mapApiDataToComponentProps = (apiItem, user) => {
    return {
        id: apiItem.columnId,
        title: apiItem.title,
        author: user ? (user.nickname || user.name || "작성자") : "나의 작성자 (나)",
        imageUrl: "placeholder-image-url.jpg",
        isPremium: apiItem.isBestColumn,
        likesCount: apiItem.likeCount,
        commentsCount: apiItem.commentCount,
        // CalumItem의 내부 로직을 위해 API 원본의 categoryId 필드를 그대로 전달
        categoryId1: apiItem.categoryId1,
        categoryId2: apiItem.categoryId2,
        categoryId3: apiItem.categoryId3,
    };
};


export default function WriteCalum () {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    // 필터 값 상태는 유지 (UI가 여전히 사용)
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
    
    // 🏆 필터 변경 핸들러는 유지 (UI 동작을 위해)
    const handleFilterChange=(nextValues)=>{
        setFilterValues(nextValues);
        setCurrentPage(0); 
        console.log("WriteCalum 필터 값 변경:", nextValues, "(더미 데이터 모드에서는 로직에 반영되지 않음)");
    };
    
    // ✅ API 데이터 fetch 로직 / 더미 데이터 로직
    useEffect(() => {
        setIsLoading(true);
        setError(null);
        
        // ===============================================
        // 🚨 [구분 시작] 더미 데이터 테스트 로직 (필터 로직 제거)
        // ===============================================
        if (USE_DUMMY_DATA) {
            console.log("🚨 [더미 데이터 모드] API 호출 대신 더미 데이터를 사용합니다. (필터 값 무시됨)");
            
            let filteredCalums = DUMMY_CALUMS.filter(item => {
                // 검색어 필터링: 검색어가 없거나 제목에 포함되면 포함
                const isSearchMatch = !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
                return isSearchMatch;
            });
            
            // 정렬
            filteredCalums.sort((a, b) => {
                if (sortBy === "latest") { // 최신순 (columnId가 높을수록 최근이라 가정)
                    return b.columnId - a.columnId;
                } else if (sortBy === "popular") { // 인기순 (좋아요 수)
                    return b.likeCount - a.likeCount;
                } else if (sortBy === "comments") { // 댓글순
                    return b.commentCount - a.commentCount;
                }
                return 0;
            });

            // 페이지네이션 적용
            const totalItems = filteredCalums.length;
            const start = currentPage * pageSize;
            const end = start + pageSize;
            const paginatedCalums = filteredCalums.slice(start, end);
            
            const totalPages = Math.ceil(totalItems / pageSize) || 1;
            
            // API 호출 지연을 흉내
            const delay = setTimeout(() => {
                setCalums(paginatedCalums.map(item => mapApiDataToComponentProps(item, user)));
                setTotalPageCount(totalPages);
                setIsLoading(false);
            }, 500); // 0.5초 지연

            return () => clearTimeout(delay); // Cleanup

        } 
        // ===============================================
        // 🚨 [구분 끝] 더미 데이터 테스트 로직
        // ===============================================
        
        // ===============================================
        // 💻 [구분 시작] 실제 API 연결 로직 (USE_DUMMY_DATA = false일 때만 실행)
        // ===============================================
        const fetchCalums = async () => {
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

            // 3. 카테고리 필터 파라미터 구성 (API 연결 시에는 필요함)
            const { humanities, science, tech, economy, art, sport } = filterValues;
            
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

            const queryString = new URLSearchParams(params).toString();
            const API_PATH = `/mypage/my-columns?${queryString}`;

            console.log("➡️ [API 요청] 칼럼 목록 로드 시작");
            console.log("   Endpoint:", API_PATH);
            
            try {
                const response = await apiClient.get(API_PATH); 
                const responseData = response.data;
                const apiCalums = responseData.content || [];

                console.log("✅ [API 성공] 응답 데이터 (일부):", responseData);

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
        
        // 🏆 실제 API 연결 모드일 때만 fetchCalums 호출
        if (!USE_DUMMY_DATA) {
             fetchCalums();
        }
        // ===============================================
        // 💻 [구분 끝] 실제 API 연결 로직
        // ===============================================

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
            {/* 필터 UI 영역은 유지 */}
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