import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";
const MYPAGE_PROFILE_API = `${BASE_URL}/api/mypage/profile`;
//마이페이지 프로필 및 리포트 데이터를 불러오는 함수
// Method: GET, Path: /api/mypage/profile

const LOGOUT_API = `${BASE_URL}/auth/logout`;

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

// Method: POST, Path: /auth/logout (Authenticated)
export async function fetchLogout(accessToken) {
    if (!accessToken) {
        // 토큰이 없으면 서버 호출 없이 에러를 발생시킵니다.
        throw new Error("Authorization token is required for logout.");
    }

    try {
        // POST 요청을 보냅니다. 명세에 요청 본문(body)이 없으므로, 두 번째 인자로 null을 전달합니다.
        const response = await axios.post(LOGOUT_API, null, {
            headers: {
                // 인증: 'Authentication: Bearer Token' 요청
                Authorization: `Bearer ${accessToken}`
            }
        });

        // axios는 200 OK를 포함한 2xx 상태 코드를 자동으로 성공으로 처리합니다.
        console.log("로그아웃 API 성공 응답:", response.data);
        return response.data;
    } catch (error) {
        console.error("로그아웃 처리 실패:", error.response ? error.response.data : error.message);
        // 에러를 상위 컴포넌트/Context로 전파하여 처리합니다.
        throw new Error("Failed to process logout request.");
    }
}
