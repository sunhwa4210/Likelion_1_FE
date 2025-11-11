import React from "react";
import clsx from "clsx";
import "./btn_modal.css";

export default function BtnModal({
children,
appearance = "active", 
disabled = false,
fullWidth = true,
...rest
}) {
return (
<button
    type="button"
    disabled={disabled}
    className={clsx("btnModal", `btnModal--${appearance}`, fullWidth && "btnModal--full")}
    {...rest}
    >
    {children}
    </button>
);
}