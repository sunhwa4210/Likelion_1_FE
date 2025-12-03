import React from "react";

const defaultProps = {
    width: 14,
    height: 14,
    iconColor: '#39A2A5' 
};

const CheckIcon = ({
    onClick, 
    width = defaultProps.width,
    height = defaultProps.height,
    iconColor = defaultProps.iconColor,
    ...restProps 
}) => (
    <svg 
        width={width} 
        height={height}
        viewBox="0 0 14 14" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        {...restProps}
    >
        <rect width="14" height="14" rx="7" fill="#39A2A5"/>
        <path 
            d="M9.66683 5L6.00016 8.66667L4.3335 7" 
            stroke="#F7FCF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        />
    </svg>
);

export default CheckIcon;
