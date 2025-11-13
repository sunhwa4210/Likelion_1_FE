// 큐레이션 필터 (큐레이션 화면 내의 필터)
import React from 'react';
import { categories } from './CategoryData';
import CategoryXselector from './CategoryXselector';
import './CurationFilter.css';

export default function CurationFilter () {
    const allCategories = categories; // 전체 카테고리를 나열한 경우 필요한 정의 

    const curationType = categories.filter((item) => item.colorKey === 'type' ); 


    const humanities1 = categories.filter((item) => item.colorKey === 'humanities'&& '3'>=item.num ); 
    const humanities2= categories.filter((item) => item.colorKey === 'humanities'&& item.num >='4');

    const science1 = categories.filter((item) => item.colorKey === 'science'&& '3'>=item.num ); 
    const science2= categories.filter((item) => item.colorKey === 'science'&& item.num >='4');

    const tech1 = categories.filter((item) => item.colorKey === 'tech'&& '3'>=item.num ); 
    const tech2 = categories.filter((item) => item.colorKey === 'science'&& item.num >='4');

    const economy = categories.filter((item) => item.colorKey === 'economy' ); 

    const art1 = categories.filter((item) => item.colorKey === 'art'&& '3'>=item.num );
    const art2 = categories.filter((item) => item.colorKey === 'art'&& item.num >='4');

    const sport1 =categories.filter((item) => item.colorKey === 'art'&& '2'>=item.num);
    const sport2 =categories.filter((item) => item.colorKey === 'art'&& item.num >='3');

    return (

            <div className="filterBox-wrapper interest">
              <div className='filter-box'>
                    <div className='title-box'>
                        <p>유형</p>
                    </div>
                    
                    <dix className='category-box'>
                        <CategoryXselector 
                        categoriesToDisplay={curationType} 
                        removableMode={true}S
                        fontSize="8px"
                        />  
                    </dix> 

                </div>

                <div className='filter-box'>
                    <div className='title-box'>
                        <p>인문사회</p>
                    </div>
                    
                    <dix className='category-box'>
                        <CategoryXselector 
                        categoriesToDisplay={humanities1} 
                        removableMode={true}S
                        fontSize="8px"
                        />  
                    </dix> 

                    <dix className='category-box'>
                        <CategoryXselector 
                        categoriesToDisplay={humanities2} 
                        removableMode={true}S
                        fontSize="8px"
                        />  
                    </dix> 

                </div>

                <div className='filter-box'>
                    <div className='title-box'>
                        <p>자연과학</p>
                    </div>
                    <dix className='category-box'>
                    
                        <CategoryXselector 
                        categoriesToDisplay={science1} 
                        removableMode={true}S
                        fontSize="8px"
                        />       
                        <CategoryXselector 
                        categoriesToDisplay={science2} 
                        removableMode={true}S
                        fontSize="8px"
                        />    

                    </dix>                    
                </div>
                
                <div className='filter-box'>
                    <div className='title-box'>
                        <p>공학·기술</p>
                    </div>      
                    <dix className='category-box'>
                    
                        <CategoryXselector 
                        categoriesToDisplay={tech1} 
                        removableMode={true}S
                        fontSize="8px"
                        />      
                        <CategoryXselector 
                        categoriesToDisplay={tech2} 
                        removableMode={true}S
                        fontSize="8px"
                        />      
                    </dix>               
              
                </div>
                
                <div className='filter-box'>
                    <div className='title-box'>
                        <p>경제·경영</p>
                    </div> 
                    <dix className='category-box'>
                        <CategoryXselector 
                        categoriesToDisplay={economy} 
                        removableMode={true}S
                        fontSize="8px"
                        />      
                    </dix>                                            
                </div>

                <div className='filter-box'>
                    <div className='title-box'>
                        <p>예술·문화</p>
                    </div>
                    <dix className='category-box'>
                        <CategoryXselector 
                        categoriesToDisplay={art1} 
                        removableMode={true}S
                        fontSize="8px"
                        />      
                        <CategoryXselector 
                        categoriesToDisplay={art2} 
                        removableMode={true}S
                        fontSize="8px"
                        />  
                
                    </dix>                                                    
                </div>

                <div className='filter-box'>
                    <div className='title-box'>
                        <p>스포츠·라이프스타일</p>
                    </div>     
                    <dix className='category-box'>
                        <CategoryXselector 
                        categoriesToDisplay={sport1} 
                        removableMode={true}S
                        fontSize="8px"
                        />      
                        <CategoryXselector 
                        categoriesToDisplay={sport2} 
                        removableMode={true}
                        fontSize="8px"
                        />  
            
                    </dix>      
                                                         
                    </div>
            </div>

    );
}
