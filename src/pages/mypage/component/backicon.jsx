import React from "react";

const defaultProps = {
    width: 108,
    height: 108,
};


const BackIcon = ({
    width = defaultProps.width,
    height = defaultProps.height,
    ...restProps
}) => {
    return (
    <svg 
        width={width} 
        height={height}
        viewBox="0 0 108 108" 
        fill="none"     
        xmlns="http://www.w3.org/2000/svg"
        {...restProps}
    >
    <g filter="url(#filter0_d_1239_21070)">
        <rect x="14" y="14" width="80" height="80" rx="40" fill="white" shape-rendering="crispEdges"/>
        <rect x="14.5" y="14.5" width="79" height="79" rx="39.5" stroke="#39A2A5" shape-rendering="crispEdges"/>
        <path d="M58 62L50 54L58 46" stroke="#39A2A5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <defs>
        <filter id="filter0_d_1239_21070" x="0" y="0" width="108" height="108" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feMorphology radius="4" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_1239_21070"/>
        <feOffset/>
        <feGaussianBlur stdDeviation="5"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.473077 0 0 0 0 0.473077 0 0 0 0 0.473077 0 0 0 0.1 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1239_21070"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1239_21070" result="shape"/>
        </filter>
    </defs>
    </svg>
    );
};

export default BackIcon;