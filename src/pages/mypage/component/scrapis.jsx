import React from "react";

const defaultProps = {
    width: 108,
    height: 108,        
};

const ACTIVE_COLOR = "#FFBF00";
const INACTIVE_COLOR = "white";
const BACKGROUND_COLOR = "#39A2A5";

const Scrapis = ({
    width = defaultProps.width,
    height = defaultProps.height,
    isScrapped = false,
    ...restProps
}) => {
    const bookmarkColor = isScrapped ? ACTIVE_COLOR : INACTIVE_COLOR;
    const bookmarkStyleProps = isScrapped
        ? { fill: bookmarkColor, stroke: 'none' }
        : { fill: 'none', stroke: bookmarkColor, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" };


    return (
    <svg 
        width={width}
        height={height}
        viewBox="0 0 108 108" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        {...restProps} 
    >
    <g filter="url(#filter0_d_788_14629)">
        <rect x="14" y="14" width="80" height="80" rx="40" fill="#39A2A5" shape-rendering="crispEdges"/>
        <path d="M63.3334 66L54.0001 59.3333L44.6667 66V44.6667C44.6667 43.9594 44.9477 43.2811 45.4478 42.781C45.9479 42.281 46.6262 42 47.3334 42H60.6667C61.374 42 62.0523 42.281 62.5524 42.781C63.0525 43.2811 63.3334 43.9594 63.3334 44.6667V66Z" 
            {...bookmarkStyleProps}
    />
    </g>
    <defs>
    <filter id="filter0_d_788_14629" x="0" y="0" width="108" height="108" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feMorphology radius="4" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_788_14629"/>
        <feOffset/>
        <feGaussianBlur stdDeviation="5"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.473077 0 0 0 0 0.473077 0 0 0 0 0.473077 0 0 0 0.1 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_788_14629"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_788_14629" result="shape"/>
    </filter>
    </defs>
    </svg>
    );
};

export default Scrapis;