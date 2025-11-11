import React from "react";
import clsx from "clsx";
import "./btn_text_small.css";

export default function BtnTextSmall({
  children,
  appearance = "txt_latest",
  disabled = false,
  fullWidth = false,
  ...rest
}) {
  const renderIcon = () => {
    switch (appearance) {
      case "txt_latest_active":
        return (
          <svg className="bts__icon bts__dot--active" viewBox="0 0 8 8" aria-hidden="true">
            <circle cx="4" cy="4" r="3.5" />
          </svg>
        );
      case "txt_latest":
        return (
          <svg className="bts__icon bts__dot--muted" viewBox="0 0 8 8" aria-hidden="true">
            <circle cx="4" cy="4" r="3.5" fill="currentColor" />
          </svg>
        );
      case "txt_filter":
        return (
          <svg className="bts__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 4h6v6H3V4zm12 0h6v6h-6V4zM3 14h6v6H3v-6zm12 0h6v6h-6v-6z" />
          </svg>
        );
      case "txt_reply":
        return (
          <svg className="bts__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm18.71-11.04a1 1 0 0 0 0-1.41l-2.51-2.5a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 2-1.67z" />
          </svg>
        );
      case "txt_comment":
        return (
          <svg className="bts__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 6h-18v12h4v4l4-4h10z" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={clsx(
        "btnTextSmall",
        `btnTextSmall--${appearance}`,
        fullWidth && "btnTextSmall--full"
      )}
      {...rest}
    >
      {renderIcon()}
      <span className="bts__label">{children}</span>
    </button>
  );
}
