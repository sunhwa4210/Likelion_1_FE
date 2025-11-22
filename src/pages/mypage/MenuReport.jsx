import React, { useState } from 'react';
import MenuItem from './MenuItem';
import { useNavigate } from 'react-router-dom';
import {useModal} from '../../components/Modal/ModalProvider';
import {presets} from '../../components/Modal/presets';
import styles from './MenuReport.module.css';

const MenuReport = () => {
    // 필요한 Hooks 사용
    const { open } = useModal();
    const nav = useNavigate(); 
    
    // ✅ 페이지 이동 함수 << 경로 추가 필요!!!!! >> ✅
    const navigateTo = (path) => {
        nav(path);
        console.log(`페이지 이동: ${path}`);
    };
    
    // 로그아웃 모달 및 실행 로직
    const handleLogout = async () => {
        const res = await open(presets.logout()); 

        if (res === 'logout') {
            console.log("로그아웃 API 호출 및 세션 종료 처리...");
            
            // API 호출 성공 후 페이지 이동
            nav('/login'); // 로그인 페이지로 이동 ✅ << 경로 추가 필요!!!!! >> 
        }
    };

    // 일반 메뉴 데이터 정의
    const menuItems = [
        { label: '정보 수정', path: '/edit/info', action: () => navigateTo('/edit/info') },
        { label: '내가 스크랩한 큐레이션', path: '/my/scrap', action: () => navigateTo('/my/scrap') },
        { label: '내가 작성한 칼럼', path: '/my/column', action: () => navigateTo('/my/column') },
        { label: '내가 작성한 QnA', path: '/my/qna', action: () => navigateTo('/my/qna') },
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