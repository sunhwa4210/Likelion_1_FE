import React from "react";
import clsx from "clsx";
import "./btn_text.css";

export default function Button({
children,
appearance = "activated", 
disabled = false,
fullWidth = true,
...rest
}) {
return (
<button
    type="button"
    disabled={disabled}
    className={clsx("btn", `btn--${appearance}`, fullWidth && "btn--full")}
    {...rest}
    >
    {children}
    </button>
);
}
