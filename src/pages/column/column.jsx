// src/pages/column/column.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";   // 추가
import GlobalHeader from "../../components/Header/GlobalHeader";
import Search from "../qna/components/QnaSearchBar";
import Filter from "../qna/components/qnafilter";
import Card from "./components/card";
import Pen from "./components/columnFabButton";
import styles from "./column.module.css";
import { useAuth } from "../../contexts/AuthContext";

const COLUMN_HOME_URL = "https://cross-note.com/column/home";

export default function Column() {
  const { accessToken, refreshAccessToken } = useAuth();
  const navigate = useNavigate();   // 훅 사용

  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sort, setSort] = useState("latest");

  useEffect(() => {
    const fetchColumns = async () => {
      setLoading(true);
      setError(null);

      if (!accessToken) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      const params = { sort };

      try {
        const res = await axios.get(COLUMN_HOME_URL, {
          headers: { Authorization: `Bearer ${accessToken}` },
          params,
        });

        console.log("[칼럼 목록 응답]", res.data);
        setColumns(res.data);
      } catch (err) {
        console.error("칼럼 목록 1차 요청 실패:", err);

        if (err.response?.status === 401 && typeof refreshAccessToken === "function") {
          try {
            const newToken = await refreshAccessToken();
            if (!newToken) {
              setError("로그인이 만료되었습니다.");
              return;
            }

            const retryRes = await axios.get(COLUMN_HOME_URL, {
              headers: { Authorization: `Bearer ${newToken}` },
              params,
            });

            console.log("[칼럼 목록 재요청 응답]", retryRes.data);
            setColumns(retryRes.data);
          } catch (retryErr) {
            console.error("칼럼 목록 재요청 실패:", retryErr);
            setError("칼럼 목록을 불러오지 못했습니다.");
          }
        } else {
          setError("칼럼 목록을 불러오지 못했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchColumns();
  }, [sort, accessToken, refreshAccessToken]);

  // 카드 클릭 시 상세 페이지로 이동
  const handleCardClick = (item) => {
    console.log("[칼럼 카드 클릭] 이동할 데이터:", item);
    navigate("/columnread", {
      state: {
        column: item,  // 상세 페이지에서 사용할 데이터
        columnId: item.columnId, // 상세 조회에 필요한 ID 전달
      },
    });
  };

  if (loading) {
    return <div className="app-wrapper">칼럼을 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className="app-wrapper">오류: {error}</div>;
  }

  return (
    <div className="app-wrapper">
      <GlobalHeader />
      <div className={styles.container}>

        <Search />
        <Filter onSortChange={setSort} />

        {columns.map((item) => (
          <Card
            key={item.columnId}
            title={item.title}
            likeCount={item.likeCount ?? 0}
            commentCount={item.commentCount ?? 0}
            categories={[
              item.categoryId1,
              item.categoryId2,
              item.categoryId3,
            ].filter(Boolean)}
            isBest={item.isBestColumn}
            imageUrl={item.imageUrl || null}
            onClick={() => handleCardClick(item)}  
          />
        ))}

        <Pen />
      </div>
    </div>
  );
}
