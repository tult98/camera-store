import React from "react";

interface MenuButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title?: string;
  "aria-label"?: string;
}

export const MenuButton = React.memo(
  ({
    onClick,
    active = false,
    disabled = false,
    children,
    title,
    "aria-label": ariaLabel,
  }: MenuButtonProps) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel || title}
      className={`
      p-2 rounded transition-all duration-200
      ${
        active
          ? "bg-violet-100 text-violet-700"
          : "hover:bg-gray-100 text-gray-700"
      }
      ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    `}
    >
      {children}
    </button>
  )
);