import React from "react";
import clsx from "clsx";
import "./btn_I.css";

export default function BtnI(
    {children,
    appearance="default",
    disabled= false,
    fullWidth= true,
    ...rest}
){
return(
    <button
    type="button"
    disabled={disabled}
    className={clsx("btnI", `btnI--${appearance}`, fullWidth && "btnI-full")}{...rest}>
    {children}
    </button>
)

}