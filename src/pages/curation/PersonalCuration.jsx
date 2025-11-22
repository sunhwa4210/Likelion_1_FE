import React,{useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import styles from './PersonalCuration.module.css';
import Header from "../../components/atoms/header/header";
import CurationItem from "../../components/Curation/CurationItem"
import { useAuth } from "../../contexts/AuthContext";

import {DUMMY_CURATION_DATA} from '../../components/Curation/DummyData';

export default function PersonalCuration() {
  // 사용자 정보 가져오기 
  const { user } = useAuth();

  const navigate = useNavigate();

  //(임시): 더미데이터 가져오기
  const curations=DUMMY_CURATION_DATA;

  //실제 API 연동 코드

  //큐레이션 세부정보 보기
  const handleCurationClick = (item) => {
    navigate(`/curation/${item.id}`,{state:{item},});
    console.log(item.id);

  };
  //큐레이션 더 보기
  const handleMoreCuration=()=>{navigate('/curation');}

  return (

    //일단 개인화 큐레이션 피드 먼저
    <div className="app-wrapper">
    <div className={styles["personalCuration-wrapper"]}>
      <Header/>
      <div className={styles["title-box"]}>
        <h1>오늘의 큐레이션</h1>
        <p>슈니님이 선택한 관심/전문 분야의 최신 큐레이션으로 가져왔어요</p>
        {/* <p>{user.name}님이 선택한 관심/전문 분야의 최신 큐레이션으로 가져왔어요</p> */}
      </div>
      
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
      
      <div className={styles["btn-box"]}>
        <button type="button" className={styles["more-btn"]} onClick={handleMoreCuration}>
          <p>큐레이션 더보기</p>
        </button>
      </div>
      </div>
    </div>
  );
}
