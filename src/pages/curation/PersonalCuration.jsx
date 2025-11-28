import React,{useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import styles from './PersonalCuration.module.css';
import GlobalHeader from "../../components/atoms/header/GlobalHeader";
import CurationItem from "../../components/Curation/CurationItem"
import { useAuth } from "../../contexts/AuthContext";


const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

export default function PersonalCuration() {
  // 사용자 정보 가져오기 
  const { user,accessToken } = useAuth();
  const navigate = useNavigate();

  const userName = user?.name ?? "사용자";

  const [curations,setCurations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
          bestColumnBadge: item.bestColumn === true,
          content: {
            title: item.title,
            description: item.description,
            sourceUrl: item.sourceUrl,
            },
            likes: item.likeCount ?? 0,
            isBookmarked: item.scraped ?? false,
        }));
        console.log("[DEBUG] mapped curations:", mapped);

        setCurations(mapped);
        console.log("개인화 큐레이션 불러오기 끝");
      } catch (err) {
        console.error(err);
        setError("개인화 큐레이션을 불러오지 못했어요.");
      }
      finally { setLoading(false);}
    };

    //로그인 상태에서만 호출 (accessToken 없으면 나감)
    if (!accessToken) return;
    fetchPersonalCurations();
  },[accessToken]);

  //큐레이션 세부정보 보기
  const handleCurationClick = (item) => {
    navigate(`/curation/${item.id}`,{state:{item},});
    console.log(item.id);

  };
  //큐레이션 더 보기
  const handleMoreCuration=()=>{navigate('/curation');}

  return (

    //일단 개인화 큐레이션 피드 먼저
    <div className="app-wrapper">
    <div className={styles["personalCuration-wrapper"]}>
      <GlobalHeader/>
      <div className={styles["title-box"]}>
        <h1>오늘의 큐레이션</h1>
        <p>{userName}님이 선택한 관심/전문 분야의 최신 큐레이션으로 가져왔어요</p> 
      </div>
      
      <div className={styles["curation-box"]}>
        {curations.map(item => (
        <CurationItem
          key={item.id} 
          imageUrl={item.imageUrl}
          
          fieldBadges={item.fieldBadges}

          insightBadge={item.insightBadge}
          crossNoteBadge={item.crossNoteBadge}
          bestCalumBadge={item.bestCalumBadge}

          content={item.content}
          likes={item.likes}
          isBookmarked={item.isBookmarked}

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
