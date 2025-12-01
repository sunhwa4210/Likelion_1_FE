import React, { useState, useEffect } from "react";
import axios from 'axios'; // 1. axios 임포트
import SearchBar3 from '../../../../components/Bar/SearchBar3';
import QnAItem from "../qna/QnAItem";
// import { DummyQuestions } from "./dummyQnA"; // 2. 더미 데이터는 필요 없으므로 주석 처리
import Header from '../../../../components/Header/Header';
import Globalheader from "../../../../components/atoms/Header/header";

// 내가 작성한 질문 목록 API 경로
const API_URL = "/api/mypage/my-qna?type=question"; 

export default function WriteQnA () {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                // 인증 토큰을 헤더에 포함하여 API 호출
                const response = await axios.get(API_URL, {
                    headers: {
                        'Authorization': `Bearer YOUR_AUTH_TOKEN` // 실제 토큰으로 대체
                    }
                });
                setQuestions(response.data);
            } catch (err) {
                console.error("질문 목록 Fetch Error:", err);
                setError("데이터를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []); 

    if (loading) return <div>데이터를 불러오는 중입니다...</div>;
    if (error) return <div style={{ color: 'red' }}>에러: {error}</div>;

  return (
    <div className="app-wrapper">
      <Globalheader />
      <Header title="내가 작성한 QnA"/>

      <main className="content">
        <SearchBar3 />
        <div>
          {
            questions.length > 0 ? (
              questions.map((question) => (
              <QnAItem
                key={question.questionId}
                id={question.questionId} // ✅ 상세 페이지 이동에 사용할 ID 전달
                title={question.questionTitle}
                previewContent={question.questionContent}
                likes={0} // API에 좋아요 수가 없으므로 0으로 가정
                comments={question.answers ? question.answers.length : 0} // 답변 개수
                // date는 요청에 따라 제외
              />
            ))
            ) : (
                <p>작성한 질문이 없습니다.</p>
            )
          }
        </div>
      </main>
    </div>
  );
}