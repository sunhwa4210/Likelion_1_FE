import React,{useState, useEffect, useMemo} from 'react';
import { categories } from '../Badges/CategoryData';
import CategoryXselector from '../Badges/CategoryXselector';
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

export default function CurationFilter2 ({value, onChange, isOpen}) {
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

    // 2. 외부 value를 내부 internal 상태로 분할하여 초기화/동기화하는 함수
    const splitLabels = (externalLabels, subset1, subset2) => {
        const labels1 = (externalLabels || []).filter(label => subset1.some(item => item.label === label));
        const labels2 = (externalLabels || []).filter(label => subset2.some(item => item.label === label));
        return { labels1, labels2 };
    };

    // 🏆 1. 초기 상태 정의
    const [internal, setInternal] = useState(() => {
        const h = splitLabels(value?.humanities, humanities1, humanities2);
        const s = splitLabels(value?.science, science1, science2);
        const t = splitLabels(value?.tech, tech1, tech2);
        const a = splitLabels(value?.art, art1, art2);
        const p = splitLabels(value?.sport, sport1, sport2);

        return {
            types: value?.types || [],
            humanities1: h.labels1,
            humanities2: h.labels2,
            science1: s.labels1,
            science2: s.labels2,
            tech1: t.labels1,
            tech2: t.labels2,
            economy: value?.economy || [],
            art1: a.labels1,
            art2: a.labels2,
            sport1: p.labels1,
            sport2: p.labels2,
        };
    });

    // 🏅 2. 외부 value prop이 변경될 때 내부 상태를 동기화하는 로직
    // 무한 루프를 방지하기 위해, 내부 상태가 이미 외부 value와 동일하면 setInternal을 호출하지 않습니다.
    useEffect(() => {
        if (!value) return; 

        // 현재 내부 상태를 부모 컴포넌트 형식으로 재구성 (deepEqual 비교를 위함)
        const currentExternalValue = {
             types: internal.types,
             humanities: [...internal.humanities1, ...internal.humanities2],
             science: [...internal.science1, ...internal.science2],
             tech: [...internal.tech1, ...internal.tech2],
             economy: internal.economy,
             art: [...internal.art1, ...internal.art2],
             sport: [...internal.sport1, ...internal.sport2],
        };

        if (deepEqual(value, currentExternalValue)) {
           return;
        }

        const h = splitLabels(value.humanities, humanities1, humanities2);
        const s = splitLabels(value.science, science1, science2);
        const t = splitLabels(value.tech, tech1, tech2);
        const a = splitLabels(value.art, art1, art2);
        const p = splitLabels(value.sport, sport1, sport2);

        setInternal({
            types: value.types || [],
            humanities1: h.labels1,
            humanities2: h.labels2,
            science1: s.labels1,
            science2: s.labels2,
            tech1: t.labels1,
            tech2: t.labels2,
            economy: value.economy || [],
            art1: a.labels1,
            art2: a.labels2,
            sport1: p.labels1,
            sport2: p.labels2,
        });
    }, [
        value, 
        // splitLabels 함수 내에서 사용되는 모든 의존성 목록
        humanities1, humanities2, science1, science2, tech1, tech2, art1, art2, sport1, sport2,
        // deepEqual을 위해 internal state의 모든 키를 의존성에 포함 (객체 자체 대신 키 배열)
        internal.types, internal.humanities1, internal.humanities2, internal.science1, internal.science2, internal.tech1, internal.tech2, internal.economy, internal.art1, internal.art2, internal.sport1, internal.sport2
    ]); 

    // 3. useMemo를 사용하여 부모에게 전달할 nextFilters 객체 생성 최적화
    const nextFilters = useMemo(() => ({
        types: internal.types,
        humanities: [...(internal.humanities1 || []), ...(internal.humanities2 || [])],
        science: [...(internal.science1 || []), ...(internal.science2 || [])],
        tech: [...(internal.tech1 || []), ...(internal.tech2 || [])],
        economy: internal.economy || [],
        art: [...(internal.art1 || []), ...(internal.art2 || [])],
        sport: [...(internal.sport1 || []), ...(internal.sport2 || [])],
    }), [internal]); // internal 상태가 변경될 때만 nextFilters가 새로 생성됨

    // 4. 내부 상태 변경 시 외부로 알림 (onChange) - 무한 루프 방지
    useEffect(() => {
        if (!onChange || !value) return;

        // 🌟🌟🌟 핵심 무한 루프 방지 로직 🌟🌟🌟
        // 새로운 nextFilters가 현재 부모의 value(이전 필터 상태)와 내용상 동일하면
        // onChange 호출을 건너뛰어 부모의 setFilterValues를 막습니다.
        if (deepEqual(value, nextFilters)) {
            return;
        }

        onChange(nextFilters);
    }, [nextFilters, onChange, value]); // nextFilters와 value를 비교하여 조건적으로 호출

    // 5. 내부 상태 업데이트 함수
    const updateInternal = (key, selectedLabels) => {
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
                    <CategoryXselector 
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
                    <CategoryXselector 
                    categoriesToDisplay={humanities1} 
                    removableMode={true}
                    fontSize="8px"
                    selectedLabels={internal.humanities1} 
                    onCategoriesChange={(selectedLabels) =>
                        updateInternal('humanities1', selectedLabels)
                    }
                    /> 
                </div> 

                <div className={styles.categoryBox}>
                    <CategoryXselector 
                    categoriesToDisplay={humanities2} 
                    removableMode={true}
                    fontSize="8px"
                    selectedLabels={internal.humanities2} 
                    onCategoriesChange={(selectedLabels) =>
                        updateInternal('humanities2', selectedLabels)
                    }
                    /> 
                </div> 

            </div>

            <div className={styles.filterBox}>
                <div className={styles.titleBox}>
                    <p>자연과학</p>
                </div>
                <div className={styles.categoryBox}>
                
                    <CategoryXselector 
                    categoriesToDisplay={science1} 
                    removableMode={true}
                    fontSize="8px"
                    selectedLabels={internal.science1} 
                    onCategoriesChange={(selectedLabels) =>
                        updateInternal('science1', selectedLabels)
                    }
                    /> 
                    <CategoryXselector 
                    categoriesToDisplay={science2} 
                    removableMode={true}
                    fontSize="8px"
                    selectedLabels={internal.science2} 
                    onCategoriesChange={(selectedLabels) =>
                        updateInternal('science2', selectedLabels)
                    }
                    /> 

                </div> 
            </div>
            
            <div className={styles.filterBox}>
                <div className={styles.titleBox}>
                    <p>공학·기술</p>
                </div> 
                <div className={styles.categoryBox}>
                
                    <CategoryXselector 
                    categoriesToDisplay={tech1} 
                    removableMode={true}
                    fontSize="8px"
                    selectedLabels={internal.tech1} 
                    onCategoriesChange={(selectedLabels) =>
                        updateInternal('tech1', selectedLabels)
                    }
                    /> 
                    <CategoryXselector 
                    categoriesToDisplay={tech2} 
                    removableMode={true}
                    fontSize="8px"
                    selectedLabels={internal.tech2} 
                    onCategoriesChange={(selectedLabels) =>
                        updateInternal('tech2', selectedLabels)
                    }
                    /> 
                </div> 
                
            </div>
            
            <div className={styles.filterBox}>
                <div className={styles.titleBox}>
                    <p>경제·경영</p>
                </div> 
                <div className={styles.categoryBox}>
                    <CategoryXselector 
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
                <div className={styles.titleBox}>
                    <p>예술·문화</p>
                </div>
                <div className={styles.categoryBox}>
                    <CategoryXselector 
                    categoriesToDisplay={art1} 
                    removableMode={true}
                    fontSize="8px"
                    selectedLabels={internal.art1} 
                    onCategoriesChange={(selectedLabels) =>
                        updateInternal('art1', selectedLabels)
                    }
                    /> 
                    <CategoryXselector 
                    categoriesToDisplay={art2} 
                    removableMode={true}
                    fontSize="8px"
                    selectedLabels={internal.art2} 
                    onCategoriesChange={(selectedLabels) =>
                        updateInternal('art2', selectedLabels)
                    }
                    /> 
                
                </div> 
            </div>

            <div className={styles.filterBox}>
                <div className={styles.titleBox}>
                    <p>스포츠·라이프스타일</p>
                </div> 
                <div className={styles.categoryBox}>
                    <CategoryXselector 
                    categoriesToDisplay={sport1} 
                    removableMode={true}
                    fontSize="8px"
                    selectedLabels={internal.sport1} 
                    onCategoriesChange={(selectedLabels) =>
                    updateInternal('sport1', selectedLabels)
                        }
                        /> 
                    <CategoryXselector 
                        categoriesToDisplay={sport2} 
                        removableMode={true}
                        fontSize="8px"
                    selectedLabels={internal.sport2} 
                        onCategoriesChange={(selectedLabels) =>
                            updateInternal('sport2', selectedLabels)
                        }
                        /> 
        
                    </div> 
                        
                    </div>
            </div>

    );
}