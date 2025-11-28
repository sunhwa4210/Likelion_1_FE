import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./AllCuration.module.css";

import Header from "../../components/atoms/Header/header";
import SearchBar1 from "../../components/Bar/SearchBar1";
import CurationFilter from "../../components/Filter/CurationFilter";
import CurationItem from "../../components/Curation/CurationItem";
import { useAuth } from "../../contexts/AuthContext";


//Category Name -> Id 매핑
const CATEGORY_NAME_TO_ID = {
  // 최상위
  "인문사회": 1,
  "자연과학": 2,
  "공학·기술": 3,
  "경제·경영": 4,
  "예술·문화": 5,
  "스포츠·라이프스타일": 6,

  // 인문사회 하위
  "철학": 7,
  "역사": 8,
  "사회학": 9,
  "언어": 10,
  "심리": 11,

  // 자연과학 하위
  "수학": 12,
  "물리": 13,
  "화학": 14,
  "생물": 15,
  "의료": 16,

  // 공학·기술 하위
  "IT": 17,
  "AI": 18,
  "전자": 19,
  "기계": 20,
  "산업공학": 21,

  // 경제·경영 하위
  "경제": 22,
  "비즈니스": 23,
  "마케팅": 24,

  // 예술·문화 하위
  "미술": 25,
  "음악": 26,
  "문학": 27,
  "UI/UX": 28,
  "건축": 29,
  "영화": 30,

  // 스포츠·라이프스타일 하위
  "건강": 31,
  "스포츠": 32,
  "여행": 33,
  "생활": 34,
  "환경": 35,
};



//API
const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

export default function AllCuration() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  //큐레이션 클릭 시 큐레이션 세부보기 페이지로 이동
  const handleCurationClick = (item) => {
    navigate(`/curation/${item.id}`,{state:{item},});
    console.log(item.id);
  };
 
  //큐레이션 필터 open/close
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  //큐레이션 정렬을 위한 정렬 기준들 (검색어, 정렬기준, 필터 선택)
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest") // 'latest' | 'popular' | 'comments'
  const [filterValues,setFilterValues] = useState({
    types: [],        // 큐레이션 유형 (칼럼/논문/영상 등)
    humanities: [],   // 인문사회
    science: [],      // 자연과학
    tech: [],         // 공학·기술
    economy: [],      // 경제·경영
    art: [],          // 예술·문화
    sport: [],        // 스포츠·라이프스타일
  });
  

  const [curations,setCurations] = useState([]);
   
    //SearchBar에서 넘어오는 핸들러들
    const handleFilterToggle = () => {
      setIsFilterOpen((prev)=>!prev);
    }

    const handleSearchChange=(value)=>{
      setSearchTerm(value);
    }

    const handleSortChange=(value)=>{
      setSortBy(value);
    }

    //큐레이션 필터에서 선택값 변경 시
    const handleFilterChange=(nextValues)=>{
      setFilterValues(nextValues);
    };

//API 요청 보내기 
 useEffect(() => {
  // 토큰 없으면 요청 안 보냄
  if (!accessToken) return;

  const fetchCurations = async () => {
    try {
      // 정렬 파라미터 매핑
      let sortParam = "";
      if (sortBy === "latest") sortParam = "createdAt,desc";
      else if (sortBy === "popular") sortParam = "likeCount,desc";
      // TODO: 댓글순 정렬은 백엔드에서 정해주면 여기 추가
      else if (sortBy === "comments") sortParam = "하나님께 받으면 이 부분에 추가";

      // 쿼리 파라미터 구성
      const params = {
        ...(searchTerm && { query: searchTerm }), // 검색어
        ...(sortParam && { sort: sortParam }),   // 정렬
      };

      //필터 카테고리값 -> id 변환, curationType (카테고리 필터값 복수 전송시 형태 답 주시면 수정, 일단 단일 categoryId만 받는다고 가정)
      const {humanities, science, tech, economy, art, sport, types,} = filterValues;
      const selectedCategoryNames=[
        ...humanities,
        ...science, 
        ...tech,
        ...economy,
        ...art,
        ...sport,];
      
      if (selectedCategoryNames.length>0){
        //id로 변환
        const categoryIds = selectedCategoryNames
        .map((name)=>CATEGORY_NAME_TO_ID[name])
        .filter(Boolean);

        if(categoryIds.length>0){
          //일단 단일 categoryId만 받는다고 가정 (나중에 수정 예정)
          params.categoryId = categoryIds[0];
        }
      }

      //큐레이션 유형
      if (types && types.length > 0) {
        const allowedTypes = ["BEST_COLUMN", "INSIGHT", "CROSSNOTE"];
        const selectedType = types.find((t) => allowedTypes.includes(t));

        if (selectedType) {
          params.curationType = selectedType;
        }
      }

      


      // 요청 보내기
      const res = await axios.get(`${API_BASE}/curation`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params,
      });

      const data = res.data?.content ?? [];

      // 응답 → CurationItem에서 쓰기 좋은 형태로 매핑
      const mapped = data.map((item) => ({
        id: item.curationId,

        imageUrl: item.imageUrl || "",
        fieldBadges: item.crossCategoryName
          ? [item.categoryName, item.crossCategoryName]
          : [item.categoryName],

        insightBadge: item.curationType === "INSIGHT",
        crossNoteBadge: item.curationType === "CROSSNOTE",
        bestCalumBadge: item.bestColumn === true,

        content: {
          title: item.title,
          description: item.description,
          sourceUrl: item.sourceUrl,
        },

        likes: item.likeCount ?? 0,
        isBookmarked: item.scraped ?? false,
      }));

      setCurations(mapped);
    } catch (error) {
      console.error("전체 큐레이션 불러오기 실패:", error);
    }
  };

  fetchCurations();
}, [accessToken, searchTerm, sortBy, filterValues]);

  


  return (

    //전체 큐레이션 피드
    <div className="app-wrapper">
        <Header/>
        <SearchBar1         
          onFilterClick={handleFilterToggle}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}/>
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

        <div className={styles["curation-box"]}>
          {curations.map(item => (
          <CurationItem
            key={item.id} 
            imageUrl={item.imageUrl}
            
            fieldBadges={item.fieldBadges}

            insightBadge={item.insightBadge}
            crossNoteBadge={item.crossNoteBadge}
            bestCalumBadge={item.bestCalumBadge}

            content={item.content}
            likes={item.likes}
            isBookmarked={item.isBookmarked}

            onClick={()=>handleCurationClick(item)}
          />
        ))}
      </div>
    </div>
  );
}
