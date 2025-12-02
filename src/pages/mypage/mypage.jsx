// Mypage.js
import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import UserProfile from "./UserProfile";
import ReportRadar from "./ReportRadar";
import MenuReport from "./MenuReport";
import { fetchMypageData } from './myPageAPI';
import { useAuth } from '../../contexts/AuthContext'; 
import GlobalHeader from "../../components/atoms/header/GlobalHeader";

export default function Mypage() {
    // 수정: useAuth 훅을 사용하여 accessToken, logout, authLoading 상태를 가져옴 
    const navigate = useNavigate();
    const { accessToken, logout, authLoading, user } = useAuth(); 

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleFollowListClick = (type) => {
        // 🟢 수정: useAuth의 user 대신 API로 가져온 data 객체의 userId를 사용
        const currentUserId = data?.userId; // 👈 여기에서 숫자 ID를 가져와야 합니다.

        if (currentUserId) {
            // 이제 숫자 ID가 경로에 포함됩니다.
            navigate(`/mypage/${currentUserId}/follow/${type}`); 
        } else {
            console.error("로그인 사용자 정보를 찾을 수 없습니다. (식별자 부재)"); 
            // 이 에러는 data가 아직 로딩되지 않았거나 (로딩 중) userId가 없는 경우에만 출력됩니다.
        }
    };

    useEffect(() => {
        // 1. AuthContext 로딩 중이면 대기
        if (authLoading) return;

        // 2. 토큰이 없으면 (로그아웃 상태) 에러 처리 후 종료
        if (!accessToken) {
             setError(new Error("로그인이 필요합니다."));
             setLoading(false);
             return;
        }

        const loadMypageData = async () => {
            try {
                // 수정: useAuth에서 가져온 accessToken을 인자로 전달
                const apiData = await fetchMypageData(accessToken);
                setData(apiData);
            } catch (err) {
                setError(err);
                console.error("마이페이지 데이터 로드 실패:", err);
            } finally {
                setLoading(false);
            }
        };
        loadMypageData();
    // 수정: accessToken 또는 authLoading이 변경될 때마다 재실행
    }, [accessToken, authLoading]); 

    // 3. 로딩 상태 처리 (AuthContext 로딩 또는 API 로딩)
    if (authLoading || loading) {
        return <div className="app-wrapper"><p>로딩 중...</p></div>;
    }

    if (error || !data) {
        // API 호출 실패 또는 토큰 없음 에러 메시지 렌더링
        return <div className="app-wrapper"><p>데이터를 불러오는 데 실패했습니다. 다시 시도해 주세요. ({error.message})</p></div>;
    }
    
    // UserProfile 컴포넌트에 맞게 데이터 매핑 및 가공
    const userProfileProps = {
        name: data.name,
        profileImageUrl: data.profileImageUrl,
        followers: data.followersCount,
        following: data.followingsCount,
        email: data.email || "정보 없음",
    };

    // ReportRadar 컴포넌트에 맞게 데이터 매핑
    const radarChartProps = {
        chartData: data.knowledgeScores || data.knowledgeChartData,
        userName: data.name,
    };

    return (
        <div className="app-wrapper">
            <GlobalHeader/>
            <main className="content">
                <UserProfile data={userProfileProps} onFollowListClick={handleFollowListClick} />
                <ReportRadar {...radarChartProps} />
                {/* MenuReport에 AuthContext의 logout 함수를 onLogout prop으로 전달 */}
                <MenuReport onLogout={logout} /> 
            </main>
        </div>
    );
}