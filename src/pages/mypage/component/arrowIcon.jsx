import React from "react";

const defaultProps = {
    width: 24,
    height: 24,
};


const ArrowIcon = ({
    width = defaultProps.width,
    height = defaultProps.height,
    ...restProps
}) => (

    <svg 
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24" 
        fill="none"
        {...restProps}
    >
    <path d="M9 18L15 12L9 6" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
</svg>


);

export default ArrowIcon;