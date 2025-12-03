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
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

// const useNavigate = () => (path) => { console.log(`[라우팅] ${path} 로 이동 시작.`); };

const ACTION_WIDTH = 160; 
const SWIPE_THRESHOLD = 50; 


/*const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        message: "새로운 댓글이 작성되었습니다. 확인하세요.",
        isRead: false, // 안 읽은 알림
        time: new Date(Date.now() - 5 * 60000).toISOString(), // 5분 전
        targetType: "POST", targetId: 101
    },
    {
        id: 2,
        message: "회원님의 글에 좋아요가 달렸습니다.",
        isRead: true, // 읽은 알림
        time: new Date(Date.now() - 30 * 60000).toISOString(), // 30분 전
        targetType: "POST", targetId: 102
    },
    {
        id: 3,
        message: "시스템 알림: 점검 시간이 예정되어 있습니다.",
        isRead: false, // 안 읽은 알림
        time: new Date(Date.now() - 120 * 60000).toISOString(), // 2시간 전
        targetType: "SYSTEM", targetId: 999
    },
];*/


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
    const { accessToken, authLoading } = useAuth();
    const { open } = useModal();
    const navigate = useNavigate();

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

        if (!accessToken) {
            console.warn("인증 토큰 부재. API 호출을 건너뜁니다.");
            // 에러 처리 대신 그냥 리턴하여 토큰이 로드될 때까지 기다릴 수도 있음.
            throw new Error("Authentication token not available.");
        }

        try {
            const options = {
                method,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
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
    }, [accessToken]);
    
    
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
    }, [apiCall, accessToken]);
    
/*
    const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
        // NOTE: API 호출 시뮬레이션
        const data = await apiCall('/notification/me', 'GET');

        if (data && data.length > 0) {
            const transformedData = data.map(transformNotification);
            setNotifications(transformedData);
        } else {
            // 🚨 수정: API에서 데이터가 없거나 로딩 실패 시 Mock 데이터 주입
            console.warn("API에서 받은 알림이 없어 Mock 데이터를 사용합니다.");
            setNotifications(MOCK_NOTIFICATIONS);
            
            // Mock 데이터 기반으로 unreadCount 업데이트
            const unread = MOCK_NOTIFICATIONS.filter(n => !n.isRead).length;
            setUnreadCount(unread);
        }
    } catch (err) {
        setError("알림 목록을 불러오는 데 실패했습니다.");
        
        // 🚨 옵션: 실패 시에도 Mock 데이터를 보여주고 싶다면 아래 주석 해제
        // setNotifications(MOCK_NOTIFICATIONS);
        // setUnreadCount(MOCK_NOTIFICATIONS.filter(n => !n.isRead).length);
    } finally {
        setIsLoading(false);
    }
}, [apiCall, accessToken]);
*/

    // ❌ 안 읽은 알림 개수를 가져오는 함수 (GET /notification/me/count)
