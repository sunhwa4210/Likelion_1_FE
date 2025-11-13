// 카테고리 필터 컴포넌트 (큐레이션 페이지를 제외한 모든 페이지의 카테고리 필터는 해당 컴포넌트 사용)
import React from 'react';
import { useState } from 'react';
import { categories } from '../Badges/CategoryData';
import CategoryXselector from '../Badges/CategoryXselector';
import './CategoryFilter.css';

export default function CategoryFilter ({ variant = 'interest' }) {


    const humanitiesGroup = categories.filter((item) => item.colorKey === 'humanities' ); 
    const humanitiesSub   = categories.filter((item) => item.type === 'sub'  && item.colorKey === 'humanities');

    const scienceGroup = categories.filter((item) => item.colorKey === 'science' ); 
    const scienceSub   = categories.filter((item) => item.type === 'sub'  && item.colorKey === 'science');

    const techGroup = categories.filter((item) => item.colorKey === 'tech' ); 
    const techSub   = categories.filter((item) => item.type === 'sub'  && item.colorKey === 'tech');

    const economyGroup = categories.filter((item) => item.colorKey === 'economy' ); 
    const economySub   = categories.filter((item) => item.type === 'sub'  && item.colorKey === 'economy');

    const artAll   = categories.filter((item) => item.type === 'all' && item.colorKey === 'art');
    const artSub   = categories.filter((item) => item.type === 'sub' && item.colorKey === 'art');

    const sportAll   = categories.filter((item) => item.type === 'all' && item.colorKey === 'sport');
    const sportSub   = categories.filter((item) => item.type === 'sub' && item.colorKey === 'sport');

    const isInterest  = variant === 'interest';
    const isSpecialty = variant === 'specialty';
    const isColumn    = variant === 'column';


    // 'specialty'만 최대 4개 선택 제한
   const MAX_SELECTABLE = 4;    
   
    // 그룹별 선택 상태(오직 specialty일 때만 사용)
    const [selectedHumanities, setSelectedHumanities] = useState([]);
    const [selectedScience, setSelectedScience]       = useState([]);
    const [selectedTech, setSelectedTech]             = useState([]);
    const [selectedEconomy, setSelectedEconomy]       = useState([]);
    const [selectedArt, setSelectedArt]               = useState([]);
    const [selectedSport, setSelectedSport]           = useState([]);

    // 전체 CategoryXselector를 한 번에 리셋하기 위한 key (변경되면 리마운트됨)
    const [resetKey, setResetKey] = useState(0);

    // 5개째 선택 시 토스트 표시 여부
    const [showMaxToast, setShowMaxToast] = useState(false);

    // 전체 선택 개수 계산
    const getTotalSelectedCount = () => (
        selectedHumanities.length +
        selectedScience.length +
        selectedTech.length +
        selectedEconomy.length +
        selectedArt.length +
        selectedSport.length
    );

    // 전체 선택 상태 초기화 + 토스트 표시
    const triggerMaxSelected = () => {
        // 모든 선택 상태 비우기
        setSelectedHumanities([]);
        setSelectedScience([]);
        setSelectedTech([]);
        setSelectedEconomy([]);
        setSelectedArt([]);
        setSelectedSport([]);

        // CategoryXselector 내부 state 리셋 (key 변경 → 리마운트)
        setResetKey(prev => prev + 1);

        // 토스트 3초 표시
        setShowMaxToast(true);
        setTimeout(() => setShowMaxToast(false), 3000);
    };

    // 그룹별 onCategoriesChange 핸들러들
    const handleHumanitiesChange = (newSelected) => {
        if (!isSpecialty) {
            setSelectedHumanities(newSelected);
            return;
        }

        const prevTotal = getTotalSelectedCount();
        const newTotal =
            newSelected.length +
            selectedScience.length +
            selectedTech.length +
            selectedEconomy.length +
            selectedArt.length +
            selectedSport.length;

        if (prevTotal <= MAX_SELECTABLE && newTotal > MAX_SELECTABLE) {
            // 5개째 되는 순간
            triggerMaxSelected();
        } else {
            setSelectedHumanities(newSelected);
        }
    };

    const handleScienceChange = (newSelected) => {
        if (!isSpecialty) {
            setSelectedScience(newSelected);
            return;
        }

        const prevTotal = getTotalSelectedCount();
        const newTotal =
            selectedHumanities.length +
            newSelected.length +
            selectedTech.length +
            selectedEconomy.length +
            selectedArt.length +
            selectedSport.length;

        if (prevTotal <= MAX_SELECTABLE && newTotal > MAX_SELECTABLE) {
            triggerMaxSelected();
        } else {
            setSelectedScience(newSelected);
        }
    };

    const handleTechChange = (newSelected) => {
        if (!isSpecialty) {
            setSelectedTech(newSelected);
            return;
        }

        const prevTotal = getTotalSelectedCount();
        const newTotal =
            selectedHumanities.length +
            selectedScience.length +
            newSelected.length +
            selectedEconomy.length +
            selectedArt.length +
            selectedSport.length;

        if (prevTotal <= MAX_SELECTABLE && newTotal > MAX_SELECTABLE) {
            triggerMaxSelected();
        } else {
            setSelectedTech(newSelected);
        }
    };

    const handleEconomyChange = (newSelected) => {
        if (!isSpecialty) {
            setSelectedEconomy(newSelected);
            return;
        }

        const prevTotal = getTotalSelectedCount();
        const newTotal =
            selectedHumanities.length +
            selectedScience.length +
            selectedTech.length +
            newSelected.length +
            selectedArt.length +
            selectedSport.length;

        if (prevTotal <= MAX_SELECTABLE && newTotal > MAX_SELECTABLE) {
            triggerMaxSelected();
        } else {
            setSelectedEconomy(newSelected);
        }
    };

    const handleArtChange = (newSelected) => {
        if (!isSpecialty) {
            setSelectedArt(newSelected);
            return;
        }

        const prevTotal = getTotalSelectedCount();
        const newTotal =
            selectedHumanities.length +
            selectedScience.length +
            selectedTech.length +
            selectedEconomy.length +
            newSelected.length +
            selectedSport.length;

        if (prevTotal <= MAX_SELECTABLE && newTotal > MAX_SELECTABLE) {
            triggerMaxSelected();
        } else {
            setSelectedArt(newSelected);
        }
    };

    const handleSportChange = (newSelected) => {
        if (!isSpecialty) {
            setSelectedSport(newSelected);
            return;
        }

        const prevTotal = getTotalSelectedCount();
        const newTotal =
            selectedHumanities.length +
            selectedScience.length +
            selectedTech.length +
            selectedEconomy.length +
            selectedArt.length +
            newSelected.length;

        if (prevTotal <= MAX_SELECTABLE && newTotal > MAX_SELECTABLE) {
            triggerMaxSelected();
        } else {
            setSelectedSport(newSelected);
        }
    };
    return (
        /* 세 가지 버전으로 구현  CategoryFilter 컴포넌트 사용시 props로 버전 결정
            1. 온보딩_관심분야 선택 (props: interest) /선택 개수 제한 X
            2. 온보딩_전문분야 선택 (props: specialty) /최대 4개 선택 가능 (4개이상 선택 시 toast notification)
            3. 칼럼 작성・수정 분야 선택 (props: column) /선택 개수 제한 X
            2번과 3번의 경우 같은 버전을 렌더링함 
            3번은 margin_top: -8px; 추가하여 사용 권장

            큐레이션 필터는 css와 렌더링 방식이 많이 달라서 그냥 아예 다른 컴포넌트로 뺐어요 (CurationFilter)
         */
<div className={`c-filterBox-wrapper ${variant}`}>

            <div className='c-filter-box'>
                <div className='c-title-box'>
                    <p>인문사회</p>
                </div>
                <div className='c-category-box'>
                    {isInterest ? (
                        <CategoryXselector 
                            key={`humanities-interest-${resetKey}`}
                            categoriesToDisplay={humanitiesGroup} 
                            removableMode={false}
                        />
                    ) : (
                        <CategoryXselector 
                            key={`humanities-specialty-${resetKey}`}
                            categoriesToDisplay={humanitiesSub} 
                            removableMode={false}
                            onCategoriesChange={handleHumanitiesChange}
                        />
                    )}
                </div> 
            </div>

            <div className='c-filter-box'>
                <div className='c-title-box'>
                    <p>자연과학</p>
                </div>
                <div className='c-category-box'>
                    {isInterest ? (
                        <CategoryXselector 
                            key={`science-interest-${resetKey}`}
                            categoriesToDisplay={scienceGroup} 
                            removableMode={false}
                        />
                    ) : (
                        <CategoryXselector 
                            key={`science-specialty-${resetKey}`}
                            categoriesToDisplay={scienceSub} 
                            removableMode={false}
                            onCategoriesChange={handleScienceChange}
                        />
                    )}
                </div>                    
            </div>
            
            <div className='c-filter-box'>
                <div className='c-title-box'>
                    <p>공학·기술</p>
                </div>      
                <div className='c-category-box'>
                    {isInterest ? (
                        <CategoryXselector 
                            key={`tech-interest-${resetKey}`}
                            categoriesToDisplay={techGroup} 
                            removableMode={false}
                        />
                    ) : (
                        <CategoryXselector 
                            key={`tech-specialty-${resetKey}`}
                            categoriesToDisplay={techSub} 
                            removableMode={false}
                            onCategoriesChange={handleTechChange}
                        />
                    )}
                </div>               
            </div>
            
            <div className='c-filter-box'>
                <div className='c-title-box'>
                    <p>경제·경영</p>
                </div> 
                <div className='c-category-box'>
                    {isInterest ? (
                        <CategoryXselector 
                            key={`economy-interest-${resetKey}`}
                            categoriesToDisplay={economyGroup} 
                            removableMode={false}
                        />
                    ) : (
                        <CategoryXselector 
                            key={`economy-specialty-${resetKey}`}
                            categoriesToDisplay={economySub} 
                            removableMode={false}
                            onCategoriesChange={handleEconomyChange}
                        />
                    )}
                </div>                                            
            </div>

            <div className='c-filter-box'>
                <div className='c-title-box'>
                    <p>예술·문화</p>
                </div>
                <div className='c-category-box'>
                    {isInterest ? (
                        <>
                            <CategoryXselector 
                                key={`art-all-interest-${resetKey}`}
                                categoriesToDisplay={artAll} 
                                removableMode={false}
                            />      
                            <CategoryXselector 
                                key={`art-sub-interest-${resetKey}`}
                                categoriesToDisplay={artSub} 
                                removableMode={false}
                            />  
                        </>
                    ) : (
                        <CategoryXselector 
                            key={`art-specialty-${resetKey}`}
                            categoriesToDisplay={artSub} 
                            removableMode={false}
                            onCategoriesChange={handleArtChange}
                        />  
                    )}
                </div>                                                    
            </div>

            <div className='c-filter-box'>
                <div className='c-title-box'>
                    <p>스포츠·라이프스타일</p>
                </div>     
                <div className='c-category-box'>
                    {isInterest ? (
                        <>
                            <CategoryXselector 
                                key={`sport-all-interest-${resetKey}`}
                                categoriesToDisplay={sportAll} 
                                removableMode={false}
                            />      
                            <CategoryXselector 
                                key={`sport-sub-interest-${resetKey}`}
                                categoriesToDisplay={sportSub} 
                                removableMode={false}
                            />  
                        </>
                    ) : (
                        <CategoryXselector 
                            key={`sport-specialty-${resetKey}`}
                            categoriesToDisplay={sportSub} 
                            removableMode={false}
                            onCategoriesChange={handleSportChange}
                        />  
                    )}
                </div>      
            </div>

            {/* specialty일 때만, 전체 선택 5개째에서 토스트 노출 */}
            {isSpecialty && showMaxToast && (
                <div className="toast-specialty-limit">
                    전문 분야는 최소 3개부터 최대 4개까지 선택할 수 있어요
                </div>
            )}
        </div>
    );

};

