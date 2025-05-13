import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = "",
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition ${className}`}
  >
    {children}
  </button>
);
