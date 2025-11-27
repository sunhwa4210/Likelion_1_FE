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
  ...restProps
}) => {
  // isMarked 값에 따라 stroke/fill 색을 결정
  const finalStrokeColor = isMarked ? "none" : defaultColor;
  const finalFillColor = isMarked ? activeColor : "none";

  const handleClick = (e) => {
    e.stopPropagation(); // 부모 클릭 이벤트로 전파 방지
    onClick?.(e);        // 부모에서 넘겨준 핸들러 호출
  };

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
