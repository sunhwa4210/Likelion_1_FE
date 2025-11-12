// 카테고리 필터 컴포넌트 (큐레이션 페이지를 제외한 모든 페이지의 카테고리 필터는 해당 컴포넌트 사용)
import React from 'react';
import { categories } from './CategoryData';
import CategoryXselector from './CategoryXselector';
import './CategoryFilter.css';

export default function CategoryFilter ({ variant = 'interest' }) {
    const allCategories = categories; // 전체 카테고리를 나열한 경우 필요한 정의 

    const humanitiesGroup = categories.filter((item) => item.colorKey === 'humanities' ); 
    const humanitiesSub   = categories.filter((item) => item.type === 'sub'  && item.colorKey === 'humanities');

    const scienceGroup = categories.filter((item) => item.colorKey === 'science' ); 
    const scienceSub   = categories.filter((item) => item.type === 'sub'  && item.colorKey === 'science');

    const techGroup = categories.filter((item) => item.colorKey === 'tech' ); 
    const techSub   = categories.filter((item) => item.type === 'sub'  && item.colorKey === 'tech');

    const economyGroup = categories.filter((item) => item.colorKey === 'economy' ); 
    const economySub   = categories.filter((item) => item.type === 'sub'  && item.colorKey === 'economy');

    const artGroup = categories.filter((item) => item.colorKey === 'art' ); 
    const artAll   = categories.filter((item) => item.type === 'all' && item.colorKey === 'art');
    const artSub   = categories.filter((item) => item.type === 'sub' && item.colorKey === 'art');

    const sportGroup = categories.filter((item) => item.colorKey === 'sport' ); 
    const sportAll   = categories.filter((item) => item.type === 'all' && item.colorKey === 'sport');
    const sportSub   = categories.filter((item) => item.type === 'sub' && item.colorKey === 'sport');

    const isInterest  = variant === 'interest';
    const isSpecialty = variant === 'specialty';
    const isColumn    = variant === 'column';

    // 'specialty'만 최대 4개 선택 제한을 걸고 싶다면 아래 값이 CategoryXselector에서 사용되도록 구현되어 있어야 함
    const maxSelectable = isSpecialty ? 4 : undefined;

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
                          categoriesToDisplay={humanitiesGroup} 
                          removableMode={false}
                        />
                    ) : (
                        <CategoryXselector 
                          categoriesToDisplay={humanitiesSub} 
                          removableMode={false}
                          {...(maxSelectable ? { maxSelectable } : {})}
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
                          categoriesToDisplay={scienceGroup} 
                          removableMode={false}
                        />
                    ) : (
                        <CategoryXselector 
                          categoriesToDisplay={scienceSub} 
                          removableMode={false}
                          {...(maxSelectable ? { maxSelectable } : {})}
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
                          categoriesToDisplay={techGroup} 
                          removableMode={false}
                        />
                    ) : (
                        <CategoryXselector 
                          categoriesToDisplay={techSub} 
                          removableMode={false}
                          {...(maxSelectable ? { maxSelectable } : {})}
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
                          categoriesToDisplay={economyGroup} 
                          removableMode={false}
                        />
                    ) : (
                        <CategoryXselector 
                          categoriesToDisplay={economySub} 
                          removableMode={false}
                          {...(maxSelectable ? { maxSelectable } : {})}
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
                          categoriesToDisplay={artAll} 
                          removableMode={false}
                        />      
                        <CategoryXselector 
                          categoriesToDisplay={artSub} 
                          removableMode={false}
                        />  
                      </>
                    ) : (
                        <CategoryXselector 
                          categoriesToDisplay={artSub} 
                          removableMode={false}
                          {...(maxSelectable ? { maxSelectable } : {})}
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
                          categoriesToDisplay={sportAll} 
                          removableMode={false}
                        />      
                        <CategoryXselector 
                          categoriesToDisplay={sportSub} 
                          removableMode={false}
                        />  
                      </>
                    ) : (
                        <CategoryXselector 
                          categoriesToDisplay={sportSub} 
                          removableMode={false}
                          {...(maxSelectable ? { maxSelectable } : {})}
                        />  
                    )}
                    </div>      
                                                         
                    </div>
            </div>

    );
}
