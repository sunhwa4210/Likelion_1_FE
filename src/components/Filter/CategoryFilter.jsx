import React, { useState,useEffect } from 'react';
import { categories } from '../Badges/CategoryData';
import CategoryXselector from '../Badges/CategoryXselector';
import styles from './CategoryFilter.module.css';

export default function CategoryFilter ({ variant = 'interest', onChange }) {


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

    const MAX_SELECTABLE = 4;    
   
    const [selectedHumanities, setSelectedHumanities] = useState([]);
    const [selectedScience, setSelectedScience]       = useState([]);
    const [selectedTech, setSelectedTech]             = useState([]);
    const [selectedEconomy, setSelectedEconomy]       = useState([]);
    const [selectedArt, setSelectedArt]               = useState([]);
    const [selectedSport, setSelectedSport]           = useState([]);

    const [resetKey, setResetKey] = useState(0);

    const [showMaxToast, setShowMaxToast] = useState(false);

    const getTotalSelectedCount = () => (
        selectedHumanities.length +
        selectedScience.length +
        selectedTech.length +
        selectedEconomy.length +
        selectedArt.length +
        selectedSport.length
    );

    useEffect(() => {
        if (!onChange) return;

        const allSelected = [
        ...selectedHumanities,
        ...selectedScience,
        ...selectedTech,
        ...selectedEconomy,
        ...selectedArt,
        ...selectedSport,
        ];

        onChange({
        selectedList: allSelected,
        selectedCount: allSelected.length,
        });
    }, [
        selectedHumanities,
        selectedScience,
        selectedTech,
        selectedEconomy,
        selectedArt,
        selectedSport,
    ]);

   

    const triggerMaxSelected = () => {
        setSelectedHumanities([]);
        setSelectedScience([]);
        setSelectedTech([]);
        setSelectedEconomy([]);
        setSelectedArt([]);
        setSelectedSport([]);

        setResetKey(prev => prev + 1);

        setShowMaxToast(true);
        setTimeout(() => setShowMaxToast(false), 3000);
    };

    
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
<div className={`${styles.cFilterBoxWrapper} ${variant}`}>

            <div className={styles.cFilterBox}>
                <div className={styles.cTitleBox}>
                    <p>인문사회</p>
                </div>
                <div className={styles.cCategoryBox}>
                    {isInterest ? (
                        <CategoryXselector 
                            key={`humanities-interest-${resetKey}`}
                            categoriesToDisplay={humanitiesGroup} 
                            removableMode={false}
                            onCategoriesChange={handleHumanitiesChange}
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

            <div className={styles.cFilterBox}>
                <div className={styles.cTitleBox}>
                    <p>자연과학</p>
                </div>
                <div className={styles.cCategoryBox}>
                    {isInterest ? (
                        <CategoryXselector 
                            key={`science-interest-${resetKey}`}
                            categoriesToDisplay={scienceGroup} 
                            removableMode={false}
                            onCategoriesChange={handleScienceChange}
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
            
            <div className={styles.cFilterBox}>
                <div className={styles.cTitleBox}>
                    <p>공학·기술</p>
                </div>      
                <div className={styles.cCategoryBox}>
                    {isInterest ? (
                        <CategoryXselector 
                            key={`tech-interest-${resetKey}`}
                            categoriesToDisplay={techGroup} 
                            removableMode={false}
                            onCategoriesChange={handleTechChange}
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
            
            <div className={styles.cFilterBox}>
                <div className={styles.cTitleBox}>
                    <p>경제·경영</p>
                </div> 
                <div className={styles.cCategoryBox}>
                    {isInterest ? (
                        <CategoryXselector 
                            key={`economy-interest-${resetKey}`}
                            categoriesToDisplay={economyGroup} 
                            removableMode={false}
                            onCategoriesChange={handleEconomyChange}
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

            <div className={styles.cFilterBox}>
                <div className={styles.cTitleBox}>
                    <p>예술·문화</p>
                </div>
                <div className={styles.cCategoryBox}>
                    {isInterest ? (
                        <>
                            <CategoryXselector 
                                key={`art-all-interest-${resetKey}`}
                                categoriesToDisplay={artAll} 
                                removableMode={false}
                                onCategoriesChange={handleArtChange}
                            />      
                            <CategoryXselector 
                                key={`art-sub-interest-${resetKey}`}
                                categoriesToDisplay={artSub} 
                                removableMode={false}
                                onCategoriesChange={handleArtChange}
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

            <div className={styles.cFilterBox}>
                <div className={styles.cTitleBox}>
                    <p>스포츠·라이프스타일</p>
                </div>     
                <div className={styles.cCategoryBox}>
                    {isInterest ? (
                        <>
                            <CategoryXselector 
                                key={`sport-all-interest-${resetKey}`}
                                categoriesToDisplay={sportAll} 
                                removableMode={false}
                                onCategoriesChange={handleSportChange}
                            />      
                            <CategoryXselector 
                                key={`sport-sub-interest-${resetKey}`}
                                categoriesToDisplay={sportSub} 
                                removableMode={false}
                                onCategoriesChange={handleSportChange}
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

            {isSpecialty && showMaxToast && (
              <div className={styles.toastWrapper}> 
                <div className={styles.toast}>
                    <p>전문분야는<br/>최대 4개까지<br/>선택할 수 있어요</p>
                </div>
              </div>
            )}
        </div>
    );

};
