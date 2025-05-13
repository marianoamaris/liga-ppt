import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  className?: string;
};

export const Input: React.FC<InputProps> = ({
  label,
  className = "",
  ...props
}) => (
  <div className="flex flex-col mb-4">
    {label && <label className="mb-1 text-white">{label}</label>}
    <input
      className={`px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-white ${className}`}
      {...props}
    />
  </div>
);
