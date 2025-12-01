import React from "react";

// 기본값 정의
const defaultProps = {
  size: 20,
  defaultColor: "#191919", // 비활성 stroke 색
  activeColor: "#FFBF00",  // 활성 fill 색
  strokeWidth: 2,
};

const BookmarkIcon = ({
  size = defaultProps.size,
  defaultColor = defaultProps.defaultColor,
  activeColor = defaultProps.activeColor,
  strokeWidth = defaultProps.strokeWidth,
  isMarked = false, // 외부에서 전달받는 현재 북마크 상태 (true/false)
  onClick,          // 클릭 이벤트 핸들러 (상태 변경은 부모에서)
  variant = "default", // "default" | "detail"
  ...restProps
}) => {


  const handleClick = (e) => {
    e.stopPropagation(); // 부모 클릭 이벤트로 전파 방지
    onClick?.(e);        // 부모에서 넘겨준 핸들러 호출
  };

  if (variant === "detail") {
    // 미선택: stroke = white, fill = none
    // 선택됨: stroke = activeColor, fill = activeColor
    const pathStroke = isMarked ? activeColor : "#FFFFFF";
    const pathFill = isMarked ? activeColor : "none";

    return (
      <svg
        width="108"
        height="108"
        viewBox="0 0 108 108"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={handleClick}
        {...restProps}
        style={{ cursor: "pointer" }}
      >
        <g filter="url(#filter0_d_134_1550)">
          <rect
            x="14"
            y="14"
            width="80"
            height="80"
            rx="40"
            fill="#39A2A5"
            shapeRendering="crispEdges"
          />
          <path
            d="M63.3332 66L53.9998 59.3333L44.6665 66V44.6667C44.6665 43.9594 44.9475 43.2811 45.4476 42.781C45.9476 42.281 46.6259 42 47.3332 42H60.6665C61.3737 42 62.052 42.281 62.5521 42.781C63.0522 43.2811 63.3332 43.9594 63.3332 44.6667V66Z"
            fill={pathFill}
            stroke={pathStroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_134_1550"
            x="0"
            y="0"
            width="108"
            height="108"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feMorphology
              radius="4"
              operator="dilate"
              in="SourceAlpha"
              result="effect1_dropShadow_134_1550"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.473077 0 0 0 0 0.473077 0 0 0 0 0.473077 0 0 0 0.1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_134_1550"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_134_1550"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    );
  }

  // 기본
  const finalStrokeColor = isMarked ? "none" : defaultColor;
  const finalFillColor = isMarked ? activeColor : "none";
  
  

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      onClick={handleClick}
      {...restProps}
      style={{ position: "relative", zIndex: 90 }}
    >
      <path
        d="M15.8337 17.5L10.0003 13.3333L4.16699 17.5V4.16667C4.16699 3.72464 4.34259 3.30072 4.65515 2.98816C4.96771 2.67559 5.39163 2.5 5.83366 2.5H14.167C14.609 2.5 15.0329 2.67559 15.3455 2.98816C15.6581 3.30072 15.8337 3.72464 15.8337 4.16667V17.5Z"
        stroke={finalStrokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={finalFillColor}
      />
    </svg>
  );
};

BookmarkIcon.displayName = "BookmarkIcon";

export default BookmarkIcon;
