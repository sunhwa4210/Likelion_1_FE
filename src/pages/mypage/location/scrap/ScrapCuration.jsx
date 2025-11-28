import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 라우팅
import CurationList from "../../../../components/Curation/CurationList";
import { DUMMY_CURATION_DATA } from "../../../../components/Curation/DummyData";

import Header from "../../../../components/Header/Header";
import Globalheader from "../../../../components/atoms/header/header";
import SearchBar2 from "../../../../components/Bar/SearchBar2";
import {useModal} from "../../../../components/Modal/ModalProvider";
import { presets } from "../../../../components/Modal/presets";


export default function ScrapCuration () {
    const { open } = useModal();
    const navigate = useNavigate();
    
    // 상태 관리: isBookmarked가 true인 항목만 초기 스크랩 목록으로 설정
    const [scrappedCurations, setScrappedCurations] = useState(
        DUMMY_CURATION_DATA.filter(item => item.isBookmarked) 
    );

    // 확인용 코드 추가
    console.log('초기 스크랩 목록:', scrappedCurations);
    
    // 팝업 상태

    // ✅ 상세 페이지 이동 핸들러 (경로 수정 필요!!!)
    const handleItemClick = (curationId) => {
        navigate(`./ScrapCurationDetail/${curationId}`); 
    };

    // 북마크 클릭 (스크랩 취소 시작) 핸들러
    const handleBookmarkClick = async (curationId) => {
        // 팝업 모달 열기
        const res = await open(presets.scrapDelete());

        // 사용자가 '삭제' 버튼을 클릭했을 때 
        if (res === 'delete') {
            console.log(`ID ${curationId} 스크랩 삭제 실행`);
        
            // ✅ 아마 실제 API 호출 필요  
        
            // API 호출 성공 시: 로컬 상태 업데이트
            setScrappedCurations(prev =>
                prev.filter(curation => curation.id !== curationId)
            );
        } else {
            console.log('스크랩 삭제 취소');
        }
    };


    return (
        <div className="app-wrapper">
            <Globalheader />
            <Header title="내가 스크랩한 큐레이션"/>

            <main className="content">
                <SearchBar2 />
                
                {/* 큐레이션 목록과 핸들러 함수를 Props로 전달 */}
                <CurationList
                    curations={scrappedCurations}
                    onItemClick={handleItemClick}
                    onBookmarkClick={handleBookmarkClick}
                />
            </main>

        </div>
    );
}