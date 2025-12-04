import React, { useEffect, useState } from "react";
import axios from "axios";
import GlobalHeader from "../../components/Header/GlobalHeader";
import styles from "./balancegame.module.css";

import { useModal } from "../../components/Modal/ModalProvider";
import { useAuth } from "../../contexts/AuthContext";
import {
  BALANCE_RESULT_MODAL_CONFIG,
  RESULT_TYPES,
} from "./resultModalConfig";

import TodayBalanceCard from "./todaybalancecard";
import CategoryBalanceCard from "./categorybalancecard";

const API_BASE =
  `${process.env.REACT_APP_API_BASE_URL || ""}/api`;
const BALANCE_BASE = `${API_BASE}/balance-games`;
const MAX_FETCH_RETRIES = 3;

export default function Balancegame() {
  const { open } = useModal();
  const { accessToken, refreshAccessToken } = useAuth();

  // 오늘의 랜덤 게임
  const [todayQuiz, setTodayQuiz] = useState(null);
  const [todayLoading, setTodayLoading] = useState(true);
  const [todayError, setTodayError] = useState(null);
  const [todayPreviousWrong, setTodayPreviousWrong] = useState(false);

  // 분야별 랜덤 게임
  const [selectedCategory, setSelectedCategory] = useState("인문사회");
  const [categoryQuiz, setCategoryQuiz] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState(null);
  const [categoryPreviousWrong, setCategoryPreviousWrong] = useState(false);

//today 랜덤 
  useEffect(() => {
    const fetchTodayQuiz = async () => {
      setTodayLoading(true);
      setTodayError(null);

      if (!accessToken) {
        setTodayError("로그인이 필요합니다.");
        setTodayLoading(false);
        return;
      }

      let fetched = false;
      for (let attempt = 0; attempt < MAX_FETCH_RETRIES; attempt++) {
        try {
          const res = await axios.get(`${BALANCE_BASE}/today`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (res.data?.type === "OX") {
            setTodayQuiz(res.data);
            setTodayPreviousWrong(false);
            fetched = true;
            break;
          }

          console.warn(`오늘의 밸런스 게임 타입이 OX가 아닙니다. (attempt ${attempt + 1})`);
        } catch (error) {
          console.error(`오늘의 밸런스 게임 조회 실패 (attempt ${attempt + 1}):`, error);

          if (error.response?.status === 401 && typeof refreshAccessToken === "function") {
            try {
              const newToken = await refreshAccessToken();
              if (!newToken) {
                setTodayError("로그인이 만료되었습니다. 다시 로그인해 주세요.");
                break;
              }

              const retryRes = await axios.get(`${BALANCE_BASE}/today`, {
                headers: {
                  Authorization: `Bearer ${newToken}`,
                },
              });

              if (retryRes.data?.type === "OX") {
                setTodayQuiz(retryRes.data);
                setTodayPreviousWrong(false);
                fetched = true;
                break;
              }

              console.warn(`오늘의 밸런스 게임 타입이 OX가 아닙니다. (token refresh, attempt ${attempt + 1})`);
            } catch (retryErr) {
              console.error("오늘의 밸런스 게임 조회 재시도 실패:", retryErr);
            }
          }
        }
      }

      if (!fetched) {
        setTodayError("오늘의 문제를 불러오지 못했습니다. (OX 타입 응답을 받지 못했습니다.)");
        setTodayQuiz(null);
      }

      setTodayLoading(false);
    };

    fetchTodayQuiz();
  }, [accessToken, refreshAccessToken]);


  useEffect(() => {
    const fetchCategoryQuiz = async () => {
      setCategoryLoading(true);
      setCategoryError(null);

      if (!accessToken) {
        setCategoryError("로그인이 필요합니다.");
        setCategoryLoading(false);
        return;
      }

      const url = `${BALANCE_BASE}/by-category`;
      const params = { parentName: selectedCategory };

      let fetched = false;
      for (let attempt = 0; attempt < MAX_FETCH_RETRIES; attempt++) {
        try {
          const res = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params,
          });

          if (res.data?.type === "PREFERENCE") {
            setCategoryQuiz(res.data);
            setCategoryPreviousWrong(false);
            fetched = true;
            break;
          }

          console.warn(`분야별 밸런스 게임 타입이 PREFERENCE가 아닙니다. (attempt ${attempt + 1})`);
        } catch (error) {
          console.error(`분야별 밸런스 게임 조회 실패 (attempt ${attempt + 1}):`, error);

          if (error.response?.status === 401 && typeof refreshAccessToken === "function") {
            try {
              const newToken = await refreshAccessToken();
              if (!newToken) {
                setCategoryError("로그인이 만료되었습니다. 다시 로그인해 주세요.");
                break;
              }

              const retryRes = await axios.get(url, {
                headers: {
                  Authorization: `Bearer ${newToken}`,
                },
                params,
              });

              if (retryRes.data?.type === "PREFERENCE") {
                setCategoryQuiz(retryRes.data);
                setCategoryPreviousWrong(false);
                fetched = true;
                break;
              }

              console.warn(`분야별 밸런스 게임 타입이 PREFERENCE가 아닙니다. (token refresh, attempt ${attempt + 1})`);
            } catch (retryErr) {
              console.error("분야별 밸런스 게임 조회 재시도 실패:", retryErr);
            }
          }
        }
      }

      if (!fetched) {
        setCategoryError("분야별 밸런스 게임을 불러오지 못했습니다. (PREFERENCE 타입 응답을 받지 못했습니다.)");
        setCategoryQuiz(null);
      }

      setCategoryLoading(false);
    };

    fetchCategoryQuiz();
  }, [selectedCategory, accessToken, refreshAccessToken]);


  const goToOxCuration = async (quizId) => {
    if (!accessToken) return;

    const url = `${BALANCE_BASE}/${quizId}/curation/ox`;

    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { curationId } = res.data;
      console.log("OX 관련 큐레이션으로 이동:", curationId);
      // TODO: 실제 라우팅
      // navigate(`/curation/${curationId}`);
    } catch (error) {
      console.error("OX 큐레이션 조회 실패:", error);
    }
  };

  const goToPreferenceCuration = async (quizId, optionId) => {
    if (!accessToken) return;

    const url = `${BALANCE_BASE}/${quizId}/curation/preference`;
    const params = { optionId };

    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params,
      });

      const { curationId } = res.data;
      console.log("선호도 관련 큐레이션으로 이동:", curationId);
      // TODO: 실제 라우팅
      // navigate(`/curation/${curationId}`);
    } catch (error) {
      console.error("선호도 큐레이션 조회 실패:", error);
    }
  };


  const handleTodayOxSelect = async (answer) => {
    if (!todayQuiz || !accessToken) return;

    const isO = answer === "O";

    const payload = {
      oxAnswer: isO,
      ...(todayPreviousWrong ? { previousWrong: true } : {}),
    };

    const url = `${BALANCE_BASE}/${todayQuiz.quizId}/answer`;

    try {
      const res = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = res.data; // { correct, message }
      const resultType = data.correct ? RESULT_TYPES.CORRECT : RESULT_TYPES.WRONG;

      const modalConfig = {
        ...BALANCE_RESULT_MODAL_CONFIG[resultType],
        message: data.message ?? BALANCE_RESULT_MODAL_CONFIG[resultType].message,
      };

      const modalResult = await open(modalConfig);

      // 첫 오답이면: 다시 생각해볼까요? → previousWrong true로 만들고 끝
      if (!data.correct && !todayPreviousWrong) {
        setTodayPreviousWrong(true);
        return;
      }

      // 두 번째 이후이거나 처음부터 정답이면 → 큐레이션 이동
      if (modalResult === "confirm") {
        await goToOxCuration(todayQuiz.quizId);
      }
    } catch (error) {
      console.error("오늘 OX 정답 제출 1차 실패:", error);

      if (error.response?.status === 401 && typeof refreshAccessToken === "function") {
        try {
          const newToken = await refreshAccessToken();
          if (!newToken) return;

          const retryRes = await axios.post(url, payload, {
            headers: {
              Authorization: `Bearer ${newToken}`,
              "Content-Type": "application/json",
            },
          });

          const data = retryRes.data;
          const resultType = data.correct ? RESULT_TYPES.CORRECT : RESULT_TYPES.WRONG;

          const modalConfig = {
            ...BALANCE_RESULT_MODAL_CONFIG[resultType],
            message: data.message ?? BALANCE_RESULT_MODAL_CONFIG[resultType].message,
          };

          const modalResult = await open(modalConfig);

          if (!data.correct && !todayPreviousWrong) {
            setTodayPreviousWrong(true);
            return;
          }

          if (modalResult === "confirm") {
            await goToOxCuration(todayQuiz.quizId);
          }
        } catch (retryErr) {
          console.error("오늘 OX 정답 제출 재시도 실패:", retryErr);
        }
      }
    }
  };


  const handleTodayPreferenceSelect = async (optionId) => {
    if (!todayQuiz || !accessToken) return;

    const url = `${BALANCE_BASE}/${todayQuiz.quizId}/answer`;
    const payload = { optionId };

    try {
      const res = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = res.data; // { correct: true, message: ... }

      const modalConfig = {
        ...BALANCE_RESULT_MODAL_CONFIG[RESULT_TYPES.CORRECT],
        message:
          data.message ??
          BALANCE_RESULT_MODAL_CONFIG[RESULT_TYPES.CORRECT].message,
      };

      const modalResult = await open(modalConfig);

      if (modalResult === "confirm") {
        await goToPreferenceCuration(todayQuiz.quizId, optionId);
      }
    } catch (error) {
      console.error("오늘 선호도 정답 제출 1차 실패:", error);

      if (error.response?.status === 401 && typeof refreshAccessToken === "function") {
        try {
          const newToken = await refreshAccessToken();
          if (!newToken) return;

          const retryRes = await axios.post(url, payload, {
            headers: {
              Authorization: `Bearer ${newToken}`,
              "Content-Type": "application/json",
            },
          });

          const data = retryRes.data;
          const modalConfig = {
            ...BALANCE_RESULT_MODAL_CONFIG[RESULT_TYPES.CORRECT],
            message:
              data.message ??
              BALANCE_RESULT_MODAL_CONFIG[RESULT_TYPES.CORRECT].message,
          };

          const modalResult = await open(modalConfig);

          if (modalResult === "confirm") {
            await goToPreferenceCuration(todayQuiz.quizId, optionId);
          }
        } catch (retryErr) {
          console.error("오늘 선호도 정답 제출 재시도 실패:", retryErr);
        }
      }
    }
  };

  const handleCategoryOxSelect = async (answer) => {
    if (!categoryQuiz || !accessToken) return;

    const isO = answer === "O";
    const payload = {
      oxAnswer: isO,
      ...(categoryPreviousWrong ? { previousWrong: true } : {}),
    };

    const url = `${BALANCE_BASE}/${categoryQuiz.quizId}/answer`;

    try {
      const res = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = res.data;
      const resultType = data.correct ? RESULT_TYPES.CORRECT : RESULT_TYPES.WRONG;

      const modalConfig = {
        ...BALANCE_RESULT_MODAL_CONFIG[resultType],
        message: data.message ?? BALANCE_RESULT_MODAL_CONFIG[resultType].message,
      };

      const modalResult = await open(modalConfig);

      if (!data.correct && !categoryPreviousWrong) {
        setCategoryPreviousWrong(true);
        return;
      }

      if (modalResult === "confirm") {
        await goToOxCuration(categoryQuiz.quizId);
      }
    } catch (error) {
      console.error("카테고리 OX 정답 제출 1차 실패:", error);

      if (error.response?.status === 401 && typeof refreshAccessToken === "function") {
        try {
          const newToken = await refreshAccessToken();
          if (!newToken) return;

          const retryRes = await axios.post(url, payload, {
            headers: {
              Authorization: `Bearer ${newToken}`,
              "Content-Type": "application/json",
            },
          });

          const data = retryRes.data;
          const resultType = data.correct ? RESULT_TYPES.CORRECT : RESULT_TYPES.WRONG;

          const modalConfig = {
            ...BALANCE_RESULT_MODAL_CONFIG[resultType],
            message:
              data.message ??
              BALANCE_RESULT_MODAL_CONFIG[resultType].message,
          };

          const modalResult = await open(modalConfig);

          if (!data.correct && !categoryPreviousWrong) {
            setCategoryPreviousWrong(true);
            return;
          }

          if (modalResult === "confirm") {
            await goToOxCuration(categoryQuiz.quizId);
          }
        } catch (retryErr) {
          console.error("카테고리 OX 정답 제출 재시도 실패:", retryErr);
        }
      }
    }
  };


  const handleCategoryPreferenceSelect = async (optionId) => {
    if (!categoryQuiz || !accessToken) return;

    const url = `${BALANCE_BASE}/${categoryQuiz.quizId}/answer`;
    const payload = { optionId };

    try {
      const res = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = res.data;

      const modalConfig = {
        ...BALANCE_RESULT_MODAL_CONFIG[RESULT_TYPES.CORRECT],
        message:
          data.message ??
          BALANCE_RESULT_MODAL_CONFIG[RESULT_TYPES.CORRECT].message,
      };

      const modalResult = await open(modalConfig);

      if (modalResult === "confirm") {
        await goToPreferenceCuration(categoryQuiz.quizId, optionId);
      }
    } catch (error) {
      console.error("카테고리 선호도 정답 제출 1차 실패:", error);

      if (error.response?.status === 401 && typeof refreshAccessToken === "function") {
        try {
          const newToken = await refreshAccessToken();
          if (!newToken) return;

          const retryRes = await axios.post(url, payload, {
            headers: {
              Authorization: `Bearer ${newToken}`,
              "Content-Type": "application/json",
            },
          });

          const data = retryRes.data;

          const modalConfig = {
            ...BALANCE_RESULT_MODAL_CONFIG[RESULT_TYPES.CORRECT],
            message:
              data.message ??
              BALANCE_RESULT_MODAL_CONFIG[RESULT_TYPES.CORRECT].message,
          };

          const modalResult = await open(modalConfig);

          if (modalResult === "confirm") {
            await goToPreferenceCuration(categoryQuiz.quizId, optionId);
          }
        } catch (retryErr) {
          console.error("카테고리 선호도 정답 제출 재시도 실패:", retryErr);
        }
      }
    }
  };


  const renderTodaySection = () => {
    if (todayLoading) {
      return <div>오늘의 밸런스 게임을 불러오는 중입니다...</div>;
    }

    if (todayError) {
      return <div>오늘의 문제를 불러오지 못했습니다: {todayError}</div>;
    }

    if (!todayQuiz) return null;

    const todaySubtitle = "오늘의 밸런스 게임을 통해, 더 넓은 인사이트를 만나보세요";
    // API에 따라 parentName / categoryName 등이 올 수 있으므로 우선순위로 태그 결정
    const badgeLabel =
      todayQuiz.parentName ||
      todayQuiz.categoryParentName ||
      todayQuiz.categoryName ||
      todayQuiz.parentCategoryName ||
      todayQuiz.category ||
      "오늘";

    // 오늘 카드는 OX 타입만 렌더링
    if (todayQuiz.type !== "OX") {
      return <div>오늘의 밸런스 게임은 OX 타입 문제만 지원합니다.</div>;
    }

    return (
      <TodayBalanceCard
        badgeLabel={badgeLabel}
        title="오늘의 밸런스 게임"
        description={todaySubtitle}
        question={todayQuiz.question}
        type="OX"
        onSelectOx={handleTodayOxSelect}
      />
    );
  };


  const renderCategorySection = () => {
    if (categoryLoading) {
      return <div>분야별 밸런스 게임을 불러오는 중입니다...</div>;
    }

    if (categoryError) {
      return (
        <div>분야별 밸런스 게임을 불러오지 못했습니다: {categoryError}</div>
      );
    }

    if (!categoryQuiz) return null;

    if (categoryQuiz.type !== "PREFERENCE") {
      return <div>분야별 밸런스 게임은 선호도(PREFERENCE) 타입 문제만 지원합니다.</div>;
    }

    const options =
      categoryQuiz.options?.map((opt) => ({
        id: opt.optionId,
        label: opt.label, // A/B 와 같은 라벨
        text: opt.text,
      })) ?? [];

    return (
      <CategoryBalanceCard
        title="분야별 밸런스 게임"
        description="원하는 분야의 퀴즈를 골라보세요"
        question={categoryQuiz.question}
        categoryLabel={selectedCategory}
        options={options}
        onCategoryChange={setSelectedCategory}
        onSelectOption={handleCategoryPreferenceSelect}
      />
    );
  };

  return (
    <div className="app-wrapper">
      <GlobalHeader/>
      <div className={styles.contentWrapper}>
        {renderTodaySection()}
        {renderCategorySection()}
      </div>
    </div>
  );
}
