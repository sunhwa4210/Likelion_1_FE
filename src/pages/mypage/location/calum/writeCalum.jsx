import React, { useState, useEffect } from "react";
import SearchBar1 from '../../../../components/Bar/SearchBar1';
import Header from '../../../../components/Header/Header';
import Globalheader from "../../../../components/atoms/Header/header";
import CalumItem from './CalumItem';

// ⚠️ 실제 API 연결 시 DummyData는 제거하거나 주석 처리
// import { DummyCalums } from "./dummyCalum"; 
// import QnAItem from "../qna/QnAItem"; // 사용하지 않으면 제거
// import { DummyQuestions } from "../qna/dummyQnA"; // 사용하지 않으면 제거

// 🚨 [가정] 카테고리 ID를 뱃지 레이블(문자열)로 변환하기 위한 맵 (실제 데이터에 맞게 수정 필요)
// CalumItem.jsx에서 사용하는 CategoryXselector를 위해 이 변환은 필수입니다.
const CATEGORY_ID_TO_LABEL_MAP = {
    5: "IT", 6: "개발", 7: "사회학", 8: "IT",
    // ⚠️ 백엔드에서 제공하는 모든 카테고리 ID와 레이블을 여기에 매핑해야 합니다.
    // 예: 1: "경영", 2: "디자인", ...
};

const mapApiDataToComponentProps = (apiItem) => {
    // categoryId를 뱃지 문자열 배열로 변환하는 로직
    const getBadges = (item) => {
        const categoryIds = [item.categoryId1, item.categoryId2, item.categoryId3];
        return categoryIds
            .filter(id => id !== null)
            .map(id => CATEGORY_ID_TO_LABEL_MAP[id])
            .filter(label => label); // 맵에 없는 ID로 인해 undefined가 된 경우 필터링
    };

    return {
        id: apiItem.columnId,
        badges: getBadges(apiItem), 
        title: apiItem.title,
        // API에 author 이름이 없으므로, 현재 사용자 이름으로 고정
        author: "나의 작성자 (나)", 
        imageUrl: "placeholder-image-url.jpg", // API에 이미지가 없으므로 임시 URL 사용
        // isBestColumn을 isPremium (왕관 아이콘) 표시용으로 매핑 가정
        isPremium: apiItem.isBestColumn, 
        likesCount: apiItem.likeCount,
        commentsCount: apiItem.commentCount,
    };
};


export default function WriteCalum () {
    // 칼럼 목록 상태
    const [calums, setCalums] = useState([]);
    // 로딩 및 에러 상태
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // ⭐️ 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(0);      // 현재 페이지 번호 (0부터 시작)
    const [pageSize, setPageSize] = useState(10);          // 한 페이지당 항목 수
    const [totalPageCount, setTotalPageCount] = useState(1); // 전체 페이지 수
    
    // ✅ API 데이터 fetch 로직
    useEffect(() => {
        const fetchCalums = async () => {
            setIsLoading(true);
            setError(null);
            
            // 🚨 실제 API 엔드포인트 및 토큰으로 변경해야 합니다.
            const BASE_URL = 'https://api.yourdomain.com'; 
            const token = 'YOUR_ACTUAL_JWT_TOKEN'; 

            // 페이지와 사이즈를 쿼리 파라미터로 포함
            const API_PATH = `/api/mypage/my-columns?page=${currentPage}&size=${pageSize}`;
            
            try {
                const response = await fetch(`${BASE_URL}${API_PATH}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // 인증 헤더
                        'Content-Type': 'application/json',
                    },
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP Error! Status: ${response.status}`);
                }

                const responseData = await response.json();
                const apiCalums = responseData.content || [];

                // 전체 페이지 수 업데이트
                setTotalPageCount(responseData.totalPages || 1); 

                // 컴포넌트 형식에 맞게 데이터 매핑 및 상태 저장
                const mappedCalums = apiCalums.map(mapApiDataToComponentProps);
                setCalums(mappedCalums);

            } catch (err) {
                console.error("Failed to fetch my columns:", err);
                setError(err.message); 
                setCalums([]);
            } finally {
                setIsLoading(false);
            }
        };
        
        // currentPage 또는 pageSize가 변경될 때마다 데이터를 다시 불러옴
        fetchCalums();
    }, [currentPage, pageSize]); 


    // 페이지 변경 핸들러 함수
    const handlePageChange = (newPage) => {
        // 유효한 페이지 범위 내에서만 변경 허용
        if (newPage >= 0 && newPage < totalPageCount) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="app-wrapper">
        <Globalheader/>
        <Header title="내가 작성한 칼럼"/>

        <main className="content">
            <SearchBar1 />
            
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
                    
                    {/* ⭐️ 페이지네이션 UI ⭐️ */}
                    {/* totalPageCount 상태를 이용해 버튼을 렌더링하고 handlePageChange 함수를 연결 */}
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