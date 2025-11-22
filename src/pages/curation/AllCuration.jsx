import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./AllCuration.module.css";
import Header from "../../components/atoms/header/header";
import SearchBar1 from "../../components/Bar/SearchBar1";
import CurationFilter from "../../components/Filter/CurationFilter";
import { DUMMY_CURATION_DATA } from "../../components/Curation/DummyData";
import CurationItem from "../../components/Curation/CurationItem";

export default function AllCuration() {
  //큐레이션 클릭 시 큐레이션 세부보기 페이지로 이동
  const navigate = useNavigate();
  
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
  
  //큐레이션 (일단 더미데이터 사용)
  const [curations, setCurations] = useState(DUMMY_CURATION_DATA);
  //const [curations,setCurations] = useState([]);

   
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

    {/*
    useEffect(()=>{
      const fetchCurations = async () => {
        try{
        const response = await axios.post("/api/curations/search",{
          keyword: searchTerm, 
          sort: sortBy,
          filters: filterValues,
        });
        setCurations(response.data);}
        catch (error){console.error("큐레이션 불러오기 실패:",error);}
        };
        fetchCurations();
        },[searchTerm, sortBy, filterValues]);
    */}


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
