import React from "react";
import clsx from "clsx";
import styles from "./btn_I.module.css";

export default function BtnI({
  children,
  appearance = "default",
  disabled = false,
  fullWidth = true,
  ...rest
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      {...rest}
      className={clsx(
        styles.btnI,
        styles[`btnI__${appearance}`],
        fullWidth && styles.fullWidth
      )}
    >
      {children}
    </button>
  );
}
