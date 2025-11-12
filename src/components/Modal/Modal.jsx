// 모달 컴포넌트: 사용 방법은 pages/SomePage.js 를 참고해주세요

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

export default function Modal({
  isOpen,                     // 모달 열림/닫힘 상태
  title,                      // 모달 제목
  message,                    // 본문 메시지(
  variant = 'primary',        // 스타일 테마: 'primary' | 'danger' | 'neutral'
  buttons = [],               // 버튼 배열: [{ label, value, tone?, autoFocus? }]
  onClose,                    // 닫기 핸들러(overlay/esc 등 이유를 인자로 받음)
  onAction,                   // 버튼 클릭 핸들러(버튼 value를 인자로 받음)
}) {
  const cardRef = useRef(null); // 모달 카드 DOM에 접근하기 위한 ref

  //ESC 키로 모달 닫기
  useEffect(() => {
    if (!isOpen) return; // 닫혀 있으면 이벤트 리스너 설치할 필요 없음 (모달이 닫힌 상태라면 return)

    // 키보드가 눌릴 때 실행될 콜백
    const onKey = (e) => {
      // e.key가 'Escape'이면 onClose가 있을 때만 'escape' 이유로 닫기
      if (e.key === 'Escape') onClose?.('escape');
    };

    // keydown 이벤트 리스너 등록(이 리스너는 'keydown' 이벤트가 발생할 때만 실행됨)
    window.addEventListener('keydown', onKey);

    // 클린업: 모달이 닫히거나 컴포넌트가 언마운트되면 리스너 제거
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]); // isOpen/onClose가 바뀔 때만 리스너 재설치

  // 자동 포커스 처리
  useEffect(() => {
    if (!isOpen) return;

    // 모달 내부에서 data-autofocus="true"가 지정된 첫 요소를 찾음
    // (버튼에 autoFocus 옵션을 준 경우)
    const auto = cardRef.current?.querySelector('[data-autofocus="true"]');

    // auto가 있으면 그 요소에, 없으면 카드 자체에 포커스
    (auto || cardRef.current)?.focus?.();
  }, [isOpen, buttons]); // 열림 상태나 버튼 배열이 바뀌면 다시 포커스 시도

  // 모달이 닫혀 있으면 아무 것도 렌더링하지 않음(화면에 표시 X)
  if (!isOpen) return null;

  //app-wrapper 위에서만 랜더링 되도록 (app-wrapper 기준 정중앙)
  const target=
  typeof document !== 'undefined'
  ? document.querySelector('.app-wrapper')
  : null;
  if (!target) return null;

   const modalNode = (
    <div className="modal-overlay" onClick={() => onClose?.('overlay')}>
      <div
        className={`modal-card modal-${variant}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-textbox">
        {title && (
          <h3 id="modal-title" className="modal-title">
            {title}
          </h3>
        )}
        {message && <p className="modal-message">{message}</p>}
        </div>

        <div className="modal-actions">
          {buttons.map((b, i) => (
            <button
              key={i}
              type="button"
              className={`btn ${b.tone ? `btn-${b.tone}` : 'btn-primary'}`}
              onClick={() => onAction?.(b.value)}
              data-autofocus={b.autoFocus ? 'true' : undefined}
              autoFocus={b.autoFocus}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return createPortal(modalNode, target);
}


