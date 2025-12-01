import React, { useState } from 'react';
import MenuItem from './MenuItem';
import { useNavigate } from 'react-router-dom';
import {useModal} from '../../components/Modal/ModalProvider';
import {presets} from '../../components/Modal/presets';
import styles from './MenuReport.module.css';

// 🔑 수정: 부모 컴포넌트에서 전달받은 onLogout prop을 받습니다.
const MenuReport = ({ onLogout }) => { 
    // 필요한 Hooks 사용
    const { open } = useModal();
    const nav = useNavigate(); 
    
    // ✅ 페이지 이동 함수 ✅
    const navigateTo = (path) => {
        nav(path);
        console.log(`페이지 이동: ${path}`);
    };
    
    // 로그아웃 모달 및 실행 로직
    const handleLogout = async () => {
        // 로그아웃 확인 모달을 엽니다.
        const res = await open(presets.logout()); 

        if (res === 'logout') {
            console.log("로그아웃 실행...");
            
            // 🔑 수정: 부모 컴포넌트(Mypage)에서 전달받은 onLogout 함수를 실행합니다.
            // 이 함수는 AuthContext.jsx의 logout 함수이며, 
            // 토큰 삭제, 상태 초기화, 서버 로그아웃 API 호출 및 /login 리다이렉션을 모두 처리합니다.
            if (typeof onLogout === 'function') {
                await onLogout(); 
            } else {
                // onLogout prop이 전달되지 않았을 경우의 폴백 처리 (선택 사항)
                console.error("onLogout 함수가 MenuReport에 전달되지 않았습니다.");
                nav('/login'); // 안전을 위해 수동으로 이동
            }
        }
    };

    // 일반 메뉴 데이터 정의
    const menuItems = [
        { label: '정보 수정', path: '/mypage/location/modify', action: () => navigateTo('/mypage/location/modify') },
        { label: '내가 스크랩한 큐레이션', path: '/mypage/location/scrap', action: () => navigateTo('/mypage/location/scrap') },
        { label: '내가 작성한 칼럼', path: '/mypage/location/calum', action: () => navigateTo('/mypage/location/calum') },
        { label: '내가 작성한 QnA', path: '/mypage/location/qna', action: () => navigateTo('/mypage/location/qna') },
    ];

    return (
        <div className={styles.reportMenuContainer}>
            {menuItems.map((item) => (
                <MenuItem
                    key={item.label}
                    label={item.label}
                    onClick={item.action}
                    styles={styles}
                />
            ))}
            
            <MenuItem
                label="로그아웃"
                isDestructive={true}
                onClick={handleLogout}
                styles={styles}
            />
        </div>
    );
}

export default MenuReport;