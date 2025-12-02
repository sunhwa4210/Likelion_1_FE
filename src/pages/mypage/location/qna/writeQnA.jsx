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

const BASE_API_URL = "/api/mypage/my-qna";

export default function WriteQnA() {
  const { accessToken } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [inputSearchTerm, setInputSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Qn");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({
    types: [],
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
  const handleFilterChange = (nextValues) => setFilterValues(nextValues);

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
  const filterValuesKey = useMemo(() => {
    return JSON.stringify(filterValues);
  }, [filterValues]);

  // ⭐ API 호출 함수 (최적화된 의존성)
  const fetchQuestions = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let sortParam = "";
    if (sortBy === "Qn") sortParam = "createdAt,desc"; // 최신순 (Q&A ID 기준 내림차순)
    else if (sortBy === "nA") sortParam = "answers.size,desc"; // 답변 수 순

    // 기본 파라미터 구성
    const params = {
      type: "question",
      ...(searchTerm && { query: searchTerm }),
      ...(sortParam && { sort: sortParam }),
    };

    // 💡 카테고리 필터링 로직 (스크랩 큐레이션 방식 활용)
    const { humanities, science, tech, economy, art, sport } = filterValues;
    const selected = [
      ...humanities, 
      ...science, 
      ...tech, 
      ...economy, 
      ...art, 
      ...sport
    ];
    
    // 1. 프론트엔드 라벨을 백엔드 카테고리 이름으로 변환
    const backendNames = selected.map((label) => LABEL_TO_BACKEND_CATEGORY[label] || label);

    if (backendNames.length > 0) {
      // 2. 카테고리 이름을 ID로 변환
      const ids = backendNames
        .map((name) => CATEGORY_NAME_TO_ID[name])
        .filter(Boolean); // 유효한 ID만 필터링
      
      if (ids.length > 0) {
        // 3. categoryId 파라미터에 추가 (쉼표로 구분)
        params.categoryId = ids.join(",");
      }
    }
    // 💡 카테고리 필터링 로직 끝

    const queryString = new URLSearchParams(params).toString();
    const API_PATH = `${BASE_API_URL}?${queryString}`;

    try {
      const response = await axios.get(API_PATH, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setQuestions(response.data);
    } catch (err) {
      console.error("질문 목록 Fetch Error:", err);
      setError("데이터를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, searchTerm, sortBy, filterValuesKey]); // filterValuesKey 변경 시 재호출

  // ⭐ 안정적인 fetch 트리거
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  if (loading) return <div>데이터를 불러오는 중입니다...</div>;
  if (error) return <div style={{ color: "red" }}>에러: {error}</div>;

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

        <div>
          {questions.length > 0 ? (
            questions.map((q) => (
              <QnAItem
                key={q.questionId}
                id={q.questionId}
                title={q.questionTitle}
                previewContent={q.questionContent}
                likes={0} // API 응답에 likes 필드가 있다면 수정 필요
                comments={q.answers ? q.answers.length : 0}
              />
            ))
          ) : (
            <p>작성한 질문이 없습니다.</p>
          )}
        </div>
      </main>
    </div>
  );
}