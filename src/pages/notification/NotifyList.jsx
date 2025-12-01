// == 알림 목록 페이지 ==
// 1. 알림 목록 (읽은 알람/읽지 않은 알람)
// 2. 전체 읽음 처리
// 3. 전체 삭제 처리
// 4. 슬라이드 -> 선택 -> 읽음/삭제 처리
// 5. 실시간 알림 받기 ?..?

import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './NotifyList.module.css';
import NotifyIcon from './component/notifyIcon';
import { useModal } from '../../components/Modal/ModalProvider';
import { presets } from '../../components/Modal/presets';

// 실제 사용 시 환경 변수나 설정 파일에서 가져와야 함 
// ❌ AUTH_TOKEN은 실제 JWT 토큰으로 변경 필요 
const API_BASE_URL = process.env.REACT_APP_API_URL || "";
const AUTH_TOKEN = 'your_secure_authentication_bearer_token'; 

const ACTION_WIDTH = 160; 
const SWIPE_THRESHOLD = 50; 

// API 응답 데이터 구조를 내부 상태 구조로 변환하는 함수
const transformNotification = (notif) => ({
    id: notif.notificationId, // notificationId -> id
    message: notif.message,
    isRead: notif.read, // read -> isRead
    time: notif.createdAt, // createdAt -> time
    targetType: notif.targetType,
    targetId: notif.targetId,
    // 필요한 경우 receiverName, actorName 등 추가
});

// createdAt 필드를 UI 표시용으로 변환하는 함수 🔺
const formatTimeForDisplay = (createdAt) => {
    try {
        const now = new Date();
        const created = new Date(createdAt);
        const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
        
        if (diffInMinutes < 1) return '방금 전';
        if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
        
        const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return created.toLocaleDateString('ko-KR', dateOptions).replace(/\.\s*$/, ''); // . 제거
    } catch (e) {
        return createdAt;
    }
};

