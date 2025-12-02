import React, { useEffect, useState } from "react";
import { useNavigate, useParams,useLocation } from "react-router-dom";
import axios from "axios";

// 컴포넌트
import InsightBadge from "../../components/icons/InsightBadge";
import CrossNoteBadge from "../../components/icons/CrossNoteBadge";
import BestCalumBadge from "../../components/icons/BestCalumBadge";
import CurationLikeButton from "../../components/Curation/CuraionLikeButton";
import CurationScrapButton from "../../components/Curation/CurationScrapButton";
import ContentEmbed from "../../components/Curation/ContentEmbed";
import CategoryXselector from "../../components/Badges/CategoryXselector";
import { categories } from "../../components/Badges/CategoryData";
import { useAuth } from "../../contexts/AuthContext";

import styles from "./CurationDetail.module.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

//유튜브 URL인지 판별
function isYoutubeUrl(url) {
  if(!url) return false;
  return url.includes("youtube.com/watch")|| url.includes("youtu.be/");
}

//내부 라우트 인지 판별 (베스트 칼럼인 경우 -> 원본 칼럼 보기)
function isInternalRouter(url){
  if(!url) return false;
  return url.startsWith("/");
}

export default function CurationDetail() {
  const { curationId } = useParams();
  const { accessToken } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const [data, setData] = useState(null); // 서버에서 받은 원본 데이터
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const fromPath = location.state?.from || "/curation";

  // 상세 데이터 조회
  useEffect(() => {
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

    fetchDetail();
  }, [curationId, accessToken]);


  // 로딩 중
  if (loading && !data) {
    return (
      <div className="app-wrapper">
        <p>로딩 중입니다...</p>
      </div>
    );
  }

  // 에러
  if (error) {
    return (
      <div className="app-wrapper">
        <p>{error}</p>
      </div>
    );
  }

  // 데이터 없음
  if (!data) {
    return (
      <div className="app-wrapper">
        <p>큐레이션 정보를 찾을 수 없습니다. (id: {curationId})</p>
      </div>
    );
  }

//데이터 있는 경우
  const {
    id,
    title,
    description,
    imageUrl,
    sourceUrl,
    curationType,
    categoryName,
    crossCategoryName,
    likeCount, //좋아요 개수
    originalColumnId, // 오리지날 칼럼 id
    bestColumn, //베스트 칼럼 여부
    scraped, //스크립트 여부
    liked, //좋아요 여부
  } = data;

  console.log("[DETAIL] likeCount, liked:", likeCount, liked, typeof liked);


  // 타입별 구분
  const isInsight = curationType === "INSIGHT";
  const isCrossNote = curationType === "CROSSNOTE";
  const isBestColumn = bestColumn === true;

  // 카테고리 매핑
  const categoryLabels = [categoryName, crossCategoryName].filter(Boolean);
  const categoriesToDisplay = categories.filter((cat) =>
    categoryLabels.includes(cat.label)
  );


  // 원문 칼럼 이동
  const handleGoColumn = () => {
      if (!sourceUrl) return;
      nav(sourceUrl);
  };
  //외부 링크로 이동
  const handleGoExternal = () => {
    if(!sourceUrl) return;
    window.open(sourceUrl,"_blank","noopener,noreferrer");
  }
  //뒤로가기 버튼 핸들러
  const handleBack = () =>{
    nav(fromPath);
  }

  return (
    <div className={`app-wrapper ${styles.appWrapper}`}>
      <div className={styles["curation-detail-wrapper"]}>
        {/* 썸네일 + 타입 뱃지 */}
        <div className={styles["curation-image-placeholder"]}>
          <img src={imageUrl} alt="큐레이션 이미지를 불러오지 못했습니다." />

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
          {/* 분야 뱃지 */}
          <div className={styles["badge-group"]}>
            {categoriesToDisplay.length > 0 && (
              <CategoryXselector
                categoriesToDisplay={categoriesToDisplay}
                removableMode={false}
                viewOnly={true}
              />
            )}
          </div>

          {/* 콘텐츠 영역 */}
          <div className={styles["curation-content-box"]}>
            <div className={styles["curation-content"]}>
              <p className={styles["content-title"]}>{title}</p>
              <p className={styles["content"]}>{description}</p>
            </div>

            {/* 임베드 영역: url이 유튜브인 경우만 */}
            {isYoutubeUrl(sourceUrl) && (
              <ContentEmbed url={sourceUrl} />
            )}
            
          </div>

          {/* 푸터 */}
          <div className={styles["curation-footer"]}>
              <CurationLikeButton
                curationId={curationId}
                initialLikeCount={likeCount ?? 0}
                initialLiked={liked}  
              />
            {/* 베스트 칼럼 일땐, 내부 라우트 버튼 */}
            {isBestColumn && (
              <button  type="button" onClick={handleGoColumn}>
                <p  className={styles["go-colum-btn"]}>원문 칼럼에서 보기</p>
              </button>
            )}
            {/* embedUrl(sourceUrl)이 유튜브가 아닌 경우(임베드 영역 생략, 버튼으로 이동 */}
            {!isYoutubeUrl(sourceUrl) && !isInternalRouter(sourceUrl) && (
              <button
                type="button"
                onClick={handleGoExternal}
              >
               <p className={styles["go-extarnal-btn"]}>⬅️ 원본 링크로 이동하기</p>
              </button>
            )}
                    
          </div>
        </div>
      </div>

      {/* 아래 버튼 (뒤로가기 + 스크랩) */}
      <div className={styles["curation-detail-btn-box"]}>
        <button onClick={handleBack}>
            <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_d_291_6292)">
              <rect x="14" y="14" width="80" height="80" rx="40" fill="white" shapeRendering="crispEdges"/>
              <rect x="14.5" y="14.5" width="79" height="79" rx="39.5" stroke="#39A2A5" shapeRendering="crispEdges"/>
              <path d="M58 62L50 54L58 46" stroke="#39A2A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <defs>
              <filter id="filter0_d_291_6292" x="0" y="0" width="108" height="108" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feMorphology radius="4" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_291_6292"/>
              <feOffset/>
              <feGaussianBlur stdDeviation="5"/>
              <feComposite in2="hardAlpha" operator="out"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0.473077 0 0 0 0 0.473077 0 0 0 0 0.473077 0 0 0 0.1 0"/>
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_291_6292"/>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_291_6292" result="shape"/>
              </filter>
              </defs>
            </svg>
        </button>
        <CurationScrapButton
          curationId={curationId}
          initialScrapped={scraped}
          variant="detail"
        />
      </div>
    </div>
  );
}
