// 필터 아이콘 컴포넌트
import React from 'react';

// 기본값 정의
const defaultProps = {
    width: 31,
    height: 11,
    iconColor: '#39A2A5',
};

const FilterIcon = ({ 
    onClick, 
    width = defaultProps.width,
    height = defaultProps.height,
    iconColor = defaultProps.iconColor,
    ...restProps 
}) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={width}         // Prop으로 설정
        height={height}       // Prop으로 설정
        viewBox="0 0 31 11" 
        fill="none"
        onClick={onClick}
        {...restProps}
    >
        <path 
            d="M4.80624 1.375H1.44189V4.58334H4.80624V1.375Z" 
            stroke={iconColor} 
            strokeLinecap="round" 
            strokeLinejoin="round" 
        />
        <path 
            d="M10.0934 1.375H6.729V4.58334H10.0934V1.375Z" 
            stroke={iconColor}
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
        <path 
            d="M10.0934 6.4165H6.729V9.62483H10.0934V6.4165Z" 
            stroke={iconColor} 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
        <path 
            d="M4.80624 6.4165H1.44189V9.62483H4.80624V6.4165Z" 
            stroke={iconColor} 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
        <path 
            d="M20.2926 1.68838H21.4519V5.59888H20.2926V1.68838ZM16.0276 5.90413H21.4519V7.96663H17.1782V8.88237H16.0363V7.17462H20.3013V6.74563H16.0276V5.90413ZM16.0363 8.42037H21.6682V9.27838H16.0363V8.42037ZM15.1106 2.14213H19.4275V2.99188H15.1106V2.14213ZM15.0241 5.46688L14.9116 4.59238C15.3788 4.59238 15.8863 4.58963 16.4342 4.58413C16.9821 4.57313 17.5387 4.55388 18.1039 4.52638C18.6749 4.49888 19.217 4.45488 19.7303 4.39438L19.7909 5.16988C19.2603 5.25788 18.7152 5.32113 18.1558 5.35963C17.6021 5.39813 17.0571 5.42563 16.5207 5.44213C15.9844 5.45313 15.4855 5.46138 15.0241 5.46688ZM15.7508 2.52988H16.8495V5.02962H15.7508V2.52988ZM17.6886 2.52988H18.796V5.02962H17.6886V2.52988ZM28.303 1.67188H29.4536V9.33612H28.303V1.67188ZM26.9274 4.36963H28.4414V5.26063H26.9274V4.36963ZM23.0863 6.72913H23.7352C24.1793 6.72913 24.5887 6.72362 24.9636 6.71263C25.3443 6.70162 25.7134 6.68237 26.071 6.65488C26.4286 6.62738 26.7948 6.58887 27.1697 6.53937L27.2821 7.40563C26.8957 7.46613 26.5151 7.51012 26.1402 7.53762C25.7711 7.56512 25.3904 7.58437 24.9982 7.59538C24.606 7.60638 24.185 7.61187 23.7352 7.61187H23.0863V6.72913ZM23.0863 2.31538H26.7977V3.20638H24.2369V7.00137H23.0863V2.31538ZM23.9687 4.44388H26.5295V5.30187H23.9687V4.44388Z" 
            fill={iconColor} 
        />
    </svg>
);

FilterIcon.displayName = 'FilterIcon'; // 컴포넌트 이름 

export default FilterIcon;