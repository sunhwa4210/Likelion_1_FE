import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import styles from "./qna.module.css";
import GlobalHeader from "../../components/Header/GlobalHeader";
import QnaSearchBar from "./components/QnaSearchBar";
import QnaFilter from "./components/qnafilter";
import QnaCard from "./components/qnaCard";
import QnaFabButton from "./components/qnaFabButton";

import { useAuth } from "../../contexts/AuthContext";

// 요청 경로를 고정된 절대주소로 사용
const QNA_URL = "https://cross-note.com/question/home";

export default function Qna() {
  const { accessToken, refreshAccessToken } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterKey, setFilterKey] = useState("latest");

  const [qnaList, setQnaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchQnaList = async () => {
      setLoading(true);
      setError(null);

      if (!accessToken) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      const params = { sort: filterKey };

      try {
        const res = await axios.get(QNA_URL, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params,
        });

        setQnaList(res.data);
      } catch (err) {
        console.error("QnA 목록 1차 요청 실패:", err);

        // 토큰 만료 → refresh 후 재요청
        if (err.response?.status === 401 && typeof refreshAccessToken === "function") {
          try {
            const newToken = await refreshAccessToken();
            if (!newToken) {
              setError("로그인이 만료되었습니다 다시 로그인해 주세요.");
              return;
            }

            const retryRes = await axios.get(QNA_URL, {
              headers: { Authorization: `Bearer ${newToken}` },
              params,
            });

            setQnaList(retryRes.data);
          } catch (retryErr) {
            console.error("QnA 목록 재요청 실패:", retryErr);
            setError("QnA 목록을 불러오지 못했습니다.");
          }
        } else {
          setError("QnA 목록을 불러오지 못했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQnaList();
  }, [filterKey, accessToken, refreshAccessToken]);


  if (loading) {
    return <div className="app-wrapper">QnA 불러오는 중...</div>;
  }

  if (error) {
    return <div className="app-wrapper">오류: {error}</div>;
  }

  return (
    <div className="app-wrapper">
      <GlobalHeader/>

      <div className={styles.qnaContent}>
        <QnaSearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onSubmit={() => {}}
        />

        <QnaFilter onChange={setFilterKey} />

        {/* QnA 카드 목록 */}
        {qnaList.map((item) => (
          <QnaCard
            key={item.questionId}
            title={item.title}
            content={item.content}
            likeCount={item.likeCount}
            answerCount={item.answerCount}
            onClick={() =>
              navigate(`/qnadetail/${item.questionId}`, {
                state: { question: item },
              })
            }
          />
        ))}

        <QnaFabButton />
      </div>
    </div>
  );
}
