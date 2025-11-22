import React, { useState, useRef } from 'react';
import styles from './NotifyList.module.css';
import {initialNotifications} from './dummyNotify';
import NotifyIcon from './component/notifyIcon';
import { useModal } from '../../components/Modal/ModalProvider';
import { presets } from '../../components/Modal/presets';

const ACTION_WIDTH = 160; // 액션 버튼의 총 너비 
const SWIPE_THRESHOLD = 50; // 스와이프가 인식되는 최소 거리 

const NotificationComponent = () => {
  const { open } = useModal();

  const [notifications, setNotifications] = useState(initialNotifications);

  // 스와이프 상태 관리를 위한 Ref와 State
  // 1. revealedId: 스와이프가 완료되어 액션 버튼이 열린 상태의 ID
  const [revealedId, setRevealedId] = useState(null);
  // 2. touchStartX: 터치가 시작된 X 좌표
  const touchStartX = useRef(0);
  // 3. dragOffset: 현재 드래그 중인 X 이동 거리 (음수: 왼쪽 스와이프, 양수: 오른쪽 스와이프)
  const [dragOffset, setDragOffset] = useState({ id: null, offset: 0 });

  const [isDragging, setIsDragging] = useState(false); // 마우스 드래그 상태 추적

  // 1. 터치 시작 (touchstart)
  const handleStart = (e, id) => {
    // 마우스 이벤트 시 버튼 클릭을 막기 위해 
    if (e.button === 2) return;

    // 현재 터치 시작점 저장
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;

    touchStartX.current = clientX;
    setIsDragging(true); // 드래그 시작 상태 설정
    
    // 드래그 상태 초기화
    const initialOffset = revealedId === id ? ACTION_WIDTH : 0;
    setDragOffset({ id, offset: initialOffset });

    // 마우스 이벤트의 기본 동작(텍스트 선택 등) 방지
    if (!e.touches) {
        e.preventDefault(); 
    }
  };

  // 2. 터치 이동 (touchmove)
  const handleMove = (e) => {
    if (!isDragging || dragOffset.id === null) return; // 드래그 중이 아니면 무시

    // 스와이프 중 웹 페이지 스크롤 방지 (모바일)
    if (e.touches && e.cancelable) {
        e.preventDefault(); 
    }

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;

    // 이동 거리 계산: (시작 X - 현재 X)
    let diffX = touchStartX.current - clientX;

    // 만약 이미 열려있는 상태에서 시작했다면
    if (revealedId === dragOffset.id) {
        // 닫는 방향 (오른쪽 스와이프)으로 이동할 때, 시작점에서부터 거리를 계산 필요 
        diffX = ACTION_WIDTH + (touchStartX.current - clientX);
    }

    // 드래그 범위를 제한 (왼쪽 스와이프는 최대 ACTION_WIDTH, 오른쪽 스와이프는 0까지만)
    let newOffset = Math.max(0, Math.min(ACTION_WIDTH, diffX));
    
    setDragOffset(prev => ({ ...prev, offset: newOffset }));
  };

  // 3. 터치 종료 (touchend)
  const handleEnd = () => {
    if (!isDragging || dragOffset.id === null) return;

    const { id, offset } = dragOffset;

    let finalOffset;
    let finalRevealedId;

    // 최종 드래그 거리가 임계값보다 크면 열기/유지
    if (offset > SWIPE_THRESHOLD) {
      finalOffset = ACTION_WIDTH;
      finalRevealedId = id;
    } 
    // 임계값보다 작으면 닫기
    else {
      finalOffset = 0;
      finalRevealedId = null;
    }
    
    // 최종 revealedId 상태 업데이트
    setRevealedId(finalRevealedId);

    // 드래그 상태 해제
    setIsDragging(false);
    
    // 닫는 동작(finalOffset === 0)일 경우, 
    // 다음 드래그를 위해 dragOffset을 즉시 초기화
    if (finalOffset === 0) {
        setDragOffset({ id: null, offset: 0 });
    } else {
        // 열린 상태로 유지될 경우, transformStyle 계산을 위해 dragOffset을 고정값으로 설정
        setDragOffset({ id, offset: finalOffset });
    }
  };

    // 전체 읽음처리: 모달 확인 후 처리
    const handleReadAll = async () => {
        const res = await open(presets.confirmReadAll());
        if (res === 'read-all') {
            const updatedNotifications = notifications.map(notif => ({ ...notif, isRead: true }));
            setNotifications(updatedNotifications);
            setRevealedId(null);
            console.log("모든 알림을 읽음 처리했습니다.");
        }
    };

    // 전체 삭제: 모달 확인 후 처리
    const handleDeleteAll = async () => {
        const res = await open(presets.confirmDeleteAll());
        if (res === 'delete-all') {
            setNotifications([]);
            setRevealedId(null);
            console.log("모든 알림을 삭제했습니다.");
        }
    };

  const handleDelete = (id) => { 
    // 삭제 시 목록에서 제거 
    const updatedNotifications = notifications.filter(notif => notif.id !== id);
    setNotifications(updatedNotifications);
    setRevealedId(null);
    setDragOffset({ id: null, offset: 0 }); // 드래그 상태 초기화
  };

  const handleMarkAsRead = (id) => { 
    // 읽음 처리
    const updatedNotifications = notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    );
    setNotifications(updatedNotifications); // 상태 업데이트
    setRevealedId(null);
    setDragOffset({ id: null, offset: 0 }); // 드래그 상태 초기화
  };

  return (
    <div className={styles.notificationContainer}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}

        onMouseMove={isDragging ? handleMove : null} // 마우스 없을 때 이동 처리
        onMouseUp={handleEnd}
        onMouseLeave={isDragging ? handleEnd : null}
    >
      
      {/* -- 헤더 영역 -- */}
      <div className={styles.notificationHeader}>
        <button 
          onClick={handleReadAll} 
          className={`${styles.notificationButton} ${styles.readAllButton}`}
        >
          <span role="img" aria-label="read-all"><NotifyIcon/></span> 전체 읽음처리
        </button>
        <button 
          onClick={handleDeleteAll} 
          className={`${styles.notificationButton} ${styles.deleteAllButton}`}
        >
          <span role="img" aria-label="delete-all"></span> 전체 삭제
        </button>
      </div>

      {/* -- 알림 목록 영역 -- */}
      {notifications.length > 0 ? (
        notifications.map((notif) => {
            
            // 해당 항목의 현재 offset 계산
            let transformOffset = 0;
            let currentDraggingOffset = 0;

            // 현재 드래그 중인 항목인지 확인
            const isCurrentlyDragging = dragOffset.id === notif.id;

            if (isCurrentlyDragging) {
                // 1. 드래그 중이라면, 드래그 offset 사용
                transformOffset = dragOffset.offset;
                currentDraggingOffset = dragOffset.offset; // transition을 'none'으로 설정하기 위해 저장
            } else if (revealedId === notif.id) {
                // 2. 드래그가 끝나고 열린 상태로 고정된 항목이라면, ACTION_WIDTH를 사용
                transformOffset = ACTION_WIDTH;
            }
            // 3. 그 외의 모든 경우는 transformOffset = 0

            // CSS transform 스타일
            const transformStyle = {
                transform: `translateX(-${transformOffset}px)`,
                // 드래그 중일 때는 transition을 끄고, touchend에서만 transition을 적용
                transition: dragOffset.id === notif.id ? 'none' : 'transform 0.3s ease-in-out',
            };

            return (
                <div
                    key={notif.id}
                    className={`${styles.notificationItemWrapper} ${notif.isRead ? styles.read : styles.unread}`}
                >
                    {/* 알림 내용 (스와이프에 따라 움직이는 부분) */}
                    <div 
                        className={styles.notificationContent}
                        style={transformStyle}

                        // 스와이프 시작 이벤트를 content 영역으로 이동시킴 
                        onTouchStart={!notif.isRead ? (e) => handleStart(e, notif.id) : undefined}
                        onMouseDown={!notif.isRead ? (e) => handleStart(e, notif.id) : undefined}

                        // 스와이프 액션이 열려있지 않을 때만 콘텐츠 클릭 가능 (클릭 방지)
                        // 스와이프 액션이 열려있지 않을 때만 콘텐츠 클릭(페이지 이동) 처리
                        onClick={(e) => {
                            // 스와이프 액션이 열려있으면 클릭 방지
                            if (revealedId === notif.id) {
                                e.stopPropagation();
                                // 열린 상태에서 클릭하면 닫히도록 처리 
                                setRevealedId(null);
                            } else {
                                console.log(`알림 ${notif.id}번 클릭! 페이지 이동 처리.`);
                            }
                        }}
                    >
                        <span className={styles.notificationMessage}>{notif.message}</span>
                        <span className={styles.notificationTime}>{notif.time}</span>
                    </div>

                    {/* 스와이프했을 때 나오는 버튼 부분 (고정된 부분) */}
                    {/* 읽지 않은 항목일 때만 액션 버튼을 렌더링하도록 조건 걸음 */}
                    {!notif.isRead && (
                        <div className={styles.notificationActions}>
                            <button 
                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                    onClick={() => handleDelete(notif.id)}
                            >
                                삭제
                            </button>
                            <button 
                                className={`${styles.actionButton} ${styles.readButton}`}
                                onClick={() => handleMarkAsRead(notif.id)}
                            >
                                읽음
                            </button>
                        </div>
                    )}
                </div>
            )
        })
      ) : (
        <div className={styles.notificationEmpty}>받은 알림이 없습니다.</div> // '전체 삭제' 눌렀을 때 
      )}
    </div>
  );
};

export default NotificationComponent;