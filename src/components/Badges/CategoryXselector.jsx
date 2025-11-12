// <-- 버튼 클릭했을 때 'x'표시가 있는 버튼입니다 --> 

import React, { useState } from 'react';
import CategoryButton from './CategoryButton';
import { COLOR_THEMES } from './CategoryData';

const CategoryXselector = ({ categoriesToDisplay, removableMode }) => { 
    
    const [selectedCategories, setSelectedCategories] = useState([]); 

    const handleCategoryClick = (clickedLabel) => {
        const isSelected = selectedCategories.includes(clickedLabel);

        let newSelectedCategories;

        if (isSelected) {
            newSelectedCategories = selectedCategories.filter(
                (label) => label !== clickedLabel
            );
        } else {
            newSelectedCategories = [...selectedCategories, clickedLabel];
        }

        setSelectedCategories(newSelectedCategories);
    };

    return (
        <div style={{display:'flex', gap:'6px'}}>
          {categoriesToDisplay.map((item) => (
            <CategoryButton
              key={item.label}
              label={item.label}
              isSelected={selectedCategories.includes(item.label)}
              onClick={() => handleCategoryClick(item.label)}
              activeTheme={COLOR_THEMES[item.colorKey]} 

              // !상위 컴포넌트에서 받은 removableMode 값이 추가됨
              displayMode={removableMode ? "removable" : "default"} 
            />
          ))}
        </div>
    );
};

export default CategoryXselector;