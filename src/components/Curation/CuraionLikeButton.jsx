// src/components/Curation/CuraionLikeButton.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import GoodCountIcon from "../icons/GoodCountIcon";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

export default function CurationLikeButton({
  curationId,
  initialLikeCount = 0, 
  initialLiked = false,
  onChange,
}) {
  const { accessToken, refreshAccessToken } = useAuth();
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [liked, setLiked] = useState(!!initialLiked);


  useEffect(() => {
    setLikeCount(initialLikeCount);
  }, [initialLikeCount]);

  useEffect(() => {
    setLiked(!!initialLiked);
  }, [initialLiked]);

  const callLikeApi = async (tokenToUse) => {
    const res = await axios.post(
      `${API_BASE}/curation/${curationId}/like`,
      {},
      {
        headers: { Authorization: `Bearer ${tokenToUse}` },
      }
    );
    return res.data; // { count: number, toggled: boolean }
  };

  const handleToggle = async () => {
    if (!accessToken) return;
    if (curationId == null) {
      console.error("[LikeButton] curationId가 undefined/null 입니다.", { curationId });
      return;
    }

    try {
      const data = await callLikeApi(accessToken);
      const { count: newLikeCount, toggled: newLiked } = data;

      setLikeCount(
        typeof newLikeCount === "number" ? newLikeCount : likeCount
      );
      setLiked(!!newLiked);
      onChange?.({ likeCount: newLikeCount, liked: !!newLiked });
    } catch (err) {
      console.error("좋아요 토글 실패:", err);

      if (err.response?.status === 401) {
        try {
          const newToken = await refreshAccessToken();
          if (!newToken) return;
          const data = await callLikeApi(newToken);
          const { count: newLikeCount, toggled: newLiked } = data;

          setLikeCount(
            typeof newLikeCount === "number" ? newLikeCount : likeCount
          );
          setLiked(!!newLiked);
          onChange?.({ likeCount: newLikeCount, liked: !!newLiked });
        } catch (retryErr) {
          console.error("좋아요 토글 재시도 실패:", retryErr);
        }
      }
    }
  };

  return (
    <GoodCountIcon
      likes={likeCount}   
      liked={liked}
      onToggle={handleToggle}
    />
  );
}
