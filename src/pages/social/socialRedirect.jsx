import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function SocialRedirect() {
    const nav = useNavigate();
    const [searchParams] = useSearchParams();
    const {applyTokensAndFetchUser} = useAuth(); 

    useEffect(()=> {
        const accessToken =searchParams.get("accessToken");
        const refreshToken = searchParams.get("refreshToken");
        const type = searchParams.get("type"); // 'google-signup' | 'kakao-signup' | 'login'
        const Provider = searchParams.get("provider");  // 'google' | 'kakao'

        if (!accessToken||!refreshToken||!type) {
            nav("/login",{replace:true});
            return;
        }

        (async () => {
            try {
                const ok = await applyTokensAndFetchUser({ accessToken, refreshToken });

                if (!ok) {
                nav("/login", { replace: true });
                return;
                }

                if (type === "google-signup") {
                nav("/signup?step=2", { replace: true });
                } else if (type === "kakao-signup") {
                nav("/signup?step=3", { replace: true });
                } else if (type === "login") {
                nav("/curation/personal", { replace: true });
                }

            } catch (err) {
                console.error("소셜 로그인 처리 중 오류", err);
                nav("/login", { replace: true });
            }
            })();
        }, [searchParams, applyTokensAndFetchUser, nav]);
    return(
        <div className="app-wrapper">
            <p>소셜 로그인 처리 중..</p>
        </div>
    );
}