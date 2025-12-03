import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from 'axios';
import SearchBar3_3 from "../../../../components/Bar/SearchBar3-3";
import QnAItem from "../qna/QnAItem";
import Header from '../../../../components/Header/Header';
import GlobalHeader from "../../../../components/atoms/header/GlobalHeader";
import { useAuth } from "../../../../contexts/AuthContext";
import styles from './writeQnA.module.css';
import CurationFilter2 from "../../../../components/Filter/CurationFilter2";

// --- [카테고리/타입 매핑 데이터] ---
const LABEL_TO_BACKEND_CATEGORY = {
  "인문사회 전체": "인문사회", "자연과학 전체": "자연과학", "공학·기술 전체": "공학·기술",
  "경제·경영 전체": "경제·경영", "예술·문화 전체": "예술·문화", "스포츠·라이프스타일 전체": "스포츠·라이프스타일",
};

const CATEGORY_NAME_TO_ID = {
  "인문사회": 1, "자연과학": 2, "공학·기술": 3, "경제·경영": 4, "예술·문화": 5, "스포츠·라이프스타일": 6,
  "철학": 7, "역사": 8, "사회학": 9, "언어": 10, "심리": 11,
  "수학": 12, "물리": 13, "화학": 14, "생물": 15, "의료": 16,
  "IT": 17, "AI": 18, "전자": 19, "기계": 20, "산업공학": 21,
  "경제": 22, "비즈니스": 23, "마케팅": 24,
  "미술": 25, "음악": 26, "문학": 27, "UI/UX": 28, "건축": 29, "영화": 30,
  "건강": 31, "스포츠": 32, "여행": 33, "생활": 34, "환경": 35,
};

const BASE_API_URL = process.env.REACT_APP_API_BASE_URL + "/api/mypage/my-qna"; // API_BASE 변수 사용 가정

