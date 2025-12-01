// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); 

  // 백엔드 주소 (나중에 const API_BASE = process.env.REACT_APP_API_URL || ""; 로 변경)
  // const API_BASE = "";
  const API_BASE = process.env.REACT_APP_API_URL || "";
  
  // 내 정보 조회
  const fetchMe = async (token = accessToken) => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // 이름, 이메일 유저 정보 저장
      setUser(res.data);
    } catch (err) {
      console.error("GET /auth/me 실패", err);
    } finally {
      setAuthLoading(false);
    }
  };

  // 최초 로드 시 로컬스토리지에 토큰 있으면 복구 + /auth/me 조회
  useEffect(() => {
    const storedAccess = localStorage.getItem("accessToken");
    const storedRefresh = localStorage.getItem("refreshToken");

    if (storedAccess && storedRefresh) {
      setAccessToken(storedAccess);
      setRefreshToken(storedRefresh);
      fetchMe(storedAccess);
    } else {
      setAuthLoading(false);
    }
  }, []);

  // 로컬 로그인 (/auth/local/login)
  const loginLocal = async (email, password) => {
    const res = await axios.post(`${API_BASE}/auth/local/login`, {
      email,
      password,
    });

    // 응답 저장
    const { accessToken, refreshToken, tokenType } = res.data;
    localStorage.setItem("tokenType", tokenType);
    await applyTokensAndFetchUser({ accessToken, refreshToken });

    return res.data;
  };

  // 로그아웃 (/auth/logout) (유빈님께 여쭤보기)
  const logout = async () => {
    try {
      if (accessToken) {
        await axios.post(
          `${API_BASE}/auth/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      }
    } catch (err) {
      // 실패해도 어차피 클라 상태는 지워버릴 거라 로그만
      console.error("POST /auth/logout 실패 (무시 가능)", err);
    } finally {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenType");
    }
  };

  // 토큰 재발급 (/auth/refresh)
  const refreshAccessToken = async () => {
    if (!refreshToken) return null;

    try {
      const res = await axios.post(`${API_BASE}/auth/refresh`, {
        refreshToken,
      });

      const { accessToken: newAccessToken } = res.data;

      setAccessToken(newAccessToken);
      localStorage.setItem("accessToken", newAccessToken);

      return newAccessToken;
    } catch (err) {
      console.error("POST /auth/refresh 실패", err);
      await logout();
      return null;
    }
  };

  //토큰 저장+ 유저 정보 불러오기 공용 함수 (소셜 로그인 시 사용 )
  const applyTokensAndFetchUser = async ({ accessToken, refreshToken }) => {
  if (!accessToken || !refreshToken) return;

  setAccessToken(accessToken);
  setRefreshToken(refreshToken);

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  await fetchMe(accessToken);
};
  // 전역에서 사용할 값들
  const value = {
    user,
    accessToken,
    refreshToken,
    authLoading,
    loginLocal,
    logout,
    refreshAccessToken,
    fetchMe,
    applyTokensAndFetchUser,
    socialLoginUrls: {
      kakao: `${API_BASE}/auth/login/kakao`,
      google: `${API_BASE}/auth/login/google`,
    },
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
