// src/components/Curation/CurationScrapButton2.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import BookmarkIcon from "../icons/BookmarkIcon";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

export default function CurationScrapButton2({
  curationId,
  initialScrapped = false,
  variant = "default",      // "default" | "detail"
  onChange,     
  onScrapToggle,
}) {
  const { accessToken, refreshAccessToken } = useAuth();
  const [scrapped, setScrapped] = useState(initialScrapped);

  useEffect(() => {
    setScrapped(initialScrapped);
  }, [initialScrapped]);

  const callScrapApi = async (tokenToUse, method) => { // 👈 method 인자 추가
    if (!curationId) { // 🚨 ID가 undefined인 경우 처리
        console.error("Curation ID가 없습니다. API 호출 중단.");
        throw new Error("Curation ID missing");
    }
    
    // 🚨 method 인자 사용 및 axios.request로 통일
    const res = await axios.request({
        method: method, 
        url: `${API_BASE}/curation/${curationId}/scrap`, // 👈 URL 변수 사용
        headers: {
            Authorization: `Bearer ${tokenToUse}`,
        },
    });
    return res.data; 
};

const handleToggle = async () => {
  if (onScrapToggle) {
        onScrapToggle();
        return; 
    }
    
    if (!accessToken) { return;}
    
    // 2. 현재 상태에 따라 method 결정
    // scrapped가 true면 취소(DELETE), false면 스크랩(POST)
    const method = scrapped ? 'DELETE' : 'POST'; 
    
    try {
        const data = await callScrapApi(accessToken, method); // 👈 method 전달
        const { toggled } = data;

        setScrapped(toggled);
        onChange?.({ scrapped: toggled });
    } catch (err) {
        // ... (401 재시도 로직에서 callScrapApi에 method를 전달하도록 수정 필요) ...
        if (err.response?.status === 401) {
            try {
                const newToken = await refreshAccessToken();
                if (!newToken) return;

                // 🚨 재시도 시에도 method 전달
                const data = await callScrapApi(newToken, method); 
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