export default function WriteQnA() {
  const { accessToken, refreshAccessToken } = useAuth(); // refreshAccessToken 추가

  const [searchTerm, setSearchTerm] = useState("");
  const [inputSearchTerm, setInputSearchTerm] = useState("");
  // 'Qn' (최신순) | 'nA' (답변 수 순)
  const [sortBy, setSortBy] = useState("Qn");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({
    types: [], // Q&A에는 유형(타입) 필터가 없으므로 무시됨
    humanities: [],
    science: [],
    tech: [],
    economy: [],
    art: [],
    sport: [],
  });

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSearchChange = (value) => setInputSearchTerm(value);
  const handleSortChange = (value) => setSortBy(value);
  const handleFilterToggle = () => setIsFilterOpen((prev) => !prev);
  const handleFilterChange = (nextValues) => {
      // 4️⃣ WQA -> 최종 필터 수신: 로그를 함수 본문 안에 넣습니다.
      console.log('4️⃣ WQA -> 최종 필터 수신:', nextValues);
      setFilterValues(nextValues); // setFilterValues도 함수 본문 안에 넣습니다.
  };


  // ⭐ 검색어 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputSearchTerm !== searchTerm) {
        setSearchTerm(inputSearchTerm);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [inputSearchTerm, searchTerm]);

  // ⭐ filterValues → useMemo로 stringify 최적화 (API 재호출 의존성)
  // 의존성 배열에 객체 대신 문자열을 넣어 불필요한 API 호출 방지
  const filterValuesKey = useMemo(() => {
    return JSON.stringify(filterValues);
  }, [filterValues]);

  console.log('WQA: API 호출 의존성:', filterValuesKey)

  // API 요청 함수
  const fetchQuestions = useCallback(async (token) => {
    setLoading(true);
    setError(null);

    let sortParam = "";
    let qnaType = "question"; // 기본값은 질문글
    let needsFrontendSort = false; // ⭐️ 프론트엔드 정렬 필요 여부 플래그

    if (sortBy === "Qn") {
        qnaType = "question";
        sortParam = "createdAt,desc"; // 질문글은 최신순
    } else if (sortBy === "nA") {
        // ⭐️ 답변 수 정렬을 위해 type=question으로 요청 (내가 작성한 질문글 중)
        qnaType = "question";
        // 백엔드에 답변 수 정렬 파라미터가 없다고 가정하고 최신순으로 일단 가져옴
        sortParam = "createdAt,desc";
        needsFrontendSort = true; // ⭐️ 프론트엔드에서 답변 수 기준으로 정렬 필요
    }
    // 💡 참고: 만약 '나의 답글' 목록을 보려면 qnaType을 'answer'로 설정해야 합니다.

const allSelectedLabels = [
        ...filterValues.humanities,
        ...filterValues.science,
        ...filterValues.tech,
        ...filterValues.economy,
        ...filterValues.art,
        ...filterValues.sport,
    ];

    // 레이블을 ID로 변환 (CATEGORY_NAME_TO_ID 사용)
    const categoryIds = allSelectedLabels
        .map(label => CATEGORY_NAME_TO_ID[label])
        .filter(id => id !== undefined);

    // 기본 파라미터 구성
    const params = {
      type: qnaType,
      page: 0,
      size: 100,
      ...(searchTerm && { query: searchTerm }),
      ...(sortParam && { sort: sortParam }),
      // ★ 핵심 수정: 카테고리 ID 배열을 쉼표로 구분된 문자열로 변환하여 추가
      ...(categoryIds.length > 0 && { categoryIds: categoryIds.join(',') }), 
    };

    // [추가 끝]
    
    const queryString = new URLSearchParams(params).toString();
    const API_PATH = `${BASE_API_URL}?${queryString}`;

console.log("--- QnA 요청 정보 ---");
    console.log("Type:", qnaType);
    console.log("SortBy:", sortBy);
    console.log("요청 URL:", API_PATH); // ★ 이 로그가 백엔드로 전송되는 최종 URL을 보여줍니다.
    console.log("-----------------------");

    try {
      const response = await axios.get(API_PATH, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      let fetchedQuestions = response.data?.content || response.data || [];

      // ⭐️ 답변 수 정렬이 필요한 경우, 프론트엔드에서 직접 정렬
      if (needsFrontendSort) {
          fetchedQuestions = fetchedQuestions.sort((a, b) => {
              const countA = a.answers ? a.answers.length : 0;
              const countB = b.answers ? b.answers.length : 0;
              // 내림차순 정렬 (답변 수가 많은 순)
              return countB - countA; 
          });
      }

      setQuestions(fetchedQuestions); // ⭐️ 정렬된 데이터로 상태 업데이트
      setLoading(false);
    } catch (err) {
      console.error("질문 목록 Fetch 1차 실패:", err);
      // 401 에러가 발생했을 때만 토큰 재발급 후 재시도 (AllCuration.js 방식 적용)
      if (err.response?.status === 401) {
        try {
          const newToken = await refreshAccessToken();
          if (!newToken) {
            setLoading(false);
            return;
          }

          // 새 토큰으로 재요청
          const retryResponse = await axios.get(API_PATH, {
            headers: { Authorization: `Bearer ${newToken}` },
          });
          setQuestions(retryResponse.data?.content || retryResponse.data || []);
          setLoading(false);
        } catch (retryErr) {
          console.error("토큰 재발급 후 /mypage/my-qna 재시도 실패:", retryErr);
          setError("로그인 세션 만료 또는 데이터 로딩 실패.");
          setLoading(false);
        }
      } else {
        setError("데이터를 불러오는 데 실패했습니다.");
        setLoading(false);
      }
    }
  }, [accessToken, searchTerm, sortBy, filterValuesKey, refreshAccessToken]); // 의존성 배열 최적화

  // ⭐ 안정적인 fetch 트리거
  useEffect(() => {
    if (accessToken) {
      fetchQuestions(accessToken);
    } else {
      setLoading(false);
    }
  }, [fetchQuestions, accessToken]);

  if (loading) return <div className={styles.loading}>데이터를 불러오는 중입니다...</div>;
  if (error) return <div className={styles.error} style={{ color: "red" }}>에러: {error}</div>;

  return (
    <div className="app-wrapper">
      <GlobalHeader />
      <Header title="내가 작성한 QnA" />
      <SearchBar3_3
          onFilterClick={handleFilterToggle}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
          searchTerm={inputSearchTerm}
          activeSort={sortBy}
        />

      <main className="content">
        {isFilterOpen && (
          <div
            className={styles["curation-filter-backdrop"]}
            onClick={() => setIsFilterOpen(false)}
          />
        )}

        <CurationFilter2
          isOpen={isFilterOpen}
          value={filterValues}
          onChange={handleFilterChange}
        />

        <div className={styles.qnaList}>
          {questions.length > 0 ? (
            questions.map((q) => (
              <QnAItem
                key={q.questionId}
                id={q.questionId}
                title={q.questionTitle}
                previewContent={q.questionContent}
                // API 응답에 likes 필드가 없다면 0을 사용하거나, 백엔드에 요청하여 추가해야 합니다.
                likes={q.likeCount ?? 0}
                comments={q.answers ? q.answers.length : 0}
                date={q.questionCreatedAt}
              />
            ))
          ) : (
            <p className={styles.noResult}>작성한 질문이 없습니다.</p>
          )}
        </div>
      </main>
    </div>
  );
}