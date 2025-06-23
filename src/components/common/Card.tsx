import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  onClick,
}) => (
  <div className={`rounded-xl shadow-md p-6 ${className}`} onClick={onClick}>
    {children}
  </div>
);
