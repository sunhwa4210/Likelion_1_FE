import React,{useState, useEffect, useMemo} from 'react';
import { categories } from '../Badges/CategoryData';
import CategoryXselector2 from '../Badges/CategoryXselector2';
import styles from './CurationFilter.module.css';

// 🌟 무한 루프 방지를 위한 깊은 비교 함수 (Deep Equality Check)
const deepEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }
  return true;
};

export default function CurationFilter2 ({value, onChange, isOpen, }) {
    // 1. 카테고리 분할 로직 (Categories by ColorKey and Num)
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

    // 🏆 1. 초기 상태 정의
    const [internal, setInternal] = useState(() => ({
        // CurationFilter2가 열릴 때, 부모의 filterValues를 직접 반영
        types: value?.types || [],
       humanities: value?.humanities || [],
        science: value?.science || [],
        tech: value?.tech || [],
        economy: value?.economy || [],
        art: value?.art || [],
        sport: value?.sport || [],
    }));


    // 3. useMemo를 사용하여 부모에게 전달할 nextFilters 객체 생성 최적화
    const nextFilters = useMemo(() => ({
        types: internal.types,
    // 🚨 internal에 더 이상 humanities1/2가 없으므로, 병합 로직을 단순화합니다.
    humanities: internal.humanities || [], 
    science: internal.science || [],
    tech: internal.tech || [],
    economy: internal.economy || [],
    art: internal.art || [],
    sport: internal.sport || [],
    }), [internal]); // internal 상태가 변경될 때만 nextFilters가 새로 생성됨
             
    // 4. 내부 상태 변경 시 외부로 알림 (onChange) - 무한 루프 방지
    useEffect(() => {
        if (!onChange) return;
        onChange(nextFilters);
console.log('3️⃣ CF2 -> 부모에게 전달:', nextFilters);
        console.log("CurationFilter2: onChange 호출됨!"); 
    }, [nextFilters, onChange]); // value 의존성 제거

    // 5. 내부 상태 업데이트 함수
    const updateInternal = (key, selectedLabels) => {
        console.log('2️⃣ CF2 -> 내부 상태 업데이트:', key, selectedLabels);

        setInternal((prev) => ({
            ...prev,
            [key]: selectedLabels,
        }));
    };

    // 6. JSX 렌더링
    return (
        <div className={`${styles.filterBoxWrapper} interest ${isOpen ? styles.isOpen : styles.isClosed}`}>
            <div className={styles.filterBox}>
                <div className={styles.titleBox}>
                    <p>유형</p>
                </div>
                
                <div className={styles.categoryBox}>
                    <CategoryXselector2 
                    categoriesToDisplay={curationType} 
                    removableMode={true}
                    fontSize="8px"
                    selectedLabels={internal.types}
                    onCategoriesChange={(selectedLabels) => 
                    updateInternal('types', selectedLabels)
                    }
                    /> 
                </div> 

            </div>

            <div className={styles.filterBox}>
                <div className={styles.titleBox}>
                    <p>인문사회</p>
                </div>
                
                <div className={styles.categoryBox}>
        <CategoryXselector2
            categoriesToDisplay={humanities1} // ⬅️ 분할된 목록 전달 (레이아웃 목적)
            removableMode={true}
            fontSize="8px"
            selectedLabels={internal.humanities} // ⬅️ 통합된 상태 키 사용
            onCategoriesChange={(selectedLabels) =>
                // 🚨 'humanities1'이 아닌, 통합된 키 'humanities'로 업데이트!
                // CategoryXselector2는 전체 배열을 반환합니다.
                updateInternal('humanities', selectedLabels) 
            }
        />
    </div>
    
    {/* 🟢 두 번째 카테고리 박스 (레이아웃 2) */}
    <div className={styles.categoryBox}>
        <CategoryXselector2
            categoriesToDisplay={humanities2} // ⬅️ 분할된 목록 전달 (레이아웃 목적)
            removableMode={true}
            fontSize="8px"
            selectedLabels={internal.humanities} // ⬅️ 통합된 상태 키 사용
            onCategoriesChange={(selectedLabels) =>
                // 🚨 'humanities2'가 아닌, 통합된 키 'humanities'로 업데이트!
                // 이 이벤트가 발생해도, 결국 전체 배열을 'humanities'에 덮어씁니다.
                updateInternal('humanities', selectedLabels) 
            }
        />
    </div>

            </div>

            <div className={styles.filterBox}>
    <div className={styles.titleBox}><p>자연과학</p></div>
    
    {/* 🟢 자연과학 1열 (science1) */}
    <div className={styles.categoryBox}>
        <CategoryXselector2
            categoriesToDisplay={science1} 
            removableMode={true}
            fontSize="8px"
            selectedLabels={internal.science} 
            onCategoriesChange={(selectedLabels) => updateInternal('science', selectedLabels)}
        />
    </div>
    
    {/* 🟢 자연과학 2열 (science2) */}
    <div className={styles.categoryBox}>
        <CategoryXselector2 
            categoriesToDisplay={science2} 
            removableMode={true}
            fontSize="8px"
            selectedLabels={internal.science} 
            onCategoriesChange={(selectedLabels) => updateInternal('science', selectedLabels)}
        />
    </div>
</div>
            
            <div className={styles.filterBox}>
    <div className={styles.titleBox}><p>공학·기술</p></div>
    
    {/* 🟢 공학·기술 1열 (tech1) */}
    <div className={styles.categoryBox}>
        <CategoryXselector2 
            categoriesToDisplay={tech1} 
            removableMode={true}
            fontSize="8px"
            selectedLabels={internal.tech} 
            onCategoriesChange={(selectedLabels) => updateInternal('tech', selectedLabels)}
        />
    </div>
    
    {/* 🟢 공학·기술 2열 (tech2) */}
    <div className={styles.categoryBox}>
        <CategoryXselector2 
            categoriesToDisplay={tech2} 
            removableMode={true}
            fontSize="8px"
            selectedLabels={internal.tech} 
            onCategoriesChange={(selectedLabels) => updateInternal('tech', selectedLabels)}
        />
    </div>
</div>
            
            <div className={styles.filterBox}>
                <div className={styles.titleBox}>
                    <p>경제·경영</p>
                </div> 
                <div className={styles.categoryBox}>
                    <CategoryXselector2 
                    categoriesToDisplay={economy} 
                    removableMode={true}
                    fontSize="8px"
                    selectedLabels={internal.economy} 
                    onCategoriesChange={(selectedLabels) =>
                        updateInternal('economy', selectedLabels)
                    }
                    /> 
                </div> 
            </div>

            <div className={styles.filterBox}>
    <div className={styles.titleBox}><p>예술·문화</p></div>
    
    {/* 🟢 예술·문화 1열 (art1) */}
    <div className={styles.categoryBox}>
        <CategoryXselector2 
            categoriesToDisplay={art1} 
            removableMode={true}
            fontSize="8px"
            selectedLabels={internal.art} 
            onCategoriesChange={(selectedLabels) => updateInternal('art', selectedLabels)}
        />
    </div>
    
    {/* 🟢 예술·문화 2열 (art2) */}
    <div className={styles.categoryBox}>
        <CategoryXselector2
            categoriesToDisplay={art2} 
            removableMode={true}
            fontSize="8px"
            selectedLabels={internal.art} 
            onCategoriesChange={(selectedLabels) => updateInternal('art', selectedLabels)}
        />
    </div>
</div>

            <div className={styles.filterBox}>
    <div className={styles.titleBox}><p>스포츠·라이프스타일</p></div>
    
    {/* 🟢 스포츠 1열 (sport1) */}
    <div className={styles.categoryBox}>
        <CategoryXselector2 
            categoriesToDisplay={sport1} 
            removableMode={true}
            fontSize="8px"
            selectedLabels={internal.sport} 
            onCategoriesChange={(selectedLabels) => updateInternal('sport', selectedLabels)}
        />
    </div>
    
    {/* 🟢 스포츠 2열 (sport2) */}
    <div className={styles.categoryBox}>
        <CategoryXselector2 
            categoriesToDisplay={sport2} 
            removableMode={true}
            fontSize="8px"
            selectedLabels={internal.sport} 
            onCategoriesChange={(selectedLabels) => updateInternal('sport', selectedLabels)}
        />
    </div>
</div>
            </div>

    );
}