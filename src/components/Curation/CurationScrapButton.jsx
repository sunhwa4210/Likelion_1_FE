// src/components/Curation/CurationScrapButton.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import BookmarkIcon from "../icons/BookmarkIcon";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

export default function CurationScrapButton({
  curationId,
  initialScrapped = false,
  variant = "default",      // "default" | "detail"
  onChange,                 // 필요하면 부모에 상태 변경 알려줄 때 사용
}) {
  const { accessToken, refreshAccessToken } = useAuth();
  const [scrapped, setScrapped] = useState(initialScrapped);

  useEffect(() => {
    setScrapped(initialScrapped);
  }, [initialScrapped]);

  const callScrapApi = async (tokenToUse) => {
    const res = await axios.post(
      `${API_BASE}/curation/${curationId}/scrap`,
      {},
      {
        headers: {
          Authorization: `Bearer ${tokenToUse}`,
        },
      }
    );
    return res.data; // { count: number, toggled: boolean } 
  };

  const handleToggle = async () => {
    if (!accessToken) { return;}

    try {
      // 1차 시도
      const data = await callScrapApi(accessToken);
      const { toggled } = data;

      setScrapped(toggled);
      onChange?.({ scrapped: toggled });
    } catch (err) {
      // 토큰 만료 등
      if (err.response?.status === 401) {
        try {
          const newToken = await refreshAccessToken();
          if (!newToken) return;

          const data = await callScrapApi(newToken);
          const { toggled } = data;

          setScrapped(toggled);
          onChange?.({ scrapped: toggled });
        } catch (retryErr) {
          console.error("스크랩 토글 재시도 실패:", retryErr);
        }
      } else {
        console.error("스크랩 토글 실패:", err);
      }
    }
  };

  return (
    <BookmarkIcon
      isMarked={scrapped}
      onClick={handleToggle}
      variant={variant}
    />
  );
}
