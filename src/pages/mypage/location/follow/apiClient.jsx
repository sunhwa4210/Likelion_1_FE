// apiClient.js

import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || "";
// 🟢 수정: baseURL에 /api를 포함시켜, 컴포넌트에서 /api를 붙이지 않도록 합니다.
const apiClient = axios.create({
  baseURL: `${API_BASE}/api`, 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// 요청 인터셉터 (토큰 주입)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers.Authorization === undefined) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 설정 (토큰 재발급 로직은 변경 없음)
export const setupAxiosInterceptors = (authContext) => {
  const { refreshAccessToken, logout } = authContext;

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // 401 → 토큰 재발급
      if (
        error.response?.status === 401 &&
        !originalRequest.url.includes("/auth/refresh") &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          }
        } catch (err) {
          await logout();
        }
      }

      return Promise.reject(error);
    }
  );
};

export default apiClient;