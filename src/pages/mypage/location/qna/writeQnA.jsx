import React from "react";
import SearchBar3 from '../../../../components/Bar/SearchBar3';
import QnAItem from "../qna/QnAItem";
import { DummyQuestions } from "./dummyQnA";
import Header from '../../../../components/Header/Header';
//import Globalheader from '../../../../components/atoms/header/header'

export default function WriteCalum () {
    // ✅ 실제 API 연결 시, useState와 useEffect를 사용하여 데이터를 fetch하는 로직 필요할 듯

    const questions = DummyQuestions; // 현재는 더미 데이터 사용

  return (
    <div className="app-wrapper">
      {/* 헤더 컴포넌트 */}
      {/*<Globalheader />*/}
      <Header title="내가 작성한 QnA"/>

      {/* 본문 */}
      <main className="content">
        {/* 여기에 페이지 콘텐츠 전부 */}

        <SearchBar3 />
        <div className={Styles.questioListContainer}>
          {
            questions.map((question) => (
              <QnAItem
                key={question.id}
                id={question.id}
                title={question.title}
                previewContent={question.previewContent}
              />
            ))
          }
        </div>
        
      </main>

    </div>
  );
}