const NotificationComponent = () => {
    const { open } = useModal();

    // 상태 관리
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 스와이프 상태 관리 
    const [revealedId, setRevealedId] = useState(null);
    const touchStartX = useRef(0);
    const [dragOffset, setDragOffset] = useState({ id: null, offset: 0 });
    const [isDragging, setIsDragging] = useState(false);
    
    // API 요청 함수 
    const apiCall = useCallback(async (path, method = 'GET', body = null) => {
        const url = `${API_BASE_URL}${path}`;
        try {
            const options = {
                method,
                headers: {
                    'Authorization': `Bearer ${AUTH_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                ...(body && { body: JSON.stringify(body) }),
            };
            
            const response = await fetch(url, options);

            if (!response.ok) {
                // 에러 응답 본문을 읽어 에러 메시지에 포함 (필요한 경우)
                const errorText = await response.text();
                throw new Error(`API 호출 실패 (${response.status}): ${errorText}`);
            }

            // DELETE, PATCH 같은 경우 응답 본문이 비어있을 수 있으므로 처리
            if (response.headers.get('content-length') === '0') {
                return null;
            }

            return response.json();
        } catch (err) {
            console.error(`[${method} ${path}] 오류:`, err);
            throw err;
        }
    }, []);

    // ❌ 알림 목록을 서버에서 가져오는 함수 (GET /notification/me) - 알림 목록 조회  
    const fetchNotifications = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // NOTE: API 호출 시뮬레이션
            const data = await apiCall('/notification/me', 'GET');

            if (data) {
                const transformedData = data.map(transformNotification);
                setNotifications(transformedData);
            }
        } catch (err) {
            setError("알림 목록을 불러오는 데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    }, [apiCall]);

    // ❌ 안 읽은 알림 개수를 가져오는 함수 (GET /notification/me/count)
    const fetchUnreadCount = useCallback(async () => {
        try {
            // NOTE: API 호출 시뮬레이션
            const response = await fetch(`${API_BASE_URL}/notification/me/count`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` },
            });
            if (!response.ok) {
              throw new Error(`안 읽은 알림 개수 조회 실패: ${response.status}`);
            }
            const countText = await response.text();
            const count = parseInt(countText, 10);

            if (!isNaN(count)) {
                setUnreadCount(count);
            } else {
                console.error("안 읽은 알림 개수가 유효한 숫자가 아닙니다:", count);
                setUnreadCount(0);
            }
        } catch (err) {
            console.error("안 읽은 알림 개수 페칭 중 오류 발생:", err);
        }
    }, []);

    // 초기 데이터 로드 및 카운트 로드
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);
    
    // 알림 목록이 업데이트될 때마다 카운트 재계산
    //useEffect(() => {
    //    fetchUnreadCount();
    //}, [notifications, fetchUnreadCount]);


    // ❌ 실시간 알림 수신 (SSE) 로직
    useEffect(() => {
        // 토큰을 쿼리 파라미터로 포함하여 SSE 구독 엔드포인트에 연결
        const sseUrl = `${API_BASE_URL}/notification/subscribe?token=${AUTH_TOKEN}`;
        // NOTE: EventSource는 브라우저에서만 지원되므로, Canvas 환경에서는 콘솔 로그만 남깁니다.
        // const eventSource = new EventSource(sseUrl);
        
        console.log("SSE 연결 시도 (실제 브라우저 환경에서 작동):", sseUrl);

        // eventSource.onopen = () => { console.log('SSE 연결 성공'); };
        // eventSource.addEventListener('notification', (event) => {
        //     console.log('새 알림 수신:', event.data);
        //     try {
        //         const newNotifData = JSON.parse(event.data);
        //         const newNotification = transformNotification(newNotifData);
                
        //         setNotifications(prev => [newNotification, ...prev]);
        //         if (!newNotification.isRead) {
        //             setUnreadCount(prev => prev + 1);
        //         }
        //     } catch (e) {
        //         console.error('SSE 수신 데이터 파싱 오류:', e);
        //     }
        // });
        // eventSource.onerror = (error) => {
        //     console.error('SSE 연결 오류:', error);
        //     eventSource.close();
        // };

        // return () => {
        //     console.log('SSE 연결 해제');
        //     eventSource.close();
        // };
    }, []); 
    // =========================================================================


    // 스와이프 핸들러
    const handleStart = (e, id) => {
        if (e.button === 2) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        touchStartX.current = clientX;
        setIsDragging(true);
        const initialOffset = revealedId === id ? ACTION_WIDTH : 0;
        setDragOffset({ id, offset: initialOffset });
        if (!e.touches) { e.preventDefault(); }
    };

    const handleMove = (e) => {
        if (!isDragging || dragOffset.id === null) return;
        if (e.touches && e.cancelable) { e.preventDefault(); }

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let diffX = touchStartX.current - clientX;
        if (revealedId === dragOffset.id) {
            diffX = ACTION_WIDTH + (touchStartX.current - clientX);
        }
        let newOffset = Math.max(0, Math.min(ACTION_WIDTH, diffX));
        setDragOffset(prev => ({ ...prev, offset: newOffset }));
    };

    const handleEnd = () => {
        if (!isDragging || dragOffset.id === null) return;
        const { id, offset } = dragOffset;
        let finalOffset;
        let finalRevealedId;

        if (offset > SWIPE_THRESHOLD) {
            finalOffset = ACTION_WIDTH;
            finalRevealedId = id;
        } else {
            finalOffset = 0;
            finalRevealedId = null;
        }
        setRevealedId(finalRevealedId);
        setIsDragging(false);

        if (finalOffset === 0) {
            setDragOffset({ id: null, offset: 0 });
        } else {
            setDragOffset({ id, offset: finalOffset });
        }
    };

    // API 액션 함수 (GET, PATCH, DELETE)

    // ❌ 알림 전체 읽음 처리 (PATCH /notification/me)
    const handleReadAll = async () => {
        const res = await open(presets.confirmReadAll());
        if (res === 'read-all') {
            try {
                await apiCall('/notification/me', 'PATCH');
                console.log('API: PATCH /notification/me 호출');
                
                // 성공 시 Optimistic Update (모두 읽음 처리)
                const updatedNotifications = notifications.map(notif => ({ ...notif, isRead: true }));
                setNotifications(updatedNotifications);
                setUnreadCount(0); // 안 읽은 알림 개수 0으로 설정
                setRevealedId(null);
            } catch (e) {
                console.error("전체 읽음 처리 중 오류:", e);
                alert("전체 읽음 처리 중 오류가 발생했습니다."); // Custom Modal Alert 사용 권장?
            }
        }
    };

    // ❌ 알림 전체 삭제 (DELETE /notification/me)
    const handleDeleteAll = async () => {
        const res = await open(presets.confirmDeleteAll());
        if (res === 'delete-all') {
            try {
                await apiCall('/notification/me', 'DELETE');
                console.log('API: DELETE /notification/me 호출');

                // 성공 시 Optimistic Update (모두 삭제)
                setNotifications([]);
                setUnreadCount(0); // 안 읽은 알림 개수 0으로 설정
                setRevealedId(null);
            } catch (e) {
                console.error("전체 삭제 중 오류:", e);
                alert("전체 삭제 중 오류가 발생했습니다."); // Custom Modal Alert 사용 권장?
            }
        }
    };

    // ❌ 개별 알림 삭제 (DELETE /notification/me/{notificationId} - 임시 가정)
    const handleDelete = async (id) => {
        try {
            // [임시] 개별 삭제 API가 DELETE /notification/{id} 라고 가정
            await apiCall(`/notification/${id}`, 'DELETE');
            console.log(`API: DELETE /notification/${id} 호출`);

            // 성공 시 Optimistic Update
            const deletedNotif = notifications.find(notif => notif.id === id);
            const updatedNotifications = notifications.filter(notif => notif.id !== id);
            setNotifications(updatedNotifications);
            setRevealedId(null);
            setDragOffset({ id: null, offset: 0 });

            // 안 읽은 알림이었다면 카운트 감소
            if (deletedNotif && !deletedNotif.isRead) {
                setUnreadCount(prev => prev - 1);
            }
        } catch (e) {
            console.error("알림 삭제 중 오류:", e);
            alert("알림 삭제 중 오류가 발생했습니다."); // Custom Modal Alert 사용 권장? 
        }
    };

    // ❌ 개별 알림 읽음 처리 (PATCH /notification/read/{notificationId})
    const handleMarkAsRead = async (id) => {
        try {
            await apiCall(`/notification/read/${id}`, 'PATCH');
            console.log(`API: PATCH /notification/read/${id} 호출`);

            // 성공 시 Optimistic Update
            const updatedNotifications = notifications.map(notif => {
                if (notif.id === id && !notif.isRead) {
                    // 안 읽은 상태에서 읽음 처리하는 경우에만 카운트 감소
                    setUnreadCount(prev => Math.max(0, prev - 1));
                    return { ...notif, isRead: true };
                }
                return notif;
            });
            setNotifications(updatedNotifications);
            setRevealedId(null);
            setDragOffset({ id: null, offset: 0 });
        } catch (e) {
            console.error("읽음 처리 중 오류:", e);
            alert("읽음 처리 중 오류가 발생했습니다."); 
        }
    };

    // 렌더링
    return (
        <div className={styles.notificationContainer}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
            onMouseMove={isDragging ? handleMove : null}
            onMouseUp={handleEnd}
            onMouseLeave={isDragging ? handleEnd : null}
        >

            {/* -- 헤더 영역 -- */}
            <div className={styles.notificationHeader}>
                <button 
                    onClick={handleReadAll} 
                    className={`${styles.notificationButton} ${styles.readAllButton}`}
                    disabled={isLoading || unreadCount === 0} // 안 읽은 알림이 0개면 비활성화
                >
                    <span role="img" aria-label="read-all"><NotifyIcon/></span> 전체 읽음처리
                </button>
                <button 
                    onClick={handleDeleteAll} 
                    className={`${styles.notificationButton} ${styles.deleteAllButton}`}
                    disabled={isLoading || notifications.length === 0}
                >
                    <span role="img" aria-label="delete-all"></span> 전체 삭제
                </button>
            </div>

            {/* -- 로딩 / 에러 / 알림 목록 영역 -- */}
            {isLoading && (
                <div className={styles.statusMessage}>알림 목록을 불러오는 중...</div>
            )}

            {error && (
                <div className={`${styles.statusMessage} ${styles.errorMessage}`}>{error}</div>
            )}

            {!isLoading && !error && (
                notifications.length > 0 ? (
                    notifications.map((notif) => {
                        let transformOffset = 0;
                        const isCurrentlyDragging = dragOffset.id === notif.id;

                        if (isCurrentlyDragging) {
                            transformOffset = dragOffset.offset;
                        } else if (revealedId === notif.id) {
                            transformOffset = ACTION_WIDTH;
                        }

                        const transformStyle = {
                            transform: `translateX(-${transformOffset}px)`,
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
                                    // 읽지 않은 알림만 스와이프 가능
                                    onTouchStart={!notif.isRead ? (e) => handleStart(e, notif.id) : undefined}
                                    onMouseDown={!notif.isRead ? (e) => handleStart(e, notif.id) : undefined}
                                    onClick={(e) => {
                                        if (revealedId === notif.id) {
                                            e.stopPropagation();
                                            setRevealedId(null);
                                        } else {
                                            console.log(`알림 ${notif.id} 클릭! 이동: ${notif.targetType}/${notif.targetId}`);
                                        }
                                    }}
                                >
                                    {!notif.isRead && <div className={styles.unreadDot} />} 
                                    <span className={styles.notificationMessage}>{notif.message}</span>
                                    <span className={styles.notificationTime}>{formatTimeForDisplay(notif.time)}</span>
                                </div>

                                {/* 스와이프했을 때 나오는 버튼 부분 (고정된 부분) */}
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
                    <div className={styles.notificationEmpty}>받은 알림이 없습니다.</div>
                )
            )}
        </div>
    );
};


export default NotificationComponent;