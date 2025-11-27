import React ,{useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";


//컴포넌트
import InsightBadge from "../../components/icons/InsightBadge";
import CrossNoteBadge from "../../components/icons/CrossNoteBadge";
import BestCalumBadge from "../../components/icons/BestCalumBadge";
import GoodCountIcon from "../../components/icons/GoodCountIcon";
import BookmarkIcon from "../../components/icons/BookmarkIcon";
import ContentEmbed from "../../components/Curation/ContentEmbed";
import CategoryXselector from "../../components/Badges/CategoryXselector";
import { categories } from "../../components/Badges/CategoryData";
//import { useAuth } from "../../contexts/AuthContext"; API 연결 시 살리기

import styles from './CurationDetail.module.css';

const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

//임시 더미데이터 (API 연결후 삭제)
const DUMMY_DETAIL = {
  curationId: 30,
  title: "궤도가 들려주는 화학 이야기!",
  description:
    "Lorem ipsum dolor sit amet consectetur. Id posuere fermentum duis pellentesque.\n\n" +
    "Lorem ipsum dolor sit amet consectetur. Faucibus eget ac vitae turpis faucibus cras sit amet. Nulla tellus id morbi duis condimentum. Sed purus elementum orci vestibulum pulvinar integer ultrices sed.",
  imageUrl: "https://via.placeholder.com/600x300?text=Thumbnail",
  sourceUrl: "https://www.youtube.com/watch?v=dummy",
  curationType: "CROSSNOTE", // INSIGHT | CROSSNOTE | BEST_COLUMN
  categoryName: "화학",
  crossCategoryName: "경제",
  likeCount: 100,
  scrapCount: 12,
};

export default function CurationDetail() {
  const { curationId } = useParams();        
  //const {accessToken} = useAuth();

  const [data, setData] = useState(null);   // 서버에서 받은 원본 데이터
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 상세 데이터 조회
  useEffect(() => {
    //더미데이터용 임시 코드 (나중에 지우기)
    try {
      setLoading(true);
      setError("");
      setData(DUMMY_DETAIL);
    } catch (e) {
      setError("큐레이션 상세 데이터를 불러오지 못했습니다. (더미)");
    } finally {
      setLoading(false);
    }


    /*
    if (!accessToken || !curationId) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`${API_BASE}/curation/${curationId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setData(res.data);
      } catch (err) {
        console.error("GET /curation/{curationId} 실패:", err);
        setError("큐레이션 상세 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();*/
  }, [curationId]);

  //로딩, 에러, 데이터 없음 시
  if (loading && !data) {
    return (
      <div className="app-wrapper">
        <p>로딩 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-wrapper">
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="app-wrapper">
        <p>큐레이션 정보를 찾을 수 없습니다. (id: {curationId})</p>
      </div>
    );
  }

  //데이터가 있는 경우
  const {
    title,
    description,
    imageUrl,
    sourceUrl,
    curationType,
    categoryName,
    crossCategoryName,
    likeCount,
    scrapCount, // 지금은 안 쓰지만 혹시 모를 확장용으로 남겨 둠
  } = data;

  // curationType 에 따라 뱃지 렌더링
  const isInsight = curationType === "INSIGHT";
  const isCrossNote = curationType === "CROSSNOTE";
  const isBestColumn = curationType === "BEST_COLUMN";

  // 카테고리 레이블 → CategoryData 객체로 매핑
  const categoryLabels = [categoryName, crossCategoryName].filter(Boolean);

  const categoriesToDisplay = categories.filter((cat) =>
    categoryLabels.includes(cat.label)
  );

  // 좋아요/임베드용 파생 값들
  const likes = likeCount ?? 0;
  const embedType = null; // 아직 서버에서 안 오니 기본값
  const embedUrl = sourceUrl;  // 필요해지면 sourceUrl 기반으로 파싱하면 됨



  return (
    <div className={`app-wrapper ${styles.appWrapper}`}>
      <div className={styles["curation-detail-wrapper"]}>
            
            {/* 썸네일 + 타입 뱃지 */}
            <div className={styles["curation-image-placeholder"]}>
                <img src={imageUrl} alt="큐레이션 이미지" />

                {isInsight && (
                  <div className={styles["insight-badge"]}> 
                    <InsightBadge type="INSIGHT" />
                  </div>
                )}
                {isCrossNote && (
                  <div className={styles["cross-note-badge"]}> 
                    <CrossNoteBadge type="CROSSNOTE" />
                  </div>
                )}
                {isBestColumn && (
                  <div className={styles["best-calum-badge"]}> 
                    <BestCalumBadge type="BEST_COLUMN" />
                  </div>
                )}
            </div>
            
            {/* 텍스트+카테고리+임베드+좋아요 */}
            <div className={styles["curation-detail-box"]}>

            {/* 콘텐츠 영역 상단의 분야 뱃지들 */}
            <div className={styles["badge-group"]}>
              {categoriesToDisplay.length > 0 && (
                <CategoryXselector
                  categoriesToDisplay={categoriesToDisplay}
                  removableMode={false}
                  viewOnly={true}
                />
              )}
            </div>
            
            {/* 큐레이션 콘텐츠 (제목+ 내용+임베드) */}
            <div className={styles["curation-content-box"]}>
             
              <div  className={styles["curation-content"]}>
              {/* 큐레이션 제목 */}
              <p className={styles["content-title"]}>{title}</p>

              {/* 큐레이션 내용 */}
              <p className={styles["content"]}>{description}</p>
              </div>

              {/* 큐레이션 임베드 */}
              <ContentEmbed type={embedType} url={embedUrl} />
            </div>

            {/* 푸터 영역 (좋아요+원문 보기) */}
            <div className={styles["curation-footer"]}>
              <GoodCountIcon count={likes} />
              <button>
                <p>원문 칼럼에서 보기</p>
              </button>
            </div>

          </div>
        </div>
        
        {/* 아래 버튼 (뒤로가기+스크랩) */} 
        <div className={styles["curation-detail-btn-box"]}>
        {/* 북마크 컴포넌트 추가 */}
        </div>
      </div>
    
    );
}


