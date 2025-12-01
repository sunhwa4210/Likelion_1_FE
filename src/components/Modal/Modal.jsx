
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

export default function Modal({
  isOpen,                     // 모달 열림/닫힘 상태
  title,                      // 모달 제목
  message,                    // 본문 메시지
  variant = 'primary',        // 스타일 테마: 'primary' | 'danger' | 'neutral'
  buttons = [],               // 버튼 배열: [{ label, value, tone?, autoFocus? }]
  onClose,                    // 닫기 핸들러(overlay/esc 등 이유를 인자로 받음)
  onAction,                   // 버튼 클릭 핸들러(버튼 value를 인자로 받음)
}) {
  const cardRef = useRef(null); // 모달 카드 DOM에 접근하기 위한 ref

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.('escape');
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // 자동 포커스 처리
  useEffect(() => {
    if (!isOpen) return;

    const auto = cardRef.current?.querySelector('[data-autofocus="true"]');
    (auto || cardRef.current)?.focus?.();
  }, [isOpen, buttons]);

  // 모달이 닫혀 있으면 아무 것도 렌더링하지 않음
  if (!isOpen) return null;

  // app-wrapper 위에서만 렌더링되도록 (app-wrapper 기준 정중앙)
  const target =
    typeof document !== 'undefined'
      ? document.querySelector('.app-wrapper')
      : null;
  if (!target) return null;

  const modalNode = (
    <div
      className={styles['modal-overlay']}
      onClick={() => onClose?.('overlay')}
    >
      <div
        className={`${styles['modal-card']} ${
          styles[`modal-${variant}`] || ''
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles['modal-textbox']}>
          {title && (
            <h3 id="modal-title" className={styles['modal-title']}>
              {title}
            </h3>
          )}
          {message && (
            <p className={styles['modal-message']}>{message}</p>
          )}
        </div>

        <div className={styles['modal-actions']}>
          {buttons.map((b, i) => {
            const toneClass =
              styles[b.tone ? `btn-${b.tone}` : 'btn-primary'];

            return (
              <button
                key={i}
                type="button"
                className={`${styles['modal-btn']} ${toneClass || ''}`}
                onClick={() => onAction?.(b.value)}
                data-autofocus={b.autoFocus ? 'true' : undefined}
                autoFocus={b.autoFocus}
              >
                {b.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return createPortal(modalNode, target);
}
