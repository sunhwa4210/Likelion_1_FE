import React from "react";
import SearchBar1 from '../../../../components/Bar/SearchBar1';
import QnAItem from "../qna/QnAItem";
import { DummyQuestions } from "../qna/dummyQnA";
import Header from '../../../../components/Header/Header';
// import Globalheader from '../../../../components/atoms/header/header'
import { DummyCalums } from "./dummyCalum";
import CalumItem from './CalumItem';

export default function WriteCalum () {
    // ✅ 실제 API 연결 시, 여기에 useState와 useEffect를 사용하여 데이터를 fetch하는 로직 들어갈 듯 

    const questions = DummyQuestions; // 현재는 더미 데이터 사용

  return (
    <div className="app-wrapper">
      {/* 헤더 컴포넌트 */}
      {/*<Globalheader/>*/}
      <Header title="내가 작성한 칼럼"/>

      {/* 본문 */}
      <main className="content">
        {/* 여기에 페이지 콘텐츠 전부 */}
        <SearchBar1 />
        
        <div className="content-list-container">
          {DummyCalums.map((item) => (
          <CalumItem key={item.id} data={item} /> 
        ))}
        </div>
        
      </main>

    </div>
  );
}

