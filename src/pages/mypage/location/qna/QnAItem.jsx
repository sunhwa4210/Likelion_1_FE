import React from 'react';
import styles from './QnAItem.module.css';
import GoodCountIcon from '../../../../components/icons/GoodCountIcon';
import CommentCountIcon from '../../../../components/icons/CommentCountIcon'

/**
 * 단일 질문 목록 항목을 표시하는 컴포넌트
 * @param {object} props
 * @param {number} props.id - 질문 ID
 * @param {string} props.title - 질문 제목
 * @param {string} props.previewContent - 질문 내용 미리보기
 * @param {number} props.likes - 좋아요 수
 * @param {number} props.comments - 댓글 수
 * @param {string} props.date - 작성일
 */

const QnAItem = ({ id, title, previewContent, likes, comments, date }) => {
  // ✅ 상세 페이지 이동 경로 추가 필요 !!! 
  const handleClick = () => {
    console.log(`질문 ID: ${id} 클릭됨`);
    // 예: navigate(`/questions/${id}`);
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