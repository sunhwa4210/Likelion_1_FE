import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || "";
const MYPAGE_PROFILE_API = `${BASE_URL}/api/mypage/profile`;
//마이페이지 프로필 및 리포트 데이터를 불러오는 함수
// Method: GET, Path: /api/mypage/profile

export async function fetchMypageData(accessToken) { 
    // 토큰이 없거나 유효하지 않으면 즉시 에러 발생
    if (!accessToken) {
        throw new Error("Authorization token is required.");
    }

    try {
        const response = await axios.get(MYPAGE_PROFILE_API, {
        headers: {
            // 전달받은 최신 토큰 사용
            Authorization: `Bearer ${accessToken}`
        }
        });
        return response.data;
    } catch (error) {
        console.error("마이페이지 데이터를 불러오는 데 실패했습니다.", error);
        throw new Error("Failed to fetch mypage data");
    }
}