const fetchUnreadCount = useCallback(async () => {
    try {
        // 💡 재수정: 서버가 JSON이 아닌 단순 텍스트(예: "9")를 반환하므로,
        // apiCall을 우회하고 fetch를 직접 사용하여 텍스트로 응답을 받습니다.
        const response = await fetch(`${API_BASE_URL}/notification/me/count`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        if (!response.ok) {
            throw new Error(`안 읽은 알림 개수 조회 실패: ${response.status}`);
        }
        
        // 텍스트로 응답을 받은 후 숫자로 변환
        const countText = await response.text();
        const count = parseInt(countText.trim(), 10); // trim()으로 혹시 모를 공백 제거

        if (!isNaN(count)) {
            setUnreadCount(count);
        } else {
            console.error("안 읽은 알림 개수가 유효한 숫자가 아닙니다:", countText);
            setUnreadCount(0);
        }
    } catch (err) {
        console.error("안 읽은 알림 개수 페칭 중 오류 발생:", err);
        setUnreadCount(0);
    }
}, [accessToken]);
    
useEffect(() => {
    // accessToken이 있을 때만 로딩 시작
    if (accessToken) {
        fetchNotifications();
        fetchUnreadCount(); // 🚨 추가: 알림 목록과 별개로 카운트도 호출하여 상태를 업데이트합니다.
    } else if (!authLoading) {
        // 토큰 로딩이 끝났는데도 토큰이 없으면 로딩 종료 및 알림 상태 초기화
        setIsLoading(false); 
        setNotifications([]);
        setUnreadCount(0);
    }
}, [fetchNotifications, fetchUnreadCount, accessToken, authLoading]);


    // ❌ 실시간 알림 수신 (SSE) 로직
    useEffect(() => {
        if (!accessToken) return;

        const sseUrl = `${API_BASE_URL}/notification/subscribe?token=${accessToken}`;
        // NOTE: EventSource는 브라우저에서만 지원되므로, Canvas 환경에서는 콘솔 로그만 남깁니다.
        const eventSource = new EventSource(sseUrl);
        
        console.log("SSE 연결 시도 (실제 브라우저 환경에서 작동):", sseUrl);

        eventSource.onopen = () => { console.log('SSE 연결 성공'); };
        eventSource.addEventListener('notification', (event) => {
            console.log('새 알림 수신:', event.data);
           try {
                 const newNotifData = JSON.parse(event.data);
                 const newNotification = transformNotification(newNotifData);
                
                 setNotifications(prev => [newNotification, ...prev]);
                 if (!newNotification.isRead) {
                     setUnreadCount(prev => prev + 1);
                 }
             } catch (e) {
                 console.error('SSE 수신 데이터 파싱 오류:', e);
             }
         });
        eventSource.onerror = (error) => {
             console.error('SSE 연결 오류:', error);
             eventSource.close();
        };

        return () => {
             console.log('SSE 연결 해제');
             eventSource.close();
        };
    }, [accessToken]); 
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

    const handleNotificationClick = (notif) => {
    // 1. 스와이프 액션이 열려있었다면 닫고 종료
    if (revealedId === notif.id) {
        setRevealedId(null);
        return;
    }
    
    // 2. 안 읽은 알림이라면 읽음 처리 API 호출 및 프론트 상태 업데이트
    if (!notif.isRead) { 
        handleMarkAsRead(notif.id); 
    }

    // 3. 네비게이션 경로 생성: 제공된 응답 형식에 맞춤
    let targetPath = '/';
    switch(notif.targetType) {
        case 'COLUMN':
            // 'COLUMN' 타입은 칼럼 상세 페이지로 이동
            targetPath = `/columnread/${notif.targetId}`; 
            break;
        case 'QUESTION':
            // 'QUESTION' 타입은 QnA 질문 상세 페이지로 이동
            targetPath = `/qnadetail/${notif.targetId}`;
            break;
        case 'ANSWER':
            // 'ANSWER' 타입은 QnA 답글이 달린 질문 상세 페이지로 이동하며,
            // 답글에 초점을 맞추기 위해 쿼리 파라미터를 사용합니다.
            targetPath = `/qnadetail/${notif.targetId}?focus=answer`; 
            break;
        default:
            // 알 수 없는 타입 처리
            console.warn(`알 수 없는 targetType: ${notif.targetType}. 기본 경로로 이동합니다.`);
            targetPath = `/`;
    }

    // 4. 네비게이션 실행
    navigate(targetPath);
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
                    //disabled={isLoading || unreadCount === 0 || !accessToken || authLoading}
                    disabled={false}
                >
                    <span role="img" aria-label="read-all"><NotifyIcon/></span> 전체 읽음처리
                </button>
                <button 
                    onClick={handleDeleteAll} 
                    className={`${styles.notificationButton} ${styles.deleteAllButton}`}
                    //disabled={isLoading || notifications.length === 0 || !accessToken || authLoading}
                    disabled={false}
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
                                    onClick={() => handleNotificationClick(notif)}
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