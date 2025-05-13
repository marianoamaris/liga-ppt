import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`rounded-xl shadow-md p-6 ${className}`}>{children}</div>
);
