// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false); 

  const nav=useNavigate();

  // 백엔드 주소 (나중에 const API_BASE = process.env.REACT_APP_API_URL || ""; 로 변경)
  const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

  // 내 정보 조회
  const fetchMe = async (tokenParam) => {
    const token = tokenParam ?? accessToken;

    // 토큰 없으면 그냥 로그인 안 된 상태로 처리
    if (!token) {
      setUser(null);
      setAuthLoading(false);
      nav('/login');
      return;
    }

    try {
      const res = await axios.get(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // 이름, 이메일 유저 정보 저장
      setUser(res.data);
    } catch (err) {
      // 401이면 "로그아웃 상태"라고 보고 토큰/유저 정보 정리
      if (err.response?.status === 401) {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("tokenType");
        // 굳이 콘솔에 에러 안 찍어도 됨 (원하면 아래 한 줄 삭제 가능)
        console.warn("토큰이 만료되었거나 유효하지 않습니다. 로그아웃 상태로 전환합니다.");
        nav('/login');
      } else {
        console.error("GET /auth/me 실패", err);
      }
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
      nav('/curation/personal')
      fetchMe(storedAccess);
    } else {
      setAuthLoading(false);
      nav('login');
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

      nav('/login'); // 추가 
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
    API_BASE,
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
