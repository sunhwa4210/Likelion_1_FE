import React from "react";
import GoodIcon from "./GoodIcon";


export default function GoodCountIcon  ({
  likes = 0,
  liked = false,
  iconSize = 12,
  activeColor = '#D93D3E', 
  defaultColor = '#797A79',
  textSize = '12px',
  onToggle,
  ...restProps
}) {
  const textColor = liked ? activeColor : defaultColor;

  const handleClick = (e) => {
    e.stopPropagation();
    onToggle?.(e);
  };

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: '4px', position: "relative", zIndex: 90 }}
      type="btton"
      onClick={handleClick}
      {...restProps}
    >
      <GoodIcon
        size={iconSize}
        defaultColor={defaultColor}
        activeColor={activeColor}
        isLiked={liked}
      />
      <span
        style={{ fontSize: textSize, fontWeight: 500, color: textColor }}
      >
        {likes}
      </span>
    </div>
  );
};
