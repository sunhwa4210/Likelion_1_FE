import Reat ,{useEffect} from "react";
import InsightBadge from "../../components/icons/InsightBadge";
import CrossNoteBadge from "../../components/icons/CrossNoteBadge";
import BestCalumBadge from "../../components/icons/BestCalumBadge";
import GoodCountIcon from "../../components/icons/GoodCountIcon";
import BookmarkIcon from "../../components/icons/BookmarkIcon";
import ContentEmbed from "../../components/Curation/ContentEmbed";

import CategoryXselector from "../../components/Badges/CategoryXselector";
import { categories } from "../../components/Badges/CategoryData";
import { useNavigate } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";
import styles from './CurationDetail.module.css';


export default function CurationDetail() {
  const { id } = useParams();          // URL의 :id (필요하면 사용)
  const location = useLocation();
  const item = location.state?.item;   // AllCuration에서 넘긴 item

  useEffect(()=>{console.log(item)},[]);

  if (!item) {
    // 새로고침 등으로 state가 날아간 경우 – 나중에 여기서 id로 API 요청하면 됨
    return <div>큐레이션 정보를 찾을 수 없습니다. (id: {id})</div>;
  }

  const {
    imageUrl,
    insightBadge,
    crossNoteBadge,
    bestCalumBadge,
    fieldBadges,
    content,
    likes,
    isBookmarked,
    embedType,
    embedUrl,
  } = item;
  
  const findCategoryItem = (label) => {
    // 공백을 제거해 정확히 일치하는 카테고리 찾기 
    const trimmedLabel = label ? label.trim() : '';
    // CategoryData.js의 categories 배열을 사용
    return categories.find(cat => cat.label.trim() === trimmedLabel);
  };

  // fieldBadges 배열을 순회하며 각 레이블에 해당하는 카테고리 객체를 찾음 
  const categoriesToDisplay = (fieldBadges || [])
      .map(label => findCategoryItem(label))
      .filter(item => item !== undefined); // 찾지 못한 항목 제외

    return (
    <div className="app-wrapper">
      <div className={styles["curation-detail-wrapper"]}>

        <div className={styles["curation-detail-box"]}>
            <div className={styles["curation-image-placeholder"]}>
                <img src={imageUrl} alt="큐레이션 이미지" />

                {insightBadge && (
                  <div className={styles["insight-badge"]}> 
                    <InsightBadge type={insightBadge} />
                  </div>
                )}
                {crossNoteBadge && (
                  <div className={styles["cross-note-badge"]}> 
                    <CrossNoteBadge type={crossNoteBadge} />
                  </div>
                )}
                {bestCalumBadge && (
                  <div className={styles["best-calum-badge"]}> 
                    <BestCalumBadge type={bestCalumBadge} />
                  </div>
                )}
            </div>

            <div className={styles["curation-content"]}>

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

              {/* 큐레이션 제목 */}
              <p className={styles["content-title"]}>{content}</p>

              {/* 큐레이션 내용 */}
              <p className={styles["content-title"]}>{content}</p>

              {/* 큐레이션 임베드 */}
              <ContentEmbed type={embedType} url={embedUrl} />
  
            {/* -- 푸터 영역 -- */}
            <div className={styles["curation-footer"]}>
              {/* 6. 좋아요 버튼 컴포넌트 사용 */}
              <GoodCountIcon count={likes} />
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className={styles["curation-detail-btn-box"]}>

        </div>

      </div>
    </div>
  
    
    );
}
