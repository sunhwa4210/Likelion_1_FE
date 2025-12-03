import React from 'react';
import styles from './QnAItem.module.css';
import GoodCountIcon from '../../../../components/icons/GoodCountIcon';
import CommentCountIcon from '../../../../components/icons/CommentCountIcon';
import { useNavigate } from 'react-router-dom';

const QnAItem = ({ id, title, previewContent, likes, comments, date }) => {
  const navigate = useNavigate(); // ✅ useNavigate 훅 사용
  
  const handleClick = () => {
    // 다른 팀원이 만든 상세 페이지 경로로 이동 (예: /questions/1)
    navigate(`/qnadetail/${id}`);
  };

  return (
    <div className={styles.questionListItem} onClick={handleClick}>

      <div className={styles.itemHeader}>
        <h3 className={styles.itemTitle}>{title}</h3>
      </div>

      <p className={styles.itemPreview}>{previewContent}</p>

      <div className={styles.itemFooter}>
        <span className={styles.itemStats}>
          <GoodCountIcon className={`${styles.icon} ${styles.heartIcon}`} /> {likes}
        </span>

        <span className={styles.itemStats}>
          <CommentCountIcon className={`${styles.icon} ${styles.commentIcon}`} /> {comments}
        </span>
      </div>
    </div>
  );
};

export default QnAItem;