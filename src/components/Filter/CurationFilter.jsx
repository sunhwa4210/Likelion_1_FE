// 큐레이션 필터 (큐레이션 화면 내의 필터)
import React,{useState} from 'react';
import { categories } from '../Badges/CategoryData';
import CategoryXselector from '../Badges/CategoryXselector';
import styles from './CurationFilter.module.css';

export default function CurationFilter ({value, onChange, isOpen}) {
    const curationType = categories.filter((item) => item.colorKey === 'type' ); 


    const humanities1 = categories.filter((item) => item.colorKey === 'humanities'&& '3'>=item.num ); 
    const humanities2= categories.filter((item) => item.colorKey === 'humanities'&& item.num >='4');

    const science1 = categories.filter((item) => item.colorKey === 'science'&& '3'>=item.num ); 
    const science2= categories.filter((item) => item.colorKey === 'science'&& item.num >='4');

    const tech1 = categories.filter((item) => item.colorKey === 'tech'&& '3'>=item.num ); 
    const tech2 = categories.filter((item) => item.colorKey === 'tech'&& item.num >='4');

    const economy = categories.filter((item) => item.colorKey === 'economy' ); 

    const art1 = categories.filter((item) => item.colorKey === 'art'&& '3'>=item.num );
    const art2 = categories.filter((item) => item.colorKey === 'art'&& item.num >='4');

    const sport1 =categories.filter((item) => item.colorKey === 'sport'&& '2'>=item.num);
    const sport2 =categories.filter((item) => item.colorKey === 'sport'&& item.num >='3');

    const [internal, setInternal] = useState({
        types: value?.types || [],

        humanities1: [],
        humanities2: [],

        science1: [],
        science2: [],

        tech1: [],
        tech2: [],

        economy: value?.economy || [],

        art1: [],
        art2: [],

        sport1: [],
        sport2: [],
    });

    const buildAndEmit = (nextInternal) => {
        if (!onChange) return;

        const nextFilters = {
            types: nextInternal.types, // 유형

            humanities: [
                ...(nextInternal.humanities1 || []),
                ...(nextInternal.humanities2 || []),
            ],

            science: [
                ...(nextInternal.science1 || []),
                ...(nextInternal.science2 || []),
            ],

            tech: [
                ...(nextInternal.tech1 || []),
                ...(nextInternal.tech2 || []),
            ],

            economy: nextInternal.economy || [],

            art: [
                ...(nextInternal.art1 || []),
                ...(nextInternal.art2 || []),
            ],

            sport: [
                ...(nextInternal.sport1 || []),
                ...(nextInternal.sport2 || []),
            ],
        };

        onChange(nextFilters);
    };

    const updateInternal = (key, selectedLabels) => {
        setInternal((prev) => {
            const next = { ...prev, [key]: selectedLabels };
            buildAndEmit(next);
            return next;
        });
    };
    return (

            <div className={`${styles.filterBoxWrapper} interest ${isOpen ? styles.isOpen : styles.isClosed}`}>
              <div className={styles.filterBox}>
                    <div className={styles.titleBox}>
                        <p>유형</p>
                    </div>
                    
                    <dix className={styles.categoryBox}>
                        <CategoryXselector 
                        categoriesToDisplay={curationType} 
                        removableMode={true}S
                        fontSize="8px"
                        onCategoriesChange={(selectedLabels) => 
                        updateInternal('types', selectedLabels)
                        }
                        />  
                    </dix> 

                </div>

                <div className={styles.filterBox}>
                    <div className={styles.titleBox}>
                        <p>인문사회</p>
                    </div>
                    
                    <dix className={styles.categoryBox}>
                        <CategoryXselector 
                        categoriesToDisplay={humanities1} 
                        removableMode={true}S
                        fontSize="8px"
                        onCategoriesChange={(selectedLabels) =>
                            updateInternal('humanities1', selectedLabels)
                        }
                        />  
                    </dix> 

                    <dix className={styles.categoryBox}>
                        <CategoryXselector 
                        categoriesToDisplay={humanities2} 
                        removableMode={true}S
                        fontSize="8px"
                        onCategoriesChange={(selectedLabels) =>
                            updateInternal('humanities2', selectedLabels)
                        }
                        />  
                    </dix> 

                </div>

                <div className={styles.filterBox}>
                    <div className={styles.titleBox}>
                        <p>자연과학</p>
                    </div>
                    <dix className={styles.categoryBox}>
                    
                        <CategoryXselector 
                        categoriesToDisplay={science1} 
                        removableMode={true}S
                        fontSize="8px"
                        onCategoriesChange={(selectedLabels) =>
                            updateInternal('science1', selectedLabels)
                        }
                        />       
                        <CategoryXselector 
                        categoriesToDisplay={science2} 
                        removableMode={true}S
                        fontSize="8px"
                        onCategoriesChange={(selectedLabels) =>
                            updateInternal('science2', selectedLabels)
                        }
                        />    

                    </dix>                    
                </div>
                
                <div className={styles.filterBox}>
                    <div className={styles.titleBox}>
                        <p>공학·기술</p>
                    </div>      
                    <dix className={styles.categoryBox}>
                    
                        <CategoryXselector 
                        categoriesToDisplay={tech1} 
                        removableMode={true}S
                        fontSize="8px"
                        onCategoriesChange={(selectedLabels) =>
                            updateInternal('tech1', selectedLabels)
                        }
                        />      
                        <CategoryXselector 
                        categoriesToDisplay={tech2} 
                        removableMode={true}S
                        fontSize="8px"
                        onCategoriesChange={(selectedLabels) =>
                            updateInternal('tech2', selectedLabels)
                        }
                        />      
                    </dix>               
              
                </div>
                
                <div className={styles.filterBox}>
                    <div className={styles.titleBox}>
                        <p>경제·경영</p>
                    </div> 
                    <dix className={styles.categoryBox}>
                        <CategoryXselector 
                        categoriesToDisplay={economy} 
                        removableMode={true}S
                        fontSize="8px"
                        onCategoriesChange={(selectedLabels) =>
                            updateInternal('economy', selectedLabels)
                        }
                        />      
                    </dix>                                            
                </div>

                <div className={styles.filterBox}>
                    <div className={styles.titleBox}>
                        <p>예술·문화</p>
                    </div>
                    <dix className={styles.categoryBox}>
                        <CategoryXselector 
                        categoriesToDisplay={art1} 
                        removableMode={true}S
                        fontSize="8px"
                        onCategoriesChange={(selectedLabels) =>
                            updateInternal('art1', selectedLabels)
                        }
                        />      
                        <CategoryXselector 
                        categoriesToDisplay={art2} 
                        removableMode={true}S
                        fontSize="8px"
                        onCategoriesChange={(selectedLabels) =>
                            updateInternal('art2', selectedLabels)
                        }
                        />  
                
                    </dix>                                                    
                </div>

                <div className={styles.filterBox}>
                    <div className={styles.titleBox}>
                        <p>스포츠·라이프스타일</p>
                    </div>     
                    <div className={styles.categoryBox}>
                        <CategoryXselector 
                        categoriesToDisplay={sport1} 
                        removableMode={true}S
                        fontSize="8px"
                        onCategoriesChange={(selectedLabels) =>
                            updateInternal('sport1', selectedLabels)
                        }
                        />      
                        <CategoryXselector 
                        categoriesToDisplay={sport2} 
                        removableMode={true}
                        fontSize="8px"
                        onCategoriesChange={(selectedLabels) =>
                            updateInternal('sport2', selectedLabels)
                        }
                        />  
            
                    </div>      
                                                         
                    </div>
            </div>

    );
}
