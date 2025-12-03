import React,{useState, useEffect, useRef} from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import styles from './PersonalCuration.module.css';
import GlobalHeader from "../../components/Header/GlobalHeader";
import CurationItem from "../../components/Curation/CurationItem"
import Coachmark from "../../components/Coachmark/Coachmark";
import { useAuth } from "../../contexts/AuthContext";


const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

export default function PersonalCuration() {
  // 사용자 정보 가져오기 
  const { user,accessToken,refreshAccessToken } = useAuth();
  const navigate = useNavigate();

  const userName = user?.name ?? "사용자";

  const [curations,setCurations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //코치마크 관련
  const targetRef =useRef(null);
  const [showCoachmark,setShowCoachmark] = useState(false);
  //최초 로드시, 로컬스토리지에서 hidden 값 확인하기.
  useEffect(()=>{
    const hidden = localStorage.getItem("coachmark_personal_hidden") === "true";
    if (!hidden) setShowCoachmark(true);
  },[])


  //API 연동
  useEffect(()=>{
    const fetchPersonalCurations = async () => {
      try{
        console.log("개인화 큐레이션 불러오기");
        setLoading(true);
        setError("");

        const headers = accessToken
        ?{Authorization:`Bearer ${accessToken}`}
        :{};

        const res = await axios.get(`${API_BASE}/curation/personal`,{
          headers,
        });
        console.log("[DEBUG] raw personal data:", res.data)
        
        const data = res.data || [];
        
        const mapped = data.map((item)=>({
          
          id: item.curationId,
          
          imageUrl: item.imageUrl || "",
          fieldBadges: item.crossCategoryName
            ? [item.categoryName, item.crossCategoryName]
            : [item.categoryName],
          insightBadge: item.curationType ==="INSIGHT",
          crossNoteBadge: item.curationType ==="CROSSNOTE",
          bestColumBadge: item.bestColumn === true,
          content: {
            title: item.title,
            description: item.description,
            sourceUrl: item.sourceUrl,
            },
            likeCount: item.likeCount?? 0, //좋아요 개수
            liked: item.liked ?? false, //좋아요 여부
            scraped: item.scraped ?? false,
        }));
        console.log("[DEBUG] mapped curations:", mapped);

        setCurations(mapped);
        console.log("개인화 큐레이션 불러오기 끝");
      } catch (err) {
        console.error(err);
        setError("개인화 큐레이션 불러오기 1차 실패");
        //401일 때 refresh 시도
        if(err.response?.status===401){
          try{
            const newToken = await refreshAccessToken();
            if(!newToken) {return;}

            //새 토큰으로 한 번 더 재요청
            const headers = newToken
            ?{Authorization:`Bearer ${newToken}`}
            :{};

            const res = await axios.get(`${API_BASE}/curation/personal`,{
              headers,
            });
            console.log("[DEBUG] raw personal data:", res.data)
            
            const data = res.data || [];
            
            const mapped = data.map((item)=>({
              
              id: item.curationId,
              
              imageUrl: item.imageUrl || "",
              fieldBadges: item.crossCategoryName
                ? [item.categoryName, item.crossCategoryName]
                : [item.categoryName],
              insightBadge: item.curationType ==="INSIGHT",
              crossNoteBadge: item.curationType ==="CROSSNOTE",
              bestColumBadge: item.bestColumn === true,
              content: {
                title: item.title,
                description: item.description,
                sourceUrl: item.sourceUrl,
                },
                liked: item.liked ?? false, //좋아요 여부
                likeCount: item.likeCount ?? 0,
                scraped: item.scraped ?? false,
            }));
            console.log("[DEBUG] mapped curations:", mapped);

            setCurations(mapped);
            console.log("개인화 큐레이션 불러오기 끝");
          } catch(retryErr){
            console.error("토큰 재발급 후 /curation/paersonal 재시도 실패:", retryErr);
            setError("개인화 큐레이션을 불러오지 못했어요.");
          } 
        } else {
            setError("개인화 큐레이션을 불러오지 못했어요");
          }
        }finally { setLoading(false);}
    };

    //로그인 상태에서만 호출 (accessToken 없으면 나감)
  if (!accessToken) return;
    fetchPersonalCurations();
  },[accessToken,refreshAccessToken]);

  //큐레이션 세부정보 보기
  const handleCurationClick = (item) => {
    navigate(`/curation/${item.id}`,{state:{item,from: "/curation/personal", },});
    console.log(item.id);

  };
  //큐레이션 더 보기
  const handleMoreCuration=()=>{navigate('/curation');}

  return (

    //일단 개인화 큐레이션 피드 먼저
    <div className="app-wrapper">
    {/* 코치마크 */}
    {showCoachmark && (
      <Coachmark
      targetRef={targetRef}
      onNeverShowAgain={()=>{
        localStorage.setItem("coachmark_personal_hidden","true");
        setShowCoachmark(false);
      }}
      />
    )}
    {/* 개인화 큐레이션 페이지 */}
    <div className={styles["personalCuration-wrapper"]}>
      <GlobalHeader ref={targetRef}/>
      <div className={styles["title-box"]}>
        <h1>오늘의 큐레이션</h1>
        <p>{userName}님이 선택한 관심/전문 분야의 최신 큐레이션으로 가져왔어요</p> 
      </div>
      
      <div className={styles["curation-box"]}>
        {curations.map(item => (
        <CurationItem
          key={item.id} 
          id={item.id} 
          imageUrl={item.imageUrl}
          
          fieldBadges={item.fieldBadges}

          insightBadge={item.insightBadge}
          crossNoteBadge={item.crossNoteBadge}
          bestColumBadge={item.bestColumBadge}

          content={item.content}
          likeCount={item.likeCount}
          liked={item.liked}
          scraped={item.scraped}
          onClick={()=>handleCurationClick(item)}
        />
      ))}
      </div>
      
      <div className={styles["btn-box"]}>
        <button type="button" className={styles["more-btn"]} onClick={handleMoreCuration}>
          <p>큐레이션 더보기</p>
        </button>
      </div>
      </div>
    </div>
  );
}
