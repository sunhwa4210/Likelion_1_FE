import { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import Modal from './Modal';

// 전역에서 모달을 열고 닫을 수 있게 해주는 Context 생성 (초깃값: null)
const ModalContext = createContext(null);

// 트리의 최상단에서 감싸는 Provider 컴포넌트
export function ModalProvider({ children }) {
  // 모달 상태를 보관하는 단일 state
  // - isOpen: 열림 여부
  // - title/message/variant/buttons: 모달 UI 설정값
  // - _resolve: open() 호출 시 Promise의 resolve를 임시 저장
  const [state, setState] = useState({ isOpen: false });

  //모달 열림/닫힘에 따라 wrapper 스크롤 잠금 토글
 useEffect(() => {
   const wrap = document.querySelector('.app-wrapper');
   if (!wrap) return;
   if (state.isOpen) wrap.classList.add('modal-open');
   else wrap.classList.remove('modal-open');
 }, [state.isOpen]);

  // 모달 열기: 구성(config)을 받아 Promise를 반환
  // - 호출 측에서는: const result = await open(config)
  const open = useCallback((config) => {
    return new Promise((resolve) => {
      // 모달을 연다 + config를 상태에 합치고, resolve를 _resolve로 저장
      setState({ isOpen: true, ...config, _resolve: resolve });
    });
  }, []);

  // 모달 닫기: 이유(reason)를 넘겨서 대기 중이던 Promise를 해제
  const close = useCallback((reason) => {
    setState((s) => {
      // _resolve가 있으면 호출(예: 'overlay', 'escape', 'close' 등)
      s._resolve?.(reason ?? 'close');
      // 모달 상태 초기화(닫힘)
      return { isOpen: false };
    });
  }, []);

  // 액션 버튼 클릭 시: 클릭된 버튼의 value를 결과로 resolve
  const onAction = useCallback((value) => {
    setState((s) => {
      s._resolve?.(value);      // 버튼 value를 결과로 전달
      return { isOpen: false }; // 닫기
    });
  }, []);

  // 컨텍스트로 내보낼 값 메모이즈: 매 렌더마다 같은 레퍼런스 보장
  const ctx = useMemo(() => ({ open, close }), [open, close]);

  return (
    // 하위 트리에 open/close 함수를 공급
    <ModalContext.Provider value={ctx}>
      {children}
      {/* 실제 모달 렌더: 상태를 Modal UI로 전달 */}
      <Modal
        isOpen={state.isOpen}
        title={state.title}
        message={state.message}
        variant={state.variant}
        buttons={state.buttons}
        onClose={close}      // 오버레이/ESC 등 닫힘 시 close 호출
        onAction={onAction}  // 버튼 클릭 시 onAction 호출
      />
    </ModalContext.Provider>
  );
}

// 컴포넌트 어디서든 모달 열기/닫기 함수에 접근하는 훅
export function useModal() {
  const ctx = useContext(ModalContext);
  // Provider 밖에서 쓰면 에러로 알려주기 (사용자 실수 방지)
  if (!ctx) throw new Error('useModal은 반드시 ModalProvider 안에서만 사용해야합니다.');
  return ctx; // { open, close }
}
